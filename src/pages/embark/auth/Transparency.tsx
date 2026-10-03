import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
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
      <div className="flex flex-col items-center text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
          Cornerstone Workforce AI
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Here's what we used to personalise your learning path
            </h2>
            <Badge variant="ai" className="gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
              <AskSageIcon size={14} />
              AI
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            This information comes from your HR profile.
          </p>
        </div>

        <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
          {signals.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <p className="text-xs italic text-muted-foreground">
          You can speak to your manager or HR if you have questions about what's on your profile.
        </p>

        <p className="text-xs italic text-muted-foreground">
          Everyone on this intake completes the full Investment Management competency curriculum. There is no baseline skip.
        </p>

        <Button
          className="h-11 w-full text-base"
          onClick={() => navigate("/learner/home")}
        >
          Continue to your Action Centre →
        </Button>
      </div>
    </div>
  );
}
