import { CheckCircle2, Circle, Clock, GraduationCap, Hand, Lock, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type HistoryData = {
  status: "in-progress" | "complete";
  statusLabel: string;
  progressPct: number;
  modules: {
    name: string;
    status: "complete" | "in-progress" | "not-started";
    date?: string;
  }[];
  assessments: {
    name: string;
    module: string;
    date: string;
    score: number;
    passed: boolean;
  }[];
  assessmentFooter?: string;
  completedContent: {
    type: "Article" | "Resource";
    title: string;
    module: string;
    date: string;
  }[];
  conversations: {
    date: string;
    module: string;
    question: string;
    response: string;
  }[];
  totalConversations: number;
  showMoreCount: number;
  handsRaised: {
    date: string;
    module: string;
    topic: string;
    note: string;
    status: "pending" | "resolved";
    managerResponse?: string;
  }[];
  milestones: {
    label: string;
    subLabel: string;
    earned: boolean;
    journey?: boolean;
  }[];
};

function scoreClass(score: number) {
  if (score >= 80) return "text-success-dark";
  if (score >= 65) return "text-warning-foreground dark:text-warning";
  return "text-destructive";
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-foreground">{children}</h3>;
}

export function HistoryView({
  data,
  journeyName = "Medicare CSR Onboarding",
}: {
  data: HistoryData;
  journeyName?: string;
}) {
  const isComplete = data.status === "complete";
  return (
    <div className="w-full py-8 space-y-10">
      <p className="text-sm text-muted-foreground -mt-4">
        A record of everything you've completed, every question you've asked, and every milestone you've reached on your learning journey.
      </p>

      {/* Section: Milestones — surfaced first as the headline metrics */}
      <section className="space-y-4">
        <SectionHeading>Milestones</SectionHeading>
        <div className="flex flex-wrap gap-4">
          {data.milestones.map((m) => {
            const Icon = m.earned ? (m.journey ? GraduationCap : Trophy) : Lock;
            return (
              <Card
                key={m.label}
                className={cn(
                  "flex-1 min-w-[140px] p-4 flex flex-col items-center gap-2 text-center",
                  !m.earned && "opacity-70",
                )}
              >
                <Icon
                  size={32}
                  className={m.earned ? "text-success-dark" : "text-muted-foreground"}
                  aria-hidden
                />
                <span className={cn("text-sm font-medium", m.earned ? "text-foreground" : "text-muted-foreground")}>
                  {m.label}
                </span>
                <span className="text-xs text-muted-foreground">{m.subLabel}</span>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 1: Journey Progress */}
      <section className="space-y-4">
        <SectionHeading>Journey Progress</SectionHeading>
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{journeyName}</span>
              <Badge
                className={cn(
                  "text-xs",
                  isComplete
                    ? "bg-success text-success-foreground hover:bg-success"
                    : "bg-primary text-primary-foreground hover:bg-primary",
                )}
              >
                {data.statusLabel}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{data.progressPct}% complete</span>
          </div>
          <Progress
            value={data.progressPct}
            className={cn(isComplete && "[&>div]:bg-success")}
          />
          <ul className="divide-y divide-border border-t border-border">
            {data.modules.map((m) => (
              <li key={m.name} className="flex items-center gap-3 py-3">
                {m.status === "complete" && <CheckCircle2 size={18} className="text-success-dark shrink-0" aria-hidden />}
                {m.status === "in-progress" && <Clock size={18} className="text-primary shrink-0" aria-hidden />}
                {m.status === "not-started" && <Circle size={18} className="text-muted-foreground shrink-0" aria-hidden />}
                <span className={cn("text-sm flex-1", m.status === "not-started" ? "text-muted-foreground" : "text-foreground")}>
                  {m.name}
                </span>
                <span
                  className={cn(
                    "text-sm text-right",
                    m.status === "in-progress" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {m.status === "complete" ? m.date : m.status === "in-progress" ? "In progress" : "—"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Section 2: Assessment History */}
      <section className="space-y-4">
        <SectionHeading>Assessment History</SectionHeading>
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.assessments.map((a) => (
                <TableRow key={a.name}>
                  <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.module}</TableCell>
                  <TableCell className="text-muted-foreground">{a.date}</TableCell>
                  <TableCell className={cn("font-semibold", scoreClass(a.score))}>{a.score}%</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs",
                        a.passed
                          ? "bg-success text-success-foreground hover:bg-success"
                          : "bg-destructive text-destructive-foreground hover:bg-destructive",
                      )}
                    >
                      {a.passed ? "✓ Passed" : "✗ Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.assessmentFooter && (
            <p className="text-xs italic text-muted-foreground p-4">{data.assessmentFooter}</p>
          )}
        </Card>
      </section>

      {/* Section 3: Completed Content */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeading>Completed Content</SectionHeading>
          <Badge variant="secondary" className="text-xs">{data.completedContent.length} items completed</Badge>
        </div>
        <Card className="divide-y divide-border">
          {data.completedContent.map((c) => (
            <div key={c.title} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Badge
                  className={cn(
                    "text-[11px]",
                    c.type === "Article"
                      ? "bg-primary text-primary-foreground hover:bg-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted",
                  )}
                >
                  {c.type}
                </Badge>
                <span className="text-sm font-medium text-foreground truncate">{c.title}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm text-muted-foreground hidden sm:inline">{c.module}</span>
                <span className="text-sm text-muted-foreground">{c.date}</span>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Section: Hands Raised with My Manager */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <SectionHeading>Hands Raised with My Manager</SectionHeading>
            <p className="text-sm text-muted-foreground">
              Moments you flagged for your manager and how they were followed up
            </p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">{data.handsRaised.length} raised</Badge>
        </div>
        <div className="space-y-3">
          {data.handsRaised.map((h, i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Hand size={16} className="text-primary shrink-0" aria-hidden />
                  <span className="text-sm font-medium text-foreground truncate">{h.topic}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[11px]">{h.module}</Badge>
                  <Badge
                    className={cn(
                      "text-[11px]",
                      h.status === "resolved"
                        ? "bg-success text-success-foreground hover:bg-success"
                        : "bg-warning text-warning-foreground hover:bg-warning",
                    )}
                  >
                    {h.status === "resolved" ? "Resolved" : "Pending"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{h.date}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{h.note}</p>
              {h.managerResponse && (
                <p className="text-sm text-foreground border-l-2 border-primary/40 pl-3">
                  <span className="font-medium">Manager: </span>{h.managerResponse}
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Section 4: Sage Conversation History */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <SectionHeading>Sage Conversation History</SectionHeading>
            <p className="text-sm text-muted-foreground">
              Questions you've asked Sage and key moments from your learning conversations
            </p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">{data.totalConversations} conversations</Badge>
        </div>
        <div className="space-y-3">
          {data.conversations.map((c, i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{c.date}</span>
                <Badge variant="secondary" className="text-[11px]">{c.module}</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">{c.question}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.response}</p>
            </Card>
          ))}
        </div>
        {data.showMoreCount > 0 && (
          <div className="flex justify-center">
            <Button
              variant="link"
              className="text-primary"
              onClick={() => toast("Full conversation history coming soon")}
            >
              Show {data.showMoreCount} more conversations
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
