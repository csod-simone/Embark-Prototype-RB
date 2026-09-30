import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { TutorBottomDrawer } from "../home/TutorBottomDrawer";
import { useTutorConversation, type TutorMsg } from "../home/useTutorConversation";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { SessionShell } from "@/components/embark/SessionShell";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { TextPane } from "@/components/embark/session/ModalityPanes";
import { ContentSections } from "@/components/embark/session/ContentSections";
import { getReviewContent } from "@/data/reviewContent";


const seed: TutorMsg[] = [
  {
    id: "grad-a1",
    role: "tutor",
    timestamp: "Sage · just now",
    text:
      "This is the last article on your journey, Alex. Take your time — I'll be here if you want an example or a plain-English recap of anything on the page.",
    citation: "curriculum",
  },
];

export default function GraduatingArticle() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [searchParams] = useSearchParams();
  const isReview = searchParams.get("review") === "true";
  const conversation = useTutorConversation(seed);
  const [completed, setCompleted] = useState(false);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();

  const content = getReviewContent(articleId, "dispute-resolution");
  const sessionId = `grad-${content.id}`;

  const steps: SessionStep[] = [
    {
      id: sessionId,
      name: content.title,
      subtitle: `Article · ${content.duration} min`,
      modality: "article",
      status: isReview || completed ? "completed" : "current",
    },
  ];

  const handleComplete = () => {
    if (completed || !reached) return;
    setCompleted(true);
    setTimeout(() => navigate("/learner/graduating/graduation"), 800);
  };

  return (
    <>
      <SessionShell
        title={content.title}
        subtitle={`${content.programName} · ${content.moduleName} · Article`}
        onBack={() => navigate("/learner/graduating")}
        topHeader={null}
        steps={steps}
        stepsMeta={`${content.programName} · ${content.moduleName}`}
        positionLabel="Article"
        prev={null}
        next={
          isReview
            ? { label: "Completed", disabled: true }
            : completed
            ? { label: "Completed", disabled: true }
            : {
                label: "Mark as complete",
                disabled: !reached,
                disabledReason: "Read to the end of the article to continue.",
                onClick: handleComplete,
              }
        }
      >
        {!isReview && (
          <div className="h-1 w-full bg-muted flex-shrink-0">
            <div className="h-1 bg-primary transition-all" style={{ width: `${scrollPct}%` }} />
          </div>
        )}
        <div className="flex-1 overflow-y-auto" onScroll={onScroll}>
          <TextPane>
            {isReview && (
              <CompletionSummary
                label="You've already completed this — you're reviewing it now."
                completedDate={content.completedDate}
                score={content.score}
              />
            )}
            <h1 className="text-2xl font-bold">{content.title}</h1>

            <ContentSections intro={content.intro} sections={content.sections} />

            {completed && !isReview && (
              <div className="pt-4 border-t border-border">
                <LeftBorderCard borderVariant="success" padding="sm">
                  <p className="text-sm text-foreground inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-success-dark" />
                    <span className="font-semibold text-success-dark">Article complete</span> —{" "}
                    {content.title}
                  </p>
                </LeftBorderCard>
              </div>
            )}
          </TextPane>
        </div>
      </SessionShell>

      <TutorBottomDrawer conversation={conversation} />
    </>
  );
}
