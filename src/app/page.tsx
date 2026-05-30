import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getLineup } from "@/lib/festival/lineup-data";
import { SkipLink } from "@/components/shared/SkipLink";
import { SiteNav } from "@/components/marketing/SiteNav";
import { LineupView } from "@/components/lineup/LineupView";

export const metadata: Metadata = {
  title: "Lineup · Green Hustle Festival 2026",
  description:
    "Music, food, makers, workshops and talks across three sites in Nottingham city centre on Saturday 30 May 2026.",
};

export default function LineupPage() {
  const lineup = getLineup();

  return (
    <>
      <SkipLink />
      <SiteNav />
      <main
        id="main-content"
        className="flex flex-1 flex-col bg-[#efebe1]"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
          <header
            data-section="lineup-header"
            className="grid grid-cols-[1fr_auto] items-start gap-4 md:gap-6"
          >
            <div className="min-w-0">
              <h1 className="font-chunk text-4xl uppercase leading-[0.95] tracking-wide text-brand-navy sm:text-5xl md:text-6xl">
                Festival Lineup
              </h1>
              <p className="mt-3 max-w-md text-sm text-brand-navy md:text-base">
                A day of talks, workshops, music, food and community action.
              </p>
            </div>
            <Image
              src="/images/vectors/gh26_sowgood_vector.svg"
              alt=""
              aria-hidden="true"
              width={220}
              height={220}
              className="h-24 w-auto shrink-0 md:h-36 lg:h-44"
              priority
            />
          </header>

          <ul
            aria-label="Festival sites"
            className="grid grid-cols-3 items-center justify-items-center gap-3 md:gap-6"
          >
            {[
              { src: "/images/vectors/gathermoveimagine/gather_hero.svg", alt: "Old Market Square — Gather" },
              { src: "/images/vectors/gathermoveimagine/move_hero.svg", alt: "Sussex Street — Move" },
              { src: "/images/vectors/gathermoveimagine/imagine_hero.svg", alt: "Notts Central Library — Imagine" },
            ].map((logo) => (
              <li key={logo.src} className="flex w-full justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={723}
                  height={618}
                  className="h-auto w-full max-w-[180px] md:max-w-[240px]"
                />
              </li>
            ))}
          </ul>

          <Suspense fallback={null}>
            <LineupView lineup={lineup} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
