import { useEffect, useMemo, useState } from "react";
import { TablePagination, TABLE_PAGE_SIZE } from "@/components/embark/TablePagination";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, MoreHorizontal, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { curricula } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionHistoryDialog, VersionInfoButton } from "@/components/embark/admin/ContentVersionDetails";
import { VERSIONED_PATH_ID, isVersionedPath } from "@/data/contentVersioning";


const statusPill = (s: string) => {
  if (s === "published") return { text: "Published", cls: "bg-success-dark/15 text-success-dark" };
  if (s === "draft") return { text: "Draft", cls: "bg-muted text-muted-foreground" };
  return { text: "Under Review", cls: "bg-warning/15 text-warning-foreground dark:text-warning" };
};

export default function Curricula() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historyFor, setHistoryFor] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: curricula.length,
      published: curricula.filter((c) => c.status === "published").length,
      underReview: curricula.filter((c) => c.status === "under_review").length,
      draft: curricula.filter((c) => c.status === "draft").length,
    }),
    [],
  );

  const rows = useMemo(
    () =>
      curricula.filter((c) => {
        if (!c.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        return true;
      }),
    [q, statusFilter],
  );

  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / TABLE_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  useEffect(() => {
    setPage(1);
  }, [q, statusFilter]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const pageRows = rows.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE,
  );

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Paths</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage paths. Each path groups the content, assessments and activities
              that make up part of a journey.
            </p>
          </div>
          <Button onClick={() => navigate(`/admin/builder/new/ingest`)}>
            <Plus className="mr-1 h-4 w-4" />
            New Path
          </Button>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatBox label="Total Paths" value={stats.total} />
          <StatBox label="Published" value={stats.published} tone="success" />
          <StatBox label="Under Review" value={stats.underReview} />
          <StatBox label="Draft" value={stats.draft} tone="muted" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search paths..."
            className="w-64"
          />
          <div className="w-44">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>




        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Last Updated</th>
                <th className="text-left p-3">Version</th>
                <th className="text-left p-3">Enrolled</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((c) => {
                const s = statusPill(c.status);
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/20">
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/builder/${c.id}/refine`)}
                        className="font-medium text-foreground hover:text-primary text-left"
                      >
                        {c.name}
                      </button>
                    </td>
                    <td className="p-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", s.cls)}>
                        {c.status === "under_review" && <AlertTriangle className="h-3 w-3" />}
                        {s.text}
                      </span>
                    </td>
                    
                    <td className="p-3 text-muted-foreground">{c.lastUpdated}</td>
                    <td className="p-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {c.version}
                        {isVersionedPath(c.id) && <VersionInfoButton scope="path" />}
                      </span>
                    </td>
                    <td className={cn("p-3", c.enrolledLearners === 0 ? "text-muted-foreground" : "text-foreground")}>{c.enrolledLearners} learners</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant={c.status === "under_review" ? "default" : c.status === "draft" ? "default" : "secondary"}
                          onClick={() => navigate(`/admin/builder/${c.id}/${c.status === "under_review" ? "refine" : "ingest"}`)}
                        >
                          {c.status === "under_review" ? "Review" : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/admin/builder/${c.id}/ingest?duplicate=1`)}
                        >
                          Duplicate
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {c.status === "published" ? (
                              <>
                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setHistoryFor(c.id)}>Version history</DropdownMenuItem>
                                <DropdownMenuItem>View analytics</DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </PageContainer>

      <VersionHistoryDialog
        scope="path"
        open={historyFor === VERSIONED_PATH_ID}
        onOpenChange={(open) => {
          if (!open) setHistoryFor(null);
        }}
      />
      <Sheet open={historyFor !== null && historyFor !== VERSIONED_PATH_ID} onOpenChange={(open) => { if (!open) setHistoryFor(null); }}>
        <SheetContent side="right" className="w-[360px] p-6">
          <VisuallyHidden><h2>Version History</h2></VisuallyHidden>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-base font-semibold">Version History</h3>
              <p className="text-xs text-muted-foreground">Aetna CSR Onboarding — Week Path</p>
            </div>
            <button onClick={() => setHistoryFor(null)} aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { v: "v1.2", meta: "Published Jul 18, 2026 by Admin User", enrolled: "47 enrolled", current: true },
              { v: "v1.1", meta: "Published Jul 10, 2026 by Admin User", enrolled: "12 enrolled" },
              { v: "v1.0", meta: "Published Jul 1, 2026 by Admin User", enrolled: "0 enrolled" },
            ].map((v) => (
              <div key={v.v} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{v.v}</span>
                  {v.current && <span className="rounded-full bg-success-dark/15 text-success-dark text-[10px] font-semibold px-2 py-0.5">Current</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{v.meta}</p>
                <p className="text-xs text-muted-foreground">{v.enrolled}</p>
              </div>
            ))}
          </div>
          <p className="text-xs italic text-muted-foreground mt-6">
            Rollback is managed by your administrator. Contact support to request a rollback. Version history is read-only.
          </p>
        </SheetContent>
      </Sheet>

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
    <div className="rounded-2xl border border-border bg-card shadow-sm p-4">
      <div className="text-xs tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}


