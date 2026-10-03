import { Hand } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function GraduatingHandsRaised() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <PageContainer as="div" className="space-y-6 pb-10 pt-4">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Hands raised</h1>
            <p className="text-sm text-muted-foreground">
              Questions and requests you've raised during your journey
            </p>
          </header>
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
            <Hand className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No hands raised</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven't raised any hands during this programme.
            </p>
          </div>
        </PageContainer>
    </div>
  );
}
