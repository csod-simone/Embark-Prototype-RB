/** EU AI Act transparency helpers — Art. 50(2) machine-readable layer + flag telemetry. */

export type AiArticleRef = "art-50-1" | "art-50-2" | "art-13" | "art-14" | "art-26";
export type AiContentKind = "ai-generated" | "ai-derived" | "ai-recommended";

export interface AiProvenanceRecord {
  schemaVersion: "1";
  generator: "embark-roleplay";
  model: string;
  markedAt: string;
  aiaArticle: "50(2)";
  scenarioId: string;
  runId: string;
}

export type { AiProvenanceRecord as RolePlayAiProvenance };

export const AI_MARK_ATTR = "data-csod-ai-generated";
export const AI_KIND_ATTR = "data-csod-ai-kind";
export const AI_ARTICLE_ATTR = "data-csod-aia-article";

export function aiMarkProps(kind: AiContentKind = "ai-generated") {
  return {
    [AI_MARK_ATTR]: "true",
    [AI_KIND_ATTR]: kind,
    [AI_ARTICLE_ATTR]: "50(2)",
  } as const;
}

export function createRoleplayProvenance(scenarioId: string, model = "embark-roleplay-stub"): AiProvenanceRecord {
  return {
    schemaVersion: "1",
    generator: "embark-roleplay",
    model,
    markedAt: new Date().toISOString(),
    aiaArticle: "50(2)",
    scenarioId,
    runId: crypto.randomUUID(),
  };
}

export interface AiFlagTelemetry {
  event: "ai_flag_rendered";
  variant: AiContentKind;
  surface: string;
  fieldName?: string;
  articleRef?: AiArticleRef;
  timestamp: string;
}

/** Prototype telemetry — replace with product analytics pipeline in production. */
export function logAiFlagRendered(params: {
  variant: AiContentKind;
  surface: string;
  fieldName?: string;
  articleRef?: AiArticleRef;
}) {
  const entry: AiFlagTelemetry = {
    event: "ai_flag_rendered",
    variant: params.variant,
    surface: params.surface,
    fieldName: params.fieldName,
    articleRef: params.articleRef,
    timestamp: new Date().toISOString(),
  };
  try {
    const key = "ai-flag-telemetry";
    const prev = JSON.parse(sessionStorage.getItem(key) || "[]") as AiFlagTelemetry[];
    sessionStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 50)));
  } catch {
    /* ignore storage failures */
  }
  if (import.meta.env.DEV) {
    console.debug("[ai_flag_rendered]", entry);
  }
}

/** WAI export rule — prefix AI-authored text for clipboard / share payloads. */
export function prefixAiExport(text: string): string {
  return `[AI] ${text}`;
}

export interface RoleplayShareExport {
  url: string;
  provenance: AiProvenanceRecord;
  markedAt: string;
  disclaimer: string;
}

export function buildRoleplaySharePayload(
  url: string,
  provenance: AiProvenanceRecord,
): string {
  const payload: RoleplayShareExport = {
    url,
    provenance,
    markedAt: provenance.markedAt,
    disclaimer: prefixAiExport(
      "Practice review includes AI-generated simulation dialogue and evidence-grounded coaching. Check for accuracy.",
    ),
  };
  return `${payload.disclaimer}\n\n${url}\n\n${JSON.stringify({ csodAiProvenance: payload.provenance })}`;
}
