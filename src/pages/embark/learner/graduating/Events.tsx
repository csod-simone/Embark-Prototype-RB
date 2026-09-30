import { Calendar } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function GraduatingEvents() {
  return (
    <>
      <div className="px-4 sm:px-6 py-6">
        <PageContainer as="div" className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Upcoming and live sessions for your programme
          </p>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No upcoming events</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You have no live events scheduled at the moment. Check back soon.
            </p>
          </div>
        </PageContainer>
      </div>
    </>
  );
}
