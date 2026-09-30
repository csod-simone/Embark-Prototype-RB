import { useCallback, useEffect, useState } from "react";

export type UpskillerItemStatus = "not_started" | "in_progress" | "completed";

export type UpskillerProgress = {
  completed: string[];
  started: string[];
};

const LEGACY_KEY = "upskiller-completed";
const STORAGE_KEY = "embark:upskiller-progress";
const EVENT = "embark:upskiller-progress-change";

const empty: UpskillerProgress = { completed: [], started: [] };

function read(): UpskillerProgress {
  if (typeof window === "undefined") return empty;
  let completed: string[] = [];
  let started: string[] = [];
  try {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) completed = JSON.parse(legacy) as string[];
  } catch {
    /* ignore */
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UpskillerProgress>;
      if (Array.isArray(parsed.completed)) {
        completed = Array.from(new Set([...completed, ...parsed.completed]));
      }
      if (Array.isArray(parsed.started)) started = parsed.started;
    }
  } catch {
    /* ignore */
  }
  return { completed, started };
}

function write(next: UpskillerProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem(LEGACY_KEY, JSON.stringify(next.completed));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* storage unavailable — progress is not persisted */
  }
}

export function useUpskillerProgress() {
  const [progress, setProgress] = useState<UpskillerProgress>(() => read());

  useEffect(() => {
    const sync = () => setProgress(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markStarted = useCallback((id: string) => {
    const current = read();
    if (current.started.includes(id) || current.completed.includes(id)) return;
    write({ ...current, started: [...current.started, id] });
  }, []);

  /** Returns true when this call newly completed the item. */
  const markCompleted = useCallback((id: string) => {
    const current = read();
    if (current.completed.includes(id)) return false;
    write({
      completed: [...current.completed, id],
      started: current.started.filter((s) => s !== id),
    });
    return true;
  }, []);

  const statusOf = useCallback(
    (id: string): UpskillerItemStatus =>
      progress.completed.includes(id)
        ? "completed"
        : progress.started.includes(id)
          ? "in_progress"
          : "not_started",
    [progress],
  );

  return { progress, statusOf, markStarted, markCompleted };
}