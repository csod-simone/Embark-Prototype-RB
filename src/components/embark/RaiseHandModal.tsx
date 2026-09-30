import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, CheckCircle2, Clock, MapPin, MessageSquare, Play } from "lucide-react";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type Recipient = "manager";

type RecipientCopy = {
  buttonLabel: string;
  slaNote: string;
  confirmHeading: string;
  confirmExpected: string;
};

const recipientCopy: Record<Recipient, RecipientCopy> = {
  manager: {
    buttonLabel: "Send to my line manager",
    slaNote: "Your line manager typically responds within 24 hours.",
    confirmHeading: "Your hand raised has been sent to your line manager",
    confirmExpected: "Expected response: within 24 hours",
  },
};

const recipientOptionLabel = "My line manager";

const contextRows = [
  {
    id: "module",
    icon: MapPin,
    label: "Module & Session",
    value: "Benefits Navigation — Session 3: Benefits Lookup Practice",
  },
  {
    id: "activity",
    icon: Play,
    label: "What I was doing",
    value: "About to start a role play session",
  },
  {
    id: "tutor",
    icon: MessageSquare,
    label: "Sage conversation",
    value: "Last 5 exchanges attached",
  },
  { id: "readiness", icon: Activity, label: "My readiness", value: "" },
] as const;

function RaiseHandForm({
  onSent,
  onCancel,
}: {
  onSent: (recipient: Recipient) => void;
  onCancel: () => void;
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
    onSent(recipient);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-muted/40 p-4 space-y-2">
        <div className="text-sm font-semibold uppercase text-foreground">
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
                  <div className="text-sm font-semibold text-foreground">{row.label}</div>
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
                  aria-label={`Remove ${row.label} from context`}
                  className="text-sm text-foreground hover:underline underline-offset-2 flex-shrink-0"
                >
                  {row.id === "tutor" ? "View / remove ↗" : "Remove ×"}
                </button>
              </div>
            );
          })}
          {removed.size > 0 && (
            <div className="text-sm text-muted-foreground pt-2" role="status">Context removed</div>
          )}
        </div>
        <p className="text-sm italic text-muted-foreground">
          You can remove any context before sending. Removal is logged.
        </p>
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">Send to</div>
        <p className="text-sm text-foreground">{recipientOptionLabel}</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="raise-hand-problem" className="text-sm font-medium text-foreground">
          What do you need help with? <span className="text-sm text-muted-foreground">(required)</span>
        </label>
        <Textarea
          id="raise-hand-problem"
          rows={4}
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            if (error) setError(null);
          }}
          maxLength={500}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "raise-hand-problem-error raise-hand-problem-count" : "raise-hand-problem-count"}
          placeholder="Describe what you're finding difficult..."
        />
        <div className="flex items-center justify-between">
          {error ? <span id="raise-hand-problem-error" role="alert" className="text-sm text-destructive">{error}</span> : <span />}
          <span id="raise-hand-problem-count" className="text-sm text-muted-foreground">{problem.length} / 500</span>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="raise-hand-tried" className="text-sm font-medium text-foreground">
          What have you already tried? <span className="text-sm text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="raise-hand-tried"
          rows={2}
          value={tried}
          onChange={(e) => setTried(e.target.value)}
          placeholder="Optional..."
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            className="text-sm text-foreground/80 hover:text-foreground underline-offset-2 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function RaiseHandConfirmation({
  recipient,
  onClose,
}: {
  recipient: Recipient;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const copy = recipientCopy[recipient];

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-8 text-center space-y-4">
      <CheckCircle2 className="h-14 w-14 text-success-dark mx-auto" />
      <h2 className="text-xl font-bold text-foreground">{copy.confirmHeading}</h2>
      <p className="text-sm text-muted-foreground">{copy.confirmExpected}</p>
      <div className="space-y-2 pt-2">
        <Button className="w-full" onClick={() => navigate("/learner/home")}>
          Return to dashboard
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/learner/session/s3")}
        >
          Continue learning
        </Button>
      </div>
    </div>
  );
}

export function RaiseHandModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<"form" | "confirmation">("form");
  const [recipient, setRecipient] = useState<Recipient>("manager");

  const handleSent = (r: Recipient) => {
    setRecipient(r);
    setView("confirmation");
  };

  const handleClose = () => {
    setView("form");
    setRecipient("manager");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2 text-left space-y-1">
          <DialogTitle className="text-lg font-semibold">Raise a hand</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Your manager will receive this with full context attached.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {view === "form" ? (
            <RaiseHandForm onSent={handleSent} onCancel={handleClose} />
          ) : (
            <RaiseHandConfirmation recipient={recipient} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
