import { useEffect, useState } from "react";

import { GameCard, GameCardSkeleton } from "./GameCard";
import type { Game } from "@/lib/games";

export function GameCarousel({ games, delay = 450 }: { games: Game[]; delay?: number }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 sm:gap-3 lg:mx-0 lg:px-0">
      {(loading ? Array.from({ length: 7 }) : games).map((item, index) => (
        <div
          key={loading ? index : (item as Game).id}
          className="w-[31%] min-w-[31%] snap-start sm:w-[22%] sm:min-w-[22%] md:w-[17%] md:min-w-[17%] lg:w-[13.2%] lg:min-w-[13.2%]"
        >
          {loading ? <GameCardSkeleton /> : <GameCard game={item as Game} />}
        </div>
      ))}
    </div>
  );
}
