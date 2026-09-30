import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type CrumbItem = { label: string; href?: string };

export function BreadcrumbBar({ items }: { items: CrumbItem[] }) {
  const isMobile = useIsMobile();
  if (!items || items.length === 0) return null;

  let display = items;
  if (isMobile && items.length > 2) {
    display = [items[0], { label: "…" }, items[items.length - 1]];
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
      {display.map((item, i) => {
        const isLast = i === display.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link to={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
            ) : (
              <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}