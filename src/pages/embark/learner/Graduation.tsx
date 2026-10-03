import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, GraduationCap, Sparkles, Theater } from "lucide-react";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import { TutorBubble } from "@/components/embark/TutorBubble";
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

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-xs font-medium text-muted-foreground w-40 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground flex items-center gap-2 flex-wrap">
        {children}
      </span>
    </div>
  );
}

export default function Graduation() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f4f5f8]">
      <style>{confettiKeyframes}</style>
      <div className="relative flex min-h-full flex-col items-center justify-center px-6 py-10">
        {/* Confetti overlay */}
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
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
            Journey Complete
          </h1>
          <p className="text-sm text-muted-foreground">
            Aetna CSR Onboarding — ICHD Q3 2026
          </p>
        </PageContainer>

        {/* Record card */}
        <PageContainer as="div" className="mt-8 space-y-2 rounded-2xl border border-border bg-card py-6 shadow-sm">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">
            Graduation record
          </div>
          <Row icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Completed:">
            August 15, 2026
          </Row>
          <Row icon={<ReadinessRing size="sm" score={87} />} label="Final Readiness Score:">
            87 <BandPill band="Ready" />
          </Row>
          <Row icon={<CheckCircle2 className="h-4 w-4 text-success-dark" />} label="Modules completed:">
            7 of 8 (1 skipped — equivalency credit)
          </Row>
          <Row icon={<Theater className="h-4 w-4 text-muted-foreground" />} label="Role play sessions:">
            3 completed · 2 above threshold
          </Row>
        </PageContainer>

        <PageContainer as="p" noPadding className="mt-3 text-xs italic text-muted-foreground text-center">
          This record has been saved to your enrollment history and is visible to your manager.
        </PageContainer>

        <PageContainer as="div" className="mt-6 flex justify-center">
          <TutorBubble message="Well done, Jordan. You've completed your onboarding journey. Your readiness score of 87 puts you in the Ready band — that's a strong result. Good luck in your new role." />
        </PageContainer>

        <PageContainer as="div" className="mt-6 space-y-2">
          <Button className="w-full" onClick={() => navigate("/learner/home")}>
            Go to dashboard
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate("/learner/history")}>
            View my learning history
          </Button>
        </PageContainer>
      </div>
    </div>
  );
}
