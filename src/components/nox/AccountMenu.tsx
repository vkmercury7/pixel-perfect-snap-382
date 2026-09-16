import { Link, useNavigate } from "@tanstack/react-router";
import { History, LogOut, Shield, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, type NoxUser } from "@/lib/auth";

export function AccountMenu({ user }: { user: NoxUser }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 text-left transition-colors hover:bg-accent"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-semibold text-foreground">Minha conta</span>
            <span className="block text-[0.65rem] text-muted-foreground">ID: {user.publicId}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 sm:hidden">
          <p className="text-xs font-semibold">Minha conta</p>
          <p className="text-[0.65rem] text-muted-foreground">ID: {user.publicId}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/conta" className="cursor-pointer">
            <UserRound className="mr-2 h-4 w-4" /> Minha conta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/conta" hash="historico" className="cursor-pointer">
            <History className="mr-2 h-4 w-4" /> Histórico
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/conta" hash="seguranca" className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" /> Segurança
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
