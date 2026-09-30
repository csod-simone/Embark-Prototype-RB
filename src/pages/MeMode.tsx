import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Target, User, GraduationCap, Briefcase, Bot, type LucideIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { StarIcon } from "@/components/StarIcon";

type SectionTone = "destructive" | "caution" | "primary";

const toneBar: Record<SectionTone, { className: string; style?: React.CSSProperties }> = {
  destructive: { className: "bg-destructive" },
  caution: { className: "bg-warning" },
  primary: { className: "bg-primary" },
};

type Item = {
  id?: string;
  primaryBadge?: { label: string; variant: "outline-destructive" | "outline-warning" | "outline" };
  secondaryBadge?: string;
  meta?: string;
  title: string;
  description: string;
  footer?: string;
  cta: string;
  icon?: LucideIcon;
};

const actNow: Item[] = [
  {
    id: "act-1on1-agenda",
    secondaryBadge: "Critical initiatives\n3",
    
    title: "3 open agenda items for your next 1-1",
    description: "With Mateo Lee — review and add notes before tomorrow's session.",
    cta: "Review agenda",
  },
];

const thingsToKnow: Item[] = [
  {
    primaryBadge: { label: "Update", variant: "outline-warning" },
    secondaryBadge: "View learning track",
    meta: "Day 14/60 · Q2 2025",
    title: "Data Analyst New-Hire — Q2 2025",
    description: "Learning track · 8 learners",
    footer: "Owner David Lin · 8 learners · cohort on pace",
    cta: "View track",
    icon: Rocket,
  },
  {
    primaryBadge: { label: "Update", variant: "outline-warning" },
    secondaryBadge: "Start building skills",
    meta: "Owner Sophia Kim",
    title: "Sophia Kim · Develop team leadership and coaching skills",
    description: "Development objective · Develop team leadership and coaching skills",
    footer: "Sponsor David Lin · 4 milestones · 2 complete",
    cta: "Open objective",
    icon: Target,
  },
  {
    id: "know-skill-lift",
    primaryBadge: { label: "Insight", variant: "outline-warning" },
    secondaryBadge: "View your skills",
    meta: "Last 14 days · system-inferred",
    title: "AI / ML Model Operations proficiency lifted 3 → 4",
    description: "System-inferred from role tasks · last 14d",
    footer: "System-inferred · 14d window · confidence high",
    cta: "View skill",
    icon: User,
  },
  {
    id: "know-mentor-pairing",
    primaryBadge: { label: "Action needed", variant: "outline-warning" },
    secondaryBadge: "Awaiting approval",
    meta: "Pending approval",
    title: "1 mentor pairing pending approval",
    description: "Requested for AI / ML Model Operations",
    footer: "Requested 2d ago · 1 pairing · 92% match",
    cta: "Review pairing",
    icon: GraduationCap,
  },
  {
    primaryBadge: { label: "In review", variant: "outline-warning" },
    secondaryBadge: "Awaiting review",
    meta: "Sent 28d ago",
    title: "Career interest sent · Director, Data Operations +1 more",
    description: "Awaiting Mateo Lee review · sent 28d ago",
    footer: "Reviewer Mateo Lee · 2 roles · awaiting response",
    cta: "View interest",
    icon: Briefcase,
  },
];

const whereHeaded: Item[] = [
  {
    id: "headed-aspiration",
    primaryBadge: { label: "Aspiration", variant: "outline" },
    secondaryBadge: "Start building skills",
    meta: "NY-anchored · 3 skills to build",
    title: "Aspiration · Data Operations Manager",
    description: "3 skills to build · NY-anchored",
    footer: "Track Data Operations · 3 skills · NY-anchored",
    cta: "Explore path",
    icon: Target,
  },
  {
    primaryBadge: { label: "Goal", variant: "outline" },
    secondaryBadge: "Awaiting alignment",
    meta: "Q2 target",
    title: "Reduce personal error rate on corporate actions from 1.8% → 0.6% by Q2",
    description: "No org alignment yet",
    footer: "Owner you · 1 metric · no org alignment yet",
    cta: "Align goal",
    icon: Bot,
  },
];

type SectionProps = {
  tone: SectionTone;
  title: string;
  count: string;
  items: Item[];
  variant?: "rich" | "compact";
  id?: string;
  highlightId?: string | null;
};



