"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Clock,
  Coffee,
  Footprints,
  Mic,
  Music,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  SITE_DISPLAY,
  SITE_LABELS,
  SITE_THEME,
  type Category,
  type SiteKey,
} from "@/lib/festival/lineup";
import { statusFor } from "./status";
import { LineupCard } from "./primitives/LineupCard";
import { Timeline } from "./primitives/Timeline";
import { useSaved } from "./SavedContext";
import { useOpenCard } from "./OpenCardContext";
import type { NavTarget } from "./types";

// "walks" is a sub-item-only display category: it isn't a top-level
// filter (walks are treated as workshops at the lineup level), but on
// a programme timeline it gets its own icon + label.
export type SubItemCategory = Category | "walks";

// A sub-item in a programme. Inline-typed here so featured cards can
// declare their timetables as plain arrays without importing extras.
// startTime/endTime are optional: omit both for all-day items that don't
// need a clock readout (e.g. stallholders sharing one space all day).
export type SubItem = {
  id: string;
  startTime?: string; // "HH:MM"
  endTime?: string;   // "HH:MM"
  title: string;
  category: SubItemCategory;
  summary?: string;
  /** External booking link, renders a "Book here" button below the summary. */
  bookingUrl?: string;
};

// Search payload exposed by each featured card so the lineup view can
// match the global search bar against the card's content (including
// sub-item titles + summaries) without importing the card itself.
export type FeaturedSearch = {
  title: string;
  shortDescription?: string;
  longDescription?: string;
  subItems: SubItem[];
};

type Props = {
  /** Stable id used by the bookmark/save store and by `target` matching. */
  id: string;
  /** Site tone — drives anchor colour, dot fallback, pill colour, etc. */
  tone: SiteKey;
  /** Anchor top label, e.g. "11–18" or "3 walks". */
  topLabel: string;
  /** Anchor main label, e.g. "STAGE" or "WALKS". */
  mainLabel: string;
  /** Card title shown in the Content area. */
  title: string;
  /** One-line description shown under the title. */
  shortDescription: string;
  /** Optional body copy shown above the timeline when expanded. */
  longDescription?: string;
  /** Programme entries rendered as a vertical timeline. */
  subItems: SubItem[];
  /** Current time-of-day in UK minutes (or null when not festival day). */
  nowMinutes: number | null;
  /** OnNowBanner navigation target (used to scroll-into-view + auto-open). */
  target: NavTarget | null;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const SUB_ITEM_ICON: Record<SubItemCategory, LucideIcon> = {
  music: Music,
  food: Coffee,
  markets: Store,
  workshops: Wrench,
  talks: Mic,
  walks: Footprints,
};

const SUB_ITEM_LABEL: Record<SubItemCategory, string> = {
  ...CATEGORY_LABELS,
  walks: "Walks",
};

const CATEGORY_ICON_TONE: Record<SiteKey, string> = {
  market: "text-site-market-deep",
  sussex: "text-site-sussex-deep",
  library: "text-site-library-deep",
  fringe: "text-ink-700",
};

export function ContainerCard({
  id,
  tone,
  topLabel,
  mainLabel,
  title,
  shortDescription,
  longDescription,
  subItems,
  nowMinutes,
  target,
}: Props) {
  const { isOpen, toggle: toggleOpen, setOpenId } = useOpenCard();
  const open = isOpen(id);
  const [highlighted, setHighlighted] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const lastNonceRef = useRef<number | null>(null);
  const { isSaved, toggle: toggleSaved } = useSaved();
  const saved = isSaved(id);

  // Auto-open + scroll into view when targeted by the OnNowBanner.
  // Only scroll the whole card when no sub-item is specified — the
  // Timeline.Item handles the sub-item highlight flash on its own.
  useEffect(() => {
    if (!target || target.itemId !== id) return;
    if (lastNonceRef.current === target.nonce) return;
    lastNonceRef.current = target.nonce;
    setOpenId(id);
    if (!target.subItemId) {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setHighlighted(true);
      const t = setTimeout(() => setHighlighted(false), 1500);
      return () => clearTimeout(t);
    }
  }, [target, id]);

  const cardClassName = highlighted
    ? "border-ink shadow-[0_0_0_4px_rgba(26,26,26,0.18)]"
    : "";

  const hasLive = subItems.some(
    (s) =>
      s.startTime !== undefined &&
      s.endTime !== undefined &&
      statusFor(s.startTime, s.endTime, nowMinutes) === "live"
  );

  return (
    <LineupCard
      ref={cardRef}
      tone={tone}
      expanded={open}
      onToggle={() => toggleOpen(id)}
      className={cardClassName}
    >
      <LineupCard.Anchor topLabel={topLabel} mainLabel={mainLabel} />
      <LineupCard.Content
        title={title}
        summary={shortDescription}
        footer={
          <div className="flex flex-wrap items-center gap-2 md:hidden">
            <LineupCard.TonePill>{SITE_THEME[tone]}</LineupCard.TonePill>
            <p className="text-[13px] font-normal text-ink-700">
              {SITE_LABELS[tone]}
            </p>
            {hasLive && <LineupCard.LiveBadge />}
          </div>
        }
      />
      <LineupCard.Trailing>
        <div className="flex h-full w-full items-center justify-end gap-6 md:justify-between">
          <div className="hidden flex-col items-start gap-2 self-start md:flex">
            <LineupCard.TonePill>{SITE_THEME[tone]}</LineupCard.TonePill>
            <p className="text-[13px] font-normal text-ink-700">
              {SITE_DISPLAY[tone]}
            </p>
            {hasLive && <LineupCard.LiveBadge />}
          </div>
          <button
            type="button"
            aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
            aria-pressed={saved}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(id);
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
          {longDescription && (
            <div className="mb-5 space-y-3 text-sm leading-relaxed text-ink-700 md:text-base">
              {longDescription
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          )}
          <Timeline tone={tone}>
            {subItems.map((s, i) => {
              const status =
                s.startTime !== undefined && s.endTime !== undefined
                  ? statusFor(s.startTime, s.endTime, nowMinutes)
                  : "upcoming";
              const isTarget =
                target?.itemId === id && target?.subItemId === s.id;
              const Icon = SUB_ITEM_ICON[s.category];
              return (
                <Timeline.Item
                  key={s.id}
                  isFirst={i === 0}
                  isLast={i === subItems.length - 1}
                  status={status}
                  shouldHighlight={isTarget}
                  highlightKey={target?.nonce}
                >
                  <p
                    className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider ${CATEGORY_ICON_TONE[tone]}`}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    {SUB_ITEM_LABEL[s.category]}
                  </p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h4 className="min-w-0 flex-1 text-lg font-semibold leading-tight text-ink md:text-xl">
                      {s.title}
                    </h4>
                    {s.startTime && s.endTime && (
                      <time
                        dateTime={`${s.startTime}/${s.endTime}`}
                        className="inline-flex shrink-0 items-center gap-1.5 pt-1 text-sm font-medium tabular-nums text-ink-700 md:text-base"
                      >
                        <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                        {s.startTime}–{s.endTime}
                      </time>
                    )}
                  </div>
                  {s.summary && (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                      {s.summary}
                    </p>
                  )}
                  {s.bookingUrl && (
                    <a
                      href={s.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-brand-olive px-4 py-1.5 font-hellonotie text-sm tracking-wider text-white transition-colors hover:bg-brand-olive-700 ${focusRing}`}
                    >
                      Book here
                    </a>
                  )}
                </Timeline.Item>
              );
            })}
          </Timeline>
        </LineupCard.Body>
      )}
    </LineupCard>
  );
}
