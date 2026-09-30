import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { PrePublishChecklist } from "@/components/embark/PrePublishChecklist";
import { BuilderHeader } from "./builder/BuilderHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function BuilderPublish() {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [modal, setModal] = useState(false);
  const [published, setPublished] = useState(false);

  const canPublish = ack1 && ack2;

  if (published) {
    return (
      <>
        <BuilderHeader current="publish" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-success-dark mb-4" />
          <h2 className="text-2xl font-semibold text-success-dark">Path Published</h2>
          <h3 className="text-lg text-muted-foreground mt-1">Aetna CSR Onboarding — Commercial — v1.0</h3>
          <p className="text-muted-foreground">Available for cohort enrollment</p>
          <Button className="mt-6" onClick={() => navigate("/admin/curricula")}>Return to Paths</Button>
        </div>
      </>
    );
  }

  const publishBtn = (
    <Button
      className="w-full"
      disabled={!canPublish}
      onClick={() => setModal(true)}
    >
      Publish Path
    </Button>
  );

  return (
    <>
      <BuilderHeader current="publish" />
      <PageContainer as="div" className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        <div>
          <h3 className="font-medium mb-3">Pre-Publish Checklist</h3>
          <PrePublishChecklist
            items={[
              { label: "All modules have at least one session", status: "pass", detail: "5 of 5 modules" },
              { label: "All sessions have a defined content type", status: "pass", detail: "18 of 18 sessions" },
              { label: "All module assessments reviewed", status: "warn", detail: "4 of 5 reviewed — Week 5 assessment not yet reviewed.", acknowledged: ack1, onAcknowledge: () => setAck1(!ack1) },
              { label: "No unresolved low-confidence content flags", status: "warn", detail: "1 flag remaining — Session 1 in Week 1.", acknowledged: ack2, onAcknowledge: () => setAck2(!ack2) },
              { label: "Pre/post-assessment configuration confirmed", status: "pass", detail: "Both disabled" },
              { label: "Path has been reviewed", status: "pass", detail: "Reviewed Jul 19, 2026" },
            ]}
          />
          {!canPublish && (
            <div className="mt-4">
              <LeftBorderCard borderVariant="warning">
                <p className="text-sm">⚠ 2 warnings require acknowledgment before publishing. Check the boxes above to proceed.</p>
              </LeftBorderCard>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-3">Publish Summary</h3>
          <div className="border border-border rounded-md p-4 space-y-3">
            {[
              ["Path:", "Aetna CSR Onboarding — Commercial"],
              ["Journey:", "CSR Onboarding"],
              ["Modules / Sessions / Assessments:", "5 · 18 · 5"],
              ["Publishing as version:", "0.3 → will publish as 1.0"],
              ["Active enrollments affected:", "0 learners"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between gap-3">
                <span className="text-xs text-muted-foreground">{l}</span>
                <span className="text-sm text-right">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs italic text-muted-foreground mt-3">Learners currently enrolled in a prior version will not be automatically migrated.</p>

          <div className="mt-4">
            {canPublish ? publishBtn : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><span className="block">{publishBtn}</span></TooltipTrigger>
                  <TooltipContent>Acknowledge all warnings above to enable publishing</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => toast("Path saved as draft.")}
            >
              Save as Draft
            </Button>
            <div className="text-center mt-3">
              <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate(`/admin/builder/${curriculumId}/configure`)}>
                ← Return to configure
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Aetna CSR Onboarding — Commercial?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will make the path available for cohort enrollment. 0 learners are currently enrolled.</p>
          <div className="space-y-2 mt-4">
            <Button className="w-full" onClick={() => { setModal(false); setPublished(true); }}>Publish Path</Button>
            <Button className="w-full" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
