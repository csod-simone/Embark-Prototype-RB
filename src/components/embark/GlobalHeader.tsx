import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { BreadcrumbBar, type CrumbItem } from "./BreadcrumbBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationPanel } from "./NotificationPanel";
import { notifications as mockNotifications, type Notification } from "@/data/mockData";

export function GlobalHeader({
  title,
  breadcrumb,
  unreadCount,
  userInitials = "DL",
}: {
  title: string;
  breadcrumb?: CrumbItem[];
  unreadCount?: number;
  userInitials?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const computedUnread = items.filter((n) => !n.read).length;
  const badge = unreadCount ?? computedUnread;
  // Manager pages surface notifications and the account menu in the top bar,
  // so the in-page header only shows the title/breadcrumb.
  const { pathname } = useLocation();
  const hideUtilities = pathname.startsWith("/manager") || pathname.startsWith("/trainer") || pathname.startsWith("/admin") || pathname.startsWith("/learner/graduating") || pathname.startsWith("/upskiller");
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <h2 className="text-lg font-semibold text-foreground truncate">{title}</h2>
        {breadcrumb && breadcrumb.length > 0 && <BreadcrumbBar items={breadcrumb} />}
      </div>
      {!hideUtilities && (
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications${badge ? ` (${badge} unread)` : ""}`}
              className="relative h-11 w-11 md:h-9 md:w-9 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
            >
              <Bell size={16} aria-hidden="true" />
              {badge > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none border-2 border-background"
                >
                  {badge}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6">
            <NotificationPanel
              notifications={items}
              onDismiss={(id) => setItems((prev) => prev.filter((n) => n.id !== id))}
              onMarkAllRead={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            />
          </SheetContent>
        </Sheet>
        <div
          aria-label="Account"
          className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-muted text-foreground text-sm font-semibold"
        >
          {userInitials}
        </div>
      </div>
      )}
    </header>
  );
}