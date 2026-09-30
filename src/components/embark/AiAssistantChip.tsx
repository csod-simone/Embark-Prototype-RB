import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { useTutorName } from "@/hooks/use-branding";
import { cn } from "@/lib/utils";

/**
 * Combined AI flag + custom label chip used for AI-driven content actions.
 */
export function AiAssistantChip({
  label,
  className,
  iconSize = 14,
}: {
  label: string;
  className?: string;
  iconSize?: number;
}) {
  const tutorName = useTutorName();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      <AskSageIcon size={iconSize} />
      AI - {label} {tutorName}
    </span>
  );
}
