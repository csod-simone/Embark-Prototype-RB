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
  return (
    <>
      <div className={askAI.open ? "flex flex-1 min-h-0" : "hidden"}>
        <StaffAskSagePanel scope={scope} userName={userName} onClose={askAI.closeAskAI} />
      </div>
      {askAI.open ? null : children}
    </>
  );
}
