import { useMemo, useState } from "react";
import { MonitorPlay, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BrowserModalShell,
  BrowserRow,
  FilterSelect,
  PAGE_SIZE,
} from "@/pages/embark/admin/builder/BrowserModalShell";
import {
  CONTENT_LIBRARY_ITEMS,
  TOPICS,
  type LibraryContentItem,
} from "@/pages/embark/admin/builder/browserData";

/** Assessment content components can reference SCORM, Role-Play or Simulation content. */
export const COMPREHENSION_CONTENT_TYPES = ["SCORM", "Role-Play", "Simulation"] as const;

const TYPE_OPTIONS = ["All types", ...COMPREHENSION_CONTENT_TYPES];
const TOPIC_OPTIONS = ["All topics", ...TOPICS];
const DURATION_OPTIONS = ["Any duration", "Under 10 min", "10–30 min", "30–60 min", "Over 60 min"];
const STATUS_OPTIONS = ["All", "Published", "Draft"];
const SORT_OPTIONS = ["Relevance", "Title A–Z", "Title Z–A", "Newest first", "Shortest first"];

const ELIGIBLE_ITEMS = CONTENT_LIBRARY_ITEMS.filter((i) =>
  (COMPREHENSION_CONTENT_TYPES as readonly string[]).includes(i.type),
);

const typeIcon = (type: LibraryContentItem["type"]) =>
  type === "Role-Play" ? <Users className="h-4 w-4" /> : <MonitorPlay className="h-4 w-4" />;

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

/**
 * The Path Builder content library browser, restricted to the content types a
 * Comprehension Check can use and limited to a single selection.
 */
export function AssessmentContentPickerModal({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onSelect: (item: LibraryContentItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string>(selectedId ?? "");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = ELIGIBLE_ITEMS.filter((item) => {
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
    return sorted;
  }, [search, type, topic, duration, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
      clearFilters();
      setSort(SORT_OPTIONS[0]);
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    const item = ELIGIBLE_ITEMS.find((i) => i.id === selected);
    if (!item) return;
    onSelect(item);
    handleOpenChange(false);
  };

  const selectedItem = ELIGIBLE_ITEMS.find((i) => i.id === selected);

  return (
    <BrowserModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="Browse Content Library"
      subLabel="Select the SCORM or Role-Play content this Comprehension Check should use. Only these content types are available."
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
      selectAllChecked={selected !== ""}
      onSelectAll={() => setSelected("")}
      selectAllLabel="Only one content item can be selected"
      emptyLabel="No SCORM or Role-Play content matches your search and filters."
      rows={visible.map((item) => (
        <BrowserRow
          key={item.id}
          selected={selected === item.id}
          onToggle={() => setSelected((prev) => (prev === item.id ? "" : item.id))}
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
          added={false}
        />
      ))}
      page={currentPage}
      pageCount={pageCount}
      onPageChange={setPage}
      summaryLabel={selectedItem ? `Selected: ${selectedItem.title}` : "No content selected"}
      hasSelection={selected !== ""}
      onClearSelection={() => setSelected("")}
      confirmDisabled={!selectedItem}
      confirmLabel="Use selected content"
      onConfirm={handleConfirm}
    />
  );
}
