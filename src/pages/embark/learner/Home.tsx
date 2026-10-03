import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { TabBar, type TabBarTab } from "@/components/embark/TabBar";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { TutorBottomDrawer } from "./home/TutorBottomDrawer";
import { JourneyTabContent, activeHandsRaisedCount } from "./home/JourneyTabs";
import { learnerLiveEventsCount } from "@/data/tabCounts";
import { useTutorConversation } from "./home/useTutorConversation";
import { AskSagePanel } from "./home/AskSagePanel";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useDailyRecaps } from "@/hooks/use-daily-recaps";
import { RecapInterstitial } from "@/components/embark/RecapInterstitial";
import { Button } from "@/components/ui/button";
import { useAskAI } from "@/components/embark/AskAIContext";
import { DemoUserSwitcher } from "@/components/embark/DemoUserSwitcher";
import { BrandLogo } from "@/components/embark/BrandLogo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationPanel } from "@/components/embark/NotificationPanel";
import { notifications as mockNotifications, type Notification } from "@/data/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LearnerSurface } from "@/components/embark/layouts/LearnerSurface";
import { useOrganisation } from "@/hooks/use-organisation";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";

const tabs: TabBarTab[] = [
  { id: "current", label: "Dashboard" },
  { id: "live_events", label: "Live Events", badge: learnerLiveEventsCount },
  {
    id: "hands_raised",
    label: "Hands Raised",
    badge: activeHandsRaisedCount > 0 ? activeHandsRaisedCount : undefined,
  },
  { id: "my_history", label: "My History" },
];

const VALID_TABS = ["current", "live_events", "hands_raised", "my_history"] as const;
type ValidTab = (typeof VALID_TABS)[number];
const isValidTab = (v: string | null): v is ValidTab =>
  !!v && (VALID_TABS as readonly string[]).includes(v);

const START_OF_DAY_SESSION_KEY = "embark:start-of-day-shown";

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { brand, setBrand } = useBrand();
  const { org } = useOrganisation();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: ValidTab = isValidTab(tabParam) ? tabParam : "current";
  const [activeTab, setActiveTab] = useState<ValidTab>(initialTab);

  useEffect(() => {
    if (isValidTab(tabParam)) {
      setActiveTab(tabParam);
    } else if (tabParam !== null) {
      setActiveTab("current");
    }
  }, [tabParam]);

  const conversation = useTutorConversation();
  const askAI = useAskAI();
  const { progress } = useModule3Progress();
  const mod3Complete = progress.rolePlayDone;
  const modulesDone = mod3Complete ? 3 : 2;
  const sessionsDone = mod3Complete ? 10 : 6;

  const recaps = useDailyRecaps();
  const [openRecap, setOpenRecap] = useState<"startOfDay" | "midDay" | "endOfDay" | null>(null);

  useEffect(() => {
    if (!recaps.master || !recaps.startOfDay) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(START_OF_DAY_SESSION_KEY) === "1") return;
    setOpenRecap("startOfDay");
  }, [recaps.master, recaps.startOfDay]);

  const dismissRecap = () => {
    if (openRecap === "startOfDay" && typeof window !== "undefined") {
      window.sessionStorage.setItem(START_OF_DAY_SESSION_KEY, "1");
    }
    setOpenRecap(null);
  };

  const showStartOfDayButton = recaps.master && recaps.startOfDay;
  const showMidDayButton = recaps.master && recaps.midDay;
  const showEndOfDayButton = recaps.master && recaps.endOfDay;

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<Notification[]>(mockNotifications);
  const unread = notifItems.filter((n) => !n.read).length;
  const userName = RATHBONES_USERS.learner.name;
  const userEmail = "andrew.burton@rathbones.com";
  const userInitials = "AB";

  const brandOptions: { id: Brand; label: string; dot: string }[] = [];

  const TopHeader = (
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-8 h-16 border-b border-border bg-card">
      <div className="col-start-1 flex shrink-0 items-center gap-3 justify-self-start">
        <a href="#" aria-label="Rathbones home" className="inline-flex items-center">
          <BrandLogo />
        </a>
        <DemoUserSwitcher variant="inline" />
      </div>
      {!askAI.open && (
        <nav className="col-start-2 hidden md:flex items-center justify-center gap-1 h-full min-w-0 overflow-x-auto" role="tablist" aria-label="Sections">
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id as ValidTab)}
                className={cn(
                  "relative inline-flex items-center gap-2 h-full px-4 text-sm transition-colors",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
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
                  <span aria-hidden="true" className="absolute left-3 right-3 bottom-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      )}
      <div className="col-start-3 flex items-center gap-2 justify-self-end">
        <Button
          size="sm"
          onClick={askAI.toggleAskAI}
          aria-label="Ask Sage"
          aria-pressed={askAI.open}
          className="gap-1.5 px-4"
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

  return (
    <>
    <LearnerSurface
      header={TopHeader}
      contentClassName={askAI.open ? "hidden lg:flex" : undefined}
      aside={
        askAI.open ? (
          <div className="flex min-h-0 flex-1 lg:flex-none">
            <AskSagePanel
              variant="beside"
              conversation={conversation}
              onClose={askAI.closeAskAI}
              userName={userName.split(" ")[0]}
            />
          </div>
        ) : undefined
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="md:hidden overflow-x-auto px-4 sm:px-6">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as ValidTab)} />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <PageContainer as="div">
            <JourneyTabContent
              activeTab={activeTab}
              onAskSage={askAI.toggleAskAI}
              programHeader={{
                title:
                  org === "rathbones"
                    ? "Medicare CSR Full Onboarding Journey"
                    : "RN Dialysis Onboarding · ICHD",
                day: "Day 5/15",
                modulesDone,
                sessionsDone,
              }}
            />

            {(showStartOfDayButton || showMidDayButton || showEndOfDayButton) && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-4">
                {showStartOfDayButton && (
                  <Button variant="ghost" size="sm" onClick={() => setOpenRecap("startOfDay")}>
                    Preview: Start of Day Recap
                  </Button>
                )}
                {showMidDayButton && (
                  <Button variant="ghost" size="sm" onClick={() => setOpenRecap("midDay")}>
                    Preview: Mid-Day Recap
                  </Button>
                )}
                {showEndOfDayButton && (
                  <Button variant="ghost" size="sm" onClick={() => setOpenRecap("endOfDay")}>
                    Preview: End of Day Summary
                  </Button>
                )}
              </div>
            )}
          </PageContainer>
        </div>
      </div>
    </LearnerSurface>
    <TutorBottomDrawer conversation={conversation} />
    {openRecap && (
      <RecapInterstitial
        variant={openRecap}
        onDismiss={dismissRecap}
        onSecondary={
          openRecap === "endOfDay"
            ? () => {
                setOpenRecap(null);
                navigate("/learner/history");
              }
            : undefined
        }
      />
    )}
  </>
  );
}
