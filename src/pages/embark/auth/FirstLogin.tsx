import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AskSageIcon, SageAvatar } from "@/components/embark/AskSageIcon";
import { BrandLogo } from "@/components/embark/BrandLogo";

export default function FirstLogin() {
  const navigate = useNavigate();

  const steps = [
    "Work through your modules with Sage",
    "Complete assessments to unlock the next module",
    "Build your readiness score",
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1.5 text-xs font-medium tracking-[0.24em] text-muted-foreground">
          Cornerstone workforce AI
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome to the Rathbones Institute
          </h1>
          <p className="text-sm text-muted-foreground">
            Investment Management intake · London
          </p>
          <p className="text-sm leading-snug text-foreground">
            This programme prepares you for client work in Investment Management. You will complete
            the full competency curriculum, including knowledge checks, role-play, and a chapter gate.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Personalized for you</h2>
            <Badge variant="ai" className="gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
              <AskSageIcon size={14} />
              AI
            </Badge>
          </div>
          <p className="text-sm leading-snug text-foreground">
            Welcome to Embark, Jordan! You'll start with a quick 8–10 minute baseline assessment
            so we can tailor your journey to what you already know.
          </p>
          <p className="text-sm leading-snug text-foreground">
            Based on your experience, we've already skipped 1 module for you — no waiting needed.
            Your manager has been notified and can review this within 7 days.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">What happens next</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {steps.map((label, i) => (
              <div
                key={i}
                className="flex min-h-[92px] flex-col gap-3 rounded-2xl border-0 bg-accent p-4"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border-0 bg-accent p-5">
          <div className="flex items-center gap-3">
            <SageAvatar size="sm" />
            <span className="text-base font-semibold text-foreground">Meet Sage our AI Assistant</span>
          </div>
          <p className="text-sm italic leading-snug text-foreground">
            "Hi Jordan, I'm Sage, your AI tutor. I'll be with you throughout your journey —
            answering questions, checking your understanding, and helping you when you get stuck.
            You can ask me anything at any time. Let's get started."
          </p>
        </div>

        <Button
          className="h-11 w-full text-base"
          onClick={() => navigate("/transparency")}
        >
          Start my journey
        </Button>
      </div>
    </div>
  );
}
