import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * How learners are registered for a live event session on a cohort.
 * - "assigned": the administrator picks one session and everyone is registered for it.
 * - "learner": learners choose and register for their own session.
 */
export type EventRegistrationMode = "assigned" | "learner";

export type EventRegistrationConfig = {
  eventId: string;
  mode: EventRegistrationMode;
  /** Only set when mode is "assigned". */
  sessionId?: string;
};

/** Registration configuration keyed by cohort id, then by event id. */
type State = Record<string, Record<string, EventRegistrationConfig>>;

const STORAGE_KEY = "embark:event-registration:v1";

/**
 * Demo seeds so the "Events and Sessions" step opens in a configured state.
 * Only applied for cohorts with no saved configuration, so admin edits persist.
 * CSR Onboarding Cohort A is intentionally left unset to show the default path.
 */
const DEFAULT: State = {};


type Ctx = {
  /** Configuration for every event on a cohort. */
  configsFor: (cohortId: string) => EventRegistrationConfig[];
  /** Configuration for one event on a cohort. */
  configFor: (cohortId: string, eventId: string) => EventRegistrationConfig | undefined;
  /** Replaces the whole configuration set for a cohort. */
  setConfigs: (cohortId: string, configs: EventRegistrationConfig[]) => void;
  /** First configuration found for an event across all cohorts. */
  anyConfigFor: (eventId: string) => EventRegistrationConfig | undefined;
  /** The session a learner has registered for, when they choose their own. */
  learnerSessionFor: (eventId: string) => string | undefined;
  setLearnerSession: (eventId: string, sessionId: string | undefined) => void;
};

const EventRegistrationContext = createContext<Ctx>({
  configsFor: () => [],
  configFor: () => undefined,
  setConfigs: () => {},
  anyConfigFor: () => undefined,
  learnerSessionFor: () => undefined,
  setLearnerSession: () => {},
});

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

/**
 * Adds demo-seeded events that a previously saved state predates, without
 * overwriting any configuration the administrator has already made.
 */
function withSeeds(state: State): State {
  const next = { ...state };
  for (const [cohortId, byEvent] of Object.entries(DEFAULT)) {
    const existing = next[cohortId];
    if (!existing) continue;
    const merged = { ...existing };
    for (const [eventId, config] of Object.entries(byEvent)) {
      if (!merged[eventId]) merged[eventId] = config;
    }
    next[cohortId] = merged;
  }
  return next;
}

export function EventRegistrationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => withSeeds(readStored<State>(STORAGE_KEY, DEFAULT)));
  const [learnerSessions, setLearnerSessions] = useState<Record<string, string>>(() =>
    readStored<Record<string, string>>(`${STORAGE_KEY}:learner`, {}),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${STORAGE_KEY}:learner`, JSON.stringify(learnerSessions));
    } catch {
      // ignore
    }
  }, [learnerSessions]);

  const configsFor = useCallback(
    (cohortId: string) => Object.values(state[cohortId] ?? {}),
    [state],
  );

  const configFor = useCallback(
    (cohortId: string, eventId: string) => state[cohortId]?.[eventId],
    [state],
  );

  const setConfigs = useCallback((cohortId: string, configs: EventRegistrationConfig[]) => {
    setState((prev) => ({
      ...prev,
      [cohortId]: Object.fromEntries(configs.map((c) => [c.eventId, c])),
    }));
  }, []);

  const anyConfigFor = useCallback(
    (eventId: string) => {
      for (const byEvent of Object.values(state)) {
        if (byEvent[eventId]) return byEvent[eventId];
      }
      return undefined;
    },
    [state],
  );

  const learnerSessionFor = useCallback(
    (eventId: string) => learnerSessions[eventId],
    [learnerSessions],
  );

  const setLearnerSession = useCallback((eventId: string, sessionId: string | undefined) => {
    setLearnerSessions((prev) => {
      const next = { ...prev };
      if (sessionId) next[eventId] = sessionId;
      else delete next[eventId];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ configsFor, configFor, setConfigs, anyConfigFor, learnerSessionFor, setLearnerSession }),
    [configsFor, configFor, setConfigs, anyConfigFor, learnerSessionFor, setLearnerSession],
  );

  return (
    <EventRegistrationContext.Provider value={value}>
      {children}
    </EventRegistrationContext.Provider>
  );
}

export const useEventRegistration = () => useContext(EventRegistrationContext);
