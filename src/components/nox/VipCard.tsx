import { useState } from "react";
import { Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatBRL } from "@/lib/money";
import { VIP_LEVELS, useVip } from "@/lib/vip";

export function VipCard() {
  const { tier, progress } = useVip();
  const [open, setOpen] = useState(false);
  const currentLabel = VIP_LEVELS.find((level) => level.id === tier)?.label ?? "Bronze";

  return (
    <>
      <section className="surface-panel mt-3 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Crown className="h-4 w-4 text-primary" /> NOX VIP
          </h2>
          <span className="rounded-md bg-primary/15 px-2 py-1 text-[0.65rem] font-extrabold uppercase text-primary">{currentLabel}</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase text-muted-foreground">Progresso atual</p>
            <p className="text-lg font-extrabold tabular-nums">{formatBRL(progress)}</p>
          </div>
          <p className="text-right text-[0.65rem] text-muted-foreground">Próximo nível<br />a definir</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-0 rounded-full bg-primary" /></div>
        <p className="mt-2 text-[0.65rem] text-muted-foreground">Requisitos e benefícios serão definidos futuramente.</p>
        <button type="button" onClick={() => setOpen(true)} className="mt-3 text-xs font-extrabold uppercase text-primary">Ver todos os níveis</button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>NOX VIP</DialogTitle>
            <DialogDescription>Conheça os níveis do programa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {VIP_LEVELS.map((level) => (
              <div key={level.id} className="surface-panel flex items-center justify-between rounded-xl p-3">
                <span className="text-sm font-bold uppercase">{level.label}</span>
                <span className="text-[0.65rem] text-muted-foreground">Benefícios a definir</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}