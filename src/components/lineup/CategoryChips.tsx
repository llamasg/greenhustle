"use client";

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  type Category,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "@/lib/festival/lineup";

type Props = {
  active: Category | null;
  disabled?: boolean;
  counts: Record<Category | "all", number>;
  onChange: (next: Category | null) => void;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function chipClass(active: boolean, disabled: boolean): string {
  const base =
    "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors";
  if (disabled) {
    return `${base} text-ink-300`;
  }
  if (active) {
    return `${base} bg-[#1a3d1a] text-white shadow-sm`;
  }
  return `${base} text-ink-700 hover:text-ink`;
}

function countClass(active: boolean, disabled: boolean): string {
  if (disabled) return "text-ink-300";
  if (active) return "text-white/75";
  return "text-ink-500";
}

export function CategoryChips({
  active,
  counts,
  onChange,
  disabled = false,
}: Props) {
  const allActive = active === null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startScrollLeft: number;
    moved: boolean;
    captured: boolean;
  } | null>(null);

  // Capture is deferred until the pointer has actually moved past the
  // threshold. Capturing on pointerdown breaks button clicks in Chrome
  // because the click then targets the capturing div, not the chip.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (!scrollRef.current) return;
    dragRef.current = {
      startX: e.clientX,
      startScrollLeft: scrollRef.current.scrollLeft,
      moved: false,
      captured: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !scrollRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) {
      if (!dragRef.current.captured) {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current.captured = true;
      }
      dragRef.current.moved = true;
      scrollRef.current.scrollLeft = dragRef.current.startScrollLeft - dx;
    }
  };

  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (
      dragRef.current?.captured &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // Defer clearing so onClickCapture can read `moved`
    const last = dragRef.current;
    setTimeout(() => {
      if (dragRef.current === last) dragRef.current = null;
    }, 0);
  };

  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (dragRef.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={scrollRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={onClickCapture}
      className="scrollbar-hide -mr-3 min-w-0 cursor-grab overflow-x-auto pr-3 active:cursor-grabbing md:mr-0 md:pr-0"
    >
      <div
        role="group"
        aria-label="Filter by category"
        className="inline-flex items-center gap-1 rounded-full border border-ink-300 bg-white p-1"
      >
      <button
        type="button"
        aria-pressed={allActive}
        disabled={disabled}
        onClick={() => onChange(null)}
        className={`${chipClass(allActive, disabled)} ${focusRing}`}
      >
        <span>All</span>
        <span
          className={`text-xs font-normal tabular-nums ${countClass(allActive, disabled)}`}
          aria-hidden="true"
        >
          {counts.all}
        </span>
        <span className="sr-only">{counts.all} items</span>
      </button>

      {CATEGORY_ORDER.map((cat) => {
        const count = counts[cat];
        if (count === 0 && active !== cat) return null;
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => onChange(isActive ? null : cat)}
            className={`${chipClass(isActive, disabled)} ${focusRing}`}
          >
            <span>{CATEGORY_LABELS[cat]}</span>
            <span
              className={`text-xs font-normal tabular-nums ${countClass(isActive, disabled)}`}
              aria-hidden="true"
            >
              {count}
            </span>
            <span className="sr-only">{count} items</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
