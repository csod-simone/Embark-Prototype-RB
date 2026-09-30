import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { AiFlag } from "@/components/embark/AiFlag";
import { AskSageIcon, SageAvatar } from "@/components/embark/AskSageIcon";
import { PhaseProgressStepper } from "@/components/embark/PhaseProgressStepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EXPERIENCE_TYPES } from "./experienceTypes";

const STEP_LABELS = [
  "Practice goal",
  "Roles",
  "Starting context",
  "Evaluation",
  "Ending",
  "Feedback",
];

const ASSISTANT_FOLLOWUPS = [
  "Got it. Who should the AI play in this scenario, and what's their attitude towards the learner?",
  "Thanks. Where does the conversation start — what has just happened before the learner speaks?",
  "Understood. What behaviours should we evaluate the learner on?",
  "Good. How should the conversation end — what signals a successful close?",
  "Last one: what tone and focus should the feedback take?",
  "That's everything I need. You can create and validate the draft now.",
];

type Msg = { id: number; role: "assistant" | "user"; text: string };

export default function RolePlayDesignWithAI() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi! Tell me about the role-play you want to create. What situation should the learner practise, and what skill are you trying to build? A rough description is totally fine — I'll help refine it.",
    },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const next = Math.min(stepIndex + 1, STEP_LABELS.length);
    setMessages((prev) => [
      ...prev,
      { id: prev.length, role: "user", text },
      {
        id: prev.length + 1,
        role: "assistant",
        text: ASSISTANT_FOLLOWUPS[Math.min(stepIndex, ASSISTANT_FOLLOWUPS.length - 1)],
      },
    ]);
    setStepIndex(next);
    setInput("");
  };

  const phases = STEP_LABELS.map((label, i) => ({
    label,
    status: (i < stepIndex ? "complete" : i === stepIndex ? "active" : "upcoming") as
      | "complete"
      | "active"
      | "upcoming",
  }));

  const canCreate = stepIndex >= STEP_LABELS.length;

  return (
    <PageContainer as="div" className="py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => navigate("/admin/content/roleplay/new")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div>
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          NEW ROLE-PLAY
        </div>
        <div className="mt-1 flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Design with AI</h2>
          <AiFlag />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Start with a rough description. The assistant will identify gaps and ask one question at a
          time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <SageAvatar size="sm" />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Roleplay Design Assistant
                </h3>
                <p className="mt-0.5 text-sm text-primary">
                  Describe it naturally; I'll complete the design with you.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <PhaseProgressStepper phases={phases} />
          </Card>

          <button
            type="button"
            onClick={() => toast("File upload coming soon")}
            className="w-full rounded-md border border-dashed border-border bg-background p-6 text-center transition-colors hover:bg-muted/40"
          >
            <Upload className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div className="mt-2 text-sm font-medium text-foreground">Start from a file</div>
            <div className="text-sm text-muted-foreground">Drag and drop or browse</div>
            <div className="mt-1 text-xs text-muted-foreground">PDF, DOCX, TXT up to 10MB</div>
          </button>

          <Card className="p-4 max-h-[420px] overflow-y-auto space-y-4">
            {messages.map((m) =>
              m.role === "assistant" ? (
                <div key={m.id} className="flex items-start gap-3">
                  <SageAvatar size="sm" />
                  <p className="text-sm text-foreground">{m.text}</p>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                    {m.text}
                  </p>
                </div>
              ),
            )}
          </Card>

          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your role-play idea…"
              rows={2}
              className="flex-1"
            />
            <Button size="icon" disabled={!input.trim()} onClick={send} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {canCreate && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  toast.success("Role-play draft created successfully.");
                  navigate("/admin/content");
                }}
              >
                <AskSageIcon size={16} className="mr-1" />
                Create and validate draft
              </Button>
            </div>
          )}
        </div>

        {/* Right column */}
        <Card className="p-4 h-fit">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Experience Type</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="About experience types">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The experience type determines the structure and evaluation method of the role-play.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the type of interaction your learner will practise.
          </p>
          <ul className="mt-3 space-y-3">
            {EXPERIENCE_TYPES.map((t) => (
              <li key={t.value} className="rounded-md border border-border p-3">
                <div className="text-sm font-medium text-foreground">{t.label}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
