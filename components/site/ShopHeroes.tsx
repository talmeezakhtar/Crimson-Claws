"use client";

import SneakerProductHero, { type SneakerVariant, type SneakerView } from "@/components/ui/sneaker-product-hero";
import { useCart } from "@/lib/cart";

/** Add-to-cart handler for one product: the colourway and size become the line's detail. */
function useToBag(slug: string, product: string) {
  const add = useCart((s) => s.add);
  return ({ variant, size, price }: { variant: SneakerVariant; size: string; price: number }) =>
    add({
      id: `${slug}:${variant.name}:${size}`,
      kind: "merch",
      name: product,
      detail: `${variant.name} · size ${size}`,
      price,
      image: variant.src,
      href: `/shop#${slug}`,
    });
}

const S = "/shop/";
const view = (file: string, label: string, focus?: [number, number], zoom?: number): SneakerView => ({ src: S + file, label, focus, zoom });

const ballViews = (file: string): SneakerView[] => [
  view(file, "Ball"),
  view(file, "Pebble grip", [0.5, 0.45], 2.6),
  view(file, "Channels", [0.32, 0.38], 2),
  { ...view(file, "Other side"), mirror: true },
];

const BALLS: SneakerVariant[] = [
  { name: "Classic", swatch: "#d8641c", tint: "#d8641c", price: 49, src: S + "ball-classic.webp", gallery: ballViews("ball-classic.webp") },
  { name: "Crimson", swatch: "#790b13", tint: "#790b13", price: 64, src: S + "ball-crimson.webp", gallery: ballViews("ball-crimson.webp"), soldOut: ["5"] },
  { name: "Ivory", swatch: "#f3e3d0", tint: "#d9a441", price: 39, src: S + "ball-ivory.webp", gallery: ballViews("ball-ivory.webp"), stock: { "7": 3 } },
];

const jerseyViews = (side: "home" | "away"): SneakerView[] => [
  view(`jersey-${side}.webp`, "Front"),
  view(`jersey-${side}-back.webp`, "Back"),
  view(`jersey-${side}.webp`, "Crest", [0.72, 0.18], 2.6),
  view(`jersey-${side}.webp`, "Number", [0.5, 0.5], 1.9),
  view(`jersey-${side}-back.webp`, "Name bar", [0.5, 0.26], 2),
  view(`jersey-${side}.webp`, "Jock tag", [0.7, 0.92], 3),
];

const JERSEYS: SneakerVariant[] = [
  { name: "Home", swatch: "#790b13", tint: "#790b13", src: S + "jersey-home.webp", gallery: jerseyViews("home") },
  { name: "Away", swatch: "#fff0dc", tint: "#d9a441", src: S + "jersey-away.webp", gallery: jerseyViews("away"), stock: { XXL: 2 } },
];

const CAPS: SneakerVariant[] = [
  {
    name: "Snapback",
    swatch: "#790b13",
    tint: "#790b13",
    price: 32,
    src: S + "cap-crimson.webp",
    gallery: [view("cap-crimson.webp", "Front"), view("cap-crimson.webp", "Claw crest", [0.36, 0.42], 2.2), view("cap-crimson.webp", "Side 23", [0.88, 0.62], 3)],
  },
  {
    name: "Trucker",
    swatch: "#fff0dc",
    tint: "#d9a441",
    price: 28,
    src: S + "cap-trucker.webp",
    gallery: [view("cap-trucker.webp", "Front"), view("cap-trucker.webp", "Wordmark", [0.38, 0.42], 2), view("cap-trucker.webp", "Side patch", [0.92, 0.6], 3)],
  },
];

const H = "calc(100svh - 7.5rem)";

export function BallHero() {
  const toBag = useToBag("balls", "Claws match basketball");
  return (
    <SneakerProductHero
      onAddToCart={toBag}
      variants={BALLS}
      title="Claws match basketballs"
      description="The three balls we play with. Pick a colour, then take it to the court in the game before you buy it."
      sizes={[
        { label: "5", stock: 20 },
        { label: "6", stock: 14 },
        { label: "7", stock: 9 },
      ]}
      price={49}
      rating={4.7}
      reviews={212}
      toast="Added to your bag"
      likeColor="#790b13"
      height={H}
    />
  );
}

