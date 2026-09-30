// Duplicate of TeamMode without the anchored background image
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, AlertCircle, AlertTriangle, Info, ArrowRight, Target, Pencil, ArrowLeftRight, MessageCircle, Activity, Compass, TrendingUp, Rocket, Eye, EyeOff } from "lucide-react";


type StatCard = {
  label: string;
  value: string;
  subtitle: string;
  subtitleTone: "destructive" | "muted";
};

const statCards: StatCard[] = [
  { label: "Headcount", value: "412", subtitle: "Across 6 families", subtitleTone: "muted" },
  { label: "Support alerts", value: "5", subtitle: "Members flagged", subtitleTone: "destructive" },
  { label: "Open reqs", value: "7", subtitle: "6 closing within 5 days", subtitleTone: "destructive" },
  { label: "Goals at risk", value: "0", subtitle: "Across all pillars", subtitleTone: "muted" },
  { label: "In journeys", value: "43", subtitle: "6 cohorts complete", subtitleTone: "muted" },
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
};

const initiatives: Initiative[] = [];

const needToKnow = [
  // From /me "Things to know"
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "View learning track",
    title: "Data Analyst New-Hire — Q2 2025",
    subtitle: "Owner David Lin · 8 learners · cohort on pace",
    action: "View track",
  },
  {
    icon: Target,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Development objective",
    title: "Sophia Kim · Develop team leadership and coaching skills",
    subtitle: "Sponsor David Lin · 4 milestones · 2 complete",
    action: "Open objective",
  },
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Skills graph",
    title: "AI / ML Model Operations proficiency lifted 3 → 4",
    subtitle: "System-inferred · 14d window · confidence high",
    action: "View skill",
  },
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Mentor pairing",
    title: "1 mentor pairing pending approval",
    subtitle: "Requested 2d ago · 1 pairing · 92% match",
    action: "Review pairing",
  },
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Career interest",
    title: "Career interest sent · Director, Data Operations +1 more",
    subtitle: "Reviewer Mateo Lee · 2 roles · awaiting response",
    action: "View interest",
  },
  {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: ArrowLeftRight,
    tag: "View req matches",
    title: "Internal Mobility · 52 days open · Candidate drop-off detected",
    subtitle: "3 internal candidates above 70% match · pipeline cooling",
    action: "View matches",
  },
  {
    icon: Target,
    iconBg: "bg-[hsl(150_40%_90%)]",
    iconColor: "text-[hsl(150_50%_30%)]",
    tagIcon: MessageCircle,
    tag: "Match mentors",
    title: "3 people on your team have mentor requests",
    subtitle: "Pending mentor matches across DATA + ENG · oldest open 5 days",
    action: "Match mentor",
  },
  {
    icon: Pencil,
    iconBg: "bg-[hsl(280_50%_92%)]",
    iconColor: "text-[hsl(280_50%_40%)]",
    tagIcon: Activity,
    tag: "Review reflections",
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
    icon: AlertTriangle,
    iconBg: "bg-[hsl(38_85%_45%/0.12)]",
    iconColor: "text-[hsl(38_85%_35%)]",
    tagIcon: ArrowLeftRight,
    tag: "Risk",
    title: "Internal Talent First — Skills-Screen first",
    subtitle: "Skills Architect found 14 analysts already met the 70% threshold. 3 of 4 slots can be staffed with internal candidates. · 4 streams · 4 slots",
    action: "Review",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-[hsl(38_85%_45%/0.12)]",
    iconColor: "text-[hsl(38_85%_35%)]",
    tagIcon: Activity,
    tag: "Risk",
    title: "Real-Time Data Platform Modernization",
    subtitle: "Legacy batch caps latency at 8–14 min — quant clients want sub-200ms. · 6 streams · 8 slots",
    action: "Review",
  },
  // Moved from "Today's insights"
  {
    icon: Compass,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Compass,
    tag: "Check out AI tool adoption",
    title: "Mercury adoption crossed 68% — exception review time down 31%",
    subtitle: "14 deployed AI tools across DATA + ENG teams.",
    action: "View",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: TrendingUp,
    tag: "Sign-off on upskilling",
    title: "Data annotation insourcing — projected $2.1M/yr",
    subtitle: "18 internal DATA analysts already in upskill cohort. Sign-off needed before Q3.",
    action: "View",
  },
  {
    icon: Target,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Target,
    tag: "Review career goals",
    title: "14 analysts aspiring toward Director, Data Operations",
    subtitle: "3 in level-to-level cohort · bench depth +2 vs Q1.",
    action: "View",
  },
  {
    icon: Rocket,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Rocket,
    tag: "Check out signal",
    title: "Hyderabad COE Q2 cohort ahead of pace · 86% mastery",
    subtitle: 'Eight new analysts in Hyderabad · 4 already "Ahead".',
    action: "View",
  },
  {
    icon: Activity,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagIcon: Activity,
    tag: "Retention · early signal",
    title: "ENG Platform sentiment dipped 9 pts post re-org",
    subtitle: "3 senior engineers flagged · proactive 1:1 nudges queued for skip-levels.",
    action: "View",
  },
];

