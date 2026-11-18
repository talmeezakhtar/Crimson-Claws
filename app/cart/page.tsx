import type { Metadata } from "next";
import CartView from "@/components/site/CartView";

export const metadata: Metadata = { title: "Bag" };

export default function CartPage() {
  return (
    <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
      <h1 className="display mb-10 text-5xl sm:text-7xl" data-enter>
        Your bag
      </h1>
      <CartView />
    </section>
  );
}
