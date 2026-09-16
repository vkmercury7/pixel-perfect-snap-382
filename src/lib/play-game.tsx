import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";
import { useWallet } from "@/lib/wallet";
import type { Game } from "@/lib/games";

/**
 * Regra global de acesso aos jogos: CONTA -> SALDO -> ACESSO.
 * Nenhuma aposta real acontece aqui; `launchGame` é o ponto onde a API do
 * provedor de jogos será conectada depois.
 */
interface PlayGameContextValue {
  /** Jogo que disparou o aviso de depósito (null = modal fechado). */
  depositRequiredFor: Game | null;
  closeDepositRequired: () => void;
  playGame: (game: Game) => void;
}

const PlayGameContext = createContext<PlayGameContextValue | null>(null);

export function PlayGameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { open } = useAuthModal();
  const { balance } = useWallet();
  const [depositRequiredFor, setDepositRequiredFor] = useState<Game | null>(null);

  const value = useMemo<PlayGameContextValue>(
    () => ({
      depositRequiredFor,
      closeDepositRequired: () => setDepositRequiredFor(null),
      playGame: (game) => {
        if (!user) {
          open("register");
          return;
        }
        if (balance <= 0) {
          setDepositRequiredFor(game);
          return;
        }
        // TODO: conectar a API do provedor de jogos nesta etapa futura.
        toast.info(`${game.name} — abertura do jogo em breve.`);
      },
    }),
    [balance, depositRequiredFor, open, user],
  );

  return <PlayGameContext.Provider value={value}>{children}</PlayGameContext.Provider>;
}

export function usePlayGame() {
  const ctx = useContext(PlayGameContext);
  if (!ctx) throw new Error("usePlayGame precisa estar dentro de PlayGameProvider");
  return ctx;
}
