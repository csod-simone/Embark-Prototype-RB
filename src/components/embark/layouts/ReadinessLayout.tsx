import { PersonaLayout } from "../PersonaLayout";
import { readinessNav, readinessMobileTabs } from "../navConfig";
import { ReadinessTopHeader } from "../ReadinessTopHeader";
import { AskAIProvider } from "../AskAIContext";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";

export default function ReadinessLayout() {
  const { user } = useReadinessProfile();

  return (
    <AskAIProvider>
      <PersonaLayout
        header={<ReadinessTopHeader />}
        hideSidebar
        sageUserName={user.name}
        sidebar={{
          persona: "upskiller",
          items: readinessNav,
          userName: user.name,
          userEmail: user.email,
          userInitials: user.initials,
        }}
        mobileTabs={readinessMobileTabs}
      />
    </AskAIProvider>
  );
}
