import logoRathbones from "@/assets/rathbones-logo-blue.jpg";
import { cn } from "@/lib/utils";

/** Official Rathbones wordmark (Rathbones Blue on white). */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={logoRathbones}
      alt="Rathbones"
      className={cn("h-7 w-auto max-w-none shrink-0 bg-white object-contain dark:rounded-sm dark:p-0.5", className)}
    />
  );
}
