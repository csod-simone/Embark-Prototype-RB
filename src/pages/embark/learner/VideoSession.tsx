import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { sessions } from "@/data/mockData";

import { useModule3Progress } from "@/hooks/use-module3-progress";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SessionShell } from "@/components/embark/SessionShell";
import { buildMod3SessionSteps } from "@/components/embark/session/sessionSteps";
import { VideoPane } from "@/components/embark/session/ModalityPanes";


const TAKEAWAYS = [
  "Medicare Advantage (Part C) plans are offered by private insurers approved by Medicare and include all Part A and Part B benefits.",
  "Part D covers prescription drugs. Standalone PDPs attach to Original Medicare; MA-PD plans bundle drug coverage with Medicare Advantage.",
  "Original Medicare (Parts A and B) does not cap out-of-pocket costs. Medicare Advantage plans have an annual OOP maximum.",
];

export default function VideoSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isReview = searchParams.get("review") === "true";
  const completed = sessions.find((s) => s.id === "s1");
  const { progress: mod3, markVideoDone } = useModule3Progress();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) markVideoDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const canContinue = unlocked;

  const steps = buildMod3SessionSteps("s-video", mod3, navigate);

  return (
    <SessionShell
      title="Medicare Plan Types"
      subtitle="Benefits Navigation · Session 2 of 4 · Video · ~6 min"
      onBack={() => navigate("/learner/home")}
      steps={steps}
      stepsMeta="Benefits Navigation · Module 3"
      positionLabel="Session 2 of 4"
      prev={{ label: "Previous", onClick: () => navigate("/learner/session/s-article") }}
      headerNavTabs={isReview}
      next={
        isReview
          ? { label: "Completed", disabled: true }
          : {
              label: "Next",
              disabled: !canContinue,
              disabledReason: "Watch the video to continue.",
              onClick: () => navigate("/learner/assessment/mod3"),
            }
      }
      sagePrompts={[
        { label: "Difference between Part C and Part D?" },
        { label: "When would a member have both Part B and Part D?" },
        { label: "What's tested?" },
        { label: "Raise a hand 🤚" },
      ]}
    >
      <div className="flex-1 overflow-y-auto">
        <PageContainer as="div" className="pt-6 pb-0">
          {isReview && <CompletionSummary completedDate={completed?.completedDate} />}
        </PageContainer>
        <VideoPane
          title="Medicare Plan Types"
          duration="6:04"
          meta="Benefits Navigation · Session 2 of 4"
          takeaways={TAKEAWAYS}
          onComplete={() => setUnlocked(true)}
        />
      </div>
    </SessionShell>
  );
}
