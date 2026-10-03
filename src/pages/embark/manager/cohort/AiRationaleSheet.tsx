import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SageTag } from "@/components/embark/SageTag";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">
      {children}
    </h3>
  );
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

export function AiRationaleSheet({
  open,
  onOpenChange,
  learnerName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
}) {
  const first = learnerName.split(" ")[0] || learnerName;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border text-left">
          <SheetTitle>AI Rationale — {learnerName}</SheetTitle>
          <SheetDescription>
            Sage's reasoning for this learner's current learning path, pace, and content
            recommendations.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="inline-flex items-center gap-2">
            <SageTag label="AI" />
          </div>

          <section>
            <SectionHeading>Learner Snapshot</SectionHeading>
            <div className="divide-y divide-border">
              <LabelValue label="Current Journey" value="Investment Manager Full Onboarding Journey" />
              <LabelValue label="Current Curriculum" value="IM Intake Pathway" />
              <LabelValue label="Overall Progress" value="62%" />
              <LabelValue label="Last Active" value="Today, 09:41 AM" />
              <LabelValue label="Pace" value="Slightly ahead of schedule" />
            </div>
          </section>

          <section className="border-t border-border pt-4">
            <SectionHeading>Why This Learning Path</SectionHeading>
            <p className="text-sm text-foreground leading-relaxed">
              {first} was placed on the Investment Manager Full Onboarding Journey based on their role as
              a new Investment Manager. The journey includes the IM Intake Pathway,
              the Compliance Refresher Path, and the Discretionary Portfolio Management.
            </p>
          </section>

          <section className="border-t border-border pt-4">
            <SectionHeading>Pace &amp; Progress Assessment</SectionHeading>
            <p className="text-sm text-foreground leading-relaxed">
              {first} is progressing slightly ahead of the expected 30-day completion schedule. At
              62% completion on day 17, the pace is consistent and engagement signals are positive —
              session lengths are within normal range and there are no signs of rushing through
              content. Sage has not applied any pace intervention. If this trajectory continues,
              {" "}{first} is on track to complete the journey approximately 3 days ahead of schedule.
            </p>
          </section>

          <section className="border-t border-border pt-4">
            <SectionHeading>Content Recommendations</SectionHeading>
            <p className="text-sm text-foreground leading-relaxed">
              Based on {first}'s assessment performance to date, Sage has identified one area
              requiring reinforcement and has surfaced two supplementary content items as
              recommended (not required) additions to the current curriculum:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground mt-2">
              <li>
                <strong>Medicare Coverage Gap Rules</strong> — {first} scored 58% on related
                questions in the Medicare Part D module assessment. A short supplementary explainer
                has been queued as an optional resource.
              </li>
              <li>
                <strong>Coordination of Benefits Edge Cases</strong> — This topic was flagged as a
                common gap for learners at this stage of the journey. The resource has been
                surfaced proactively.
              </li>
            </ul>
          </section>

          <section className="border-t border-border pt-4">
            <SectionHeading>Flags &amp; Interventions</SectionHeading>
            <div className="divide-y divide-border">
              <LabelValue label="Active Flags" value="None" />
              <LabelValue label="Interventions Applied" value="None" />
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              No flags or interventions are currently active for this learner. Sage will continue to
              monitor engagement, assessment performance, and pace — and will surface
              recommendations to you if any action is needed.
            </p>
          </section>

          <section className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Rationale last updated by Sage: Today at 09:41 AM
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
