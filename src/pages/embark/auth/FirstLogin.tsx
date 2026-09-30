import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="w-full flex flex-col gap-5">
      <div className="text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1.5 text-xs font-medium tracking-[0.24em] text-muted-foreground">
          Cornerstone workforce AI
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-5 sm:p-7 space-y-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Welcome to the Rathbones Institute
          </h1>
          <p className="text-sm text-muted-foreground">
            Investment Management intake · London
          </p>
          <p className="text-sm text-foreground leading-snug">
            This programme prepares you for client work in Investment Management. You will complete
            the full competency curriculum, including knowledge checks, role-play, and a chapter gate.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Personalized for you</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <AskSageIcon size={14} />
              AI
            </span>
          </div>
          <p className="text-sm text-foreground leading-snug">
            Welcome to Embark, Jordan! You'll start with a quick 8–10 minute baseline assessment
            so we can tailor your journey to what you already know.
          </p>
          <p className="text-sm text-foreground leading-snug">
            Based on your experience, we've already skipped 1 module for you — no waiting needed.
            Your manager has been notified and can review this within 7 days.
          </p>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-base font-bold text-foreground">What happens next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {steps.map((label, i) => (
              <div
                key={i}
                className="rounded-xl bg-muted/50 p-4 flex flex-col gap-3 min-h-[92px]"
              >
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-3">
            <SageAvatar size="sm" />
            <span className="text-base font-bold text-foreground">Meet Sage our AI Assistant</span>
          </div>
          <p className="text-sm italic text-foreground leading-snug">
            "Hi Jordan, I'm Sage, your AI tutor. I'll be with you throughout your journey —
            answering questions, checking your understanding, and helping you when you get stuck.
            You can ask me anything at any time. Let's get started."
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <Button
            className="w-full h-10 text-base rounded-full"
            onClick={() => navigate("/transparency")}
          >
            Start my journey
          </Button>
        </div>
      </div>
    </div>
  );
}