"use client";

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { type SiteKey } from "@/lib/festival/lineup";

type Tone = SiteKey;

type CardCtx = {
  tone: Tone;
  expanded: boolean;
  toggle: () => void;
  controlsId: string;
};

const Ctx = createContext<CardCtx | null>(null);

function useCard(): CardCtx {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error(
      "LineupCard subcomponents must be used inside <LineupCard>"
    );
  }
  return v;
}

const ANCHOR_TONE: Record<Tone, string> = {
  market: "bg-site-market-soft text-site-market-deep",
  sussex: "bg-site-sussex-soft text-site-sussex-deep",
  library: "bg-site-library-soft text-site-library-deep",
  fringe: "bg-cream-100 text-ink-700",
};

const ANCHOR_PILL: Record<Tone, string> = {
  market: "bg-site-market text-white",
  sussex: "bg-site-sussex text-white",
  library: "bg-site-library text-white",
  fringe: "bg-ink text-white",
};

const TONE_PILL_VARIANT: Record<Tone, string> = {
  market: "bg-market-50 border border-market-500/40 text-market-500",
  sussex: "bg-sussex-50 border border-sussex-500/40 text-sussex-500",
  library: "bg-library-50 border border-library-500/40 text-library-500",
  fringe: "bg-cream-100 border border-ink-300 text-ink-700",
};

type RootProps = {
  tone: Tone;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
  children: ReactNode;
};

const Root = forwardRef<HTMLElement, RootProps>(function LineupCardRoot(
  { tone, expanded, onToggle, className = "", children },
  ref
) {
  const controlsId = useId();
  const childArray = Children.toArray(children);

  const anchorChild = childArray.find(
    (c) => isValidElement(c) && c.type === Anchor
  );
  const contentChild = childArray.find(
    (c) => isValidElement(c) && c.type === Content
  );
  const trailingChild = childArray.find(
    (c) => isValidElement(c) && c.type === Trailing
  );
  const bodyChild = childArray.find(
    (c) => isValidElement(c) && c.type === Body
  );
  const hasBody = !!bodyChild;

  // Toggle <button> wraps only Anchor + Content. Trailing is a sibling,
  // so its save <button> is never nested inside another button. No
  // pointer-events overrides, no nested interactives, just valid HTML.
  return (
    <Ctx.Provider value={{ tone, expanded, toggle: onToggle, controlsId }}>
      <article
        ref={ref}
        className={`relative flex flex-col rounded-2xl bg-white shadow-card ${className}`}
      >
        <span
          aria-hidden="true"
          className="absolute -top-2 left-[117px] z-10 h-4 w-4 rounded-full bg-cream md:left-[156px]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-[117px] z-10 h-4 w-4 rounded-full bg-cream md:left-[156px]"
        />
        <div className="flex items-stretch">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={expanded ? controlsId : undefined}
            onClick={onToggle}
            className={`flex min-w-0 flex-1 items-stretch gap-2 p-[7px] text-left transition-colors hover:bg-cream-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:gap-5 md:p-5 ${
              hasBody ? "rounded-tl-2xl" : "rounded-l-2xl"
            }`}
          >
            {anchorChild}
            {contentChild}
          </button>
          <div
            className={`flex shrink-0 items-stretch p-[7px] md:p-5 ${
              hasBody ? "rounded-tr-2xl" : "rounded-r-2xl"
            }`}
          >
            {trailingChild}
          </div>
        </div>
        {bodyChild}
      </article>
    </Ctx.Provider>
  );
});

function Anchor({
  topLabel,
  mainLabel,
}: {
  topLabel: string;
  mainLabel: string;
}) {
  const { tone } = useCard();
  return (
    <div
      className={`flex w-[110px] flex-col items-center justify-center gap-2 rounded-xl p-2 text-center md:w-[140px] md:p-4 ${ANCHOR_TONE[tone]}`}
    >
      <span className="text-[12px] font-semibold tabular-nums leading-tight text-ink md:text-[13px]">
        {topLabel}
      </span>
      <span
        className={`inline-flex items-center justify-center rounded-lg px-2 py-1 font-hellonotie text-base leading-none tracking-wider md:px-3 md:py-1.5 md:text-lg ${ANCHOR_PILL[tone]}`}
      >
        {mainLabel}
      </span>
    </div>
  );
}

function Content({
  title,
  summary,
  summaryMuted = false,
  children,
  footer,
}: {
  title: string;
  summary: string;
  summaryMuted?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
      {children && <div className="mb-2">{children}</div>}
      <h3 className="text-[18px] font-bold leading-[1.3] tracking-tight text-ink md:text-[20px]">
        {title}
      </h3>
      <p
        className={`mt-2 line-clamp-3 text-[14px] font-normal leading-[1.5] ${
          summaryMuted ? "italic text-ink-500" : "text-ink-700"
        }`}
      >
        {summary}
      </p>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

function Trailing({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-stretch md:w-[200px]">
      {children}
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  const { controlsId } = useCard();
  return (
    <div
      id={controlsId}
      className="rounded-b-2xl border-t border-cream-100 px-3 py-4 md:px-5 md:py-6"
    >
      {children}
    </div>
  );
}

function TonePill({ children }: { children: ReactNode }) {
  const { tone } = useCard();
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.05em] ${TONE_PILL_VARIANT[tone]}`}
    >
      {children}
    </span>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-status-live px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
      <span
        aria-hidden="true"
        className="pulse-dot h-1.5 w-1.5 rounded-full bg-white"
      />
      <span className="sr-only">On now: </span>
      <span aria-hidden="true">On now</span>
    </span>
  );
}

export const LineupCard = Object.assign(Root, {
  Anchor,
  Content,
  Trailing,
  Body,
  TonePill,
  LiveBadge,
});
