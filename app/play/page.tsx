import type { Metadata } from "next";
import { GameLoader } from "@/components/game/Loaders";

export const metadata: Metadata = { title: "Play" };

export default function PlayPage() {
  return (
    <section className="relative h-[100svh] min-h-[480px] w-full overflow-hidden bg-night">
      <h1 className="sr-only">Shoot on the Crimson Claws home court</h1>
      <GameLoader />
    </section>
  );
}
