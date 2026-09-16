import { Link, useLocation } from "@tanstack/react-router";
import { Dices, Gift, Heart, Home, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/bonus", label: "Bônus", icon: Gift },
  { to: "/cassino", label: "Cassino", icon: Dices, highlight: true },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/conta", label: "Conta", icon: UserRound },
] as const;

export function BottomNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-between px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const active = pathname === to;
          const highlight = "highlight" in rest && rest.highlight;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg py-1 text-[0.6rem] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-xl",
                    highlight
                      ? "-mt-5 h-11 w-11 bg-primary text-primary-foreground shadow-glow"
                      : "h-6 w-6",
                  )}
                >
                  <Icon className={highlight ? "h-5 w-5" : "h-[1.15rem] w-[1.15rem]"} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
