"use client";

import {
  type SiteKey,
  type TabSite,
  SITE_LABELS,
  SITE_TABS,
} from "@/lib/festival/lineup";

type Props = {
  selected: SiteKey | null;
  counts: Record<SiteKey, number>;
  onChange: (next: SiteKey | null) => void;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const DEFAULT: Record<TabSite, string> = {
  market: "bg-site-market text-white hover:bg-market-900",
  sussex: "bg-site-sussex text-white hover:bg-sussex-900",
  library: "bg-site-library text-white hover:bg-library-900",
};

const SELECTED: Record<TabSite, string> = {
  market: "bg-market-50 text-market-900 ring-2 ring-site-market",
  sussex: "bg-sussex-50 text-sussex-900 ring-2 ring-site-sussex",
  library: "bg-library-50 text-library-900 ring-2 ring-site-library",
};

export function SiteTabs({ selected, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter by site"
      className="grid grid-cols-3 gap-2"
    >
      {SITE_TABS.map((site) => {
        const isSelected = selected === site;
        return (
          <button
            key={site}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? null : site)}
            className={`min-w-0 truncate rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors ${
              isSelected ? SELECTED[site] : DEFAULT[site]
            } ${focusRing}`}
          >
            {SITE_LABELS[site]}
          </button>
        );
      })}
    </div>
  );
}
