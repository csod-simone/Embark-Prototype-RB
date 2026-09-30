import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Globe,
  EyeOff,
  BarChart3,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function SmartTeamBuilderExplainer({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-10 max-w-4xl pb-8">
      {/* Hero */}
      <motion.div {...fadeUp} transition={{ duration: 0.3 }} className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles size={18} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">AI-powered</span>
        </div>
        <h2
          className="text-3xl font-semibold text-foreground tracking-tight"
         
        >
          Dynamic team builder
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          Assemble high-performing teams in minutes, not weeks. Our AI matches the right people
          to the right initiatives based on skills, availability, and proficiency — while actively
          reducing unconscious bias in the selection process.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles size={14} /> Start building a team
        </button>
      </motion.div>

      {/* ─── Without vs With comparison ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.05 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-primary" /> Why dynamic team builder?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Without */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive/60" />
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-destructive" />
              <h4 className="text-sm font-semibold text-foreground">Without dynamic team builder</h4>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Manual spreadsheet-based team planning",
                "Limited visibility into employee skills",
                "Unconscious bias in candidate selection",
                "Weeks to assemble cross-functional teams",
                "Same people tapped repeatedly (overload)",
                "No data on skill gaps or team balance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <XCircle size={13} className="text-destructive shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="bg-card rounded-2xl border border-primary/20 p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">With dynamic team builder</h4>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "AI-driven team assembly in minutes",
                "Granular skills + proficiency data for every employee",
                "Blind matching mode removes identity bias",
                "Optimal skill coverage across the team",
                "Talent pool-aware — prioritises available resources",
                "Diversity guardrails with real-time balance metrics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-success-foreground shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ─── 4-Step AI Process Flow ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.1 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={14} className="text-primary" /> How it works
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              step: 1,
              icon: Target,
               title: "Define initiative",
              desc: "Set the dynamic team title, goals, and required skills for your initiative.",
            },
            {
              step: 2,
              icon: Sparkles,
              title: "AI matching",
              desc: "Our algorithm scores every employee on skill coverage, proficiency, and availability.",
            },
            {
              step: 3,
              icon: ShieldCheck,
              title: "Ranked candidates",
              desc: "View candidates ranked by fit score with bias flags and diversity guardrails.",
            },
            {
              step: 4,
              icon: Users,
              title: "Leader review",
              desc: "Approve, adjust, or use blind mode for a fully objective final selection.",
            },
          ].map((s, i) => (
            <div key={s.step} className="relative">
              <div className="bg-card rounded-2xl border border-border p-5 h-full space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {s.step}
                  </div>
                  <s.icon size={15} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="absolute top-1/2 -right-2.5 z-10 -translate-y-1/2">
                  <ArrowRight size={14} className="text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Example ranked candidates ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.15 }}>
        <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
          <Users size={14} className="text-primary" /> Example: ranked candidates
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          For a "Cloud migration" initiative requiring Cloud Architecture, DevOps, and SQL
        </p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rank</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Candidate</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Fit score</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Skill matches</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Flags</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "David Kim", score: 92, matches: 3, total: 3, flags: [] },
                { rank: 2, name: "James Wright", score: 84, matches: 2, total: 3, flags: [] },
                { rank: 3, name: "Elena Rodriguez", score: 68, matches: 2, total: 3, flags: ["Talent pool"] },
                { rank: 4, name: "Sarah Chen", score: 55, matches: 1, total: 3, flags: ["Overloaded"] },
                { rank: 5, name: "Priya Sharma", score: 42, matches: 1, total: 3, flags: ["Low availability"] },
              ].map((c) => (
                <tr key={c.rank} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {c.rank}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            c.score >= 80 ? "bg-success" : c.score >= 60 ? "bg-primary" : "bg-warning"
                          }`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground">{c.score}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {c.matches}/{c.total} skills
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      {c.flags.length === 0 && (
                        <span className="text-sm font-medium text-success-foreground bg-success-dark/10 px-2 py-0.5 rounded-full">
                          No flags
                        </span>
                      )}
                      {c.flags.map((f) => (
                        <span
                          key={f}
                          className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            f === "Talent pool"
                              ? "bg-success-dark/10 text-success-foreground"
                              : f === "Overloaded"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/30 text-warning-dark"
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ─── Impact section ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.2 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={14} className="text-primary" /> Impact
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: Clock,
              metric: "85%",
              label: "Faster team assembly",
              desc: "Reduce time-to-team from weeks to minutes with AI-powered matching and talent pool-first prioritisation.",
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: Globe,
              metric: "3×",
              label: "Wider talent reach",
              desc: "Surface hidden talent across all departments instead of defaulting to the same known contributors.",
              color: "text-success-foreground",
              bg: "bg-success-dark/10",
            },
            {
              icon: EyeOff,
              metric: "100%",
              label: "Bias-free selection",
              desc: "Blind matching mode and diversity guardrails ensure every team is built on merit, not familiarity.",
              color: "text-primary",
              bg: "bg-primary/10",
            },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon size={18} className={item.color} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${item.color}`}>{item.metric}</p>
              <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Key capabilities summary ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.25 }}>
        <div className="bg-primary/5 rounded-2xl border border-primary/15 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Award size={14} className="text-primary" /> Key capabilities
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              "Auto-suggest optimal team composition",
              "Quick-fill from available talent pool",
              "Blind matching mode for unbiased selection",
              "Real-time diversity guardrails",
              "Skill-gap analysis per candidate",
              "Composite fit scoring (skill + proficiency + availability)",
              "Department & seniority balance indicators",
              "Full candidate career path & team history",
            ].map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 size={13} className="text-success-foreground shrink-0" />
                {cap}
              </div>
            ))}
          </div>
          <button
            onClick={onGetStarted}
            className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} /> Get started
          </button>
        </div>
      </motion.div>
    </div>
  );
}
