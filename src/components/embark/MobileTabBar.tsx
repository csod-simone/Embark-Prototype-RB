import { NavLink } from "react-router-dom";
import type { MobileTab } from "./navConfig";
import { cn } from "@/lib/utils";

export function MobileTabBar({ tabs }: { tabs: MobileTab[] }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border md:hidden"
    >
      <ul className="flex items-stretch">
        {tabs.slice(0, 5).map((tab) => (
          <li key={tab.label} className="flex-1">
            <NavLink
              to={tab.route}
              onClick={tab.onClick ? (e) => { e.preventDefault(); tab.onClick!(); } : undefined}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 min-h-[52px] px-1 py-2 text-[11px] font-medium",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <tab.icon size={18} aria-hidden="true" />
              <span className="truncate">{tab.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}