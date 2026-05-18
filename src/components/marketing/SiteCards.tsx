import Link from "next/link";
import { SITES, type SiteCard } from "@/lib/festival/content";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function SiteCards({ sites = SITES }: { sites?: SiteCard[] }) {
  return (
    <section
      data-section="sites"
      className="border border-black"
      aria-labelledby="sites-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2
          id="sites-heading"
          className="text-2xl font-semibold sm:text-3xl"
        >
          Three sites, one festival
        </h2>
        <p className="mt-2 text-base text-gray-800">
          Different vibes, all within a 10 minute walk of each other
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {sites.map((site) => (
            <li
              key={site.key}
              className="flex flex-col gap-3 border border-black p-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{site.name}</h3>
                <p className="text-sm uppercase tracking-wide text-gray-700">
                  {site.subtitle}
                </p>
              </div>
              <p className="text-sm text-gray-800">{site.vibe}</p>
              <p className="text-sm text-gray-700">
                {site.counts.stalls} stalls, {site.counts.acts} acts on the
                main stage
              </p>
              <p className="mt-auto pt-2">
                <Link
                  href={`/lineup?site=${site.key}`}
                  className={`text-sm underline underline-offset-2 ${focusRing}`}
                >
                  See what&rsquo;s on at {site.name}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
