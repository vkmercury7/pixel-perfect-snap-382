import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PINPAY_URL = "https://api.usepinpay.com/functions/v1/api-v1/pix";
const ALLOWED_AMOUNTS = [1000, 2000, 3000, 4000, 5000, 10000, 20000, 50000, 100000] as const;

const depositInput = z.object({
  amountCents: z.number().int().refine(
    (value) => ALLOWED_AMOUNTS.some((amount) => amount === value),
    "Valor de depósito não permitido.",
  ),
});

const pinPayResponse = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  pix: z.object({
    qr_code: z.string().min(1),
    qr_code_url: z.string().nullable().optional(),
    expires_at: z.string().min(1),
  }),
  amount: z.number().optional(),
  request_id: z.string().optional(),
});

export interface CreatedPixCharge {
  transactionId: string;
  qrCode: string;
  qrCodeUrl: string;
  expiresAt: string;
  amountCents: number;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function safeRequestId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const value = (payload as Record<string, unknown>)["request_id"];
  return typeof value === "string" ? value.slice(0, 160) : undefined;
}

function safeProviderError(payload: unknown) {
  if (!payload || typeof payload !== "object") return undefined;
  const error = (payload as Record<string, unknown>)["error"];
  if (!error || typeof error !== "object") return undefined;
  const record = error as Record<string, unknown>;
  return {
    code: typeof record["code"] === "string" ? record["code"].slice(0, 80) : undefined,
    message: typeof record["message"] === "string" ? record["message"].slice(0, 240) : undefined,
  };
}

export const createPixDeposit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => depositInput.parse(input))
  .handler(async ({ data, context }): Promise<CreatedPixCharge> => {
    const pinPayToken = process.env["PINPAY_TOKEN"];
    if (!pinPayToken) {
      console.error("[PinPay] PINPAY_TOKEN is not configured");
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    const { data: profile, error: profileError } = await context.supabase
      .from("profiles")
      .select("public_id, cpf, phone")
      .eq("user_id", context.userId)
      .single();

    const email = typeof context.claims.email === "string" ? context.claims.email : "";
    const cpf = digitsOnly(profile?.cpf ?? "");
    const phone = digitsOnly(profile?.phone ?? "");
    if (profileError || !email || cpf.length !== 11 || (phone.length !== 12 && phone.length !== 13)) {
      console.error("[PinPay] Authenticated customer profile is incomplete", {
        userId: context.userId,
        profileCode: profileError?.code,
      });
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("wallet_transactions")
      .insert({
        user_id: context.userId,
        type: "deposit",
        amount_cents: data.amountCents,
        status: "pending",
      })
      .select("id")
      .single();

    if (transactionError || !transaction) {
      console.error("[PinPay] Could not create pending transaction", {
        userId: context.userId,
        code: transactionError?.code,
      });
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let response: Response;
    let responsePayload: unknown = null;

    try {
      response = await fetch(PINPAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinPayToken}`,
          "Content-Type": "application/json",
          "Idempotency-Key": transaction.id,
        },
        body: JSON.stringify({
          amount: data.amountCents,
          description: "Depósito NOX",
          expiration: 1200,
          customer: {
            name: `Cliente ${profile.public_id}`,
            email,
            phone,
            document: { type: "cpf", number: cpf },
          },
          metadata: {
            external_reference: transaction.id,
            checkout_url: "https://noxcassino.netlify.app/",
            wallet_transaction_id: transaction.id,
            user_id: context.userId,
          },
        }),
        signal: controller.signal,
      });
      responsePayload = await response.json().catch(() => null);
    } catch (error) {
      console.error("[PinPay] Charge request failed", {
        transactionId: transaction.id,
        reason: error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error",
      });
      await supabaseAdmin.from("wallet_transactions").update({ status: "canceled" }).eq("id", transaction.id);
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    } finally {
      clearTimeout(timeout);
    }

    if (response.status !== 201) {
      console.error("[PinPay] Charge rejected", {
        transactionId: transaction.id,
        status: response.status,
        requestId: safeRequestId(responsePayload),
        providerError: safeProviderError(responsePayload),
      });
      await supabaseAdmin.from("wallet_transactions").update({ status: "canceled" }).eq("id", transaction.id);
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    const parsed = pinPayResponse.safeParse(
      responsePayload && typeof responsePayload === "object" && "data" in responsePayload
        ? (responsePayload as { data: unknown }).data
        : responsePayload,
    );
    if (!parsed.success) {
      console.error("[PinPay] Invalid success response", {
        transactionId: transaction.id,
        requestId: safeRequestId(responsePayload),
      });
      await supabaseAdmin.from("wallet_transactions").update({ status: "canceled" }).eq("id", transaction.id);
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    const { error: updateError } = await supabaseAdmin
      .from("wallet_transactions")
      .update({ external_id: parsed.data.id })
      .eq("id", transaction.id)
      .eq("status", "pending");
    if (updateError) {
      console.error("[PinPay] Could not link external charge", {
        transactionId: transaction.id,
        code: updateError.code,
      });
      throw new Error("Não foi possível gerar o PIX. Tente novamente.");
    }

    return {
      transactionId: transaction.id,
      qrCode: parsed.data.pix.qr_code,
      qrCodeUrl: parsed.data.pix.qr_code_url ?? "",
      expiresAt: parsed.data.pix.expires_at,
      amountCents: data.amountCents,
    };
  });