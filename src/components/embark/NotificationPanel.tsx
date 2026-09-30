import { BellOff } from "lucide-react";
import type { Notification } from "@/data/mockData";
import { NotificationItem } from "./NotificationItem";

export function NotificationPanel({
  notifications,
  onDismiss,
  onMarkAllRead,
}: {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onMarkAllRead: () => void;
}) {
  const mandatory = notifications.filter((n) => n.mandatory);
  const rest = notifications.filter((n) => !n.mandatory);
  const sorted = [...mandatory, ...rest];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-primary hover:underline font-medium"
          >
            Mark all as read
          </button>
          <a href="#" className="text-muted-foreground hover:underline">
            Settings
          </a>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <BellOff className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            You're all caught up — no new notifications.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {sorted.map((n) => (
            <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
          ))}
          <div className="pt-2 text-center">
            <a href="#" className="text-xs text-muted-foreground hover:underline">
              View older notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}