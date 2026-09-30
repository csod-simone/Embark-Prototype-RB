import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { SageTag } from "@/components/embark/SageTag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

type Level = "approve" | "soft" | "flag";

type Candidate = {
  id: string;
  name: string;
  cohort: string;
  journey: string;
  recommendation: Level;
  evidence: [string, string][];
  rationale: string;
};

export const graduationCandidates: Candidate[] = [
  {
    id: "g-matteo",
    name: "Alex Morgan",
    cohort: "IM Intake Cohort A",
    journey: "Investment Manager Full Onboarding Journey",
    recommendation: "approve",
    evidence: [
      ["Journey", "Complete · 6 Aug 2026"],
      ["Paths", "IM Intake Pathway, Compliance Refresher Path, and Discretionary Portfolio Management — 18 of 18 sessions"],
      ["Assessments", "All passed · average 88%, including the chapter gate at 90%"],
      ["Role-plays", "Discovery, suitability, and the formative suitability conversation completed"],
      ["Hands raised", "Both resolved with the line manager"],
      ["CISI Level 4", "Not recorded — taken outside Embark"],
    ],
    rationale:
      "Alex Morgan has finished every path on the Investment Manager Full Onboarding Journey. Knowledge checks, the module assessment, and the chapter gate are all passes, and the three client role-plays are complete. Embark recommends Approve: the learner is ready for sign-off. A certificate still waits on a CISI Level 4 pass recorded outside Embark.",
  },
  {
    id: "g-lily",
    name: "Lily Zhang",
    cohort: "IM Intake Cohort A",
    journey: "Investment Manager Full Onboarding Journey",
    recommendation: "soft",
    evidence: [
      ["Progress", "95% · Fast Tracker · readiness 97"],
      ["Current track", "IM Intake Pathway nearly complete · later paths still locked"],
      ["Assessments", "Knowledge checks passed on the first or second sitting"],
      ["Role-plays", "Discovery practice complete · formative suitability still ahead"],
      ["Last active", "1 hour ago"],
      ["CISI Level 4", "Not recorded — taken outside Embark"],
    ],
    rationale:
      "Lily Zhang is ahead of the cohort and the scores are strong, but the formative suitability role-play and the later paths are still open. Embark recommends Soft Landing: a period of supervised practice before full sign-off, rather than graduating straight to independent client work.",
  },
  {
    id: "g-elena",
    name: "Elena Torres",
    cohort: "IM Intake Cohort A",
    journey: "Investment Manager Full Onboarding Journey",
    recommendation: "flag",
    evidence: [
      ["Progress", "89% · Ready · readiness 91"],
      ["Current track", "IM Intake Pathway · advice documentation and the formative role-play still open"],
      ["Assessments", "Knowledge checks passed · module assessment and chapter gate not yet taken"],
      ["Role-plays", "Discovery complete · suitability under pressure not yet practised"],
      ["Last active", "3 hours ago"],
      ["CISI Level 4", "Not recorded — taken outside Embark"],
    ],
    rationale:
      "Elena Torres is close, and the readiness score is high, but suitability under pressure and the file note have not been practised yet. Embark recommends Flag: additional practice on that role-play and the advice documentation before graduation.",
  },
];

const LEVELS: { id: Level; label: string; detail: string }[] = [
  { id: "approve", label: "Approve", detail: "The learner is ready." },
  {
    id: "soft",
    label: "Soft Landing",
    detail: "The learner will move into a period of supervised practice before full sign-off.",
  },
  {
    id: "flag",
    label: "Flag",
    detail: "Additional practice has been identified to help the learner build further confidence before graduating.",
  },
];

const recommendationMeta: Record<Level, { label: string; variant: "success" | "warning" | "destructive"; border: "success" | "warning" | "danger" }> = {
  approve: { label: "Embark recommends Approve", variant: "success", border: "success" },
  soft: { label: "Embark recommends Soft Landing", variant: "warning", border: "warning" },
  flag: { label: "Embark recommends Flag", variant: "destructive", border: "danger" },
};

const CERTIFICATE =
  "A certificate is issued only when that sign-off is recorded and the learner has passed CISI Level 4 outside Embark.";

