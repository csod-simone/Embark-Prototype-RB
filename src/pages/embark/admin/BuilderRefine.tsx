import { useNavigate, useParams } from "react-router-dom";
import { BuilderHeader } from "./builder/BuilderHeader";
import { EmbarkConfigPanel } from "./builder/EmbarkConfigPanel";
import { EmbarkConfigProvider } from "./builder/embarkConfigContext";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function BuilderConfigure() {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();

  return (
    <EmbarkConfigProvider curriculumId={curriculumId}>
      <BuilderHeader current="configure" />
      <PageContainer as="div" className="py-6 max-w-3xl">
        <h2 className="text-lg font-semibold text-foreground">Configure</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Configure how Embark delivers this path to learners. These settings are Embark-specific and do not affect the path structure.
        </p>
        <EmbarkConfigPanel />
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => navigate(`/admin/builder/${curriculumId}/refine`)}>← Back</Button>
          <Button onClick={() => navigate(`/admin/builder/${curriculumId}/publish`)}>Next →</Button>
        </div>
      </PageContainer>
    </EmbarkConfigProvider>
  );
}