export type SiteKey = "market" | "sussex" | "library" | "fringe";

export type Category =
  | "music"
  | "food"
  | "markets"
  | "workshops"
  | "talks";

export type LineupItem = {
  id: string;
  title: string;
  category: Category;
  site?: SiteKey;
  shortDescription?: string;
  longDescription?: string;
  time?: string;
  photo?: string;
  website?: string;
  instagram?: string;
  /**
   * Optional per-item override for the anchor pill label. When set,
   * displayed instead of the category-derived short label. Does not
   * affect filtering — the item still lives under its real `category`.
   */
  displayCategoryLabel?: string;
};

// Sites that appear as filter tabs. `fringe` is NOT a tab — fringe events
// still render in the feed and get a pill label, just no dedicated tab.
export const SITE_TABS = ["market", "sussex", "library"] as const;
export type TabSite = (typeof SITE_TABS)[number];

// All sites including fringe, used for sort ordering. Items without a site
// land after this list (rendered as "TBC" at the bottom of the feed).
export const SITE_ORDER: SiteKey[] = ["market", "sussex", "library", "fringe"];

export const SITE_LABELS: Record<SiteKey, string> = {
  market: "Old Market Sq",
  sussex: "Sussex St",
  library: "Library",
  fringe: "Fringe",
};

export const SITE_FULL_LABELS: Record<SiteKey, string> = {
  market: "Old Market Square",
  sussex: "Sussex Street Tram Stop",
  library: "Notts Central Library",
  fringe: "Fringe venue",
};

export const SITE_DISPLAY: Record<SiteKey, string> = {
  market: "Old Market Square",
  sussex: "Sussex St. Tram Stop",
  library: "Notts Central Library",
  fringe: "Fringe venue",
};

export const SITE_THEME: Record<SiteKey, string> = {
  market: "Gather",
  sussex: "Move",
  library: "Imagine",
  fringe: "Fringe",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  music: "Music",
  food: "Food",
  markets: "Markets",
  workshops: "Workshops",
  talks: "Talks",
};

export const CATEGORY_ORDER: Category[] = [
  "music",
  "food",
  "markets",
  "workshops",
  "talks",
];

// --- Internal sets used by the server-side loader ---

export const CATEGORY_SET = new Set<Category>([
  "music",
  "food",
  "markets",
  "workshops",
  "talks",
]);

export const SITE_SET = new Set<SiteKey>([
  "market",
  "sussex",
  "library",
  "fringe",
]);

// --- Time helpers ---

export type TimeRange = { start: string; end: string };

/**
 * Parse the raw `time` cell into structured ranges.
 * Returns [] for "All day", undefined input, or unparseable strings.
 * Handles single ranges ("11:00-15:00") and split ranges
 * ("11:00-13:30 and 14:30-17:00").
 */
export function parseTimeRanges(time?: string): TimeRange[] {
  if (!time) return [];
  const lower = time.toLowerCase().trim();
  if (lower === "all day") return [];

  const out: TimeRange[] = [];
  const parts = lower.split(/\s+and\s+/);
  const rangeRe = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/;
  for (const part of parts) {
    const match = part.trim().match(rangeRe);
    if (match) {
      out.push({ start: match[1], end: match[2] });
    }
  }
  return out;
}

export function isAllDay(time?: string): boolean {
  return !!time && time.trim().toLowerCase() === "all day";
}
