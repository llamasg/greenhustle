"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  type Category,
  type LineupItem,
  type SiteKey,
} from "@/lib/festival/lineup";
import { getNow } from "@/lib/festival/phase";
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
import { OpenCardProvider, useOpenCard } from "./OpenCardContext";
import type { FeaturedSearch } from "./ContainerCard";
import {
  OMSMainStageCard,
  OMS_MAIN_STAGE_ID,
  OMS_MAIN_STAGE_SEARCH,
  OMS_MAIN_STAGE_SITE,
} from "./featured/OMSMainStageCard";
import {
  GrowYourselfHubCard,
  GROW_YOURSELF_HUB_ID,
  GROW_YOURSELF_HUB_SEARCH,
  GROW_YOURSELF_HUB_SITE,
} from "./featured/GrowYourselfHubCard";
import {
  SussexStageCard,
  SUSSEX_STAGE_ID,
  SUSSEX_STAGE_SEARCH,
  SUSSEX_STAGE_SITE,
} from "./featured/SussexStageCard";
import {
  MeanderersWalksCard,
  MEANDERERS_WALKS_ID,
  MEANDERERS_WALKS_SEARCH,
  MEANDERERS_WALKS_SITE,
} from "./featured/MeanderersWalksCard";
import {
  WildNGWalksCard,
  WILD_NG_WALKS_ID,
  WILD_NG_WALKS_SEARCH,
  WILD_NG_WALKS_SITE,
} from "./featured/WildNGWalksCard";
import type { NavTarget } from "./types";

type FeaturedCard = {
  id: string;
  site: SiteKey;
  search: FeaturedSearch;
  render: (
    nowMinutes: number | null,
    target: NavTarget | null
  ) => React.ReactElement;
};

// Manifest of bespoke programmes pinned above the spreadsheet-driven feed.
// Order here drives display order when no site filter is applied (market →
// sussex → library, then walks within library).
const FEATURED_CARDS: FeaturedCard[] = [
  {
    id: OMS_MAIN_STAGE_ID,
    site: OMS_MAIN_STAGE_SITE,
    search: OMS_MAIN_STAGE_SEARCH,
    render: (nowMinutes, target) => (
      <OMSMainStageCard nowMinutes={nowMinutes} target={target} />
    ),
  },
  {
    id: GROW_YOURSELF_HUB_ID,
    site: GROW_YOURSELF_HUB_SITE,
    search: GROW_YOURSELF_HUB_SEARCH,
    render: (nowMinutes, target) => (
      <GrowYourselfHubCard nowMinutes={nowMinutes} target={target} />
    ),
  },
  {
    id: SUSSEX_STAGE_ID,
    site: SUSSEX_STAGE_SITE,
    search: SUSSEX_STAGE_SEARCH,
    render: (nowMinutes, target) => (
      <SussexStageCard nowMinutes={nowMinutes} target={target} />
    ),
  },
  {
    id: MEANDERERS_WALKS_ID,
    site: MEANDERERS_WALKS_SITE,
    search: MEANDERERS_WALKS_SEARCH,
    render: (nowMinutes, target) => (
      <MeanderersWalksCard nowMinutes={nowMinutes} target={target} />
    ),
  },
  {
    id: WILD_NG_WALKS_ID,
    site: WILD_NG_WALKS_SITE,
    search: WILD_NG_WALKS_SEARCH,
    render: (nowMinutes, target) => (
      <WildNGWalksCard nowMinutes={nowMinutes} target={target} />
    ),
  },
];

// Subtle section divider used between the pinned "Curated Programmes"
// and the rest of the "Stalls & Activities" feed: small uppercase label
// with a thin rule extending to the right.
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 md:mb-4">
      <h2 className="shrink-0 text-xs font-semibold uppercase tracking-widest text-ink-500">
        {children}
      </h2>
      <div aria-hidden="true" className="h-px flex-1 bg-ink-300/60" />
    </div>
  );
}

function featuredHaystack(search: FeaturedSearch): string {
  const parts: string[] = [
    search.title,
    search.shortDescription ?? "",
    search.longDescription ?? "",
  ];
  for (const s of search.subItems) {
    parts.push(s.title);
    if (s.summary) parts.push(s.summary);
  }
  return parts.join(" ").toLowerCase();
}

type Props = {
  lineup: LineupItem[];
};

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

