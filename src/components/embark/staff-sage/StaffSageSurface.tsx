import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAskAI } from "@/components/embark/AskAIContext";
import { StaffAskSagePanel } from "./StaffAskSagePanel";
import type { StaffSageScope } from "./answerStaffSage";

/** Ask Sage for the manager and admin. The learner Sage surface is separate. */
export function StaffSageSurface({
  scope,
  userName,
  children,
}: {
  scope: StaffSageScope;
  userName: string;
  children: React.ReactNode;
}) {
  const askAI = useAskAI();
  const [sageWide, setSageWide] = useState(false);

  useEffect(() => {
    if (!askAI.open) setSageWide(false);
  }, [askAI.open]);

  if (!askAI.open) return <>{children}</>;

  return (
    <div className={cn("flex min-h-0 flex-1", !sageWide && "gap-4 px-4 pb-4 lg:px-8")}>
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto",
          sageWide ? "hidden" : "hidden lg:flex",
        )}
      >
        {children}
      </div>
      <StaffAskSagePanel
        scope={scope}
        userName={userName}
        wide={sageWide}
        onWideChange={setSageWide}
        onClose={askAI.closeAskAI}
      />
    </div>
  );
}
