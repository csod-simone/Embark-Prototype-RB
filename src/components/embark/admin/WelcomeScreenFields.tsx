import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PROGRAMME_LINE_TAGS,
  formatCohortDate,
  resolveProgrammeLine,
  type WelcomeContent,
} from "@/hooks/use-experience-content";

export function Counter({ value, max }: { value: string; max: number }) {
  return (
    <div className="mt-1 text-right text-xs text-muted-foreground">
      {value.length} / {max}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function TextField({
  label,
  helper,
  value,
  onChange,
  max,
  error,
  footer,
  placeholder,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  error?: string;
  footer?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{helper}</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={max}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {footer}
      <Counter value={value} max={max} />
      <FieldError message={error} />
    </div>
  );
}

export function AreaField({
  label,
  helper,
  value,
  onChange,
  max,
  rows,
  error,
  placeholder,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  rows: number;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{helper}</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={max}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      <Counter value={value} max={max} />
      <FieldError message={error} />
    </div>
  );
}

export function PreviewLabel() {
  return (
    <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
      Preview
    </div>
  );
}

const STEP_MAX = 80;

/**
 * The Welcome Screen configuration fields and live preview, controlled by the caller.
 * Used by the cohort create/edit workflow so each cohort keeps its own welcome content.
 */
export function WelcomeScreenFields({
  value,
  onChange,
  cohortName,
  startDate,
  endDate,
}: {
  value: WelcomeContent;
  onChange: (next: WelcomeContent) => void;
  /** Cohort context used to resolve the date/name tags in the Program Line. */
  cohortName?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const draft = value;
  const setDraft = (updater: (prev: WelcomeContent) => WelcomeContent) =>
    onChange(updater(draft));
  const set = (key: keyof WelcomeContent) => (v: string) =>
    setDraft((prev) => ({ ...prev, [key]: v }));

  const tagValues = {
    cohort_name: cohortName?.trim() ?? "",
    start_date: formatCohortDate(startDate),
    target_completion_date: formatCohortDate(endDate),
  };
  const resolvedLine = resolveProgrammeLine(draft.programmeLine, tagValues);

  const steps = draft.steps;
  const setSteps = (next: string[]) => setDraft((prev) => ({ ...prev, steps: next }));
  const moveStep = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Welcome Headline"
        helper="The main heading shown at the top of the welcome screen."
        value={draft.headline}
        onChange={set("headline")}
        max={80}
        placeholder="e.g. Welcome to your onboarding program"
      />
      <TextField
        label="Program Line"
        helper="The cohort and date line shown directly under the headline. Use tags to auto-populate from this cohort."
        value={draft.programmeLine}
        onChange={set("programmeLine")}
        max={120}
        placeholder="e.g. {{cohort_name}} · {{start_date}}"
        footer={
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Insert tag:</span>
            {PROGRAMME_LINE_TAGS.map((t) => (
              <Button
                key={t.tag}
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 px-2 text-xs font-normal"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    programmeLine: `${prev.programmeLine}${t.tag}`.slice(0, 120),
                  }))
                }
              >
                {t.tag}
              </Button>
            ))}
            {resolvedLine && (
              <span className="text-xs text-muted-foreground">Preview: {resolvedLine}</span>
            )}
          </div>
        }
      />
      <AreaField
        label="Program Description"
        helper="A short paragraph describing what this program prepares the learner for."
        value={draft.description}
        onChange={set("description")}
        max={400}
        rows={3}
        placeholder="e.g. This program prepares you to support members with confidence."
      />
      <TextField
        label="Personalisation Section Heading"
        helper="The heading of the AI personalisation section."
        value={draft.personalisedHeading}
        onChange={set("personalisedHeading")}
        max={60}
        placeholder="e.g. Personalized for you"
      />
      <AreaField
        label="Personalisation Paragraph 1"
        helper="The first paragraph in the personalisation section."
        value={draft.personalisedParagraph1}
        onChange={set("personalisedParagraph1")}
        max={400}
        rows={3}
        placeholder="Explain how the journey is tailored to the learner."
      />
      <AreaField
        label="Personalisation Paragraph 2"
        helper="The second paragraph in the personalisation section."
        value={draft.personalisedParagraph2}
        onChange={set("personalisedParagraph2")}
        max={400}
        rows={3}
        placeholder="Add any follow-up detail about the personalisation."
      />
      <TextField
        label="What Happens Next — Section Heading"
        helper="The heading above the next-step cards."
        value={draft.nextHeading}
        onChange={set("nextHeading")}
        max={60}
        placeholder="e.g. What happens next"
      />

      <div>
        <Label className="text-sm font-medium text-foreground">
          What Happens Next — Steps
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Add as many steps as this cohort needs. Steps appear in the order listed below.
        </p>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2.5 w-5 shrink-0 text-xs text-muted-foreground">
                {i + 1}.
              </span>
              <div className="flex-1">
                <Input
                  value={s}
                  maxLength={STEP_MAX}
                  placeholder="e.g. Complete your baseline assessment"
                  onChange={(e) =>
                    setSteps(steps.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                />
                <Counter value={s} max={STEP_MAX} />
              </div>
              <div className="flex items-center gap-1 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Move step ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() => moveStep(i, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Move step ${i + 1} down`}
                  disabled={i === steps.length - 1}
                  onClick={() => moveStep(i, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove step ${i + 1}`}
                  onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {steps.length === 0 && (
            <p className="text-xs text-muted-foreground">No steps added yet.</p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSteps([...steps, ""])}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add step
          </Button>
        </div>
      </div>

      <TextField
        label="AI Tutor Section Heading"
        helper="The heading of the section introducing the AI tutor."
        value={draft.sageHeading}
        onChange={set("sageHeading")}
        max={60}
        placeholder="e.g. Meet Sage our AI Assistant"
      />
      <AreaField
        label="AI Tutor Introduction"
        helper="The quoted introduction from the AI tutor shown at the bottom of the welcome screen."
        value={draft.sageQuote}
        onChange={set("sageQuote")}
        max={500}
        rows={4}
        placeholder="Write the short introduction the AI tutor gives the learner."
      />
      <TextField
        label="CTA Button Label"
        helper="The label on the button that takes the learner into their journey from the welcome screen."
        value={draft.cta}
        onChange={set("cta")}
        max={40}
        placeholder="e.g. Start my journey"
      />

      <div className="mt-2">
        <PreviewLabel />
        <div className="rounded-lg border border-border bg-muted/40 p-6">
          <div className="text-2xl font-medium text-foreground">
            {draft.headline || "\u00a0"}
          </div>
          {resolvedLine && (
            <p className="mt-1 text-sm text-muted-foreground">{resolvedLine}</p>
          )}
          <p className="mt-3 text-sm text-foreground">{draft.description}</p>

          <div className="mt-5">
            <div className="text-sm font-medium text-foreground">
              {draft.personalisedHeading}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{draft.personalisedParagraph1}</p>
            <p className="mt-1 text-sm text-muted-foreground">{draft.personalisedParagraph2}</p>
          </div>

          <div className="mt-5">
            <div className="text-sm font-medium text-foreground">{draft.nextHeading}</div>
            {steps.length > 0 && (
              <ol className="mt-1 list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="mt-5">
            <div className="text-sm font-medium text-foreground">{draft.sageHeading}</div>
            <p className="mt-1 text-sm italic text-muted-foreground">{draft.sageQuote}</p>
          </div>

          <div className="mt-5">
            <Button disabled>{draft.cta || "\u00a0"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
