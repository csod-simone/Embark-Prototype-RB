import { useState } from "react";
import { GlobalHeader } from "@/components/embark/GlobalHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LearnerSurface } from "@/components/embark/layouts/LearnerSurface";

type Channel = "in_app" | "email";
const CHANNEL_OPTIONS: Array<{ value: Channel; label: string }> = [
  { value: "in_app", label: "In-app" },
  { value: "email", label: "Email" },
];

const CHANNEL_ROWS: Array<{ key: string; label: string }> = [
  { key: "journey", label: "Journey & module updates" },
  { key: "session", label: "Session reminders" },
  { key: "assessment", label: "Assessment results" },
  { key: "help", label: "Help request responses" },
  { key: "event", label: "Event reminders" },
  { key: "coaching", label: "Coaching & upskilling assignments" },
  { key: "readiness", label: "Readiness milestones" },
];

const MANDATORY_TYPES: Array<{ key: string; title: string; description: string }> = [
  { key: "enrollment", title: "Enrollment confirmation", description: "Sent when you are enrolled in a cohort" },
  { key: "assessment_result", title: "Assessment result", description: "Sent immediately after you submit a module assessment" },
  { key: "at_risk", title: "At-risk support prompt", description: "Sent when your status is flagged — includes guidance and a prompt to raise a help request" },
  { key: "journey_completion", title: "Journey completion", description: "Sent when you complete all required modules and events in your journey" },
];

const OPTIONAL_TYPES: Array<{ key: string; title: string; description: string }> = [
  { key: "journey_start", title: "Journey start reminder", description: "Reminder sent 24 hours before your journey start date" },
  { key: "session_reminder", title: "Session reminder", description: "Sent when a scheduled session hasn't been started by its expected time" },
  { key: "module_unlocked", title: "Module unlocked", description: "Sent when you pass a mastery gate and the next module becomes available" },
  { key: "assessment_retake", title: "Assessment failure — retake available", description: "Sent when you fail a module assessment and a retake is available" },
  { key: "gap_micro", title: "Gap microlearning assigned", description: "Sent when the system assigns targeted microlearning after an assessment or knowledge check" },
  { key: "help_responded", title: "Help request responded to", description: "Sent when your manager or trainer responds to a help request" },
  { key: "event_reminder", title: "Event reminder", description: "Reminder sent 48 hours and 1 hour before a registered event" },
  { key: "event_changed", title: "Event cancelled or rescheduled", description: "Sent when an event in your journey is cancelled or its time changes" },
  { key: "coaching_assigned", title: "Coaching or upskilling assignment received", description: "Sent when a coaching or upskilling journey is assigned to you" },
  { key: "readiness_milestone", title: "Readiness milestone reached", description: "Sent when your readiness score crosses a band threshold upward" },
];

type Frequency = "every" | "daily" | "weekly";

export default function Settings() {
  const notify = () => toast.success("Settings saved successfully.");

  const [channels, setChannels] = useState<Record<string, Channel>>(
    () => Object.fromEntries(CHANNEL_ROWS.map((r) => [r.key, "in_app"])) as Record<string, Channel>,
  );
  const [optionalOn, setOptionalOn] = useState<Record<string, boolean>>(
    () => Object.fromEntries(OPTIONAL_TYPES.map((t) => [t.key, true])),
  );
  const [frequency, setFrequency] = useState<Frequency>("every");
  const [leadTime48, setLeadTime48] = useState(true);
  const [leadTime1, setLeadTime1] = useState(true);

  const setChannel = (key: string, value: Channel) => {
    setChannels((p) => ({ ...p, [key]: value }));
    notify();
  };
  const setOptional = (key: string, value: boolean) => {
    setOptionalOn((p) => ({ ...p, [key]: value }));
    notify();
  };

  return (
    <LearnerSurface header={<GlobalHeader title="Profile settings" />}>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <PageContainer as="div" className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <p className="text-xs text-muted-foreground">
                Choose how and when you receive notifications. Mandatory notifications are always
                delivered and cannot be turned off — but you can adjust the channel they are sent
                to.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group 1 */}
              <section className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Default Delivery Channels</h4>
                  <p className="text-xs text-muted-foreground">
                    Set your preferred channel for each notification type. Your admin controls
                    which channels are available. Channels not enabled for your organisation are
                    not shown.
                  </p>
                </div>
                <div className="space-y-2">
                  {CHANNEL_ROWS.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between gap-4 py-1.5"
                    >
                      <label
                        htmlFor={`channel-${row.key}`}
                        className="text-sm font-medium text-foreground"
                      >
                        {row.label}
                      </label>
                      <Select
                        value={channels[row.key]}
                        onValueChange={(v) => setChannel(row.key, v as Channel)}
                      >
                        <SelectTrigger id={`channel-${row.key}`} className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CHANNEL_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mandatory notifications (such as at-risk support prompts and journey completion
                  confirmations) use your default channel and cannot be turned off.
                </p>
              </section>

              <Separator />

              {/* Group 2 */}
              <section className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Notification Types</h4>
                  <p className="text-xs text-muted-foreground">
                    Turn optional notifications on or off. Mandatory notifications are locked and
                    always delivered.
                  </p>
                </div>

                <ul className="divide-y divide-border">
                  {MANDATORY_TYPES.map((t) => (
                    <li key={t.key} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{t.title}</span>
                          <Badge variant="secondary" className="text-[10px] tracking-wide">
                            Required
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                      </div>
                      <Switch checked disabled aria-label={`${t.title} (required)`} />
                    </li>
                  ))}

                  {OPTIONAL_TYPES.map((t) => (
                    <li key={t.key} className="py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-foreground">{t.title}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                        </div>
                        <Switch
                          checked={optionalOn[t.key]}
                          onCheckedChange={(v) => setOptional(t.key, v)}
                          aria-label={t.title}
                        />
                      </div>

                      {t.key === "session_reminder" && optionalOn.session_reminder && (
                        <div className="mt-3 ml-0 pl-4 border-l border-border space-y-2">
                          <label
                            htmlFor="reminder-frequency"
                            className="text-xs font-medium text-foreground"
                          >
                            Reminder frequency
                          </label>
                          <Select
                            value={frequency}
                            onValueChange={(v) => {
                              setFrequency(v as Frequency);
                              notify();
                            }}
                          >
                            <SelectTrigger id="reminder-frequency" className="w-[240px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="every">Every missed session</SelectItem>
                              <SelectItem value="daily">Once per day maximum</SelectItem>
                              <SelectItem value="weekly">Once per week maximum</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Controls how often session reminder notifications are sent if sessions
                            remain incomplete.
                          </p>
                        </div>
                      )}

                      {t.key === "event_reminder" && optionalOn.event_reminder && (
                        <div className="mt-3 pl-4 border-l border-border space-y-2">
                          <span className="block text-xs font-medium text-foreground">
                            Remind me
                          </span>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-foreground">
                              <Checkbox
                                checked={leadTime48}
                                onCheckedChange={(v) => {
                                  setLeadTime48(!!v);
                                  notify();
                                }}
                              />
                              48 hours before
                            </label>
                            <label className="flex items-center gap-2 text-sm text-foreground">
                              <Checkbox
                                checked={leadTime1}
                                onCheckedChange={(v) => {
                                  setLeadTime1(!!v);
                                  notify();
                                }}
                              />
                              1 hour before
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            You can receive reminders at both times, or choose just one.
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground">
                  You can adjust which channel each notification is delivered to using the channel
                  settings above.
                </p>
              </section>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    </LearnerSurface>
  );
}
