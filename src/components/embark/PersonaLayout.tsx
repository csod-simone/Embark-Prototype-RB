import { Outlet } from "react-router-dom";
import { PersonaSidebar, type PersonaSidebarProps } from "./PersonaSidebar";
import { MobileTabBar } from "./MobileTabBar";
import { BrandBar } from "./BrandBar";
import { SageSurface } from "./SageSurface";
import type { MobileTab } from "./navConfig";

export function PersonaLayout({
  sidebar,
  mobileTabs,
  banner,
  header,
  hideSidebar = false,
  hideBrandBar = false,
  sageUserName,
}: {
  sidebar: PersonaSidebarProps;
  mobileTabs: MobileTab[];
  banner?: React.ReactNode;
  header?: React.ReactNode;
  hideSidebar?: boolean;
  hideBrandBar?: boolean;
  /** When set, the shared Sage experience is mounted for this persona. */
  sageUserName?: string;
}) {
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {header ?? (!hideBrandBar && <BrandBar />)}
      <div className="flex-1 flex min-h-0 w-full">
        {!hideSidebar && <PersonaSidebar {...sidebar} />}
        <div className="flex-1 flex flex-col min-w-0">
          {banner}
          <main className="flex-1 flex flex-col overflow-y-auto pb-[68px] md:pb-0">
            {sageUserName ? (
              <SageSurface userName={sageUserName}>
                <Outlet />
              </SageSurface>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
        <MobileTabBar tabs={mobileTabs} />
      </div>
    </div>
  );
}
