// The balls sold in the shop. The game paints its ball from the same colours.

export type BallId = "classic" | "crimson" | "ivory";

export type BallType = {
  id: BallId;
  name: string;
  price: number;
  blurb: string;
  base: string; // leather colour
  seam: string; // channel colour
  grain: string; // pebble speckle, rgba
};

export const BALLS: BallType[] = [
  {
    id: "classic",
    name: "Claws Classic",
    price: 49,
    blurb: "Composite leather, size 7. The ball we warm up with.",
    base: "#d8641c",
    seam: "#2b0a0e",
    grain: "rgba(110,30,0,",
  },
  {
    id: "crimson",
    name: "Crimson Night",
    price: 64,
    blurb: "Team edition in club burgundy with ivory channels.",
    base: "#790b13",
    seam: "#fff0dc",
    grain: "rgba(20,0,0,",
  },
  {
    id: "ivory",
    name: "Ivory Street",
    price: 39,
    blurb: "Tough rubber for outdoor courts. Ivory with crimson channels.",
    base: "#fffaf3",
    seam: "#790b13",
    grain: "rgba(120,80,40,",
  },
];

export const ballById = (id: string | null | undefined) => BALLS.find((b) => b.id === id) ?? BALLS[0];
