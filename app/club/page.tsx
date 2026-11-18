import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our story",
  description: "How a team of Redmere dockworkers in a disused brick kiln became the Crimson Claws, and what a game night at the Kiln is like.",
};

const TIMELINE = [
  { year: "1988", text: "Dockworkers from the Redmere harbour start playing after shifts in the old brick kiln on Harbour Road. Rex appears at the first game in a crimson boiler suit with 15 on the back." },
  { year: "1994", text: "First winning season. The queue for the Kiln now runs past the crane yard, and the club lays its first maple floor." },
  { year: "1999", text: "First league title, won by four points in the Harbour derby against the Harbor Hawks." },
  { year: "2008", text: "The Kiln is rebuilt inside its own brick walls: 4,800 seats, and the old chimney kept above the main doors." },
  { year: "2014", text: "Claws Academy opens. Free Saturday sessions for any kid in Redmere, run by the first team." },
  { year: "2019", text: "Second league title, in the first season of the ivory away kit with its gold piping." },
  { year: "2025", text: "41 home wins, the best home record in the club's history." },
  { year: "2026", text: "Jalen Brooks is named captain for the 38th season at the Kiln." },
];

const GAME_NIGHT = [
  { time: "6:30 pm", title: "The shootaround", text: "Doors open an hour early and the court is yours. Anyone with a ticket can shoot until the teams walk out." },
  { time: "7:25 pm", title: "The harbour horn", text: "The lights drop and the old crane horn from the docks sounds three times, once for each founding crew." },
  { time: "7:30 pm", title: "Claws out", text: "At tip-off, 4,800 hands go up curled like a crane grab and stay up until the Claws score." },
  { time: "Every three", title: "Rex roars", text: "Rex climbs the baseline steps and roars at the away bench. He has not missed a three since 1988." },
  { time: "Half-time", title: "The half-court shot", text: "One fan, one ball, from the half-way line. Make it and the seat is yours for next season." },
  { time: "Final buzzer", title: "The win brick", text: "After every home win the starting five sign a brick with the score, and it goes into the wall by the main doors." },
];

export default function ClubPage() {
  return (
    <>
      {/* opening: the name and the year */}
      <section className="wrap mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-20">
        <div data-enter>
          <h1 className="display text-5xl sm:text-7xl">The Crimson Claws, at the Kiln since 1988</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-muted">
            A harbour club from Redmere, named for the brick dust on its first home and the crane claws outside its windows. Thirty-eight seasons later
            the walls are the same, the mascot is the same, and the doors still open an hour early so anyone can shoot.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tickets" className="btn btn-primary">
              Get tickets
            </Link>
            <Link href="/roster" className="btn btn-secondary text-ink">
              Meet the roster
            </Link>
          </div>
        </div>
        <div className="zoom relative aspect-[4/3] overflow-hidden rounded-[28px] bg-night lg:aspect-[5/4]">
          <Image src="/media/rex-dunk.webp" alt="Rex, the Claws mascot, hanging off the rim after a dunk" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* where the name comes from */}
      <section className="bg-surface">
        <div className="wrap mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-28">
          <div className="zoom relative aspect-[4/5] overflow-hidden rounded-[28px] bg-night">
            <Image src="/media/dunk-rim.webp" alt="A hand rising to dunk a ball over the orange rim" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="self-center">
            <h2 className="display text-4xl sm:text-6xl">Brick dust and crane claws</h2>
            <div className="mt-6 grid max-w-[60ch] gap-5 text-lg">
              <p>
                In the spring of 1988 the night crew at the Redmere docks found a way into the brick kiln on Harbour Road, shut since the sixties. They
                swept it out, bolted a hoop to the chimney breast and played after every shift.
              </p>
              <p>
                The kiln walls still shed a fine red dust, and inside a month every white practice shirt had turned the same deep crimson. Outside, the
                harbour cranes swung their steel grabs past the windows all night. The crane crews called them claws.
              </p>
              <p className="text-muted">
                The first crest was a crane claw holding a ball. It still is. The club&apos;s first coach, crane driver Ada Mercer, drew it on the back
                of a shipping manifest, and the original hangs in the Kiln&apos;s main corridor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* the years */}
      <section className="on-night bg-night text-cream">
        <div className="wrap mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
          <h2 className="display max-w-3xl text-4xl sm:text-6xl">Thirty-eight seasons on Harbour Road</h2>
          <ol className="mt-12 border-t border-night-surface">
            {TIMELINE.map((t) => (
              <li key={t.year} className="grid gap-2 border-b border-night-surface py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <span className="num text-2xl text-[#d9a441]">{t.year}</span>
                <p className="max-w-[62ch] text-lg text-cream/85">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* the culture: one night at the Kiln, hour by hour */}
      <section className="wrap mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="display text-4xl sm:text-6xl">A game night at the Kiln</h2>
            <p className="mt-5 max-w-[44ch] text-lg text-muted">
              Every home game runs the same way, and has since the first crews stood on upturned crates to watch. Come once and you will know it by heart.
            </p>
          </div>
          <ol className="grid gap-4">
            {GAME_NIGHT.map((g) => (
              <li key={g.title} className="grid gap-1 rounded-[22px] bg-surface p-6 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <span className="num pt-1 text-crimson">{g.time}</span>
                <div>
                  <h3 className="display text-2xl">{g.title}</h3>
                  <p className="mt-1 text-muted">{g.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rex and the town */}
      <section className="on-night bg-crimson text-cream">
        <div className="wrap mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <h2 className="display text-4xl sm:text-5xl">Rex, number 15</h2>
            <p className="mt-5 max-w-[50ch] text-lg text-cream/85">
              Rex was sewn together by the founders&apos; families in 1988 and has worn 15 ever since, for the fifteen crews that worked the docks
              that year. He dribbles through every timeout, and on Saturday mornings he runs the warm-up at the Academy.
            </p>
            <Link href="/#mascot" className="btn btn-light mt-8">
              Meet Rex in 3D
            </Link>
          </div>
          <div>
            <h2 className="display text-4xl sm:text-5xl">Claws Academy</h2>
            <p className="mt-5 max-w-[50ch] text-lg text-cream/85">
              Free sessions at the Kiln every Saturday from 9 am, for any kid from Redmere aged 8 to 16. The first team coaches, the balls are
              ours, and no one needs to sign up first. Every December home game doubles as the Harbour Road food drive: bring a tin, get a free
              hot drink.
            </p>
            <Link href="/schedule" className="btn btn-secondary mt-8 text-cream">
              See home games
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
