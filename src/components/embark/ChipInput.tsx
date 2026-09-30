import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

export function ChipInput({
  chips,
  onAdd,
  onRemove,
  placeholder,
}: {
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  const commit = () => {
    const v = value.trim();
    if (v) onAdd(v);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !value && chips.length > 0) {
      onRemove(chips.length - 1);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center rounded-md border border-border bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
      {chips.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
        >
          {c}
          <button
            type="button"
            aria-label={`Remove ${c}`}
            onClick={() => onRemove(i)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={chips.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none py-1 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}