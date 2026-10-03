import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAskAI } from "@/components/embark/AskAIContext";
import { AskSagePanel } from "@/pages/embark/learner/home/AskSagePanel";
import { TutorBottomDrawer } from "@/pages/embark/learner/home/TutorBottomDrawer";
import { useTutorConversation } from "@/pages/embark/learner/home/useTutorConversation";

/**
 * Hosts the shared Sage experience beside the page, plus the mobile tutor drawer.
 * Article screens already bring their own chapter surface.
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
  const { pathname } = useLocation();
  const ownChrome = pathname.includes("/article");
  const [sageWide, setSageWide] = useState(false);

  useEffect(() => {
    if (!askAI.open) setSageWide(false);
  }, [askAI.open]);

  if (ownChrome) {
    return (
      <div className="flex min-h-0 flex-1">
        <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col", askAI.open && (sageWide ? "hidden" : "hidden lg:flex"))}>
          {children}
        </div>
        {askAI.open && (
          <div className={cn("flex min-h-0 min-w-0", sageWide ? "flex-1" : "flex-1 p-3 lg:flex-none lg:pl-0")}>
            <AskSagePanel
              variant="beside"
              wide={sageWide}
              onWideChange={setSageWide}
              conversation={conversation}
              onClose={askAI.closeAskAI}
              userName={userName.split(" ")[0]}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f8]">
      {header}
      <div className={cn("flex min-h-0 flex-1", !sageWide && "gap-4 px-4 pb-4 lg:px-8")}>
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
            askAI.open && (sageWide ? "hidden" : "hidden lg:flex"),
          )}
        >
          {children}
        </div>
        {askAI.open && (
          <AskSagePanel
            variant="beside"
            wide={sageWide}
            onWideChange={setSageWide}
            conversation={conversation}
            onClose={askAI.closeAskAI}
            userName={userName.split(" ")[0]}
          />
        )}
      </div>
      {!askAI.open && <TutorBottomDrawer conversation={conversation} />}
    </div>
  );
}
