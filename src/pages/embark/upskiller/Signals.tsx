import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/embark/StatTile";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function UpskillerSignals() {
  const navigate = useNavigate();

  const steps = [
    "Embark analyses your signals and matches them to available content in your organisation's library.",
    "A personalised journey is assembled — typically ready within a few moments.",
    "You'll see your journey on your dashboard, along with a full explanation of why each element was included.",
    "As you progress, your journey adapts — completing modules and assessments updates your plan in real time.",
  ];

  return (
    <PageContainer as="div" className="flex flex-col gap-8 py-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Your Upskilling Signals</h1>
        <p className="text-sm text-muted-foreground">
          The following signals were detected in your recent performance data. Embark has used
          these to identify areas for development and will now generate a personalised learning
          journey for you.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          label="Skills gaps identified"
          value={3}
          variant="warning"
          subLabel="Based on your most recent skills assessment"
        />
        <StatTile
          label="Coaching score"
          value="72%"
          variant="warning"
          subLabel="Below the 80% benchmark for your role"
        />
        <StatTile
          label="Average CSAT score"
          value="3.4 / 5"
          variant="warning"
          subLabel="Across your last 20 interactions"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Signal Details</h2>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Skills Assessment — Gaps Detected
          </h3>
          <p className="text-sm text-foreground">
            Your most recent skills assessment identified gaps in three areas. These have been
            flagged as priority development areas and will form the core of your upskilling journey.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Objection Handling",
              "Compliance Knowledge",
              "Product Knowledge — Medicare Advantage",
            ].map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-warning/40 bg-warning/10 text-warning-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Coaching Feedback — Below Benchmark
          </h3>
          <p className="text-sm text-foreground">
            Your average coaching score over the last 4 weeks is 72%, against a role benchmark of
            80%. Your coach has noted recurring themes around handling complex customer objections
            and structuring calls effectively.
          </p>
          <LeftBorderCard borderVariant="muted" padding="sm">
            <div className="space-y-1">
              <p className="text-sm italic text-foreground">
                "Responses to objections tend to be accurate but lack confidence and structure.
                Recommend targeted practice on objection handling frameworks and active listening."
              </p>
              <p className="text-xs text-muted-foreground">Coach note — 14 Jan 2025</p>
            </div>
          </LeftBorderCard>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Customer Satisfaction — Below Target
          </h3>
          <p className="text-sm text-foreground">
            Your average CSAT score of 3.4 out of 5 is below the team target of 4.0. Analysis of
            recent interactions indicates that customers felt responses were sometimes unclear or
            lacked confidence, particularly when discussing plan options and costs.
          </p>
          <Badge
            variant="outline"
            className="border-warning/40 bg-warning/10 text-warning-foreground"
          >
            Team average: 4.1 / 5
          </Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">What Happens Next</h2>
        <p className="text-sm text-foreground">
          Based on these signals, Embark will now generate a personalised upskilling journey for
          you. This journey will include targeted learning modules, assessments, and role-play
          practice chosen specifically to address your identified development areas.
        </p>
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex justify-end">
        <Button
          className="h-11 text-base px-6"
          onClick={() => navigate("/upskiller/generating")}
        >
          Generate My Journey
        </Button>
      </div>
    </PageContainer>
  );
}
