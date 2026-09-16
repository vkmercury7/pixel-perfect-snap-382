import { createFileRoute } from "@tanstack/react-router";
import { Gift, Lock, Send, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Shell } from "@/components/nox/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import rabbitAsset from "@/assets/fortune_rabbit.png.asset.json";

export const Route = createFileRoute("/bonus")({
  head: () => ({
    meta: [
      { title: "Bônus e promoções | NOX CASINO" },
      {
        name: "description",
        content:
          "Resgate 30 rodadas grátis no Fortune Rabbit e acompanhe missões diárias e clube VIP do NOX CASINO.",
      },
      { property: "og:title", content: "Bônus e promoções | NOX CASINO" },
      {
        property: "og:description",
        content: "30 rodadas grátis no Fortune Rabbit para novas contas do NOX CASINO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BonusPage,
});

const promos = [
  { icon: Ticket, title: "Missões diárias", text: "Complete desafios e suba de nível no clube NOX." },
  { icon: Gift, title: "Clube VIP", text: "Benefícios exclusivos para os jogadores mais ativos." },
];

// Cupom válido e ativação real da recompensa serão definidos posteriormente.
const VALID_COUPONS: string[] = [];
const TELEGRAM_GROUP_URL = "";

function BonusPage() {
  const [coupon, setCoupon] = useState("");

  const handleRedeem = () => {
    const code = coupon.trim();
    if (!code) {
      toast.error("Digite o cupom para continuar.");
      return;
    }
    if (!VALID_COUPONS.includes(code.toUpperCase())) {
      toast.error("Cupom inválido. Confira o código disponível em nosso grupo do Telegram.");
      return;
    }
    toast.success("Cupom reconhecido — ativação da recompensa será liberada em breve.");
  };

  const handleTelegram = () => {
    if (!TELEGRAM_GROUP_URL) {
      toast.info("O link do grupo oficial será adicionado em breve.");
      return;
    }
    window.open(TELEGRAM_GROUP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Shell>
      <h1 className="text-lg font-bold">Bônus</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Vitrine demonstrativa — nenhum valor real envolvido.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="surface-panel relative overflow-hidden rounded-2xl border border-primary/30 p-4 sm:col-span-2">
          <div className="flex items-start gap-3">
            <img
              src={rabbitAsset.url}
              alt="Fortune Rabbit"
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <span className="text-xl leading-none">🎁</span>
              <h2 className="mt-1 text-2xl font-black uppercase leading-none tracking-tight text-primary">
                30 Rodadas Grátis
              </h2>
              <p className="mt-1 text-sm font-semibold">Fortune Rabbit</p>
              <p className="mt-1 text-xs text-muted-foreground">Exclusivo para novas contas.</p>
              <span className="mt-2 inline-flex rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                Cupom necessário
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Digite seu cupom"
              aria-label="Digite seu cupom"
              className="uppercase"
            />
            <Button className="w-full font-bold uppercase" onClick={handleRedeem}>
              Resgatar 30 Rodadas
            </Button>
          </div>

          <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              O cupom para resgatar suas 30 Rodadas Grátis está disponível em nosso grupo oficial do
              Telegram.
            </span>
          </p>
          <Button
            variant="outline"
            className="mt-2 w-full font-bold uppercase"
            onClick={handleTelegram}
          >
            <Send className="mr-2 h-4 w-4" />
            Obter cupom no Telegram
          </Button>
        </article>

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
