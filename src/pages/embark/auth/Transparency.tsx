import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/embark/BrandLogo";

export default function Transparency() {
  const navigate = useNavigate();

  const signals = [
    "Your current role: Investment Manager",
    "Your practice area: Investment Management",
    "Your cohort: IM Intake · London",
    "Skills on your profile: Client suitability, Investment fundamentals",
    "External qualification: CISI Level 4 is recorded outside Embark",
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
          Cornerstone Workforce AI
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-lg p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">
            Here's what we used to personalise your learning path
          </h2>
          <p className="text-sm text-muted-foreground">
            This information comes from your HR profile.
          </p>
        </div>

        <ul className="space-y-3">
          {signals.map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-foreground">{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs italic text-muted-foreground">
          You can speak to your manager or HR if you have questions about what's on your profile.
        </p>

        <p className="text-xs italic text-muted-foreground">
          Everyone on this intake completes the full Investment Management competency curriculum. There is no baseline skip.
        </p>

        <Button
          className="w-full h-11 text-base"
          onClick={() => navigate("/learner/home")}
        >
          Continue to your Action Centre →
        </Button>
      </div>
    </div>
  );
}
