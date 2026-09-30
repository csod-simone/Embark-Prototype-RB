import { Outlet } from "react-router-dom";
import { TrainerTopHeader } from "../TrainerTopHeader";
import { MobileTabBar } from "../MobileTabBar";
import { trainerMobileTabs } from "../navConfig";

export default function TrainerLayout() {
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <TrainerTopHeader />
      <div className="flex-1 flex min-h-0 w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 flex flex-col overflow-y-auto pb-[68px] md:pb-0">
            <Outlet />
          </main>
        </div>
        <MobileTabBar tabs={trainerMobileTabs} />
      </div>
    </div>
  );
}