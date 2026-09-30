import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

export function TutorInputBar({
  onSend,
  disabled,
  disabledPlaceholder,
  placeholder = "Ask Sage anything…",
  seedValue,
  seedKey,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
  placeholder?: string;
  seedValue?: string;
  seedKey?: string | number;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (seedKey === undefined) return;
    setValue(seedValue ?? "");
    inputRef.current?.focus();
  }, [seedKey, seedValue]);

  const send = () => {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (disabled) {
    return (
      <div className="flex h-12 w-full items-center gap-2 rounded-full border border-border bg-muted/40 px-4">
        <span className="italic text-sm text-muted-foreground">
          {disabledPlaceholder ?? "Input disabled"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full items-center gap-2 rounded-full border border-border bg-background px-4 focus-within:ring-2 focus-within:ring-ring scroll-mb-24">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground scroll-mb-24"
      />
      <button
        type="button"
        onClick={send}
        aria-label="Send"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
        disabled={!value.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}