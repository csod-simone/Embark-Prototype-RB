import { createContext, useCallback, useContext, useMemo, useState } from "react";

type AskAIContextValue = {
  open: boolean;
  openAskAI: () => void;
  closeAskAI: () => void;
  toggleAskAI: () => void;
};

const AskAIContext = createContext<AskAIContextValue | null>(null);

export function AskAIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openAskAI = useCallback(() => setOpen(true), []);
  const closeAskAI = useCallback(() => setOpen(false), []);
  const toggleAskAI = useCallback(() => setOpen((v) => !v), []);
  const value = useMemo(
    () => ({ open, openAskAI, closeAskAI, toggleAskAI }),
    [open, openAskAI, closeAskAI, toggleAskAI],
  );
  return <AskAIContext.Provider value={value}>{children}</AskAIContext.Provider>;
}

export function useAskAI(): AskAIContextValue {
  const ctx = useContext(AskAIContext);
  if (!ctx) {
    return {
      open: false,
      openAskAI: () => {},
      closeAskAI: () => {},
      toggleAskAI: () => {},
    };
  }
  return ctx;
}