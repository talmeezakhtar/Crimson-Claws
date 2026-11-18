import Image from "next/image";
import Link from "next/link";
import { MascotLoader, ShowcaseLoader } from "@/components/game/Loaders";
import ClawsTicket from "@/components/site/ClawsTicket";
import CounterRoll from "@/components/site/CounterRoll";
import { ROSTER, SEASON } from "@/data/content";
import { gameDay, homeGames, TIERS } from "@/lib/tickets";

// Four faces on the home page; the roster page has all eight.
const FEATURED = [23, 3, 7, 44].map((n) => ROSTER.find((p) => p.number === n)!);

const KIT = [
  { name: "Claws 23 jersey", price: "$89", image: "/shop/jersey-home.webp", href: "/shop#jerseys" },
  { name: "Match basketball", price: "from $39", image: "/shop/ball-crimson.webp", href: "/shop#balls" },
  { name: "Warm-up hoodie", price: "$74", image: "/shop/hoodie-crimson.webp", href: "/shop#hoodies" },
  { name: "Game shorts", price: "$45", image: "/shop/shorts-crimson.webp", href: "/shop#shorts" },
  { name: "Court cap", price: "from $28", image: "/shop/cap-crimson.webp", href: "/shop#caps" },
];

export default function Home() {
  const nextHome = homeGames()[0];

  return (
    <>
      {/* hero: the live court is the picture */}
      <section className="on-night relative h-[100svh] min-h-[560px] overflow-hidden bg-night text-cream">
        <div className="absolute inset-0">
          <ShowcaseLoader />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/75 via-night/20 to-transparent" />

        <div className="relative wrap mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-20">
          <div data-enter className="max-w-3xl">
            <h1 className="display text-[clamp(2.8rem,7vw,6rem)] drop-shadow-[0_4px_24px_rgba(43,10,14,0.6)]">
              Crimson Claws basketball, home at the Kiln.
            </h1>
            <p className="mt-5 max-w-[48ch] text-lg text-cream/85">
              Eight players, three home games left before the new year, and our half court rebuilt in 3D for you to
              shoot on, free in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tickets" className="btn btn-primary">
                Get tickets
              </Link>
              <Link href="/play" className="btn btn-secondary text-cream">
                Play the court
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* next home game: the ticket is the picture */}
      <section className="flex min-h-[100svh] items-center bg-cream">
        <div className="wrap mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-28">
          <div className="grid place-items-center rounded-[28px] bg-night px-5 py-12 sm:px-10 sm:py-16">
            <ClawsTicket game={nextHome} tier={TIERS[1]} max={600} />
          </div>
          <div>
            <h2 className="display text-4xl sm:text-6xl">Next at the Kiln: Claws vs {nextHome.opponent}</h2>
            <p className="mt-5 max-w-[46ch] text-lg text-muted">
              Tip-off 7:30 pm, doors at 6:30 for the shootaround. Seats from ${TIERS[2].price} in the upper deck to ${TIERS[0].price} courtside.
            </p>
            <ul className="mt-8 divide-y divide-sand border-y border-sand">
              {homeGames().map((g) => (
                <li key={g.date}>
                  <Link href={`/tickets#${g.date}`} className="group flex items-center justify-between gap-4 py-4">
                    <span>
                      <span className="display block text-2xl">vs {g.opponent}</span>
                      <span className="num text-sm text-muted">{gameDay(g)} · 7:30 pm</span>
                    </span>
                    <span className="link shrink-0 font-medium text-crimson">Get tickets</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* the team: the season figures roll, then the faces */}
      <section className="on-night flex min-h-[100svh] items-center bg-night text-cream">
        <div className="wrap mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display max-w-2xl text-4xl sm:text-6xl">Meet the 2026–27 Claws</h2>
            <Link href="/roster" className="btn btn-secondary text-cream">
              Meet all eight
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6">
            {SEASON.map((s) => (
              <div key={s.label} className="border-t border-night-surface pt-4">
                <dd className="text-4xl text-cream sm:text-6xl">
                  <CounterRoll value={s.value} />
                </dd>
                <dt className="mt-2 text-sm text-night-muted sm:text-base">{s.label}</dt>
              </div>
            ))}
          </dl>
          <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {FEATURED.map((p) => (
              <li key={p.number}>
                <Link href="/roster" className="lift zoom relative block aspect-[825/1024] overflow-hidden rounded-[20px] bg-crimson">
                  <Image
                    src={`/roster/${p.name.split(" ").at(-1)!.toLowerCase()}.webp`}
                    alt={`${p.name}, number ${p.number}, ${p.position}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* the mascot, live in WebGL */}
      <section id="mascot" className="on-night flex min-h-[100svh] scroll-mt-16 items-center bg-crimson text-cream">
        <div className="wrap mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="display text-6xl sm:text-8xl">Meet Rex, number 15</h2>
            <p className="mt-5 max-w-[46ch] text-lg text-cream/85">
              Rex has worn 15 since the Kiln opened. He dribbles through every timeout, roars at every three and
              stands courtside for every shot you take. Drag to turn him round; click him to hear it.
            </p>
            <Link href="/play" className="btn btn-light mt-8">
              Shoot next to Rex
            </Link>
          </div>
          <div className="relative h-[62svh] min-h-[420px] lg:h-[80svh]">
            <MascotLoader />
          </div>
        </div>
      </section>

      {/* the kit: real product photos, the jersey leads */}
      <section className="flex min-h-[100svh] items-center bg-cream">
        <div className="wrap mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display max-w-2xl text-4xl sm:text-6xl">Wear the claws</h2>
            <Link href="/shop" className="btn btn-secondary text-ink">
              Shop all kit
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {KIT.map((k, i) => (
              <li key={k.href} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                <Link href={k.href} className="lift group flex h-full flex-col rounded-[22px] bg-surface p-6">
                  <div className={`zoom relative flex-1 ${i === 0 ? "min-h-[320px] lg:min-h-[460px]" : "min-h-[180px]"}`}>
                    <Image src={k.image} alt="" fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className="object-contain" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className={`display ${i === 0 ? "text-3xl" : "text-2xl"}`}>{k.name}</h3>
                    <span className="num shrink-0 text-lg text-crimson">{k.price}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted">
            Every ball is in the game too.{" "}
            <Link href="/play" className="link font-medium text-crimson">
              Try one on the court
            </Link>
          </p>
        </div>
      </section>

      {/* closing word */}
      <section className="on-night flex min-h-[100svh] items-center bg-crimson text-cream">
        <div className="wrap mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-4 py-24 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-32">
          <p className="display text-[clamp(4.5rem,15vw,12rem)] leading-[0.82]">Your shot.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/play" className="btn btn-light">
              Play the court
            </Link>
            <Link href="/tickets" className="btn btn-secondary text-cream">
              Get tickets
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
