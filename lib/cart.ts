"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// The bag: merch and match tickets together, kept in this browser only (demo checkout, no payment).

export type CartLine = {
  id: string; // product + options, so the same item in the same size stacks
  kind: "merch" | "ticket";
  name: string;
  detail: string; // "Home · size L" or "Sat 21 Nov · Lower bowl"
  price: number; // each
  qty: number;
  image?: string;
  href: string; // where to see it again
};

export type Order = { number: string; lines: CartLine[]; total: number; name: string; email: string; placedAt: string };

type CartState = {
  lines: CartLine[];
  lastOrder: Order | null;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  placeOrder: (who: { name: string; email: string }) => Order;
};

export const MAX_QTY = 10;
export const SHIPPING = 6;

export const subtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);
// Tickets go to your email, so only merch pays shipping; over $100 of merch ships free.
export const shippingFor = (lines: CartLine[]) => {
  const merch = subtotal(lines.filter((l) => l.kind === "merch"));
  return merch === 0 || merch >= 100 ? 0 : SHIPPING;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      lastOrder: null,
      add: (line, qty = 1) =>
        set((s) => {
          const found = s.lines.find((l) => l.id === line.id);
          if (found) return { lines: s.lines.map((l) => (l.id === line.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)) };
          return { lines: [...s.lines, { ...line, qty: Math.min(MAX_QTY, qty) }] };
        }),
      setQty: (id, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      placeOrder: (who) => {
        const lines = get().lines;
        const order: Order = {
          number: "CC-" + Math.floor(100000 + Math.random() * 900000),
          lines,
          total: subtotal(lines) + shippingFor(lines),
          ...who,
          placedAt: new Date().toISOString(),
        };
        set({ lines: [], lastOrder: order });
        return order;
      },
    }),
    { name: "claws-bag" },
  ),
);

export const useCartCount = () => useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));

/** False during server render and hydration, true after: the bag lives in localStorage, so render it only once mounted. */
const noop = () => () => {};
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