function outcomeCopy(level: Level, name: string): { title: string; body: string } {
  if (level === "approve") {
    return {
      title: "Approve recorded — the learner is ready",
      body: `Sign-off for ${name} is recorded. ${CERTIFICATE} CISI Level 4 is not on record yet, so the certificate is not issued.`,
    };
  }
  if (level === "soft") {
    return {
      title: "Soft Landing recorded",
      body: `${name} will move into a period of supervised practice before full sign-off. This is not full sign-off, so a certificate is not issued.`,
    };
  }
  return {
    title: "Flag recorded",
    body: `Additional practice has been identified to help ${name} build further confidence before graduating. This is not sign-off, so a certificate is not issued.`,
  };
}

export default function GraduationReview() {
  const [decisions, setDecisions] = useState<Record<string, Level | null>>(() =>
    Object.fromEntries(graduationCandidates.map((learner) => [learner.id, null])),
  );

  const awaiting = useMemo(
    () => graduationCandidates.filter((learner) => !decisions[learner.id]).length,
    [decisions],
  );
  const approved = graduationCandidates.filter((learner) => decisions[learner.id] === "approve").length;

  const decide = (learner: Candidate, level: Level) => {
    setDecisions((prev) => ({ ...prev, [learner.id]: level }));
    const label = LEVELS.find((item) => item.id === level)?.label ?? "Decision";
    toast.success(`${label} recorded for ${learner.name}`);
  };

  return (
    <PageContainer as="div" className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Graduation Review</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Learners ready for graduation. Embark recommends a level for each person, with the evidence
          and the rationale. Review that recommendation, then record your decision.
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{CERTIFICATE}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-md border border-border bg-background p-4">
          <div className="text-xs tracking-wide text-muted-foreground">Awaiting review</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{awaiting}</div>
          <div className="mt-1 text-xs text-muted-foreground">Ready for your decision</div>
        </div>
        <div className="rounded-md border border-border bg-background p-4">
          <div className="text-xs tracking-wide text-muted-foreground">Sign-off recorded</div>
          <div className="mt-1 text-2xl font-bold text-success-dark">{approved}</div>
          <div className="mt-1 text-xs text-muted-foreground">Approve only · certificate still needs CISI Level 4</div>
        </div>
        <div className="rounded-md border border-border bg-background p-4">
          <div className="text-xs tracking-wide text-muted-foreground">CISI Level 4 on record</div>
          <div className="mt-1 text-2xl font-bold text-foreground">0</div>
          <div className="mt-1 text-xs text-muted-foreground">Passed outside Embark</div>
        </div>
      </div>

      <div className="space-y-4">
        {graduationCandidates.map((learner) => {
          const decision = decisions[learner.id];
          const meta = recommendationMeta[learner.recommendation];
          const outcome = decision ? outcomeCopy(decision, learner.name) : null;
          return (
            <section key={learner.id} className="rounded-lg border border-border bg-card p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">{learner.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {learner.cohort} · {learner.journey}
                  </p>
                </div>
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1">Evidence</div>
                <Table>
                  <TableBody>
                    {learner.evidence.map(([label, value]) => (
                      <TableRow key={label}>
                        <TableCell className="text-xs text-muted-foreground py-2 w-[32%]">{label}</TableCell>
                        <TableCell className="text-sm text-foreground py-2">{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <LeftBorderCard borderVariant={meta.border}>
                <div className="flex items-start gap-2">
                  <SageTag className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-foreground">AI rationale</div>
                    <p className="mt-1 text-sm text-muted-foreground">{learner.rationale}</p>
                  </div>
                </div>
              </LeftBorderCard>

              <div className="pt-4 border-t border-border">
                {outcome ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {decision === "approve" && <CheckCircle2 size={16} className="text-success-dark" />}
                      {decision === "soft" && <RefreshCw size={16} className="text-warning-foreground dark:text-warning" />}
                      {decision === "flag" && <AlertTriangle size={16} className="text-destructive" />}
                      <span className="text-sm font-medium text-foreground">{outcome.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{outcome.body}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Your decision</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {LEVELS.map((level) => (
                        <li key={level.id}>
                          <span className="font-semibold text-foreground">{level.label}</span>
                          {" — "}
                          {level.detail}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => decide(learner, "approve")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => decide(learner, "soft")}>
                        Soft Landing
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => decide(learner, "flag")}
                      >
                        Flag
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
