import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { BrandLogo } from "@/components/embark/BrandLogo";

export default function UpskillerIntro() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      label: "AI-generated, just for you",
      description: "Your journey is built from your own performance signals — not a generic programme.",
    },
    {
      icon: TrendingUp,
      label: "Adapts as you grow",
      description: "As you complete modules and assessments, your journey updates to reflect your progress.",
    },
    {
      icon: ShieldCheck,
      label: "Transparent recommendations",
      description: "See exactly why each piece of content was included in your plan.",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
          Cornerstone Workforce AI
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Welcome to Embark</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Your personalised upskilling experience
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Embark is your intelligent learning companion. It brings together your training content,
            performance signals, and AI-powered guidance to build a learning journey that's tailored
            specifically to you — not a one-size-fits-all programme, but a plan built around where
            you are right now and where you need to go.
          </p>
          <p className="text-sm text-foreground">
            Your upskilling journey is generated automatically based on real signals from your
            recent performance — including skills assessments, coaching feedback, and customer
            satisfaction scores. Embark analyses these signals and builds a personalised path using
            the content available in your organisation's library. You'll always know why something
            has been recommended and how it connects to your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.label} className="rounded-lg bg-muted/60 p-4 flex flex-col gap-2">
              <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.description}</div>
            </div>
          ))}
        </div>

        {/* Sage introduction */}
        <div className="rounded-2xl bg-muted/60 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="h-7 w-7 rounded-full inline-flex items-center justify-center bg-primary/15 text-primary"
            >
              <AskSageIcon size={14} />
            </div>
            <span className="text-sm font-semibold text-foreground">Sage</span>
          </div>
          <p className="text-sm italic text-foreground">
            Hi Riley, I'm Sage, your AI Tutor. I'll be with you throughout your upskilling journey —
            answering questions, explaining why content was recommended, and helping you practise
            the skills that matter most. You can ask me anything at any time. Let's get started.
          </p>
        </div>

        <Button
          className="w-full h-11 text-base"
          onClick={() => navigate("/upskiller/signals")}
        >
          See My Signals
        </Button>
      </div>
    </div>
  );
}
