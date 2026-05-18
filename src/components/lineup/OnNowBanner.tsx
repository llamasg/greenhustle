"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import {
  type LineupItem,
  type SiteKey,
  SITE_LABELS,
  SITE_TABS,
  parseTimeRanges,
} from "@/lib/festival/lineup";
import { getNow } from "@/lib/festival/phase";

type BannerEntry =
  | {
      state: "live";
      site: SiteKey;
      itemId: string;
      subItemId?: string;
      name: string;
      timeRange: string;
    }
  | {
      state: "next";
      site: SiteKey;
      itemId: string;
      subItemId?: string;
      name: string;
      startTime: string;
    };

type Props = {
  items: LineupItem[];
  onSelect: (target: {
    site: SiteKey;
    itemId: string;
    subItemId?: string;
  }) => void;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const SITE_LABEL_TEXT: Record<SiteKey, string> = {
  market: "text-site-market-deep",
  sussex: "text-site-sussex-deep",
  library: "text-site-library-deep",
  fringe: "text-ink-700",
};

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
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

type TimedEntry = {
  itemId: string;
  subItemId?: string;
  name: string;
  startTime: string;
  endTime: string;
  site: SiteKey;
};

function collectTimedEntries(items: LineupItem[]): TimedEntry[] {
  const out: TimedEntry[] = [];
  for (const item of items) {
    if (!item.site) continue;
    const ranges = parseTimeRanges(item.time);
    for (const r of ranges) {
      out.push({
        itemId: item.id,
        name: item.title,
        startTime: r.start,
        endTime: r.end,
        site: item.site,
      });
    }
  }
  return out;
}

function bannerForSite(
  entries: TimedEntry[],
  site: SiteKey,
  nowMinutes: number
): BannerEntry | null {
  const siteEntries = entries
    .filter((e) => e.site === site)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  for (const e of siteEntries) {
    const s = toMinutes(e.startTime);
    const en = toMinutes(e.endTime);
    if (nowMinutes >= s && nowMinutes < en) {
      return {
        state: "live",
        site,
        itemId: e.itemId,
        subItemId: e.subItemId,
        name: e.name,
        timeRange: `${e.startTime} to ${e.endTime}`,
      };
    }
  }

  for (const e of siteEntries) {
    if (toMinutes(e.startTime) > nowMinutes) {
      return {
        state: "next",
        site,
        itemId: e.itemId,
        subItemId: e.subItemId,
        name: e.name,
        startTime: e.startTime,
      };
    }
  }
  return null;
}

export function OnNowBanner({ items, onSelect }: Props) {
  const [now, setNow] = useState<Date>(() => getNow());

  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 30000);
    return () => clearInterval(id);
  }, []);

  const entries = useMemo(() => collectTimedEntries(items), [items]);
  const nowMinutes = getNowMinutesUK(now);

  const banners = SITE_TABS.map((site) =>
    bannerForSite(entries, site, nowMinutes)
  ).filter((b): b is BannerEntry => b !== null);

  if (banners.length === 0) return null;

  return (
    <section
      data-section="on-now"
      aria-label="What is on right now"
      className="border-b border-ink-300 bg-cream-100"
    >
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">
          What is on right now
        </p>
        <ul className="grid grid-cols-1 gap-2 min-[900px]:grid-cols-3">
          {banners.map((b) => (
            <li key={b.site}>
              <button
                type="button"
                onClick={() =>
                  onSelect({
                    site: b.site,
                    itemId: b.itemId,
                    subItemId: b.subItemId,
                  })
                }
                aria-label={
                  b.state === "live"
                    ? `On now at ${SITE_LABELS[b.site]}: ${b.name}, ends ${
                        b.timeRange.split(" to ")[1]
                      }. Tap to see in feed.`
                    : `Next at ${SITE_LABELS[b.site]}: ${b.name}, starts ${b.startTime}. Tap to see in feed.`
                }
                className={`flex w-full flex-col gap-1.5 rounded-2xl border border-ink-300 bg-cream-50 px-4 py-3 text-left shadow-card transition-colors hover:border-ink hover:bg-cream ${focusRing}`}
              >
                <div className="flex items-center gap-2">
                  {b.state === "live" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-live px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                      <span
                        aria-hidden="true"
                        className="pulse-dot h-1.5 w-1.5 rounded-full bg-white"
                      />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-status-next-bg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-status-next">
                      Next
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${SITE_LABEL_TEXT[b.site]}`}
                  >
                    <MapPin aria-hidden="true" className="h-3 w-3" />
                    {SITE_LABELS[b.site]}
                  </span>
                </div>
                <p className="text-base font-semibold leading-tight text-ink">
                  {b.name}
                </p>
                <p className="text-xs text-ink-700">
                  {b.state === "live" ? b.timeRange : `Starts ${b.startTime}`}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
