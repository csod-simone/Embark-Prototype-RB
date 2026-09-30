import { PersonaLayout } from "../PersonaLayout";
import { upskillerNav, upskillerMobileTabs } from "../navConfig";
import { UpskillerTopHeader } from "../UpskillerTopHeader";
import { AskAIProvider } from "../AskAIContext";

export default function UpskillerLayout() {
  return (
    <AskAIProvider>
      <PersonaLayout
        header={<UpskillerTopHeader />}
        hideSidebar
        sageUserName="Riley Chen"
        sidebar={{
          persona: "upskiller",
          items: upskillerNav,
          userName: "Riley Chen",
          userEmail: "riley.chen@company.com",
          userInitials: "RC",
        }}
        mobileTabs={upskillerMobileTabs}
      />
    </AskAIProvider>
  );
}
