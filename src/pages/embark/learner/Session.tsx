import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { SessionShell } from "@/components/embark/SessionShell";
import { TextPane, VideoPane } from "@/components/embark/session/ModalityPanes";
import { ContentSections } from "@/components/embark/session/ContentSections";
import { buildMod3SessionSteps } from "@/components/embark/session/sessionSteps";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { sessions } from "@/data/mockData";
import { getReviewContent } from "@/data/reviewContent";
import { MODALITY_LABEL, type Modality } from "@/lib/modality";

/** Maps the generic mock session ids onto the Module 3 journey steps. */
const MOD3_STEP_ID: Record<string, string> = {
  s1: "s-video",
  s2: "s-article",
  s3: "s3",
  s4: "s-assessment",
};

export default function Session() {
  const navigate = useNavigate();
  const { sessionId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const isReview = searchParams.get("review") === "true";
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();
  const { progress } = useModule3Progress();

  const session = sessions.find((s) => s.id === sessionId);
  const content = getReviewContent(sessionId, "coverage-determination");
  const modality: Modality = content.modality === "video" ? "video" : "text";

  const [videoDone, setVideoDone] = useState(false);
  const canContinue = modality === "video" ? videoDone : reached;

  const isMod3Session = sessionId in MOD3_STEP_ID || sessionId.startsWith("s-");
  const steps: SessionStep[] = useMemo(
    () =>
      isMod3Session
        ? buildMod3SessionSteps(MOD3_STEP_ID[sessionId] ?? sessionId, progress, navigate)
        : [
            {
              id: content.id,
              name: content.title,
              subtitle: `${content.modality === "video" ? "Video" : "Article"} · ${content.duration} min`,
              modality: content.modality,
              status: "current",
            },
          ],
    [isMod3Session, sessionId, progress, navigate, content],
  );

  const progressPct = isReview ? 100 : modality === "video" ? (videoDone ? 100 : 0) : scrollPct;

  return (
    <SessionShell
      title={content.title}
      subtitle={`${content.moduleName} · ${MODALITY_LABEL[modality]} · ~${content.duration} min`}
      onBack={() => navigate("/learner/home")}
      steps={steps}
      stepsMeta={content.moduleName}
      positionLabel={session ? `Session ${session.number} of 4` : content.moduleName}
      prev={null}
      headerNavTabs={isReview}
      next={
        isReview
          ? { label: "Completed", disabled: true }
          : {
              label: "Mark as complete",
              disabled: !canContinue,
              disabledReason:
                modality === "video"
                  ? "Watch the video to the end to continue."
                  : "Read to the end of the article to continue.",
              onClick: () => navigate("/learner/home"),
            }
      }
      sagePrompts={[
        { label: "Explain this" },
        { label: "Give me an example" },
        { label: "Summarise this article" },
        { label: "Raise a hand 🤚" },
      ]}
    >
      {isReview && (
        <div className="px-4 sm:px-6 pt-3 flex-shrink-0">
          <CompletionSummary
            label="You've already completed this session — you're reviewing it now."
            completedDate={content.completedDate ?? session?.completedDate}
            score={content.score}
          />
        </div>
      )}
      {!isReview && (
        <div className="h-1 w-full bg-muted flex-shrink-0">
          <div className="h-1 bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      )}
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
