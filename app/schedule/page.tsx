import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import { SCHEDULE } from "@/data/content";

export const metadata: Metadata = { title: "Schedule" };

const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export default function SchedulePage() {
  const played = SCHEDULE.filter((g) => g.result);
  const wins = played.filter((g) => g.result!.us > g.result!.them).length;

  return (
    <section className="wrap mx-auto w-full max-w-5xl px-4 py-16 sm:px-8 lg:py-24">
      <PageHeader
        title={`Claws schedule: ${wins} wins, ${played.length - wins} losses so far`}
        intro="Home games are at the Kiln on Harbour Road and tip off at 7:30 pm. Doors open an hour before for the shootaround."
      />
      <ol className="divide-y divide-sand border-y border-sand">
        {SCHEDULE.map((g) => {
          const win = g.result && g.result.us > g.result.them;
          return (
            <li key={g.date} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[8rem_1fr_auto]">
              <time dateTime={g.date} className="num text-sm text-muted sm:text-base">
                {fmt.format(new Date(g.date))}
              </time>
              <div className="min-w-0">
                <p className="display truncate text-xl sm:text-3xl">
                  <span className="text-muted">{g.home ? "vs" : "at"}</span> {g.opponent}
                </p>
                <p className="text-sm text-muted">{g.home ? "Home, the Kiln" : "Away"}</p>
              </div>
              {g.result ? (
                <span className="num text-right text-lg sm:text-2xl">
                  <span className={win ? "text-crimson" : "text-muted"}>{win ? "W" : "L"}</span> {g.result.us}–{g.result.them}
                </span>
              ) : g.home ? (
                <Link href={`/tickets#${g.date}`} className="btn btn-primary min-h-11 px-4 text-sm">
                  Get tickets
                </Link>
              ) : (
                <span className="rounded-md bg-sand px-2.5 py-1 text-sm font-medium text-ink">Upcoming</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
