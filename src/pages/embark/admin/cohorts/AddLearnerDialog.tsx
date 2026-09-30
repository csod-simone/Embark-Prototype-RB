import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { initials } from "./data";
import { STUB_SEARCH_RESULTS } from "./enrollmentData";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddLearnerDialog({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{ name: string; email: string } | null>(null);
  const [focused, setFocused] = useState(false);
  const [enrollDate, setEnrollDate] = useState<Date | undefined>(new Date());
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(null);
      setFocused(false);
      setEnrollDate(new Date());
      setNotify(true);
    }
  }, [open]);

  const showDropdown = focused && query.trim().length > 0 && !selected;

  const handleAdd = () => {
    onOpenChange(false);
    toast.success("Learner added to cohort successfully.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Learner to Cohort</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Search for a learner by name or email and add them to this cohort.
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="learner-search">Learner</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="learner-search"
                value={selected ? `${selected.name} — ${selected.email}` : query}
                onChange={(e) => {
                  setSelected(null);
                  setQuery(e.target.value);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search by name or email…"
                className="pl-9"
              />
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-md max-h-64 overflow-y-auto">
                  {STUB_SEARCH_RESULTS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelected({ name: r.name, email: r.email });
                        setFocused(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                    >
                      <span
                        aria-hidden
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground shrink-0"
                      >
                        {initials(r.name)}
                      </span>
                      <span className="text-sm font-medium text-foreground">{r.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground truncate">
                        {r.email}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Enrollment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !enrollDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {enrollDate ? format(enrollDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={enrollDate}
                  onSelect={setEnrollDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-toggle">Send welcome notification</Label>
              <Switch id="notify-toggle" checked={notify} onCheckedChange={setNotify} />
            </div>
            <p className="text-xs text-muted-foreground">
              The learner will receive an email notifying them they've been added to this cohort.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Learner</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
