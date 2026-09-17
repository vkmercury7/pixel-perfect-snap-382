import { useEffect, useMemo, useState } from "react";
import { Check, Copy, LoaderCircle, QrCode } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createPixDeposit, type CreatedPixCharge } from "@/lib/deposit.functions";
import { formatBRL } from "@/lib/money";
import { useWallet } from "@/lib/wallet";

const QUICK_VALUES = [1000, 2000, 3000, 4000, 5000, 10000, 20000, 50000, 100000];

export function DepositModal() {
  const { modal, closeModal, refresh } = useWallet();
  const createDeposit = useServerFn(createPixDeposit);
  const open = modal === "deposit";
  const [selectedCents, setSelectedCents] = useState<number | null>(null);
  const [step, setStep] = useState<"amount" | "pix">("amount");
  const [charge, setCharge] = useState<CreatedPixCharge | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (open) {
      setSelectedCents(null);
      setStep("amount");
      setCharge(null);
      setCreating(false);
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!charge) return;
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [charge]);

  const cents = selectedCents ?? 0;
  const remainingSeconds = useMemo(() => {
    if (!charge) return 0;
    const expiresAt = new Date(charge.expiresAt).getTime();
    if (!Number.isFinite(expiresAt)) return 0;
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  }, [charge, now]);
  const countdown = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  const handleContinue = async () => {
    if (selectedCents === null || creating) return;
    setCreating(true);
    try {
      const result = await createDeposit({ data: { amountCents: selectedCents } });
      setCharge(result);
      setStep("pix");
      await refresh();
    } catch {
      toast.error("Não foi possível gerar o PIX. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!charge) return;
    try {
      await navigator.clipboard.writeText(charge.qrCode);
      setCopied(true);
      toast.success("PIX copiado!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o PIX.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeModal()}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card">
        {step === "amount" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold uppercase tracking-wide">Depositar</DialogTitle>
              <DialogDescription className="text-xs">Escolha o valor do depósito</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2">
              {QUICK_VALUES.map((quick) => {
                const active = cents === quick;
                return (
                  <Button
                    key={quick}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedCents(quick)}
                    className={`h-auto rounded-xl py-2.5 text-xs font-bold ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-surface text-foreground hover:bg-accent"
                    }`}
                  >
                    {formatBRL(quick).replace(",00", "")}
                  </Button>
                );
              })}
            </div>

            <Button
              type="button"
              disabled={selectedCents === null || creating}
              onClick={() => void handleContinue()}
              className="mt-1 h-auto w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide shadow-glow"
            >
              {creating ? <><LoaderCircle className="animate-spin" /> Gerando PIX...</> : "Continuar"}
            </Button>
            <p className="text-center text-[0.65rem] text-muted-foreground">
              Após o pagamento o valor será creditado automaticamente em sua conta.
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold uppercase tracking-wide">PIX gerado</DialogTitle>
              <DialogDescription className="text-xs">Escaneie o QR Code ou copie o código PIX.</DialogDescription>
            </DialogHeader>

            <div className="surface-panel flex flex-col items-center gap-3 rounded-2xl p-4 text-center">
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="text-2xl font-extrabold">{formatBRL(charge?.amountCents ?? cents)}</p>
              {charge?.qrCodeUrl ? (
                <div className="flex size-48 items-center justify-center overflow-hidden rounded-lg bg-foreground p-2">
                  <img src={charge.qrCodeUrl} alt="QR Code PIX" className="block h-full w-full object-contain" />
                </div>
              ) : (
                <QrCode className="h-12 w-12 text-primary" />
              )}
              <div className="w-full rounded-lg border border-border bg-background p-3">
                <p className="line-clamp-3 break-all text-left text-xs text-muted-foreground">{charge?.qrCode}</p>
              </div>
              <Button type="button" onClick={() => void handleCopy()} className="h-auto w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide">
                {copied ? <Check /> : <Copy />} {copied ? "PIX copiado!" : "Copiar código PIX"}
              </Button>
              <p className="text-xs text-muted-foreground">Expira em: <span className="font-bold text-foreground">{countdown}</span></p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
