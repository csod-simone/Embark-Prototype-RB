import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends React.ComponentProps<"input"> {
  containerClassName?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, placeholder = "Search skills, people, roles...", ...props }, ref) => {
    return (
      <div className={cn("relative w-full max-w-sm", containerClassName)}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("rounded-full pl-9", className)}
          {...props}
        />
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
