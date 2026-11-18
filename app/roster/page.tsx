import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import { ROSTER } from "@/data/content";

export const metadata: Metadata = { title: "Roster" };

export default function RosterPage() {
  return (
    <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
      <PageHeader
        title="The 2026–27 Claws roster"
        intro="Eight players, one home court. Points, rebounds and assists are per game this season."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ROSTER.map((p) => (
          <li key={p.number} className="lift overflow-hidden rounded-[22px] bg-surface">
            <div className="zoom relative aspect-[825/1024] overflow-hidden bg-crimson">
              <Image
                src={`/roster/${p.name.split(" ").at(-1)!.toLowerCase()}.webp`}
                alt={`${p.name}, number ${p.number}, in the Claws home jersey`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="num absolute right-3 top-3 rounded-md bg-ink/70 px-2 py-0.5 text-sm text-cream">{p.position}</span>
            </div>
            <div className="p-5">
              <h2 className="display text-2xl">{p.name}</h2>
              <p className="mt-1 text-muted">
                <span className="num">{p.height}</span> · {p.hometown}
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-x-3 border-t border-sand pt-4">
                {[
                  ["Points", p.ppg],
                  ["Rebounds", p.rpg],
                  ["Assists", p.apg],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dd className="num text-xl leading-tight text-ink xl:text-2xl">{v}</dd>
                    <dt className="text-xs text-muted">{k}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
