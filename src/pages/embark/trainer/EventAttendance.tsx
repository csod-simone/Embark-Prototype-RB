import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TabBar } from "@/components/embark/TabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trainerEvents } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type Status = "Attended" | "Absent" | "Partial" | null;
type Unit = "percentage" | "hours";
type Row = {
  id: string;
  name: string;
  status: Status;
  notes: string;
  durationValue: string;
  durationUnit: Unit;
  durationError: string | null;
};

const initialRows = (roster: typeof trainerEvents[number]["roster"]): Row[] => ([
  { id: "l1", name: "Jordan Kim", status: "Attended", notes: "", durationValue: "", durationUnit: "percentage", durationError: null },
  { id: "l2", name: "Priya Sharma", status: "Attended", notes: "", durationValue: "", durationUnit: "percentage", durationError: null },
  { id: "l3", name: "Marcus Webb", status: "Absent", notes: "Did not attend — notified by manager", durationValue: "", durationUnit: "percentage", durationError: null },
  { id: "l4", name: "Elena Torres", status: "Attended", notes: "", durationValue: "", durationUnit: "percentage", durationError: null },
  { id: "l6", name: "Lily Zhang", status: "Attended", notes: "", durationValue: "", durationUnit: "percentage", durationError: null },
] as Row[]).filter((r) => roster.some((x) => x.id === r.id));

const pillClass = (status: Status, kind: Exclude<Status, null>) => {
  if (status === kind) {
    return kind === "Attended" ? "bg-success text-success-foreground border-success-dark"
      : kind === "Absent" ? "bg-destructive text-destructive-foreground border-destructive"
      : "bg-warning text-warning-foreground border-warning";
  }
  return "bg-background text-muted-foreground border-border hover:bg-muted";
};

const validateDuration = (value: string, unit: Unit): string | null => {
  const raw = value.trim();
  if (!raw) return "Please enter a participation duration.";
  const num = Number(raw);
  if (!/^\d*\.?\d+$/.test(raw) || Number.isNaN(num)) return "Please enter a valid number.";
  if (num < 0) return "Please enter a valid number.";
  if (num === 0) return "Duration must be greater than zero.";
  if (unit === "percentage" && num > 100) return "Percentage cannot exceed 100.";
  return null;
};

