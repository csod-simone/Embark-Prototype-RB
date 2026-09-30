import { useCallback, useEffect, useState } from "react";
import { ASSESSMENT_DEFAULTS } from "@/data/assessmentTypes";

export type AssessmentAttempt = {
  used: number;
  paused: boolean;
  /** A fail before the retakes run out asks the line manager to check in. */
  checkIn: boolean;
  score?: number;
  total?: number;
  name?: string;
  kind?: string;
};

type State = Record<string, AssessmentAttempt>;

const STORAGE_KEY = "embark:assessment-attempts:v1";
const EVENT = "embark:assessment-attempts-change";
const EMPTY: AssessmentAttempt = { used: 0, paused: false, checkIn: false };

function read(): State {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as State;
  } catch {
    return {};
  }
}

function write(next: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Attempts allowed for a Managing Clients assessment, including the first sitting. */
export function attemptAllowance(sessionKind?: string): number {
  if (sessionKind === "knowledge_check") return ASSESSMENT_DEFAULTS["Knowledge Check"].attempts ?? 4;
  if (sessionKind === "chapter_gate") return ASSESSMENT_DEFAULTS["Chapter Gate"].attempts ?? 1;
  return ASSESSMENT_DEFAULTS["Module Assessment"].attempts ?? 4;
}

export function useAssessmentAttempts() {
  const [state, setState] = useState<State>(() => read());

  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const recordAttempt = useCallback(
    (
      itemId: string,
      input: { passed: boolean; score: number; total: number; max: number; name: string; kind?: string },
    ): AssessmentAttempt => {
      const current = read();
      const prev = current[itemId] ?? EMPTY;
      if (prev.paused) return prev;
      const used = prev.used + 1;
      const paused = !input.passed && used >= input.max;
      const nextAttempt: AssessmentAttempt = {
        used,
        paused,
        checkIn: !input.passed && !paused,
        score: input.score,
        total: input.total,
        name: input.name,
        kind: input.kind,
      };
      write({ ...current, [itemId]: nextAttempt });
      return nextAttempt;
    },
    [],
  );

  const acknowledgeCheckIn = useCallback((itemId: string) => {
    const current = read();
    const prev = current[itemId];
    if (!prev?.checkIn) return;
    write({ ...current, [itemId]: { ...prev, checkIn: false } });
  }, []);

  const reopen = useCallback((itemId: string) => {
    const current = read();
    const prev = current[itemId];
    if (!prev) return;
    write({ ...current, [itemId]: { ...prev, used: 0, paused: false } });
  }, []);

  const paused = Object.entries(state)
    .filter(([, attempt]) => attempt.paused)
    .map(([id, attempt]) => ({ id, ...attempt }));

  const checkIns = Object.entries(state)
    .filter(([, attempt]) => attempt.checkIn && !attempt.paused)
    .map(([id, attempt]) => ({ id, ...attempt }));

  return {
    state,
    recordAttempt,
    reopen,
    acknowledgeCheckIn,
    paused,
    checkIns,
    forItem: (itemId: string | null) => (itemId ? { ...EMPTY, ...state[itemId] } : EMPTY),
  };
}
