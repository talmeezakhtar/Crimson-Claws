import WildHuntFooter from "@/components/ui/wild-hunt-footer";

const COLUMNS = [
  { title: "Club", links: [{ label: "Our story", href: "/club" }, { label: "Roster", href: "/roster" }, { label: "Schedule", href: "/schedule" }, { label: "Media", href: "/media" }, { label: "Tickets", href: "/tickets" }] },
  { title: "Play", links: [{ label: "Play the court", href: "/play" }, { label: "Meet Rex", href: "/#mascot" }, { label: "60s challenge", href: "/play" }] },
  { title: "Shop", links: [{ label: "Basketballs", href: "/shop" }, { label: "Jerseys", href: "/shop" }, { label: "Kit", href: "/shop" }] },
  { title: "Contact", links: [{ label: "tickets@crimsonclaws.example", href: "mailto:tickets@crimsonclaws.example" }, { label: "The Kiln, Harbour Road", href: "/schedule" }] },
];

export default function Footer() {
  return (
    <div className="relative">
    <WildHuntFooter
      wordmark="CRIMSON CLAWS"
      image={{
        src: "/media/footer-net.webp",
        alt: "A basketball dropping through the net at sunset",
        position: "50% 40%",
        cutout: "/brand/footer-cutout.webp",
      }}
      palette={{ background: "#790b13", ink: "#fff0dc" }}
      tagline="Claws out at the Kiln · home games 7:30 pm · doors an hour before"
      sideNote="Founded 1988 · Harbour Road, Redmere · home of Rex"
      columns={COLUMNS}
      colophon="Footer photograph by MarcoCrupi via Wikimedia Commons (CC BY-SA 3.0). Crimson Claws is a fictional club."
      legal="© 2026 Crimson Claws"
      fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
      monoFamily="var(--font-jetbrains), ui-monospace, monospace"
      height="min(100svh, 860px)"
    />
      {/* the photo rises out of the club crimson, so whatever sits above meets one flat colour */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[30%] bg-gradient-to-b from-crimson via-crimson/70 to-transparent" />
    </div>
  );
}
