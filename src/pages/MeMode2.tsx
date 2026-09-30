import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Target, User, GraduationCap, Briefcase, Bot, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { StarIcon } from "@/components/StarIcon";
import bg2 from "@/assets/bg2.png";
import { cn } from "@/lib/utils";

// Match sidebar status colors: pending → green, risk → red, review → blue
const toneBadgeClass = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes("risk")) return "border-[#c44a2c] text-[#c44a2c] bg-transparent";
  if (l.includes("review")) return "border-[#3b82f6] text-[#3b82f6] bg-transparent";
  if (l.includes("pending")) return "border-[#16a34a] text-[#16a34a] bg-transparent";
  return "";
};

type SectionTone = "destructive" | "caution" | "primary";

const toneBar: Record<SectionTone, { className: string; style?: React.CSSProperties }> = {
  destructive: { className: "bg-destructive" },
  caution: { className: "", style: { backgroundColor: "#FBBD23" } },
  primary: { className: "bg-primary" },
};

type Item = {
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
    secondaryBadge: "Critical initiatives\n3",
    
    title: "3 open agenda items for your next 1-1",
    description: "With Mateo Lee — review and add notes before tomorrow's session.",
    cta: "Review agenda",
  },
];

const thingsToKnow: Item[] = [
  {
    primaryBadge: { label: "Update", variant: "outline-warning" },
    secondaryBadge: "Learning track",
    meta: "Day 14/60 · Q2 2025",
    title: "Data Analyst New-Hire — Q2 2025",
    description: "Learning track · 8 learners",
    footer: "Owner David Lin · 8 learners · cohort on pace",
    cta: "View track",
    icon: Rocket,
  },
  {
    primaryBadge: { label: "Update", variant: "outline-warning" },
    secondaryBadge: "Development objective",
    meta: "Owner Sophia Kim",
    title: "Sophia Kim · Develop team leadership and coaching skills",
    description: "Development objective · Develop team leadership and coaching skills",
    footer: "Sponsor David Lin · 4 milestones · 2 complete",
    cta: "Open objective",
    icon: Target,
  },
  {
    primaryBadge: { label: "Insight", variant: "outline-warning" },
    secondaryBadge: "Skills graph",
    meta: "Last 14 days · system-inferred",
    title: "AI / ML Model Operations proficiency lifted 3 → 4",
    description: "System-inferred from role tasks · last 14d",
    footer: "System-inferred · 14d window · confidence high",
    cta: "View skill",
    icon: User,
  },
  {
    primaryBadge: { label: "Action needed", variant: "outline-warning" },
    secondaryBadge: "Mentor pairing",
    meta: "Pending approval",
    title: "1 mentor pairing pending approval",
    description: "Requested for AI / ML Model Operations",
    footer: "Requested 2d ago · 1 pairing · 92% match",
    cta: "Review pairing",
    icon: GraduationCap,
  },
  {
    primaryBadge: { label: "In review", variant: "outline-warning" },
    secondaryBadge: "Career interest",
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
    primaryBadge: { label: "Aspiration", variant: "outline" },
    secondaryBadge: "Career path",
    meta: "NY-anchored · 3 skills to build",
    title: "Aspiration · Data Operations Manager",
    description: "3 skills to build · NY-anchored",
    footer: "Track Data Operations · 3 skills · NY-anchored",
    cta: "Explore path",
    icon: Target,
  },
  {
    primaryBadge: { label: "Goal", variant: "outline" },
    secondaryBadge: "No org alignment",
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
};



function Section({ tone, title, count, items, variant = "rich" }: SectionProps) {
  const isCompact = variant === "compact";
  const DEFAULT_VISIBLE = 4;
  const [expanded, setExpanded] = useState(false);
  const canCollapse = isCompact && items.length > DEFAULT_VISIBLE;
  const visible = canCollapse && !expanded ? items.slice(0, DEFAULT_VISIBLE) : items;

  return (
    <section aria-labelledby={`${title}-heading`}>
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
              className="flex items-center gap-3 bg-background border border-border rounded-[24px] p-4 ds-card-hover"
            >
              <div className="flex-1 min-w-0">
                {item.secondaryBadge && (
                  tone === "caution" || item.secondaryBadge === "Career path" || item.secondaryBadge === "No org alignment" ? (
                    <Badge
                      className="text-xs font-medium border-0 mb-1"
                      style={{ backgroundColor: "#e0c9f6", color: "#000000" }}
                    >
                      {item.secondaryBadge}
                    </Badge>
                  ) : (
                    <p className="text-[#7A4FA3] mb-1 text-sm font-medium flex items-center gap-1.5 whitespace-pre-line">
                      {item.secondaryBadge}
                    </p>
                  )
                )}
                <p className="font-semibold text-foreground truncate text-base">{item.title}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
                <button className="shrink-0 text-[#FA4617] inline-flex items-center justify-center" aria-label={item.cta}>
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
            </div>
          ) : (
            <article
              key={item.title}
              className="relative rounded-[24px] border border-border bg-background p-4 overflow-hidden ds-card-hover"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {tone === "destructive" && (
                      <Badge
                        className="text-xs font-medium border-0"
                        style={{ backgroundColor: "#fca38a", color: "#000000" }}
                      >
                        Waiting on you
                      </Badge>
                    )}
                    {tone !== "destructive" && item.primaryBadge && (
                      <Badge
                        variant={item.primaryBadge.variant}
                        className={cn(toneBadgeClass(item.primaryBadge.label))}
                      >
                        {item.primaryBadge.label}
                      </Badge>
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
                <button className="shrink-0 text-[#FA4617] inline-flex items-center justify-center" aria-label={item.cta}>
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

const MeMode2 = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <main
        className="flex-1 overflow-y-auto px-12"
        aria-label="Home dashboard"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "100% auto",
        }}
      >
        <div className="max-w-[1040px] mx-auto w-full py-8">
          <h1 className="text-foreground tracking-tight mb-4 font-semibold text-3xl">
            Let's prep for your <span className="text-[#FA4617]">1 on 1</span>.
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="pt-4">
              <Section
                tone="destructive"
                title="Act now"
                count="1 waiting on you"
                items={actNow}
              />
            </div>
            <Section
              tone="caution"
              title="Things to know"
              count="5 updates"
              items={thingsToKnow}
              variant="compact"
            />
            <Section
              tone="primary"
              title="Where you're headed"
              count="2 items"
              items={whereHeaded}
              variant="compact"
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MeMode2;
