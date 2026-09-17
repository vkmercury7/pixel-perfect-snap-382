import { Flame, Gem, Rocket, Sparkles, Star, Wallet, type LucideIcon } from "lucide-react";

import coverCrash from "@/assets/cover-crash.jpg";
import coverDragon from "@/assets/cover-dragon.jpg";
import coverJet from "@/assets/cover-jet.jpg";
import coverMahjong from "@/assets/cover-mahjong.jpg";
import coverNeko from "@/assets/cover-neko.jpg";
import coverRocket from "@/assets/cover-rocket.jpg";
import artTiger from "@/assets/fortune_tiger.jpg";
import artRabbit from "@/assets/fortune_rabbit.png";
import artOx from "@/assets/fortune_ox.jpg";
import artGates from "@/assets/gates-olympus-super-scatter.jpg";
import artTasty from "@/assets/tasty-bonanza.jpg";
import artPaw from "@/assets/fortune-paw.jpg";
import artOinkster from "@/assets/oinkster.jpg";
import artGiga from "@/assets/giga-match-gems.jpg";
import artPowerHot from "@/assets/power-hot-40.jpg";
import artInferno from "@/assets/inferno-fortune.jpg";
import artFortunePirates from "@/assets/fortune-pirates.png";
import artFortuneFruits from "@/assets/fortune-fruits.png";
import artBurningClassics from "@/assets/burning-classics-royal-edition.png";
import artClassicCoins from "@/assets/classic-coins.png";
import artDiamondHits from "@/assets/diamond-hits.png";
import artGoldGoldGold from "@/assets/gold-gold-gold-5000.png";
import artHollyJollyBonanza from "@/assets/holly-jolly-bonanza-2.png";
import artHollyJollyCashPig from "@/assets/holly-jolly-cash-pig.png";
import artFishyFishyGuy from "@/assets/fishy-fishy-guy.png";
import artJokersFortune from "@/assets/jokers-fortune.png";
import artLuckyNightMarket from "@/assets/lucky-night-market.png";
import artCherryXmas from "@/assets/cherry-xmas.png";

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
  { id: "fortune-tiger", name: "Fortune Tiger", provider: "Demo Play", cover: artTiger, categories: ["destaque", "populares", "slots"], tag: "hot", players: 4821 },
  { id: "fortune-rabbit", name: "Fortune Rabbit", provider: "Demo Play", cover: artRabbit, categories: ["destaque", "populares"], tag: "hot", players: 3910 },
  { id: "fortune-ox", name: "Fortune Ox", provider: "Demo Play", cover: artOx, categories: ["destaque", "slots"], players: 3120 },
  { id: "gates-olympus-super-scatter", name: "Gates of Olympus Super Scatter", provider: "Pragmatic Play", cover: artGates, categories: ["destaque", "populares"], tag: "hot", players: 5310 },
  { id: "tasty-bonanza", name: "Tasty Bonanza", provider: "Demo Play", cover: artTasty, categories: ["destaque", "slots"], players: 2740 },
  { id: "fortune-paw", name: "Fortune Paw", provider: "Demo Play", cover: artPaw, categories: ["destaque", "slots", "novidades"], tag: "new", players: 2480 },
  { id: "oinkster-hold-and-win", name: "Mr. Oinkster's Hold and Win", provider: "Demo Play", cover: artOinkster, categories: ["populares", "novidades"], players: 2960 },
  { id: "giga-match-gems-party", name: "Giga Match Gems Party", provider: "Demo Play", cover: artGiga, categories: ["populares", "novidades", "exclusivos"], tag: "new", players: 3180 },
  { id: "power-hot-40-triple-boost", name: "40 Power Hot Triple Boost GCL", provider: "Demo Play", cover: artPowerHot, categories: ["slots", "novidades", "exclusivos"], players: 1860 },
  { id: "inferno-fortune-instastrike", name: "Inferno Fortune Instastrike", provider: "Demo Play", cover: artInferno, categories: ["populares", "slots", "novidades"], players: 2280 },
  { id: "mahjong-ways", name: "Mahjong Ways", provider: "Demo Play", cover: coverMahjong, categories: ["populares", "slots"], players: 2260 },
  { id: "lucky-neko", name: "Lucky Neko", provider: "Demo Play", cover: coverNeko, categories: ["slots", "populares"], players: 2110 },
  { id: "fortune-dragon", name: "Fortune Dragon", provider: "Demo Play", cover: coverDragon, categories: ["slots", "destaque"], players: 2870 },
  { id: "aviator", name: "Aviator", provider: "Demo Play", cover: coverCrash, categories: ["crash", "populares"], tag: "hot", players: 5240 },
  { id: "jetx", name: "JetX", provider: "Demo Play", cover: coverJet, categories: ["crash", "populares"], players: 3320 },
  { id: "nox-rocket", name: "Nox Rocket", provider: "Nox Originals", cover: coverRocket, categories: ["crash", "exclusivos", "novidades"], tag: "exclusive", players: 1420 },
  { id: "fortune-pirates", name: "Fortune Pirates", provider: "Demo Play", cover: artFortunePirates, categories: ["destaque", "exclusivos"], players: 1770 },
  { id: "fortune-fruits", name: "Fortune Fruits", provider: "Banana Games", cover: artFortuneFruits, categories: ["populares", "slots"], players: 2230 },
  { id: "burning-classics-royal-edition", name: "Burning Classics Royal Edition", provider: "Booming Games", cover: artBurningClassics, categories: ["slots", "exclusivos"], players: 1710 },
  { id: "classic-coins", name: "Classic Coins", provider: "Booming Games", cover: artClassicCoins, categories: ["slots"], players: 1110 },
  { id: "diamond-hits", name: "Diamond Hits", provider: "Booming Games", cover: artDiamondHits, categories: ["destaque", "populares"], players: 1810 },
  { id: "gold-gold-gold-5000", name: "Gold Gold Gold 5000", provider: "Booming Games", cover: artGoldGoldGold, categories: ["populares", "exclusivos"], players: 2080 },
  { id: "holly-jolly-bonanza-2", name: "Holly Jolly Bonanza 2", provider: "Booming Games", cover: artHollyJollyBonanza, categories: ["novidades", "slots"], tag: "new", players: 1010 },
  { id: "holly-jolly-cash-pig", name: "Holly Jolly Cash Pig", provider: "Demo Play", cover: artHollyJollyCashPig, categories: ["novidades", "exclusivos"], tag: "new", players: 1030 },
  { id: "fishy-fishy-guy", name: "Fishy Fishy Guy", provider: "Demo Play", cover: artFishyFishyGuy, categories: ["destaque", "novidades"], players: 1090 },
  { id: "jokers-fortune", name: "Joker's Fortune", provider: "Demo Play", cover: artJokersFortune, categories: ["slots", "exclusivos"], players: 1090 },
  { id: "lucky-night-market", name: "Lucky Night Market", provider: "Demo Play", cover: artLuckyNightMarket, categories: ["populares", "novidades"], players: 1200 },
  { id: "cherry-xmas", name: "Cherry Xmas", provider: "Demo Play", cover: artCherryXmas, categories: ["novidades", "exclusivos"], tag: "new", players: 1040 },
];

export function gamesByCategory(id: CategoryId): Game[] {
  return games.filter((g) => g.categories.includes(id));
}
