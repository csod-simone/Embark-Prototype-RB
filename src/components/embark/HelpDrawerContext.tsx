import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { HelpRequestDrawer } from "./HelpRequestDrawer";

type HelpDrawerContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  resolved: boolean;
  markResolved: () => void;
};

const HelpDrawerContext = createContext<HelpDrawerContextValue | null>(null);

export function HelpDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [resolved, setResolved] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const markResolved = useCallback(() => setResolved(true), []);

  const value = useMemo<HelpDrawerContextValue>(
    () => ({ open, openDrawer, closeDrawer, resolved, markResolved }),
    [open, openDrawer, closeDrawer, resolved, markResolved],
  );

  return (
    <HelpDrawerContext.Provider value={value}>
      {children}
      <HelpRequestDrawer />
    </HelpDrawerContext.Provider>
  );
}

export function useHelpDrawer() {
  const ctx = useContext(HelpDrawerContext);
  if (!ctx) {
    // Safe fallback: no-ops so consumers outside the provider don't crash.
    return {
      open: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      resolved: false,
      markResolved: () => {},
    } satisfies HelpDrawerContextValue;
  }
  return ctx;
}
