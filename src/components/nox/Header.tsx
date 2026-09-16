import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { AccountMenu } from "./AccountMenu";
import { BalancePill } from "./BalancePill";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";

export function Header() {
  const { user } = useAuth();
  const { open } = useAuthModal();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-3">
        <Link to="/" aria-label="NOX CASINO — início" className="shrink-0">
          <Logo />
        </Link>

        {user ? <div className="mx-auto min-w-0 sm:ml-4 sm:mr-auto"><BalancePill /></div> : null}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Buscar jogos"
            className="hidden h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground sm:grid"
          >
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <AccountMenu user={user} />
          ) : (
            <>
              <button
                type="button"
                onClick={() => open("login")}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-accent"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => open("register")}
                className="rounded-xl bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
              >
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
