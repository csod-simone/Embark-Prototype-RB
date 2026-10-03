import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus, ArrowLeft } from "lucide-react";
import { StatTile } from "@/components/embark/StatTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SEED_COHORTS, initials } from "./data";
import { learnersForCohort, type LearnerRow, type LearnerStatus } from "./enrollmentData";
import { AddLearnerDialog } from "./AddLearnerDialog";
import { RemoveLearnerDialog } from "./RemoveLearnerDialog";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import { assignmentForLearner, currentContentVersion, versionScopeForCohort } from "@/data/contentVersioning";

const PAGE_SIZE = 10;

function statusBadge(status: LearnerStatus) {
  switch (status) {
    case "in_progress":
      return <Badge>In Progress</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "not_started":
      return <Badge variant="warning">Not Started</Badge>;
  }
}

export default function Enrollment() {
  const { cohortId } = useParams<{ cohortId: string }>();
  const navigate = useNavigate();
  const cohort = SEED_COHORTS.find((c) => c.id === cohortId);
  const name = cohort?.name ?? "Cohort";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState<LearnerRow | null>(null);

  const enrolled = useMemo(() => learnersForCohort(cohortId), [cohortId]);
  const versionScope = versionScopeForCohort(cohortId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enrolled;
    return enrolled.filter(
      (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q),
    );
  }, [enrolled, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const enrolledCount = enrolled.length;

  return (
    <PageContainer as="div">
      <div className="py-6 space-y-8">
        {/* Heading */}
        <div>
          <Button
            variant="secondary"
            className="mb-2"
            onClick={() => navigate("/admin/cohorts")}
          >
            <ArrowLeft aria-hidden="true" />
            Back to Cohort Management
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Manage Enrollment</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add or remove learners from this cohort, and review current enrollment status.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{name}</Badge>
            {cohort?.journey && <Badge variant="secondary">{cohort.journey}</Badge>}
            {cohort?.status === "active" && <Badge variant="success">Active</Badge>}
            {cohort?.status === "starting" && <Badge variant="warning">Starting Soon</Badge>}
            {cohort?.status === "completed" && <Badge variant="tertiary">Completed</Badge>}
            {cohort?.status === "archived" && <Badge variant="secondary">Archived</Badge>}
            <span className="text-xs text-muted-foreground ml-1">
              {enrolledCount} learners enrolled
            </span>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatTile label="Total Enrolled" value={enrolledCount} subLabel="Active learners in this cohort" className="rounded-2xl shadow-sm" />
          <StatTile label="In Progress" value={enrolled.filter((l) => l.status === "in_progress").length} subLabel="Currently working through the journey" className="rounded-2xl shadow-sm" />
          <StatTile
            label="Completed"
            value={enrolled.filter((l) => l.status === "completed").length}
            variant="success"
            subLabel="Have finished the full programme"
            className="rounded-2xl shadow-sm"
          />
          <StatTile
            label="Not Started"
            value={enrolled.filter((l) => l.status === "not_started").length}
            variant="warning"
            subLabel="Enrolled but yet to begin"
            className="rounded-2xl shadow-sm"
          />
        </div>

        {/* Enrolled learners */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Enrolled Learners</h2>
              {versionScope && (
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Suitability file standards version for each learner. Learners are not shown this.
                  </p>
                  <VersionMarkers scope={versionScope} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search learners…"
                className="w-56"
              />
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Learner
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  {versionScope && <TableHead>Content version</TableHead>}
                  <TableHead>Progress</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={versionScope ? 7 : 6} className="text-center text-sm text-muted-foreground">
                      No learners match your search.
                    </TableCell>
                  </TableRow>
                )}
                {pageRows.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/40">
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground shrink-0"
                        >
                          {initials(l.name)}
                        </span>
                        <span className="text-sm font-medium text-foreground">{l.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.email}</TableCell>
                    <TableCell>{statusBadge(l.status)}</TableCell>
                    {versionScope && (
                      <TableCell>
                        {(() => {
                          const assignment = assignmentForLearner(l.id);
                          if (!assignment) return <span className="text-muted-foreground">—</span>;
                          return (
                            <div>
                              <Badge variant={assignment.versionId === currentContentVersion().id ? "success" : "secondary"}>
                                {assignment.versionId}
                              </Badge>
                              <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">{assignment.reason}</p>
                            </div>
                          );
                        })()}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={l.progress} className="h-2 w-[120px]" />
                        <span className="text-xs text-muted-foreground w-9 text-right">
                          {l.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(l.enrolledDate), "d MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/learner/${l.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setRemoving(l)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              Showing {pageRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              –{(currentPage - 1) * PAGE_SIZE + pageRows.length} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AddLearnerDialog open={addOpen} onOpenChange={setAddOpen} />
      <RemoveLearnerDialog
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(null)}
        learnerName={removing?.name ?? ""}
      />
    </PageContainer>
  );
}
