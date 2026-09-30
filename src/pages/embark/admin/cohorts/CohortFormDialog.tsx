import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top-on-change";
import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowUp,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import {
  useEventRegistration,
  type EventRegistrationConfig,
  type EventRegistrationMode,
} from "@/hooks/use-event-registration";
import { findJourneyLiveEventSession, journeyLiveEventsByName, JOURNEYS as ADMIN_JOURNEYS } from "@/pages/embark/admin/journeys/data";
import { useCohortSettings } from "@/hooks/use-cohort-settings";
import { useLinesOfBusiness } from "@/hooks/use-lines-of-business";
import { useBusinessLeaders } from "@/hooks/use-business-leaders";
import { directoryUser } from "@/data/cvsDirectory";
import { cn } from "@/lib/utils";
import { WelcomeScreenFields } from "@/components/embark/admin/WelcomeScreenFields";
import { useCohortWelcome } from "@/hooks/use-cohort-welcome";
import {
  DEFAULT_EXPERIENCE_CONTENT,
  type WelcomeContent,
} from "@/hooks/use-experience-content";
import { MANAGERS, TRAINERS, initials, type Cohort, type Manager, type Trainer } from "./data";

export type CohortFormValues = {
  name: string;
  journey: string;
  startDate?: Date;
  targetDate?: Date;
  maxSize: number;
  description: string;
  primaryTrainerId: string;
  secondaryTrainerIds: string[];
  managerId: string | null;
  lineOfBusiness?: string[];
  /** Live event session registration configuration, empty when the journey has no events. */
  eventRegistration?: EventRegistrationConfig[];
  /** Welcome Screen content configured for this cohort. */
  welcome?: WelcomeContent;
};


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: Cohort;
  onSubmit: (values: CohortFormValues) => Promise<void> | void;
};

type StepKey = "details" | "events" | "welcome" | "review";

