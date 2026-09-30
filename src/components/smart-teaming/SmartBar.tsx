import { useState } from "react";
import { Mic, ArrowUp } from "lucide-react";
import { StarIcon } from "@/components/StarIcon";

interface SmartBarProps {
  onSend?: (message: string) => void;
}

interface SmartBarInlineProps extends SmartBarProps {
  placeholder?: string;
  showSparkle?: boolean;
  micSize?: number;
  micClassName?: string;
}

export function SmartBar({ onSend }: SmartBarProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-2">
      <div className="max-w-[800px] mx-auto">
        <SmartBarInput inputValue={inputValue} setInputValue={setInputValue} onSend={handleSend} onKeyDown={handleKeyDown} />
      </div>
    </div>
  );
}

export function SmartBarInline({ onSend, placeholder, showSparkle = true, micSize = 18, micClassName }: SmartBarInlineProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <SmartBarInput
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSend={handleSend}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      showSparkle={showSparkle}
      micSize={micSize}
      micClassName={micClassName}
    />
  );
}

function SmartBarInput({
  inputValue,
  setInputValue,
  onSend,
  onKeyDown,
  placeholder = "Ask AI about skills, team composition, or talent gaps...",
  showSparkle = true,
  micSize = 18,
  micClassName,
}: {
  inputValue: string;
  setInputValue: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  showSparkle?: boolean;
  micSize?: number;
  micClassName?: string;
}) {
  return (
    <div className="relative">
      {showSparkle && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <StarIcon size={18} />
        </div>
      )}
      <label htmlFor="smartbar-input" className="sr-only">Ask AI about your team</label>
      <input
        id="smartbar-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full h-[56px] bg-background border border-border rounded-full ${showSparkle ? "pl-11" : "pl-5"} pr-24 text-base text-[hsl(var(--input))] placeholder:text-[hsl(var(--input))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all shadow-[0_8px_12px_0_rgba(0,0,0,0.04)]`}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          aria-label="Voice input"
          className={`p-2 transition-colors ${micClassName ?? "text-muted-foreground hover:text-foreground"}`}
        >
          <Mic size={micSize} aria-hidden="true" />
        </button>
        <button
          onClick={onSend}
          disabled={!inputValue.trim()}
          aria-label="Send message"
          className="p-2 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
