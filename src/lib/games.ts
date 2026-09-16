import { Flame, Gem, Rocket, Sparkles, Star, Wallet, type LucideIcon } from "lucide-react";

import coverTiger from "@/assets/cover-tiger.jpg";
import coverDragon from "@/assets/cover-dragon.jpg";
import coverCrash from "@/assets/cover-crash.jpg";
import artTiger from "@/assets/fortune_tiger.jpg.asset.json";
import artRabbit from "@/assets/fortune_rabbit.png.asset.json";
import artOx from "@/assets/fortune_ox.jpg.asset.json";

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
 * Catálogo demonstrativo. As capas são artes genéricas — substitua `cover`
 * pelas artes oficiais quando houver licença, ou troque esta lista pela
 * resposta da API do provedor de jogos.
 */
export const games: Game[] = [
  { id: "fortune-tiger", name: "Fortune Tiger", provider: "Demo Play", cover: artTiger.url, categories: ["destaque", "populares", "slots"], tag: "hot", players: 4821 },
  { id: "fortune-rabbit", name: "Fortune Rabbit", provider: "Demo Play", cover: artRabbit.url, categories: ["destaque", "populares", "slots"], tag: "hot", players: 3910 },
  { id: "fortune-ox", name: "Fortune Ox", provider: "Demo Play", cover: artOx.url, categories: ["destaque", "slots", "populares"], players: 3120 },
  { id: "fortune-dragon", name: "Fortune Dragon", provider: "Demo Play", cover: coverDragon, categories: ["destaque", "slots"], tag: "new", players: 2870 },
  { id: "fortune-mouse", name: "Fortune Mouse", provider: "Demo Play", cover: coverTiger, categories: ["slots", "populares"], players: 2410 },
  { id: "fortune-snake", name: "Fortune Snake", provider: "Demo Play", cover: coverDragon, categories: ["slots", "novidades"], tag: "new", players: 1980 },
  { id: "fortune-gods", name: "Fortune Gods", provider: "Demo Play", cover: coverDragon, categories: ["slots", "exclusivos"], players: 1740 },
  { id: "dragon-hatch", name: "Dragon Hatch", provider: "Demo Play", cover: coverDragon, categories: ["slots", "destaque"], players: 1655 },
  { id: "mahjong-ways", name: "Mahjong Ways", provider: "Demo Play", cover: coverTiger, categories: ["slots", "populares"], players: 2260 },
  { id: "mahjong-ways-2", name: "Mahjong Ways 2", provider: "Demo Play", cover: coverTiger, categories: ["slots", "populares"], tag: "hot", players: 2590 },
  { id: "wild-bandito", name: "Wild Bandito", provider: "Demo Play", cover: coverTiger, categories: ["slots", "novidades"], players: 1210 },
  { id: "ways-of-qilin", name: "Ways of the Qilin", provider: "Demo Play", cover: coverDragon, categories: ["slots", "exclusivos"], players: 990 },
  { id: "ganesha-fortune", name: "Ganesha Fortune", provider: "Demo Play", cover: coverTiger, categories: ["slots", "novidades"], players: 1080 },
  { id: "lucky-neko", name: "Lucky Neko", provider: "Demo Play", cover: coverTiger, categories: ["slots", "populares"], players: 2110 },
  { id: "treasures-aztec", name: "Treasures of Aztec", provider: "Demo Play", cover: coverDragon, categories: ["slots", "destaque"], players: 1890 },
  { id: "aviator", name: "Aviator", provider: "Demo Play", cover: coverCrash, categories: ["crash", "destaque", "populares"], tag: "hot", players: 5240 },
  { id: "jetx", name: "JetX", provider: "Demo Play", cover: coverCrash, categories: ["crash", "populares"], players: 3320 },
  { id: "nox-rocket", name: "Nox Rocket", provider: "Nox Originals", cover: coverCrash, categories: ["crash", "exclusivos", "novidades"], tag: "exclusive", players: 1420 },
];

export function gamesByCategory(id: CategoryId): Game[] {
  return games.filter((g) => g.categories.includes(id));
}
