import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Flag, MessageSquare } from "lucide-react";
import { StatTile } from "@/components/embark/StatTile";
import { ActionIconRow } from "@/components/embark/ActionIconRow";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTrainerView } from "@/hooks/use-trainer-view";
import { CohortPrimaryTrainer } from "@/components/embark/CohortPrimaryTrainer";
import { CohortFilterOption } from "@/components/embark/CohortFilterOption";
import {
  TRAINER_LEARNERS,
  TRAINER_COHORTS,
  getTrainerLearnerStats,
  type TrainerLearner,
  type TrainerLearnerStatus,
  type TrainerLearnerReadiness,
} from "@/data/trainerLearners";

const PAGE_SIZE = 10;

type Status = TrainerLearnerStatus;
type Readiness = TrainerLearnerReadiness;

const LEARNERS: TrainerLearner[] = TRAINER_LEARNERS;
const COHORTS = TRAINER_COHORTS;
const STATUSES: Status[] = ["Not started", "In progress", "Completed", "At risk"];
const READINESS: Readiness[] = ["High", "Developing", "Low"];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusBadge(status: Status) {
  switch (status) {
    case "In progress":
      return <Badge>In progress</Badge>;
    case "Completed":
      return <Badge variant="success">Completed</Badge>;
    case "Not started":
      return <Badge variant="warning">Not started</Badge>;
    case "At risk":
      return <Badge variant="destructive">At risk</Badge>;
  }
}

function readinessBadge(readiness: Readiness) {
  switch (readiness) {
    case "High":
      return <Badge variant="outline-success">High</Badge>;
    case "Developing":
      return <Badge variant="outline-warning">Developing</Badge>;
    case "Low":
      return <Badge variant="outline-destructive">Low</Badge>;
  }
}

export default function TrainerLearners() {
  const navigate = useNavigate();
  const { inScope } = useTrainerView();
  const [search, setSearch] = useState("");
  const [cohort, setCohort] = useState("all");
  const [status, setStatus] = useState("all");
  const [readiness, setReadiness] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LEARNERS.filter((l) => {
      if (!inScope(l.cohort)) return false;
      if (q && !l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q)) return false;
      if (cohort !== "all" && l.cohort !== cohort) return false;
      if (status !== "all" && l.status !== status) return false;
      if (readiness !== "all" && l.readiness !== readiness) return false;
      return true;
    });
  }, [search, cohort, status, readiness, inScope]);

  const stats = useMemo(() => getTrainerLearnerStats(inScope), [inScope]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setCohort("all");
    setStatus("all");
    setReadiness("all");
    setPage(1);
  };

  return (
    <PageContainer as="div">
      <div className="py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Learners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All learners across your assigned cohorts. Use the filters to narrow by cohort, status,
            or readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatTile label="Total learners" value={stats.total} subLabel="Across all your cohorts" />
          <StatTile label="On track" value={stats.onTrack} variant="success" subLabel="Progressing as expected" />
          <StatTile
            label="Need attention"
            value={stats.needAttention}
            variant="warning"
            subLabel="At risk or behind schedule"
          />
        </div>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search learners by name or email"
              aria-label="Search learners by name or email"
              className="w-64"
            />
            <Select
              value={cohort}
              onValueChange={(v) => {
                setCohort(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-52" aria-label="Cohort">
                <SelectValue placeholder="All cohorts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cohorts</SelectItem>
                {COHORTS.map((c) => (
                  <SelectItem key={c} value={c}><CohortFilterOption cohort={c} /></SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44" aria-label="Status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={readiness}
              onValueChange={(v) => {
                setReadiness(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-52" aria-label="Readiness">
                <SelectValue placeholder="All readiness levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All readiness levels</SelectItem>
                {READINESS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>

          <div className="rounded-md border border-border">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Progress</TableHead>
                  <TableHead className="whitespace-nowrap">Readiness</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <div className="text-sm font-semibold text-foreground">No learners found</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {pageRows.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/40">
                    <TableCell className="align-middle">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground shrink-0"
                        >
                          {initials(l.name)}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{l.name}</span>
                          <span className="text-xs text-muted-foreground">{l.email}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="align-middle text-sm text-foreground">
                      {l.cohort}
                      <CohortPrimaryTrainer cohort={l.cohort} />
                    </TableCell>
                    <TableCell className="align-middle whitespace-nowrap">{statusBadge(l.status)}</TableCell>
                    <TableCell className="align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Progress value={l.progress} className="h-2 w-full" />
                        <span className="text-xs text-muted-foreground w-9 text-right">
                          {l.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle whitespace-nowrap">{readinessBadge(l.readiness)}</TableCell>
                    <TableCell className="align-middle text-sm text-muted-foreground">{l.lastActive}</TableCell>
                    <TableCell className="align-middle whitespace-nowrap text-right">
                      <div className="flex justify-end">
                        <ActionIconRow
                          actions={[
                            {
                              icon: <User className="h-4 w-4" />,
                              label: "View Profile",
                              onClick: () => navigate(`/trainer/learner/${l.id}`),
                            },
                            {
                              icon: <Flag className="h-4 w-4" />,
                              label: "Raise Flag",
                              onClick: () => toast(`Flag raised for ${l.name}.`),
                            },
                            {
                              icon: <MessageSquare className="h-4 w-4" />,
                              label: "Send Message",
                              onClick: () => toast(`Message sent to ${l.name}.`),
                            },
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
    </PageContainer>
  );
}