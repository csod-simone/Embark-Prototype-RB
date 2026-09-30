import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, X, PanelLeftClose, PanelLeftOpen, GalleryVerticalEnd, LayoutDashboard, Sparkles, Compass, TrendingUp, Rocket, MessageCircle, HeartPulse, ArrowRightLeft, Target, Network, Activity, ShieldCheck, Map, User, Users, BookOpen, Camera, Briefcase, GraduationCap, Bot, MoreHorizontal, Check } from "lucide-react";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import aiNativeIcon from "@/assets/icons/ai-native-experience.svg";
import skillsVisibilityIcon from "@/assets/icons/skills-visibility.svg";
import suggestionIcon from "@/assets/icons/suggestion.svg";
import performanceMgmtIcon from "@/assets/icons/performance-management.svg";
import fundamentalsIcon from "@/assets/icons/fundamentals.svg";
import targetIcon from "@/assets/icons/target.svg";
import delightCandidatesIcon from "@/assets/icons/delight-candidates.svg";
import toolsAndTipsIcon from "@/assets/icons/tools-and-tips.svg";
import uniqueIcon from "@/assets/icons/unique.svg";
import planIcon from "@/assets/icons/plan.svg";
import favoritesIcon from "@/assets/icons/favorites.svg";
import ideationIcon from "@/assets/icons/ideation.svg";
import fortuneIcon from "@/assets/icons/fortune.svg";

const makeImgIcon = (src: string, alt: string) => {
  const Comp = ({ size = 20 }: { size?: number; style?: React.CSSProperties; "aria-hidden"?: boolean }) => (
    <img src={src} alt={alt} width={size} height={size} aria-hidden="true" style={{ display: "block" }} />
  );
  Comp.displayName = `ImgIcon(${alt})`;
  return Comp;
};

const ActionCenterIcon = makeImgIcon(aiNativeIcon, "Action center");
const SkillsIcon = makeImgIcon(skillsVisibilityIcon, "Skills");
const ReflectionIcon = makeImgIcon(suggestionIcon, "Reflection");
const SnapshotIcon = makeImgIcon(performanceMgmtIcon, "Snapshot");
const EmbarkIcon = makeImgIcon(fundamentalsIcon, "Embark");
const GoalsIcon = makeImgIcon(targetIcon, "Goals");
const IdpCoachIcon = makeImgIcon(delightCandidatesIcon, "IDP coach");
const AiHelpIcon = makeImgIcon(toolsAndTipsIcon, "AI help");
const MyCareerIcon = makeImgIcon(uniqueIcon, "My career");
const InternalMobilityIcon = makeImgIcon(planIcon, "Internal mobility");
const TeamHealthIcon = makeImgIcon(favoritesIcon, "Team health");
const WorkforceValueIcon = makeImgIcon(ideationIcon, "Workforce value");
const FutureOfWorkIcon = makeImgIcon(fortuneIcon, "Future of work");

type Mode = "me" | "team";

type NavItem = { icon: React.ElementType; label: string; to: string; iconColor?: string; iconSize?: number; children?: NavItem[]; status?: StatusInfo };
type NavSection = { title?: string; items: NavItem[] };

const meSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Action center", to: "/me", iconColor: "muted" },
      { icon: User, label: "Skills", to: "/skills", iconColor: "muted", status: { tone: "green", text: "AI/ML skill improved" } },
      { icon: BookOpen, label: "Reflection", to: "/reflections", iconColor: "muted" },
      { icon: Camera, label: "Snapshot", to: "/snapshot", iconColor: "muted" },
      { icon: Users, label: "1 on 1 agenda", to: "/one-on-one-agenda", iconColor: "muted", status: { tone: "red", text: "Review with Mateo" } },
    ],
  },
  {
    title: "Grow",
    items: [
      { icon: Rocket, label: "Embark", to: "/embark", iconColor: "muted" },
      { icon: Map, label: "Learning spaces", to: "/learning-spaces", iconColor: "muted" },
      { icon: MessageCircle, label: "Roleplay", to: "/roleplay", iconColor: "muted" },
      { icon: Target, label: "Goals", to: "/goals", iconColor: "muted", status: { tone: "green", text: "3 skills to build" } },
      { icon: GraduationCap, label: "IDP coach", to: "/idp-coach", iconColor: "muted" },
      { icon: Bot, label: "AI help", to: "/ai-help", iconColor: "muted" },
      { icon: Briefcase, label: "My career", to: "/my-career", iconColor: "muted" },
    ],
  },
];

