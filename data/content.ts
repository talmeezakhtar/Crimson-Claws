// All names, teams and products here are fictional placeholders.

export type Player = {
  number: number;
  name: string;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  height: string;
  ppg: number;
  rpg: number;
  apg: number;
  hometown: string;
};

export const ROSTER: Player[] = [
  { number: 3, name: "Marcus Vale", position: "PG", height: "6'1\"", ppg: 21.4, rpg: 3.9, apg: 8.2, hometown: "Oakridge" },
  { number: 7, name: "Theo Okafor", position: "SG", height: "6'4\"", ppg: 18.7, rpg: 4.1, apg: 3.5, hometown: "Lakeview" },
  { number: 11, name: "Dante Reyes", position: "SF", height: "6'7\"", ppg: 15.2, rpg: 6.8, apg: 2.9, hometown: "Westfield" },
  { number: 23, name: "Jalen Brooks", position: "SF", height: "6'8\"", ppg: 24.1, rpg: 7.3, apg: 4.4, hometown: "Harbor City" },
  { number: 32, name: "Isaac Lindqvist", position: "PF", height: "6'10\"", ppg: 12.6, rpg: 9.5, apg: 1.8, hometown: "Norhaven" },
  { number: 44, name: "Kofi Mensah", position: "C", height: "7'0\"", ppg: 11.9, rpg: 11.2, apg: 1.4, hometown: "Riverside" },
  { number: 5, name: "Eli Navarro", position: "PG", height: "6'0\"", ppg: 8.3, rpg: 2.2, apg: 5.1, hometown: "Sunvale" },
  { number: 15, name: "Owen Hart", position: "PF", height: "6'9\"", ppg: 7.7, rpg: 6.0, apg: 1.2, hometown: "Pine Hollow" },
];

export type Game = {
  date: string; // ISO
  opponent: string;
  home: boolean;
  result?: { us: number; them: number };
};

export const SCHEDULE: Game[] = [
  { date: "2026-10-24", opponent: "Riverside Rockets", home: true, result: { us: 104, them: 98 } },
  { date: "2026-10-31", opponent: "Harbor Hawks", home: false, result: { us: 91, them: 99 } },
  { date: "2026-11-07", opponent: "Summit Storm", home: true, result: { us: 112, them: 101 } },
  { date: "2026-11-14", opponent: "Pine City Pilots", home: false, result: { us: 97, them: 95 } },
  { date: "2026-11-21", opponent: "Lakeview Lynx", home: true },
  { date: "2026-11-28", opponent: "Oakridge Owls", home: false },
  { date: "2026-12-05", opponent: "Westfield Wolves", home: true },
  { date: "2026-12-12", opponent: "Northgate Knights", home: false },
  { date: "2026-12-19", opponent: "Sunvale Suns", home: true },
];

/** Club photographs supplied for the media page, mosaic order: span = grid cells on wide screens. */
export const GALLERY = [
  { src: "/media/arena-crowd.webp", alt: "A packed arena before tip-off, smoke drifting under the hanging scoreboard", span: "lg:row-span-2" },
  { src: "/media/rex-dunk.webp", alt: "Rex, the Claws mascot, in the ivory 23 kit, hanging off the rim after a dunk", span: "lg:col-span-2" },
  { src: "/media/dunk-rim.webp", alt: "A hand rising to dunk a ball over the orange rim", span: "" },
  { src: "/media/arena-bowl.webp", alt: "An empty bowl of red seats around the court, seen from the top row", span: "sm:col-span-2 lg:col-span-1" },
];

export const SEASON = [
  { value: 41, label: "home wins last season" },
  { value: 38, label: "years at the Kiln" },
  { value: 112, label: "points in our best game this year" },
];
