import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type PreferredModality = "none" | "video" | "audio" | "text" | "interactive";

const STORAGE_KEY = "embark:learner-prefs";

type Prefs = {
  preferredModality: PreferredModality;
};

const DEFAULT_PREFS: Prefs = { preferredModality: "none" };

type Ctx = {
  prefs: Prefs;
  setPreferredModality: (m: PreferredModality) => void;
};

const LearnerPreferencesContext = createContext<Ctx | null>(null);

function readInitial(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function LearnerPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(readInitial);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  const setPreferredModality = useCallback((m: PreferredModality) => {
    setPrefs((p) => ({ ...p, preferredModality: m }));
  }, []);

  return (
    <LearnerPreferencesContext.Provider value={{ prefs, setPreferredModality }}>
      {children}
    </LearnerPreferencesContext.Provider>
  );
}

export function useLearnerPreferences(): Ctx {
  const ctx = useContext(LearnerPreferencesContext);
  if (!ctx) {
    // Safe fallback so components used outside provider still function.
    return {
      prefs: DEFAULT_PREFS,
      setPreferredModality: () => {},
    };
  }
  return ctx;
}
