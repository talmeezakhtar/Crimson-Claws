import type { Metadata } from "next";
import "./shop.css";
import Link from "next/link";
import { BallHero, CapHero, HoodieHero, JerseyHero, ShortsHero } from "@/components/site/ShopHeroes";

export const metadata: Metadata = { title: "Shop" };

const SECTIONS = [
  { id: "balls", label: "Balls", Hero: BallHero, look: "" },
  { id: "jerseys", label: "Jerseys", Hero: JerseyHero, look: "snp-flip" },
  { id: "shorts", label: "Shorts", Hero: ShortsHero, look: "snp-dark" },
  { id: "caps", label: "Caps", Hero: CapHero, look: "snp-flip" },
  { id: "hoodies", label: "Hoodies", Hero: HoodieHero, look: "" },
];

export default function ShopPage() {
  return (
    <div className="claws-shop">
      <div className="sticky top-16 z-30 border-b border-sand/70 bg-cream/90 backdrop-blur-md">
        <div className="wrap mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-8">
          <h1 className="display shrink-0 text-2xl">Claws shop</h1>
          <nav aria-label="Shop sections" className="-mx-2 flex min-w-0 flex-1 gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full px-3 py-1.5 text-[0.95rem] font-medium text-ink/75 transition-colors hover:bg-sand/70 hover:text-ink">
                {s.label}
              </a>
            ))}
          </nav>
          <Link href="/play" className="link hidden shrink-0 text-[0.95rem] font-medium text-crimson lg:block">
            Try a ball on the court
          </Link>
        </div>
      </div>
      {SECTIONS.map(({ id, Hero, look }) => (
        <div key={id} id={id} className={`scroll-mt-[7.5rem] ${look}`}>
          <Hero />
        </div>
      ))}
    </div>
  );
}
