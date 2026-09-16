import { Heart, Play, Users } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { usePlayGame } from "@/lib/play-game";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/games";

const tagLabel: Record<string, string> = {
  hot: "HOT",
  new: "NOVO",
  exclusive: "EXCLUSIVO",
};

export function GameCard({ game, className }: { game: Game; className?: string }) {
  const { favorites, toggleFavorite } = useAuth();
  const { playGame } = usePlayGame();
  const isFavorite = favorites.includes(game.id);

  return (
    <div className={cn("group w-full", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <button
          type="button"
          onClick={() => playGame(game)}
          aria-label={`Jogar ${game.name}`}
          className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={game.cover}
            alt={`Capa do jogo ${game.name}`}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>


        {game.tag && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-primary-foreground">
            {tagLabel[game.tag]}
          </span>
        )}

        <button
          type="button"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={() => toggleFavorite(game.id)}
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-background/70 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground",
            )}
          />
        </button>

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-background/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          <button
            type="button"
            onClick={() => playGame(game)}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow"
          >
            <Play className="h-3.5 w-3.5" /> Jogar
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{game.name}</p>
          {game.players && (
            <p className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
              <Users className="h-2.5 w-2.5" /> {game.players.toLocaleString("pt-BR")}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => playGame(game)}
        className="mt-1.5 w-full rounded-lg bg-secondary py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-secondary-foreground sm:hidden"
      >
        Jogar
      </button>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="aspect-[3/4] w-full rounded-xl bg-muted" />
      <div className="mt-1.5 h-2.5 w-3/4 rounded bg-muted" />
      <div className="mt-1.5 h-2 w-1/2 rounded bg-muted" />
    </div>
  );
}
