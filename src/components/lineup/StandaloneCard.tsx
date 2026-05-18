"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import {
  SITE_DISPLAY,
  SITE_LABELS,
  SITE_THEME,
  type Category,
  type LineupItem,
  type SiteKey,
  parseTimeRanges,
  isAllDay,
} from "@/lib/festival/lineup";
import type { NavTarget } from "./types";
import { statusFor, type TimedStatus } from "./status";
import { LineupCard } from "./primitives/LineupCard";
import { useSaved } from "./SavedContext";

type Props = {
  item: LineupItem;
  target: NavTarget | null;
  nowMinutes: number | null;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const muted = "italic text-ink-500";

const CATEGORY_SHORT: Record<Category, string> = {
  music: "music",
  food: "food",
  markets: "market",
  workshops: "workshop",
  talks: "talk",
};

function topLabelFor(item: LineupItem): string {
  if (isAllDay(item.time)) return "ALL DAY";
  if (item.time) return item.time;
  return "TBC";
}

function firstRangeStatus(
  item: LineupItem,
  nowMinutes: number | null
): TimedStatus {
  const ranges = parseTimeRanges(item.time);
  if (ranges.length === 0) return "upcoming";
  return statusFor(ranges[0].start, ranges[0].end, nowMinutes);
}

// Site tone for the LineupCard primitive's accent colour. Items without
// a site fall back to the fringe palette so the card still renders.
function toneFor(site: SiteKey | undefined): SiteKey {
  return site ?? "fringe";
}

export function StandaloneCard({ item, target, nowMinutes }: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const { isSaved, toggle: toggleSaved } = useSaved();
  const saved = isSaved(item.id);

  useEffect(() => {
    if (!target || target.itemId !== item.id) return;
    cardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setHighlighted(true);
    const t = setTimeout(() => setHighlighted(false), 1500);
    return () => clearTimeout(t);
  }, [target, item.id]);

  const status = firstRangeStatus(item, nowMinutes);
  const showLive = nowMinutes !== null;
  const isLive = showLive && status === "live";
  const isNext = showLive && status === "next";
  const isPast = showLive && status === "past";

  const cardClassName = `${
    highlighted
      ? "border-ink shadow-[0_0_0_4px_rgba(26,26,26,0.18)]"
      : ""
  } ${isPast ? "opacity-50 hover:opacity-100" : ""}`;

  const summary = item.shortDescription;
  const sitePillLabel = item.site
    ? SITE_THEME[item.site]
    : "TBC";
  const siteLocation = item.site
    ? SITE_LABELS[item.site]
    : "Site TBC";
  const siteLocationFull = item.site
    ? SITE_DISPLAY[item.site]
    : "Site TBC";

  const nextRanges = parseTimeRanges(item.time);

  return (
    <LineupCard
      ref={cardRef}
      tone={toneFor(item.site)}
      expanded={open}
      onToggle={() => setOpen((o) => !o)}
      className={cardClassName}
    >
      <LineupCard.Anchor
        topLabel={topLabelFor(item)}
        mainLabel={CATEGORY_SHORT[item.category]}
      />
      <LineupCard.Content
        title={item.title}
        summary={summary ?? "TBC"}
        summaryMuted={!summary}
        footer={
          <div className="flex flex-wrap items-center gap-2 md:hidden">
            <LineupCard.TonePill>{sitePillLabel}</LineupCard.TonePill>
            <p
              className={`text-[13px] font-normal ${
                item.site ? "text-ink-700" : muted
              }`}
            >
              {siteLocation}
            </p>
            {isLive && <LineupCard.LiveBadge />}
          </div>
        }
      >
        {isNext && nextRanges.length > 0 && (
          <span className="text-xs font-semibold uppercase tracking-wider text-status-next">
            Next at {nextRanges[0].start}
          </span>
        )}
      </LineupCard.Content>
      <LineupCard.Trailing>
        <div className="flex h-full w-full items-center justify-end gap-6 md:justify-between">
          <div className="hidden flex-col items-start gap-2 self-start md:flex">
            <LineupCard.TonePill>{sitePillLabel}</LineupCard.TonePill>
            <p
              className={`text-[13px] font-normal ${
                item.site ? "text-ink-700" : muted
              }`}
            >
              {siteLocationFull}
            </p>
            {isLive && <LineupCard.LiveBadge />}
          </div>
          <button
            type="button"
            aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
            aria-pressed={saved}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(item.id);
            }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-100 ${focusRing}`}
          >
            <Bookmark
              aria-hidden="true"
              className={`h-5 w-5 ${saved ? "fill-ink" : ""}`}
            />
          </button>
        </div>
      </LineupCard.Trailing>

      {open && (
        <LineupCard.Body>
          <div className="flex flex-col gap-4">
            <div
              role="img"
              aria-label={
                item.photo
                  ? `Photo of ${item.title}`
                  : `Photo placeholder for ${item.title}`
              }
              className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-50 p-2 text-center text-xs text-ink-500"
            >
              {item.photo ? `[Photo of ${item.title}]` : "Photo to come"}
            </div>

            <section>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                About
              </h4>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  item.longDescription ? "text-ink-700" : muted
                }`}
              >
                {item.longDescription ?? "More details to come"}
              </p>
            </section>

            {(item.website || item.instagram) && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                  Links
                </h4>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {item.website && (
                    <li>
                      <Link
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-ink underline underline-offset-2 hover:text-ink-700 ${focusRing}`}
                      >
                        Website
                      </Link>
                    </li>
                  )}
                  {item.instagram && (
                    <li>
                      <Link
                        href={item.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-ink underline underline-offset-2 hover:text-ink-700 ${focusRing}`}
                      >
                        Instagram
                      </Link>
                    </li>
                  )}
                </ul>
              </section>
            )}
          </div>
        </LineupCard.Body>
      )}
    </LineupCard>
  );
}
