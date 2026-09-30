import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DEFAULT_ATTEMPTS = 3;

export const ATTEMPTS_HELPER =
  "The number of times a learner can take this assessment before being blocked. Re-takes count against this limit.";

export type AttemptsValue = { attempts: string; unlimited: boolean };

export const defaultAttempts: AttemptsValue = {
  attempts: String(DEFAULT_ATTEMPTS),
  unlimited: false,
};

/** Human label for an attempts value, e.g. "3 attempts" / "1 attempt" / "Unlimited attempts". */
export function attemptsLabel(value: AttemptsValue) {
  if (value.unlimited) return "Unlimited attempts";
  const n = Number(value.attempts);
  return `${value.attempts} ${n === 1 ? "attempt" : "attempts"}`;
}

export function attemptsError(value: AttemptsValue): string | null {
  if (value.unlimited) return null;
  const raw = (value.attempts ?? "").trim();
  if (raw === "") return "Please enter the number of attempts allowed.";
  if (!/^-?\d+$/.test(raw)) return "Please enter a valid number.";
  const n = Number(raw);
  if (n < 0) return "Please enter a valid number.";
  if (n === 0) return "Attempts allowed must be at least 1.";
  return null;
}

export function AttemptsAllowedField({
  value,
  onChange,
  idPrefix,
  helperText = ATTEMPTS_HELPER,
  className,
}: {
  value: AttemptsValue;
  onChange: (next: AttemptsValue) => void;
  idPrefix: string;
  helperText?: string;
  className?: string;
}) {
  const [touched, setTouched] = useState(false);
  const error = attemptsError(value);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`${idPrefix}-attempts`} className="text-sm">
        Attempts allowed
      </Label>
      {!value.unlimited && (
        <Input
          id={`${idPrefix}-attempts`}
          type="number"
          min={1}
          value={value.attempts}
          onBlur={() => setTouched(true)}
          onChange={(e) => onChange({ ...value, attempts: e.target.value })}
          aria-invalid={touched && !!error}
          className="w-32"
        />
      )}
      {touched && error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-attempts-unlimited`}
          checked={value.unlimited}
          onCheckedChange={(v) =>
            onChange({
              unlimited: !!v,
              attempts:
                !!v || (value.attempts ?? "").trim() !== ""
                  ? value.attempts
                  : String(DEFAULT_ATTEMPTS),
            })
          }
        />
        <Label htmlFor={`${idPrefix}-attempts-unlimited`} className="text-sm font-normal">
          Unlimited attempts
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">{helperText}</p>
    </div>
  );
}

/** Settings icon button + popover used to override attempts on path / journey item rows. */
export function AttemptsOverridePopover({
  value,
  onSave,
  helperText,
  idPrefix,
  itemName,
}: {
  value: AttemptsValue;
  onSave: (next: AttemptsValue) => void;
  helperText: string;
  idPrefix: string;
  itemName: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AttemptsValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const error = attemptsError(draft);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Settings for ${itemName}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 space-y-4"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        <AttemptsAllowedField
          value={draft}
          onChange={setDraft}
          idPrefix={idPrefix}
          helperText={helperText}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!!error}
            onClick={() => {
              onSave(draft);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}