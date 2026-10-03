import { useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useBrand, type Brand } from "@/hooks/use-brand";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Button } from "@/components/ui/button";
import { useAskAI } from "@/components/embark/AskAIContext";
import { DemoUserSwitcher } from "@/components/embark/DemoUserSwitcher";
import { NotificationPanel } from "@/components/embark/NotificationPanel";
import { notifications as mockNotifications, type Notification } from "@/data/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/embark/BrandLogo";

type UpskillerTab = {
  label: string;
  route: string;
  match: string;
  badge?: number;
  badgeVariant?: "danger" | "default";
};

const UPSKILLER_TABS: UpskillerTab[] = [
  { label: "Home", route: "/upskiller/dashboard", match: "/upskiller/dashboard" },
  { label: "Live Events", route: "/upskiller/events", match: "/upskiller/events" },
  { label: "Hands Raised", route: "/upskiller/hands-raised", match: "/upskiller/hands-raised" },
  { label: "My History", route: "/upskiller/history", match: "/upskiller/history" },
  {
    label: "AI Rationale",
    route: "/upskiller/dashboard?tab=ai_rationale",
    match: "/upskiller/ai-rationale",
  },
];

const userName = "Riley Chen";
const userEmail = "riley.chen@company.com";
const userInitials = "RC";

export function UpskillerTopHeader() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { theme, toggleTheme } = useTheme();
  const { brand, setBrand } = useBrand();
  const askAI = useAskAI();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<Notification[]>(mockNotifications);
  const unread = notifItems.filter((n) => !n.read).length;

  const brandOptions: { id: Brand; label: string; dot: string }[] = [];

  const isActive = (tab: UpskillerTab) => {
    if (tab.match === "/upskiller/ai-rationale") {
      return pathname === "/upskiller/dashboard" && tabParam === "ai_rationale";
    }
    if (tab.match === "/upskiller/dashboard") {
      return (
        (pathname === "/upskiller/dashboard" && tabParam !== "ai_rationale") ||
        pathname === "/upskiller/generating"
      );
    }
    return pathname === tab.match || pathname.startsWith(`${tab.match}/`);
  };

  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-card flex-shrink-0">
      <div className="col-start-1 flex shrink-0 items-center gap-3 justify-self-start">
        <a href="/upskiller/dashboard" aria-label="Rathbones home" className="inline-flex items-center">
          <BrandLogo />
        </a>
        <DemoUserSwitcher variant="inline" />
      </div>

      <nav className="col-start-2 hidden md:flex self-stretch items-center justify-center gap-1 overflow-x-auto min-w-0" aria-label="Sections">
        {UPSKILLER_TABS.map((t) => {
          const active = isActive(t);
          return (
            <NavLink
              key={t.label}
              to={t.route}
              end
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center self-stretch gap-2 px-4 text-sm whitespace-nowrap transition-colors",
                active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {t.badge !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
                    t.badgeVariant === "danger"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {t.badge}
                </span>
              )}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-3 right-3 bottom-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="col-start-3 flex items-center gap-2 justify-self-end">
        <Button
          size="sm"
          onClick={askAI.toggleAskAI}
          aria-label="Ask Sage"
          aria-pressed={askAI.open}
          className={cn(
            "gap-1.5 rounded-full border text-primary hover:bg-primary/25 shadow-none font-semibold",
            askAI.open ? "border-primary bg-primary/25" : "border-primary/30 bg-primary/15",
          )}
        >
          <AskSageIcon size={14} />
          Ask Sage
        </Button>
        <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
            >
              <Bell size={18} aria-hidden="true" />
              {unread > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full",
                    "bg-destructive text-destructive-foreground text-[10px] font-semibold",
                  )}
                >
                  {unread}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <NotificationPanel
              notifications={notifItems}
              onDismiss={(id) => setNotifItems((prev) => prev.filter((n) => n.id !== id))}
              onMarkAllRead={() => setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            />
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-muted text-xs font-semibold hover:opacity-90 transition"
            >
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0">
            <div className="flex items-center gap-3 px-3 py-3">
              <div className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
              </div>
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div className="py-1">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                className="px-3 py-2 gap-3"
              >
                {theme === "dark" ? (
                  <Sun size={16} className="text-muted-foreground" />
                ) : (
                  <Moon size={16} className="text-muted-foreground" />
                )}
                <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div className="py-1">
              {brandOptions.map((b) => (
                <DropdownMenuItem
                  key={b.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    setBrand(b.id);
                  }}
                  className="px-3 py-2 gap-3"
                >
                  <span className={cn("h-3.5 w-3.5 rounded-full", b.dot)} aria-hidden="true" />
                  <span className="flex-1">{b.label}</span>
                  {brand === b.id && <Check size={16} className="text-foreground" />}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div className="py-1">
              <DropdownMenuItem className="px-3 py-2 gap-3">
                <SettingsIcon size={16} className="text-muted-foreground" />
                <span>Profile settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 gap-3">
                <FileText size={16} className="text-muted-foreground" />
                <span className="flex-1">Terms and Policies</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 gap-3">
                <HelpCircle size={16} className="text-muted-foreground" />
                <span>Get help</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 gap-3">
                <LogOut size={16} className="text-muted-foreground" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
