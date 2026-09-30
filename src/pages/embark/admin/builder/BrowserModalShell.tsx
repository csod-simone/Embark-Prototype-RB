import { ReactNode, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/ui/search-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const PAGE_SIZE = 10;

export const NEW_SECTION_VALUE = "__new_section__";

export type BuilderSection = { id: string; name: string };

export function SectionTargetPicker({
  sections,
  value,
  onChange,
  onCreateSection,
}: {
  sections: BuilderSection[];
  value: string;
  onChange: (v: string) => void;
  onCreateSection?: (name: string) => string;
}) {
  const hasSections = sections.length > 0;
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name || !onCreateSection) return;
    const id = onCreateSection(name);
    onChange(id);
    setNewName("");
    setCreating(false);
  };

  const cancelCreate = () => {
    setNewName("");
    setCreating(false);
  };

  const handleSelectChange = (v: string) => {
    if (v === NEW_SECTION_VALUE) {
      setCreating(true);
      return;
    }
    onChange(v);
  };

  return (
    <div className="flex items-center gap-3">
        <Label htmlFor="browser-target-section" className="shrink-0 text-sm">
          Add to section
        </Label>
      {creating ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancelCreate();
              }
            }}
            placeholder="New section name"
            aria-label="New section name"
            className="h-8 flex-1"
          />
          <Button size="sm" variant="secondary" onClick={handleCreate} disabled={!newName.trim()}>
            Create
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelCreate}>
            Cancel
          </Button>
        </div>
      ) : (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger id="browser-target-section" className="h-8 flex-1">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
            {hasSections && <SelectSeparator />}
            <SelectItem value={NEW_SECTION_VALUE} className="text-primary">
              + Create New Section
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function BrowserRow({
  selected,
  onToggle,
  icon,
  title,
  meta,
  description,
  added,
}: {
  selected: boolean;
  onToggle: () => void;
  icon: ReactNode;
  title: string;
  meta: ReactNode;
  description: string;
  added: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/50",
        selected && "border-primary bg-primary/5",
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => onToggle()}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${title}`}
        className="mt-0.5"
      />
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{meta}</div>
        <p className="mt-1 truncate text-xs text-muted-foreground">{description}</p>
      </div>
      {added && (
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">Added</span>
      )}
    </div>
  );
}

type ShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subLabel: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (v: string) => void;
  filters: ReactNode;
  onClearFilters: () => void;
  resultCount: number;
  sort: string;
  onSortChange: (v: string) => void;
  sortOptions: string[];
  selectAllChecked: boolean | "indeterminate";
  onSelectAll: () => void;
  selectAllLabel: string;
  rows: ReactNode;
  emptyLabel: string;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  summaryLabel: string;
  hasSelection: boolean;
  onClearSelection: () => void;
  confirmLabel: string;
  onConfirm: () => void;
  footerExtra?: ReactNode;
  confirmDisabled?: boolean;
  filtersActive?: boolean;
};

export function BrowserModalShell({
  open,
  onOpenChange,
  title,
  subLabel,
  searchPlaceholder,
  search,
  onSearchChange,
  filters,
  onClearFilters,
  resultCount,
  sort,
  onSortChange,
  sortOptions,
  selectAllChecked,
  onSelectAll,
  selectAllLabel,
  rows,
  emptyLabel,
  page,
  pageCount,
  onPageChange,
  summaryLabel,
  hasSelection,
  onClearSelection,
  confirmLabel,
  onConfirm,
  footerExtra,
  confirmDisabled,
  filtersActive,
}: ShellProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90dvh] w-[95vw] max-w-4xl flex-col gap-3 overflow-hidden p-4 sm:p-6">
        <div className="flex shrink-0 flex-col gap-2">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subLabel}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <SearchBar
            containerClassName="max-w-none flex-1"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            {resultCount} {resultCount === 1 ? "item" : "items"}
          </span>
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={filtersActive ? "secondary" : "outline"}
                size="sm"
                className="shrink-0 gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter &amp; Sort
                {filtersActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 space-y-3">
              <p className="text-sm font-medium text-foreground">Filter &amp; Sort</p>
              <div className="flex w-full flex-col items-start gap-1.5">
                <span className="text-xs text-muted-foreground">Sort by</span>
                <Select value={sort} onValueChange={onSortChange}>
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex flex-col gap-3">{filters}</div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  Clear Filters
                </Button>
                <Button size="sm" onClick={() => setFilterOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {resultCount === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            rows
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="browser-select-all"
              checked={selectAllChecked}
              onCheckedChange={() => onSelectAll()}
              className="relative data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:after:absolute data-[state=indeterminate]:after:left-1 data-[state=indeterminate]:after:right-1 data-[state=indeterminate]:after:h-0.5 data-[state=indeterminate]:after:rounded-full data-[state=indeterminate]:after:bg-primary-foreground [&[data-state=indeterminate]_svg]:hidden"
            />
            <Label htmlFor="browser-select-all" className="text-sm font-normal">
              {selectAllLabel}
            </Label>
          </div>
          {pageCount > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page === 1}
                  className={cn(page === 1 && "pointer-events-none opacity-50")}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 text-sm text-muted-foreground">
                  Page {page} of {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page === pageCount}
                  className={cn(page === pageCount && "pointer-events-none opacity-50")}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-md bg-muted/50 px-3 py-2">
          <span className="text-sm text-foreground">{summaryLabel}</span>
          {hasSelection && (
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear selection
            </Button>
          )}
        </div>

        {footerExtra}

        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!hasSelection || confirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}