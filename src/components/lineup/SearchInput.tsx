"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  debounceMs?: number;
  placeholder?: string;
  label?: string;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function SearchInput({
  value,
  onChange,
  debounceMs = 200,
  placeholder = "Search across the whole festival...",
  label = "Search the lineup",
}: Props) {
  const id = useId();
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const push = (next: string) => {
    setLocal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), debounceMs);
  };

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    setLocal("");
    onChange("");
  };

  return (
    <div className="flex h-12 items-center gap-3 rounded-full border border-ink-300 bg-white px-5">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-ink-500"
      />
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        value={local}
        placeholder={placeholder}
        onChange={(e) => push(e.target.value)}
        className={`flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-500 outline-none ${focusRing}`}
      />
      {local.length > 0 && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100 hover:text-ink ${focusRing}`}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
