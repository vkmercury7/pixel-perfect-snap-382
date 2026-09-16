import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { GameCard } from "@/components/nox/GameCard";
import { Shell } from "@/components/nox/Shell";
import { useAuth } from "@/lib/auth";
import { games } from "@/lib/games";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos | NOX CASINO" },
      { name: "description", content: "Os jogos que você marcou como favoritos no NOX CASINO." },
      { property: "og:title", content: "Meus favoritos | NOX CASINO" },
      { property: "og:description", content: "Seus jogos favoritos salvos no NOX CASINO." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useAuth();
  const list = games.filter((g) => favorites.includes(g.id));

  return (
    <Shell>
      <h1 className="text-lg font-bold">Favoritos</h1>
      {list.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <Heart className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold">Nenhum favorito ainda</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Toque no coração de um jogo para salvá-lo aqui.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {list.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </Shell>
  );
}
