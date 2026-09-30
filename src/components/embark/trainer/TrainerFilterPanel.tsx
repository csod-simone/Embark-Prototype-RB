import { ReactNode, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DateRangeValue = { from?: Date; to?: Date };

export function isDateRangeActive(range: DateRangeValue) {
  return Boolean(range.from || range.to);
}

/** Section label inside the filter panel — matches the admin browse pattern. */
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-foreground">{children}</p>;
}

export function FilterCheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  renderOption,
  idPrefix,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  renderOption?: (value: string) => ReactNode;
  idPrefix: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex w-full flex-col gap-1.5">
        {options.map((o) => {
          const id = `${idPrefix}-${o.replace(/\s+/g, "-").toLowerCase()}`;
          return (
            <label
              key={o}
              htmlFor={id}
              className="flex cursor-pointer items-start gap-2 text-sm text-foreground"
            >
              <Checkbox
                id={id}
                checked={selected.includes(o)}
                onCheckedChange={() => onToggle(o)}
                className="mt-0.5"
              />
              <span className="min-w-0 flex-1">{renderOption ? renderOption(o) : o}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function DateField({
  placeholder,
  value,
  onChange,
  ariaLabel,
}: {
  placeholder: string;
  value?: Date;
  onChange: (d?: Date) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={ariaLabel}
          className={cn(
            "h-8 flex-1 justify-start gap-2 px-2 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-xs">{value ? format(value, "d MMM yyyy") : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d ?? undefined);
            setOpen(false);
          }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

export function FilterDateRange({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex w-full items-center gap-2">
        <DateField
          placeholder="From"
          ariaLabel={`${label} from`}
          value={value.from}
          onChange={(d) => onChange({ ...value, from: d })}
        />
        <DateField
          placeholder="To"
          ariaLabel={`${label} to`}
          value={value.to}
          onChange={(d) => onChange({ ...value, to: d })}
        />
      </div>
    </div>
  );
}

export type FilterSection = {
  title: string;
  content: ReactNode;
};

export function TrainerFilterPanel({
  sections,
  active,
  onClear,
}: {
  sections: FilterSection[];
  active: boolean;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={active ? "secondary" : "outline"} size="sm" className="shrink-0 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-[70vh] w-72 space-y-3 overflow-y-auto">
        <p className="text-sm font-medium text-foreground">Filter</p>
        {sections.map((s, i) => (
          <div key={s.title} className="space-y-3">
            <Separator />
            <SectionLabel>{s.title}</SectionLabel>
            <div className="flex flex-col gap-3">{s.content}</div>
            {i === sections.length - 1 && <Separator />}
          </div>
        ))}
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear Filters
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
