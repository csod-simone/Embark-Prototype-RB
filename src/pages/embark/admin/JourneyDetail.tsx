import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  findCurriculum,
  findJourney,
  formatDate,
  type JourneyStatus,
} from "./journeys/data";
import { SEED_COHORTS } from "./cohorts/data";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import { VERSIONED_PATH_ID, isVersionedJourney, versionScopeForCohort } from "@/data/contentVersioning";

function statusBadge(s: JourneyStatus) {
  if (s === "active") return <Badge variant="success">Active</Badge>;
  if (s === "draft") return <Badge variant="secondary">Draft</Badge>;
  return <Badge variant="warning">Inactive</Badge>;
}

function cohortStatusBadge(s: "active" | "starting" | "completed" | "archived") {
  if (s === "active") return <Badge variant="success">Active</Badge>;
  if (s === "starting") return <Badge variant="warning">Starting Soon</Badge>;
  if (s === "completed") return <Badge variant="tertiary">Completed</Badge>;
  return <Badge variant="secondary">Archived</Badge>;
}

export default function JourneyDetail() {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const journey = journeyId ? findJourney(journeyId) : undefined;
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!journey) return <Navigate to="/admin/journeys" replace />;

  const cohorts = SEED_COHORTS.filter((c) => c.journey === journey.name).map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    learners: c.enrolled,
    assignedDate: c.startDate ?? "2026-07-14",
  }));
  const learnerCount = cohorts.reduce((sum, c) => sum + c.learners, 0);

  const settings = journey.settings;
  const summary = [
    { label: "Paths in Journey", value: journey.curriculaIds.length },
    { label: "Assigned Cohorts", value: journey.assignedCohorts },
    { label: "Active Learners", value: learnerCount },
    { label: "Avg. Completion Rate", value: "68%" },
  ];

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/admin/journeys">Admin</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/admin/journeys">Journeys</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{journey.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{journey.name}</h1>
              {statusBadge(journey.status)}
              {isVersionedJourney(journey.id) && <VersionMarkers scope="journey" />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{journey.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/admin/journeys/${journey.id}/edit`)}>Edit Journey</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success("Journey duplicated successfully.")}>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {summary.map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-background p-4">
              <div className="text-xs tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Paths</h2>
          <div className="space-y-2">
            {journey.curriculaIds.map((id, idx) => {
              const c = findCurriculum(id);
              if (!c) return null;
              return (
                <div key={id} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                  <span className="text-xs text-muted-foreground w-6 text-center shrink-0">{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                      {c.status === "active" ? <Badge variant="success">Active</Badge> : c.status === "draft" ? <Badge variant="secondary">Draft</Badge> : <Badge variant="warning">Inactive</Badge>}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {c.contentCount} content items · {c.estimatedDuration}
                    </div>
                    {id === VERSIONED_PATH_ID && (
                      <div className="mt-2">
                        <VersionMarkers scope="path" />
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate("/admin/curricula")}>View Path</Button>
                </div>
              );
            })}
          </div>
        </Card>

        {journey.liveEvents && journey.liveEvents.length > 0 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Live Events</h2>
            <div className="space-y-2">
              {journey.liveEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">{ev.title}</span>
                      <Badge variant="secondary">Live Event</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {ev.dateLabel} · {ev.timeLabel} · {ev.format} · {ev.location} · {ev.facilitatorName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}



        <Card className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Journey Settings</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <Row
              label="Completion Rule"
              value={
                settings.completionRule === "all"
                  ? "Complete all paths"
                  : `Complete a minimum of ${settings.minimumCurricula ?? "—"} paths`
              }
            />
            <Row label="Path Progression" value={settings.progression === "sequential" ? "Sequential" : "Open"} />
            <Row label="Journey Duration" value={settings.durationDays ? `${settings.durationDays} days` : "No time limit"} />
            <Row label="Allow Learners to Restart Completed Paths" value={settings.allowRestart ? "Yes" : "No"} />
            <Row label="Award Completion Certificate" value={settings.awardCertificate ? "Yes" : "No"} />
            <Row label="Send Completion Notification to Admin" value={settings.notifyAdmin ? "Yes" : "No"} />
            <Row
              label="Line of Business"
              value={
                journey.lineOfBusiness.length ? (
                  <div className="flex flex-wrap gap-1">
                    {journey.lineOfBusiness.map((l) => (
                      <Badge key={l} variant="outline">{l}</Badge>
                    ))}
                  </div>
                ) : "—"
              }
            />
            <Row
              label="Tags"
              value={
                journey.tags.length ? (
                  <div className="flex flex-wrap gap-1">
                    {journey.tags.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                ) : "—"
              }
            />
          </dl>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Assigned Cohorts</h2>
          {cohorts.length === 0 ? (
            <p className="text-sm text-muted-foreground">This journey has not been assigned to any cohorts yet.</p>
          ) : (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cohort Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Learners</TableHead>
                    <TableHead>Assigned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohorts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-2">
                          {c.name}
                          {versionScopeForCohort(c.id) && (
                            <VersionMarkers scope={versionScopeForCohort(c.id)!} />
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{cohortStatusBadge(c.status)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{c.learners} learners</TableCell>
                      <TableCell className="text-muted-foreground">Assigned {formatDate(c.assignedDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </PageContainer>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete journey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {journey.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.error("Journey deleted.");
                navigate("/admin/journeys");
              }}
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
