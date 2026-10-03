import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { ChipInput } from "@/components/embark/ChipInput";
import { BuilderHeader } from "./builder/BuilderHeader";
import { CurriculumTree, defaultModules, type TreeModule } from "./builder/CurriculumTree";
import { csrWeekModules } from "./builder/curriculumData";
import { EmbarkConfigProvider, useEmbarkConfigContext } from "./builder/embarkConfigContext";
import { AttemptsAllowedField, defaultAttempts } from "@/components/embark/AttemptsAllowed";
import { EmbarkAdditionsSection } from "./builder/EmbarkConfigPanel";
import { SessionAskSagePanel, type SagePrompt } from "@/components/embark/SessionAskSagePanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { PageContainer } from "@/components/embark/layouts/PageContainer";


const REFINE_PROMPTS: SagePrompt[] = [
  { label: "Move the role play session to Week 3" },
  { label: "Add a knowledge check after the claims section" },
  { label: "Make Week 2 shorter — combine sessions 2 and 3" },
  { label: "Remove all game sessions" },
];

export default function BuilderReview() {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();
  const viewOnly = false;
  const initialModules = useMemo(() => csrWeekModules(curriculumId) ?? defaultModules, [curriculumId]);
  const [modules, setModules] = useState<TreeModule[]>(initialModules);
  const firstSession = initialModules[0]?.sessions[0];
  const [sel, setSel] = useState<{ kind: "session" | "assessment" | "module"; id: string } | null>(
    firstSession
      ? { kind: firstSession.kind === "Assessment" ? "assessment" : "session", id: firstSession.id }
      : null,
  );
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [chips, setChips] = useState(["HMO structure", "PPO networks", "HDHP deductibles"]);
  const [showRegen, setShowRegen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mcq, setMcq] = useState([60, 20, 20]);
  const [sageOpen, setSageOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);


  const reorderSessions = (moduleId: string, from: number, to: number) => {
    setModules((prev) => prev.map((m) => {
      if (m.id !== moduleId) return m;
      const arr = [...m.sessions];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...m, sessions: arr };
    }));
  };

  const selectedSession = sel && sel.kind === "session"
    ? modules.flatMap((m) => m.sessions).find((s) => s.id === sel.id)
    : null;

  return (
    <EmbarkConfigProvider curriculumId={curriculumId}>
      <BuilderHeader current="refine" viewOnly={viewOnly} />
      {viewOnly && (
        <div className="px-6 pt-4 flex items-center justify-between gap-3">
          <Badge variant="secondary">View Only</Badge>
          <Button variant="secondary" size="sm" onClick={() => navigate("/admin/curricula")}>Close</Button>
        </div>
      )}
      <div className="flex min-h-0">
        {sageOpen && (
          <SessionAskSagePanel
            prompts={REFINE_PROMPTS}
            aiFlag
            onClose={() => setSageOpen(false)}
            className="border-l-0 border-r"
          />
        )}
        <div className="flex-1 min-w-0">
      <PageContainer as="div" className="grid grid-cols-1">

        {/* PATH STRUCTURE (full width) */}
        <div className="p-6 overflow-y-auto">
          <h3 className="font-medium mb-3">Path Structure</h3>
          <p className="mt-1 text-sm text-muted-foreground mb-4">
            Review and refine your Path structure in this step. You can reorder content,
            review the path sequence, and update content details. Click on any content item within
            the path structure to open its details in the fly-out panel, where you can review and
            edit the available configuration settings.
          </p>
          <CurriculumTree
            modules={modules}
            selectedId={sel?.id}
            onSelect={(kind, id) => { setSel({ kind, id }); setDetailsOpen(true); }}
            onReorderSessions={reorderSessions}
            reviewedIds={reviewed}
            viewOnly={viewOnly}
          />
          <div className="mt-6">
            <EmbarkAdditionsSection />
          </div>
        </div>
      </PageContainer>

      {/* CONTENT DETAILS FLYOUT */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[60vw] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>
              {sel?.kind === "assessment" ? "Assessment Detail" : selectedSession?.name ?? "Content Detail"}
            </SheetTitle>
          </SheetHeader>
          <div className="pb-6">


          {sel && selectedSession && (
            <>
              <p className="text-xs text-muted-foreground mb-3">Session Detail</p>
              <Input defaultValue={selectedSession.name.replace(/^Session \d+: /, "")} className="font-medium" disabled={viewOnly} readOnly={viewOnly} />

              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Learning Objectives</p>
                <ul className="space-y-2 text-sm">
                  {[
                    "Learner can distinguish between HMO, PPO, and HDHP plan structures",
                    "Learner can explain key eligibility requirements for commercial members",
                  ].map((o) => (
                    <li key={o} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span className="flex-1">{o}</span>
                      {!viewOnly && <button className="text-muted-foreground text-xs">✎</button>}
                      {!viewOnly && <button className="text-muted-foreground text-xs">×</button>}
                    </li>
                  ))}
                </ul>
                {!viewOnly && <button className="mt-2 text-sm text-secondary-foreground hover:underline">+ Add objective</button>}
              </div>

              <div className="mt-4">
                <InlineExpandRow
                  trigger={<span className="text-sm font-medium">AI Content Summary</span>}
                  content={<p className="text-sm text-muted-foreground italic">Covers the three primary commercial plan types — HMO, PPO, and HDHP — with comparison of network restrictions, referral requirements, and out-of-pocket structures. Sourced from CVS_Commercial_Plans_Overview.pdf, pages 3–8.</p>}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Content Modality</p>
                  <select className="border border-border rounded-md text-sm px-2 py-1.5 w-full disabled:opacity-60" defaultValue="Video" disabled={viewOnly}>
                    {["Video", "Article", "Audio", "Role Play", "Interactive Exercise"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Duration</p>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={6} className="w-20" disabled={viewOnly} readOnly={viewOnly} />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">Topics (Sage knowledge layer)</p>
                <p className="text-xs text-muted-foreground mb-2">(not visible to learner)</p>
                {viewOnly ? (
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <span key={c} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{c}</span>
                    ))}
                  </div>
                ) : (
                  <ChipInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, idx) => idx !== i))} placeholder="Add topic" />
                )}
              </div>

              <div className="mt-4">
                <fieldset disabled={viewOnly} className="disabled:opacity-60">
                  <MandatoryField itemId={selectedSession.id} />
                </fieldset>
              </div>

              {selectedSession.lowConfidence && (
                <div className="mt-4">
                  <LeftBorderCard borderVariant="warning">
                    <p className="text-sm">⚠ Low confidence — This session was generated from sparse coverage on HDHP content. Consider adding more source material or editing manually before publishing.</p>
                    <label className="flex items-center gap-2 mt-3 text-sm">
                      <Checkbox
                        checked={reviewed.has(selectedSession.id)}
                        onCheckedChange={(v) => {
                          setReviewed((prev) => {
                            const n = new Set(prev);
                            if (v) n.add(selectedSession.id); else n.delete(selectedSession.id);
                            return n;
                          });
                        }}
                      />
                      Mark as reviewed
                    </label>
                  </LeftBorderCard>
                </div>
              )}

              {!viewOnly && (
                <div className="mt-4">
                  {showRegen ? (
                    <div className="text-sm space-x-2">
                      <span>This will regenerate only this session. Current content will be replaced.</span>
                      <Button size="sm" onClick={() => setShowRegen(false)}>Yes, regenerate</Button>
                      <Button size="sm" variant="secondary" onClick={() => setShowRegen(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <button className="text-sm text-secondary-foreground hover:underline" onClick={() => setShowRegen(true)}>
                      ↺ Regenerate this session from source
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {sel?.kind === "assessment" && (
            <>
              <p className="text-xs text-muted-foreground mb-3">Assessment Detail</p>
              <p className="text-sm text-muted-foreground">12 questions · 70% to advance · 2 retakes available</p>

              <div className="mt-6">
                <p className="text-sm font-medium">Question Type Mix</p>
                <p className="text-xs text-muted-foreground mb-4">Total must equal 100%</p>
                {[["Multiple choice", 0], ["Scenario / situational", 1], ["Open-ended", 2]].map(([label, i]) => (
                  <div key={label as string} className="flex items-center gap-3 mb-3">
                    <span className="text-sm w-48">{label}: {mcq[i as number]}%</span>
                    <Slider
                      value={[mcq[i as number]]}
                      onValueChange={([v]) => setMcq((prev) => prev.map((x, j) => (j === i ? v : x)))}
                      max={100}
                      className="flex-1"
                      disabled={viewOnly}
                    />
                  </div>
                ))}
                {mcq.reduce((a, b) => a + b, 0) !== 100 && (
                  <p className="text-xs text-destructive">Total must equal 100% — currently at {mcq.reduce((a, b) => a + b, 0)}%</p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Difficulty Distribution</p>
                <div className="flex h-6 rounded overflow-hidden">
                  <div className="bg-muted flex items-center justify-center text-xs" style={{ width: "30%" }}>Recall 30%</div>
                  <div className="bg-secondary/40 flex items-center justify-center text-xs" style={{ width: "40%" }}>Comprehension 40%</div>
                  <div className="bg-primary/20 flex items-center justify-center text-xs" style={{ width: "30%" }}>Application 30%</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Weighted toward application for role-relevant modules</p>
              </div>

              <AttemptsSection assessmentId={sel.id} viewOnly={viewOnly} />

              <button className="mt-6 text-sm text-secondary-foreground hover:underline" onClick={() => setPreviewOpen(true)}>
                Preview generated questions ↗
              </button>
            </>
          )}
          </div>
        </SheetContent>
      </Sheet>

      {!viewOnly && (
        <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(`/admin/builder/${curriculumId}/ingest`)}>← Back to Ingest</Button>
            <Button variant="ghost" onClick={() => navigate("/admin/curricula")}>Cancel</Button>
          </div>
          <Button onClick={() => navigate(`/admin/builder/${curriculumId}/configure`)}>Accept All and Next Step →</Button>
        </div>
      )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CSR Onboarding Week 1 Readiness Check — Question Preview</DialogTitle>
            <p className="text-sm text-muted-foreground">12 questions · Admin review required before publishing</p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <QCard n="Q1" tags={["Multiple choice", "Recall"]}
              question="Which of the following best describes the primary difference between an HMO and a PPO plan?"
              options={[
                "HMOs require referrals for specialist visits; PPOs generally do not",
                "PPOs have lower monthly premiums than HMOs",
                "HMOs cover out-of-network services at full cost",
                "PPOs require pre-authorization for all services",
              ]}
              correct="A"
              objective="HMO vs PPO distinction"
            />
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex gap-2 items-center mb-2">
                <span className="text-xs text-muted-foreground">Q2</span>
                <span className="text-xs bg-muted rounded-full px-2 py-0.5">Scenario</span>
                <span className="text-xs bg-warning/15 text-warning-foreground dark:text-warning rounded-full px-2 py-0.5">⚠️ Low confidence</span>
              </div>
              <LeftBorderCard borderVariant="warning">
                <p className="text-sm">A commercial member calls to ask why their specialist visit wasn't covered. They have a PPO plan but saw an out-of-network specialist. What is the most appropriate explanation?</p>
              </LeftBorderCard>
              <p className="text-xs text-success-dark mt-2">✓ Correct: B</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex gap-2 items-center mb-2">
                <span className="text-xs text-muted-foreground">Q3</span>
                <span className="text-xs bg-muted rounded-full px-2 py-0.5">Open-ended</span>
                <span className="text-xs bg-muted rounded-full px-2 py-0.5">Application</span>
              </div>
              <p className="text-sm">In your own words, explain how the out-of-pocket maximum works for a member on a commercial HDHP plan.</p>
              <p className="text-xs italic text-muted-foreground mt-2">AI-scored against a rubric anchored to session topics. Flagged for human review if score is borderline.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Showing 3 of 12 questions</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </EmbarkConfigProvider>
  );
}

function AttemptsSection({ assessmentId, viewOnly }: { assessmentId: string; viewOnly?: boolean }) {
  const embark = useEmbarkConfigContext();
  if (!embark) return null;
  const value = embark.draft.attempts?.[assessmentId] ?? defaultAttempts;
  return (
    <div className="mt-6">
      <p className="text-sm font-medium mb-2">Attempt Settings</p>
      <fieldset disabled={viewOnly} className="disabled:opacity-60">
        <AttemptsAllowedField
          idPrefix={`refine-attempts-${assessmentId}`}
          value={value}
          helperText="Overrides the assessment's default setting for this path only."
          onChange={(next) =>
            embark.update({ attempts: { ...(embark.draft.attempts ?? {}), [assessmentId]: next } })
          }
        />
        <div className="mt-4">
          <MandatoryField itemId={assessmentId} />
        </div>
      </fieldset>
    </div>
  );
}

function MandatoryField({ itemId }: { itemId: string }) {
  const embark = useEmbarkConfigContext();
  if (!embark) return null;
  const checked = !!embark.draft.mandatory[itemId];
  return (
    <div>
      <div className="flex items-center gap-3">
        <Label htmlFor={`refine-mandatory-${itemId}`} className="text-sm font-medium">Mandatory</Label>
        <Switch
          id={`refine-mandatory-${itemId}`}
          checked={checked}
          onCheckedChange={(v) => embark.update({ mandatory: { ...embark.draft.mandatory, [itemId]: v } })}
          aria-label="Mandatory"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Mandatory items cannot be skipped or bypassed by the adaptive AI.
      </p>
    </div>
  );
}

function QCard({ n, tags, question, options, correct, objective }: {
  n: string; tags: string[]; question: string; options: string[]; correct: string; objective: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-2 items-center mb-2">
        <span className="text-xs text-muted-foreground">{n}</span>
        {tags.map((t) => <span key={t} className="text-xs bg-muted rounded-full px-2 py-0.5">{t}</span>)}
      </div>
      <p className="text-sm mb-3">{question}</p>
      <ol className="space-y-1.5 text-sm">
        {options.map((o, i) => (
          <li key={i} className="flex gap-2"><span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {o}</li>
        ))}
      </ol>
      <p className="text-xs text-success-dark mt-2">✓ Correct: {correct}</p>
      <span className="inline-block mt-2 text-xs bg-secondary/30 text-secondary-foreground rounded-full px-2 py-0.5">{objective}</span>
    </div>
  );
}
