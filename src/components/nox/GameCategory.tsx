import { ChevronRight } from "lucide-react";

import { GameCarousel } from "./GameCarousel";
import type { Category, Game } from "@/lib/games";

export function GameCategory({
  category,
  games,
  delay = 450,
}: {
  category: Category;
  games: Game[];
  delay?: number | undefined;
}) {
  const Icon = category.icon;

  return (
    <section id={category.id} className="mt-6 first:mt-4">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground sm:text-base">
          <Icon className="h-4 w-4 text-primary" />
          {category.label}
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[0.7rem] font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Ver todos <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <GameCarousel games={games} delay={delay} />
    </section>
  );
}