function Section({ tone, title, count, items, variant = "rich", id, highlightId }: SectionProps) {
  const isCompact = variant === "compact";
  const DEFAULT_VISIBLE = 4;
  const [expanded, setExpanded] = useState(false);
  const canCollapse = isCompact && items.length > DEFAULT_VISIBLE;
  const visible = canCollapse && !expanded ? items.slice(0, DEFAULT_VISIBLE) : items;
  const ringClass = (itemId?: string) =>
    itemId && highlightId === itemId ? "ring-2 ring-destructive ring-offset-2" : "";

  return (
    <section id={id} aria-labelledby={`${title}-heading`} className="scroll-mt-8">
      <div className="flex items-center mb-2">
        <h2 id={`${title}-heading`} className="text-base font-semibold text-foreground flex items-center gap-2">
          <StarIcon size={16} />
          {title}
          <span
            className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded"
            aria-label={`${items.length} items`}
          >
            {items.length}
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {visible.map((item) =>
          isCompact ? (
          <div
            key={item.title}
            id={item.id}
            className={`bg-background border border-border rounded-[24px] p-4 ds-card-hover scroll-mt-24 transition-shadow ${ringClass(item.id)}`}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex-1 min-w-0">
                {item.secondaryBadge && (
                  item.secondaryBadge === "Start building skills" || item.secondaryBadge === "Awaiting alignment" ? (
                    <Badge variant="outline" className="text-xs font-medium mb-1">
                      {item.secondaryBadge}
                    </Badge>
                  ) : tone === "caution" ? (
                    <Badge variant="outline" className="text-xs font-medium mb-1">
                      {item.secondaryBadge}
                    </Badge>
                  ) : (
                    <p className="text-primary mb-1 text-sm font-medium flex items-center gap-1.5 whitespace-pre-line">
                      {item.secondaryBadge}
                    </p>
                  )
                )}
                <p className="font-semibold text-foreground truncate text-base">{item.title}</p>
              </div>
              <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label={item.cta}>
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
          </div>
          ) : (
            <article
              key={item.title}
              id={item.id}
              className={`relative rounded-[24px] border border-border bg-background p-4 overflow-hidden ds-card-hover scroll-mt-24 transition-shadow ${ringClass(item.id)}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {tone === "destructive" && (
                      <Badge variant="outline-destructive" className="text-xs font-medium">
                        Review agenda items
                      </Badge>
                    )}
                    {tone !== "destructive" && item.primaryBadge && (
                      <Badge variant={item.primaryBadge.variant}>{item.primaryBadge.label}</Badge>
                    )}
                    {item.secondaryBadge && tone !== "destructive" && (
                      <Badge variant="outline">{item.secondaryBadge}</Badge>
                    )}
                    {item.meta && (
                      <span className="text-sm text-muted-foreground">· {item.meta}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground truncate text-base">{item.title}</h3>
                </div>
                <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label={item.cta}>
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>
              <p className="text-muted-foreground mb-3 truncate text-sm">{item.description}</p>
              {item.footer && (
                <p className="text-muted-foreground text-sm">{item.footer}</p>
              )}
            </article>
          ),
        )}
      </div>
      {canCollapse && (
        <div className="mt-3 flex justify-center">
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "View less" : "View more"}
          </Button>
        </div>
      )}
    </section>
  );
}

const MeMode = () => {
  const [snoozed, setSnoozed] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToId = (id: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const highlightCard = (cardId: string, sectionId: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(cardId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setHighlightId(cardId);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightId(null), 2000);
    });
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <main
        className="flex-1 overflow-y-auto"
        aria-label="Home dashboard"
        style={{
          backgroundImage: "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "100% auto",
        }}
      >
        <div
          className={`${snoozed ? "bg-background" : "bg-[#FAF6F4] dark:bg-muted"} transition-colors duration-500 px-12 pt-8 pb-6`}
        >
          <div className="max-w-[1040px] mx-auto w-full">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h1 className="text-foreground tracking-tight font-semibold text-3xl">
                Let's prep for your <span className="text-primary">1 on 1</span>.
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
                  I reviewed your week overnight and found <span className="text-foreground font-semibold">1</span> item that needs your attention before tomorrow's 1 on 1.
                </p>
                <p className="text-foreground font-normal text-lg">
                  Your <button type="button" onClick={() => highlightCard("act-1on1-agenda", "section-act")} className="text-primary hover:underline">1-1 agenda with Mateo</button> needs review today. There are also <button type="button" onClick={() => scrollToId("section-know")} className="text-primary hover:underline">5 updates</button> worth knowing — including a <button type="button" onClick={() => highlightCard("know-mentor-pairing", "section-know")} className="text-primary hover:underline">mentor pairing pending approval</button> and a <button type="button" onClick={() => highlightCard("know-skill-lift", "section-know")} className="text-primary hover:underline">skills proficiency lift</button> — plus progress on <button type="button" onClick={() => highlightCard("headed-aspiration", "section-headed")} className="text-primary hover:underline">where you're headed</button>.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <Button variant="default" size="sm" className="hover:bg-[color-mix(in_srgb,hsl(var(--primary))_88%,black)]" onClick={() => highlightCard("act-1on1-agenda", "section-act")}>Start with top priority</Button>
                  <Button variant="tertiary" size="sm" onClick={() => highlightCard("headed-aspiration", "section-headed")}>Check your progress</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 pb-8">
          <div className="max-w-[1040px] mx-auto w-full pt-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="pt-4">
              <Section
                id="section-act"
                tone="destructive"
                title="Act now"
                count="1 waiting on you"
                items={actNow}
                highlightId={highlightId}
              />
            </div>
            <Section
              id="section-know"
              tone="caution"
              title="Things to know"
              count="5 updates"
              items={thingsToKnow}
              variant="compact"
              highlightId={highlightId}
            />
            <Section
              id="section-headed"
              tone="primary"
              title="Where you're headed"
              count="2 items"
              items={whereHeaded}
              variant="compact"
              highlightId={highlightId}
            />
          </motion.div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default MeMode;
