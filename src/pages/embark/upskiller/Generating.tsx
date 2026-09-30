import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

function SageEntry() {
  return (
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
        Hi Riley, I'm Sage, your AI Tutor. Ask me anything about your upskilling journey — I'm
        here to help you get the most out of it.
      </p>
    </div>
  );
}

export default function UpskillerGenerating() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / duration) * 100);
      setProgress(next);
      if (next < 100) {
        requestAnimationFrame(tick);
      } else {
        navigate("/upskiller/dashboard");
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [navigate]);

  return (
    <PageContainer as="div" className="flex-1 flex flex-col gap-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Good morning, Riley</h1>
        <p className="text-sm text-muted-foreground">
          Setting up your personalised upskilling journey.
        </p>
      </header>

      <SageEntry />

      <div className="rounded-lg border border-border bg-card p-6 sm:p-8 space-y-4 text-center">
        <div className="flex justify-center">
          <Sparkles
            className="h-10 w-10 text-primary animate-pulse"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Your personalised journey is being generated
        </h2>
        <p className="text-sm text-muted-foreground max-w-[520px] mx-auto">
          Embark is analysing your signals and building a learning plan tailored to your
          development areas. This usually takes just a moment.
        </p>
        <Progress value={progress} className="w-full" />
        <p className="text-xs text-muted-foreground">
          Matching skills gaps to available content · Sequencing modules · Preparing your AI rationale
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          className="h-11 text-base px-6"
          onClick={() => navigate("/upskiller/dashboard")}
        >
          View My Journey
        </Button>
        <p className="text-xs text-muted-foreground">
          In the live product, your dashboard will update automatically when your journey is ready.
        </p>
      </div>
    </PageContainer>
  );
}
