import { useNavigate } from "react-router-dom";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import type { Session } from "@/data/mockData";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { buildMod3Flow, routeForSession } from "@/pages/embark/learner/home/JourneyTabs";

function subtitleFor(session: Session): string {
  if (session.status === "skipped") return "Skipped · optional";
  if (session.id.startsWith("micro-")) return `Micro-learning · ${session.duration} min`;
  if (session.sessionKind === "knowledge_check") return `Knowledge check · ${session.duration} min`;
  if (session.sessionKind === "module_assessment") return `Module assessment · ${session.duration} min`;
  if (session.sessionKind === "chapter_gate") return `Chapter gate · ${session.duration} min`;
  if (session.sessionKind === "roleplay" || session.modality === "role_play") {
    return `Role play · ${session.duration} min`;
  }
  if (session.modality === "video") return `Video · ${session.duration} min`;
  return `Article · ${session.duration} min`;
}

function stepStatus(session: Session, currentId: string | null): SessionStep["status"] {
  if (currentId && session.id === currentId) return "current";
  if (session.status === "completed") return "completed";
  if (session.status === "skipped") return "skipped";
  if (session.status === "locked") return "locked";
  if (session.status === "in_progress" && !currentId) return "current";
  return "upcoming";
}

export function sessionsToJourneySteps(
  sessions: Session[],
  currentId: string | null,
  navigate: (path: string) => void,
): SessionStep[] {
  return sessions.map((session) => {
    const status = stepStatus(session, currentId);
    const target = routeForSession(session);
    const open =
      session.status === "completed" || session.status === "skipped"
        ? `${target}${target.includes("?") ? "&" : "?"}review=true`
        : target;
    return {
      id: session.id,
      name: session.name,
      subtitle: subtitleFor(session),
      modality: session.modality,
      status,
      onClick: status === "locked" ? undefined : () => navigate(open),
    };
  });
}

/** Sidebar steps for the Rathbones learner journey. Null for other organisations. */
export function useLearnerJourneySteps(currentId: string | null) {
  const navigate = useNavigate();
  const { org } = useOrganisation();
  const { progress } = useModule3Progress();
  const { state } = useJourneyAdaptation();
  if (org !== "rathbones") return null;
  const sessions = applyAdaptation(buildMod3Flow(progress, org), state);
  const index = currentId ? sessions.findIndex((session) => session.id === currentId) : -1;
  const done = sessions.filter((session) => session.status === "completed").length;
  return {
    steps: sessionsToJourneySteps(sessions, currentId, navigate),
    stepsMeta: `IM Intake Pathway · ${done}/${sessions.length}`,
    positionLabel: index >= 0 ? `Session ${index + 1} of ${sessions.length}` : "Managing Clients",
  };
}
