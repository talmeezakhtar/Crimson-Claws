"use client";

import { useEffect, useRef, useState } from "react";
import AdmitOneTicket, { TICKET_GEOMETRY, TICKET_LAYOUT, TICKET_TEXTURE } from "@/components/ui/admit-one-ticket";
import type { Game } from "@/data/content";
import { gameDay, nickname, type Tier } from "@/lib/tickets";

const TEXTURE = { ...TICKET_TEXTURE, colorBack: "#790b13", colorFront: "#9d1a24", colorHighlight: "#d9a441", shape: "warp", type: "random", size: 0.6, speed: 0.3 };
const LAYOUT = { ...TICKET_LAYOUT, inkColor: "#fff0dc", watermarkColor: "#d9a441", watermarkOpacity: 0.45 };

/** A Claws match ticket that fills its container's width (up to `max`). */
export default function ClawsTicket({ game, tier, qty = 1, holder, max = 640, tilt = true }: { game: Game; tier: Tier; qty?: number; holder?: string; max?: number; tilt?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.min(max, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);

  return (
    <div ref={box} className="w-full" style={{ aspectRatio: `${TICKET_GEOMETRY.aspect}`, maxWidth: max }}>
      {width > 0 && (
        <AdmitOneTicket
          name={`Claws vs ${nickname(game.opponent)}`}
          presenter={holder ? `${holder} · ${tier.name}` : `Crimson Claws · ${tier.name}`}
          event="Home game · tip-off 7:30 pm"
          venue="The Kiln, Harbour Road"
          dates={gameDay(game)}
          stubText={qty > 1 ? `Admit ${qty}` : "Admit one"}
          watermark={tier.short}
          width={width}
          texture={TEXTURE}
          layout={LAYOUT}
          tilt={tilt ? { maxTilt: 7, glare: 0.12 } : false}
        />
      )}
    </div>
  );
}
