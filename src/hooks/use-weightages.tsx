import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type WeightComponent = { id: string; label: string; weight: number };
export type ReadinessBand = { id: string; min: number; label: string };

export const DEFAULT_WEIGHT_COMPONENTS: WeightComponent[] = [
  { id: "assessment", label: "Assessment Performance", weight: 45 },
  { id: "knowledge", label: "Knowledge Checks", weight: 25 },
  { id: "pace", label: "Learning Pace & Time on Task", weight: 20 },
  { id: "engagement", label: "Engagement Signals", weight: 10 },
];

export const DEFAULT_READINESS_BANDS: ReadinessBand[] = [
  { id: "band1", min: 85, label: "Ready" },
  { id: "band2", min: 70, label: "On Track" },
  { id: "band3", min: 50, label: "Needs Attention" },
  { id: "band4", min: 0, label: "At Risk" },
];

const STORAGE_KEY = "embark:weightages";

export type WeightagesState = {
  components: WeightComponent[];
  bands: ReadinessBand[];
};

const DEFAULT_STATE: WeightagesState = {
  components: DEFAULT_WEIGHT_COMPONENTS,
  bands: DEFAULT_READINESS_BANDS,
};

function matchesDefaultComponents(value: unknown): value is WeightComponent[] {
  if (!Array.isArray(value) || value.length !== DEFAULT_WEIGHT_COMPONENTS.length) return false;
  return DEFAULT_WEIGHT_COMPONENTS.every((component, index) => value[index]?.id === component.id);
}

type Ctx = WeightagesState & { save: (next: WeightagesState) => void };

const WeightagesContext = createContext<Ctx>({ ...DEFAULT_STATE, save: () => {} });

export function WeightagesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WeightagesState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw) as Partial<WeightagesState>;
      return {
        components: matchesDefaultComponents(parsed.components)
          ? (parsed.components as WeightComponent[])
          : DEFAULT_WEIGHT_COMPONENTS,
        bands:
          Array.isArray(parsed.bands) && parsed.bands.length === 4
            ? (parsed.bands as ReadinessBand[])
            : DEFAULT_READINESS_BANDS,
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const save = useCallback((next: WeightagesState) => setState(next), []);

  return (
    <WeightagesContext.Provider value={{ ...state, save }}>{children}</WeightagesContext.Provider>
  );
}

export const useWeightages = () => useContext(WeightagesContext);