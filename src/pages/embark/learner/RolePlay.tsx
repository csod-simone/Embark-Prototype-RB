import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { buildMod3SessionSteps } from "@/components/embark/session/sessionSteps";
import { useLearnerJourneySteps } from "@/components/embark/session/learnerJourneySteps";
import { RolePlayExperience } from "@/components/embark/roleplay/RolePlayExperience";
import { scenarioForLearnerSessionId } from "@/components/embark/roleplay/scenarios";
import {
  isMcRoleplayKey,
  MC_JOURNEY_META,
  MC_POSITION_LABEL,
} from "@/components/embark/roleplay/mcJourneyChrome";
import { buildMod3Flow } from "@/pages/embark/learner/home/JourneyTabs";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";

export default function RolePlay() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { org } = useOrganisation();
  const { markRolePlayDone, progress } = useModule3Progress();
  const { state: adaptation, settleContent, settleOutcome } = useJourneyAdaptation();
  const scenario = scenarioForLearnerSessionId(sessionId, org);
  const isRathbonesMc = org === "rathbones" && isMcRoleplayKey(sessionId);
  const base = buildMod3Flow(progress, org);
  const step = (org === "rathbones" ? applyAdaptation(base, adaptation) : base).find((s) => s.id === sessionId);
  const locked = isRathbonesMc && step?.status === "locked";
  const journey = useLearnerJourneySteps(isRathbonesMc ? sessionId ?? null : null);

  useEffect(() => {
    if (locked) navigate("/learner/home", { replace: true });
  }, [locked, navigate]);

  if (locked) return null;

  const settleRolePlay = () => {
    if (!sessionId) return;
    const passed = scenario.feedback.score >= scenario.passThreshold;
    if (passed) {
      settleContent(sessionId);
      return;
    }
    const topics = scenario.feedback.skills
      .filter((skill) => skill.score < scenario.passThreshold)
      .map((skill) => ({ topic: skill.name, points: [skill.evidence] }));
    settleOutcome(sessionId, base, false, topics);
  };
  const steps =
    isRathbonesMc && journey
      ? journey.steps
      : buildMod3SessionSteps("s3", progress, navigate);

  const stepsMeta =
    isRathbonesMc && journey ? journey.stepsMeta : org === "rathbones" ? MC_JOURNEY_META : "Benefits Navigation · Module 3";
  const positionLabel = isRathbonesMc
    ? journey?.positionLabel ?? MC_POSITION_LABEL
    : org === "rathbones"
      ? scenario.scoringMode === "assessment"
        ? "Formative role-play"
        : "Practice role-play"
      : "Session 4 of 4";
  const journeySubtitle =
    isRathbonesMc && journey?.positionLabel
      ? `IM Intake Pathway · ${journey.positionLabel}`
      : org === "rathbones"
        ? MC_JOURNEY_META
        : "Session 4 of 4 · Role play";
  const subtitleBase = journeySubtitle;
  const framingSubtitle =
    org === "rathbones" && !(isRathbonesMc && journey?.positionLabel)
      ? `${journeySubtitle} · Role play`
      : journeySubtitle;

  return (
    <RolePlayExperience
      scenario={scenario}
      steps={steps}
      stepsMeta={stepsMeta}
      positionLabel={positionLabel}
      shellTitle={isRathbonesMc ? step?.name : undefined}
      subtitleBase={subtitleBase}
      framingSubtitle={framingSubtitle}
      onBack={() => navigate("/learner/home")}
      framingPrev={{
        label: "Previous",
        onClick: () => navigate(org === "rathbones" ? "/learner/home" : "/learner/assessment/mod3"),
      }}
      onExit={() => navigate("/learner/home")}
      onContinue={() => {
        if (!isRathbonesMc || !sessionId) {
          navigate("/learner/home");
          return;
        }
        settleRolePlay();
        navigate("/learner/personalizing", { state: { itemId: sessionId, source: "role-play" } });
      }}
      onComplete={isRathbonesMc ? settleRolePlay : markRolePlayDone}
    />
  );
}