const needToAct = [
  {
    tagIcon: ArrowRight,
    tag: "Review agenda items",
    title: "3 open agenda items for your next 1-1",
    subtitle: "With Mateo Lee — review and add notes before tomorrow's session.",
    primary: "Waiting on you",
  },
  {
    tagIcon: ArrowRight,
    tag: "Review internal mobility",
    title: "AI-First Culture Program",
    subtitle: "Internal Mobility found 4 internal matches with 80%+ fit. · 5 streams · 5 slots",
    primary: "At Risk",
  },
  {
    tagIcon: ArrowLeftRight,
    tag: "Review for sign-off",
    title: "Arjun Mehta → Director, Data Ops · sign-off needed",
    subtitle: "94% fit · 0 blocking gaps · ready this quarter",
    primary: "Review",
  },
  {
    tagIcon: Target,
    tag: "Review drafts for sign-off",
    title: "Q2 goals · 3 reports awaiting your sign-off",
    subtitle: "Aligner flagged 2 misaligned drafts · edits ready",
    primary: "Review",
  },
  {
    tagIcon: MessageCircle,
    tag: "Review coaching requests",
    title: "3 in Performance Coaching · 2 raised hands",
    subtitle: "Coaching cohort Day 18/60 · 2 requests in last 48h",
    primary: "Review",
  },
];

const whereHeaded = [
  {
    tag: "Career path",
    title: "Aspiration · Data Operations Manager",
    subtitle: "Track Data Operations · 3 skills · NY-anchored",
    action: "Explore path",
  },
  {
    tag: "No org alignment",
    title: "Reduce personal error rate on corporate actions from 1.8% → 0.6% by Q2",
    subtitle: "Owner you · 1 metric · no org alignment yet",
    action: "Align goal",
  },
];

const MAX_VISIBLE = 4;
const MAX_VISIBLE_KNOW = 4; // 2 rows × 2 columns

type ViewMoreProps = { expanded: boolean; onToggle: () => void };
const ViewMoreButton = ({ expanded, onToggle }: ViewMoreProps) => (
  <div className="flex justify-center mt-4">
    <Button variant="ghost" size="sm" onClick={onToggle}>
      {expanded ? "View less" : "View more"}
    </Button>
  </div>
);

