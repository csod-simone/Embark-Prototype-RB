import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EXPERIENCE_TYPES } from "./experienceTypes";

function Field({
  label,
  placeholder,
  helper,
  value,
  onChange,
  single,
}: {
  label: string;
  placeholder: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  single?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {single ? (
        <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Textarea id={id} value={value} placeholder={placeholder} rows={3} onChange={(e) => onChange(e.target.value)} />
      )}
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

export default function RolePlayStructuredForm() {
  const navigate = useNavigate();
  const [experienceType, setExperienceType] = useState<string>("conversation");
  const [learnerObjective, setLearnerObjective] = useState("");
  const [authorObjective, setAuthorObjective] = useState("");
  const [aiRole, setAiRole] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [apiId, setApiId] = useState("");

  const dirty = [learnerObjective, authorObjective, aiRole, evaluation, feedback, apiId].some(
    (v) => v.trim().length > 0,
  );

  const cancel = () => {
    if (dirty && !window.confirm("Discard this role-play draft?")) return;
    navigate("/admin/content/roleplay/new");
  };

  return (
    <PageContainer as="div" className="py-6 space-y-6 max-w-[760px]">
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
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Structured Form</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide your authoring intent across structured fields and review the generated blueprint.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">Experience Type</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label="About experience types">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              The experience type determines the structure and evaluation approach of the role-play.
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup value={experienceType} onValueChange={setExperienceType} className="space-y-2">
          {EXPERIENCE_TYPES.map((t) => (
            <label
              key={t.value}
              htmlFor={`exp-${t.value}`}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/40"
            >
              <RadioGroupItem id={`exp-${t.value}`} value={t.value} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-foreground">{t.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t.description}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Objective</h3>
        <Field
          label="Learner Objective"
          placeholder="What should the learner be able to do or demonstrate after completing this role-play?"
          helper="Describe the skill or behaviour the learner is practising."
          value={learnerObjective}
          onChange={setLearnerObjective}
        />
        <Field
          label="Author Objective"
          placeholder="What is the purpose of this role-play from a training design perspective?"
          helper="Describe the instructional intent — what gap this role-play is designed to address."
          value={authorObjective}
          onChange={setAuthorObjective}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">AI Role</h3>
        <Field
          label="AI Role"
          placeholder="Describe the character the AI will play — their role, personality, and how they should behave in this scenario."
          helper="Be specific about the AI character's attitude, knowledge level, and how they should respond to the learner."
          value={aiRole}
          onChange={setAiRole}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Evaluation</h3>
        <Field
          label="Evaluation Expectations"
          placeholder="What criteria should be used to evaluate the learner's performance in this role-play?"
          helper="Describe the behaviours, responses, or outcomes that indicate successful performance."
          value={evaluation}
          onChange={setEvaluation}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Feedback</h3>
        <Field
          label="Feedback Expectations"
          placeholder="What kind of feedback should be provided to the learner after completing the role-play?"
          helper="Describe the tone, focus, and format of feedback — e.g. strengths first, then areas for improvement."
          value={feedback}
          onChange={setFeedback}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">API IDs</h3>
          <Badge variant="secondary">Advanced</Badge>
        </div>
        <Field
          single
          label="API ID"
          placeholder="e.g. sales-discovery-call-practice"
          helper="Used to reference this role-play via the API. Leave blank to auto-generate."
          value={apiId}
          onChange={setApiId}
        />
      </section>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={cancel}>
          Cancel
        </Button>
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
    </PageContainer>
  );
}
