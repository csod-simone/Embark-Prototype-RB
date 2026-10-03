import { useNavigate } from "react-router-dom";
import { GraduationCap, Sparkles } from "lucide-react";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { SageTag } from "@/components/embark/SageTag";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

const confettiKeyframes = `
@keyframes embark-confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(160px) rotate(360deg); opacity: 0; }
}
`;

const sparkles = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 7 + 5) % 100}%`,
  delay: `${(i % 5) * 0.15}s`,
  color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))",
  size: 6 + ((i * 3) % 6),
}));

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function GraduatingCeremony() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f4f5f8]">
      <style>{confettiKeyframes}</style>
      <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10">
        {/* Confetti */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
          {sparkles.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute top-0 rounded-full"
              style={{
                left: s.left,
                width: s.size,
                height: s.size,
                background: s.color,
                animation: `embark-confetti 1.6s ease-out ${s.delay} forwards`,
              }}
            />
          ))}
        </div>

        {/* Hero */}
        <PageContainer as="div" className="text-center space-y-3 relative">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
            <GraduationCap className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
            Congratulations, Matteo!
          </h1>
          <p className="text-lg text-primary font-medium">
            You've completed Investment Manager Full Onboarding Journey
          </p>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>
              Your line manager will review the evidence and approve graduation. Embark will not
              issue a certificate until they record that you have passed CISI Level 4 outside this
              platform. Based on their review, they'll take one of the following actions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-left">
              <li>
                <span className="font-bold">Approve</span> — You're ready!
              </li>
              <li>
                <span className="font-bold">Soft Landing</span> — You'll move into a period of
                supervised practice before full sign-off.
              </li>
              <li>
                <span className="font-bold">Flag</span> — Additional practice has been identified
                to help you build further confidence before graduating.
              </li>
            </ul>
            <p>You'll be notified once your line manager has completed their review.</p>
          </div>
        </PageContainer>

        {/* Summary card */}
        <PageContainer as="div" className="mt-8 max-w-[880px] rounded-2xl border border-border bg-card py-6 shadow-sm">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground text-center mb-3">
            Your journey summary
          </div>
          <SummaryRow label="Modules completed" value="4 of 4" />
          <SummaryRow label="Avg assessment score" value="88%" />
          <SummaryRow label="Programme completed" value="Today" />
          <div className="border-t border-border mt-3 pt-3 space-y-1 text-center">
            <div className="text-xs text-muted-foreground">Managed by Phoebe Kapoor</div>
            <div className="text-xs text-muted-foreground">IM Intake Cohort A</div>
          </div>
        </PageContainer>

        {/* Sage message */}
        <PageContainer as="div" className="mt-6 space-y-2">
          <SageTag />
          <TutorBubble
            message="It's been a pleasure supporting you through this journey, Matteo. You asked great questions, pushed through the tough modules, and finished strong. I'll always be here if you need a refresher or have questions as you start your new role. Onwards!"
          />
        </PageContainer>

        {/* CTA */}
        <PageContainer as="div" className="mt-6 flex justify-center">
          <Button onClick={() => navigate("/learner/graduating")}>
            Go to my dashboard
          </Button>
        </PageContainer>

        <PageContainer as="p" noPadding className="mt-6 text-xs italic text-muted-foreground text-center">
          A completion certificate is issued only after your line manager signs off and CISI Level 4 is recorded.
        </PageContainer>
      </div>
    </div>
  );
}
