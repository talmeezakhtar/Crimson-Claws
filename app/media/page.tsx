import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import { GALLERY } from "@/data/content";

export const metadata: Metadata = { title: "Media" };

export default function MediaPage() {
  return (
    <>
      <section className="wrap mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <PageHeader
          title="Claws photos from the court"
          intro="Game nights, Rex in the air and the light on the rim. Take your own from the 3D court with Photo mode."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:auto-rows-[19rem] lg:grid-cols-3">
          {GALLERY.map((p, i) => (
            <div key={p.src} className={`zoom relative aspect-[4/3] overflow-hidden rounded-[22px] bg-night lg:aspect-auto ${p.span} ${i === 0 ? "aspect-[3/4] sm:row-span-2 sm:aspect-auto" : ""}`}>
              <Image src={p.src} alt={p.alt} fill priority={i < 2} sizes={i === 1 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="wrap mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="display text-4xl sm:text-5xl">Photo mode on the 3D court</h2>
            <p className="mt-3 max-w-[56ch] text-muted">
              Pick a spot, set the time of day to dawn, dusk or night, and save the frame as a PNG.
            </p>
          </div>
          <Link href="/play" className="btn btn-primary">
            Open Photo mode
          </Link>
        </div>
      </section>
    </>
  );
}
