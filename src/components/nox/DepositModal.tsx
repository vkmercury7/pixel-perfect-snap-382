import { useEffect, useState } from "react";
import { ArrowLeft, QrCode } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatBRL } from "@/lib/money";
import { useWallet } from "@/lib/wallet";

const QUICK_VALUES = [1000, 2000, 3000, 4000, 5000, 10000, 20000, 50000, 100000];

export function DepositModal() {
  const { modal, closeModal } = useWallet();
  const open = modal === "deposit";
  const [selectedCents, setSelectedCents] = useState<number | null>(null);
  const [step, setStep] = useState<"amount" | "pix">("amount");

  useEffect(() => {
    if (open) {
      setSelectedCents(null);
      setStep("amount");
    }
  }, [open]);

  const cents = selectedCents ?? 0;

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
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setSelectedCents(quick)}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-surface text-foreground hover:bg-accent"
                    }`}
                  >
                    {formatBRL(quick).replace(",00", "")}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={selectedCents === null}
              onClick={() => setStep("pix")}
              className="mt-1 w-full rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Continuar
            </button>
            <p className="text-center text-[0.65rem] text-muted-foreground">
              Após o pagamento o valor será creditado automaticamente em sua conta.
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold uppercase tracking-wide">Pagamento via PIX</DialogTitle>
              <DialogDescription className="text-xs">
                Em breve esta etapa será conectada ao nosso sistema de pagamentos.
              </DialogDescription>
            </DialogHeader>

            <div className="surface-panel flex flex-col items-center gap-2 rounded-2xl p-6 text-center">
              <QrCode className="h-12 w-12 text-primary" />
              <p className="text-xs text-muted-foreground">Valor selecionado</p>
              <p className="text-2xl font-extrabold">{formatBRL(cents)}</p>
            </div>

            <button
              type="button"
              onClick={() => setStep("amount")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-xs font-bold uppercase tracking-wide"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
