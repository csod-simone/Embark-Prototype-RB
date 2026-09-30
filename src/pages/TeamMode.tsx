// sidebar rendered in AppLayout
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ArrowRight, Target, Pencil, ArrowLeftRight, MessageCircle, Activity, Eye, EyeOff } from "lucide-react";

import { StarIcon } from "@/components/StarIcon";
import { cn } from "@/lib/utils";

// Map badge labels to the same tones used by the left sidebar status dots:
// pending → green (#16a34a), risk → red (#c44a2c), review → blue (#3b82f6)
const toneBadgeClass = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes("risk")) return "border-[#c44a2c] text-[#c44a2c] bg-transparent";
  if (l.includes("pending")) return "border-[#16a34a] text-[#16a34a] bg-transparent";
  return "border-[#3b82f6] text-[#3b82f6] bg-transparent";
};

type StatCard = {
  label: string;
  value: string;
  subtitle: string;
  subtitleTone: "destructive" | "muted";
};

const statCards: StatCard[] = [
  { label: "Workforce stable", value: "", subtitle: "No unusual movement detected", subtitleTone: "muted" },
  { label: "5 employees may need support", value: "", subtitle: "Burnout signals increased this week", subtitleTone: "destructive" },
  { label: "Hiring risk detected", value: "", subtitle: "6 reqs close within 5 days", subtitleTone: "destructive" },
  { label: "Goals on track", value: "", subtitle: "No delivery risks detected", subtitleTone: "muted" },
  { label: "Skill readiness improving", value: "", subtitle: "6 cohorts nearing completion", subtitleTone: "muted" },
];

type Priority = "CRITICAL" | "HIGH";


type Initiative = {
  priority: Priority;
  duration: string;
  title: string;
  description: string;
  sponsor: string;
  streams: number;
  slots: number;
  badgeLabel?: string;
};

const initiatives: Initiative[] = [
  {
    priority: "CRITICAL",
    duration: "12 months · runs through FY26",
    title: "AI-First Culture Program",
    description:
      "Internal Mobility found 4 internal matches with 80%+ fit — including 2 from your own team ready to move now.",
    sponsor: "David Lin",
    streams: 5,
    slots: 5,
    badgeLabel: "Review internal mobility",
  },
  {
    priority: "HIGH",
    duration: "10 months · runs through FY26",
    title: "Internal Talent First — Skills-Screen first",
    description:
      "Skills Architect found 14 analysts already met the 70% threshold. 3 of 4 slots can be staffed with internal candidates.",
    sponsor: "David Lin",
    streams: 4,
    slots: 4,
    badgeLabel: "Review staffing initiative",
  },
  {
    priority: "HIGH",
    duration: "36 weeks · Phase 2 build through FY26 close",
    title: "Real-Time Data Platform Modernization",
    description:
      "Legacy batch caps latency at 8–14 min — quant clients want sub-200ms.",
    sponsor: "David Lin",
    streams: 6,
    slots: 8,
  },
];

const needToKnow = [
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: ArrowLeftRight,
    tag: "View internal matches",
    title: "Internal Mobility · 52 days open · Candidate drop-off detected",
    subtitle: "3 internal candidates above 70% match · pipeline cooling",
    action: "View matches",
  },
  {
    icon: Target,
    iconBg: "bg-[hsl(150_40%_90%)]",
    iconColor: "text-[hsl(150_50%_30%)]",
    tagIcon: MessageCircle,
    tag: "Approve mentor matches",
    title: "3 people on your team have mentor requests",
    subtitle: "Pending mentor matches across DATA + ENG · oldest open 5 days",
    action: "Match mentor",
  },
  {
    icon: Pencil,
    iconBg: "bg-[hsl(280_50%_92%)]",
    iconColor: "text-[hsl(280_50%_40%)]",
    tagIcon: Activity,
    tag: "Respond to reflections",
    title: "2 people on your team shared tough reflections",
    subtitle: "Reflections shared in the last 7 days · review and respond",
    action: "Review",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-[hsl(38_85%_45%/0.12)]",
    iconColor: "text-[hsl(38_85%_35%)]",
    tagIcon: MessageCircle,
    tag: "Review risk signal",
    title: "4 employees showing early performance drift signals",
    subtitle: "Drift + absence + sentiment · earliest signal 11 days ago",
    action: "Review",
  },
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Review gap",
    title: "ML Ops gap widening · 4 critical roles unfilled",
    subtitle: "Skills coverage 62% vs 85% target · upskill 6 engineers",
    action: "Review",
  },
  {
    tag: "Check out AI tool adoption",
    title: "Mercury adoption crossed 68% — exception review time down 31%",
    subtitle: "14 deployed AI tools across DATA + ENG teams.",
    action: "View detail",
  },
  {
    tag: "Sign-off on upskilling",
    title: "Data annotation insourcing — projected $2.1M/yr",
    subtitle: "18 internal DATA analysts already in upskill cohort. Sign-off needed before Q3.",
    action: "View detail",
  },
  {
    tag: "Review career goals",
    title: "14 analysts aspiring toward Director, Data Operations",
    subtitle: "3 in level-to-level cohort · bench depth +2 vs Q1.",
    action: "View detail",
  },
  {
    tag: "Check out signal",
    title: 'Hyderabad COE Q2 cohort ahead of pace · 86% mastery',
    subtitle: 'Eight new analysts in Hyderabad · 4 already "Ahead".',
    action: "View detail",
  },
  {
    tag: "Review for 1:1",
    title: "ENG Platform sentiment dipped 9 pts post re-org",
    subtitle: "3 senior engineers flagged · proactive 1:1 nudges queued for skip-levels.",
    action: "View detail",
  },
];

