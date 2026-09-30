import { useCallback, useEffect, useState } from "react";
import { MODALITY_LABEL } from "@/lib/modality";

export type ConsumptionOrder = "in-order" | "any-order";

export type AdditionType = "Comprehension Check" | "Role-Play" | "Assessment";

export interface EmbarkAddition {
  id: string;
  type: AdditionType;
  title: string;
  moduleId: string;
  /** null = inserted at the end of the module */
  afterSessionId: string | null;
}

export interface EmbarkCurriculumConfig {
  modalities: string[];
  thresholds: Record<string, string>;
  order: ConsumptionOrder;
  mandatory: Record<string, boolean>;
  /** Per content item default modality; "" = unset. */
  defaultModalities: Record<string, string>;
  additions: EmbarkAddition[];
  /** Per assessment item attempts override for this curriculum. */
  attempts: Record<string, { attempts: string; unlimited: boolean }>;
}

/** Canonical learner-facing modalities used by the multi-modality switcher. */
export const MODALITY_OPTIONS = Object.values(MODALITY_LABEL);

const STORAGE_PREFIX = "embark-curriculum-config:";

export function makeDefaultConfig(sectionIds: string[]): EmbarkCurriculumConfig {
  return {
    modalities: [...MODALITY_OPTIONS],
    thresholds: Object.fromEntries(sectionIds.map((id) => [id, "100"])),
    order: "in-order",
    mandatory: {},
    defaultModalities: {},
    additions: [],
    attempts: {},
  };
}

export function useEmbarkCurriculumConfig(curriculumId: string, sectionIds: string[]) {
  const key = STORAGE_PREFIX + curriculumId;

  const read = useCallback((): EmbarkCurriculumConfig => {
    const defaults = makeDefaultConfig(sectionIds);
    if (typeof window === "undefined") return defaults;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw) as Partial<EmbarkCurriculumConfig>;
      return {
        ...defaults,
        ...parsed,
        thresholds: { ...defaults.thresholds, ...(parsed.thresholds ?? {}) },
        mandatory: { ...defaults.mandatory, ...(parsed.mandatory ?? {}) },
        defaultModalities: { ...defaults.defaultModalities, ...(parsed.defaultModalities ?? {}) },
        attempts: { ...defaults.attempts, ...(parsed.attempts ?? {}) },
        additions: Array.isArray(parsed.additions) ? parsed.additions : [],
      };
    } catch {
      return defaults;
    }
  }, [key, sectionIds]);

  const [saved, setSaved] = useState<EmbarkCurriculumConfig>(read);

  useEffect(() => {
    setSaved(read());
  }, [read]);

  const save = useCallback(
    (next: EmbarkCurriculumConfig) => {
      setSaved(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [key],
  );

  return { saved, save };
}