type StatusTone = "green" | "red" | "blue";
type StatusInfo = { tone: StatusTone; text: string };
type NavItemWithStatus = NavItem & { status?: StatusInfo };
type TeamSection = {
  title?: string;
  collapsible?: boolean;
  items: { icon: React.ElementType; label: string; to: string; iconColor?: string; status?: StatusInfo; iconSize?: number }[];
};

const teamSections: TeamSection[] = [
  {
    title: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Action center", to: "/team", iconColor: "muted" },
    ],
  },
  {
    title: "My profile",
    collapsible: true,
    items: [
      { icon: User, label: "Skills", to: "/skills", iconColor: "muted" },
      { icon: BookOpen, label: "Reflection", to: "/reflections", iconColor: "muted" },
      { icon: Camera, label: "Snapshot", to: "/snapshot", iconColor: "muted" },
    ],
  },
  {
    title: "Agent packs",
    collapsible: true,
    items: [
      { icon: Sparkles, label: "Skills architect", to: "/skills-architect", iconColor: "muted", status: { tone: "green", text: "52 skills mapped" } },
      { icon: Compass, label: "Future of work", to: "/future-of-work", iconColor: "muted", status: { tone: "green", text: "Redesign analysis ready" } },
      { icon: TrendingUp, label: "Workforce value", to: "/workforce-value", iconColor: "muted" },
      { icon: Rocket, label: "Embark Navigator", to: "/embark-navigator", iconColor: "muted", status: { tone: "red", text: "17 at risk" } },
      { icon: MessageCircle, label: "Proactive coaching", to: "/proactive-coaching", iconColor: "muted", status: { tone: "red", text: "5 reports at-risk" } },
      { icon: HeartPulse, label: "Team health", to: "/team-health", iconColor: "muted" },
      { icon: ArrowRightLeft, label: "Internal mobility", to: "/internal-mobility", iconColor: "muted", status: { tone: "green", text: "2 decisions pending" } },
      { icon: Target, label: "Dynamic goals", to: "/dynamic-goals", iconColor: "muted", status: { tone: "blue", text: "Reviewing Q2 drafts" } },
    ],
  },
];