export function JerseyHero() {
  const toBag = useToBag("jerseys", "Claws 23 jersey");
  return (
    <SneakerProductHero
      onAddToCart={toBag}
      variants={JERSEYS}
      title="Claws 23 jersey, home and away"
      description="Breathable mesh, gold-piped collar and claw crest. Home in crimson, away in ivory, BROOKS 23 on the back."
      sizes={[
        { label: "S", price: 89, stock: 12 },
        { label: "M", price: 89, stock: 18 },
        { label: "L", price: 89, stock: 6 },
        { label: "XL", price: 89, stock: 3 },
        { label: "XXL", price: 94, stock: 8 },
      ]}
      price={89}
      rating={4.8}
      reviews={348}
      toast="Added to your bag"
      likeColor="#790b13"
      height={H}
      className="snp-tall"
    />
  );
}

export function CapHero() {
  const toBag = useToBag("caps", "Court cap");
  return (
    <SneakerProductHero
      onAddToCart={toBag}
      variants={CAPS}
      title="Court caps"
      description="A crimson snapback with the claw crest, or the ivory trucker with the CLAWS wordmark and mesh back."
      sizes={[
        { label: "S/M", stock: 15 },
        { label: "L/XL", stock: 4 },
      ]}
      price={32}
      rating={4.6}
      reviews={97}
      toast="Added to your bag"
      likeColor="#790b13"
      height={H}
    />
  );
}

const shortsViews = (file: string): SneakerView[] => [
  view(file, "Front"),
  view(file, "CLAWS hem", [0.22, 0.82], 2.6),
  view(file, "Ball crest", [0.8, 0.82], 3),
  view(file, "Waistband", [0.5, 0.08], 2.2),
];

const SHORTS: SneakerVariant[] = [
  { name: "Home", swatch: "#790b13", tint: "#790b13", src: S + "shorts-crimson.webp", gallery: shortsViews("shorts-crimson.webp") },
  { name: "Away", swatch: "#fff0dc", tint: "#d9a441", src: S + "shorts-ivory.webp", gallery: shortsViews("shorts-ivory.webp"), stock: { XL: 2 } },
];

export function ShortsHero() {
  const toBag = useToBag("shorts", "Claws game shorts");
  return (
    <SneakerProductHero
      onAddToCart={toBag}
      variants={SHORTS}
      title="Claws game shorts"
      description="Mesh game shorts with a drawstring waist, gold side stripes and the claw crest on the hem. Home in crimson, away in ivory."
      sizes={[
        { label: "S", stock: 10 },
        { label: "M", stock: 16 },
        { label: "L", stock: 7 },
        { label: "XL", stock: 5 },
      ]}
      price={45}
      rating={4.7}
      reviews={156}
      toast="Added to your bag"
      likeColor="#790b13"
      height={H}
      className="snp-tall"
    />
  );
}

const hoodieViews = (c: string): SneakerView[] => [
  view(`hoodie-${c}.webp`, "Front"),
  view(`hoodie-${c}-back.webp`, "Back"),
  view(`hoodie-${c}.webp`, "CLAWS chest", [0.5, 0.34], 2.2),
  view(`hoodie-${c}.webp`, "Hood", [0.5, 0.08], 2.4),
  view(`hoodie-${c}.webp`, "Pocket", [0.5, 0.68], 2.2),
];

const HOODIES: SneakerVariant[] = [
  { name: "Crimson", swatch: "#a3131f", tint: "#790b13", src: S + "hoodie-crimson.webp", gallery: hoodieViews("crimson") },
  { name: "Ivory", swatch: "#fff0dc", tint: "#d9a441", src: S + "hoodie-ivory.webp", gallery: hoodieViews("ivory"), soldOut: ["XS"] },
];

export function HoodieHero() {
  const toBag = useToBag("hoodies", "Kiln warm-up hoodie");
  return (
    <SneakerProductHero
      onAddToCart={toBag}
      variants={HOODIES}
      title="Kiln warm-up hoodie"
      description="The hoodie the team wears in warm-ups. Brushed fleece, kangaroo pocket and a gold felt CLAWS arch across the chest."
      sizes={[
        { label: "XS", stock: 4 },
        { label: "S", stock: 11 },
        { label: "M", stock: 15 },
        { label: "L", stock: 9 },
        { label: "XL", stock: 3 },
      ]}
      price={74}
      rating={4.9}
      reviews={183}
      toast="Added to your bag"
      likeColor="#790b13"
      height={H}
      className="snp-tall"
    />
  );
}
