import type { Metadata } from "next";
import CheckoutForm from "@/components/site/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
      <h1 className="display mb-10 text-5xl sm:text-7xl" data-enter>
        Checkout
      </h1>
      <CheckoutForm />
    </section>
  );
}
