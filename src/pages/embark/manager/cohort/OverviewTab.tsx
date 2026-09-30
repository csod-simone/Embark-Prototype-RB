import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { LearnerTable } from "./LearnerTable";
import type { BandLabel } from "@/data/mockData";
import { X } from "lucide-react";

export function OverviewTab({
  bandFilter,
  onClearFilter,
  onRespond,
}: {
  bandFilter: BandLabel | null;
  onClearFilter: () => void;
  onRespond: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("status");

  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border">
        <Input
          placeholder="Search learners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60 h-9"
        />
        <div className="flex items-center gap-2">
          {bandFilter && (
            <button
              onClick={onClearFilter}
              className="inline-flex items-center gap-1 text-xs text-secondary-foreground hover:underline"
            >
              <X className="h-3 w-3" /> Clear filter: {bandFilter}
            </button>
          )}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Sort by: Status</SelectItem>
              <SelectItem value="name">Sort by: Name</SelectItem>
              <SelectItem value="progress">Sort by: Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <LearnerTable
        filterBands={bandFilter ? [bandFilter] : undefined}
        onRespond={onRespond}
        search={search}
      />
    </div>
  );
}