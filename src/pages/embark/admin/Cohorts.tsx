import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Archive,
  Pencil,
  Plus,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  MANAGERS,
  SEED_COHORTS,
  initials,
  type Cohort,
  type CohortStatus,
} from "./cohorts/data";
import { CohortFormDialog, type CohortFormValues } from "./cohorts/CohortFormDialog";
import { useEventRegistration } from "@/hooks/use-event-registration";
import { useCohortWelcome } from "@/hooks/use-cohort-welcome";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import { versionScopeForCohort } from "@/data/contentVersioning";

const STATUS_LABEL: Record<CohortStatus, string> = {
  active: "Active",
  starting: "Starting Soon",
  completed: "Completed",
  archived: "Archived",
};

function statusBadge(status: CohortStatus) {
  switch (status) {
    case "active":
      return <Badge variant="success">Active</Badge>;
    case "starting":
      return <Badge variant="warning">Starting Soon</Badge>;
    case "completed":
      return <Badge variant="tertiary">Completed</Badge>;
    case "archived":
      return <Badge variant="secondary">Archived</Badge>;
  }
}

function fmt(d?: string): string {
  if (!d) return "—";
  return format(new Date(d), "d MMM yyyy");
}

function computeStatus(startDate?: Date): CohortStatus {
  if (!startDate) return "starting";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  return s.getTime() > today.getTime() ? "starting" : "active";
}

