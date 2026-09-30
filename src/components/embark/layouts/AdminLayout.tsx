import { Outlet } from "react-router-dom";
import { AdminTopHeader } from "../AdminTopHeader";
import { MobileTabBar } from "../MobileTabBar";
import { adminMobileTabs } from "../navConfig";
import { AskAIProvider, useAskAI } from "../AskAIContext";
import { StaffSageSurface } from "../staff-sage/StaffSageSurface";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";
import { cn } from "@/lib/utils";

function AdminShell() {
  const { open } = useAskAI();
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <AdminTopHeader />
      <div className="flex-1 flex min-h-0 w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <main className={cn("flex-1 flex flex-col min-h-0 pb-[68px] md:pb-0", open ? "overflow-hidden" : "overflow-y-auto")}>
            <StaffSageSurface scope="admin" userName={RATHBONES_USERS.admin.name}>
              <Outlet />
            </StaffSageSurface>
          </main>
        </div>
        <MobileTabBar tabs={adminMobileTabs} />
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AskAIProvider>
      <AdminShell />
    </AskAIProvider>
  );
}
