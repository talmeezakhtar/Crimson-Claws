import type { Metadata } from "next";
import OrderConfirmation from "@/components/site/OrderConfirmation";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
      <OrderConfirmation />
    </section>
  );
}
