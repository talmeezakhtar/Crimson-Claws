"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Odometer figure: always shows the real number; the first time it scrolls into view each
 * digit strip spins a full turn (the right-most digit the most) and lands back on it.
 */
export default function CounterRoll({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rolled, setRolled] = useState(false);
  const digits = String(value).split("").map(Number);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRolled(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="num inline-flex overflow-hidden leading-none" aria-label={String(value)}>
      {digits.map((d, i) => {
        const turns = rolled ? 1 + (i === digits.length - 1 ? 1 : 0) : 0;
        return (
          <span key={i} className="relative inline-block h-[1em] w-[0.62em]" aria-hidden>
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(-${d + turns * 10}em)`,
                transition: rolled ? `transform ${1100 + i * 250}ms cubic-bezier(0.16, 1, 0.3, 1)` : "none",
              }}
            >
              {Array.from({ length: 30 }, (_, k) => (
                <span key={k} className="h-[1em] text-center">
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
