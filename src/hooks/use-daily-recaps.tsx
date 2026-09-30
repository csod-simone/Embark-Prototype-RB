import { createContext, useCallback, useContext, useEffect, useState } from "react";

type State = {
  master: boolean;
  startOfDay: boolean;
  midDay: boolean;
  endOfDay: boolean;
};

const DEFAULT: State = { master: false, startOfDay: false, midDay: false, endOfDay: false };
const STORAGE_KEY = "embark:daily-recaps";

type Ctx = State & {
  setField: (key: keyof State, value: boolean) => void;
};

const DailyRecapsContext = createContext<Ctx>({ ...DEFAULT, setField: () => {} });

export function DailyRecapsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      return { ...DEFAULT, ...JSON.parse(raw) } as State;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setField = useCallback((key: keyof State, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <DailyRecapsContext.Provider value={{ ...state, setField }}>
      {children}
    </DailyRecapsContext.Provider>
  );
}

export const useDailyRecaps = () => useContext(DailyRecapsContext);