export default function Cohorts() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<Cohort[]>(SEED_COHORTS);
  const { setConfigs } = useEventRegistration();
  const { saveWelcomeFor } = useCohortWelcome();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialog, setDialog] = useState<
    { open: boolean; mode: "create" | "edit"; cohortId?: string }
  >({ open: false, mode: "create" });
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const visible = cohorts.filter((c) => c.status !== "archived");
    return {
      total: visible.length,
      active: visible.filter((c) => c.status === "active").length,
      starting: visible.filter((c) => c.status === "starting").length,
    };
  }, [cohorts]);

  const filtered = useMemo(() => {
    const list = cohorts.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return [...list].sort((a, b) => {
      const ap = a.status === "archived" ? 1 : 0;
      const bp = b.status === "archived" ? 1 : 0;
      return ap - bp;
    });
  }, [cohorts, search, statusFilter]);

  const editingCohort = dialog.cohortId
    ? cohorts.find((c) => c.id === dialog.cohortId)
    : undefined;

  const handleSubmit = async (values: CohortFormValues) => {
    if (dialog.mode === "edit" && dialog.cohortId) {
      setCohorts((prev) =>
        prev.map((c) =>
          c.id === dialog.cohortId
            ? {
                ...c,
                name: values.name,
                journey: values.journey,
                startDate: values.startDate?.toISOString().slice(0, 10),
                targetDate: values.targetDate?.toISOString().slice(0, 10),
                maxSize: values.maxSize,
                description: values.description || undefined,
                primaryTrainerId: values.primaryTrainerId,
                secondaryTrainerIds: values.secondaryTrainerIds,
                managerId: values.managerId,
                lineOfBusiness: values.lineOfBusiness ?? c.lineOfBusiness,
              }
            : c,
        ),
      );
      setConfigs(dialog.cohortId, values.eventRegistration ?? []);
      if (values.welcome) saveWelcomeFor(dialog.cohortId, values.welcome);
      toast.success("Cohort updated successfully.");
    } else {
      const id = `cohort-${Date.now()}`;
      const status = computeStatus(values.startDate);
      const newCohort: Cohort = {
        id,
        name: values.name,
        journey: values.journey,
        status,
        enrolled: 0,
        primaryTrainerId: values.primaryTrainerId,
        secondaryTrainerIds: values.secondaryTrainerIds,
        managerId: values.managerId,
        lineOfBusiness: values.lineOfBusiness,
        startDate: values.startDate?.toISOString().slice(0, 10),
        targetDate: values.targetDate?.toISOString().slice(0, 10),
        maxSize: values.maxSize,
        description: values.description || undefined,
      };
      setCohorts((prev) => [...prev, newCohort]);
      setConfigs(id, values.eventRegistration ?? []);
      if (values.welcome) saveWelcomeFor(id, values.welcome);
      toast.success(
        `Cohort created successfully — ${values.name} has been added to your cohort list.`,
      );
    }
  };

  const confirmArchive = (c: Cohort) => {
    setCohorts((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, status: "archived" as CohortStatus } : x)),
    );
    toast(`${c.name} has been archived.`);
    setArchivingId(null);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Cohorts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage cohorts across all journeys. Assign trainers before publishing a cohort.
            </p>
          </div>
          <Button onClick={() => setDialog({ open: true, mode: "create" })}>
            <Plus className="mr-1 h-4 w-4" />
            Create Cohort
          </Button>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatBox label="Total cohorts" value={stats.total} sub="Across all journeys" />
          <StatBox label="Active" value={stats.active} sub="Currently in progress" tone="success" />
          <StatBox label="Starting soon" value={stats.starting} sub="Begins within 30 days" tone="warning" />
        </div>

        {/* Table */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">All cohorts</h2>
            <div className="flex items-center gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cohorts..."
                className="w-56"
              />
              <div className="w-44">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger aria-label="Filter by status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="starting">Starting Soon</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort Name</TableHead>
                  <TableHead>Journey</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Target Completion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                      No cohorts match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((c) => {
                  return (
                    <Fragment key={c.id}>
                      <TableRow className="hover:bg-muted/40">
                        <TableCell className="font-medium">
                          <span className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="text-left hover:text-primary"
                              onClick={() => setDialog({ open: true, mode: "edit", cohortId: c.id })}
                            >
                              {c.name}
                            </button>
                            {versionScopeForCohort(c.id) && (
                              <VersionMarkers scope={versionScopeForCohort(c.id)!} />
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.journey}</TableCell>
                        <TableCell>
                          {(() => {
                            const mgr = MANAGERS.find((m) => m.id === c.managerId);
                            if (!mgr) {
                              return <span className="text-warning-foreground dark:text-warning">Unassigned</span>;
                            }
                            return (
                              <span className="inline-flex items-center gap-2">
                                <span
                                  aria-hidden
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground shrink-0"
                                >
                                  {initials(mgr.name)}
                                </span>
                                <span className="text-foreground">{mgr.name}</span>
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell>{statusBadge(c.status)}</TableCell>
                        <TableCell className="text-right">{c.enrolled}</TableCell>
                        <TableCell className="text-muted-foreground">{fmt(c.startDate)}</TableCell>
                        <TableCell className="text-muted-foreground">{fmt(c.targetDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setDialog({ open: true, mode: "edit", cohortId: c.id })
                              }
                              aria-label={`Edit ${c.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => navigate(`/admin/cohorts/${c.id}/enrollment`)}
                              aria-label={`Manage enrollment for ${c.name}`}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setArchivingId(c.id)}
                              disabled={c.status === "archived"}
                              aria-label={`Archive ${c.name}`}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {archivingId === c.id && (
                        <TableRow key={`${c.id}-archive`} className="bg-muted/30">
                          <TableCell colSpan={10}>
                            <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                              <span className="text-sm text-muted-foreground">
                                Are you sure you want to archive {c.name}? Enrolled learners will
                                retain their progress records.
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setArchivingId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => confirmArchive(c)}
                                >
                                  Yes, archive
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>
      </PageContainer>

      <CohortFormDialog
        open={dialog.open}
        onOpenChange={(open) =>
          setDialog((prev) => ({ ...prev, open, cohortId: open ? prev.cohortId : undefined }))
        }
        mode={dialog.mode}
        initial={editingCohort}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function StatBox({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone?: "success" | "warning";
}) {
  const color =
    tone === "success" ? "text-success-dark" : tone === "warning" ? "text-warning-foreground dark:text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="text-xs tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
