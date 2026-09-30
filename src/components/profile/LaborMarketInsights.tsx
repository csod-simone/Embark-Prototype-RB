import { Info } from "lucide-react";

export function LaborMarketInsights() {
  const emergingSkills = [
    "Strategic Selling",
    "AI-Powered Automation Tools",
    "Customer Data Forecast",
    "Automated Sales Technique",
  ];

  const atRiskSkills = [
    "Data Analysis",
    "Microsoft Excel",
    "Documentation",
  ];

  return (
    <div>
      <h3
        className="text-lg font-semibold text-foreground mb-4"
       
      >
        Labor market insights
      </h3>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-primary font-medium mb-2">
            Emerging skills gaining importance for your role
          </p>
          <div className="flex flex-wrap gap-2">
            {emergingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-sm font-medium border border-border rounded-full px-3 py-1.5 text-foreground"
              >
                {skill}
                <Info size={12} className="text-muted-foreground" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Your skills at risk of AI automation
          </p>
          <div className="flex flex-wrap gap-2">
            {atRiskSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-sm font-medium border border-border rounded-full px-3 py-1.5 text-foreground"
              >
                {skill}
                <Info size={12} className="text-muted-foreground" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
