import { Flame, Gem, Rocket, Sparkles, Star, Wallet, type LucideIcon } from "lucide-react";

import coverCrash from "@/assets/cover-crash.jpg";
import coverDragon from "@/assets/cover-dragon.jpg";
import coverJet from "@/assets/cover-jet.jpg";
import coverMahjong from "@/assets/cover-mahjong.jpg";
import coverNeko from "@/assets/cover-neko.jpg";
import coverRocket from "@/assets/cover-rocket.jpg";
import artTiger from "@/assets/fortune_tiger.jpg.asset.json";
import artRabbit from "@/assets/fortune_rabbit.png.asset.json";
import artOx from "@/assets/fortune_ox.jpg.asset.json";
import artGates from "@/assets/gates-olympus-super-scatter.jpg.asset.json";
import artTasty from "@/assets/tasty-bonanza.jpg.asset.json";
import artPaw from "@/assets/fortune-paw.jpg.asset.json";
import artOinkster from "@/assets/oinkster.jpg.asset.json";
import artGiga from "@/assets/giga-match-gems.jpg.asset.json";
import artPowerHot from "@/assets/power-hot-40.jpg.asset.json";
import artInferno from "@/assets/inferno-fortune.jpg.asset.json";

export type GameTag = "hot" | "new" | "exclusive";

export interface Game {
  id: string;
  name: string;
  provider: string;
  cover: string;
  categories: CategoryId[];
  tag?: GameTag;
  players?: number;
}

export type CategoryId = "destaque" | "populares" | "slots" | "crash" | "novidades" | "exclusivos";

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { id: "destaque", label: "Em destaque", icon: Flame },
  { id: "populares", label: "Mais jogados", icon: Star },
  { id: "slots", label: "Slots", icon: Wallet },
  { id: "crash", label: "Crash", icon: Rocket },
  { id: "novidades", label: "Novidades", icon: Sparkles },
  { id: "exclusivos", label: "Exclusivos", icon: Gem },
];

/**
 * Catálogo demonstrativo. Cada jogo tem a sua própria capa — nunca reutilize a
 * mesma arte para jogos diferentes. Substitua esta lista pela resposta da API do
 * provedor quando houver integração.
 */
export const games: Game[] = [
  { id: "fortune-tiger", name: "Fortune Tiger", provider: "Demo Play", cover: artTiger.url, categories: ["destaque", "populares", "slots"], tag: "hot", players: 4821 },
  { id: "fortune-rabbit", name: "Fortune Rabbit", provider: "Demo Play", cover: artRabbit.url, categories: ["destaque", "populares"], tag: "hot", players: 3910 },
  { id: "fortune-ox", name: "Fortune Ox", provider: "Demo Play", cover: artOx.url, categories: ["destaque", "slots"], players: 3120 },
  { id: "gates-olympus-super-scatter", name: "Gates of Olympus Super Scatter", provider: "Pragmatic Play", cover: artGates.url, categories: ["destaque", "populares"], tag: "hot", players: 5310 },
  { id: "tasty-bonanza", name: "Tasty Bonanza", provider: "Demo Play", cover: artTasty.url, categories: ["destaque", "slots"], players: 2740 },
  { id: "fortune-paw", name: "Fortune Paw", provider: "Demo Play", cover: artPaw.url, categories: ["destaque", "slots", "novidades"], tag: "new", players: 2480 },
  { id: "oinkster-hold-and-win", name: "Mr. Oinkster's Hold and Win", provider: "Demo Play", cover: artOinkster.url, categories: ["populares", "novidades"], players: 2960 },
  { id: "giga-match-gems-party", name: "Giga Match Gems Party", provider: "Demo Play", cover: artGiga.url, categories: ["populares", "novidades", "exclusivos"], tag: "new", players: 3180 },
  { id: "power-hot-40-triple-boost", name: "40 Power Hot Triple Boost GCL", provider: "Demo Play", cover: artPowerHot.url, categories: ["slots", "novidades", "exclusivos"], players: 1860 },
  { id: "inferno-fortune-instastrike", name: "Inferno Fortune Instastrike", provider: "Demo Play", cover: artInferno.url, categories: ["populares", "slots", "novidades"], players: 2280 },
  { id: "mahjong-ways", name: "Mahjong Ways", provider: "Demo Play", cover: coverMahjong, categories: ["populares", "slots"], players: 2260 },
  { id: "lucky-neko", name: "Lucky Neko", provider: "Demo Play", cover: coverNeko, categories: ["slots", "populares"], players: 2110 },
  { id: "fortune-dragon", name: "Fortune Dragon", provider: "Demo Play", cover: coverDragon, categories: ["slots", "destaque"], players: 2870 },
  { id: "aviator", name: "Aviator", provider: "Demo Play", cover: coverCrash, categories: ["crash", "populares"], tag: "hot", players: 5240 },
  { id: "jetx", name: "JetX", provider: "Demo Play", cover: coverJet, categories: ["crash", "populares"], players: 3320 },
  { id: "nox-rocket", name: "Nox Rocket", provider: "Nox Originals", cover: coverRocket, categories: ["crash", "exclusivos", "novidades"], tag: "exclusive", players: 1420 },
];

export function gamesByCategory(id: CategoryId): Game[] {
  return games.filter((g) => g.categories.includes(id));
}
