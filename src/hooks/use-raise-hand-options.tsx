import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type RaiseHandOptionKey = "manager" | "coaching";

type State = Record<RaiseHandOptionKey, boolean>;

const DEFAULT: State = { manager: true, coaching: true };
const STORAGE_KEY = "embark:raise-hand-options";

export const RAISE_HAND_PRIORITY: RaiseHandOptionKey[] = ["manager", "coaching"];

type Ctx = State & {
  setOption: (key: RaiseHandOptionKey, value: boolean) => void;
  activeOptions: RaiseHandOptionKey[];
};

const RaiseHandOptionsContext = createContext<Ctx>({
  ...DEFAULT,
  setOption: () => {},
  activeOptions: RAISE_HAND_PRIORITY,
});

export function RaiseHandOptionsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      const parsed = JSON.parse(raw) as Partial<State>;
      return {
        manager: parsed.manager ?? DEFAULT.manager,
        coaching: parsed.coaching ?? DEFAULT.coaching,
      };
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

  const setOption = useCallback((key: RaiseHandOptionKey, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const activeOptions = useMemo(
    () => RAISE_HAND_PRIORITY.filter((k) => state[k]),
    [state],
  );

  return (
    <RaiseHandOptionsContext.Provider value={{ ...state, setOption, activeOptions }}>
      {children}
    </RaiseHandOptionsContext.Provider>
  );
}

export const useRaiseHandOptions = () => useContext(RaiseHandOptionsContext);