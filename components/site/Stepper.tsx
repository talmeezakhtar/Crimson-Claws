"use client";

import { MAX_QTY } from "@/lib/cart";

const btn = "grid h-11 w-11 place-items-center rounded-full border border-sand transition-colors hover:border-crimson/50 disabled:pointer-events-none disabled:opacity-35";

/** Quantity control: minus, the number, plus. */
export default function Stepper({ value, onChange, label, min = 1 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer: ${label}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M5 12h14" />
        </svg>
      </button>
      <output className="num w-9 text-center text-lg" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={`More: ${label}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
  );
}
