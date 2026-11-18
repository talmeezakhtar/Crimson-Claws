"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import ClawsTicket from "./ClawsTicket";
import Stepper from "./Stepper";
import { useCart } from "@/lib/cart";
import { gameByDate, gameDay, homeGames, TIERS, tierById } from "@/lib/tickets";

const radio =
  "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-sand bg-cream px-5 py-4 transition-colors hover:border-crimson/40 has-[:checked]:border-crimson has-[:checked]:bg-crimson/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson";

// The game arrives as /tickets#2026-12-05 (from the schedule), read only in the browser so the page stays static.
const onHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export default function TicketPicker() {
  const games = homeGames();
  const hash = useSyncExternalStore(onHash, () => window.location.hash.slice(1), () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const date = gameByDate(picked ?? hash).date;
  const setDate = setPicked;
  const [tierId, setTierId] = useState("lower");
  const [qty, setQty] = useState(2);
  const [added, setAdded] = useState<string | null>(null);
  const add = useCart((s) => s.add);

  const game = gameByDate(date);
  const tier = tierById(tierId);

  const addToBag = () => {
    add(
      {
        id: `ticket:${game.date}:${tier.id}`,
        kind: "ticket",
        name: `Claws vs ${game.opponent}`,
        detail: `${gameDay(game)} · ${tier.name}`,
        price: tier.price,
        href: `/tickets#${game.date}`,
      },
      qty,
    );
    setAdded(`${qty} ${tier.name} ${qty === 1 ? "ticket" : "tickets"} for ${gameDay(game)}`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="mb-3 font-medium">Home game</legend>
          <div className="grid gap-2">
            {games.map((g) => (
              <label key={g.date} className={radio}>
                <input type="radio" name="game" value={g.date} checked={g.date === date} onChange={() => setDate(g.date)} className="sr-only" />
                <span>
                  <span className="display block text-2xl">vs {g.opponent}</span>
                  <span className="text-sm text-muted">The Kiln · 7:30 pm</span>
                </span>
                <time dateTime={g.date} className="num shrink-0 text-muted">
                  {gameDay(g)}
                </time>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-medium">Seats</legend>
          <div className="grid gap-2">
            {TIERS.map((t) => (
              <label key={t.id} className={radio}>
                <input type="radio" name="tier" value={t.id} checked={t.id === tierId} onChange={() => setTierId(t.id)} className="sr-only" />
                <span className="min-w-0">
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-sm text-muted">{t.blurb}</span>
                </span>
                <span className="num shrink-0 text-lg text-crimson">${t.price}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-sand pt-6">
          <div>
            <span className="mb-2 block font-medium">
              Tickets
            </span>
            <Stepper value={qty} onChange={setQty} label="tickets" />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Total</p>
            <p className="num text-3xl">${tier.price * qty}</p>
          </div>
        </div>

        <div>
          <button type="button" onClick={addToBag} className="btn btn-primary w-full">
            Add {qty} {qty === 1 ? "ticket" : "tickets"} to bag
          </button>
          <p role="status" className="mt-3 min-h-6 text-sm">
            {added && (
              <>
                Added {added}.{" "}
                <Link href="/cart" className="link font-medium text-crimson">
                  View bag
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="grid place-items-center rounded-[28px] bg-night px-5 py-12 sm:px-10 sm:py-16">
          <ClawsTicket game={game} tier={tier} qty={qty} />
        </div>
        <p className="mt-3 text-sm text-muted">Tickets arrive by email and scan at the Kiln doors from 6:30 pm.</p>
      </div>
    </div>
  );
}

