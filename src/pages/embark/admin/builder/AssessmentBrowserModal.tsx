import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BrowserModalShell,
  BrowserRow,
  FilterSelect,
  PAGE_SIZE,
  NEW_SECTION_VALUE,
  SectionTargetPicker,
  type BuilderSection,
} from "./BrowserModalShell";
import {
  ASSESSMENT_LIBRARY_ITEMS,
  ASSESSMENT_TYPES,
  TOPICS,
  type LibraryAssessmentItem,
} from "./browserData";

const TYPE_OPTIONS = ["All types", ...ASSESSMENT_TYPES];
const TOPIC_OPTIONS = ["All topics", ...TOPICS];
const PASS_OPTIONS = ["Any", "70% and above", "80% and above", "90% and above"];
const SORT_OPTIONS = ["Relevance", "Title A–Z", "Title Z–A", "Newest first"];

const matchesPass = (mark: number, filter: string) => {
  if (filter === "70% and above") return mark >= 70;
  if (filter === "80% and above") return mark >= 80;
  if (filter === "90% and above") return mark >= 90;
  return true;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedTitles: string[];
  sections: BuilderSection[];
  onAdd: (items: LibraryAssessmentItem[], targetSectionId: string) => void;
  onCreateSection: (name: string) => string;
};

export function AssessmentBrowserModal({
  open,
  onOpenChange,
  addedTitles,
  sections,
  onAdd,
  onCreateSection,
}: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [pass, setPass] = useState(PASS_OPTIONS[0]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState("");

  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  useEffect(() => {
    if (open) setTarget(sectionsRef.current[0]?.id ?? "");
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = ASSESSMENT_LIBRARY_ITEMS.filter((item) => {
      if (type !== "All types" && item.type !== type) return false;
      if (topic !== "All topics" && item.topic !== topic) return false;
      if (!matchesPass(item.passMark, pass)) return false;
      if (!q) return true;
      return [item.title, item.description, item.topic, item.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const sorted = [...list];
    if (sort === "Title A–Z") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "Title Z–A") sorted.sort((a, b) => b.title.localeCompare(a.title));
    return sorted;
  }, [search, type, topic, pass, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const visibleIds = visible.map((i) => i.id);
  const selectedVisible = visibleIds.filter((id) => selected.includes(id));
  const selectAllChecked: boolean | "indeterminate" =
    visibleIds.length > 0 && selectedVisible.length === visibleIds.length
      ? true
      : selectedVisible.length > 0
        ? "indeterminate"
        : false;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSelectAll = () => {
    if (selectAllChecked === true) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setType(TYPE_OPTIONS[0]);
    setTopic(TOPIC_OPTIONS[0]);
    setPass(PASS_OPTIONS[0]);
    setPage(1);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelected([]);
      clearFilters();
      setSort(SORT_OPTIONS[0]);
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    onAdd(ASSESSMENT_LIBRARY_ITEMS.filter((i) => selected.includes(i.id)), target);
    handleOpenChange(false);
  };

  const count = selected.length;
  const targetName =
    target === NEW_SECTION_VALUE
      ? "New Section"
      : (sections.find((s) => s.id === target)?.name ?? "");
  const confirmLabel =
    target === NEW_SECTION_VALUE
      ? `Add ${count} assessment(s) to New Section`
      : targetName
        ? `Add ${count} assessment(s) to '${targetName}'`
        : `Add ${count} assessment(s) to Path`;

  return (
    <BrowserModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="Browse Assessments"
      subLabel="Select one or more assessments to add to this path. Assessments can be placed at any point in the path sequence."
      searchPlaceholder="Search by assessment title or topic"
      search={search}
      onSearchChange={(v) => {
        setSearch(v);
        setPage(1);
      }}
      filters={
        <>
          <FilterSelect
            label="Type"
            value={type}
            onChange={(v) => {
              setType(v);
              setPage(1);
            }}
            options={TYPE_OPTIONS}
          />
          <FilterSelect
            label="Topic"
            value={topic}
            onChange={(v) => {
              setTopic(v);
              setPage(1);
            }}
            options={TOPIC_OPTIONS}
          />
          <FilterSelect
            label="Advancement score"
            value={pass}
            onChange={(v) => {
              setPass(v);
              setPage(1);
            }}
            options={PASS_OPTIONS}
          />
        </>
      }
      onClearFilters={clearFilters}
      resultCount={filtered.length}
      filtersActive={
        type !== TYPE_OPTIONS[0] ||
        topic !== TOPIC_OPTIONS[0] ||
        pass !== PASS_OPTIONS[0] ||
        sort !== SORT_OPTIONS[0]
      }
      sort={sort}
      onSortChange={setSort}
      sortOptions={SORT_OPTIONS}
      selectAllChecked={selectAllChecked}
      onSelectAll={handleSelectAll}
      selectAllLabel={`Select all ${filtered.length} results`}
      emptyLabel="No assessments match your search and filters."
      rows={visible.map((item) => (
        <BrowserRow
          key={item.id}
          selected={selected.includes(item.id)}
          onToggle={() => toggle(item.id)}
          icon={<ClipboardCheck className="h-4 w-4" />}
          title={item.title}
          meta={
            <>
              <Badge variant="secondary">{item.type}</Badge>
              <span>{item.passMark}% advancement score</span>
              <span>·</span>
              <span>{item.questions} questions</span>
              <span>·</span>
              <span>{item.topic}</span>
            </>
          }
          description={item.description}
          added={addedTitles.includes(item.title)}
        />
      ))}
      page={currentPage}
      pageCount={pageCount}
      onPageChange={setPage}
      summaryLabel={count === 0 ? "No items selected" : `${count} assessment(s) selected`}
      hasSelection={count > 0}
      onClearSelection={() => setSelected([])}
      footerExtra={
        <SectionTargetPicker
          sections={sections}
          value={target}
          onChange={setTarget}
          onCreateSection={onCreateSection}
        />
      }
      confirmDisabled={!target}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
    />
  );
}