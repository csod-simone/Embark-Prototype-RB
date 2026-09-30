import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { RolePlayExperience } from "@/components/embark/roleplay/RolePlayExperience";
import type { RolePlayScenario } from "@/components/embark/roleplay/types";
import {
  NEXUS_BENEFITS_NAV,
  RATHBONES_FORMATIVE,
  RATHBONES_PRACTICE_DISCOVERY,
  RATHBONES_PRACTICE_SUITABILITY,
} from "@/components/embark/roleplay/scenarios";
import {
  buildManagingClientsRoleplaySteps,
  isMcRoleplayKey,
  MC_JOURNEY_META,
  MC_POSITION_LABEL,
} from "@/components/embark/roleplay/mcJourneyChrome";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";
import { buildReadinessSteps } from "./readinessSteps";

const NEXUS_SCENARIO: RolePlayScenario = {
  ...NEXUS_BENEFITS_NAV,
  scenarioId: "rp-readiness-client-comms",
  personaName: "Elena",
  personaRole: "Implementation lead",
  personaDescription: "Meridian Bank's implementation lead, calm but pointed about the cutover date",
  situation:
    "A rehearsal overran its window yesterday. Elena wants to understand the impact and will press for a firm commitment on the cutover date.",
  objective:
    "Lead with fact and impact before mitigation, separate what is known from what is being confirmed, and close with a dated decision point rather than an open-ended reassurance.",
  constraints: "Do not invent cutover dates. Separate known from unconfirmed.",
  safetyBoundary: "Do not commit to unmeasured dates. Escalate abusive language.",
  scenarioTitle: "Client Communication Role-Play — Cutover Delay",
  openingLine:
    "I heard the rehearsal ran long. I need to know whether the cutover date still stands — and I need an answer today.",
  voiceSampleResponse:
    "The rehearsal took ninety minutes longer than planned, and that puts the current window under pressure. Here's what we know, and here's when I can confirm the rest.",
  timeBudget: { targetMinutes: 12, maxMinutes: 18 },
  focusCriteria: [
    {
      id: "transparency",
      label: "Lead with fact and impact",
      touchKeywords: ["overran", "impact", "pressure", "here's what"],
    },
    {
      id: "commitment",
      label: "Avoid unmeasured commitments",
      touchKeywords: ["confirm", "when", "measure", "cannot commit"],
    },
    {
      id: "close",
      label: "Close with a dated decision point",
      touchKeywords: ["by", "decision", "follow up", "tomorrow"],
    },
  ],
  feedback: {
    score: 76,
    confidence: "Medium",
    skills: [
      {
        name: "Transparency",
        confidence: "High",
        score: 84,
        evidence:
          "You stated the overrun and its impact before offering a mitigation, which is exactly the structure this client responds to.",
      },
      {
        name: "Commitment Credibility",
        confidence: "Medium",
        score: 70,
        evidence:
          "You avoided committing to an unmeasured date, though the confirmation point could have been more specific.",
      },
      {
        name: "Structure",
        confidence: "Medium",
        score: 72,
        evidence:
          "Known and unconfirmed items were mostly separated, but two open items were mixed into the summary.",
      },
      {
        name: "Client Confidence",
        confidence: "High",
        score: 80,
        evidence:
          "You closed with a dated decision point, which kept the conversation from ending on an open question.",
      },
    ],
    worked: [
      "You led with the fact and its impact before offering mitigation.",
      "You declined to commit to a date that had not been measured.",
      "You closed with a specific date for the follow-up decision.",
    ],
    improve: [
      "Keep unconfirmed items in a clearly separate list from confirmed facts.",
      "Name who owns each open item when you summarise.",
      "Offer the rollback position explicitly rather than implying it.",
    ],
    criterionReviews: [
      {
        criterionId: "transparency",
        ordinal: "Strong",
        narrative: "You led with overrun and impact before mitigation.",
        evidenceQuote: "puts the current window under pressure",
      },
      {
        criterionId: "commitment",
        ordinal: "Proficient",
        narrative: "You avoided an unmeasured date; make the confirmation point sharper.",
        evidenceQuote: "here's when I can confirm the rest",
      },
      {
        criterionId: "close",
        ordinal: "Proficient",
        narrative: "Dated decision point was present — name the owner next time.",
        evidenceQuote: "I need an answer today",
      },
    ],
  },
};

function scenarioForActivity(activityId: string | null, isRathbones: boolean): RolePlayScenario {
  if (!isRathbones) return NEXUS_SCENARIO;
  if (activityId === "mc4") return { ...RATHBONES_PRACTICE_DISCOVERY, scenarioId: "rr-mc4" };
  if (activityId === "mc7") return { ...RATHBONES_PRACTICE_SUITABILITY, scenarioId: "rr-mc7" };
  if (activityId === "mc10") return { ...RATHBONES_FORMATIVE, scenarioId: "rr-mc10" };
  return { ...RATHBONES_PRACTICE_SUITABILITY, scenarioId: "rr-a10" };
}

export default function ReadinessRolePlay() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const activityId = params.get("activity");
  const { markCompleted } = useReadinessProgress();
  const { org, project } = useReadinessProfile();
  const isRathbones = org === "rathbones";
  const isMcRoleplay = isRathbones && isMcRoleplayKey(activityId);

  const completeId = activityId ?? "a10";
  const scenario = scenarioForActivity(activityId, isRathbones);
  const steps = useMemo((): SessionStep[] => {
    if (isMcRoleplay && activityId && isMcRoleplayKey(activityId)) {
      return buildManagingClientsRoleplaySteps(activityId, scenario, () =>
        navigate(`/readiness/roleplay?activity=${activityId}`),
      );
    }
    return buildReadinessSteps(completeId, navigate, org);
  }, [isMcRoleplay, activityId, completeId, navigate, org, scenario]);

  return (
    <RolePlayExperience
      topHeader={null}
      scenario={scenario}
      steps={steps}
      stepsMeta={
        isMcRoleplay
          ? MC_JOURNEY_META
          : isRathbones
            ? "Your role readiness journey"
            : "Your project readiness journey"
      }
      positionLabel={isMcRoleplay ? MC_POSITION_LABEL : project.name}
      subtitleBase={
        isMcRoleplay
          ? MC_JOURNEY_META
          : isRathbones
            ? "Role Readiness · Role play"
            : "Project Readiness · Role play"
      }
      framingSubtitle={
        isMcRoleplay
          ? `${MC_JOURNEY_META} · Role play`
          : isRathbones
            ? `Role Readiness · Role play · ~${scenario.timeBudget?.targetMinutes ?? 15} min`
            : "Project Readiness · Role play · ~30 min"
      }
      onBack={() => navigate("/readiness/dashboard")}
      framingPrev={{
        label: "Previous",
        onClick: () =>
          navigate(activityId ? `/readiness/activity/${activityId}` : "/readiness/session/a9"),
      }}
      onExit={() => navigate("/readiness/dashboard")}
      onContinue={() => navigate("/readiness/dashboard")}
      onComplete={() => {
        markCompleted(completeId);
        toast("Role-play complete — your readiness journey has been updated.");
      }}
    />
  );
}
