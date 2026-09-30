import { useCallback, useEffect, useState } from "react";
import { getReadinessActivities } from "@/data/readinessJourney";
import { useOrganisation } from "@/hooks/use-organisation";

export type ActivityStatus = "not_started" | "in_progress" | "completed";

type ProgressMap = Record<string, ActivityStatus>;

const KEY = "embark:readiness-progress";
const EVENT = "readiness-progress-change";

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(next: ProgressMap) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useReadinessProgress() {
  const { org } = useOrganisation();
  const activities = getReadinessActivities(org);
  const [progress, setProgress] = useState<ProgressMap>(read);

  useEffect(() => {
    const handler = () => setProgress(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setStatus = useCallback((id: string, status: ActivityStatus) => {
    const next = { ...read(), [id]: status };
    write(next);
    setProgress(next);
  }, []);

  const markStarted = useCallback(
    (id: string) => {
      if (read()[id]) return;
      setStatus(id, "in_progress");
    },
    [setStatus],
  );

  const markCompleted = useCallback((id: string) => setStatus(id, "completed"), [setStatus]);

  const reset = useCallback(() => {
    write({});
    setProgress({});
  }, []);

  const statusOf = useCallback(
    (id: string): ActivityStatus => progress[id] ?? "not_started",
    [progress],
  );

  const completedCount = activities.filter((a) => progress[a.id] === "completed").length;

  return {
    progress,
    statusOf,
    setStatus,
    markStarted,
    markCompleted,
    reset,
    completedCount,
    totalCount: activities.length,
  };
}
