import { SageTag } from "@/components/embark/SageTag";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { BuilderHeader } from "./builder/BuilderHeader";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type StageStatus = "done" | "active" | "pending";
type Stage = { label: string; status: StageStatus };

const initialStages: Stage[] = [
  { label: "Analysing source materials", status: "done" },
  { label: "Mapping learning objectives", status: "done" },
  { label: "Structuring modules", status: "active" },
  { label: "Generating sessions", status: "pending" },
  { label: "Creating assessments", status: "pending" },
  { label: "Finalising", status: "pending" },
];

export default function BuilderGenerate() {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const complete = stages.every((s) => s.status === "done");

  useEffect(() => {
    if (complete) return;
    const t = setTimeout(() => {
      setStages((prev) => prev.map((s) => ({ ...s, status: "done" as const })));
    }, 3000);
    return () => clearTimeout(t);
  }, [complete]);

  return (
    <>
      <BuilderHeader current="generate" />
      <PageContainer as="div" className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        <div>
          <h3 className={`font-medium mb-4 ${complete ? "text-success-dark" : "text-warning-foreground dark:text-warning"}`}>
            {complete ? "GENERATION COMPLETE" : "GENERATION IN PROGRESS"}
          </h3>
          <ol className="space-y-3">
            {stages.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs
                  ${s.status === "done" ? "bg-success text-success-foreground" : s.status === "active" ? "bg-warning text-warning-foreground" : "border border-border text-muted-foreground"}`}>
                  {s.status === "done" ? <Check className="h-3.5 w-3.5" /> : s.status === "active" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : i + 1}
                </span>
                <span className={s.status === "pending" ? "text-muted-foreground text-sm" : "text-sm text-foreground"}>{s.label}</span>
                <span className="ml-auto text-xs">
                  {s.status === "done" ? <span className="text-muted-foreground">Complete</span> :
                   s.status === "active" ? <span className="text-warning-foreground dark:text-warning">In progress...</span> : null}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-secondary transition-all" style={{ width: complete ? "100%" : "40%" }} />
          </div>
          {!complete && <p className="text-xs text-muted-foreground text-right mt-1">~3 minutes remaining</p>}
          {!complete && (
            <div className="mt-4">
              {confirmCancel ? (
                <div className="text-sm space-x-2">
                  <span>This will discard the current generation run. Are you sure?</span>
                  <Button size="sm" variant="destructive" onClick={() => navigate(`/admin/builder/${curriculumId}/ingest`)}>Yes, cancel</Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmCancel(false)}>Keep going</Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Cancel generation
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/20 rounded-md p-4">
            <div className="flex items-center gap-2 mb-1">
              <SageTag label="AI" />
              <span className="font-medium">{complete ? "Path ready to review" : "Building your path"}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {complete
                ? "Your path has been generated. Continue to review the structure and make any edits before publishing."
                : "We're analysing your 3 source files and structuring modules based on learning objectives. This usually takes 3–5 minutes for materials of this size."}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm">💡 You can edit any part of the generated structure before publishing — the AI gives you a starting point, not a final answer.</p>
            <div className="mt-3 flex justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </PageContainer>

      <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(`/admin/builder/${curriculumId}/ingest`)}>
            ← Back to Ingest
          </Button>
          <Button variant="ghost" onClick={() => navigate("/admin/curricula")}>
            Cancel
          </Button>
        </div>
        <Button
          disabled={!complete}
          onClick={() => navigate(`/admin/builder/${curriculumId}/refine`)}
        >
          Continue to Refine →
        </Button>
      </div>
    </>
  );
}
