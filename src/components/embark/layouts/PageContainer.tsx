import { cn } from "@/lib/utils";
import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";

export interface PageContainerProps extends Omit<HTMLAttributes<HTMLElement>, "ref"> {
  as?: ElementType;
  children?: ReactNode;
  /** Remove horizontal padding (useful when the parent already supplies it). */
  noPadding?: boolean;
}

export const PageContainer = forwardRef<HTMLElement, PageContainerProps>(
  ({ as: Component = "div", className, noPadding, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-[1088px]",
          !noPadding && "px-6",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

PageContainer.displayName = "PageContainer";
