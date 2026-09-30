import { Sparkles } from "lucide-react";

export function PlaceholderScreen({ name }: { name: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center rounded-card border border-border bg-card p-10 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted inline-flex items-center justify-center text-muted-foreground">
          <Sparkles size={22} aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">Content coming in the next build.</p>
      </div>
    </div>
  );
}