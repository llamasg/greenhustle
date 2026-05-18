import Link from "next/link";
import type { FestivalPhase } from "@/lib/festival/phase";
import { SITE_NAV } from "@/lib/festival/content";

type Props = { phase: FestivalPhase };

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function SiteNav({ phase }: Props) {
  return (
    <header
      data-section="site-nav"
      className="sticky top-0 z-40 border-b border-black bg-white"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"
      >
        <Link
          href="/"
          className={`text-base font-semibold ${focusRing}`}
        >
          {SITE_NAV.brand}
        </Link>
        <ul className="flex items-center gap-3 text-sm sm:gap-5">
          {SITE_NAV.links.map((link) => {
            const isLive = phase === "festival-day" && link.liveLabel;
            return (
              <li key={link.label} className="flex items-center">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 border border-transparent px-1 py-1 hover:underline ${focusRing}`}
                >
                  {isLive ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 rounded-full bg-black animate-pulse"
                      />
                      <span>{link.liveLabel}</span>
                    </>
                  ) : (
                    <span>{link.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
