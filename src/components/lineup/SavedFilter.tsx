"use client";

import { Bookmark } from "lucide-react";
import { useSaved } from "./SavedContext";

type Props = {
  active: boolean;
  onToggle: () => void;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function SavedFilter({ active, onToggle }: Props) {
  const { count } = useSaved();

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-market-900 bg-market-900 text-white"
          : "border-ink-300 bg-white text-ink-700 hover:border-ink hover:text-ink"
      } ${focusRing}`}
    >
      <Bookmark
        aria-hidden="true"
        className={`h-4 w-4 ${active ? "fill-white" : ""}`}
      />
      <span>Saved</span>
      {count > 0 && (
        <span
          className={`text-xs font-normal tabular-nums ${
            active ? "text-white/75" : "text-ink-500"
          }`}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
      <span className="sr-only">{count} saved</span>
    </button>
  );
}
