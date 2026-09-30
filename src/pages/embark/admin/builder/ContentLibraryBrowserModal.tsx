import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, FileVideo, Layers, Link2, MonitorPlay, Users, Zap } from "lucide-react";
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
  CONTENT_LIBRARY_ITEMS,
  CONTENT_TYPES,
  TOPICS,
  type LibraryContentItem,
} from "./browserData";

const TYPE_OPTIONS = ["All types", ...CONTENT_TYPES];
const TOPIC_OPTIONS = ["All topics", ...TOPICS];
const DURATION_OPTIONS = ["Any duration", "Under 10 min", "10–30 min", "30–60 min", "Over 60 min"];
const STATUS_OPTIONS = ["All", "Published", "Draft"];
const SORT_OPTIONS = ["Relevance", "Title A–Z", "Title Z–A", "Newest first", "Shortest first"];

const typeIcon = (type: LibraryContentItem["type"]) => {
  switch (type) {
    case "Video":
      return <FileVideo className="h-4 w-4" />;
    case "Document":
      return <FileText className="h-4 w-4" />;
    case "SCORM":
      return <MonitorPlay className="h-4 w-4" />;
    case "Article":
      return <Layers className="h-4 w-4" />;
    case "Microlearning":
      return <Zap className="h-4 w-4" />;
    case "Role-Play":
      return <Users className="h-4 w-4" />;
    default:
      return <Link2 className="h-4 w-4" />;
  }
};

const matchesDuration = (mins: number, filter: string) => {
  switch (filter) {
    case "Under 10 min":
      return mins < 10;
    case "10–30 min":
      return mins >= 10 && mins <= 30;
    case "30–60 min":
      return mins > 30 && mins <= 60;
    case "Over 60 min":
      return mins > 60;
    default:
      return true;
  }
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedTitles: string[];
  sections: BuilderSection[];
  onAdd: (items: LibraryContentItem[], targetSectionId: string) => void;
  onCreateSection: (name: string) => string;
};

export function ContentLibraryBrowserModal({
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
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
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
    const list = CONTENT_LIBRARY_ITEMS.filter((item) => {
      if (type !== "All types" && item.type !== type) return false;
      if (topic !== "All topics" && item.topic !== topic) return false;
      if (!matchesDuration(item.durationMin, duration)) return false;
      if (status !== "All" && item.status !== status) return false;
      if (!q) return true;
      return [item.title, item.description, item.topic, item.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const sorted = [...list];
    if (sort === "Title A–Z") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "Title Z–A") sorted.sort((a, b) => b.title.localeCompare(a.title));
    else if (sort === "Shortest first") sorted.sort((a, b) => a.durationMin - b.durationMin);
    // "Relevance" and "Newest first" use the natural library order.
    return sorted;
  }, [search, type, topic, duration, status, sort]);

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
    setDuration(DURATION_OPTIONS[0]);
    setStatus(STATUS_OPTIONS[0]);
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
    const items = CONTENT_LIBRARY_ITEMS.filter((i) => selected.includes(i.id));
    onAdd(items, target);
    handleOpenChange(false);
  };

  const count = selected.length;
  const targetName =
    target === NEW_SECTION_VALUE
      ? "New Section"
      : (sections.find((s) => s.id === target)?.name ?? "");
  const confirmLabel =
    target === NEW_SECTION_VALUE
      ? `Add ${count} item(s) to New Section`
      : targetName
        ? `Add ${count} item(s) to '${targetName}'`
        : `Add ${count} item(s) to Path`;

  return (
    <BrowserModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="Browse Content Library"
      subLabel="Select one or more content items to add to this path. Use search and filters to find what you need."
      searchPlaceholder="Search by title, topic, or keyword"
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
            label="Duration"
            value={duration}
            onChange={(v) => {
              setDuration(v);
              setPage(1);
            }}
            options={DURATION_OPTIONS}
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
        </>
      }
      onClearFilters={clearFilters}
      resultCount={filtered.length}
      filtersActive={
        type !== TYPE_OPTIONS[0] ||
        topic !== TOPIC_OPTIONS[0] ||
        duration !== DURATION_OPTIONS[0] ||
        status !== STATUS_OPTIONS[0] ||
        sort !== SORT_OPTIONS[0]
      }
      sort={sort}
      onSortChange={setSort}
      sortOptions={SORT_OPTIONS}
      selectAllChecked={selectAllChecked}
      onSelectAll={handleSelectAll}
      selectAllLabel={`Select all ${filtered.length} results`}
      emptyLabel="No content items match your search and filters."
      rows={visible.map((item) => (
        <BrowserRow
          key={item.id}
          selected={selected.includes(item.id)}
          onToggle={() => toggle(item.id)}
          icon={typeIcon(item.type)}
          title={item.title}
          meta={
            <>
              <Badge variant="secondary">{item.type}</Badge>
              <span>{item.durationMin} min</span>
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
      summaryLabel={count === 0 ? "No items selected" : `${count} item(s) selected`}
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