const needToAct = [
  {
    tagIcon: ArrowLeftRight,
    tag: "Sign-off",
    title: "Arjun Mehta → Director, Data Ops · sign-off needed",
    subtitle: "94% fit · 0 blocking gaps · ready this quarter",
    primary: "Review for sign-off",
  },
  {
    tagIcon: Target,
    tag: "Sign-off",
    title: "Q2 goals · 3 reports awaiting your sign-off",
    subtitle: "Aligner flagged 2 misaligned drafts · edits ready",
    primary: "Review drafts for sign-off",
  },
  {
    tagIcon: MessageCircle,
    tag: "Performance coaching hand raised",
    title: "3 in Performance Coaching · 2 raised hands",
    subtitle: "Coaching cohort Day 18/60 · 2 requests in last 48h",
    primary: "Review coaching requests",
  },
];


const MAX_VISIBLE = 4;

type ViewMoreProps = { expanded: boolean; onToggle: () => void };
const ViewMoreButton = ({ expanded, onToggle }: ViewMoreProps) => (
  <div className="flex justify-center mt-4">
    <Button variant="ghost" size="sm" onClick={onToggle}>
      {expanded ? "View less" : "View more"}
    </Button>
  </div>
);

const TeamMode = () => {
  const [actExpanded, setActExpanded] = useState(false);
  const [knowExpanded, setKnowExpanded] = useState(false);
  const [initiativesExpanded, setInitiativesExpanded] = useState(false);
  const [snoozed, setSnoozed] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToId = (id: string, opts?: { expand?: "act" | "know" | "initiatives" }) => {
    if (opts?.expand === "act") setActExpanded(true);
    if (opts?.expand === "know") setKnowExpanded(true);
    if (opts?.expand === "initiatives") setInitiativesExpanded(true);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(id);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightId(null), 2000);
    });
  };

  const highlightClass = (id: string) =>
    highlightId === id ? "ring-2 ring-primary ring-offset-2" : "";

  const visibleAct = actExpanded ? needToAct : needToAct.slice(0, MAX_VISIBLE);
  const visibleKnow = knowExpanded ? needToKnow : needToKnow.slice(0, MAX_VISIBLE);
  const INITIATIVES_VISIBLE = 2;
  const visibleInitiatives = initiativesExpanded ? initiatives : initiatives.slice(0, INITIATIVES_VISIBLE);

  return (
    <div className="flex flex-1 overflow-hidden">
      <main
        className="flex-1 overflow-y-auto"
        aria-label="Action center"
      >
        <div
          className={`${snoozed ? "bg-background" : "bg-[#FAF6F4] dark:bg-muted"} transition-colors duration-500 px-12 pt-8 pb-6`}
        >
          <div className="max-w-[1040px] mx-auto w-full">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h1 className="text-foreground tracking-tight font-semibold text-3xl">
                Your daily briefing is ready, <span className="text-primary">David</span>.
              </h1>
              {!snoozed ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(150_70%_40%)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(150_70%_40%)]"></span>
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">Compiled at 10:00am</span>
                  </div>
                  <Button
                    variant="tertiary"
                    size="icon"
                    onClick={() => setSnoozed(true)}
                    aria-label="Hide daily briefing"
                  >
                    <EyeOff size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="tertiary"
                  size="icon"
                  onClick={() => setSnoozed(false)}
                  aria-label="Show daily briefing"
                >
                  <Eye size={16} />
                </Button>
              )}
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${snoozed ? "max-h-0 opacity-0" : "max-h-[1200px] opacity-100"}`}
              aria-hidden={snoozed}
            >
            <div className="py-2">
              <p className="text-foreground font-normal text-lg mb-5">
                I reviewed your organization overnight and found <span className="text-foreground font-semibold">4</span> workforce actions that need your attention today.
              </p>
              <p className="text-foreground font-normal text-lg">
                <button type="button" onClick={() => scrollToId("act-card-0")} className="text-primary hover:underline">Arjun Mehta's sign-off</button> and <button type="button" onClick={() => scrollToId("act-card-1")} className="text-primary hover:underline">Q2 goals review</button> need your input today — along with <button type="button" onClick={() => scrollToId("act-card-2")} className="text-primary hover:underline">3 coaching requests</button> from your team. Agents also flagged a <button type="button" onClick={() => scrollToId("know-card-5")} className="text-primary hover:underline">Mercury adoption milestone</button> and an <button type="button" onClick={() => scrollToId("know-card-3")} className="text-primary hover:underline">early risk signal</button> across 4 employees worth a look.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Button variant="default" size="sm" className="hover:bg-[color-mix(in_srgb,hsl(var(--primary))_88%,black)]" onClick={() => scrollToId("act-card-0")}>Start with top priority</Button>
                <Button variant="tertiary" size="sm" onClick={() => scrollToId("section-know", { expand: "know" })}>What agents found overnight</Button>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="px-12 pb-8">
          <div className="max-w-[1040px] mx-auto w-full">




          <section id="section-waiting" className="mt-8 scroll-mt-8" aria-labelledby="critical-initiatives-heading">
            <div className="flex items-center mb-2">
              <h2 id="critical-initiatives-heading" className="text-base font-semibold text-foreground flex items-center gap-2">
                <StarIcon size={16} />
                Critical initiatives
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{initiatives.length}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleInitiatives.map((item, idx) => (
                <article
                  key={item.title}
                  id={`waiting-card-${idx}`}
                  className={`relative rounded-[24px] border border-border bg-background p-4 overflow-hidden ds-card-hover transition-shadow scroll-mt-24 ${highlightClass(`waiting-card-${idx}`)}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-medium", toneBadgeClass("At risk"))}
                      >
                        {item.badgeLabel ?? (item.priority === "CRITICAL" ? "Pending" : "Review")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">· {item.duration}</span>
                    </div>
                    <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label="Staff this now">
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-foreground truncate text-base mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-3 text-sm line-clamp-2 bg-[#FAF6F4] dark:bg-muted/40 rounded-xl px-3 py-2">{item.description}</p>
                  <p className="text-muted-foreground text-sm">
                    Sponsor <span className="font-semibold text-foreground">{item.sponsor}</span> · {item.streams} streams · {item.slots} slots
                  </p>
                </article>
              ))}
            </div>
            {initiatives.length > INITIATIVES_VISIBLE && (
              <ViewMoreButton expanded={initiativesExpanded} onToggle={() => setInitiativesExpanded((v) => !v)} />
            )}
          </section>

          {/* Need to act (full width) */}
          <section id="section-act" className="mt-6 pb-4 scroll-mt-8" aria-labelledby="need-to-act-heading">
            <div className="flex items-center mb-2">
              <h2 id="need-to-act-heading" className="text-base font-semibold text-foreground flex items-center gap-2"><StarIcon size={16} />Need to act<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{needToAct.length}</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleAct.map((item, idx) => (
                <div key={item.title} id={`act-card-${idx}`} className={`rounded-[24px] border border-border bg-background p-4 ds-card-hover transition-shadow scroll-mt-24 ${highlightClass(`act-card-${idx}`)}`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <Badge variant="outline" className="text-xs font-medium mb-1">
                      {item.primary}
                    </Badge>
                    <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label={item.primary}>
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-semibold text-foreground truncate text-base">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              ))}
            </div>
            {needToAct.length > MAX_VISIBLE && (
              <ViewMoreButton expanded={actExpanded} onToggle={() => setActExpanded((v) => !v)} />
            )}
          </section>

          {/* Need to know (full width) */}
          <section id="section-know" className="mt-6 scroll-mt-8" aria-labelledby="need-to-know-heading">
            <div className="flex items-center mb-2">
              <h2 id="need-to-know-heading" className="text-base font-semibold text-foreground flex items-center gap-2"><StarIcon size={16} />Need to know<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{needToKnow.length}</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleKnow.map((item, idx) => (
                <div key={item.title} id={`know-card-${idx}`} className={`bg-background border border-border rounded-[24px] p-4 ds-card-hover transition-shadow scroll-mt-24 ${highlightClass(`know-card-${idx}`)}`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <Badge variant="outline" className="text-xs font-medium mb-1">
                      {item.tag}
                    </Badge>
                    <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label={item.action}>
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-semibold text-foreground truncate text-base">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              ))}
            </div>
            {needToKnow.length > MAX_VISIBLE && (
              <ViewMoreButton expanded={knowExpanded} onToggle={() => setKnowExpanded((v) => !v)} />
            )}
          </section>

          </div>
        </div>
      </main>

    </div>
  );
};

export default TeamMode;
