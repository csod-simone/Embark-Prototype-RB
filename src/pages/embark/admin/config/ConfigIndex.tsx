import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { ConfigSectionWidget } from "@/components/embark/admin/ConfigSectionWidget";
import { FEATURE_FLAGS, useFeatureFlags } from "@/hooks/use-feature-flags";
import { useCohortSettings } from "@/hooks/use-cohort-settings";
import { useNotificationSettings } from "@/hooks/use-notification-settings";
import { useAssessmentSettings } from "@/hooks/use-assessment-settings";
import { useAssessmentTypeDefaults } from "@/hooks/use-assessment-type-defaults";
import { useWeightages } from "@/hooks/use-weightages";

const onOff = (v: boolean) => (v ? "On" : "Off");

const ANSWER_REVIEW_STATUS = {
  none: "No review",
  "on-pass": "After advancing",
  always: "After each submission",
} as const;

export default function ConfigIndex() {
  const { flags } = useFeatureFlags();
  const assessments = useAssessmentSettings();
  const { defaults: typeDefaults } = useAssessmentTypeDefaults();
  const cohortSettings = useCohortSettings();
  const { graduationEmail } = useNotificationSettings();
  const weightages = useWeightages();
  const weightTotal = weightages.components.reduce((s, c) => s + c.weight, 0);
  const typeDefaultCount = Object.keys(typeDefaults).length;

  const flagOptions = [
    ...FEATURE_FLAGS.map((f) => ({ label: f.name, status: onOff(flags[f.id] ?? f.defaultOn) })),
    { label: "Cohort scheduling fields required", status: onOff(cohortSettings.datesRequired) },
  ];

  return (
    <PageContainer as="div" className="py-6 space-y-6">
      <ConfigSectionWidget
        title="Assessments"
        description="Control how learners interact with assessment questions."
        to="/admin/config/assessments"
        rows={[
          {
            label: "Answer review",
            description:
              "When learners can see which answers were correct after completing an assessment.",
            status: ANSWER_REVIEW_STATUS[assessments.answerReview],
            to: "/admin/config/assessments#answer-review",
          },
          {
            label: "Assessment type defaults",
            description:
              "Default advancement thresholds, override permissions, and author guidance per assessment type.",
            status: `${typeDefaultCount} types configured`,
            to: "/admin/config/assessments#assessment-type-defaults",
          },
        ]}
      />

      <ConfigSectionWidget
        title="Experience"
        description="Configure the transparency screen learners see when they first access the platform."
        to="/admin/config/experience"
        rows={[
          {
            label: "Transparency Screen",
            description: "The AI transparency statement shown during onboarding.",
            status: "Configured",
          },
        ]}
      />

      <ConfigSectionWidget
        title="Feature flags"
        description="Turn platform capabilities on or off for all new sessions."
        to="/admin/config/feature-flags"
        options={flagOptions}
      />

      <ConfigSectionWidget
        title="Hands Raised SLA"
        description="Define the response time target for Hands Raised requests across the tenant."
        to="/admin/config/hands-raised-sla"
        rows={[
          {
            label: "Response time targets",
            description:
              "Target response time, breach notification, and escalation timing for raised hands.",
            status: "Configured",
          },
        ]}
      />

      <ConfigSectionWidget
        title="Notifications"
        description="Manage automated emails and inactivity reminders."
        to="/admin/config/notifications"
        rows={[
          {
            label: "Graduation Email",
            description: "The email sent when a line manager takes action on a learner's graduation.",
            status: graduationEmail.active ? "Active" : "Inactive",
          },
          {
            label: "Reminder Settings",
            description:
              "When Sage sends automated reminders to learners who have not engaged recently.",
            status: "3 reminders active",
          },
        ]}
      />

      <ConfigSectionWidget
        title="Weightages"
        description="Configure Readiness Score component weightings and Readiness Band thresholds."
        to="/admin/config/weightages"
        rows={[
          {
            label: "Readiness Score",
            description:
              "Define the percentage weighting of each component contributing to the Readiness Score.",
            status: `${weightages.components.length} components configured · Total: ${weightTotal}%`,
          },
          {
            label: "Readiness Bands",
            description:
              "Configure the score thresholds and status labels for each readiness band.",
            status: `${weightages.bands.length} bands configured`,
          },
        ]}
      />
    </PageContainer>
  );
}
