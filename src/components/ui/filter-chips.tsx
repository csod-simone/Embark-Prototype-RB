interface FilterChipsProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function FilterChips({ options, value, onChange, ariaLabel = "Filter" }: FilterChipsProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap items-center gap-3">
      {options.map((label) => {
        const selected = label === value;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(label)}
            className={`p-4 py-[8px] rounded-full text-base font-medium border transition-colors ${
              selected
                ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
                : "bg-transparent text-sidebar-primary-foreground border-border hover:bg-muted"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
