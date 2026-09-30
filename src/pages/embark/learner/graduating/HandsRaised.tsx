import { Hand } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function GraduatingHandsRaised() {
  return (
    <>
      <div className="px-4 sm:px-6 py-6">
        <PageContainer as="div" className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Questions and requests you've raised during your journey
          </p>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Hand className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No hands raised</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven't raised any hands during this programme.
            </p>
          </div>
        </PageContainer>
      </div>
    </>
  );
}
