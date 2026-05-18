"use client";

import { type Category, type SiteKey } from "@/lib/festival/lineup";
import { SearchInput } from "./SearchInput";
import { CategoryChips } from "./CategoryChips";
import { SiteTabs } from "./SiteTabs";
import { SavedFilter } from "./SavedFilter";

type Props = {
  search: string;
  onSearchChange: (next: string) => void;
  category: Category | null;
  onCategoryChange: (next: Category | null) => void;
  categoriesDisabled: boolean;
  categoryCounts: Record<Category | "all", number>;
  site: SiteKey | null;
  onSiteChange: (next: SiteKey | null) => void;
  siteCounts: Record<SiteKey, number>;
  savedActive: boolean;
  onSavedToggle: () => void;
};

export function LineupControlBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoriesDisabled,
  categoryCounts,
  site,
  onSiteChange,
  siteCounts,
  savedActive,
  onSavedToggle,
}: Props) {
  return (
    <div
      data-section="lineup-controls"
      className="flex min-w-0 flex-col gap-3 px-3 py-4 md:gap-4 md:px-6 md:py-5"
    >
      <SearchInput value={search} onChange={onSearchChange} />
      <div className="flex min-w-0 items-center gap-2">
        <SavedFilter active={savedActive} onToggle={onSavedToggle} />
        <div className="min-w-0 flex-1">
          <CategoryChips
            active={category}
            counts={categoryCounts}
            disabled={categoriesDisabled}
            onChange={onCategoryChange}
          />
        </div>
      </div>
      <SiteTabs
        selected={site}
        counts={siteCounts}
        onChange={onSiteChange}
      />
    </div>
  );
}
