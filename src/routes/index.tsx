import { createFileRoute } from "@tanstack/react-router";

import { CategoryChips } from "@/components/nox/CategoryChips";
import { GameCategory } from "@/components/nox/GameCategory";
import { HeroBanner } from "@/components/nox/HeroBanner";
import { PromoBar } from "@/components/nox/PromoBar";
import { Shell } from "@/components/nox/Shell";
import { categories, gamesByCategory } from "@/lib/games";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOX CASINO — Slots e Crash em demonstração" },
      {
        name: "description",
        content:
          "NOX CASINO: catálogo de slots e jogos crash em ambiente de demonstração, com experiência mobile de aplicativo.",
      },
      { property: "og:title", content: "NOX CASINO — Slots e Crash em demonstração" },
      {
        property: "og:description",
        content: "Catálogo de slots e crash em ambiente de demonstração, feito para o mobile.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Shell beforeHeader={<PromoBar />}>
      <HeroBanner />
      <CategoryChips />
      {categories.map((category, i) => (
        <GameCategory
          key={category.id}
          category={category}
          games={gamesByCategory(category.id)}
          delay={350 + i * 120}
        />
      ))}
      <p className="mt-10 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
        Ambiente de demonstração. Nenhum jogo com dinheiro real, depósito ou saque está disponível.
        <br />
        Proibido para menores de 18 anos.
      </p>
    </Shell>
  );
}
