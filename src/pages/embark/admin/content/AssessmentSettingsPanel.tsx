import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  AttemptsAllowedField,
  DEFAULT_ATTEMPTS,
} from "@/components/embark/AttemptsAllowed";
import { ASSESSMENT_DEFAULTS, type AssessmentType } from "@/data/assessmentTypes";
import { useAssessmentTypeDefaults } from "@/hooks/use-assessment-type-defaults";
import {
  CONTENT_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  type AssessmentComponents,
} from "@/hooks/use-assessment-type-defaults";

export type AssessmentSettings = {
  passThreshold: number;
  questionsShown: "all" | "specific";
  specificCount: number;
  questionOrder: "fixed" | "random";
  attemptsAllowed: string;
  unlimitedAttempts: boolean;
};

export const defaultAssessmentSettings: AssessmentSettings = {
  passThreshold: 100,
  questionsShown: "all",
  specificCount: 10,
  questionOrder: "fixed",
  attemptsAllowed: String(DEFAULT_ATTEMPTS),
  unlimitedAttempts: false,
};

/** Framework defaults for a type, mapped onto the authoring settings shape. */
export function settingsForType(
  type: AssessmentType,
  thresholdOverride?: number,
): AssessmentSettings {
  const d = ASSESSMENT_DEFAULTS[type];
  return {
    ...defaultAssessmentSettings,
    passThreshold: thresholdOverride ?? d.passThreshold,
    attemptsAllowed: d.attempts == null ? "" : String(d.attempts),
    unlimitedAttempts: d.attempts == null,
  };
}

export function AssessmentSettingsPanel({
  value,
  onChange,
  defaultOpen = true,
  assessmentType = null,
  components,
  onComponentsChange,
}: {
  value: AssessmentSettings;
  onChange: (next: AssessmentSettings) => void;
  defaultOpen?: boolean;
  /** When set, only the settings relevant to that framework type are shown. */
  assessmentType?: AssessmentType | null;
  components?: AssessmentComponents;
  onComponentsChange?: (next: AssessmentComponents) => void;
}) {
  const update = <K extends keyof AssessmentSettings>(k: K, v: AssessmentSettings[K]) =>
    onChange({ ...value, [k]: v });

  const { defaultsFor } = useAssessmentTypeDefaults();
  const typeDefaults = assessmentType ? defaultsFor(assessmentType) : null;
  const completionOnly = typeDefaults
    ? !typeDefaults.requiresScore
    : assessmentType === "Comprehension Check";
  const thresholdLocked = !!typeDefaults && !typeDefaults.allowOverride;
  const showAttempts = !completionOnly;
  const setComponent = (key: keyof AssessmentComponents, checked: boolean) => {
    if (!components || !onComponentsChange) return;
    const other = key === "questions" ? "content" : "questions";
    if (!checked && !components[other]) return;
    onComponentsChange({ ...components, [key]: checked });
  };

  return (
    <Collapsible defaultOpen={defaultOpen} className="rounded-2xl border border-border bg-card shadow-sm">
      <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 text-left">
        <h3 className="text-base font-semibold text-foreground">Assessment settings</h3>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-4 py-4 space-y-5">
        {completionOnly ? (
          <div className="space-y-2">
            <Label className="text-sm">Advancement threshold (%)</Label>
            <p className="text-sm text-foreground">No advancement score</p>
            <p className="text-xs text-muted-foreground">
              Comprehension Checks are embedded SCORM activities. Completion is recorded; learners are not scored and are never blocked from continuing.
            </p>
          </div>
        ) : thresholdLocked ? (
          <div className="space-y-2">
            <Label className="text-sm">Advancement threshold (%)</Label>
            <p className="text-sm text-foreground">
              {typeDefaults?.threshold ?? value.passThreshold}%
              {(typeDefaults?.threshold ?? value.passThreshold) === 0
                ? " — never blocks progression"
                : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              This threshold is set centrally in Configuration and cannot be changed here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="pass-threshold" className="text-sm">Advancement threshold (%)</Label>
            <Input
              id="pass-threshold"
              type="number"
              min={0}
              max={100}
              value={value.passThreshold}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isNaN(n)) return;
                update("passThreshold", Math.max(0, Math.min(100, n)));
              }}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              {assessmentType === "Proficiency Check"
                ? "Learners must score at or above this percentage to graduate. Below it, the facilitator and business leader are notified and agree next steps."
                : assessmentType === "Readiness Check"
                  ? "Learners must score at or above this percentage to advance. Below it, the facilitator is notified and remediation is offered before the next attempt."
                  : "Learners must score at or above this percentage to advance past the assessment."}
            </p>
          </div>
        )}

        {components && onComponentsChange && (
          <div className="space-y-2">
            <div>
              <Label className="text-sm">Assessment components</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Choose Questions, Assessment Content, or both.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="assessment-component-questions"
                checked={components.questions}
                onCheckedChange={(v) => setComponent("questions", v === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="assessment-component-questions" className="text-sm font-normal">
                  Questions
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {QUESTION_TYPE_LABELS.join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="assessment-component-content"
                checked={components.content}
                onCheckedChange={(v) => setComponent("content", v === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="assessment-component-content" className="text-sm font-normal">
                  Assessment Content
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {CONTENT_TYPE_LABELS.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {(!components || components.questions) && <div className="space-y-2">
          <Label className="text-sm">Questions shown to learner</Label>
          <RadioGroup
            value={value.questionsShown}
            onValueChange={(v) => update("questionsShown", v as "all" | "specific")}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="qs-all" value="all" />
              <Label htmlFor="qs-all" className="text-sm font-normal">All questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="qs-specific" value="specific" />
              <Label htmlFor="qs-specific" className="text-sm font-normal">A specific number</Label>
            </div>
          </RadioGroup>
          <div className={cn("pl-6 space-y-1", value.questionsShown !== "specific" && "hidden")}>
            <Label htmlFor="qs-count" className="text-xs text-muted-foreground">Number of questions</Label>
            <Input
              id="qs-count"
              type="number"
              min={1}
              placeholder="e.g. 10"
              value={value.specificCount}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isNaN(n)) return;
                update("specificCount", Math.max(1, n));
              }}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              Must not exceed the total number of questions in the assessment.
            </p>
          </div>
        </div>}

        {(!components || components.questions) && <div className="space-y-2">
          <Label className="text-sm">Question order</Label>
          <RadioGroup
            value={value.questionOrder}
            onValueChange={(v) => update("questionOrder", v as "fixed" | "random")}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="qo-fixed" value="fixed" />
              <Label htmlFor="qo-fixed" className="text-sm font-normal">
                Fixed order — questions appear in the order they were created or uploaded
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="qo-random" value="random" />
              <Label htmlFor="qo-random" className="text-sm font-normal">
                Randomised — questions are shuffled each time a learner takes the assessment
              </Label>
            </div>
          </RadioGroup>
        </div>}

        {showAttempts ? (
          <AttemptsAllowedField
            idPrefix="assessment-settings"
            value={{ attempts: value.attemptsAllowed, unlimited: value.unlimitedAttempts }}
            onChange={(next) =>
              onChange({
                ...value,
                attemptsAllowed: next.attempts,
                unlimitedAttempts: next.unlimited,
              })
            }
          />
        ) : (
          <div className="space-y-2">
            <Label className="text-sm">Attempts allowed</Label>
            <p className="text-sm text-foreground">Unlimited</p>
            <p className="text-xs text-muted-foreground">
              Learners can revisit this activity as often as they like; only completion is recorded.
            </p>
          </div>
        )}

      </CollapsibleContent>
    </Collapsible>
  );
}
