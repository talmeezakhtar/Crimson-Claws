import { SCHEDULE, type Game } from "@/data/content";

export type Tier = { id: string; name: string; price: number; short: string; blurb: string };

export const TIERS: Tier[] = [
  { id: "courtside", name: "Courtside", price: 120, short: "CS", blurb: "Front row on the baseline. Includes a warm-up hoodie towel and the shootaround pass." },
  { id: "lower", name: "Lower bowl", price: 55, short: "LB", blurb: "Rows 2 to 18, behind the Claws bench. The loudest seats in the Kiln." },
  { id: "upper", name: "Upper deck", price: 25, short: "UD", blurb: "The whole court in view, and the best seats for the half-time half-court shot." },
];

export const tierById = (id: string | undefined) => TIERS.find((t) => t.id === id) ?? TIERS[1];

/** Home games still to play: the only ones we sell. */
export const homeGames = (): Game[] => SCHEDULE.filter((g) => g.home && !g.result);

export const gameByDate = (date: string | undefined) => homeGames().find((g) => g.date === date) ?? homeGames()[0];

const day = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
export const gameDay = (g: Game) => day.format(new Date(g.date));

/** "Lakeview Lynx" -> "Lynx": the ticket prints the short club name. */
export const nickname = (opponent: string) => opponent.split(" ").at(-1)!;
