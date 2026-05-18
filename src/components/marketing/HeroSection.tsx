import Link from "next/link";
import type { FestivalPhase } from "@/lib/festival/phase";
import { HERO } from "@/lib/festival/content";

type Props = { phase: FestivalPhase };

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function HeroSection({ phase }: Props) {
  const cta = HERO.ctaByPhase[phase];

  return (
    <section
      data-section="hero"
      className="border-b border-black"
    >
      <h1 className="sr-only">{HERO.ariaLabel}</h1>

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col gap-6 px-4 py-8 md:gap-8 md:py-12">
        <div
          role="img"
          aria-label={HERO.ariaLabel}
          className="flex min-h-[60svh] w-full flex-1 items-center justify-center border border-black bg-gray-100 p-6 text-center text-sm text-gray-700"
        >
          <span className="block max-w-2xl">[{HERO.imageLabel}]</span>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href={cta.href}
            className={`
              inline-flex min-h-[44px] items-center justify-center
              border border-black bg-white px-6 py-3 text-base font-medium
              hover:bg-gray-100
              md:min-h-[60px] md:px-10 md:py-4 md:text-lg
              ${focusRing}
            `}
          >
            {cta.label}
          </Link>
          <Link
            href={HERO.secondaryLink.href}
            className={`text-sm underline underline-offset-2 ${focusRing}`}
          >
            {HERO.secondaryLink.label}
          </Link>
          <p className="text-xs text-gray-700 md:text-sm">{HERO.reassurance}</p>
        </div>
      </div>
    </section>
  );
}
