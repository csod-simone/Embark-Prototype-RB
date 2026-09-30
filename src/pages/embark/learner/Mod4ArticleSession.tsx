import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { CompletionSummary } from "@/components/embark/CompletionSummary";

import { SessionShell } from "@/components/embark/SessionShell";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { buildMod4SessionSteps } from "@/components/embark/session/sessionSteps";
import { TextPane } from "@/components/embark/session/ModalityPanes";

export default function Mod4ArticleSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isReview = searchParams.get("review") === "true";
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached: bottomReached, onScroll } = useScrollComplete();
  const [doneOpen, setDoneOpen] = useState(false);

  const steps = buildMod4SessionSteps("mod4-s1", navigate);

  return (
    <>
      <SessionShell
        title="Introduction to Claims Processing"
        subtitle="Claims and Billing · Session 1 of 4 · Article · ~7 min"
        onBack={() => navigate("/learner/home")}
        steps={steps}
        stepsMeta="Claims and Billing · Module 4"
        positionLabel="Session 1 of 4"
        prev={null}
        next={
          isReview
            ? { label: "Completed", disabled: true }
            : {
                label: "Mark as complete",
                disabled: !bottomReached,
                disabledReason: "Read to the end of the article to continue.",
                onClick: () => setDoneOpen(true),
              }
        }
        sagePrompts={[
          { label: "Summarise this article" },
          { label: "What's an EOB?" },
          { label: "Give me an example of a denied claim" },
          { label: "Raise a hand 🤚" },
        ]}
      >
        {isReview && (
          <div className="px-4 sm:px-6 pt-4 flex-shrink-0">
            <CompletionSummary />
          </div>
        )}
        <div className="h-1 w-full bg-muted flex-shrink-0">
          <div className="h-1 bg-primary transition-all" style={{ width: `${scrollPct}%` }} />
        </div>
        <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
        <TextPane>
          <h1 className="text-2xl font-bold">Introduction to Claims Processing</h1>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">What is a claim?</h2>
            <p>
              A claim is a formal request submitted to Medicare or an insurance plan asking for
              payment for a healthcare service that has been provided to a member. Every time a
              Medicare member receives a covered service, the provider submits a claim on their
              behalf.
            </p>
            <p>
              As a CSR, you will frequently handle calls about claim status, claim denials, and
              Explanation of Benefits (EOB) documents. Understanding the claims lifecycle helps you
              answer member questions accurately and manage expectations on call.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">The claims lifecycle</h2>
            <p>A typical Medicare claim follows this path:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Member receives a service from a provider</li>
              <li>Provider submits the claim to Medicare or the plan</li>
              <li>The plan adjudicates the claim (processes it against the member's benefits)</li>
              <li>
                Payment is issued to the provider (for assigned claims) or to the member (for
                unassigned claims)
              </li>
              <li>An EOB is generated and sent to the member</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">Common CSR scenarios</h2>
            <p>The most frequent claims-related calls you will handle:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">"I received a bill but I thought Medicare covered this"</span>{" "}
                — verify whether the service was covered, whether the deductible had been met, and
                whether COB was applied correctly.
              </li>
              <li>
                <span className="font-medium">"My EOB shows I owe more than I expected"</span> —
                verify cost-sharing, deductible status, and whether the provider was in-network.
              </li>
              <li>
                <span className="font-medium">"My claim was denied"</span> — identify the denial
                reason code and explain next steps (appeal rights, timeframes).
              </li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground italic">
            More coming soon — additional sections will be added as content is developed.
          </p>
        </TextPane>
      </div>
      </SessionShell>

      <Dialog open={doneOpen} onOpenChange={setDoneOpen}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Article complete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <LeftBorderCard borderVariant="success" padding="sm">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-success-dark">✓ Article complete</span> —
                Introduction to Claims Processing
              </p>
            </LeftBorderCard>
            <Button
              className="w-full"
              onClick={() => {
                setDoneOpen(false);
                navigate("/learner/home");
              }}
            >
              Continue →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
