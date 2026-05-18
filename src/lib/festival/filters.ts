import {
  type Category,
  type LineupItem,
  type SiteKey,
  SITE_ORDER,
  parseTimeRanges,
} from "./lineup";

export type Filters = {
  search: string;
  category: Category | null;
  site: SiteKey | null;
};

export const DEFAULT_FILTERS: Filters = {
  search: "",
  category: null,
  site: null,
};

export function isSearchActive(filters: Filters): boolean {
  return filters.search.trim().length >= 2;
}

function haystack(item: LineupItem): string {
  return [
    item.title,
    item.shortDescription ?? "",
    item.longDescription ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function matchesFilters(
  item: LineupItem,
  filters: Filters,
  searchActive: boolean,
  q: string
): boolean {
  if (filters.site && item.site !== filters.site) return false;
  if (searchActive) {
    if (!haystack(item).includes(q)) return false;
  } else if (filters.category && item.category !== filters.category) {
    return false;
  }
  return true;
}

export function filterLineup(
  items: LineupItem[],
  filters: Filters
): LineupItem[] {
  const searchActive = isSearchActive(filters);
  const q = filters.search.trim().toLowerCase();
  return items.filter((i) => matchesFilters(i, filters, searchActive, q));
}

/**
 * Sort by site (SITE_ORDER), pushing items with no site to the bottom.
 * Within each site bucket, by parsed start time then title.
 */
export function sortLineup(items: LineupItem[]): LineupItem[] {
  const siteIndex = (s?: SiteKey) =>
    s ? SITE_ORDER.indexOf(s) : SITE_ORDER.length;

  const startMinutes = (time?: string): number => {
    const ranges = parseTimeRanges(time);
    if (ranges.length === 0) return Number.POSITIVE_INFINITY;
    const [h, m] = ranges[0].start.split(":").map(Number);
    return h * 60 + m;
  };

  return [...items].sort((a, b) => {
    const siteDiff = siteIndex(a.site) - siteIndex(b.site);
    if (siteDiff !== 0) return siteDiff;
    const timeDiff = startMinutes(a.time) - startMinutes(b.time);
    if (timeDiff !== 0) return timeDiff;
    return a.title.localeCompare(b.title);
  });
}

export function countByCategory(
  items: LineupItem[],
  filters: Filters
): Record<Category | "all", number> {
  const searchActive = isSearchActive(filters);
  const q = filters.search.trim().toLowerCase();

  const counts: Record<Category | "all", number> = {
    all: 0,
    music: 0,
    food: 0,
    markets: 0,
    workshops: 0,
    talks: 0,
  };

  counts.all = items.filter((i) =>
    matchesFilters(i, { ...filters, category: null }, searchActive, q)
  ).length;

  (["music", "food", "markets", "workshops", "talks"] as const).forEach(
    (cat) => {
      counts[cat] = items.filter((i) =>
        matchesFilters(i, { ...filters, category: cat }, searchActive, q)
      ).length;
    }
  );

  return counts;
}

export function countBySite(
  items: LineupItem[],
  filters: Filters
): Record<SiteKey, number> {
  const searchActive = isSearchActive(filters);
  const q = filters.search.trim().toLowerCase();

  const counts: Record<SiteKey, number> = {
    market: 0,
    sussex: 0,
    library: 0,
    fringe: 0,
  };

  (["market", "sussex", "library", "fringe"] as const).forEach((site) => {
    counts[site] = items.filter((i) =>
      matchesFilters(i, { ...filters, site }, searchActive, q)
    ).length;
  });

  return counts;
}
