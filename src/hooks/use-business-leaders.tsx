import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "embark:business-leaders:v3:cvs";
const CHANGED_KEY = "embark:business-leaders-changed:v3:cvs";

type Assignments = Record<string, string[]>;
type ChangedAt = Record<string, string>;

type Ctx = {
  assignments: Assignments;
  changedAt: ChangedAt;
  leadersFor: (line: string) => string[];
  changedAtFor: (line: string) => string | undefined;
  touch: (line: string) => void;
  setLeaders: (line: string, userIds: string[]) => void;
  removeLeader: (line: string, userId: string) => void;
};

const BusinessLeadersContext = createContext<Ctx>({
  assignments: {},
  changedAt: {},
  leadersFor: () => [],
  changedAtFor: () => undefined,
  touch: () => {},
  setLeaders: () => {},
  removeLeader: () => {},
});

function read<T extends object>(key: string): T {
  if (typeof window === "undefined") return {} as T;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {} as T;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

/** Seed Business Leader assignments shown before an admin makes any change. */
const SEED_ASSIGNMENTS: Assignments = {
  "Medicare Advantage": ["u-4", "u-3"],
  Medicaid: ["u-9"],
  Commercial: ["u-11", "u-10"],
  "Pharmacy & Part D": ["u-5"],
  "Dual Eligible (D-SNP)": ["u-13"],
  "Operations & Back Office": ["u-20"],
  Aetna: ["u-2", "u-16"],
};

export function BusinessLeadersProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignments>(() => {
    const stored = read<Assignments>(STORAGE_KEY);
    return Object.keys(stored).length ? stored : SEED_ASSIGNMENTS;
  });
  const [changedAt, setChangedAt] = useState<ChangedAt>(() => read<ChangedAt>(CHANGED_KEY));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch {
      /* ignore */
    }
  }, [assignments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHANGED_KEY, JSON.stringify(changedAt));
    } catch {
      /* ignore */
    }
  }, [changedAt]);

  const leadersFor = useCallback((line: string) => assignments[line] ?? [], [assignments]);

  const changedAtFor = useCallback((line: string) => changedAt[line], [changedAt]);

  const touch = useCallback((line: string) => {
    setChangedAt((prev) => ({ ...prev, [line]: new Date().toISOString() }));
  }, []);

  const setLeaders = useCallback((line: string, userIds: string[]) => {
    setAssignments((prev) => ({ ...prev, [line]: userIds }));
    setChangedAt((prev) => ({ ...prev, [line]: new Date().toISOString() }));
  }, []);

  const removeLeader = useCallback((line: string, userId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [line]: (prev[line] ?? []).filter((id) => id !== userId),
    }));
    setChangedAt((prev) => ({ ...prev, [line]: new Date().toISOString() }));
  }, []);

  const value = useMemo(
    () => ({ assignments, changedAt, leadersFor, changedAtFor, touch, setLeaders, removeLeader }),
    [assignments, changedAt, leadersFor, changedAtFor, touch, setLeaders, removeLeader],
  );

  return (
    <BusinessLeadersContext.Provider value={value}>{children}</BusinessLeadersContext.Provider>
  );
}

export const useBusinessLeaders = () => useContext(BusinessLeadersContext);