export function AppSidebar({ mode = "me", forceCollapsed = false }: { activePage?: string; mode?: Mode; forceCollapsed?: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { collapsed, setCollapsed } = useSidebarCollapsed();
  const isPaperRoute = pathname === "/paper";
  // Default collapsed/expanded state per section title.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "My profile": false,
    "Agent packs": isPaperRoute,
    "Grow": false,
  });
  type AgentPacksFilter = "all" | "active" | "recent";
  const [agentPacksFilter, setAgentPacksFilter] = useState<AgentPacksFilter>(isPaperRoute ? "all" : "active");
  const [growFilter, setGrowFilter] = useState<AgentPacksFilter>("active");

  const MY_PROFILE_TOGGLEABLE = ["Skills", "Reflection", "Snapshot", "Roleplay", "My career"] as const;
  const [myProfileVisible, setMyProfileVisible] = useState<string[]>([
    "Snapshot",
  ]);
  const [myProfileDraft, setMyProfileDraft] = useState<string[]>(myProfileVisible);
  const [myProfileMenuOpen, setMyProfileMenuOpen] = useState(false);

  const WORKSPACE_TOGGLEABLE = ["Skills", "Reflection", "Snapshot", "1 on 1 agenda"] as const;
  const [workspaceVisible, setWorkspaceVisible] = useState<string[]>(["Skills", "Snapshot", "1 on 1 agenda"]);
  const [workspaceDraft, setWorkspaceDraft] = useState<string[]>(workspaceVisible);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  useEffect(() => {
    setCollapsed(forceCollapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceCollapsed]);

  const isCombined = pathname === "/combined" || pathname === "/paper" || pathname === "/team";
  const isPaper = pathname === "/paper";
  const isMe = mode === "me";
  const combinedSections: TeamSection[] = [
    {
      title: "My profile",
      collapsible: true,
      items: [
        { icon: LayoutDashboard, label: "Action center", to: "/team", iconColor: "muted" },
        { icon: User, label: "Skills", to: "/skills", iconColor: "muted" },
        { icon: BookOpen, label: "Reflection", to: "/reflections", iconColor: "muted" },
        { icon: Camera, label: "Snapshot", to: "/snapshot", iconColor: "muted" },
        { icon: MessageCircle, label: "Roleplay", to: "/roleplay", iconColor: "muted" },
        { icon: Briefcase, label: "My career", to: "/my-career", iconColor: "muted" },
      ],
    },
    ...teamSections.filter((s) => s.title === "Agent packs"),
  ];
  let sections: (NavSection | TeamSection)[] = mode === "team"
    ? (isCombined
        ? combinedSections
        : teamSections
            .filter((s) => s.title !== "My profile")
            .map((s) => s.title === "Workspace" ? { ...s, collapsible: true } : s))
    : meSections.map((s) =>
        s.title === "Workspace"
          ? {
              ...s,
              collapsible: true,
              items: s.items.filter(
                (i) =>
                  !WORKSPACE_TOGGLEABLE.includes(i.label as typeof WORKSPACE_TOGGLEABLE[number]) ||
                  workspaceVisible.includes(i.label),
              ),
            }
      : s.title === "Grow"
      ? { ...s, collapsible: true, items: s.items.filter((i) => i.label !== "Learning spaces") }
      : s,
      );
  if (isCombined) {
    sections = sections.map((s) =>
      s.title === "My profile"
        ? {
            ...s,
            items: s.items.filter(
              (i) => isPaper || !MY_PROFILE_TOGGLEABLE.includes(i.label as typeof MY_PROFILE_TOGGLEABLE[number]) || myProfileVisible.includes(i.label),
            ),
          }
        : s,
    );
  }
  const isSectionOpen = (title?: string) => {
    if (!title) return true;
    // Sections without a toggle chevron are always open.
    if (isCombined && title === "My profile") return true;
    if (isMe && title === "Workspace") return true;
    if (mode === "team" && !isCombined && title === "Workspace") return true;
    if (isPaper && title === "Agent packs") return true;
    return openSections[title] !== false;
  };
  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !isSectionOpen(title) }));

  const filterAgentPacksItems = (
    items: TeamSection["items"],
    open: boolean,
  ) => {
    if (open) return items;
    if (agentPacksFilter === "all") return [];
    if (agentPacksFilter === "active") return items.filter((i) => i.status);
    return items.filter((i) => i.status).slice(0, 3);
  };

  return (
    <aside
      aria-label="Main sidebar"
      className={`${collapsed ? "w-16" : "w-[240px]"} flex-shrink-0 bg-background flex flex-col border-r border-border h-full overflow-y-auto transition-[width] duration-200`}
    >
      <nav className={`flex-1 p-3 ${collapsed ? "pt-12" : "pt-4"} space-y-3`} aria-label="Main navigation">

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (idx > 0 || (isCombined && section.title === "My profile") || (isMe && section.title === "Workspace") || (mode === "team" && !isCombined && section.title === "Workspace")) && section.title && (
              (section as TeamSection).collapsible ? (
                <div className={`w-full flex items-center justify-between pt-3 pb-1 text-muted-foreground text-sm font-medium ${
                  ((isMe && (section.title === "Workspace" || section.title === "Grow")) ||
                   (isCombined && (section.title === "My profile" || section.title === "Agent packs")) ||
                   (mode === "team" && !isCombined && (section.title === "Workspace" || section.title === "Agent packs")))
                    ? "pl-4 pr-0" : "px-4"
                }`}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title!)}
                    aria-expanded={isSectionOpen(section.title)}
                    aria-controls={`section-${idx}`}
                    className="flex-1 flex items-center justify-between hover:text-foreground transition-colors"
                  >
                    <span>{section.title}</span>
                  </button>
                  <div className="flex items-center gap-1 ml-2">
                    {isCombined && !isPaper && section.title === "My profile" && (
                      <Popover
                        open={myProfileMenuOpen}
                        onOpenChange={(open) => {
                          setMyProfileMenuOpen(open);
                          if (open) setMyProfileDraft(myProfileVisible);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label="My profile visibility"
                           className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5 hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} aria-hidden="true" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" side="bottom" className="w-56 p-2">
                          <button
                            type="button"
                            onClick={() => setMyProfileDraft([...MY_PROFILE_TOGGLEABLE])}
                            className="w-full text-left text-sm font-medium px-2 py-1.5 rounded hover:bg-foreground/5 focus:bg-foreground/5 focus:text-foreground focus:outline-none text-foreground"
                          >
                            Show all
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <div className="space-y-0.5">
                            {MY_PROFILE_TOGGLEABLE.map((label) => {
                              const checked = myProfileDraft.includes(label);
                              return (
                                <label
                                  key={label}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-foreground hover:bg-foreground/5 focus:bg-foreground/5 focus-within:bg-foreground/5 cursor-pointer"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      setMyProfileDraft((prev) =>
                                        v
                                          ? Array.from(new Set([...prev, label]))
                                          : prev.filter((l) => l !== label),
                                      );
                                    }}
                                  />
                                  <span>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                          <div className="mt-2 pt-2 border-t border-border flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setMyProfileVisible(myProfileDraft);
                                setMyProfileMenuOpen(false);
                              }}
                              className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                            >
                              Save view
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    {mode === "team" && section.title === "Agent packs" && !isPaper && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label="Agent packs filter"
                            className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5 hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} aria-hidden="true" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" className="w-52">
                          {([
                            { value: "all", label: "Show all agents" },
                            { value: "active", label: "Show only active agents" },
                            { value: "recent", label: "Show recent agents" },
                          ] as { value: AgentPacksFilter; label: string }[]).map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              onSelect={() => setAgentPacksFilter(opt.value)}
                              className="flex items-center justify-between gap-2 focus:bg-foreground/5 focus:text-foreground"
                            >
                              <span>{opt.label}</span>
                              {agentPacksFilter === opt.value && <Check size={14} aria-hidden="true" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {isMe && section.title === "Grow" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label="Grow filter"
                            className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5 hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} aria-hidden="true" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" className="w-52">
                          {([
                            { value: "all", label: "Show all agents" },
                            { value: "active", label: "Show only active agents" },
                            { value: "recent", label: "Show recent agents" },
                          ] as { value: AgentPacksFilter; label: string }[]).map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              onSelect={() => setGrowFilter(opt.value)}
                              className="flex items-center justify-between gap-2 focus:bg-foreground/5 focus:text-foreground"
                            >
                              <span>{opt.label}</span>
                              {growFilter === opt.value && <Check size={14} aria-hidden="true" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {isMe && section.title === "Workspace" && (
                      <Popover
                        open={workspaceMenuOpen}
                        onOpenChange={(open) => {
                          setWorkspaceMenuOpen(open);
                          if (open) setWorkspaceDraft(workspaceVisible);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label="Workspace visibility"
                            className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5 hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} aria-hidden="true" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" side="bottom" className="w-56 p-2">
                          <button
                            type="button"
                            onClick={() => setWorkspaceDraft([...WORKSPACE_TOGGLEABLE])}
                            className="w-full text-left text-sm font-medium px-2 py-1.5 rounded hover:bg-foreground/5 focus:bg-foreground/5 focus:text-foreground focus:outline-none text-foreground"
                          >
                            Show all
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <div className="space-y-0.5">
                            {WORKSPACE_TOGGLEABLE.map((label) => {
                              const checked = workspaceDraft.includes(label);
                              return (
                                <label
                                  key={label}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-foreground hover:bg-foreground/5 focus:bg-foreground/5 focus-within:bg-foreground/5 cursor-pointer"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      setWorkspaceDraft((prev) =>
                                        v
                                          ? Array.from(new Set([...prev, label]))
                                          : prev.filter((l) => l !== label),
                                      );
                                    }}
                                  />
                                  <span>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                          <div className="mt-2 pt-2 border-t border-border flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setWorkspaceVisible(workspaceDraft);
                                setWorkspaceMenuOpen(false);
                              }}
                              className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                            >
                              Save view
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    {isPaper && section.title === "My profile" ? null : isPaper && section.title === "Agent packs" ? null : (isCombined && section.title === "My profile") || (isMe && section.title === "Workspace") || (mode === "team" && !isCombined && section.title === "Workspace") ? (
                      <span className="h-7 w-7 inline-block" aria-hidden="true" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title!)}
                        aria-label={`Toggle ${section.title}`}
                        className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5 hover:text-foreground transition-colors"
                      >
                        {isSectionOpen(section.title) ? (
                          <ChevronDown size={16} aria-hidden="true" />
                        ) : (
                          <ChevronRight size={16} aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-4 pt-3 pb-1 text-muted-foreground text-sm font-medium">
                  {section.title}
                </div>
              )
            )}
            {collapsed && idx > 0 && (
              <div className="mx-3 my-2 h-px bg-border" aria-hidden="true" />
            )}
            {(collapsed || !(section as TeamSection).collapsible || isSectionOpen(section.title)) && (
              <div id={`section-${idx}`} className="space-y-1">
            {section.items.map((item) => {
              const isItemActive = (to: string) =>
                pathname === to ||
                (to === "/me" && pathname === "/me-2") ||
                (to === "/team" && (pathname === "/combined" || pathname === "/paper"));

              const renderNavItem = (navItem: NavItemWithStatus, depth = 0) => {
                const active = isItemActive(navItem.to);
                return (
                  <div key={navItem.to}>
                    <div style={depth > 0 && !collapsed ? { paddingLeft: `${depth * 16}px` } : undefined}>
                      <SidebarNavItem
                        icon={navItem.icon}
                        label={navItem.label}
                        active={active}
                        collapsed={collapsed}
                        onClick={() => navigate(navItem.to)}
                        iconColor={navItem.iconColor}
                        iconSize={navItem.iconSize ?? 16}
                        status={navItem.status}
                      />
                    </div>
                    {navItem.children && !collapsed && (
                      <div className="space-y-1">
                        {navItem.children.map((child) => renderNavItem(child, depth + 1))}
                      </div>
                    )}
                  </div>
                );
              };

              return renderNavItem(item);
            })}
              </div>
            )}
            {!collapsed && (section as TeamSection).collapsible && !isSectionOpen(section.title) && mode === "team" && section.title === "Agent packs" && agentPacksFilter !== "all" && (
              <div className="space-y-1">
                {filterAgentPacksItems(section.items, false).map((item) => (
                  <SidebarNavItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.to}
                    collapsed={false}
                    onClick={() => navigate(item.to)}
                    iconColor={item.iconColor}
                    iconSize={item.iconSize ?? 16}
                    status={item.status}
                  />
                ))}
              </div>
            )}
            {!collapsed && (section as TeamSection).collapsible && !isSectionOpen(section.title) && isMe && section.title === "Grow" && growFilter !== "all" && (
              <div className="space-y-1">
                {(growFilter === "active"
                  ? section.items.filter((i) => (i as NavItemWithStatus).status)
                  : section.items.filter((i) => (i as NavItemWithStatus).status).slice(0, 3)
                ).map((item) => (
                  <SidebarNavItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.to}
                    collapsed={false}
                    onClick={() => navigate(item.to)}
                    iconColor={(item as NavItemWithStatus).iconColor}
                    iconSize={(item as NavItemWithStatus).iconSize ?? 16}
                    status={(item as NavItemWithStatus).status}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

    </aside>
  );
}

function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
  collapsed = false,
  iconColor,
  status,
  iconSize = 24,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  iconColor?: string;
  status?: { tone: "green" | "red" | "blue"; text: string };
  iconSize?: number;
}) {
  const { pathname } = useLocation();
  const isPaper = pathname.startsWith("/paper");
  const iconStyle =
    iconColor === "muted"
      ? { color: "hsl(var(--muted-foreground))" }
      : { color: "#FA532A" };
  const toneClass =
    status?.tone === "red"
      ? "text-[#c44a2c]"
      : status?.tone === "blue"
      ? "text-[#6E49C6]"
      : "text-[#6E49C6]";
  const dotClass =
    status?.tone === "red"
      ? "bg-[#c44a2c]"
      : status?.tone === "blue"
      ? "bg-[#6E49C6]"
      : "bg-[#6E49C6]";
  const button = (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={`w-full flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-4"} py-2 rounded-[100px] text-sm font-normal border border-transparent transition-all duration-200 ${
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-foreground/5 hover:border-muted-foreground"
      }`}
    >
      <Icon size={iconSize} style={iconStyle} aria-hidden="true" />
      {!collapsed && (
        <span className="flex flex-col items-start leading-tight flex-1 min-w-0">
          <span>{label}</span>
          {status && !isPaper && (
            <span className={`mt-0.5 inline-flex items-center gap-1.5 text-xs ${toneClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
              {status.text}
            </span>
          )}
        </span>
      )}
      {!collapsed && isPaper && status && (
        <span className={`ml-auto h-1.5 w-1.5 rounded-full ${dotClass} shrink-0`} aria-hidden="true" />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="bg-foreground text-background border-foreground/10 shadow-lg font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