const STEP_LABEL: Record<StepKey, string> = {
  details: "Cohort Details",
  welcome: "Welcome Screen",
  events: "Events and Sessions",
  review: "Review & Save",
};

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground shrink-0",
        className ?? "h-8 w-8",
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function CohortFormDialog({ open, onOpenChange, mode, initial, onSubmit }: Props) {
  const { datesRequired, secondaryTrainerEnabled } = useCohortSettings();
  const isCvs = true;
  const { lines } = useLinesOfBusiness();
  const { leadersFor } = useBusinessLeaders();
  const { configsFor } = useEventRegistration();
  const { welcomeFor } = useCohortWelcome();
  const welcomeForRef = useRef(welcomeFor);
  welcomeForRef.current = welcomeFor;
  const [step, setStep] = useState<StepKey>("details");
  const dialogRef = useRef<HTMLDivElement>(null);
  useScrollToTopOnChange(dialogRef, step);
  const [eventConfigs, setEventConfigs] = useState<EventRegistrationConfig[]>([]);
  const [welcome, setWelcome] = useState<WelcomeContent>(
    DEFAULT_EXPERIENCE_CONTENT.welcome,
  );
  const [lineOfBusiness, setLineOfBusiness] = useState<string[]>([]);
  const [lobOpen, setLobOpen] = useState(false);
  const [name, setName] = useState("");
  const [journey, setJourney] = useState("");
  const journeyOptions = useMemo(() => {
    const names = ADMIN_JOURNEYS.filter((j) => j.status === "active").map((j) => j.name);
    if (journey && !names.includes(journey)) names.unshift(journey);
    return names;
  }, [journey]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [maxSize, setMaxSize] = useState(500);
  const [description, setDescription] = useState("");
  const [primaryTrainerId, setPrimaryTrainerId] = useState<string | null>(null);
  const [secondaryTrainerIds, setSecondaryTrainerIds] = useState<string[]>([]);
  const [managerId, setManagerId] = useState<string | null>(null);
  const [managerSearch, setManagerSearch] = useState("");
  const [managerFocused, setManagerFocused] = useState(false);
  const [managerAttempted, setManagerAttempted] = useState(false);
  const [datesAttempted, setDatesAttempted] = useState(false);
  const [primarySearch, setPrimarySearch] = useState("");
  const [secondarySearch, setSecondarySearch] = useState("");
  const [primaryFocused, setPrimaryFocused] = useState(false);
  const [secondaryFocused, setSecondaryFocused] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [promoteCandidateId, setPromoteCandidateId] = useState<string | null>(null);

  // Reset when opened
  useEffect(() => {
    if (!open) return;
    setStep("details");
    setDiscarding(false);
    setSaving(false);
    setPrimarySearch("");
    setSecondarySearch("");
    setManagerSearch("");
    setManagerAttempted(false);
    setDatesAttempted(false);
    if (initial) {
      setName(initial.name);
      setJourney(initial.journey);
      setStartDate(initial.startDate ? new Date(initial.startDate) : undefined);
      setTargetDate(initial.targetDate ? new Date(initial.targetDate) : undefined);
      setMaxSize(initial.maxSize);
      setDescription(initial.description ?? "");
      setPrimaryTrainerId(initial.primaryTrainerId);
      setSecondaryTrainerIds(initial.secondaryTrainerIds);
      setManagerId(initial.managerId);
      setLineOfBusiness(initial.lineOfBusiness ?? []);
      setEventConfigs(configsFor(initial.id));
      setWelcome(welcomeForRef.current(initial.id));
    } else {
      setName("");
      setJourney("");
      setStartDate(undefined);
      setTargetDate(undefined);
      setMaxSize(500);
      setDescription("");
      setPrimaryTrainerId(null);
      setSecondaryTrainerIds([]);
      setManagerId(null);
      setLineOfBusiness([]);
      setEventConfigs([]);
      setWelcome(DEFAULT_EXPERIENCE_CONTENT.welcome);
    }
  }, [open, initial, configsFor]);

  const dateError =
    startDate && targetDate && targetDate.getTime() <= startDate.getTime()
      ? "Target completion must be after the start date"
      : null;

  const effectiveDatesRequired = datesRequired;
  const datesValid = !effectiveDatesRequired || (!!startDate && !!targetDate);
  const step1OtherValid = !!name.trim() && !!journey && !dateError && !!managerId;
  const step1Valid = step1OtherValid && datesValid;
  const step2Valid = !!primaryTrainerId;

  const businessLeaderIds = useMemo(() => {
    const seen = new Set<string>();
    lineOfBusiness.forEach((line) => leadersFor(line).forEach((id) => seen.add(id)));
    return Array.from(seen);
  }, [lineOfBusiness, leadersFor]);

  const isDirty = useMemo(() => {
    if (mode === "edit" && initial) {
      return (
        name !== initial.name ||
        journey !== initial.journey ||
        (startDate?.toISOString().slice(0, 10) ?? "") !== initial.startDate ||
        (targetDate?.toISOString().slice(0, 10) ?? "") !== initial.targetDate ||
        maxSize !== initial.maxSize ||
        description !== (initial.description ?? "") ||
        primaryTrainerId !== initial.primaryTrainerId ||
        secondaryTrainerIds.join(",") !== initial.secondaryTrainerIds.join(",") ||
        managerId !== initial.managerId
      );
    }
    return (
      !!name.trim() ||
      !!journey ||
      !!startDate ||
      !!targetDate ||
      maxSize !== 500 ||
      !!description.trim() ||
      !!primaryTrainerId ||
      secondaryTrainerIds.length > 0 ||
      !!managerId
    );
  }, [
    mode, initial, name, journey, startDate, targetDate, maxSize, description,
    primaryTrainerId, secondaryTrainerIds, managerId,
  ]);

  const handleClose = () => {
    if (isDirty) {
      setDiscarding(true);
      return;
    }
    onOpenChange(false);
  };

  const trainerById = (id: string | null) => (id ? TRAINERS.find((t) => t.id === id) : undefined);
  const primaryTrainer = trainerById(primaryTrainerId);

  const managerById = (id: string | null) =>
    id ? MANAGERS.find((m) => m.id === id) : undefined;
  const selectedManager = managerById(managerId);

  const managerResults: Manager[] = MANAGERS.filter((m) =>
    m.name.toLowerCase().includes(managerSearch.toLowerCase()),
  );

  const primaryResults: Trainer[] = TRAINERS.filter((t) =>
    t.name.toLowerCase().includes(primarySearch.toLowerCase()),
  );
  const secondaryResults: Trainer[] = TRAINERS.filter(
    (t) =>
      t.id !== primaryTrainerId &&
      !secondaryTrainerIds.includes(t.id) &&
      t.name.toLowerCase().includes(secondarySearch.toLowerCase()),
  );

  const handleSave = async () => {
    if (!step1Valid || !managerId) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    await onSubmit({
      name: name.trim(),
      journey,
      startDate,
      targetDate,
      maxSize,
      description: description.trim(),
      primaryTrainerId: primaryTrainerId ?? "",
      secondaryTrainerIds,
      managerId,
      lineOfBusiness: undefined,
      eventRegistration: hasJourneyEvents ? eventConfigs : [],
      welcome,
    });
    setSaving(false);
    onOpenChange(false);
  };


  const journeyEvents = useMemo(() => journeyLiveEventsByName(journey), [journey]);
  const hasJourneyEvents = journeyEvents.length > 0;

  const steps: StepKey[] = useMemo(() => {
    const list: StepKey[] = ["details"];
    if (hasJourneyEvents) list.push("events");
    list.push("welcome");
    list.push("review");
    return list;
  }, [hasJourneyEvents]);

  const stepIndex = Math.max(0, steps.indexOf(step));
  const goToStep = (delta: number) => {
    const next = steps[stepIndex + delta];
    if (next) setStep(next);
  };
  const nextStepKey = steps[stepIndex + 1];

  // Keep the wizard on a valid step if the journey selection changes.
  useEffect(() => {
    if (!steps.includes(step)) setStep("details");
  }, [steps, step]);

  // Default every journey event to admin-assigned registration.
  useEffect(() => {
    setEventConfigs((prev) =>
      journeyEvents.map(
        (ev) =>
          prev.find((c) => c.eventId === ev.id) ?? {
            eventId: ev.id,
            mode: "assigned" as const,
            sessionId: ev.sessions?.[0]?.id,
          },
      ),
    );
  }, [journeyEvents]);

  const updateEventConfig = (eventId: string, patch: Partial<EventRegistrationConfig>) =>
    setEventConfigs((prev) =>
      prev.map((c) => (c.eventId === eventId ? { ...c, ...patch } : c)),
    );

  const eventsStepValid = eventConfigs.every(
    (c) => c.mode === "learner" || !!c.sessionId,
  );

  const facilitatorSection = (
    <>
              <p className="text-sm text-muted-foreground">
                {secondaryTrainerEnabled
                  ? "Every cohort requires exactly one primary trainer. Secondary trainers are optional. Primary and secondary trainers have identical access to the cohort."
                  : "Every cohort requires exactly one primary trainer."}
              </p>

              {/* Primary */}
              <div className="space-y-2">
                <Label>Primary Trainer <span className="text-destructive">*</span></Label>
                {primaryTrainer ? (
                  <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                    <Avatar name={primaryTrainer.name} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {primaryTrainer.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {primaryTrainer.role}
                      </div>
                    </div>
                    <Badge className="ml-2">Primary Trainer</Badge>
                    <button
                      type="button"
                      onClick={() => setPrimaryTrainerId(null)}
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={primarySearch}
                      onChange={(e) => setPrimarySearch(e.target.value)}
                      onFocus={() => setPrimaryFocused(true)}
                      onBlur={() => setTimeout(() => setPrimaryFocused(false), 150)}
                      placeholder="Search trainers by name..."
                      className="pl-9"
                    />
                    {primaryFocused && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-md max-h-64 overflow-y-auto">
                        {primaryResults.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No trainers found.
                          </div>
                        ) : (
                          primaryResults.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setPrimaryTrainerId(t.id);
                                setPrimarySearch("");
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                            >
                              <Avatar name={t.name} />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-foreground truncate">
                                  {t.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {t.role}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {t.activeCohorts} active cohort{t.activeCohorts === 1 ? "" : "s"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secondary */}
              {secondaryTrainerEnabled && (
              <div className="space-y-2">
                <div>
                  <Label>Secondary Trainers</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional. Add one or more secondary trainers. There is no upper limit.
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={secondarySearch}
                    onChange={(e) => setSecondarySearch(e.target.value)}
                    onFocus={() => setSecondaryFocused(true)}
                    onBlur={() => setTimeout(() => setSecondaryFocused(false), 150)}
                    placeholder="Search trainers by name..."
                    className="pl-9"
                  />
                  {secondaryFocused && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-md max-h-64 overflow-y-auto">
                      {secondaryResults.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No trainers available.
                        </div>
                      ) : (
                        secondaryResults.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSecondaryTrainerIds((prev) => [...prev, t.id]);
                              setSecondarySearch("");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                          >
                            <Avatar name={t.name} />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground truncate">
                                {t.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {t.role}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {t.activeCohorts} active cohort{t.activeCohorts === 1 ? "" : "s"}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {secondaryTrainerIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {secondaryTrainerIds.map((id) => {
                      const t = trainerById(id);
                      if (!t) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-background pl-1 pr-2 py-1 text-sm"
                        >
                          <Avatar name={t.name} className="h-6 w-6 text-[10px]" />
                          <span className="text-foreground">{t.name}</span>
                          <Badge variant="secondary" className="text-[10px]">Secondary</Badge>
                          {primaryTrainerId && (
                            <button
                              type="button"
                              onClick={() => setPromoteCandidateId(id)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={`Promote ${t.name} to Primary`}
                              title="Promote to Primary"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setSecondaryTrainerIds((prev) => prev.filter((x) => x !== id))
                            }
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${t.name}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              )}
    </>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent ref={dialogRef} className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>
            {mode === "edit" && initial
              ? `Edit Cohort — ${initial.name}`
              : "Create New Cohort"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="px-6 pt-4 pb-2">
          <ol className="flex items-center gap-2">
            {steps.map((s, i) => {
              const isCurrent = stepIndex === i;
              const isDone = stepIndex > i;
              return (
                <li key={s} className="flex items-center gap-2 flex-1 min-w-0">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                      isDone && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isDone && !isCurrent && "bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm truncate",
                      isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {STEP_LABEL[s]}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="flex-1 h-px bg-border" aria-hidden />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {step === "details" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="cohort-name">Cohort Name <span className="text-destructive">*</span></Label>
                <Input
                  id="cohort-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CSR Onboarding Cohort C"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Journey <span className="text-destructive">*</span></Label>
                <Select value={journey} onValueChange={setJourney}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select journey..." />
                  </SelectTrigger>
                  <SelectContent>
                    {journeyOptions.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The learning path is determined by the journey selected.
                </p>
              </div>

              {false && (
                <div className="space-y-1.5">
                  <Label>Line of Business</Label>
                  <p className="text-xs text-muted-foreground">
                    Search and select one or more lines of business this cohort belongs to. Business
                    Leaders are assigned automatically from Configuration.
                  </p>
                  <Popover open={lobOpen} onOpenChange={setLobOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={lobOpen}
                        className="w-full justify-between font-normal"
                      >
                        <span
                          className={cn(
                            lineOfBusiness.length === 0 && "text-muted-foreground",
                          )}
                        >
                          {lineOfBusiness.length === 0
                            ? "Select lines of business"
                            : `${lineOfBusiness.length} selected`}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search lines of business..." />
                        <CommandList className="max-h-64">
                          <CommandEmpty>No lines of business found.</CommandEmpty>
                          {lines.map((line) => {
                            const selected = lineOfBusiness.includes(line);
                            return (
                              <CommandItem
                                key={line}
                                value={line}
                                onSelect={() =>
                                  setLineOfBusiness((prev) =>
                                    prev.includes(line)
                                      ? prev.filter((l) => l !== line)
                                      : [...prev, line],
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <span>{line}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {lineOfBusiness.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {lineOfBusiness.map((line) => (
                        <span
                          key={line}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground"
                        >
                          {line}
                          <button
                            type="button"
                            aria-label={`Remove ${line}`}
                            onClick={() =>
                              setLineOfBusiness((prev) => prev.filter((l) => l !== line))
                            }
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {false && (
                <div className="space-y-1.5">
                  <Label>Business Leader(s)</Label>
                  <p className="text-xs text-muted-foreground">
                    Auto-populated from the Line of Business configuration.
                  </p>
                  {businessLeaderIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Select a Line of Business to see its Business Leader(s).
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {businessLeaderIds.map((id) => {
                        const u = directoryUser(id);
                        if (!u) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-2.5 py-1"
                          >
                            <span
                              aria-hidden
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-foreground"
                            >
                              {initials(u.name)}
                            </span>
                            <span className="text-xs text-foreground">{u.name}</span>
                            <span className="text-xs text-muted-foreground">{u.role}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {(
                <div className="space-y-1.5">
                  <Label>Cohort Manager <span className="text-destructive">*</span></Label>
                  <p className="text-xs text-muted-foreground">
                    The cohort manager is the owner of this cohort. They will see this cohort listed
                    under their &lsquo;My Cohorts&rsquo; view and receive risk and progress notifications.
                  </p>
                  {selectedManager ? (
                    <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                      <Avatar name={selectedManager.name} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {selectedManager.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {selectedManager.role}
                        </div>
                      </div>
                      <Badge className="ml-2">Cohort Owner</Badge>
                      <button
                        type="button"
                        onClick={() => {
                          setManagerId(null);
                          setManagerAttempted(false);
                        }}
                        className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={managerSearch}
                        onChange={(e) => setManagerSearch(e.target.value)}
                        onFocus={() => setManagerFocused(true)}
                        onBlur={() => setTimeout(() => {
                          setManagerFocused(false);
                          if (!managerId) setManagerAttempted(true);
                        }, 150)}
                        placeholder="Search managers by name..."
                        className="pl-9"
                      />
                      {managerFocused && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-md max-h-64 overflow-y-auto">
                          {managerResults.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No managers found.
                            </div>
                          ) : (
                            managerResults.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setManagerId(m.id);
                                  setManagerSearch("");
                                  setManagerAttempted(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                              >
                                <Avatar name={m.name} />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-foreground truncate">
                                    {m.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {m.role}
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {m.activeCohorts} active cohort{m.activeCohorts === 1 ? "" : "s"}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {managerAttempted && !managerId && (
                    <p className="text-xs text-destructive">
                      Please assign a cohort manager before continuing.
                    </p>
                  )}
                </div>
              )}


              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>
                    Start Date{" "}
                    {effectiveDatesRequired ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    )}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {effectiveDatesRequired && datesAttempted && !startDate && (
                    <p className="text-xs text-destructive">Please select a start date.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>
                    Target Completion{" "}
                    {effectiveDatesRequired ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    )}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !targetDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {targetDate ? format(targetDate, "PPP") : "Select target completion date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={targetDate}
                        onSelect={setTargetDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {effectiveDatesRequired && datesAttempted && !targetDate && (
                    <p className="text-xs text-destructive">
                      Please select a target completion date.
                    </p>
                  )}
                  {dateError && (
                    <p className="text-xs text-destructive">{dateError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cohort-max">Maximum Cohort Size</Label>
                <Input
                  id="cohort-max"
                  type="number"
                  min={1}
                  max={500}
                  value={maxSize}
                  onChange={(e) => setMaxSize(Math.max(1, Math.min(500, Number(e.target.value) || 0)))}
                />
                <p className="text-xs text-muted-foreground">
                  Default is 500. Maximum 500 learners per cohort.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cohort-desc">Description (optional)</Label>
                <Textarea
                  id="cohort-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes about this cohort — optional"
                />
              </div>

            </>
          )}

          {step === "events" && (
            <>
              <p className="text-sm text-muted-foreground">
                Configure how learners will be registered for Live Event sessions. You can either
                assign learners to a specific session or allow learners to select the session that
                best fits their schedule.
              </p>

              {journeyEvents.map((ev) => {
                const config = eventConfigs.find((c) => c.eventId === ev.id);
                const sessions = ev.sessions ?? [];
                return (
                  <LeftBorderCard key={ev.id} borderVariant="brand">
                    <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{ev.title}</span>
                        <Badge variant="secondary">Live Event</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ev.format} · {ev.location} · {ev.facilitatorName}
                      </p>
                    </div>

                    <RadioGroup
                      value={config?.mode ?? "assigned"}
                      onValueChange={(value) =>
                        updateEventConfig(ev.id, {
                          mode: value as EventRegistrationMode,
                          sessionId:
                            value === "assigned"
                              ? (config?.sessionId ?? sessions[0]?.id)
                              : undefined,
                        })
                      }
                      className="space-y-2"
                    >
                      <div className="flex items-start gap-3 rounded-md border border-border p-3">
                        <RadioGroupItem value="assigned" id={`${ev.id}-assigned`} className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor={`${ev.id}-assigned`} className="font-medium">
                            Assign all enrolled learners to a specific Live Event Session
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Administrators select a session and all learners enrolled in the cohort
                            are automatically registered for that session.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-md border border-border p-3">
                        <RadioGroupItem value="learner" id={`${ev.id}-learner`} className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor={`${ev.id}-learner`} className="font-medium">
                            Allow learners to choose their own Live Event Session
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Learners will see the Event assigned to them but must select and
                            register for a session themselves.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>

                    {(config?.mode ?? "assigned") === "assigned" && (
                      <div className="space-y-2">
                        <Label>
                          Select Session <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup
                          value={config?.sessionId ?? ""}
                          onValueChange={(value) => updateEventConfig(ev.id, { sessionId: value })}
                          className="space-y-2"
                        >
                          {sessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-start gap-3 rounded-md border border-border p-3"
                            >
                              <RadioGroupItem
                                value={session.id}
                                id={`${ev.id}-${session.id}`}
                                className="mt-1"
                              />
                              <div className="space-y-1 min-w-0">
                                <Label htmlFor={`${ev.id}-${session.id}`} className="font-medium">
                                  {session.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {session.dayLabel} · {session.dateLabel} · {session.timeLabel}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {session.facilitatorName} · {session.format} · {session.location} ·{" "}
                                  {session.registered}/{session.capacity} registered
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                    </div>
                  </LeftBorderCard>
                );
              })}
            </>
          )}


          {step === "welcome" && (
            <>
              <p className="text-sm text-muted-foreground">
                Configure the welcome screen learners in this cohort see when they first log in.
              </p>
              <WelcomeScreenFields
                value={welcome}
                onChange={setWelcome}
                cohortName={name}
                startDate={startDate}
                endDate={targetDate}
              />
            </>
          )}

          {step === "review" && (
            <>
              <p className="text-sm text-muted-foreground">
                Review the cohort details before saving. You can go back to make changes.
              </p>

              <div>
                <div className="text-xs tracking-wide text-muted-foreground mb-2">
                  Cohort Details
                </div>
                <dl className="rounded-md border border-border bg-background px-3">
                  <ReviewRow label="Cohort Name" value={name} />
                  <ReviewRow label="Journey" value={journey} />
                  {false && (
                    <ReviewRow
                      label="Line of Business"
                      value={lineOfBusiness.length ? lineOfBusiness.join(", ") : "None"}
                    />
                  )}
                  {false && (
                    <ReviewRow
                      label="Business Leader(s)"
                      value={
                        businessLeaderIds.length
                          ? businessLeaderIds
                              .map((id) => directoryUser(id)?.name)
                              .filter(Boolean)
                              .join(", ")
                          : "None"
                      }
                    />
                  )}
                  {(
                  <div className="flex items-start justify-between gap-4 py-2 border-b border-border">
                    <dt className="text-sm text-muted-foreground">Cohort Manager</dt>
                    <dd className="text-sm text-foreground text-right">
                      {selectedManager ? (
                        <span className="inline-flex items-center gap-2">
                          <Avatar name={selectedManager.name} className="h-6 w-6 text-[10px]" />
                          <span>{selectedManager.name}</span>
                          <Badge>Cohort Owner</Badge>
                        </span>
                      ) : (
                        <span className="text-warning-foreground dark:text-warning">Not assigned</span>
                      )}
                    </dd>
                  </div>
                  )}
                  <ReviewRow
                    label="Start Date"
                    value={startDate ? format(startDate, "PPP") : "—"}
                  />
                  <ReviewRow
                    label="Target Completion"
                    value={targetDate ? format(targetDate, "PPP") : "—"}
                  />
                  <ReviewRow label="Max Cohort Size" value={String(maxSize)} />
                  <ReviewRow label="Description" value={description.trim() || "—"} />
                </dl>
              </div>

              {hasJourneyEvents && (
                <div>
                  <div className="text-xs tracking-wide text-muted-foreground mb-2">
                    Events and Sessions
                  </div>
                  <dl className="rounded-md border border-border bg-background px-3">
                    {journeyEvents.map((ev) => {
                      const config = eventConfigs.find((c) => c.eventId === ev.id);
                      const session = findJourneyLiveEventSession(config?.sessionId);
                      return (
                        <ReviewRow
                          key={ev.id}
                          label={ev.title}
                          value={
                            config?.mode === "learner"
                              ? "Learners choose their own session"
                              : session
                                ? `All learners registered for ${session.name} (${session.dayLabel})`
                                : "No session selected"
                          }
                        />
                      );
                    })}
                  </dl>
                </div>
              )}

              <div>
                <div className="text-xs tracking-wide text-muted-foreground mb-2">
                  Welcome Screen
                </div>
                <dl className="rounded-md border border-border bg-background px-3">
                  <ReviewRow label="Welcome Headline" value={welcome.headline} />
                  <ReviewRow label="CTA Button Label" value={welcome.cta} />
                </dl>
              </div>

              <LeftBorderCard borderVariant="muted">
                <p className="text-sm text-muted-foreground">
                  Once saved, this cohort will appear in your cohort list with status
                  &lsquo;Starting Soon&rsquo;. You can enroll learners at any time after creation.
                </p>
              </LeftBorderCard>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-background">
          {discarding ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Discard unsaved changes?</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setDiscarding(false)}>
                  Keep editing
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setDiscarding(false);
                    onOpenChange(false);
                  }}
                >
                  Yes, discard
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div>
                {step === "details" ? (
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => goToStep(-1)}>
                    ← Back
                  </Button>
                )}
              </div>
              <div>
                {step === "details" && (
                  <Button
                    disabled={!step1OtherValid}
                    onClick={() => {
                      if (!datesValid) {
                        setDatesAttempted(true);
                        return;
                      }
                      goToStep(1);
                    }}
                  >
                    {nextStepKey ? `Next: ${STEP_LABEL[nextStepKey]} →` : "Next →"}
                  </Button>
                )}
                {step === "events" && (
                  <Button disabled={!eventsStepValid} onClick={() => goToStep(1)}>
                    {nextStepKey ? `Next: ${STEP_LABEL[nextStepKey]} →` : "Next →"}
                  </Button>
                )}

                {step === "welcome" && (
                  <Button onClick={() => goToStep(1)}>
                    Next: Review & Save →
                  </Button>
                )}

                {step === "review" && (
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving
                      ? "Saving..."
                      : mode === "edit"
                        ? "Save Changes"
                        : "Save Cohort"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <AlertDialog
        open={promoteCandidateId !== null}
        onOpenChange={(next) => { if (!next) setPromoteCandidateId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote to Primary Trainer?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>This will swap the trainer roles for this cohort:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium text-foreground">
                      {trainerById(promoteCandidateId)?.name}
                    </span>{" "}
                    will become the Primary Trainer
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      {primaryTrainer?.name}
                    </span>{" "}
                    will be moved to Secondary Trainer
                  </li>
                </ul>
                <p>Both trainers will remain assigned to the cohort. Only their roles will change.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="text-xs text-muted-foreground">
            This change applies to the cohort configuration. You can adjust trainer roles again before saving.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const promotedId = promoteCandidateId;
                const oldPrimary = primaryTrainerId;
                if (!promotedId || !oldPrimary) {
                  setPromoteCandidateId(null);
                  return;
                }
                const promotedName = trainerById(promotedId)?.name ?? "Trainer";
                setPrimaryTrainerId(promotedId);
                setSecondaryTrainerIds((prev) =>
                  prev.map((x) => (x === promotedId ? oldPrimary : x)),
                );
                setPromoteCandidateId(null);
                toast.success(`${promotedName} is now the Primary Trainer.`);
              }}
            >
              Confirm Swap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground text-right break-words max-w-[60%]">{value}</dd>
    </div>
  );
}
