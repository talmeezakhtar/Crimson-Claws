import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-8">
      <p className="display text-[clamp(5rem,18vw,12rem)] leading-[0.85] text-crimson">Airball.</p>
      <h1 className="display mt-6 text-4xl sm:text-5xl">That page isn&apos;t on the court</h1>
      <p className="mt-4 max-w-[48ch] text-lg text-muted">The link may be old or mistyped. Try the home page, or take a shot while you&apos;re here.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the home page
        </Link>
        <Link href="/play" className="btn btn-secondary text-ink">
          Play the court
        </Link>
      </div>
    </section>
  );
}
