import { useAskAI } from "@/components/embark/AskAIContext";
import { AskSagePanel } from "@/pages/embark/learner/home/AskSagePanel";
import { TutorBottomDrawer } from "@/pages/embark/learner/home/TutorBottomDrawer";
import { useTutorConversation } from "@/pages/embark/learner/home/useTutorConversation";

/**
 * Hosts the shared Sage experience: the full-height Ask Sage panel (desktop)
 * and the tutor bottom drawer (mobile), driven by a single conversation.
 * Render this inside a page that sits under an AskAIProvider.
 */
export function SageSurface({
  userName,
  header,
  children,
}: {
  userName: string;
  /** Persona top bar, kept visible while the Sage panel is open. */
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  const askAI = useAskAI();
  const conversation = useTutorConversation();

  if (askAI.open) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        {header}
        <AskSagePanel
          conversation={conversation}
          onClose={askAI.closeAskAI}
          userName={userName.split(" ")[0]}
        />
      </div>
    );
  }

  return (
    <>
      {children}
      <TutorBottomDrawer conversation={conversation} />
    </>
  );
}