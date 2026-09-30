import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Sparkles,
  Compass,
  TrendingUp,
  Rocket,
  MessageCircle,
  Activity,
  ArrowLeftRight,
  Target,
  Network,
  Radar,
  ShieldCheck,
  Map,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { UserProfilePopover } from "@/components/UserProfilePopover";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { usePersona } from "@/hooks/use-persona";

type Item = { icon: React.ElementType; label: string; id: string; to?: string };

const topItem: Item = { icon: LayoutGrid, label: "Action Center", id: "action-center", to: "/team" };

const agentItems: Item[] = [
  { icon: Sparkles, label: "Skills Architect", id: "skills-architect" },
  { icon: Compass, label: "Future of Work", id: "future-of-work" },
  { icon: TrendingUp, label: "Workforce Value", id: "workforce-value" },
  { icon: Rocket, label: "Embark Navigator", id: "embark-navigator" },
  { icon: MessageCircle, label: "Proactive Coaching", id: "proactive-coaching" },
  { icon: Activity, label: "Team Health", id: "team-health" },
  { icon: ArrowLeftRight, label: "Internal Mobility", id: "internal-mobility" },
  { icon: Target, label: "Dynamic Goals", id: "dynamic-goals" },
];

const insightItems: Item[] = [
  { icon: Network, label: "People Graph", id: "people-graph" },
  { icon: Radar, label: "Signal Explorer", id: "signal-explorer" },
  { icon: ShieldCheck, label: "Responsible AI", id: "responsible-ai" },
];

const footerNavItem: Item = { icon: Map, label: "Product Map", id: "product-map" };

export function ActionCenterSidebar({ activePage = "action-center" }: { activePage?: string }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { collapsed, setCollapsed } = useSidebarCollapsed();
  const { persona } = usePersona();

  const handleBackgroundClick = () => setCollapsed(!collapsed);
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const widthClass = collapsed ? "w-[68px]" : "w-[300px]";

  const go = (item: Item) => () => {
    if (item.to) navigate(item.to);
  };

  return (
    <aside
      onClick={handleBackgroundClick}
      role="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={`${widthClass} flex-shrink-0 bg-[hsl(var(--sidebar-background))] flex flex-col rounded-[32px] border border-[hsl(var(--sidebar-border))] overflow-hidden sticky top-0 self-start h-[calc(100vh-100px)] transition-[width] duration-200 cursor-pointer`}
    >
      <div className="p-2 pt-6 overflow-y-auto" onClick={stop}>
        <nav className="space-y-1" aria-label="Action center navigation">
          <SidebarNavItem
            icon={topItem.icon}
            label={topItem.label}
            active={activePage === topItem.id}
            onClick={go(topItem)}
            collapsed={collapsed}
          />

          <Divider />

          {agentItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              onClick={go(item)}
              collapsed={collapsed}
            />
          ))}

          <Divider />

          {insightItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              onClick={go(item)}
              collapsed={collapsed}
            />
          ))}

          <Divider />

          <SidebarNavItem
            icon={footerNavItem.icon}
            label={footerNavItem.label}
            active={activePage === footerNavItem.id}
            onClick={go(footerNavItem)}
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-2 pb-6 space-y-1" onClick={stop}>

        {collapsed ? (
          <UserProfilePopover>
            <button aria-label="Open user menu" className="w-full flex items-center justify-center p-2 rounded-[100px] hover:bg-foreground/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold" style={{ fontSize: "var(--text-avatar)" }} role="img" aria-label={`${persona.name} avatar`}>
                {persona.initials}
              </div>
            </button>
          </UserProfilePopover>
        ) : (
          <UserProfilePopover>
            <button aria-label="Open user menu" className="w-full flex items-center gap-[22px] p-4 rounded-[100px] border-t border-foreground/5 hover:bg-foreground/5 transition-colors py-[8px] px-[8px]">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold" style={{ fontSize: "var(--text-avatar)" }} role="img" aria-label={`${persona.name} avatar`}>
                {persona.initials}
              </div>
              <span className="text-base font-bold text-foreground">{persona.name}</span>
            </button>
          </UserProfilePopover>
        )}
      </div>
    </aside>
  );
}

function Divider() {
  return (
    <div className="py-2">
      <div className="border-t border-border" />
    </div>
  );
}

function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
  collapsed = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return (
      <button
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        title={label}
        className={`w-full flex items-center justify-center p-3 rounded-[100px] transition-all duration-200 ${
          active ? "bg-sidebar-accent" : "hover:bg-foreground/5"
        }`}
      >
        <Icon size={24} className={active ? "text-[hsl(var(--icon-selected))]" : "text-[hsl(var(--icon))]"} aria-hidden="true" />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full flex items-center gap-[22px] px-4 py-2 rounded-[100px] text-sm font-normal border transition-all duration-200 ${
        active
          ? "bg-sidebar-accent border-[hsl(var(--sidebar-selected-border))] text-foreground"
          : "border-transparent text-muted-foreground hover:bg-foreground/5"
      }`}
    >
      <Icon size={24} className={active ? "text-[hsl(var(--icon-selected))]" : "text-[hsl(var(--icon))]"} aria-hidden="true" />
      {label}
    </button>
  );
}
