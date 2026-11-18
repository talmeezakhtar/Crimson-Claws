"use client";

import Image from "next/image";
import Link from "next/link";
import Stepper from "./Stepper";
import { shippingFor, subtotal, useCart, useMounted, type CartLine } from "@/lib/cart";

export const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

export function LineThumb({ line }: { line: CartLine }) {
  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface">
      {line.image ? (
        <Image src={line.image} alt="" width={96} height={96} className="h-20 w-20 object-contain" />
      ) : (
        <svg viewBox="0 0 64 40" className="w-16" aria-hidden>
          <path d="M4 2h44a5 5 0 0 0 10 0h2a2 2 0 0 1 2 2v32a2 2 0 0 1-2 2h-2a5 5 0 0 0-10 0H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#790b13" />
          <path d="M53 8v24" stroke="#fff0dc" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M9 14h22M9 20h30M9 26h16" stroke="#fff0dc" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export function Summary({ lines }: { lines: CartLine[] }) {
  const sub = subtotal(lines);
  const ship = shippingFor(lines);
  const hasMerch = lines.some((l) => l.kind === "merch");
  return (
    <dl className="grid gap-3">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="num">{money(sub)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">{hasMerch ? "Shipping" : "Delivery"}</dt>
        <dd className="num">{!hasMerch ? "Email, free" : ship ? money(ship) : "Free"}</dd>
      </div>
      <div className="flex justify-between border-t border-sand pt-3 text-lg">
        <dt className="font-medium">Total</dt>
        <dd className="num font-medium">{money(sub + ship)}</dd>
      </div>
    </dl>
  );
}

export default function CartView() {
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  if (!mounted) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (lines.length === 0)
    return (
      <div className="rounded-[28px] bg-surface px-6 py-16 text-center sm:py-24">
        <h2 className="display text-4xl sm:text-5xl">Your bag is empty</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">Pick up a ball, a jersey or seats for the next home game at the Kiln.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Shop the kit
          </Link>
          <Link href="/tickets" className="btn btn-secondary">
            Get tickets
          </Link>
        </div>
      </div>
    );

  const merch = subtotal(lines.filter((l) => l.kind === "merch"));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <ul className="divide-y divide-sand border-y border-sand">
        {lines.map((l) => (
          <li key={l.id} className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto_5rem_auto] sm:gap-x-5">
            <div className="row-span-2 sm:row-span-1">
              <LineThumb line={l} />
            </div>
            <div className="min-w-0">
              <Link href={l.href} className="link font-medium">
                {l.name}
              </Link>
              <p className="text-sm text-muted">{l.detail}</p>
              <p className="num mt-1 text-sm text-muted">{money(l.price)} each</p>
            </div>
            <button type="button" onClick={() => remove(l.id)} className="grid h-11 w-11 place-items-center self-start rounded-full text-muted transition-colors hover:bg-sand/60 hover:text-ink sm:order-last sm:self-center" aria-label={`Remove ${l.name}, ${l.detail}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <Stepper value={l.qty} onChange={(n) => setQty(l.id, n)} label={`${l.name}, ${l.detail}`} />
            <p className="num text-right text-lg">{money(l.price * l.qty)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[24px] bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="display mb-5 text-3xl">Order summary</h2>
        <Summary lines={lines} />
        {merch > 0 && merch < 100 && <p className="mt-4 text-sm text-muted">Add {money(100 - merch)} more kit for free shipping.</p>}
        <Link href="/checkout" className="btn btn-primary mt-6 w-full">
          Go to checkout
        </Link>
        <p className="mt-3 text-center text-sm text-muted">Demo store: no payment is taken.</p>
      </aside>
    </div>
  );
}
