"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "gh-saved-lineup";

type SavedCtx = {
  savedIds: Set<string>;
  count: number;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

const Ctx = createContext<SavedCtx | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr)) {
          setSavedIds(new Set(arr.filter((v): v is string => typeof v === "string")));
        }
      }
    } catch {
      // Ignore storage errors (private mode, quota, etc.)
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(savedIds))
      );
    } catch {
      // Ignore storage errors
    }
  }, [savedIds, hydrated]);

  const toggle = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<SavedCtx>(
    () => ({
      savedIds,
      count: savedIds.size,
      isSaved: (id: string) => savedIds.has(id),
      toggle,
    }),
    [savedIds, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSaved(): SavedCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSaved must be used inside <SavedProvider>");
  return v;
}
