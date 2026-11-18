"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LineThumb, money, Summary } from "./CartView";
import { useCart, useMounted } from "@/lib/cart";

const field = "mt-1.5 block w-full rounded-xl border border-sand bg-cream px-4 py-3 text-ink placeholder:text-muted/70 focus:border-crimson focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-crimson user-invalid:border-crimson";

function Field({ label, name, hint, ...input }: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-medium">{label}</span>
      <input name={name} className={field} {...input} />
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </label>
  );
}

export default function CheckoutForm() {
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);
  const placeOrder = useCart((s) => s.placeOrder);
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!mounted) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (lines.length === 0)
    return (
      <div className="rounded-[28px] bg-surface px-6 py-16 text-center">
        <h2 className="display text-4xl">Nothing to check out yet</h2>
        <p className="mt-3 text-muted">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop the kit
        </Link>
      </div>
    );

  const hasMerch = lines.some((l) => l.kind === "merch");
  const hasTickets = lines.some((l) => l.kind === "ticket");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    // a short pause so the button's busy state reads as an order being placed
    setTimeout(() => {
      placeOrder({ name: String(data.get("name")).trim(), email: String(data.get("email")).trim() });
      router.push("/checkout/confirmation");
    }, 700);
  };

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
      <div className="grid gap-10">
        <fieldset className="grid gap-5">
          <legend className="display mb-1 text-3xl">Contact</legend>
          <Field label="Full name" name="name" autoComplete="name" required hint={hasTickets ? "Printed on your tickets." : undefined} />
          <Field label="Email" name="email" type="email" autoComplete="email" required hint={hasTickets ? "Your tickets are sent here." : "Your receipt is sent here."} />
        </fieldset>

        {hasMerch && (
          <fieldset className="grid gap-5">
            <legend className="display mb-1 text-3xl">Delivery</legend>
            <Field label="Street address" name="street" autoComplete="street-address" required />
            <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
              <Field label="Town or city" name="city" autoComplete="address-level2" required />
              <Field label="Postcode" name="postcode" autoComplete="postal-code" required />
            </div>
            <p className="text-sm text-muted">Kit ships in 2 working days. Free over $100.</p>
          </fieldset>
        )}

        <fieldset>
          <legend className="display mb-3 text-3xl">Payment</legend>
          <div className="flex gap-4 rounded-2xl border border-dashed border-crimson/40 bg-crimson/[0.04] p-5">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-crimson" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16.5v.01" />
            </svg>
            <p>
              <span className="font-medium">This is a demo store for a fictional club.</span> No card is needed and no money is taken. Placing the order shows your confirmation{hasTickets ? " and tickets" : ""}.
            </p>
          </div>
        </fieldset>
      </div>

      <aside className="h-fit rounded-[24px] bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="display mb-5 text-3xl">Your order</h2>
        <ul className="mb-6 grid gap-4">
          {lines.map((l) => (
            <li key={l.id} className="flex items-center gap-4">
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
        <Summary lines={lines} />
        <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full disabled:cursor-progress disabled:opacity-80">
          {busy ? "Placing order…" : "Place demo order"}
        </button>
        <Link href="/cart" className="link mt-4 block w-fit text-sm text-muted">
          Back to bag
        </Link>
      </aside>
    </form>
  );
}