export default function EventAttendance() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const event = trainerEvents.find((e) => e.id === eventId) ?? trainerEvents[0];
  const [rows, setRows] = useState<Row[]>(() => initialRows(event.roster));
  const [submitted, setSubmitted] = useState(false);
  const [confirmBulkAbsent, setConfirmBulkAbsent] = useState(false);
  const [confirmMissing, setConfirmMissing] = useState(false);

  const counts = useMemo(() => ({
    attended: rows.filter((r) => r.status === "Attended").length,
    absent: rows.filter((r) => r.status === "Absent").length,
    partial: rows.filter((r) => r.status === "Partial").length,
    none: rows.filter((r) => r.status === null).length,
  }), [rows]);

  const setStatus = (id: string, s: Status) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: s, durationValue: "", durationUnit: "percentage", durationError: null }
          : r,
      ),
    );
  const setNotes = (id: string, notes: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, notes } : r)));

  const setDurationValue = (id: string, durationValue: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, durationValue, durationError: null } : r)));
  const setDurationUnit = (id: string, durationUnit: Unit) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, durationUnit, durationError: null } : r)));

  const markAll = (s: Status) =>
    setRows((prev) =>
      prev.map((r) => ({ ...r, status: s, durationValue: "", durationUnit: "percentage" as Unit, durationError: null })),
    );

  const trySubmit = () => {
    let hasError = false;
    setRows((prev) =>
      prev.map((r) => {
        if (r.status !== "Partial") return { ...r, durationError: null };
        const durationError = validateDuration(r.durationValue, r.durationUnit);
        if (durationError) hasError = true;
        return { ...r, durationError };
      }),
    );
    if (rows.some((r) => r.status === "Partial" && validateDuration(r.durationValue, r.durationUnit))) return;
    if (hasError) return;
    if (counts.none > 0) setConfirmMissing(true);
    else setSubmitted(true);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-4 pb-24">
        <p className="text-sm text-muted-foreground">Attendance — Jul 24, 2026 · Event in progress</p>

        <TabBar
          tabs={[
            { id: "roster", label: "Roster" },
            { id: "attendance", label: "Attendance" },
          ]}
          activeTab="attendance"
          onTabChange={(id) => id === "roster" && navigate(`/trainer/events/${event.id}/roster`)}
        />

        {!submitted && (
          <div className="flex flex-wrap items-center gap-3 py-3 border-b border-border">
            <Button variant="secondary" size="sm" onClick={() => markAll("Attended")}>Mark all as Attended</Button>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmBulkAbsent(true)}
            >
              Mark all as Absent
            </Button>
            {confirmBulkAbsent && (
              <span className="inline-flex items-center gap-2 text-sm ml-2">
                Set all {rows.length} learners to Absent?
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { markAll("Absent"); setConfirmBulkAbsent(false); }}
                >
                  Confirm
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setConfirmBulkAbsent(false)}>Cancel</Button>
              </span>
            )}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-medium text-foreground">{r.name}</td>
                  <td className="p-3">
                    <div className="inline-flex rounded-md overflow-hidden gap-1">
                      {(["Attended", "Absent", "Partial"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={submitted}
                          onClick={() => setStatus(r.id, s)}
                          className={cn(
                            "min-h-11 min-w-[88px] px-3 text-xs font-medium rounded-md border transition-colors",
                            pillClass(r.status, s),
                            submitted && "cursor-default",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {r.status === "Partial" && (
                      <div className="mt-2">
                        {submitted ? (
                          <span className="text-sm text-muted-foreground">
                            {r.durationValue}
                            {r.durationUnit === "percentage" ? "% of session" : " hours"}
                          </span>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Input
                                inputMode="decimal"
                                value={r.durationValue}
                                onChange={(e) => setDurationValue(r.id, e.target.value)}
                                placeholder="0"
                                aria-label={`Participation duration for ${r.name}`}
                                className="w-16 h-9"
                              />
                              <Select
                                value={r.durationUnit}
                                onValueChange={(v) => setDurationUnit(r.id, v as Unit)}
                              >
                                <SelectTrigger className="w-[130px] h-9" aria-label={`Duration unit for ${r.name}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="hours">Hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {r.durationError && (
                              <p className="mt-1 text-xs text-destructive">{r.durationError}</p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {submitted ? (
                      <span className="text-sm text-muted-foreground">{r.notes || "—"}</span>
                    ) : (
                      <Input
                        value={r.notes}
                        onChange={(e) => setNotes(r.id, e.target.value)}
                        placeholder="Optional notes..."
                        className="w-[200px]"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {submitted && (
          <div className="text-xs text-muted-foreground italic">
            Need to make a change? Edits are available for 2 hours after submission. After that, contact your administrator.{" "}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-secondary-foreground hover:underline not-italic"
            >
              Edit attendance
            </button>
          </div>
        )}
      </PageContainer>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border bg-background px-6 py-3">
        {confirmMissing && !submitted && (
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>1 learner has no attendance status recorded. Submit anyway?</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { setSubmitted(true); setConfirmMissing(false); }}>Submit anyway</Button>
              <Button size="sm" variant="secondary" onClick={() => setConfirmMissing(false)}>Go back</Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          {submitted ? (
            <span className="text-sm text-success-dark">✅ Attendance submitted at 12:34 PM · {counts.attended} attended, {counts.absent} absent</span>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                {counts.attended} attended · {counts.absent} absent · {counts.partial} partial
              </span>
              <Button onClick={trySubmit}>Submit Attendance</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
