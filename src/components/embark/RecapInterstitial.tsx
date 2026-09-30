import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Variant = "startOfDay" | "midDay" | "endOfDay";

type LabelValue = { label: string; value: string; badge?: string };
type ListItem = { label: string; sub: string };

type Content = {
  greeting: string;
  intro: string;
  section1Heading: string;
  section1Items: LabelValue[];
  section1Note: string;
  section2Heading: string;
  section2Items?: ListItem[];
  section2LabelValues?: LabelValue[];
  section2Note: string;
  primaryCta: string;
  secondaryLabel: string;
  secondaryAsLink?: boolean;
};

const CONTENT: Record<Variant, Content> = {
  startOfDay: {
    greeting: "Good morning, Alex 👋",
    intro:
      "Before you jump in, here's a quick recap of how yesterday went and what's lined up for you today.",
    section1Heading: "Yesterday",
    section1Items: [
      {
        label: "Completed",
        value:
          "3 modules — Medicare Part D Formulary Basics, Coordination of Benefits Overview, Prior Authorisation Process",
      },
      {
        label: "Assessment",
        value: "Medicare CSR Mid-Point Check — 84%",
        badge: "Passed",
      },
      { label: "Time spent learning", value: "2 hrs 10 min" },
    ],
    section1Note:
      "You showed strong understanding of formulary tiers — your assessment score reflects that. One area to keep in mind: coverage gap rules came up as a weaker point. I've made a note and we'll revisit it today.",
    section2Heading: "Coming Up Today",
    section2Items: [
      { label: "Medicare Advantage Plan Types", sub: "eLearning · 20 min" },
      { label: "CMS Compliance Essentials", sub: "Document · 15 min" },
      { label: "Medicare CSR Final Certification Assessment", sub: "Assessment · Est. 30 min" },
    ],
    section2Note:
      "You're close to completing your Medicare CSR Onboarding Journey — today's content will round out your product knowledge before the final assessment. Let's make it count.",
    primaryCta: "Let's Go",
    secondaryLabel: "Skip for now",
    secondaryAsLink: true,
  },
  midDay: {
    greeting: "Welcome back, Alex ☀️",
    intro:
      "Hope the break was good. Here's where you left off this morning and what's lined up for the rest of your session.",
    section1Heading: "This Morning",
    section1Items: [
      {
        label: "Completed",
        value: "2 modules — Medicare Advantage Plan Types, CMS Compliance Essentials",
      },
      { label: "Time spent", value: "1 hr 25 min" },
    ],
    section1Note:
      "Solid first half. You moved through both modules efficiently. I noticed you re-read the CMS Compliance section on fraud and abuse twice — that's a topic that often comes up in assessments, so that extra attention will pay off.",
    section2Heading: "Up Next This Afternoon",
    section2Items: [
      {
        label: "Medicare CSR Final Certification Assessment",
        sub: "Assessment · Est. 30 min",
      },
      { label: "Journey Completion", sub: "Medicare CSR Full Onboarding Journey" },
    ],
    section2Note:
      "This afternoon is the big one — your final certification assessment. Based on your performance so far, I think you're well prepared. Remember the coverage gap rules we flagged this morning — review your notes on that before starting if you have a few minutes.",
    primaryCta: "Pick Up Where I Left Off",
    secondaryLabel: "Skip for now",
    secondaryAsLink: true,
  },
  endOfDay: {
    greeting: "Great work today, Alex 🌟",
    intro:
      "You've reached the end of your learning day. Here's a summary of everything you accomplished — and a quick look at what's coming up tomorrow.",
    section1Heading: "Today's Summary",
    section1Items: [
      {
        label: "Completed",
        value: "2 modules — Medicare Advantage Plan Types, CMS Compliance Essentials",
      },
      {
        label: "Assessment",
        value: "Medicare CSR Final Certification Assessment — 91%",
        badge: "Passed",
      },
      {
        label: "Journey milestone",
        value: "Medicare CSR Full Onboarding Journey",
        badge: "Completed",
      },
      { label: "Total time spent today", value: "3 hrs 35 min" },
    ],
    section1Note:
      "Outstanding day, Alex. Completing the Medicare CSR Final Certification with 91% is a fantastic result — especially given it's the capstone of your onboarding journey. You've covered a lot of ground this week. Take a moment to acknowledge that.",
    section2Heading: "Tomorrow",
    section2LabelValues: [
      { label: "Next up", value: "Compliance Refresher Journey" },
      { label: "Starting with", value: "Annual Compliance Overview — eLearning · 25 min" },
    ],
    section2Note:
      "Tomorrow you'll begin the Compliance Refresher Journey — it's shorter than your onboarding but important for keeping your certifications current. Get a good rest and I'll have a full briefing ready for you in the morning.",
    primaryCta: "See You Tomorrow",
    secondaryLabel: "View My Progress",
    secondaryAsLink: false,
  },
};

function LabelValueRow({ item }: { item: LabelValue }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{item.label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground flex items-center gap-2 flex-wrap">
        <span>{item.value}</span>
        {item.badge && (
          <Badge variant="success" className="gap-1">
            ✓ {item.badge}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function RecapInterstitial({
  variant,
  onDismiss,
  onSecondary,
}: {
  variant: Variant;
  onDismiss: () => void;
  onSecondary?: () => void;
}) {
  const c = CONTENT[variant];

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto py-12 px-6">
        {/* Sage presence */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              S
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium text-foreground">Sage</div>
        </div>

        <h2 className="mt-6 text-2xl font-medium text-foreground">{c.greeting}</h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-prose">{c.intro}</p>

        {/* Section 1 */}
        <div className="mt-8">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">
            {c.section1Heading}
          </div>
          <div className="mt-3 rounded-lg border border-border bg-card p-4 space-y-3">
            {c.section1Items.map((item, i) => (
              <LabelValueRow key={i} item={item} />
            ))}
          </div>
          <div className="mt-3">
            <LeftBorderCard borderVariant="brand">
              <p className="text-sm text-foreground">{c.section1Note}</p>
            </LeftBorderCard>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mt-8">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">
            {c.section2Heading}
          </div>
          {c.section2Items && (
            <ol className="mt-3 space-y-2">
              {c.section2Items.map((it, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border bg-card p-3 flex items-start gap-3"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{it.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{it.sub}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {c.section2LabelValues && (
            <div className="mt-3 rounded-lg border border-border bg-card p-4 space-y-3">
              {c.section2LabelValues.map((item, i) => (
                <LabelValueRow key={i} item={item} />
              ))}
            </div>
          )}
          <div className="mt-3">
            <LeftBorderCard borderVariant="brand">
              <p className="text-sm text-foreground">{c.section2Note}</p>
            </LeftBorderCard>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <Button className="w-full sm:w-auto sm:min-w-[220px]" onClick={onDismiss}>
            {c.primaryCta}
          </Button>
          {c.secondaryAsLink ? (
            <Button
              variant="link"
              className="text-muted-foreground"
              onClick={onSecondary ?? onDismiss}
            >
              {c.secondaryLabel}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full sm:w-auto sm:min-w-[220px]"
              onClick={onSecondary ?? onDismiss}
            >
              {c.secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
