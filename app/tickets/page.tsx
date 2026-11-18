import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import TicketPicker from "@/components/site/TicketPicker";

export const metadata: Metadata = { title: "Tickets" };

export default function TicketsPage() {
  return (
    <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
      <PageHeader
        title="Claws home game tickets"
        intro="Three home games left before the new year at the Kiln. Pick a game and your seats; tip-off is 7:30 pm and doors open at 6:30."
      />
      <TicketPicker />
    </section>
  );
}
