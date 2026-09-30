import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronRight, HelpCircle, Info, LogOut, PanelLeftClose, PanelLeftOpen, Settings as SettingsIcon } from "lucide-react";
import type { NavItem, SubNavItem } from "./navConfig";
import { useIsTablet } from "@/hooks/use-tablet";
import { cn } from "@/lib/utils";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationPanel } from "./NotificationPanel";
import { notifications as mockNotifications, type Notification } from "@/data/mockData";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PersonaSidebarProps = {
  persona: "learner" | "manager" | "trainer" | "admin" | "upskiller";
  items: NavItem[];
  above?: React.ReactNode;
  utilityExtras?: React.ReactNode;
  unreadCount?: number;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  hideNotifications?: boolean;
  hideProfile?: boolean;
};

function Badge({ value, danger }: { value: number | string; danger?: boolean }) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold",
        danger
          ? "bg-destructive text-destructive-foreground"
          : "bg-muted text-foreground",
      )}
    >
      {value}
    </span>
  );
}

function NavItemRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  if (item.children && item.children.length > 0 && !collapsed) {
    return <ExpandableNavItem item={item} />;
  }
  const inner = (
    <NavLink
      to={item.route}
      aria-disabled={item.disabled || undefined}
      onClick={
        item.disabled
          ? (e) => e.preventDefault()
          : item.onClick
            ? (e) => { e.preventDefault(); item.onClick!(); }
            : undefined
      }
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 h-11 px-3 mx-2 rounded-md text-sm font-medium transition-colors",
          item.disabled && "text-muted-foreground opacity-60 cursor-not-allowed",
          !item.disabled && !isActive && "text-foreground hover:bg-muted",
          !item.disabled && isActive && "bg-muted text-primary",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !item.disabled && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary"
            />
          )}
          <item.icon size={18} className={cn(!item.disabled && isActive && "text-primary")} aria-hidden="true" />
          {!collapsed && <span className="truncate">{item.label}</span>}
          {!collapsed && item.infoTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="inline-flex items-center justify-center"
                  aria-label="More info"
                >
                  <Info size={14} className="text-muted-foreground" aria-hidden="true" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">{item.infoTooltip}</TooltipContent>
            </Tooltip>
          )}
          {!collapsed && item.badge != null && (
            <Badge value={item.badge} danger={item.badgeVariant === "danger"} />
          )}

        </>
      )}
    </NavLink>
  );
  if (collapsed || item.disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild><div>{inner}</div></TooltipTrigger>
        <TooltipContent side="right">
          {item.disabled ? (item.disabledReason ?? item.label) : item.label}
        </TooltipContent>
      </Tooltip>
    );
  }
  return inner;
}

