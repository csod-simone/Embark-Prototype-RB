import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_LIBRARY,
  SUBCATEGORIES_BY_CATEGORY,
  TOTAL_SKILL_COUNT,
  type SkillCategory,
  type SkillLevel,
} from "./skillLibraryData";

const PAGE_SIZE = 50;
const ALL_CATEGORIES = "All categories";
const ALL_SUBCATEGORIES = "All subcategories";
const ALL_LEVELS = "All levels";

function PickerFilter({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9 w-[180px]" aria-label={label}>
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

export function SkillPickerModal({
  open,
  onOpenChange,
  addedSkillNames,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedSkillNames: string[];
  onSelect: (skills: { name: string; level: SkillLevel }[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [subcategory, setSubcategory] = useState(ALL_SUBCATEGORIES);
  const [level, setLevel] = useState(ALL_LEVELS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, SkillLevel>>({});

  const selectedNames = Object.keys(selected);

  const toggleSkill = (name: string, defaultLevel: SkillLevel) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      else next[name] = defaultLevel;
      return next;
    });
  };

  const resetPage = () => setPage(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SKILL_LIBRARY.filter((s) => {
      if (category !== ALL_CATEGORIES && s.category !== category) return false;
      if (subcategory !== ALL_SUBCATEGORIES && s.subcategory !== subcategory) return false;
      if (level !== ALL_LEVELS && s.level !== level) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.subcategory.toLowerCase().includes(q)
      );
    });
  }, [search, category, subcategory, level]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const subcategoryOptions =
    category === ALL_CATEGORIES
      ? [ALL_SUBCATEGORIES]
      : [ALL_SUBCATEGORIES, ...SUBCATEGORIES_BY_CATEGORY[category as SkillCategory]];

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setSubcategory(ALL_SUBCATEGORIES);
    setLevel(ALL_LEVELS);
    resetPage();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelected({});
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[95vw] max-w-4xl flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <div className="flex shrink-0 flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Select Skills</DialogTitle>
            <DialogDescription>
              Search or filter to find the skills you need, select one or more, then add them to
              this content item.
            </DialogDescription>
          </DialogHeader>

          <SearchBar
            containerClassName="max-w-none"
            placeholder="Search skills by name or keyword"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />

          <div className="flex flex-wrap items-center gap-3">
            <PickerFilter
              label="Category"
              value={category}
              onChange={(v) => {
                setCategory(v);
                setSubcategory(ALL_SUBCATEGORIES);
                resetPage();
              }}
              options={[ALL_CATEGORIES, ...SKILL_CATEGORIES]}
            />
            <PickerFilter
              label="Subcategory"
              value={subcategory}
              onChange={(v) => {
                setSubcategory(v);
                resetPage();
              }}
              options={subcategoryOptions}
              disabled={category === ALL_CATEGORIES}
            />
            <PickerFilter
              label="Proficiency Level"
              value={level}
              onChange={(v) => {
                setLevel(v);
                resetPage();
              }}
              options={[ALL_LEVELS, ...SKILL_LEVELS]}
            />
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          <span className="text-xs text-muted-foreground">
            Showing {filtered.length} of {TOTAL_SKILL_COUNT.toLocaleString()} skills
          </span>

          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-foreground">No skills found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2" role="group" aria-label="Skills">
                {rows.map((s) => {
                  const isAdded = addedSkillNames.some(
                    (n) => n.toLowerCase() === s.name.toLowerCase(),
                  );
                  const isSelected = !!selected[s.name];
                  return (
                    <div
                      key={s.name}
                      role="checkbox"
                      tabIndex={isAdded ? -1 : 0}
                      aria-checked={isSelected}
                      aria-disabled={isAdded}
                      onClick={() => {
                        if (isAdded) return;
                        toggleSkill(s.name, s.level);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (isAdded) return;
                          toggleSkill(s.name, s.level);
                        }
                      }}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/50",
                        isSelected && "border-primary bg-primary/5",
                        isAdded && "cursor-not-allowed opacity-60 hover:bg-transparent",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isAdded}
                        aria-label={`Select ${s.name}`}
                        className="mt-0.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => {
                          if (isAdded) return;
                          toggleSkill(s.name, s.level);
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-muted px-2.5 py-0.5">{s.category}</span>
                          <span>· {s.subcategory}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          className="shrink-0"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={selected[s.name]}
                            onValueChange={(v) =>
                              setSelected((prev) => ({ ...prev, [s.name]: v as SkillLevel }))
                            }
                          >
                            <SelectTrigger
                              className="h-9 w-[160px]"
                              aria-label={`Proficiency level for ${s.name}`}
                            >
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_LEVELS.map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {isAdded && (
                        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                          Added
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {pageCount > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        aria-disabled={currentPage === 1}
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-3 text-sm text-muted-foreground">
                        Page {currentPage} of {pageCount}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        aria-disabled={currentPage === pageCount}
                        className={cn(currentPage === pageCount && "pointer-events-none opacity-50")}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {selectedNames.length} {selectedNames.length === 1 ? "skill" : "skills"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedNames.length === 0}
              onClick={() => setSelected({})}
            >
              Clear selection
            </Button>
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={selectedNames.length === 0}
              onClick={() => {
                if (selectedNames.length === 0) return;
                onSelect(selectedNames.map((name) => ({ name, level: selected[name] })));
                handleOpenChange(false);
              }}
            >
              Add Selected Skills
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
