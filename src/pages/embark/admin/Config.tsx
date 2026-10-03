import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCohortSettings } from "@/hooks/use-cohort-settings";
import { useAssessmentSettings, ANSWER_REVIEW_OPTIONS } from "@/hooks/use-assessment-settings";
import {
  CONTENT_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  useAssessmentTypeDefaults,
} from "@/hooks/use-assessment-type-defaults";
import { ASSESSMENT_TYPES } from "@/data/assessmentTypes";
import { useFeatureFlags, FEATURE_FLAGS } from "@/hooks/use-feature-flags";
import {
  useNotificationSettings,
  recipientLabel,
  RECIPIENT_OPTIONS,
  type GraduationEmailSettings,
  type OutcomeKey,
  type RecipientOption,
} from "@/hooks/use-notification-settings";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

const flags = FEATURE_FLAGS;

export function SectionCard({ id, title, subtitle, children }: { id?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className="rounded-2xl border border-border bg-card p-6 shadow-sm scroll-mt-4 outline-none">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">{title}</h3>
      {subtitle && <p className="text-xs italic text-muted-foreground mt-1">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const OUTCOMES: { key: OutcomeKey; label: string; description: string; subjectPlaceholder: string; bodyPlaceholder: string }[] = [
  {
    key: "approve",
    label: "Approve",
    description:
      "Sent when the line manager approves the learner's graduation. Embark records the decision; the CISI Level 4 pass still sits outside the platform.",
    subjectPlaceholder: "e.g. Congratulations — your graduation has been approved!",
    bodyPlaceholder: "Enter the email body for approved graduations.",
  },
  {
    key: "softLanding",
    label: "Soft Landing",
    description:
      "Sent when the line manager places the learner into a supervised practice period before full graduation sign-off.",
    subjectPlaceholder: "e.g. Your graduation is under review — next steps inside",
    bodyPlaceholder: "Enter the email body for soft landing graduations.",
  },
  {
    key: "flag",
    label: "Flag",
    description:
      "Sent when the line manager flags that the learner needs additional practice before graduating.",
    subjectPlaceholder: "e.g. Your line manager has reviewed your graduation — action needed",
    bodyPlaceholder: "Enter the email body for flagged graduations.",
  },
];

function NotificationConfigurationSection() {
  const { graduationEmail, saveGraduationEmail } = useNotificationSettings();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<GraduationEmailSettings>(graduationEmail);

  useEffect(() => {
    if (open) setDraft(graduationEmail);
  }, [open, graduationEmail]);

  const rows = [
    {
      id: "graduation_email",
      name: "Graduation Email",
      active: graduationEmail.active,
      recipients: recipientLabel(graduationEmail.recipients),
      onOpen: () => setOpen(true),
    },
  ];

  const setOutcomeField = (key: OutcomeKey, field: "subject" | "body", value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">Notification Configuration</h4>
      <p className="text-xs text-muted-foreground mt-1">
        Manage the notifications sent to learners and line managers. Click a notification to
        configure its content and recipients.
      </p>

      <div className="mt-4 rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Notification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                tabIndex={0}
                role="button"
                className="cursor-pointer"
                onClick={row.onOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    row.onOpen();
                  }
                }}
              >
                <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                <TableCell>
                  {row.active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{row.recipients}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Graduation Email</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Configure the email sent when a line manager takes action on a learner's
                graduation. A certificate is issued only after that sign-off and an external CISI Level 4 pass.
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="approve">
              <TabsList>
                {OUTCOMES.map((o) => (
                  <TabsTrigger key={o.key} value={o.key}>
                    {o.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {OUTCOMES.map((o) => (
                <TabsContent key={o.key} value={o.key} className="mt-4 space-y-4">
                  <p className="text-xs text-muted-foreground">{o.description}</p>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Email Subject</Label>
                    <Input
                      className="mt-2"
                      value={draft[o.key].subject}
                      placeholder={o.subjectPlaceholder}
                      onChange={(e) => setOutcomeField(o.key, "subject", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Email Body</Label>
                    <Textarea
                      className="mt-2"
                      rows={8}
                      value={draft[o.key].body}
                      placeholder={o.bodyPlaceholder}
                      onChange={(e) => setOutcomeField(o.key, "body", e.target.value)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground">Recipients</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Choose who receives the graduation email for all three outcomes. The same recipient
              setting applies to Approve, Soft Landing, and Flag emails.
            </p>
            <div className="mt-3">
              <Label className="text-sm font-medium text-foreground">Send graduation email to</Label>
              <Select
                value={draft.recipients}
                onValueChange={(v) =>
                  setDraft((prev) => ({ ...prev, recipients: v as RecipientOption }))
                }
              >
                <SelectTrigger className="mt-2 w-full" aria-label="Send graduation email to">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECIPIENT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {RECIPIENT_OPTIONS.find((o) => o.value === draft.recipients)?.description}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground">Notification Status</h4>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">Active</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  When active, this email is sent automatically when a line manager takes action on a
                  learner's graduation.
                </div>
              </div>
              <Switch
                checked={draft.active}
                onCheckedChange={(v) => setDraft((prev) => ({ ...prev, active: v }))}
                aria-label="Active"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex justify-end">
            <Button
              onClick={() => {
                saveGraduationEmail(draft);
                setOpen(false);
                toast("Settings saved successfully.");
              }}
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function FeatureFlagsSection() {
  const cohortSettings = useCohortSettings();
  const { flags: flagState, setFlag } = useFeatureFlags();

  const toggleFlag = (id: string, value: boolean) => {
    setFlag(id, value);
    toast("Setting updated");
  };

  type FlagRow = {
    id: string;
    name: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  };

  const rows: FlagRow[] = [
    ...flags.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      checked: flagState[f.id] ?? false,
      onChange: (v: boolean) => toggleFlag(f.id, v),
    })),
    {
      id: "cohort_dates_required",
      name: "Cohort scheduling fields required",
      description:
        "Start date and target completion date are required when creating or editing a cohort.",
      checked: cohortSettings.datesRequired,
      onChange: (v: boolean) => {
        cohortSettings.setField("datesRequired", v);
        toast("Setting updated");
      },
    },
  ].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  return (
        <SectionCard
          title="Feature flags"
          subtitle="Changes take effect immediately for all new sessions. Active sessions are not affected."
        >
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{row.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{row.description}</div>
                  </div>
                  <Switch
                    checked={row.checked}
                    onCheckedChange={row.onChange}
                    aria-label={row.name}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
  );
}

export function AssessmentsSection() {
  const assessmentSettings = useAssessmentSettings();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Assessments</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how assessments behave across the platform, and set the defaults and authoring
          guidance for each assessment type.
        </p>
      </div>

      <SectionCard
        title="Answer Review"
        subtitle="Control when learners can see which answers were correct or incorrect after completing an assessment."
      >
        <div id="answer-review" tabIndex={-1} className="py-2 scroll-mt-4 outline-none">
          <RadioGroup
            className="space-y-2"
            value={assessmentSettings.answerReview}
            onValueChange={(v) => {
              assessmentSettings.setAnswerReview(v as typeof assessmentSettings.answerReview);
              toast("Settings saved successfully.");
            }}
          >
            {ANSWER_REVIEW_OPTIONS.map((o) => (
              <div key={o.value} className="flex items-start gap-2">
                <RadioGroupItem value={o.value} id={`answer-review-${o.value}`} className="mt-0.5" />
                <Label
                  htmlFor={`answer-review-${o.value}`}
                  className="text-sm font-normal text-foreground leading-snug"
                >
                  {o.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </SectionCard>

      <AssessmentTypeDefaultsBlock />
    </div>
  );
}

const TYPE_SECTION_HELPERS: Record<string, string> = Object.fromEntries(
  ASSESSMENT_TYPES.map((type) => [
    type,
    `Defaults applied when an author creates or edits a ${type}.`,
  ]),
);

function typeAnchor(type: string) {
  return `assessment-type-${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function AssessmentTypeDefaultsBlock() {
  const { defaults, setDefault } = useAssessmentTypeDefaults();

  return (
    <div className="space-y-6">
      <div id="assessment-type-defaults" tabIndex={-1} className="scroll-mt-4 outline-none">
        <h2 className="text-lg font-semibold text-foreground">Assessment Type Defaults</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure default behaviour, advancement thresholds, and authoring guidance for each
          assessment type.
        </p>
      </div>

      {ASSESSMENT_TYPES.map((type) => {
        const cfg = defaults[type];
        return (
          <SectionCard
            key={type}
            id={typeAnchor(type)}
            title={`${type} Defaults`}
            subtitle={TYPE_SECTION_HELPERS[type]}
          >
            <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Advancement requirement</Label>
              <RadioGroup
                value={cfg.requiresScore ? "required" : "none"}
                onValueChange={(v) => {
                  setDefault(type, "requiresScore", v === "required");
                  toast("Settings saved successfully.");
                }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="required" id={`atd-req-${type}`} />
                  <Label htmlFor={`atd-req-${type}`} className="text-sm font-normal">
                    Advancement Score Required
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="none" id={`atd-none-${type}`} />
                  <Label htmlFor={`atd-none-${type}`} className="text-sm font-normal">
                    No Advancement Score
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label
                  htmlFor={`atd-threshold-${type}`}
                  className={cn("text-sm", !cfg.requiresScore && "text-muted-foreground")}
                >
                  Default threshold (%)
                </Label>
                <Input
                  id={`atd-threshold-${type}`}
                  type="number"
                  min={0}
                  max={100}
                  disabled={!cfg.requiresScore}
                  value={cfg.threshold}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setDefault(type, "threshold", Math.max(0, Math.min(100, n)));
                  }}
                  onBlur={() => toast("Settings saved successfully.")}
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  {cfg.requiresScore
                    ? "Applied automatically when an author selects this assessment type."
                    : "No advancement score — completion only, so no threshold applies."}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="max-w-[16rem]">
                  <div className="text-sm font-medium text-foreground">
                    Allow threshold override
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    When off, authors see the configured threshold but cannot change it.
                  </div>
                </div>
                <Switch
                  checked={cfg.allowOverride}
                  onCheckedChange={(v) => {
                    setDefault(type, "allowOverride", v);
                    toast("Settings saved successfully.");
                  }}
                  aria-label={`Allow threshold override for ${type}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-sm">Assessment components</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose what authors can build this assessment type from. Either or both may be
                  enabled.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`atd-component-questions-${type}`}
                  checked={cfg.components.questions}
                  onCheckedChange={(v) => {
                    const checked = v === true;
                    if (!checked && !cfg.components.content) return;
                    setDefault(type, "components", { ...cfg.components, questions: checked });
                    toast("Settings saved successfully.");
                  }}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <Label htmlFor={`atd-component-questions-${type}`} className="text-sm font-normal">
                    Questions
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {QUESTION_TYPE_LABELS.join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`atd-component-content-${type}`}
                  checked={cfg.components.content}
                  onCheckedChange={(v) => {
                    const checked = v === true;
                    if (!checked && !cfg.components.questions) return;
                    setDefault(type, "components", { ...cfg.components, content: checked });
                    toast("Settings saved successfully.");
                  }}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <Label htmlFor={`atd-component-content-${type}`} className="text-sm font-normal">
                    Assessment content
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {CONTENT_TYPE_LABELS.join(" · ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`atd-description-${type}`} className="text-sm">
                Description
              </Label>
              <Textarea
                id={`atd-description-${type}`}
                rows={3}
                value={cfg.description}
                onChange={(e) => setDefault(type, "description", e.target.value)}
                onBlur={() => toast("Settings saved successfully.")}
              />
              <p className="text-xs text-muted-foreground">
                Shown to authors beneath Assessment Type during creation and editing.
              </p>
            </div>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}

export function NotificationsSection() {
  return (
    <SectionCard
      title="Notifications"
      subtitle="Manage the notifications and automated reminders sent to learners and line managers."
    >
      <NotificationConfigurationSection />
      <ReminderSettingsCard />
    </SectionCard>
  );
}

type SlaUnit = "hours" | "business_days";

function toHours(value: number, unit: SlaUnit) {
  return unit === "hours" ? value : value * 8;
}

export function HandsRaisedSlaSection() {
  const [targetValue, setTargetValue] = useState(24);
  const [targetUnit, setTargetUnit] = useState<SlaUnit>("hours");
  const [notifyOnBreach, setNotifyOnBreach] = useState(true);
  const [escalationValue, setEscalationValue] = useState(48);
  const [escalationUnit, setEscalationUnit] = useState<SlaUnit>("hours");

  const escalationInvalid =
    !Number.isFinite(escalationValue) ||
    !Number.isFinite(targetValue) ||
    toHours(escalationValue, escalationUnit) <= toHours(targetValue, targetUnit);

  const save = () => {
    if (!escalationInvalid) toast("Settings saved successfully.");
  };

  return (
    <SectionCard
      title="Hands Raised SLA"
      subtitle="Define the response time target for Hands Raised requests. This applies across the Institute. When a learner raises their hand, their line manager is expected to respond within the configured timeframe."
    >
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-foreground">Target Response Time</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={targetValue}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setTargetValue(Number.isNaN(v) ? 0 : v);
                save();
              }}
              className="w-20"
              aria-label="Target response time value"
            />
            <Select
              value={targetUnit}
              onValueChange={(v) => {
                setTargetUnit(v as SlaUnit);
                save();
              }}
            >
              <SelectTrigger className="w-[140px]" aria-label="Target response time unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="business_days">Business Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The line manager is alerted when a Hands Raised request has not received a response within this timeframe.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 pt-3 border-t border-border">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground">Notify When SLA Is Breached</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              When enabled, the line manager receives a notification if a Hands Raised request remains unresolved beyond the target response time.
            </div>
          </div>
          <Switch
            checked={notifyOnBreach}
            onCheckedChange={(v) => {
              setNotifyOnBreach(v);
              toast("Settings saved successfully.");
            }}
            aria-label="Notify when SLA is breached"
          />
        </div>

        <div className="pt-3 border-t border-border">
          <Label className="text-sm font-medium text-foreground">Escalate Unresolved Requests After</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={escalationValue}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setEscalationValue(Number.isNaN(v) ? 0 : v);
                save();
              }}
              className="w-20"
              aria-invalid={escalationInvalid}
              aria-label="Escalation period value"
            />
            <Select
              value={escalationUnit}
              onValueChange={(v) => {
                setEscalationUnit(v as SlaUnit);
                save();
              }}
            >
              <SelectTrigger className="w-[140px]" aria-label="Escalation period unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="business_days">Business Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            If a Hands Raised request is still unresolved after this period, it will be escalated to the next level of management. Must be greater than the target response time.
          </p>
          {escalationInvalid && (
            <FieldError message="Escalation period must be greater than the target response time." />
          )}
        </div>

        <div className="pt-3 border-t border-border">
          <div className="text-sm font-medium text-foreground">Applies To</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-foreground">
              Managers
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This SLA applies to line managers across the Institute. It cannot be configured per person.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  return (

    <div className="mt-1 text-right text-xs text-muted-foreground">
      {value.length} / {max}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function TextField({
  label,
  helper,
  value,
  onChange,
  max,
  error,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  error?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{helper}</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={max}
        aria-invalid={!!error}
      />
      <Counter value={value} max={max} />
      <FieldError message={error} />
    </div>
  );
}

function AreaField({
  label,
  helper,
  value,
  onChange,
  max,
  rows,
  error,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  rows: number;
  error?: string;
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
        aria-invalid={!!error}
      />
      <Counter value={value} max={max} />
      <FieldError message={error} />
    </div>
  );
}

function SubCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 mb-3">{subtitle}</p>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        {children}
      </div>
    </div>
  );
}

function PreviewLabel() {
  return (
    <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
      Preview
    </div>
  );
}

function SaveRow({
  note,
  label,
  onSave,
  disabled,
}: {
  note: string;
  label: string;
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
      <p className="text-xs italic text-muted-foreground">{note}</p>
      <Button size="sm" onClick={onSave} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}

function TransparencyScreenCard() {
  const [headline, setHeadline] = useState("Before you begin — a quick note");
  const [intro, setIntro] = useState(
    "We believe you should always know how your learning experience works. Here's a transparent overview of how Sage supports you and how your progress information is used.",
  );
  const [howSage, setHowSage] = useState(
    "Sage is your personal AI learning guide. It tracks your progress through the programme, answers your questions, suggests resources, and helps you prepare for assessments. Sage adapts to your pace and flags areas where you might benefit from extra support.",
  );
  const [managerSees, setManagerSees] = useState(
    "Your line manager can see your overall progress, module completion, assessment scores, and whether Sage has flagged any areas of concern. They cannot read your individual messages with Sage.",
  );
  const [ackLabel, setAckLabel] = useState(
    "I understand how Sage works and how my progress information is used.",
  );
  const [cta, setCta] = useState("I'm ready — let's begin");

  const req = (v: string) => (v.trim() ? undefined : "This field is required.");
  const errors = {
    headline: req(headline),
    intro: req(intro),
    howSage: req(howSage),
    managerSees: req(managerSees),
    ackLabel: req(ackLabel),
    cta: req(cta),
  };
  const invalid = Object.values(errors).some(Boolean);

  return (
    <SubCard
      title="Transparency Screen"
      subtitle="The transparency screen is shown to learners before they begin their journey. It explains how Sage works, what data is used, and how their progress is shared. Learners must acknowledge this screen before proceeding."
    >
      <TextField
        label="Transparency Screen Headline"
        helper="The main heading on the transparency screen."
        value={headline}
        onChange={setHeadline}
        max={80}
        error={errors.headline}
      />
      <AreaField
        label="Introduction"
        helper="A short opening paragraph introducing why this screen exists."
        value={intro}
        onChange={setIntro}
        max={400}
        rows={3}
        error={errors.intro}
      />
      <AreaField
        label="How Sage Works"
        helper="Explain what Sage does — how it personalises learning, answers questions, and supports progress."
        value={howSage}
        onChange={setHowSage}
        max={600}
        rows={4}
        error={errors.howSage}
      />
      <AreaField
        label="What Your Manager Can See"
        helper="Be explicit about what progress data is visible to the line manager. Clarity here builds trust."
        value={managerSees}
        onChange={setManagerSees}
        max={600}
        rows={4}
        error={errors.managerSees}
      />
      <TextField
        label="Acknowledgement Checkbox Label"
        helper="The label next to the checkbox the learner must tick before they can proceed."
        value={ackLabel}
        onChange={setAckLabel}
        max={160}
        error={errors.ackLabel}
      />
      <TextField
        label="CTA Button Label"
        helper="The label on the button that takes the learner into their journey after they have ticked the acknowledgement checkbox."
        value={cta}
        onChange={setCta}
        max={40}
        error={errors.cta}
      />

      <div className="mt-2">
        <PreviewLabel />
        <div className="rounded-lg border border-border bg-muted/40 p-6">
          <div className="text-2xl font-medium text-foreground">
            {headline || "\u00a0"}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{intro}</p>

          <div className="mt-5">
            <div className="text-sm font-medium text-foreground">How Sage works</div>
            <p className="mt-1 text-sm text-muted-foreground">{howSage}</p>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-foreground">
              What your manager can see
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{managerSees}</p>
          </div>

          <div className="mt-5 flex items-start gap-2">
            <Checkbox checked={false} disabled aria-label="Acknowledgement preview" />
            <span className="text-sm text-foreground">{ackLabel}</span>
          </div>

          <div className="mt-5">
            <Button disabled>{cta || "\u00a0"}</Button>
          </div>
        </div>
      </div>

      <SaveRow
        note="The transparency screen is shown once per learner at the start of their first session."
        label="Save Transparency Screen"
        disabled={invalid}
        onSave={() => toast("Transparency screen settings saved")}
      />
    </SubCard>
  );
}

function NumberField({
  label,
  helper,
  value,
  onChange,
  min,
  max,
  previewSentence,
  error,
}: {
  label: string;
  helper: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min: number;
  max: number;
  previewSentence: string;
  error?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{helper}</p>
      <Input
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange("");
          const n = parseInt(raw, 10);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className="w-32"
        aria-invalid={!!error}
      />
      <p className="mt-2 text-xs italic text-muted-foreground">{previewSentence}</p>
      <FieldError message={error} />
    </div>
  );
}

function ReminderSettingsCard() {
  const [first, setFirst] = useState<number | "">(3);
  const [second, setSecond] = useState<number | "">(7);
  const [escalation, setEscalation] = useState<number | "">(14);

  const validRange = (v: number | "", lo: number, hi: number) =>
    typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;

  let errFirst: string | undefined;
  if (first === "") errFirst = "This field is required.";
  else if (!validRange(first, 1, 30))
    errFirst = "Please enter a number between 1 and 30.";

  let errSecond: string | undefined;
  if (second === "") errSecond = "This field is required.";
  else if (!validRange(second, 2, 60))
    errSecond = "Please enter a number between 2 and 60.";
  else if (typeof first === "number" && (second as number) <= first)
    errSecond =
      "The second reminder must be set to more days than the first reminder.";

  let errEscalation: string | undefined;
  if (escalation === "") errEscalation = "This field is required.";
  else if (!validRange(escalation, 3, 90))
    errEscalation = "Please enter a number between 3 and 90.";
  else if (typeof second === "number" && (escalation as number) <= second)
    errEscalation =
      "The escalation reminder must be set to more days than the second reminder.";

  const invalid = !!(errFirst || errSecond || errEscalation);

  const dFirst = typeof first === "number" ? first : 3;
  const dSecond = typeof second === "number" ? second : 7;
  const dEscalation = typeof escalation === "number" ? escalation : 14;

  return (
    <SubCard
      title="Reminder Settings"
      subtitle="Configure when Sage sends automated reminders to learners who have not engaged recently. These reminders are sent via the learner's Sage chat and can be reviewed in Nudge Management."
    >
      <NumberField
        label="First Reminder — Days of Inactivity"
        helper="Sage will send a gentle check-in nudge to a learner after this many days without activity. Minimum: 1 day. Maximum: 30 days."
        value={first}
        onChange={setFirst}
        min={1}
        max={30}
        previewSentence={`Sage will send the first reminder after ${dFirst} days of inactivity.`}
        error={errFirst}
      />
      <NumberField
        label="Second Reminder — Days of Inactivity"
        helper="Sage will send a follow-up nudge if the learner remains inactive after the first reminder. Must be greater than the first reminder value. Maximum: 60 days."
        value={second}
        onChange={setSecond}
        min={2}
        max={60}
        previewSentence={`Sage will send the second reminder after ${dSecond} days of inactivity.`}
        error={errSecond}
      />
      <NumberField
        label="Escalation Reminder — Days of Inactivity"
        helper="After this many days of inactivity, Sage will notify the learner's line manager in addition to sending a final nudge to the learner. Must be greater than the second reminder value."
        value={escalation}
        onChange={setEscalation}
        min={3}
        max={90}
        previewSentence={`After ${dEscalation} days of inactivity, Sage will alert the line manager.`}
        error={errEscalation}
      />

      <div className="mt-2">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
          Current reminder schedule
        </div>
        <div className="rounded-lg bg-muted/50 p-5">
          <div className="flex items-start gap-3">
            <TimelineNode
              dotClass="bg-primary"
              day={`Day ${dFirst}`}
              caption="First reminder"
            />
            <div className="flex-1 border-t border-border mt-3" />
            <TimelineNode
              dotClass="bg-warning"
              day={`Day ${dSecond}`}
              caption="Second reminder"
            />
            <div className="flex-1 border-t border-border mt-3" />
            <TimelineNode
              dotClass="bg-destructive"
              day={`Day ${dEscalation}`}
              caption="Escalation — line manager notified"
            />
          </div>
        </div>
      </div>

      <SaveRow
        note="Reminder settings apply to all learners across all active cohorts."
        label="Save Reminder Settings"
        disabled={invalid}
        onSave={() => toast("Reminder settings saved")}
      />
    </SubCard>
  );
}

function TimelineNode({
  dotClass,
  day,
  caption,
}: {
  dotClass: string;
  day: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col items-center text-center min-w-[96px]">
      <div className={`h-3 w-3 rounded-full ${dotClass}`} />
      <div className="mt-2 text-xs font-medium text-foreground">{day}</div>
      <div className="text-xs text-muted-foreground">{caption}</div>
    </div>
  );
}

export function LearnerExperienceSection() {
  return (
    <SectionCard
      title="Experience"
      subtitle="Configure the text and settings that learners see when they first access the platform and throughout their onboarding journey."
    >
      <TransparencyScreenCard />
    </SectionCard>
  );
}

