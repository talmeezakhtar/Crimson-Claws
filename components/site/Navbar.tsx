"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCartCount, useMounted } from "@/lib/cart";

const LINKS = [
  { href: "/club", label: "Club" },
  { href: "/roster", label: "Roster" },
  { href: "/schedule", label: "Schedule" },
  { href: "/tickets", label: "Tickets" },
  { href: "/media", label: "Media" },
  { href: "/shop", label: "Shop" },
];

// Pages whose first screen is the full-bleed court: the bar floats over it.
const OVERLAY = new Set(["/", "/play"]);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = OVERLAY.has(pathname);
  const count = useCartCount();
  const mounted = useMounted();
  const items = mounted ? count : 0;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    // past the court (one screen minus the bar), the bar turns solid again
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // over the court, and while the menu is open, the bar is cream on dark
  const light = open || (overlay && !scrolled);

  return (
    <>
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-colors duration-300 ${
        open
          ? "on-night border-b border-transparent bg-transparent text-cream"
          : light
            ? "on-night bg-gradient-to-b from-night/70 to-transparent text-cream"
            : "border-b border-sand/70 bg-cream/90 text-ink backdrop-blur-md"
      }`}
    >
      <nav className="wrap mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Crimson Claws home" className="justify-self-start">
          <Logo light={light} />
        </Link>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`link text-[0.95rem] font-medium ${
                  pathname === l.href ? (light ? "text-cream" : "text-crimson") : light ? "text-cream/85 hover:text-cream" : "text-ink/80 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            aria-label={items ? `Bag, ${items} ${items === 1 ? "item" : "items"}` : "Bag, empty"}
            aria-current={pathname === "/cart" ? "page" : undefined}
            className={`relative grid h-11 w-11 place-items-center rounded-lg transition-colors ${light ? "hover:bg-cream/10" : "hover:bg-sand/60"}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
              <path d="M5 8h14l-1.2 12H6.2z" />
              <path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="round" />
            </svg>
            {items > 0 && (
              <span className="num absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-crimson px-1 text-[0.7rem] font-medium text-cream ring-2 ring-cream">
                {items}
              </span>
            )}
          </Link>
          {pathname !== "/play" && (
            <div className="hidden sm:block">
              <Link href="/play" className={`btn min-h-11 whitespace-nowrap ${light ? "btn-light" : "btn-primary"}`}>
                Play the court
              </Link>
            </div>
          )}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

    </header>

    {/* Outside the header on purpose: the header's backdrop-filter would make a fixed child size itself to the header. */}
    {open && (
      <div className="on-night fixed inset-0 z-30 flex flex-col overflow-y-auto bg-night/80 px-4 pb-8 pt-20 text-cream backdrop-blur-xl lg:hidden">
        <ul className="flex-1">
          {[{ href: "/", label: "Home" }, ...LINKS].map((l) => (
            <li key={l.href} className="border-b border-cream/15">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`display block py-4 text-4xl ${pathname === l.href ? "text-[#d9a441]" : "text-cream"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/play" onClick={() => setOpen(false)} className="btn btn-light mt-6 w-full">
          Play the court
        </Link>
      </div>
    )}
    </>
  );
}