import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type FeatureFlag = { id: string; name: string; description: string; defaultOn: boolean };

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "knowledge_checks", name: "Knowledge checks", description: "A knowledge check follows each course. Turning this off removes those checks.", defaultOn: true },
  { id: "gap_microlearning", name: "Gap microlearning", description: "Where governance allows, Sage can add a short piece of learning for a specific gap instead of repeating the whole module.", defaultOn: false },
  { id: "ai_nudges", name: "AI nudges for managers", description: "Line managers see prompts when a learner is at risk, paused after repeated fails, or spending unusual time on a module.", defaultOn: true },
];

const DEFAULT: Record<string, boolean> = Object.fromEntries(
  FEATURE_FLAGS.map((f) => [f.id, f.defaultOn]),
);
const STORAGE_KEY = "embark:feature-flags";

type Ctx = {
  flags: Record<string, boolean>;
  setFlag: (id: string, value: boolean) => void;
};

const FeatureFlagsContext = createContext<Ctx>({ flags: DEFAULT, setFlag: () => {} });

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      return { ...DEFAULT, ...JSON.parse(raw) };
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch {
      // ignore
    }
  }, [flags]);

  const setFlag = useCallback((id: string, value: boolean) => {
    setFlags((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
