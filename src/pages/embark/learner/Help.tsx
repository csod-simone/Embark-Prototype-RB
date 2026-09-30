import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Play,
  X,
} from "lucide-react";
import { GlobalHeader } from "@/components/embark/GlobalHeader";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { helpRequests, coverageDeterminationTutorContext } from "@/data/mockData";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type ViewState = "history" | "new_step1" | "confirmation";
type Recipient = "manager";

const recipientCopy: Record<Recipient, {
  buttonLabel: string;
  slaNote: string;
  confirmHeading: string;
  confirmExpected: string;
}> = {
  manager: {
    buttonLabel: "Send to my line manager",
    slaNote: "Your line manager typically responds within 24 hours.",
    confirmHeading: "Your hand raised has been sent to your line manager",
    confirmExpected: "Expected response: within 24 hours",
  },
};

const recipientOptionLabel = "My line manager";

const contextRows = [
  { id: "module", icon: MapPin, label: "Module & Session", value: "IM Intake Pathway — Knowledge check 1" },
  { id: "activity", icon: Play, label: "What I was doing", value: "About to start a role play session" },
  { id: "tutor", icon: MessageSquare, label: "Sage conversation", value: "Last 5 exchanges attached" },
  { id: "readiness", icon: Activity, label: "My readiness", value: "" },
] as const;

function DetailPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [responded, setResponded] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const hr = helpRequests[0];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col">
        <VisuallyHidden>
          <SheetTitle>Hand Raised Detail</SheetTitle>
          <SheetDescription>View and respond to your open hand raised.</SheetDescription>
        </VisuallyHidden>
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Hand Raised — Jul 19, 2026</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning px-2 py-0.5 text-[10px] font-semibold">
                OPEN
              </span>
              <span className="text-xs text-muted-foreground">
                {hr.moduleName} — {hr.sessionName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-md bg-muted/40 p-3">
            <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
              What was I working on
            </div>
            <div className="text-sm text-foreground mt-1">
              IM Intake Pathway — Client relationships foundations
            </div>
          </div>

          <div className="rounded-md border border-border">
            <InlineExpandRow
              trigger={
                <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
                  Sage conversation
                </div>
              }
              content={
                <div className="space-y-2">
                  {coverageDeterminationTutorContext.map((m, i) =>
                    m.role === "tutor" ? (
                      <div key={i} className="text-xs bg-muted rounded-md px-2 py-1 line-clamp-1 max-w-[85%]">
                        Tutor: {m.text}
                      </div>
                    ) : (
                      <div key={i} className="text-xs bg-primary text-primary-foreground rounded-md px-2 py-1 line-clamp-1 max-w-[85%] ml-auto">
                        You: {m.text}
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    View full transcript ↗
                  </button>
                </div>
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
              My readiness
            </div>
            <ReadinessRing size="sm" score={62} />
            <BandPill band="Needs Attention" />
          </div>

          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-sm text-foreground whitespace-pre-wrap">{hr.message}</p>
          </div>

          {!responded ? (
            <div className="rounded-md border border-dashed border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Waiting for your manager's response. Taylor Reyes typically responds within 24 hours.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Raised 2 hours ago</p>
            </div>
          ) : (
            <LeftBorderCard borderVariant="brand">
              <div className="text-xs text-muted-foreground">Taylor Reyes · Manager</div>
              <p className="text-sm text-foreground mt-1">
                Hi Jordan, great question. The Part B deductible applies once per benefit period.
                When secondary insurance is involved, you should always check the Coordination of
                Benefits (COB) record first. I'll send you a link to our COB quick reference guide.
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Responded Jul 19, 2026 · 4:32 PM</span>
                <button className="text-xs text-muted-foreground hover:text-foreground underline">
                  Mark as resolved
                </button>
              </div>
            </LeftBorderCard>
          )}

          <div className="space-y-2">
            <Textarea
              rows={2}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Add a follow-up..."
            />
            <Button variant="secondary" size="sm" disabled={!followUp.trim()}>
              Send follow-up
            </Button>
          </div>

          <div className="pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResponded((v) => !v)}
            >
              {responded ? "Reset (dev)" : "Simulate response (dev)"}
            </Button>
          </div>
        </div>
      </SheetContent>

      <Dialog open={transcriptOpen} onOpenChange={setTranscriptOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Sage Transcript</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {coverageDeterminationTutorContext.map((m, i) =>
              m.role === "tutor" ? (
                <TutorBubble key={i} message={m.text} citation={m.citation} />
              ) : (
                <LearnerBubble key={i} message={m.text} />
              ),
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

function NewRequestStep1({
  onCancel,
  onSent,
}: {
  onCancel: () => void;
  onSent: () => void;
}) {
  const recipient: Recipient = "manager";
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [problem, setProblem] = useState("");
  const [tried, setTried] = useState("");
  const [error, setError] = useState<string | null>(null);
  const copy = recipientCopy[recipient];

  const remove = (id: string) => setRemoved((prev) => new Set(prev).add(id));
  const submit = () => {
    if (problem.trim().length < 20) {
      setError("Please describe what you need help with (minimum 20 characters)");
      return;
    }
    onSent();
  };


  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-background">
      <PageContainer as="div" className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Raise a hand</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Your manager will receive this with full context attached.
          </p>
        </div>

        <div className="rounded-md bg-muted/40 p-4 space-y-2">
          <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
            Pre-populated context
          </div>
          <div>
            {contextRows.map((row) => {
              if (removed.has(row.id)) return null;
              const Icon = row.icon;
              return (
                <div
                  key={row.id}
                  className="flex items-start gap-3 py-2 border-b border-border last:border-0 transition-opacity"
                >
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground">{row.label}</div>
                    {row.id === "readiness" ? (
                      <div className="flex items-center gap-2 mt-1">
                        <ReadinessRing size="sm" score={62} />
                        <BandPill band="Needs Attention" />
                      </div>
                    ) : (
                      <div className="text-sm text-foreground">{row.value}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    {row.id === "tutor" ? "View / remove ↗" : "Remove ×"}
                  </button>
                </div>
              );
            })}
            {removed.size > 0 && (
              <div className="text-xs text-muted-foreground pt-2">Context removed</div>
            )}
          </div>
          <p className="text-[11px] italic text-muted-foreground">
            You can remove any context before sending. Removal is logged.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-foreground">Send to</div>
          <p className="text-sm text-foreground">{recipientOptionLabel}</p>
        </div>



        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            What do you need help with? <span className="text-xs text-muted-foreground">(required)</span>
          </label>
          <Textarea
            rows={4}
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              if (error) setError(null);
            }}
            maxLength={500}
            placeholder="Describe what you're finding difficult..."
          />
          <div className="flex items-center justify-between">
            {error ? (
              <span className="text-xs text-destructive">{error}</span>
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground">{problem.length} / 500</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            What have you already tried? <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            rows={2}
            value={tried}
            onChange={(e) => setTried(e.target.value)}
            placeholder="Optional..."
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {copy.slaNote}
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={submit}>
            {copy.buttonLabel}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

function Confirmation({ recipient }: { recipient: Recipient }) {
  const navigate = useNavigate();
  const copy = recipientCopy[recipient];
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-10 bg-background">
      <PageContainer as="div" className="rounded-lg border border-border bg-card shadow-sm py-8 text-center space-y-4">
        <CheckCircle2 className="h-14 w-14 text-success-dark mx-auto" />
        <h2 className="text-xl font-bold text-foreground">{copy.confirmHeading}</h2>
        <p className="text-sm text-muted-foreground">{copy.confirmExpected}</p>
        <div className="space-y-2 pt-2">
          <Button className="w-full" onClick={() => navigate("/learner/home")}>
            Return to dashboard
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate("/learner/session/s3")}>
            Continue learning
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}


export default function Help() {
  const navigate = useNavigate();
  const [view, setView] = useState<Exclude<ViewState, "history">>("new_step1");
  const recipient: Recipient = "manager";

  return (
    <>
      <GlobalHeader
        title="Raise Hand"
        breadcrumb={[{ label: "Home", href: "/learner/home" }, { label: "Raise Hand" }]}
      />
      {view === "new_step1" && (
        <NewRequestStep1
          onCancel={() => navigate("/learner/home")}
          onSent={() => setView("confirmation")}
        />
      )}
      {view === "confirmation" && <Confirmation recipient={recipient} />}
    </>
  );
}

