import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatBRL } from "@/lib/money";
import { usePlayGame } from "@/lib/play-game";
import { useWallet } from "@/lib/wallet";

export function DepositRequiredModal() {
  const { depositRequiredFor, closeDepositRequired } = usePlayGame();
  const { balance, openDeposit } = useWallet();

  return (
    <Dialog open={Boolean(depositRequiredFor)} onOpenChange={(open) => !open && closeDepositRequired()}>
      <DialogContent className="max-w-[21rem] rounded-2xl border-border bg-card px-5 py-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-primary/40 bg-primary/10">
          <Wallet className="h-6 w-6 text-primary" />
        </div>

        <DialogTitle className="mt-3 font-display text-base font-extrabold uppercase leading-tight text-foreground">
          Você precisa depositar
          <br />
          para jogar
        </DialogTitle>

        <DialogDescription className="text-xs text-muted-foreground">
          Adicione saldo à sua conta para continuar.
        </DialogDescription>

        <div className="mt-1 rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
            Saldo disponível
          </p>
          <p className="mt-0.5 font-display text-xl font-extrabold text-foreground">{formatBRL(balance)}</p>
        </div>

        <Button
          type="button"
          className="mt-2 w-full font-bold uppercase tracking-wide"
          onClick={() => {
            closeDepositRequired();
            openDeposit();
          }}
        >
          Depositar agora
        </Button>

        <button
          type="button"
          onClick={closeDepositRequired}
          className="mx-auto text-[0.7rem] font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Agora não
        </button>
      </DialogContent>
    </Dialog>
  );
}
