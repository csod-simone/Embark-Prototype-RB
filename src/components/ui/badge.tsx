import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-status-critical-outline bg-status-critical text-status-critical-fg",
        warning: "border-status-warning-outline bg-status-warning text-status-warning-fg",
        success: "border-status-success-outline bg-status-success text-status-success-fg",
        info: "border-status-info-outline bg-status-info text-status-info-fg",
        outline: "bg-transparent text-accent-foreground border-accent-foreground",
        "outline-destructive":
          "bg-transparent text-status-critical-fg border-status-critical-outline",
        "outline-warning": "bg-transparent text-status-warning-fg border-status-warning-outline",
        "outline-success": "bg-transparent text-status-success-fg border-status-success-outline",
        ai: "border-status-ai-outline bg-status-ai text-status-ai-fg",
        neutral: "border-status-neutral-outline bg-status-neutral text-status-neutral-fg",
        tertiary: "border-transparent bg-muted text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
