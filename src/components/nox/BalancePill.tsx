import { formatBRL } from "@/lib/money";
import { useWallet } from "@/lib/wallet";

export function BalancePill() {
  const { balance, openDeposit } = useWallet();

  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-border bg-surface p-1 pl-2.5">
      <span className="truncate text-sm font-extrabold tabular-nums leading-none">{formatBRL(balance)}</span>
      <button
        type="button"
        onClick={openDeposit}
        className="rounded-lg bg-primary px-2.5 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90 sm:px-3 sm:text-xs"
      >
        Depositar
      </button>
    </div>
  );
}
