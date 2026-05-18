"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  type Category,
  type LineupItem,
  type SiteKey,
} from "@/lib/festival/lineup";
import { type FestivalPhase, getNow } from "@/lib/festival/phase";
import {
  countByCategory,
  countBySite,
  filterLineup,
  isSearchActive,
  sortLineup,
  type Filters,
} from "@/lib/festival/filters";
import { LineupControlBar } from "./LineupControlBar";
import { LineupFeed, type EmptyState } from "./LineupFeed";
import { OnNowBanner } from "./OnNowBanner";
import { SavedProvider, useSaved } from "./SavedContext";
import type { NavTarget } from "./types";

type Props = {
  phase: FestivalPhase;
  lineup: LineupItem[];
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function parseSite(value: string | null): SiteKey | null {
  if (value === "market" || value === "sussex" || value === "library")
    return value;
  return null;
}

function parseCategory(value: string | null): Category | null {
  if (
    value === "music" ||
    value === "food" ||
    value === "markets" ||
    value === "workshops" ||
    value === "talks"
  )
    return value;
  return null;
}

function getNowMinutesUK(d: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  return h * 60 + m;
}

export function LineupView({ phase, lineup }: Props) {
  return (
    <SavedProvider>
      <LineupViewInner phase={phase} lineup={lineup} />
    </SavedProvider>
  );
}

function LineupViewInner({ phase, lineup }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { savedIds } = useSaved();

  const urlSite = parseSite(params.get("site"));
  const urlCategory = parseCategory(params.get("category"));
  const urlSavedActive = params.get("saved") === "1";

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<NavTarget | null>(null);
  const [mapView, setMapView] = useState(false);

  const isFestivalDay = phase === "festival-day";

  const filters: Filters = {
    search,
    category: urlCategory,
    site: urlSite,
  };

  const searchActive = isSearchActive(filters);

  // Pre-filter by saved IDs when saved filter is active, so all
  // downstream filters/counts naturally compose with the saved scope.
  const scopedLineup = useMemo(
    () =>
      urlSavedActive ? lineup.filter((i) => savedIds.has(i.id)) : lineup,
    [lineup, urlSavedActive, savedIds]
  );

  const filtered = useMemo(
    () => filterLineup(scopedLineup, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scopedLineup, filters.search, filters.category, filters.site]
  );
  const sorted = useMemo(() => sortLineup(filtered), [filtered]);
  const categoryCounts = useMemo(
    () => countByCategory(scopedLineup, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scopedLineup, filters.search, filters.category, filters.site]
  );
  const siteCounts = useMemo(
    () => countBySite(scopedLineup, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scopedLineup, filters.search, filters.category, filters.site]
  );

  const writeParams = (next: URLSearchParams) => {
    const q = next.toString();
    const url = q ? `${pathname}?${q}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setSiteParam = (next: SiteKey | null) => {
    const updated = new URLSearchParams(params.toString());
    if (next === null) updated.delete("site");
    else updated.set("site", next);
    writeParams(updated);
  };

  const setCategoryParam = (next: Category | null) => {
    const updated = new URLSearchParams(params.toString());
    if (next === null) updated.delete("category");
    else updated.set("category", next);
    writeParams(updated);
  };

  const setSavedParam = (next: boolean) => {
    const updated = new URLSearchParams(params.toString());
    if (next) updated.set("saved", "1");
    else updated.delete("saved");
    writeParams(updated);
  };

  const isOMSOnly =
    urlSite === "market" ||
    (sorted.length > 0 && sorted.every((i) => i.site === "market"));
  const lastIsOMSOnly = useRef(isOMSOnly);
  useEffect(() => {
    if (lastIsOMSOnly.current && !isOMSOnly) setMapView(false);
    lastIsOMSOnly.current = isOMSOnly;
  }, [isOMSOnly]);

  const emptyState: EmptyState = (() => {
    if (sorted.length > 0) return { kind: "none" };
    if (urlSavedActive && savedIds.size === 0) return { kind: "saved-empty" };
    if (searchActive) return { kind: "search", query: search };
    if (urlSite && urlCategory)
      return { kind: "category-at-site", site: urlSite };
    return { kind: "none" };
  })();

  const nowMinutes = isFestivalDay ? getNowMinutesUK(getNow()) : null;

  function handleBannerSelect(t: {
    site: SiteKey;
    itemId: string;
    subItemId?: string;
  }) {
    // Clear filters that might hide the target, narrow to its site.
    setSearch("");
    const updated = new URLSearchParams(params.toString());
    updated.delete("category");
    updated.set("site", t.site);
    writeParams(updated);
    setTarget({
      itemId: t.itemId,
      subItemId: t.subItemId,
      nonce: Date.now(),
    });
  }

  return (
    <div className="sticky top-14 z-30 flex h-[calc(100svh-3.5rem)] min-w-0 flex-col gap-4 md:h-[calc(100svh-5rem)] md:gap-5">
      <section className="min-w-0 shrink-0 overflow-hidden rounded-3xl bg-cream shadow-card">
        <LineupControlBar
          search={search}
          onSearchChange={setSearch}
          category={urlCategory}
          onCategoryChange={setCategoryParam}
          categoriesDisabled={searchActive}
          categoryCounts={categoryCounts}
          site={urlSite}
          onSiteChange={setSiteParam}
          siteCounts={siteCounts}
          savedActive={urlSavedActive}
          onSavedToggle={() => setSavedParam(!urlSavedActive)}
        />
        {isFestivalDay && (
          <OnNowBanner items={lineup} onSelect={handleBannerSelect} />
        )}
      </section>

      <section className="-mx-4 flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-t-3xl bg-cream shadow-card md:mx-0 md:rounded-3xl">
        <div className="scrollbar-hide h-full w-full overflow-y-auto py-4 md:px-6 md:py-8">
          {isOMSOnly && !mapView && (
            <button
              type="button"
              onClick={() => setMapView(true)}
              className={`mb-4 flex w-full min-h-11 items-center justify-center rounded-full border border-ink-300 bg-cream-50 px-4 py-2 text-sm font-medium text-ink hover:border-ink hover:bg-cream-100 min-[900px]:hidden ${focusRing}`}
            >
              View Old Market Square map
            </button>
          )}
          {mapView ? (
            <div className="flex flex-col gap-3 min-[900px]:hidden">
              <button
                type="button"
                onClick={() => setMapView(false)}
                className={`self-start min-h-11 rounded-full border border-ink-300 bg-cream-50 px-4 py-2 text-sm font-medium text-ink hover:border-ink hover:bg-cream-100 ${focusRing}`}
              >
                Back to list
              </button>
              <div
                role="img"
                aria-label="Sitemap of Old Market Square, illustrated, with tappable pitches"
                className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-50 p-4 text-center text-sm text-ink-500"
              >
                [OMS sitemap, illustrated, tappable pitches]
              </div>
              <p className="text-xs text-ink-500">
                Map view shows Old Market Square only on mobile. Sussex St and
                Library use the list view.
              </p>
            </div>
          ) : (
            <LineupFeed
              items={sorted}
              emptyState={emptyState}
              nowMinutes={nowMinutes}
              target={target}
            />
          )}
        </div>
      </section>
    </div>
  );
}
