import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const aiThinkingVariants = cva(
  "inline-flex min-h-6 min-w-0 items-center font-sans text-sm font-medium leading-5",
  {
    variants: {
      variant: {
        inline: "gap-2 bg-transparent px-0 py-0 text-muted-foreground",
        pill: "gap-2 rounded-full bg-accent px-3 py-1.5 text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  },
);

const aiThinkingLabelVariants = cva("ai-thinking-label bg-clip-text text-transparent", {
  variants: {
    variant: {
      inline:
        "bg-gradient-to-r from-muted-foreground via-accent-foreground to-muted-foreground",
      pill: "bg-gradient-to-r from-accent-foreground via-accent-foreground/70 to-accent-foreground",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

const DEFAULT_INTERVAL_MS = 3200;
const MESSAGE_OUT_MS = 220;
const MESSAGE_IN_MS = 220;

export interface AIThinkingProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof aiThinkingVariants> {
  label?: string;
  messages?: string[];
  interval?: number;
}

export const AIThinking = React.forwardRef<HTMLSpanElement, AIThinkingProps>(
  function AIThinking(
    { label, messages, variant = "inline", interval = DEFAULT_INTERVAL_MS, className, ...rest },
    ref,
  ) {
    const resolvedMessages = useMemo(
      () => messages ?? (label ? [label] : ["Thinking…"]),
      [messages, label],
    );

    const [messageIndex, setMessageIndex] = useState(0);
    const [swapPhase, setSwapPhase] = useState<"idle" | "out" | "in">("idle");
    const swapTimersRef = useRef<number[]>([]);

    const currentMessage = resolvedMessages[messageIndex] ?? resolvedMessages[0] ?? "Thinking…";

    useEffect(() => {
      setMessageIndex(0);
      setSwapPhase("idle");
    }, [resolvedMessages]);

    useEffect(() => {
      if (resolvedMessages.length <= 1) return undefined;

      const rotationTimer = window.setInterval(() => {
        setSwapPhase("out");

        const outTimer = window.setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % resolvedMessages.length);
          setSwapPhase("in");

          const inTimer = window.setTimeout(() => {
            setSwapPhase("idle");
          }, MESSAGE_IN_MS);

          swapTimersRef.current.push(inTimer);
        }, MESSAGE_OUT_MS);

        swapTimersRef.current.push(outTimer);
      }, interval);

      return () => {
        window.clearInterval(rotationTimer);
        for (const id of swapTimersRef.current) window.clearTimeout(id);
        swapTimersRef.current = [];
      };
    }, [resolvedMessages, interval]);

    const messageClassName = cn(
      aiThinkingLabelVariants({ variant }),
      swapPhase === "out" && "ai-thinking-message--out",
      swapPhase === "in" && "ai-thinking-message--in",
    );

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={currentMessage}
        className={cn(aiThinkingVariants({ variant }), className)}
        {...rest}
      >
        <span
          aria-hidden
          className="ai-thinking-diamond inline-flex h-4 w-4 shrink-0 items-center justify-center text-base leading-none text-accent-foreground"
        >
          ✦
        </span>
        <span className={messageClassName}>{currentMessage}</span>
      </span>
    );
  },
);

AIThinking.displayName = "AIThinking";
