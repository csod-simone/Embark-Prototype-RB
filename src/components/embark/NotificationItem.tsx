import { Link } from "react-router-dom";
import { X, LifeBuoy, AlertTriangle, Unlock, Sparkles, ClipboardCheck, CalendarDays, Bell } from "lucide-react";
import type { Notification, NotificationType } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  help_request: LifeBuoy,
  at_risk: AlertTriangle,
  module_unlock: Unlock,
  nudge: Sparkles,
  assessment: ClipboardCheck,
  event: CalendarDays,
};

export function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss?: (id: string) => void;
}) {
  const Icon = iconMap[notification.type] ?? Bell;
  const mandatoryUnactioned = notification.mandatory && !notification.read;
  const canDismiss = !notification.mandatory && !!onDismiss;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-md border border-border bg-background p-3 pl-4 transition-colors hover:bg-muted/40",
        mandatoryUnactioned && "border-l-4 border-l-destructive",
      )}
    >
      {!notification.read && !mandatoryUnactioned && (
        <span
          aria-hidden="true"
          className="absolute left-1.5 top-4 h-2 w-2 rounded-full bg-primary"
        />
      )}
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {notification.body}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">{notification.timestamp}</span>
          <Link
            to={notification.ctaRoute}
            className="text-xs font-medium text-primary hover:underline"
          >
            {notification.ctaLabel}
          </Link>
        </div>
      </div>
      {canDismiss && (
        <button
          type="button"
          onClick={() => onDismiss?.(notification.id)}
          aria-label="Dismiss notification"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}