"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { LineupCard } from "@/components/lineup/primitives/LineupCard";

export default function DebugLineupCardPage() {
  const [expanded, setExpanded] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);
  const [inCardSaveCount, setInCardSaveCount] = useState(0);
  const [standaloneSaveCount, setStandaloneSaveCount] = useState(0);

  return (
    <main className="min-h-screen bg-cream p-4">
      <h1 className="mb-4 text-xl font-bold">/debug/lineup-card</h1>
      <p className="mb-4 text-sm text-ink-700">
        Isolated LineupCard with no sticky wrapper, no scroll container, no
        sibling controls. If taps work here but not on /lineup, the bug is in
        the surrounding app. If taps don&apos;t work here either, the bug is in
        the primitive.
      </p>

      <div className="mb-6 space-y-1 rounded-lg bg-white p-3 font-mono text-sm">
        <p>
          Card toggle taps: <strong>{toggleCount}</strong>
        </p>
        <p>
          Card expanded: <strong>{expanded ? "yes" : "no"}</strong>
        </p>
        <p>
          In-card save button taps: <strong>{inCardSaveCount}</strong>
        </p>
        <p>
          Standalone save button taps: <strong>{standaloneSaveCount}</strong>
        </p>
      </div>

      <LineupCard
        tone="market"
        expanded={expanded}
        onToggle={() => {
          setToggleCount((n) => n + 1);
          setExpanded((e) => !e);
        }}
      >
        <LineupCard.Anchor topLabel="ALL DAY" mainLabel="workshop" />
        <LineupCard.Content
          title="Test Card"
          summary="Hardcoded card used to verify tap events fire in isolation."
          footer={
            <div className="flex flex-wrap items-center gap-2 md:hidden">
              <LineupCard.TonePill>Gather</LineupCard.TonePill>
              <p className="text-[13px] font-normal text-ink-700">
                Old Market Sq
              </p>
            </div>
          }
        />
        <LineupCard.Trailing>
          <div className="flex h-full w-full items-center justify-end gap-6 md:justify-between">
            <div className="hidden flex-col items-start gap-2 self-start md:flex">
              <LineupCard.TonePill>Gather</LineupCard.TonePill>
              <p className="text-[13px] font-normal text-ink-700">
                Old Market Square
              </p>
            </div>
            <button
              type="button"
              aria-label="Save Test Card"
              onClick={(e) => {
                e.stopPropagation();
                setInCardSaveCount((n) => n + 1);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink hover:bg-cream-100"
            >
              <Bookmark aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </LineupCard.Trailing>
        {expanded && (
          <LineupCard.Body>
            <p className="text-sm text-ink-700">
              Expanded body content. Tap the card again to collapse.
            </p>
          </LineupCard.Body>
        )}
      </LineupCard>

      <div className="mt-8 rounded-2xl bg-white p-4 shadow-card">
        <p className="mb-3 text-sm">Plain standalone button (outside any card):</p>
        <button
          type="button"
          onClick={() => setStandaloneSaveCount((n) => n + 1)}
          className="flex h-11 items-center gap-2 rounded-full bg-market-900 px-4 text-white"
        >
          <Bookmark className="h-4 w-4" />
          <span>Tap to save</span>
        </button>
      </div>
    </main>
  );
}
