"use client";

import { Bookmark } from "lucide-react";
import {
  type LineupItem,
  type SiteKey,
  SITE_LABELS,
} from "@/lib/festival/lineup";
import { StandaloneCard } from "./StandaloneCard";
import type { NavTarget } from "./types";

type Props = {
  items: LineupItem[];
  emptyState: EmptyState;
  nowMinutes: number | null;
  target: NavTarget | null;
};

export type EmptyState =
  | { kind: "none" }
  | { kind: "search"; query: string }
  | { kind: "category-at-site"; site: SiteKey }
  | { kind: "saved-empty" };

export function LineupFeed({
  items,
  emptyState,
  nowMinutes,
  target,
}: Props) {
  if (items.length === 0) {
    if (emptyState.kind === "saved-empty") {
      return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-ink-300 bg-cream-50 p-8 text-center">
          <Bookmark aria-hidden="true" className="h-8 w-8 text-ink-500" />
          <p className="text-sm text-ink-700">
            Nothing saved yet! Press the save button next to an event to store
            it for later.
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-dashed border-ink-300 bg-cream-50 p-8 text-center text-sm text-ink-700">
        {emptyState.kind === "search" && (
          <>
            No matches for &ldquo;{emptyState.query}&rdquo;. Try a broader
            search or browse by category.
          </>
        )}
        {emptyState.kind === "category-at-site" && (
          <>
            Nothing in this category at {SITE_LABELS[emptyState.site]}. Try
            another site or another category.
          </>
        )}
        {emptyState.kind === "none" && <>No items match the current filter.</>}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.id}>
          <StandaloneCard
            item={item}
            target={target}
            nowMinutes={nowMinutes}
          />
        </li>
      ))}
    </ul>
  );
}
