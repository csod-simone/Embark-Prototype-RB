/* ============================================================================
 * DESIGN SYSTEM BUNDLE — Portable Component Library
 * ============================================================================
 *
 * Single-file export of every component documented on the /design-system page.
 * Drop this into another Lovable project alongside `design-system.css` and
 * matching `tailwind.config.ts` token mappings, then import with named imports:
 *
 *   import { Button, Badge, Avatar, Input, SearchBar } from "./design-system-bundle";
 *
 * ── Dependencies ────────────────────────────────────────────────────────────
 *   • react
 *   • lucide-react           (icons: Search, Check, Mic, ArrowUp, Sparkles,
 *                             ChevronLeft, ChevronRight, MoreHorizontal)
 *   • class-variance-authority (cva)
 *   • clsx + tailwind-merge   (for the local `cn` helper)
 *
 * No Radix UI. No app-specific code. All visuals reference tokens from
 * design-system.css via Tailwind utility classes — no hardcoded hex/HSL/px.
 *
 * ── Exported components ─────────────────────────────────────────────────────
 *
 * Avatar
 *   <Avatar size?="sm"|"default"|"lg" className?>     // 32 / 40 / 56 px
 *   <AvatarImage src alt />
 *   <AvatarFallback>JD</AvatarFallback>
 *
 * Badge
 *   <Badge variant?>
 *     variants: "default" | "secondary" | "destructive" | "outline"
 *               | "outline-destructive" | "outline-warning" | "tertiary"
 *
 * Button
 *   <Button variant? size? disabled? asChild?>
 *     variants: "default" | "destructive" | "outline" | "secondary"
 *               | "tertiary" | "ghost" | "link"
 *     sizes:    "default" | "sm" | "lg" | "icon"
 *
 * Card primitives
 *   <Card> <CardHeader> <CardTitle> <CardDescription> <CardContent> <CardFooter>
 *
 * Checkbox
 *   <Checkbox checked? defaultChecked? onCheckedChange? disabled? id? name? value? />
 *
 * Filter (filter pill / chip)
 *   <Filter selected? onClick?>Label</Filter>
 *   <FilterChips options value onChange ariaLabel? />   // grouped pills
 *
 * FilterDropdown (lightweight popover menu — no Radix)
 *   <FilterDropdown
 *     label                 // pill label
 *     options={[{value, label}]}
 *     value | values        // single or array (multi)
 *     onChange
 *     multi?
 *   />
 *
 * Headers
 *   <PageHeader title subtitle? actions? />
 *   <SectionHeader title subtitle? actions? />
 *
 * Input
 *   <Input type? ... />     // standard input field
 *
 * Pagination
 *   <Pagination> <PaginationContent> <PaginationItem>
 *   <PaginationLink isActive? size?> <PaginationPrevious> <PaginationNext>
 *   <PaginationEllipsis>
 *
 * SearchBar
 *   <SearchBar placeholder? containerClassName? ...inputProps />
 *
 * SmartBar
 *   <SmartBar onSend? />                   // sticky version w/ gradient
 *   <SmartBarInline onSend? placeholder? showSparkle? micSize? micClassName? />
 *
 * Table
 *   <Table> <TableHeader> <TableBody> <TableFooter> <TableRow>
 *   <TableHead> <TableCell> <TableCaption>
 *
 * Toast
 *   <ToastProvider>...</ToastProvider>     // wrap app root
 *   const { toast } = useToast();
 *   toast({ title, description?, variant? })
 *     variants: "default" | "destructive"
 *
 * ── Helpers ─────────────────────────────────────────────────────────────────
 *   cn(...classes)          // clsx + tailwind-merge
 *   buttonVariants, badgeVariants  (cva instances)
 * ==========================================================================*/

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Search,
  Check,
  Mic,
  ArrowUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

