import type { Metadata, Viewport } from "next";
import { Inter, Jacquard_24, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import LoadingScreen from "@/components/site/LoadingScreen";
import "./globals.css";
import "./loader.css";

// Before first paint: a visitor who already saw the intro this session skips it.
const INTRO_GATE = `try{document.documentElement.dataset.intro=sessionStorage.getItem("cc-intro")?"seen":"playing"}catch(e){document.documentElement.dataset.intro="seen"}`;

// The footer's own type: a cell-drawn blackletter for display, Inter for text, JetBrains Mono for figures.
const jacquard = Jacquard_24({ weight: "400", subsets: ["latin"], variable: "--font-jacquard" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: "Crimson Claws basketball: play our home court", template: "%s · Crimson Claws" },
  description:
    "The Crimson Claws basketball club. Shoot on our 3D home court in your browser, meet Rex the mascot, follow the season and shop the club's balls.",
  openGraph: { title: "Crimson Claws basketball", description: "Shoot on the Claws' home court in your browser." },
};

export const viewport: Viewport = { themeColor: "#790b13" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jacquard.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      </head>
      <body className="flex min-h-full flex-col">
        <LoadingScreen />
        <a
          href="#main"
          className="fixed left-3 top-3 z-50 -translate-y-24 rounded-lg bg-crimson px-4 py-2 text-cream focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
