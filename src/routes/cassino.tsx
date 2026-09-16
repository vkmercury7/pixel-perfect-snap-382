import { createFileRoute } from "@tanstack/react-router";

import { GameCard } from "@/components/nox/GameCard";
import { Shell } from "@/components/nox/Shell";
import { games } from "@/lib/games";

export const Route = createFileRoute("/cassino")({
  head: () => ({
    meta: [
      { title: "Cassino — todos os jogos | NOX CASINO" },
      {
        name: "description",
        content: "Catálogo completo do NOX CASINO: slots, crash e jogos exclusivos em demonstração.",
      },
      { property: "og:title", content: "Cassino — todos os jogos | NOX CASINO" },
      { property: "og:description", content: "Catálogo completo de slots e crash em demonstração." },
    ],
  }),
  component: CasinoPage,
});

function CasinoPage() {
  return (
    <Shell>
      <h1 className="text-lg font-bold">Cassino</h1>
      <p className="mt-1 text-xs text-muted-foreground">{games.length} jogos demonstrativos</p>
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </Shell>
  );
}
