import { Suspense } from "react";
import type { Metadata } from "next";
import { getCurrentPhase } from "@/lib/festival/phase";
import { getLineup } from "@/lib/festival/lineup-data";
import { SkipLink } from "@/components/shared/SkipLink";
import { SiteNav } from "@/components/marketing/SiteNav";
import { HeroMap } from "@/components/lineup/HeroMap";
import { LineupView } from "@/components/lineup/LineupView";

export const metadata: Metadata = {
  title: "Lineup · Green Hustle Festival 2026",
  description:
    "Music, food, makers, workshops and talks across three sites in Nottingham city centre on Saturday 30 May 2026.",
};

export default function LineupPage() {
  const phase = getCurrentPhase();
  const lineup = getLineup();

  return (
    <>
      <SkipLink />
      <SiteNav phase={phase} />
      <main
        id="main-content"
        className="flex flex-1 flex-col bg-cream bg-cover bg-scroll bg-center md:bg-fixed"
        style={{ backgroundImage: "url(/images/lineup-bg.jpg)" }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:gap-5 md:px-6 md:py-6">
          <section className="overflow-hidden rounded-3xl bg-cream shadow-card">
            <header
              data-section="lineup-header"
              className="border-b border-ink-300 px-6 py-6 md:px-8 md:py-7"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                Saturday 30 May 2026 · Nottingham city centre
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Green Hustle &lsquo;26 Lineup
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
                Browse what is on across Old Market Square, Sussex Street, and
                the Library. Search the whole festival or filter by category
                and site.
              </p>
            </header>
            <HeroMap />
          </section>
          <Suspense fallback={null}>
            <LineupView phase={phase} lineup={lineup} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
