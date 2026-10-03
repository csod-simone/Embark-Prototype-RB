import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  HelpCircle,
  KeyRound,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useBrand, type Brand } from "@/hooks/use-brand";
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
import { useTrainerView } from "@/hooks/use-trainer-view";
import { useCohortSettings } from "@/hooks/use-cohort-settings";
import { BrandLogo } from "@/components/embark/BrandLogo";
import { trainerEventsCount, trainerHandsRaisedCount } from "@/data/tabCounts";

type TrainerTab = {
  label: string;
  route: string;
  match: string;
  badge?: number;
  badgeVariant?: "danger" | "default";
};

const TRAINER_TABS: TrainerTab[] = [
  { label: "Overview", route: "/trainer/home", match: "/trainer/home" },
  { label: "My Events", route: "/trainer/events", match: "/trainer/events", badge: trainerEventsCount },
  { label: "My Learners", route: "/trainer/learners", match: "/trainer/learners" },
  { label: "Hands Raised", route: "/trainer/hands-raised", match: "/trainer/hands-raised", badge: trainerHandsRaisedCount, badgeVariant: "danger" },
  { label: "Analytics", route: "/trainer/analytics", match: "/trainer/analytics" },
];

const userName = "Marcus Hale";
const userEmail = "marcus.hale@company.com";
const userInitials = "MH";

export function TrainerTopHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { brand, setBrand } = useBrand();
  const { secondaryTrainerEnabled } = useCohortSettings();
  const { mode, setMode, hasSecondaryAssignments } = useTrainerView();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<Notification[]>(mockNotifications);
  const unread = notifItems.filter((n) => !n.read).length;

  const brandOptions: { id: Brand; label: string; dot: string }[] = [];

  const isActive = (tab: TrainerTab) => {
    if (tab.match === "/trainer/learners") {
      return pathname.startsWith("/trainer/learners") || pathname.startsWith("/trainer/learner/");
    }
    return pathname === tab.match || pathname.startsWith(`${tab.match}/`);
  };

  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-card flex-shrink-0">
      <div className="col-start-1 flex shrink-0 items-center gap-3 justify-self-start">
        <a href="/trainer/home" aria-label="Rathbones home" className="inline-flex items-center">
          <BrandLogo />
        </a>
        <DemoUserSwitcher variant="inline" />
      </div>

      <nav className="col-start-2 hidden md:flex self-stretch items-center justify-center gap-1 overflow-x-auto min-w-0" aria-label="Sections">
        {TRAINER_TABS.map((t) => {
          const active = isActive(t);
          return (
            <NavLink
              key={t.route}
              to={t.route}
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
        {secondaryTrainerEnabled && (
          <div
            role="group"
            aria-label="Trainer role view"
            className="hidden lg:inline-flex items-center rounded-md border border-border bg-muted p-0.5"
          >
            <button
              type="button"
              aria-pressed={mode === "primary"}
              onClick={() => setMode("primary")}
              className={cn(
                "px-3 h-8 rounded-[5px] text-xs font-medium transition-colors",
                mode === "primary"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Primary Trainer
            </button>
            <button
              type="button"
              aria-pressed={mode === "secondary"}
              disabled={!hasSecondaryAssignments}
              onClick={() => setMode("secondary")}
              className={cn(
                "px-3 h-8 rounded-[5px] text-xs font-medium transition-colors",
                "disabled:pointer-events-none disabled:opacity-50",
                mode === "secondary"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Secondary Trainer
            </button>
          </div>
        )}
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
              <DropdownMenuItem onClick={() => navigate("/admin")} className="px-3 py-2 gap-3">
                <KeyRound size={16} className="text-muted-foreground" />
                <span>Switch to Admin</span>
              </DropdownMenuItem>
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
