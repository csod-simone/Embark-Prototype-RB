import { AiAssistantChip } from "@/components/embark/AiAssistantChip";

/**
 * Combined AI flag + "Skipped by {assistant}" chip used for AI-skipped content.
 */
export function AiSkippedChip({
  className,
  iconSize = 14,
}: {
  className?: string;
  iconSize?: number;
}) {
  return <AiAssistantChip label="Skipped by" className={className} iconSize={iconSize} />;
}
