"use client";

import Link from "next/link";
import ClawsTicket from "./ClawsTicket";
import { LineThumb, money } from "./CartView";
import { useCart, useMounted } from "@/lib/cart";
import { gameByDate, tierById } from "@/lib/tickets";

export default function OrderConfirmation() {
  const mounted = useMounted();
  const order = useCart((s) => s.lastOrder);

  if (!mounted) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (!order)
    return (
      <div className="rounded-[28px] bg-surface px-6 py-16 text-center">
        <h1 className="display text-5xl">No order yet</h1>
        <p className="mt-3 text-muted">Orders you place on this device show up here.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop the kit
        </Link>
      </div>
    );

  const tickets = order.lines.filter((l) => l.kind === "ticket");
  const merch = order.lines.filter((l) => l.kind === "merch");
  const first = order.name.split(" ")[0];

  return (
    <div>
      <div className="mb-12 max-w-3xl" data-enter>
        <h1 className="display text-5xl sm:text-7xl">Thanks, {first}. Claws out.</h1>
        <p className="mt-5 text-lg text-muted">
          Order <span className="num text-ink">{order.number}</span> is placed. A copy goes to <span className="text-ink">{order.email}</span>. This was a demo order, so nothing was charged.
        </p>
      </div>

      {tickets.length > 0 && (
        <section aria-labelledby="t-head" className="mb-14 rounded-[28px] bg-night px-5 py-10 text-cream sm:px-10 sm:py-14">
          <h2 id="t-head" className="display mb-8 text-4xl">
            Your {tickets.reduce((n, t) => n + t.qty, 0) === 1 ? "ticket" : "tickets"}
          </h2>
          <div className="grid justify-items-center gap-10 xl:grid-cols-2">
            {tickets.map((t) => {
              const [, date, tierId] = t.id.split(":");
              return <ClawsTicket key={t.id} game={gameByDate(date)} tier={tierById(tierId)} qty={t.qty} holder={order.name} max={560} />;
            })}
          </div>
          <p className="mt-8 text-night-muted">Show them at the Kiln doors from 6:30 pm. Each one scans once.</p>
        </section>
      )}

      {merch.length > 0 && (
        <section aria-labelledby="m-head" className="mb-14">
          <h2 id="m-head" className="display mb-6 text-4xl">
            Your kit
          </h2>
          <ul className="divide-y divide-sand border-y border-sand">
            {merch.map((l) => (
              <li key={l.id} className="flex items-center gap-5 py-4">
                <LineThumb line={l} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-sm text-muted">
                    {l.detail} · <span className="num">×{l.qty}</span>
                  </p>
                </div>
                <p className="num">{money(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted">Ships in 2 working days.</p>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
        <p className="text-lg">
          Total <span className="num ml-2 text-2xl">{money(order.total)}</span>
        </p>
        <Link href="/play" className="btn btn-primary">
          Warm up on the court
        </Link>
      </div>
    </div>
  );
}
