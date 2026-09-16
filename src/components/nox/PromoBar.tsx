import { useEffect, useState } from "react";
import { Clock3, X } from "lucide-react";

import promoRabbit from "@/assets/promo-rabbit.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";

const PROMO_DURATION_MS = 30 * 60 * 1000;
const PROMO_END_KEY = "nox.promo.rabbit.endAt";
const PROMO_DISMISSED_KEY = "nox.promo.rabbit.dismissed";

function getOrCreateEndTime() {
  const stored = Number(localStorage.getItem(PROMO_END_KEY));
  if (Number.isFinite(stored) && stored > 0) return stored;

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
  const { user, ready } = useAuth();
  const { open } = useAuthModal();
  const [remaining, setRemaining] = useState(PROMO_DURATION_MS);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!ready || user || localStorage.getItem(PROMO_DISMISSED_KEY) === "true") {
      setVisible(false);
      return;
    }

    const endAt = getOrCreateEndTime();
    const updateRemaining = () => setRemaining(Math.max(0, endAt - Date.now()));
    updateRemaining();
    setVisible(true);

    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [ready, user]);

  function dismiss() {
    setClosing(true);
    localStorage.setItem(PROMO_DISMISSED_KEY, "true");
    window.setTimeout(() => setVisible(false), 220);
  }

  function openRegistration() {
    open("register");
  }

  if (!visible || user) return null;

  return (
    <aside
      aria-label="Oferta para novas contas"
      className={`relative z-50 overflow-hidden border-b border-primary/30 bg-surface transition-[max-height,opacity,transform] duration-200 ease-out ${
        closing ? "max-h-0 -translate-y-2 opacity-0" : "max-h-28 opacity-100 sm:max-h-20"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-surface to-background opacity-80" />
      <div
        role="button"
        tabIndex={0}
        aria-label="Abrir cadastro para receber 30 rodadas grátis no Rabbit"
        onClick={openRegistration}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openRegistration();
          }
        }}
        className="relative mx-auto grid min-h-[5.25rem] max-w-6xl cursor-pointer grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-x-2 px-3 pr-11 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:min-h-[4.5rem] sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-4 sm:pr-14"
      >
        <div className="relative h-full min-h-[5.25rem] overflow-hidden sm:min-h-[4.5rem]">
          <img
            src={promoRabbit}
            alt="Coelho branco segurando uma ficha dourada"
            width={816}
            height={816}
            className="absolute bottom-[-0.7rem] left-1/2 h-[5.6rem] w-[5.6rem] max-w-none -translate-x-1/2 object-contain sm:bottom-[-1.25rem] sm:h-[6.3rem] sm:w-[6.3rem]"
          />
        </div>

        <div className="min-w-0 py-2 sm:flex sm:items-baseline sm:gap-2">
          <p className="font-display text-[0.9rem] font-extrabold leading-none text-gold sm:text-lg">
            30 RODADAS GRÁTIS
          </p>
          <p className="mt-1 font-display text-[0.72rem] font-bold leading-none text-foreground sm:mt-0 sm:text-sm">
            NO RABBIT
          </p>
          <p className="mt-1 text-[0.56rem] font-bold uppercase leading-none text-primary sm:mt-0 sm:text-[0.62rem]">
            Para contas novas
          </p>
        </div>

        <div className="flex min-w-[4.5rem] flex-col items-center border-l border-primary/20 pl-2 sm:min-w-[8.5rem] sm:flex-row sm:justify-center sm:gap-2 sm:pl-4">
          <div className="flex items-center gap-1 text-[0.52rem] font-bold uppercase text-muted-foreground sm:text-[0.6rem]">
            <Clock3 className="h-3 w-3 text-primary" />
            <span>Válido por</span>
          </div>
          {remaining > 0 ? (
            <time className="mt-0.5 font-display text-base font-extrabold tabular-nums text-foreground sm:mt-0 sm:text-xl">
              {formatTime(remaining)}
            </time>
          ) : (
            <span className="mt-1 max-w-20 text-center text-[0.55rem] font-extrabold uppercase leading-tight text-gold sm:mt-0 sm:max-w-none sm:text-[0.62rem]">
              Oferta encerrada
            </span>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Fechar promoção"
        title="Fechar promoção"
        onClick={(event) => {
          event.stopPropagation();
          dismiss();
        }}
        className="absolute right-1.5 top-1/2 z-10 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-foreground sm:right-3"
      >
        <X className="h-4 w-4" />
      </Button>
    </aside>
  );
}