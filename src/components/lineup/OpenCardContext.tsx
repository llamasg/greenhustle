"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type OpenCardCtx = {
  /** Currently-expanded card id, or null when nothing is open. */
  openId: string | null;
  /** Set the open card directly (used by OnNowBanner auto-open). */
  setOpenId: (id: string | null) => void;
  /** Toggle a card: open if closed, close if already open. */
  toggle: (id: string) => void;
  /** Read-only check for `expanded` props on cards. */
  isOpen: (id: string) => boolean;
};

const Ctx = createContext<OpenCardCtx | null>(null);

export function OpenCardProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const isOpen = useCallback((id: string) => openId === id, [openId]);

  const value = useMemo<OpenCardCtx>(
    () => ({ openId, setOpenId, toggle, isOpen }),
    [openId, toggle, isOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOpenCard(): OpenCardCtx {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useOpenCard must be used inside <OpenCardProvider>");
  return v;
}