const Combined = () => {
  const [actExpanded, setActExpanded] = useState(false);
  const [knowExpanded, setKnowExpanded] = useState(false);
  const [headedExpanded, setHeadedExpanded] = useState(false);
  const [snoozed, setSnoozed] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToId = (
    id: string,
    opts?: { expand?: "act" | "know" | "headed" }
  ) => {
    if (opts?.expand === "act") setActExpanded(true);
    if (opts?.expand === "know") setKnowExpanded(true);
    if (opts?.expand === "headed") setHeadedExpanded(true);
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
  const visibleKnow = knowExpanded ? needToKnow : needToKnow.slice(0, MAX_VISIBLE_KNOW);
  const visibleHeaded = headedExpanded ? whereHeaded : whereHeaded.slice(0, MAX_VISIBLE);

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
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(150_70%_40%)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(150_70%_40%)]"></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">Compiled at 10:00am</span>
                <Button
                  variant="tertiary"
                  size="icon"
                  onClick={() => setSnoozed(!snoozed)}
                  aria-label={snoozed ? "Show daily briefing" : "Hide daily briefing"}
                  aria-pressed={snoozed}
                >
                  {snoozed ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${snoozed ? "max-h-0 opacity-0" : "max-h-[1200px] opacity-100"}`}
              aria-hidden={snoozed}
            >
              <div className="py-2">
                <p className="text-foreground font-normal text-lg mb-5">
                  I reviewed your week and organization overnight and found <span className="text-foreground font-semibold">{needToAct.length}</span> workforce actions that need your attention today.
                </p>
                <p className="text-foreground font-normal text-lg">
                  Your <button type="button" onClick={() => scrollToId("act-card-0", { expand: "act" })} className="text-primary hover:underline">1-1 agenda with Mateo</button>, <button type="button" onClick={() => scrollToId("act-card-2", { expand: "act" })} className="text-primary hover:underline">Arjun Mehta's sign-off</button>, and <button type="button" onClick={() => scrollToId("act-card-3", { expand: "act" })} className="text-primary hover:underline">Q2 goals review</button> need your input today. Agents also flagged a <button type="button" onClick={() => scrollToId("know-card-12", { expand: "know" })} className="text-primary hover:underline">Mercury adoption milestone</button> and a <button type="button" onClick={() => scrollToId("know-card-2", { expand: "know" })} className="text-primary hover:underline">skills proficiency lift</button> worth a look.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <Button variant="default" size="sm" className="hover:bg-[color-mix(in_srgb,hsl(var(--primary))_88%,black)]" onClick={() => scrollToId("act-card-0", { expand: "act" })}>Start with top priority</Button>
                  <Button variant="tertiary" size="sm" onClick={() => scrollToId("section-know")}>What agents found overnight</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 pb-8">
          <div className="max-w-[1040px] mx-auto w-full">

          <section id="section-act" className="mt-6 pb-4 scroll-mt-8" aria-labelledby="need-to-act-heading">
            <div className="flex items-center mb-2">
              <h2 id="need-to-act-heading" className="text-base font-semibold text-foreground flex items-center gap-2">Need to act<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{needToAct.length}</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleAct.map((item, idx) => (
                <div key={item.title} id={`act-card-${idx}`} className={`rounded-[24px] border border-border bg-background p-4 ds-card-hover transition-shadow scroll-mt-24 ${highlightClass(`act-card-${idx}`)}`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <Badge
                      variant="outline-destructive"
                      className="text-xs font-medium"
                    >
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
              <h2 id="need-to-know-heading" className="text-base font-semibold text-foreground flex items-center gap-2">Need to know<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{needToKnow.length}</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleKnow.map((item, idx) => (
                <div key={item.title} id={`know-card-${idx}`} className={`bg-background border border-border rounded-[24px] p-4 ds-card-hover transition-shadow scroll-mt-24 ${highlightClass(`know-card-${idx}`)}`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <Badge variant="outline" className="text-xs font-medium">
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


          {/* Where you're headed (full width) */}
          <section id="section-headed" className="mt-6 mb-12 scroll-mt-8" aria-labelledby="where-headed-heading">
            <div className="flex items-center mb-2">
              <h2 id="where-headed-heading" className="text-base font-semibold text-foreground flex items-center gap-2">Where you're headed<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">{whereHeaded.length}</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {visibleHeaded.map((item) => (
                <div key={item.title} className="bg-background border border-border rounded-[24px] p-4 ds-card-hover">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <Badge variant="outline" className="text-xs font-medium">
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
            {whereHeaded.length > MAX_VISIBLE && (
              <ViewMoreButton expanded={headedExpanded} onToggle={() => setHeadedExpanded((v) => !v)} />
            )}
          </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Combined;
