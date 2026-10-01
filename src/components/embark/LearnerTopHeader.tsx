import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  KeyRound,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Sun,
  Check,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useBrand, type Brand } from "@/hooks/use-brand";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Button } from "@/components/ui/button";
import { useAskAI } from "@/components/embark/AskAIContext";
import { DemoUserSwitcher } from "@/components/embark/DemoUserSwitcher";
import { BrandLogo } from "@/components/embark/BrandLogo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationPanel } from "@/components/embark/NotificationPanel";
import {
  notifications as mockNotifications,
  type Notification,
} from "@/data/mockData";
import { activeHandsRaisedCount } from "@/pages/embark/learner/home/JourneyTabs";
import { learnerLiveEventsCount } from "@/data/tabCounts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";

export function LearnerTopHeader({
  onAskSage,
  sageActive,
  showNavTabs = false,
}: {
  onAskSage?: () => void;
  sageActive?: boolean;
  /** Renders the learner home dashboard section tabs in the centre of the bar. */
  showNavTabs?: boolean;
} = {}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { brand, setBrand } = useBrand();
  const askAI = useAskAI();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<Notification[]>(mockNotifications);
  const unread = notifItems.filter((n) => !n.read).length;
  const userName = RATHBONES_USERS.learner.name;
  const userEmail = "andrew.burton@rathbones.com";
  const userInitials = "AB";

  const brandOptions: { id: Brand; label: string; dot: string }[] = [];

  const handsRaisedCount = activeHandsRaisedCount;
  const navTabs: { id: string; label: string; badge?: number; badgeVariant?: "danger" }[] = [
    { id: "current", label: "Dashboard" },
    { id: "live_events", label: "Live Events", badge: learnerLiveEventsCount },
    {
      id: "hands_raised",
      label: "Hands Raised",
      badge: handsRaisedCount > 0 ? handsRaisedCount : undefined,
      badgeVariant: handsRaisedCount > 0 ? "danger" : undefined,
    },
    { id: "my_history", label: "My History" },
  ];

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_minmax(0,max-content)_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-card flex-shrink-0">
      <div className="col-start-1 flex items-center gap-3 min-w-0 justify-self-start">
        <a href="/learner/home" aria-label="Rathbones home" className="inline-flex items-center">
          <BrandLogo />
        </a>
        <DemoUserSwitcher variant="inline" />
      </div>
      {showNavTabs && (
        <nav className="col-start-2 hidden md:flex items-center justify-center gap-1 h-full min-w-0" aria-label="Sections">
          {navTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/learner/home?tab=${t.id}`)}
              className="relative inline-flex items-center gap-2 h-full px-4 text-sm transition-colors text-muted-foreground hover:text-foreground"
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
            </button>
          ))}
        </nav>
      )}
      <div className="col-start-3 flex items-center gap-2 justify-self-end">
        <Button
          size="sm"
          onClick={onAskSage ?? askAI.toggleAskAI}
          aria-label="Ask Sage"
          aria-pressed={sageActive ?? askAI.open}
          className={cn(
            "gap-1.5 rounded-full border text-primary hover:bg-primary/25 shadow-none font-semibold",
            (sageActive ?? askAI.open)
              ? "border-primary bg-primary/25"
              : "border-primary/30 bg-primary/15",
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
            <SheetHeader className="sr-only"><SheetTitle>Notifications</SheetTitle></SheetHeader>
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
              <DropdownMenuItem onClick={() => navigate("/learner/settings")} className="px-3 py-2 gap-3">
                <SettingsIcon size={16} className="text-muted-foreground" />
                <span>Profile settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 gap-3">
                <FileText size={16} className="text-muted-foreground" />
                <span className="flex-1">Terms and Policies</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/learner/help")} className="px-3 py-2 gap-3">
                <HelpCircle size={16} className="text-muted-foreground" />
                <span>Get help</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/", { replace: true })} className="px-3 py-2 gap-3">
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