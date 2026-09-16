import { useEffect, useState } from "react";
import { Clock3, X } from "lucide-react";

import promoArt from "@/assets/nox_promocao_30_rodadas.png.asset.json";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/lib/auth-modal";

const PROMO_DURATION_MS = 30 * 60 * 1000;
const PROMO_END_KEY = "nox.promo.rabbit.endAt";

function getOrCreateEndTime() {
  const stored = Number(localStorage.getItem(PROMO_END_KEY));
  if (Number.isFinite(stored) && stored > Date.now()) return stored;

  const endAt = Date.now() + PROMO_DURATION_MS;
  localStorage.setItem(PROMO_END_KEY, String(endAt));
  return endAt;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function PromoBar() {
  const { open } = useAuthModal();
  const [remaining, setRemaining] = useState(PROMO_DURATION_MS);
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const endAt = getOrCreateEndTime();
    const updateRemaining = () => setRemaining(Math.max(0, endAt - Date.now()));
    updateRemaining();

    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, []);

  function dismiss() {
    setClosing(true);
    window.setTimeout(() => setVisible(false), 220);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Oferta para novas contas"
      className={`relative z-40 w-full overflow-hidden border-b border-primary/30 bg-[#050b1c] transition-[max-height,opacity,transform] duration-200 ease-out ${
        closing ? "max-h-0 -translate-y-1 opacity-0" : "max-h-24 opacity-100"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-1.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
        <button
          type="button"
          aria-label="Abrir cadastro para receber 30 rodadas grátis no Rabbit"
          onClick={() => open("register")}
          className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={promoArt.url}
            alt="30 rodadas grátis no Rabbit para contas novas"
            className="h-9 w-full object-contain object-left sm:h-12"
          />
        </button>

        <div className="flex shrink-0 flex-col items-center rounded-md border border-primary/40 bg-[#0a1430] px-1.5 py-1 sm:px-3">
          <div className="flex items-center gap-1 text-[0.5rem] font-bold uppercase leading-none text-muted-foreground sm:text-[0.6rem]">
            <Clock3 className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
            <span>Válido por</span>
          </div>
          {remaining > 0 ? (
            <time className="mt-0.5 font-display text-xs font-extrabold tabular-nums text-white sm:text-base">
              {formatTime(remaining)}
            </time>
          ) : (
            <span className="mt-0.5 text-[0.5rem] font-extrabold uppercase leading-none text-gold sm:text-[0.62rem]">
              Oferta encerrada
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fechar promoção"
          title="Fechar promoção"
          onClick={dismiss}
          className="h-7 w-7 shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
