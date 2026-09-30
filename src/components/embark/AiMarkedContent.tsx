import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { aiMarkProps, type AiContentKind } from "@/lib/ai-compliance";

/** Wraps AI-authored text with machine-readable Art. 50(2) markers. */
export function AiMarkedContent({
  kind = "ai-generated",
  as: Tag = "div",
  className,
  children,
}: {
  kind?: AiContentKind;
  as?: "div" | "span" | "p";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn(className)} {...aiMarkProps(kind)}>
      {children}
    </Tag>
  );
}