/* ── cn helper ──────────────────────────────────────────────────────────── */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ── Avatar ─────────────────────────────────────────────────────────────── */
type AvatarSize = "sm" | "default" | "lg";
const avatarSizeClass: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
}
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-[hsl(var(--avatar-bg))] text-[hsl(var(--avatar-text))]",
        avatarSizeClass[size],
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = "", ...props }, ref) => (
    <img ref={ref} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
  ),
);
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center font-medium", className)}
      {...props}
    />
  ),
);
AvatarFallback.displayName = "AvatarFallback";

/* ── Badge ──────────────────────────────────────────────────────────────── */
export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[hsl(var(--ds-300))] text-foreground",
        secondary: "border-transparent bg-accent-foreground text-primary-foreground",
        destructive: "border-transparent bg-[hsl(var(--red-400))] text-foreground",
        outline: "bg-transparent text-foreground border-[hsl(var(--ds-500))]",
        "outline-destructive": "bg-transparent text-[hsl(var(--red-700))] border-[hsl(var(--red-700))]",
        "outline-warning": "bg-transparent text-[hsl(var(--amber-700))] border-[hsl(var(--amber-700))]",
        tertiary: "border-transparent bg-[hsl(var(--primary-foreground))] text-[hsl(var(--ds-700))]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* ── Button ─────────────────────────────────────────────────────────────── */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium leading-5 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-[hsl(var(--primary-hover-foreground))] rounded-full",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-[hsl(var(--figma-c1))] hover:text-foreground",
        secondary:
          "border border-primary text-primary bg-transparent hover:bg-transparent rounded-full",
        tertiary: "bg-[hsl(var(--figma-c1))] text-foreground hover:bg-[hsl(var(--figma-c1))]/80",
        ghost: "hover:bg-[hsl(var(--figma-c1))] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-3 py-2",
        sm: "px-3 py-2",
        lg: "px-3 py-2",
        icon: "px-3 py-2",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), child.props.className, className),
      });
    }
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

/* ── Card primitives ────────────────────────────────────────────────────── */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

/* ── Checkbox (plain HTML, styled) ──────────────────────────────────────── */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => (
    <span className="relative inline-flex items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        onChange={(e) => {
          onCheckedChange?.(e.target.checked);
          onChange?.(e);
        }}
        className={cn(
          "peer h-4 w-4 shrink-0 appearance-none rounded-[4px] border border-primary bg-transparent ring-offset-background",
          "checked:bg-primary checked:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-border disabled:bg-transparent",
          className,
        )}
        {...props}
      />
      <Check className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
    </span>
  ),
);
Checkbox.displayName = "Checkbox";

