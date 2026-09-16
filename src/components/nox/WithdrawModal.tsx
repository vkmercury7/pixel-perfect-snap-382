import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatBRL, maskMoneyInput, moneyInputToCents } from "@/lib/money";
import { useWallet, type PixKeyType } from "@/lib/wallet";

const PIX_TYPES: { id: PixKeyType; label: string }[] = [
  { id: "cpf", label: "CPF" },
  { id: "email", label: "E-mail" },
  { id: "phone", label: "Telefone" },
  { id: "random", label: "Chave aleatória" },
];

export function WithdrawModal() {
  const { modal, closeModal, balance, requestWithdrawal } = useWallet();
  const open = modal === "withdraw";
  const [value, setValue] = useState("0,00");
  const [keyType, setKeyType] = useState<PixKeyType>("cpf");
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    if (open) {
      setValue("0,00");
      setKeyType("cpf");
      setPixKey("");
    }
  }, [open]);

  const cents = moneyInputToCents(value);

  function handleSubmit() {
    if (cents <= 0) {
      toast.error("Informe o valor da retirada.");
      return;
    }
    if (cents > balance) {
      toast.error("Saldo insuficiente para realizar esta retirada.");
      return;
    }
    if (!pixKey.trim()) {
      toast.error("Digite sua chave PIX.");
      return;
    }
    try {
      requestWithdrawal({ amount: cents, pixKeyType: keyType, pixKey: pixKey.trim() });
      toast.success("Retirada solicitada. Ela ficará pendente até a confirmação do pagamento.");
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível solicitar a retirada.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeModal()}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold uppercase tracking-wide">Retirar</DialogTitle>
          <DialogDescription className="text-xs">
            Saldo disponível: <span className="font-bold text-foreground">{formatBRL(balance)}</span>
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor="withdraw-amount" className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
            Valor da retirada
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 focus-within:border-primary">
            <span className="text-sm font-bold text-muted-foreground">R$</span>
            <input
              id="withdraw-amount"
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(maskMoneyInput(e.target.value))}
              className="w-full bg-transparent text-right text-base font-extrabold outline-none"
            />
          </div>
        </div>

        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">Chave PIX</p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {PIX_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setKeyType(type.id)}
                className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                  keyType === type.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-surface text-foreground hover:bg-accent"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <input
            aria-label="Chave PIX"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Digite sua chave PIX"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        >
          Solicitar retirada
        </button>
        <p className="text-center text-[0.65rem] text-muted-foreground">
          Nesta etapa nenhuma retirada é processada de verdade.
        </p>
      </DialogContent>
    </Dialog>
  );
}
