import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  useEmbarkCurriculumConfig,
  type EmbarkAddition,
  type EmbarkCurriculumConfig,
} from "@/hooks/use-embark-curriculum-config";
import { defaultModules } from "./curriculumData";

export const SECTION_IDS = defaultModules.map((m) => m.id);

export type InsertionPoint = { moduleId: string; afterSessionId: string | null };

type Ctx = {
  draft: EmbarkCurriculumConfig;
  update: (patch: Partial<EmbarkCurriculumConfig>) => void;
  save: () => void;
  cancel: () => void;
  hasError: boolean;
  thresholdInvalid: (id: string) => boolean;
  addAt: (point: InsertionPoint) => void;
  removeAddition: (id: string) => void;
  pendingInsertion: InsertionPoint | null;
  clearPendingInsertion: () => void;
  addItems: (point: InsertionPoint, items: { type: EmbarkAddition["type"]; title: string }[]) => void;
};

const EmbarkConfigContext = createContext<Ctx | null>(null);

export const isThresholdInvalid = (v: string) => {
  if (!/^\d+$/.test((v ?? "").trim())) return true;
  const n = Number(v);
  return n < 0 || n > 100;
};

export function EmbarkConfigProvider({
  curriculumId,
  children,
}: {
  curriculumId: string;
  children: React.ReactNode;
}) {
  const { saved, save: persist } = useEmbarkCurriculumConfig(curriculumId, SECTION_IDS);
  const [draft, setDraft] = useState<EmbarkCurriculumConfig>(saved);
  const [pendingInsertion, setPendingInsertion] = useState<InsertionPoint | null>(null);

  const update = useCallback(
    (patch: Partial<EmbarkCurriculumConfig>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );

  const value = useMemo<Ctx>(() => {
    const hasError =
      draft.modalities.length === 0 ||
      SECTION_IDS.some((id) => isThresholdInvalid(draft.thresholds[id] ?? ""));

    return {
      draft,
      update,
      save: () => {
        if (hasError) return;
        persist(draft);
      },
      cancel: () => setDraft(saved),
      hasError,
      thresholdInvalid: (id: string) => isThresholdInvalid(draft.thresholds[id] ?? ""),
      addAt: (point) => setPendingInsertion(point),
      removeAddition: (id) =>
        setDraft((d) => ({ ...d, additions: d.additions.filter((a) => a.id !== id) })),
      pendingInsertion,
      clearPendingInsertion: () => setPendingInsertion(null),
      addItems: (point, items) =>
        setDraft((d) => ({
          ...d,
          additions: [
            ...d.additions,
            ...items.map((it, i) => ({
              id: `add-${Date.now()}-${i}`,
              type: it.type,
              title: it.title,
              moduleId: point.moduleId,
              afterSessionId: point.afterSessionId,
            })),
          ],
        })),
    };
  }, [draft, update, persist, saved, pendingInsertion]);

  return <EmbarkConfigContext.Provider value={value}>{children}</EmbarkConfigContext.Provider>;
}

export function useEmbarkConfigContext() {
  return useContext(EmbarkConfigContext);
}