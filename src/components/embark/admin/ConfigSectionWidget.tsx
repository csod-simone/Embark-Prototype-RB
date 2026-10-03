import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export type WidgetOption = { label: string; status?: string };
export type WidgetRow = { label: string; description: string; status: string; to?: string };

export function ConfigSectionWidget({
  title,
  description,
  to,
  options = [],
  rows = [],
}: {
  title: string;
  description: string;
  to: string;
  options?: WidgetOption[];
  rows?: WidgetRow[];
}) {
  const sorted = [...options].sort((a, b) => a.label.localeCompare(b.label));
  const shown = sorted.slice(0, 5);
  const overflow = sorted.length - shown.length;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <Link
          to={to}
          className="shrink-0 text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>

      {shown.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {shown.map((o) => (
            <Link
              key={o.label}
              to={to}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 hover:bg-muted"
            >
              <span className="text-xs font-medium text-foreground">{o.label}</span>
              {o.status && <Badge variant="secondary">{o.status}</Badge>}
            </Link>
          ))}
          {overflow > 0 && (
            <span className="text-xs text-muted-foreground">+{overflow} more</span>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-4 divide-y divide-border border-t border-border">
          {rows.map((r) => (
            <Link
              key={r.label}
              to={r.to ?? to}
              className="flex items-center justify-between gap-4 py-3 hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{r.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.description}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{r.status}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
