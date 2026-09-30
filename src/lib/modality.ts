import type { PreferredModality } from "@/hooks/use-learner-preferences";

export type Modality = "video" | "audio" | "text" | "interactive";

export const MODALITY_LABEL: Record<Modality, string> = {
  video: "Video",
  audio: "Audio",
  text: "Text",
  interactive: "Interactive",
};

const PRIORITY: Modality[] = ["video", "audio", "text", "interactive"];

/** Modalities with a content presentation in the prototype. */
const RENDERABLE: Modality[] = ["video", "text"];

type SessionLike = {
  id?: string;
  moduleId?: string;
  modality?: string;
};

/**
 * Stub modality availability per PRD. Assessments and role-plays are not
 * "content items" and never expose the switcher — return a single entry so
 * callers treat them as single-modality (no selector, no chip).
 */
export function getAvailableModalities(s: SessionLike): Modality[] {
  const modality = s.modality;
  if (modality === "assessment" || modality === "role_play") return [];

  let stub: Modality[];
  switch (s.moduleId) {
    case "mod1":
      stub = ["video", "text"];
      break;
    case "mod2":
      stub = ["video", "text"];
      break;
    case "mod3":
      stub = ["video", "text"];
      break;
    case "mod4":
      stub = ["video", "text"];
      break;
    default:
      stub = ["video", "text"];
  }

  // Always include the content's own modality.
  const own = normalizeModality(modality);
  const merged = new Set<Modality>(stub);
  if (own) merged.add(own);
  return PRIORITY.filter((m) => merged.has(m) && RENDERABLE.includes(m));
}

function normalizeModality(m: string | undefined): Modality | null {
  if (!m) return null;
  if (m === "article" || m === "reading") return "text";
  if (m === "video" || m === "audio" || m === "text" || m === "interactive") return m;
  return null;
}

const SESSION_STORAGE_PREFIX = "embark:modality:";

export function readRememberedModality(sessionId: string): Modality | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(SESSION_STORAGE_PREFIX + sessionId);
    if (v && ["video", "audio", "text", "interactive"].includes(v)) return v as Modality;
  } catch {
    // ignore
  }
  return null;
}

export function rememberModality(sessionId: string, m: Modality) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_PREFIX + sessionId, m);
  } catch {
    // ignore
  }
}

export function resolveDefaultModality(
  available: Modality[],
  preferred: PreferredModality,
  remembered: Modality | null,
  original?: Modality,
): Modality {
  if (available.length === 0) return "text";
  if (preferred !== "none" && available.includes(preferred as Modality)) {
    return preferred as Modality;
  }
  if (remembered && available.includes(remembered)) return remembered;
  if (original && available.includes(original)) return original;
  for (const m of PRIORITY) {
    if (available.includes(m)) return m;
  }
  return available[0];
}
