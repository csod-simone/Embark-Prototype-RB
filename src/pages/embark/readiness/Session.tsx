import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionShell } from "@/components/embark/SessionShell";
import { ModalitySwitcher } from "@/components/embark/ModalitySwitcher";
import { TextPane, VideoPane } from "@/components/embark/session/ModalityPanes";
import { ContentSections } from "@/components/embark/session/ContentSections";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { useLearnerPreferences } from "@/hooks/use-learner-preferences";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { requiresAssessment } from "@/data/readinessContent";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";
import { buildReadinessSteps } from "./readinessSteps";
import {
  getAvailableModalities,
  MODALITY_LABEL,
  readRememberedModality,
  rememberModality,
  resolveDefaultModality,
  type Modality,
} from "@/lib/modality";

export default function ReadinessSession() {
  const { activityId = "" } = useParams();
  // Remount per item so progress, video and modality state reset like a fresh open.
  return <ReadinessSessionView key={activityId} />;
}

function ReadinessSessionView() {
  const navigate = useNavigate();
  const { activityId = "" } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();
  const { org, content: contentMap } = useReadinessProfile();

  const content = contentMap[activityId] ?? contentMap.a8;
  const { markStarted, markCompleted } = useReadinessProgress();

  useEffect(() => {
    markStarted(content.id);
  }, [content.id, markStarted]);

  const available = useMemo(
    () => getAvailableModalities({ id: content.id, moduleId: content.id, modality: content.modality }),
    [content.id, content.modality],
  );
  const { prefs } = useLearnerPreferences();
  const [modality, setModality] = useState<Modality>(() =>
    resolveDefaultModality(
      available,
      prefs.preferredModality,
      readRememberedModality(content.id),
      content.modality === "video" ? "video" : "text",
    ),
  );

  const handleModalityChange = (m: Modality) => {
    if (m === modality) return;
    setModality(m);
    rememberModality(content.id, m);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const [videoDone, setVideoDone] = useState(false);
  const canContinue = modality === "video" ? videoDone : reached;

  const steps: SessionStep[] = useMemo(
    () => buildReadinessSteps(content.id, navigate, org),
    [content.id, navigate, org],
  );

  const hasAssessment = requiresAssessment(content.id);
  const progressPct = modality === "video" ? (videoDone ? 100 : 0) : scrollPct;

  return (
    <SessionShell
      topHeader={null}
      title={content.title}
      subtitle={`${content.moduleName} · ${MODALITY_LABEL[modality]} · ~${content.duration} min`}
      onBack={() => navigate("/readiness/dashboard")}
      steps={steps}
      stepsMeta={org === "rathbones" ? "Your role readiness journey" : "Your project readiness journey"}
      positionLabel={content.programName}
      prev={null}
      next={{
        label: hasAssessment ? "Continue to knowledge check" : "Mark as complete",
        disabled: !canContinue,
        disabledReason:
          modality === "video"
            ? "Watch the video to the end to continue."
            : "Read to the end of the article to continue.",
        onClick: () => {
          if (hasAssessment) {
            navigate(`/readiness/assessment/${content.id}`);
            return;
          }
          markCompleted(content.id);
          navigate(`/readiness/activity/${content.id}`);
        },
      }}
      topSlot={
        available.length > 1 ? (
          <ModalitySwitcher available={available} value={modality} onChange={handleModalityChange} />
        ) : undefined
      }
      sagePrompts={[
        { label: "Explain this" },
        { label: "Give me an example" },
        {
          label:
            org === "rathbones"
              ? "How does this apply to IM Intake?"
              : "How does this apply to Meridian?",
        },
        { label: "Raise a hand 🤚" },
      ]}
    >
      <div className="h-1 w-full bg-muted flex-shrink-0">
        <div className="h-1 bg-primary transition-all" style={{ width: `${progressPct}%` }} />
      </div>
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
        {modality === "video" ? (
          <VideoPane
            title={content.title}
            duration={`${content.duration}:00`}
            meta={content.moduleName}
            takeaways={content.takeaways}
            onComplete={() => setVideoDone(true)}
          />
        ) : (
          <TextPane>
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <ContentSections intro={content.intro} sections={content.sections} />
          </TextPane>
        )}
      </div>
    </SessionShell>
  );
}