function ExpandableNavItem({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const isBranchActive =
    pathname === item.route || pathname.startsWith(item.route + "/");
  const [open, setOpen] = useState(isBranchActive);

  useEffect(() => {
    if (isBranchActive) setOpen(true);
  }, [isBranchActive]);

  const children = item.children ?? [];
  const primary = children.filter((c) => !c.footer);
  const footers = children.filter((c) => c.footer);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "relative w-[calc(100%-1rem)] flex items-center gap-3 h-11 px-3 mx-2 rounded-md text-sm font-medium transition-colors",
          isBranchActive
            ? "bg-muted text-primary"
            : "text-foreground hover:bg-muted",
        )}
      >
        {isBranchActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary"
          />
        )}
        <item.icon size={18} className={cn(isBranchActive && "text-primary")} aria-hidden="true" />
        <span className="truncate">{item.label}</span>
        {item.badge != null && (
          <Badge value={item.badge} danger={item.badgeVariant === "danger"} />
        )}
        <ChevronRight
          size={14}
          aria-hidden="true"
          className={cn(
            "text-muted-foreground transition-transform duration-150",
            !item.badge && "ml-auto",
            open && "rotate-90",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-150 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="ml-6 mr-2 mt-1 pl-3 border-l border-border flex flex-col gap-0.5">
            {primary.map((child) => (
              <li key={child.route + child.label}>
                <SubNavRow child={child} />
              </li>
            ))}
            {footers.length > 0 && (
              <li aria-hidden="true">
                <hr className="my-1 border-border" />
              </li>
            )}
            {footers.map((child) => (
              <li key={child.route + child.label}>
                <SubNavRow child={child} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SubNavRow({ child }: { child: SubNavItem }) {
  return (
    <NavLink
      to={child.route}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 h-8 px-2 rounded-md text-[13px] transition-colors",
          child.footer
            ? "text-primary hover:bg-muted"
            : isActive
              ? "bg-muted text-primary font-medium"
              : "text-foreground hover:bg-muted",
        )
      }
    >
      {child.dot && (
        <span
          aria-hidden="true"
          className={cn(
            "h-2 w-2 rounded-full shrink-0",
            child.dot === "success" ? "bg-success" : "bg-muted-foreground/60",
          )}
        />
      )}
      <span className="truncate">
        {child.footer ? `${child.label} →` : child.label}
      </span>
    </NavLink>
  );
}

export function PersonaSidebar({
  items, above, utilityExtras,
  unreadCount,
  userName = "David Lin",
  userEmail = "david.lin@company.com",
  userInitials = "DL",
  collapsed: collapsedProp,
  onToggleCollapsed,
  hideNotifications = false,
  hideProfile = false,
}: PersonaSidebarProps) {
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const collapsed = isTablet || !!collapsedProp;
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<Notification[]>(mockNotifications);
  const computedUnread = notifItems.filter((n) => !n.read).length;
  const badge = unreadCount ?? computedUnread;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-card border-r border-border flex-shrink-0 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* Zone 1: brand */}
      <div className={cn("flex flex-col gap-3 px-4 pt-5 pb-4", collapsed && "items-center px-2")}>
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-end w-full",
          )}
        >
          {onToggleCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapsed}
                  aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
                  aria-expanded={!collapsed}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
                >
                  {collapsed ? (
                    <PanelLeftOpen size={18} aria-hidden="true" />
                  ) : (
                    <PanelLeftClose size={18} aria-hidden="true" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{collapsed ? "Show menu" : "Hide menu"}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {above && !collapsed && <div className="px-3 pb-2">{above}</div>}

      {/* Zone 2: primary nav */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Primary">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.label}><NavItemRow item={item} collapsed={collapsed} /></li>
          ))}
        </ul>
      </nav>

      {/* Zone 3: utility */}
      <div className={cn("border-t border-border py-3", collapsed ? "px-2" : "px-2")}>
        <ul className="flex flex-col gap-0.5">
          {onToggleCollapsed && null}
          {!hideNotifications && (
          <li>
            <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative w-full flex items-center gap-3 h-11 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Bell size={18} aria-hidden="true" />
                  {!collapsed && <span>Notifications</span>}
                  {badge > 0 && !collapsed && <Badge value={badge} danger />}
                  {badge > 0 && collapsed && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6">
                <SheetHeader className="sr-only"><SheetTitle>Notifications</SheetTitle></SheetHeader>
                <NotificationPanel
                  notifications={notifItems}
                  onDismiss={(id) => setNotifItems((prev) => prev.filter((n) => n.id !== id))}
                  onMarkAllRead={() => setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))}
                />
              </SheetContent>
            </Sheet>
          </li>
          )}
          <li>
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 h-11 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted",
                collapsed && "justify-center px-0",
              )}
            >
              <HelpCircle size={18} aria-hidden="true" />
              {!collapsed && <span>Help</span>}
            </button>
          </li>
          {utilityExtras}
          {!hideProfile && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 h-11 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <span className="h-7 w-7 rounded-full bg-muted inline-flex items-center justify-center text-xs font-semibold">
                    {userInitials}
                  </span>
                  {!collapsed && <span className="truncate">{userName}</span>}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/learner/settings")}>
                  <SettingsIcon size={14} className="mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut size={14} className="mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          )}
        </ul>
      </div>
    </aside>
  );
}