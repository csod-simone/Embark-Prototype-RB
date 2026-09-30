import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ManagerTopHeader } from "../ManagerTopHeader";
import { MobileTabBar } from "../MobileTabBar";
import { managerMobileTabs } from "../navConfig";
import { AskAIProvider, useAskAI } from "../AskAIContext";
import { StaffSageSurface } from "../staff-sage/StaffSageSurface";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";
import { cn } from "@/lib/utils";
import { clearSignalScrollPadding, scrollSignalIntoView } from "../scrollToSignal";

function ManagerShell() {
  const { open } = useAskAI();
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer = 0;
    const tryScroll = () => {
      if (scrollSignalIntoView(id) || attempts > 8) return;
      attempts += 1;
      timer = window.setTimeout(tryScroll, 50);
    };
    tryScroll();
    return () => {
      window.clearTimeout(timer);
      clearSignalScrollPadding();
    };
  }, [hash, pathname]);
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <ManagerTopHeader />
      <div className="flex-1 flex min-h-0 w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <main className={cn("flex-1 flex flex-col min-h-0 pb-[68px] md:pb-0", open ? "overflow-hidden" : "overflow-y-auto")}>
            <StaffSageSurface scope="manager" userName={RATHBONES_USERS.manager.name}>
              <Outlet />
            </StaffSageSurface>
          </main>
        </div>
        <MobileTabBar tabs={managerMobileTabs} />
      </div>
    </div>
  );
}

export default function ManagerLayout() {
  return (
    <AskAIProvider>
      <ManagerShell />
    </AskAIProvider>
  );
}