export function LineupView({ lineup }: Props) {
  return (
    <SavedProvider>
      <OpenCardProvider>
        <LineupViewInner lineup={lineup} />
      </OpenCardProvider>
    </SavedProvider>
  );
}

function LineupViewInner({ lineup }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { savedIds } = useSaved();
  const { setOpenId } = useOpenCard();

  const urlSite = parseSite(params.get("site"));
  const urlCategory = parseCategory(params.get("category"));
  const urlSavedActive = params.get("saved") === "1";

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<NavTarget | null>(null);

  // The page is statically prerendered, so `nowMinutes` is computed on
  // the client and re-ticks every 30s to keep "live now" indicators
  // honest as the day progresses. Starts null on the server to avoid
  // hydration mismatch — the client populates immediately on mount.
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      setNowMinutes(getNowMinutesUK(getNow()));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const filters: Filters = {
    search,
    category: urlCategory,
    site: urlSite,
  };

  const searchActive = isSearchActive(filters);

  // Featured cards matched by the current search, in manifest order. Used
  // both to render the pinned section during search and to drive the
  // auto-open effect below.
  const matchingFeatured = useMemo(() => {
    if (!searchActive) return [];
    const q = search.trim().toLowerCase();
    return FEATURED_CARDS.filter((card) => {
      if (urlSite && urlSite !== card.site) return false;
      if (urlSavedActive && !savedIds.has(card.id)) return false;
      return featuredHaystack(card.search).includes(q);
    });
  }, [searchActive, search, urlSite, urlSavedActive, savedIds]);

  // Auto-open the first matching featured card during search so the user
  // sees the matching sub-item without an extra click. Single-open
  // accordion: if multiple match, only the first expands.
  useEffect(() => {
    if (!searchActive) return;
    if (matchingFeatured.length === 0) return;
    setOpenId(matchingFeatured[0].id);
  }, [searchActive, matchingFeatured, setOpenId]);

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

  const emptyState: EmptyState = (() => {
    if (sorted.length > 0) return { kind: "none" };
    // Featured cards are their own "results" during search — suppress
    // the no-results message if any matched.
    if (searchActive && matchingFeatured.length > 0) return { kind: "none" };
    if (urlSavedActive && savedIds.size === 0) return { kind: "saved-empty" };
    if (searchActive) return { kind: "search", query: search };
    if (urlSite && urlCategory)
      return { kind: "category-at-site", site: urlSite };
    return { kind: "none" };
  })();

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
    <div className="flex min-w-0 flex-col gap-4 md:gap-5">
      {/* Control bar pins below the SiteNav so filters stay reachable
          while the user scrolls the long feed. Includes OnNowBanner so
          it sticks together on festival day. */}
      <section className="sticky top-14 z-30 min-w-0 overflow-hidden rounded-3xl bg-cream shadow-card">
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
        <OnNowBanner items={lineup} onSelect={handleBannerSelect} />
      </section>

      <section className="min-w-0 rounded-3xl bg-cream shadow-card">
        <div className="px-3 py-4 md:px-6 md:py-8">
          {(() => {
            // Pinned featured cards: bespoke programmes that aren't in the
            // xlsx.
            // - Search active: show only cards whose content (including
            //   sub-item titles + summaries) matches the query.
            // - Category filter active (no search): hide entirely, since
            //   featured cards span multiple categories.
            // - Otherwise: show all, scoped by site + saved filter.
            const pinnedCards: FeaturedCard[] = (() => {
              if (searchActive) return matchingFeatured;
              if (urlCategory) return [];
              return FEATURED_CARDS.filter((card) => {
                if (urlSite && urlSite !== card.site) return false;
                if (urlSavedActive && !savedIds.has(card.id)) return false;
                return true;
              });
            })();
            const hasStalls = sorted.length > 0;
            return (
              <>
                {pinnedCards.length > 0 && (
                  <section className="mb-8 px-2 md:mb-10 md:px-0">
                    <SectionHeader>Curated Programmes</SectionHeader>
                    <ul className="flex flex-col gap-4 md:gap-5">
                      {pinnedCards.map((card) => (
                        <li key={card.id}>
                          {card.render(nowMinutes, target)}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  {hasStalls && (
                    <SectionHeader>Stalls &amp; Activities</SectionHeader>
                  )}
                  <LineupFeed
                    items={sorted}
                    emptyState={emptyState}
                    nowMinutes={nowMinutes}
                    target={target}
                  />
                </section>
              </>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
