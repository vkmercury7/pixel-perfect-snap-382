import { createFileRoute } from "@tanstack/react-router";
import { Gift, Sparkles, Ticket } from "lucide-react";

import { Shell } from "@/components/nox/Shell";

export const Route = createFileRoute("/bonus")({
  head: () => ({
    meta: [
      { title: "Bônus e promoções | NOX CASINO" },
      {
        name: "description",
        content: "Promoções demonstrativas do NOX CASINO: giros, missões diárias e clube VIP.",
      },
      { property: "og:title", content: "Bônus e promoções | NOX CASINO" },
      { property: "og:description", content: "Promoções demonstrativas do NOX CASINO." },
    ],
  }),
  component: BonusPage,
});

const promos = [
  { icon: Sparkles, title: "Giros de boas-vindas", text: "100 giros demonstrativos ao criar sua conta." },
  { icon: Ticket, title: "Missões diárias", text: "Complete desafios e suba de nível no clube NOX." },
  { icon: Gift, title: "Clube VIP", text: "Benefícios exclusivos para os jogadores mais ativos." },
];

function BonusPage() {
  return (
    <Shell>
      <h1 className="text-lg font-bold">Bônus</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Vitrine demonstrativa — nenhum valor real envolvido.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {promos.map(({ icon: Icon, title, text }) => (
          <article key={title} className="surface-panel rounded-2xl p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <h2 className="mt-3 text-sm font-bold">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </Shell>
  );
}
