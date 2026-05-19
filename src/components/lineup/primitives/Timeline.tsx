"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type SiteKey } from "@/lib/festival/lineup";
import { type TimedStatus } from "../status";

type Tone = SiteKey;

const TimelineCtx = createContext<{ tone: Tone } | null>(null);

function useTimelineCtx(): { tone: Tone } {
  const v = useContext(TimelineCtx);
  if (!v) {
    throw new Error("Timeline.Item must be used inside <Timeline>");
  }
  return v;
}

// Dot colour by tone (upcoming-state default)
const TONE_DOT: Record<Tone, string> = {
  market: "bg-market-500",
  sussex: "bg-sussex-500",
  library: "bg-library-500",
  fringe: "bg-ink-700",
};

// Dot colour by status. `null` means fall back to tone-based default.
const STATUS_DOT: Record<TimedStatus, string | null> = {
  live: "bg-status-live ring-4 ring-status-live/25 pulse-dot",
  next: "bg-status-next",
  past: "bg-ink-300",
  upcoming: null,
};

function dotClass(status: TimedStatus, tone: Tone): string {
  return STATUS_DOT[status] ?? TONE_DOT[tone];
}

// Connector line colour — slightly muted for past segments
const LINE = "bg-ink-300";
const LINE_PAST = "bg-ink-300/60";

type RootProps = {
  tone: Tone;
  children: ReactNode;
};

function TimelineRoot({ tone, children }: RootProps) {
  return (
    <TimelineCtx.Provider value={{ tone }}>
      <ol className="flex flex-col">{children}</ol>
    </TimelineCtx.Provider>
  );
}

type ItemProps = {
  /** True for the first item — top connector hidden. */
  isFirst?: boolean;
  /** True for the last item — bottom connector hidden. */
  isLast?: boolean;
  /** Past / live / next / upcoming — drives dot styling and item dim. */
  status: TimedStatus;
  /** Trigger a brief flash highlight when targeted via OnNowBanner. */
  shouldHighlight?: boolean;
  /** Bump this value (e.g. a nonce) to re-fire the highlight effect. */
  highlightKey?: number;
  children: ReactNode;
};

function TimelineItem({
  isFirst = false,
  isLast = false,
  status,
  shouldHighlight = false,
  highlightKey,
  children,
}: ItemProps) {
  const { tone } = useTimelineCtx();
  const dot = dotClass(status, tone);
  const line = status === "past" ? LINE_PAST : LINE;

  // Flash highlight when shouldHighlight + a new key arrives.
  const [highlighted, setHighlighted] = useState(false);
  const lastKey = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (shouldHighlight && highlightKey !== lastKey.current) {
      lastKey.current = highlightKey;
      setHighlighted(true);
      const t = setTimeout(() => setHighlighted(false), 1500);
      return () => clearTimeout(t);
    }
  }, [shouldHighlight, highlightKey]);

  return (
    <li
      className={`grid grid-cols-[20px_1fr] gap-3 md:grid-cols-[24px_1fr] md:gap-4 ${
        status === "past" ? "opacity-60" : ""
      }`}
    >
      {/* Rail: top stub, dot, bottom stub. Stubs become invisible at the
          first/last item so the line doesn't poke past the timeline. */}
      <div className="flex flex-col items-center">
        <div className={`h-2 w-0.5 ${isFirst ? "" : line}`} />
        <div className={`h-3 w-3 shrink-0 rounded-full ${dot}`} />
        <div className={`w-0.5 flex-1 ${isLast ? "" : line}`} />
      </div>

      {/* Content with brief flash highlight when shouldHighlight fires. */}
      <div
        className={`pb-5 transition-colors duration-700 md:pb-6 ${
          highlighted ? "-mx-2 rounded-md bg-status-next-bg px-2" : ""
        }`}
      >
        {children}
      </div>
    </li>
  );
}

export const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
});
