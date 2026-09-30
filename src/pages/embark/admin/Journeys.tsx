import { useEffect, useMemo, useState } from "react";
import { TablePagination, TABLE_PAGE_SIZE } from "@/components/embark/TablePagination";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CURRICULA_OPTIONS,
  JOURNEYS,
  LINES_OF_BUSINESS,
  findCurriculum,
  formatDate,
  type Journey,
  type JourneyStatus,
} from "./journeys/data";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import { isVersionedJourney } from "@/data/contentVersioning";

function statusBadge(s: JourneyStatus) {
  if (s === "active") return <Badge variant="success">Active</Badge>;
  if (s === "draft") return <Badge variant="secondary">Draft</Badge>;
  return <Badge variant="warning">Inactive</Badge>;
}

function CurriculaCell({ ids }: { ids: string[] }) {
  const names = ids.map((id) => findCurriculum(id)?.name ?? id);
  const visible = names.slice(0, 2);
  const extra = names.length - visible.length;
  return (
    <div className="min-w-0">
      <div className="font-medium text-foreground">{ids.length}</div>
      <div className="text-xs text-muted-foreground truncate max-w-[280px]">
        {visible.join(", ")}
        {extra > 0 && ` +${extra} more`}
      </div>
    </div>
  );
}

export default function Journeys() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Journey[]>(JOURNEYS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [lob, setLob] = useState<string>("all");
  const [curriculumFilter, setCurriculumFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState<Journey | null>(null);
  const [page, setPage] = useState(1);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((j) => j.status === "active").length;
    const draft = items.filter((j) => j.status === "draft").length;
    const avg =
      items.length === 0
        ? 0
        : items.reduce((sum, j) => sum + j.curriculaIds.length, 0) / items.length;
    return { total, active, draft, avg: Math.round(avg * 10) / 10 };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((j) => {
      if (q && !j.name.toLowerCase().includes(q)) return false;
      if (status !== "all" && j.status !== status) return false;
      if (lob !== "all" && !j.lineOfBusiness.includes(lob as never)) return false;
      if (curriculumFilter !== "all" && !j.curriculaIds.includes(curriculumFilter)) return false;
      return true;
    });
  }, [items, search, status, lob, curriculumFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / TABLE_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const pageRows = filtered.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE,
  );

  const handleDuplicate = (j: Journey) => {
    toast.success("Journey duplicated successfully.");
    const copy: Journey = { ...j, id: `${j.id}-copy-${Date.now()}`, name: `${j.name} (Copy)`, assignedCohorts: 0 };
    setItems((prev) => [...prev, copy]);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setItems((prev) => prev.filter((x) => x.id !== deleting.id));
    toast.error("Journey deleted.");
    setDeleting(null);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Journeys</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage learning journeys. Each journey combines one or more paths into a
              structured end-to-end learning experience.
            </p>
          </div>
          <Button onClick={() => navigate("/admin/journeys/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Create Journey
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatBox label="Total Journeys" value={stats.total} />
          <StatBox label="Active Journeys" value={stats.active} tone="success" />
          <StatBox label="Journeys in Draft" value={stats.draft} tone="muted" />
          <StatBox label="Avg. Paths per Journey" value={stats.avg} />
        </div>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journeys…"
              className="w-64"
            />
            <div className="w-44">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-52">
              <Select value={lob} onValueChange={setLob}>
                <SelectTrigger aria-label="Filter by line of business">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lines of Business</SelectItem>
                  {LINES_OF_BUSINESS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-64">
              <Select value={curriculumFilter} onValueChange={setCurriculumFilter}>
                <SelectTrigger aria-label="Filter by path included">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Path</SelectItem>
                  {CURRICULA_OPTIONS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Journey Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paths</TableHead>
                  <TableHead className="text-right">Assigned Cohorts</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      No journeys match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {pageRows.map((j) => (
                  <TableRow key={j.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-left hover:text-primary"
                          onClick={() => navigate(`/admin/journeys/${j.id}`)}
                        >
                          {j.name}
                        </button>
                        {isVersionedJourney(j.id) && <VersionMarkers scope="journey" />}
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(j.status)}</TableCell>
                    <TableCell><CurriculaCell ids={j.curriculaIds} /></TableCell>
                    <TableCell className="text-right">{j.assignedCohorts}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(j.lastModified)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/admin/journeys/${j.id}/edit`)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label={`More actions for ${j.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDuplicate(j)}>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleting(j)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        </section>
      </PageContainer>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete journey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleting?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "muted";
}) {
  const color =
    tone === "success" ? "text-success-dark" : tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="text-xs tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
