import { createContext, useCallback, useContext, useEffect, useState } from "react";

type State = {
  /** When true, start date and target completion are mandatory in the cohort create/edit flow. */
  datesRequired: boolean;
  /** When true, secondary trainer assignment and the trainer primary/secondary view toggle are enabled. */
  secondaryTrainerEnabled: boolean;
};

const DEFAULT: State = { datesRequired: true, secondaryTrainerEnabled: false };
const STORAGE_KEY = "embark:cohort-settings";

type Ctx = State & {
  setField: (key: keyof State, value: boolean) => void;
};

const CohortSettingsContext = createContext<Ctx>({ ...DEFAULT, setField: () => {} });

export function CohortSettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      const parsed = JSON.parse(raw) as Partial<State>;
      return { ...DEFAULT, ...parsed, secondaryTrainerEnabled: false };
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
    <CohortSettingsContext.Provider value={{ ...state, setField }}>
      {children}
    </CohortSettingsContext.Provider>
  );
}

export const useCohortSettings = () => useContext(CohortSettingsContext);