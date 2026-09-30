import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export const TABLE_PAGE_SIZE = 10;

export interface TablePaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Page numbers to render, with `null` marking an ellipsis gap. Max 7 slots. */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

/**
 * Shared pagination bar for admin management tables.
 * Always rendered — when only one page exists every control is disabled.
 */
export function TablePagination({ page, pageCount, onPageChange, className }: TablePaginationProps) {
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), total);

  const go = (next: number) => {
    const clamped = Math.min(Math.max(1, next), total);
    if (clamped !== current) onPageChange(clamped);
  };

  const atFirst = current <= 1;
  const atLast = current >= total;
  const disabledCls = "pointer-events-none opacity-50";

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 pt-3", className)}>
      <span className="text-xs text-muted-foreground">
        Page {current} of {total}
      </span>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={atFirst}
              tabIndex={atFirst ? -1 : undefined}
              className={cn("cursor-pointer", atFirst && disabledCls)}
              onClick={(e) => {
                e.preventDefault();
                go(current - 1);
              }}
            />
          </PaginationItem>
          {pageWindow(current, total).map((p, i) =>
            p === null ? (
              <PaginationItem key={`gap-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === current}
                  aria-label={`Go to page ${p}`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    go(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={atLast}
              tabIndex={atLast ? -1 : undefined}
              className={cn("cursor-pointer", atLast && disabledCls)}
              onClick={(e) => {
                e.preventDefault();
                go(current + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
