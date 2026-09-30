import { useCallback, useEffect, useState } from "react";
import type { Session } from "@/data/mockData";

export type MicroLearning = {
  id: string;
  afterId: string;
  topic: string;
  /** Existing question prompts or skill notes for this topic. */
  points: string[];
};

type State = {
  completed: string[];
  skipped: string[];
  added: MicroLearning[];
};

const STORAGE_KEY = "embark:journey-adaptation:v1";
const EVENT = "embark:journey-adaptation-change";

const EMPTY: State = { completed: [], skipped: [], added: [] };

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      completed: parsed.completed ?? [],
      skipped: parsed.skipped ?? [],
      added: parsed.added ?? [],
    };
  } catch {
    return EMPTY;
  }
}

function write(next: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function slug(topic: string) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Next article after this item. Checks and role-plays are left in place. */
function nextArticleId(items: Session[], afterId: string): string | undefined {
  const start = items.findIndex((item) => item.id === afterId);
  if (start < 0) return undefined;
  return items.slice(start + 1).find((item) => item.sessionKind === "content")?.id;
}

export function applyAdaptation(base: Session[], state: State): Session[] {
  const ordered: Session[] = [];
  for (const item of base) {
    ordered.push(item);
    for (const micro of state.added.filter((entry) => entry.afterId === item.id)) {
      ordered.push({
        id: micro.id,
        moduleId: item.moduleId,
        number: item.number,
        name: `Micro-learning — ${micro.topic}`,
        status: "locked",
        modality: "article",
        duration: 8,
        sessionKind: "content",
      });
    }
  }
  let opened = false;
  return ordered.map((item) => {
    if (state.completed.includes(item.id)) return { ...item, status: "completed" as const };
    if (state.skipped.includes(item.id)) return { ...item, status: "skipped" as const };
    if (!opened) {
      opened = true;
      return { ...item, status: "in_progress" as const };
    }
    return { ...item, status: "locked" as const };
  });
}

export function useJourneyAdaptation() {
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

  const settleContent = useCallback((itemId: string) => {
    const current = read();
    if (current.completed.includes(itemId) || current.skipped.includes(itemId)) return;
    write({ ...current, completed: [...current.completed, itemId] });
  }, []);

  /** Mark a micro-learning complete. Pass reopenId to put that activity back on the path. */
  const finishMicro = useCallback((itemId: string, reopenId?: string): State => {
    const current = read();
    const completed = current.completed.includes(itemId)
      ? [...current.completed]
      : [...current.completed, itemId];
    const next = {
      ...current,
      completed: reopenId ? completed.filter((id) => id !== reopenId) : completed,
    };
    write(next);
    return next;
  }, []);

  const settleOutcome = useCallback(
    (itemId: string, base: Session[], passed: boolean, topics: { topic: string; points: string[] }[]): State => {
      const current = read();
      if (current.completed.includes(itemId)) return current;
      const completed = [...current.completed, itemId];
      if (passed) {
        // Knowledge check 1 continues into Discovery and objectives.
        const articleId = itemId === "mc-k1" ? undefined : nextArticleId(base, itemId);
        const skipped =
          articleId && !completed.includes(articleId) && !current.skipped.includes(articleId)
            ? [...current.skipped, articleId]
            : current.skipped;
        const next = { ...current, completed, skipped };
        write(next);
        return next;
      }
      const existing = new Set(current.added.map((entry) => entry.id));
      const added = [...current.added];
      const reopen = new Set<string>();
      for (const entry of topics) {
        const id = `micro-${itemId}-${slug(entry.topic)}`;
        reopen.add(id);
        if (existing.has(id)) continue;
        added.push({ id, afterId: itemId, topic: entry.topic, points: entry.points });
      }
      const next = {
        ...current,
        completed: completed.filter((id) => !reopen.has(id)),
        added,
      };
      write(next);
      return next;
    },
    [],
  );

  return { state, settleContent, finishMicro, settleOutcome, added: state.added };
}