/* ── Filter pill + FilterChips group ────────────────────────────────────── */
export interface FilterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
export const Filter = React.forwardRef<HTMLButtonElement, FilterProps>(
  ({ className, selected, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-normal transition-colors",
        selected
          ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
          : "bg-background text-foreground border-input hover:bg-card",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Filter.displayName = "Filter";

export interface FilterChipsProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}
export function FilterChips({ options, value, onChange, ariaLabel = "Filter" }: FilterChipsProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap items-center gap-3">
      {options.map((label) => {
        const selected = label === value;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(label)}
            className={cn(
              "px-4 py-2 rounded-full text-base font-medium border transition-colors",
              selected
                ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
                : "bg-transparent text-sidebar-primary-foreground border-border hover:bg-muted",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── FilterDropdown (lightweight, no Radix) ─────────────────────────────── */
export interface FilterDropdownOption {
  value: string;
  label: string;
}
export interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  value?: string;
  values?: string[];
  onChange?: (value: string | string[]) => void;
  multi?: boolean;
  className?: string;
}
export function FilterDropdown({
  label,
  options,
  value,
  values = [],
  onChange,
  multi = false,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isSelected = (v: string) => (multi ? values.includes(v) : value === v);
  const handlePick = (v: string) => {
    if (multi) {
      const next = values.includes(v) ? values.filter((x) => x !== v) : [...values, v];
      onChange?.(next);
    } else {
      onChange?.(v);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <Filter selected={open} onClick={() => setOpen((o) => !o)}>
        {label}
      </Filter>
      {open && (
        <div className="ds-filter-menu absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-lg border border-border shadow-md">
          {options.map((opt) => {
            const selected = isSelected(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handlePick(opt.value)}
                className={cn("ds-filter-menu-item", selected && "ds-filter-menu-item-selected")}
              >
                <span className="ds-filter-menu-check">{selected && <Check className="h-4 w-4" />}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Headers (Page + Section) ───────────────────────────────────────────── */
export interface HeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}
export function PageHeader({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-base text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionHeader({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <header className={cn("flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ── Input ──────────────────────────────────────────────────────────────── */
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

/* ── Pagination ─────────────────────────────────────────────────────────── */
export const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
} & React.ComponentProps<"a">;
export const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
      className,
    )}
    {...props}
  />
);

export const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

export const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

/* ── SearchBar ──────────────────────────────────────────────────────────── */
export interface SearchBarProps extends React.ComponentProps<"input"> {
  containerClassName?: string;
}
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, placeholder = "Search...", ...props }, ref) => (
    <div className={cn("relative w-full max-w-sm", containerClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input ref={ref} type="search" placeholder={placeholder} className={cn("rounded-full pl-9", className)} {...props} />
    </div>
  ),
);
SearchBar.displayName = "SearchBar";

/* ── SmartBar ───────────────────────────────────────────────────────────── */
interface SmartBarInputProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  showSparkle?: boolean;
  micSize?: number;
  micClassName?: string;
}
function SmartBarInput({
  inputValue,
  setInputValue,
  onSend,
  onKeyDown,
  placeholder = "Ask AI anything...",
  showSparkle = true,
  micSize = 18,
  micClassName,
}: SmartBarInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
      {showSparkle && <Sparkles className="h-4 w-4 text-[hsl(var(--ds-500))]" aria-hidden="true" />}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="button"
        aria-label="Voice input"
        className={cn("text-muted-foreground hover:text-foreground", micClassName)}
      >
        <Mic style={{ width: micSize, height: micSize }} />
      </button>
      <button
        type="button"
        aria-label="Send"
        onClick={onSend}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

export interface SmartBarProps {
  onSend?: (message: string) => void;
}
export function SmartBar({ onSend }: SmartBarProps) {
  const [inputValue, setInputValue] = React.useState("");
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
    <div className="sticky bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background to-transparent px-2 pt-6 pb-4">
      <div className="mx-auto max-w-[800px]">
        <SmartBarInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export interface SmartBarInlineProps extends SmartBarProps {
  placeholder?: string;
  showSparkle?: boolean;
  micSize?: number;
  micClassName?: string;
}
export function SmartBarInline({
  onSend,
  placeholder,
  showSparkle = true,
  micSize = 18,
  micClassName,
}: SmartBarInlineProps) {
  const [inputValue, setInputValue] = React.useState("");
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

/* ── Table ──────────────────────────────────────────────────────────────── */
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

/* ── Toast (minimal, dependency-free) ───────────────────────────────────── */
export type ToastVariant = "default" | "destructive";
export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  durationMs?: number;
}
interface ToastEntry extends ToastOptions {
  id: number;
}
interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
}
const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const idRef = React.useRef(0);

  const toast = React.useCallback((opts: ToastOptions) => {
    const id = ++idRef.current;
    const entry: ToastEntry = { id, durationMs: 4000, variant: "default", ...opts };
    setToasts((t) => [...t, entry]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, entry.durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto rounded-md border p-4 shadow-md",
              t.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-border bg-popover text-popover-foreground",
            )}
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description && <div className="mt-1 text-sm opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Fallback so calls don't crash when provider is absent.
    return {
      toast: (o) => {
        if (typeof console !== "undefined") console.log("[toast]", o);
      },
    };
  }
  return ctx;
}
