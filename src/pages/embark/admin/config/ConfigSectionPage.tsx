import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import {
  AssessmentsSection,
  FeatureFlagsSection,
  HandsRaisedSlaSection,
  LearnerExperienceSection,
  NotificationsSection,
} from "@/pages/embark/admin/Config";
import { WeightagesSection } from "@/pages/embark/admin/config/WeightagesSection";

const SECTIONS: Record<string, () => JSX.Element> = {
  assessments: AssessmentsSection,
  "feature-flags": FeatureFlagsSection,
  "hands-raised-sla": HandsRaisedSlaSection,
  experience: LearnerExperienceSection,
  "learner-experience": LearnerExperienceSection,
  notifications: NotificationsSection,
  weightages: WeightagesSection,
};

export default function ConfigSectionPage() {
  const { section = "" } = useParams();
  const Section = SECTIONS[section];
  if (!Section) return <Navigate to="/admin/config" replace />;

  return (
    <PageContainer as="div" className="py-6 space-y-4">
      <Link
        to="/admin/config"
        className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Configuration
      </Link>
      <Section />
    </PageContainer>
  );
}
