import { useCallback, useEffect, useState } from "react";

export type Mod3Progress = {
  articleDone: boolean;
  videoDone: boolean;
  assessmentPassed: boolean;
  rolePlayDone: boolean;
};

const STORAGE_KEY = "embark:mod3-progress";
const EVENT = "embark:mod3-progress-change";

const defaultProgress: Mod3Progress = {
  articleDone: false,
  videoDone: false,
  assessmentPassed: false,
  rolePlayDone: false,
};

function read(): Mod3Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...(JSON.parse(raw) as Partial<Mod3Progress>) };
  } catch {
    return defaultProgress;
  }
}

function write(next: Mod3Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export function useModule3Progress() {
  const [progress, setProgress] = useState<Mod3Progress>(() => read());

  useEffect(() => {
    const sync = () => setProgress(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<Mod3Progress>) => {
    const next = { ...read(), ...patch };
    write(next);
    setProgress(next);
  }, []);

  return {
    progress,
    markArticleDone: () => update({ articleDone: true }),
    markVideoDone: () => update({ videoDone: true }),
    markAssessmentPassed: () => update({ assessmentPassed: true }),
    markRolePlayDone: () => update({ rolePlayDone: true }),
    resetProgress: () => {
      write(defaultProgress);
      setProgress(defaultProgress);
    },
  };
}

export type NextStep = "article" | "video" | "assessment" | "roleplay" | "complete";

export function getNextStep(p: Mod3Progress): NextStep {
  if (!p.articleDone) return "article";
  if (!p.videoDone) return "video";
  if (!p.assessmentPassed) return "assessment";
  if (!p.rolePlayDone) return "roleplay";
  return "complete";
}

export type ModuleState = "completed" | "in_progress" | "available" | "locked";

export function getModuleStates(p: Mod3Progress): {
  mod3: ModuleState;
  mod4: ModuleState;
} {
  return {
    mod3: p.rolePlayDone ? "completed" : "in_progress",
    mod4: p.rolePlayDone ? "available" : "locked",
  };
}
