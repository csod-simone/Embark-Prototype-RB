import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  Clock,
  Award,
  Target,
  ClipboardCheck,
  Check,
  Plus,
} from "lucide-react";

export interface EmployeeDetail {
  name: string;
  role: string;
  department: string;
  skills: number;
  proficiency: number;
  availability: number;
}

/* ─── Rich mock data keyed by employee name ─── */
const profiles: Record<
  string,
  {
    email: string;
    location: string;
    joinDate: string;
    manager: string;
    level: string;
    bio: string;
    topSkills: { name: string; level: number; trend: "up" | "stable" | "new" }[];
    careerPath: { role: string; team: string; period: string; current?: boolean }[];
    teamHistory: {
      team: string;
      role: string;
      period: string;
      outcome: string;
    }[];
    certifications: string[];
    languages: string[];
    strengths: string[];
    riskFlags: string[];
  }
> = {
  "Sarah Chen": {
    email: "sarah.chen@company.com",
    location: "San Francisco, CA",
    joinDate: "Mar 2019",
    manager: "Lisa Thompson",
    level: "Senior",
    bio: "Data scientist with deep expertise in ML pipelines and statistical modelling. Proven track record leading analytics workstreams on cross-functional teams.",
    topSkills: [
      { name: "Machine learning", level: 95, trend: "up" },
      { name: "Python", level: 92, trend: "stable" },
      { name: "Data visualization", level: 88, trend: "stable" },
      { name: "Statistical modelling", level: 90, trend: "up" },
      { name: "SQL", level: 85, trend: "stable" },
      { name: "TensorFlow", level: 80, trend: "new" },
    ],
    careerPath: [
      { role: "Data Scientist", team: "Engineering — ML", period: "Jan 2022 – present", current: true },
      { role: "Data Analyst", team: "Engineering — Analytics", period: "Mar 2019 – Dec 2021" },
    ],
    teamHistory: [
      { team: "Digital Transformation 2025", role: "ML lead", period: "Jun 2024 – present", outcome: "In progress" },
      { team: "Customer Churn Reduction", role: "Data scientist", period: "Jan – May 2024", outcome: "Reduced churn 18%" },
      { team: "Revenue Forecasting", role: "Analyst", period: "Q3 2023", outcome: "Model accuracy +12%" },
    ],
    certifications: ["AWS ML Specialty", "Google Data Analytics"],
    languages: ["English", "Mandarin"],
    strengths: ["Strong technical leadership", "Excellent cross-team communicator", "Mentors junior staff"],
    riskFlags: [],
  },
  "Marcus Johnson": {
    email: "marcus.johnson@company.com",
    location: "New York, NY",
    joinDate: "Aug 2020",
    manager: "Rachel Green",
    level: "Mid-senior",
    bio: "Product manager with a focus on enterprise SaaS. Skilled at translating customer needs into actionable roadmaps.",
    topSkills: [
      { name: "Product strategy", level: 88, trend: "up" },
      { name: "Stakeholder management", level: 85, trend: "stable" },
      { name: "Agile / Scrum", level: 82, trend: "stable" },
      { name: "Data analysis", level: 75, trend: "up" },
      { name: "User research", level: 78, trend: "new" },
    ],
    careerPath: [
      { role: "Product Manager", team: "Product — Enterprise", period: "Mar 2022 – present", current: true },
      { role: "Associate PM", team: "Product — Growth", period: "Aug 2020 – Feb 2022" },
    ],
    teamHistory: [
      { team: "Customer Experience Overhaul", role: "Product lead", period: "Feb 2024 – present", outcome: "In progress" },
      { team: "Pricing Revamp", role: "PM", period: "Q4 2023", outcome: "Revenue +9%" },
    ],
    certifications: ["Certified Scrum Product Owner"],
    languages: ["English", "Spanish"],
    strengths: ["Customer-centric thinking", "Roadmap prioritisation"],
    riskFlags: ["Low availability (40%)"],
  },
  "Aisha Patel": {
    email: "aisha.patel@company.com",
    location: "London, UK",
    joinDate: "Jan 2021",
    manager: "David Kim",
    level: "Senior",
    bio: "UX designer passionate about accessible, research-driven design. Leads design sprints and cross-functional workshops.",
    topSkills: [
      { name: "UX research", level: 94, trend: "up" },
      { name: "Figma", level: 92, trend: "stable" },
      { name: "Design systems", level: 90, trend: "up" },
      { name: "Accessibility (a11y)", level: 88, trend: "stable" },
      { name: "Prototyping", level: 86, trend: "stable" },
      { name: "User testing", level: 84, trend: "new" },
    ],
    careerPath: [
      { role: "Senior UX Designer", team: "Design — Product", period: "Jun 2023 – present", current: true },
      { role: "UX Designer", team: "Design — Growth", period: "Jan 2021 – May 2023" },
    ],
    teamHistory: [
      { team: "AI-Powered Support", role: "Design lead", period: "Apr 2024 – present", outcome: "In progress" },
      { team: "Onboarding Redesign", role: "UX lead", period: "Q1 2024", outcome: "Activation +22%" },
    ],
    certifications: ["Nielsen Norman UX Certificate", "IAAP CPACC"],
    languages: ["English", "Hindi", "Gujarati"],
    strengths: ["Design thinking facilitator", "Inclusive design advocate"],
    riskFlags: [],
  },
  "David Kim": {
    email: "david.kim@company.com",
    location: "Seattle, WA",
    joinDate: "Jun 2018",
    manager: "Lisa Thompson",
    level: "Staff",
    bio: "Full-stack software engineer specialising in scalable distributed systems and cloud-native architecture.",
    topSkills: [
      { name: "TypeScript", level: 94, trend: "stable" },
      { name: "System design", level: 92, trend: "up" },
      { name: "React", level: 90, trend: "stable" },
      { name: "AWS", level: 88, trend: "up" },
      { name: "Go", level: 82, trend: "new" },
      { name: "PostgreSQL", level: 86, trend: "stable" },
    ],
    careerPath: [
      { role: "Staff Engineer", team: "Engineering — Platform", period: "Jan 2023 – present", current: true },
      { role: "Senior Engineer", team: "Engineering — Core", period: "Jun 2020 – Dec 2022" },
      { role: "Software Engineer", team: "Engineering — Web", period: "Jun 2018 – May 2020" },
    ],
    teamHistory: [
      { team: "Data Platform Migration", role: "Tech lead", period: "Mar 2024 – present", outcome: "In progress" },
      { team: "Infra Cost Optimisation", role: "Engineer", period: "Q2 2023", outcome: "Costs −30%" },
      { team: "API Gateway v2", role: "Engineer", period: "Q4 2022", outcome: "Latency −45%" },
    ],
    certifications: ["AWS Solutions Architect Pro", "Kubernetes CKA"],
    languages: ["English", "Korean"],
    strengths: ["Architectural thinking", "Mentorship", "Strong code review culture"],
    riskFlags: [],
  },
  "Elena Rodriguez": {
    email: "elena.rodriguez@company.com",
    location: "Austin, TX",
    joinDate: "Nov 2021",
    manager: "James Wright",
    level: "Mid",
    bio: "Business analyst with expertise in process improvement and stakeholder engagement. Strong analytical and communication skills.",
    topSkills: [
      { name: "Business analysis", level: 84, trend: "up" },
      { name: "Process mapping", level: 80, trend: "stable" },
      { name: "SQL", level: 76, trend: "up" },
      { name: "Tableau", level: 74, trend: "new" },
      { name: "Requirements gathering", level: 82, trend: "stable" },
    ],
    careerPath: [
      { role: "Business Analyst", team: "Operations — Strategy", period: "Nov 2021 – present", current: true },
    ],
    teamHistory: [
      { team: "Process Automation", role: "BA lead", period: "Q1 2024", outcome: "Cycle time −25%" },
    ],
    certifications: ["CBAP"],
    languages: ["English", "Portuguese"],
    strengths: ["Stakeholder communication", "Detail-oriented"],
    riskFlags: [],
  },
  "James Wright": {
    email: "james.wright@company.com",
    location: "Chicago, IL",
    joinDate: "Apr 2020",
    manager: "Lisa Thompson",
    level: "Senior",
    bio: "DevOps engineer focused on CI/CD, infrastructure-as-code, and platform reliability.",
    topSkills: [
      { name: "Kubernetes", level: 90, trend: "up" },
      { name: "Terraform", level: 88, trend: "stable" },
      { name: "CI/CD pipelines", level: 92, trend: "stable" },
      { name: "AWS", level: 86, trend: "up" },
      { name: "Monitoring / observability", level: 84, trend: "new" },
    ],
    careerPath: [
      { role: "Senior DevOps Engineer", team: "Engineering — Platform", period: "Jan 2023 – present", current: true },
      { role: "DevOps Engineer", team: "Engineering — Infra", period: "Apr 2020 – Dec 2022" },
    ],
    teamHistory: [
      { team: "Data Platform Migration", role: "DevOps lead", period: "Mar 2024 – present", outcome: "In progress" },
      { team: "Zero-Downtime Deploy", role: "Engineer", period: "Q3 2023", outcome: "99.99% uptime" },
    ],
    certifications: ["CKA", "AWS DevOps Professional"],
    languages: ["English"],
    strengths: ["Reliability engineering mindset", "Automation-first approach"],
    riskFlags: [],
  },
  "Priya Sharma": {
    email: "priya.sharma@company.com",
    location: "Mumbai, India",
    joinDate: "Sep 2022",
    manager: "Rachel Green",
    level: "Mid",
    bio: "Data analyst experienced in BI reporting, dashboarding, and turning data into actionable insights.",
    topSkills: [
      { name: "SQL", level: 82, trend: "stable" },
      { name: "Tableau", level: 80, trend: "up" },
      { name: "Excel / Sheets", level: 78, trend: "stable" },
      { name: "Python", level: 70, trend: "new" },
      { name: "Data storytelling", level: 76, trend: "up" },
    ],
    careerPath: [
      { role: "Data Analyst", team: "Operations — BI", period: "Sep 2022 – present", current: true },
    ],
    teamHistory: [
      { team: "Quarterly Business Review", role: "Analyst", period: "Recurring", outcome: "Ongoing" },
    ],
    certifications: ["Google Data Analytics"],
    languages: ["English", "Hindi", "Marathi"],
    strengths: ["Clear data communication", "Dashboard design"],
    riskFlags: ["Limited dynamic team experience"],
  },
  "Tom Baker": {
    email: "tom.baker@company.com",
    location: "Portland, OR",
    joinDate: "Feb 2019",
    manager: "David Kim",
    level: "Senior",
    bio: "Frontend developer with deep React expertise and a passion for performance, design systems, and developer experience.",
    topSkills: [
      { name: "React", level: 95, trend: "stable" },
      { name: "TypeScript", level: 92, trend: "up" },
      { name: "CSS / Tailwind", level: 90, trend: "stable" },
      { name: "Performance optimisation", level: 86, trend: "up" },
      { name: "Design systems", level: 84, trend: "stable" },
      { name: "Next.js", level: 80, trend: "new" },
    ],
    careerPath: [
      { role: "Senior Frontend Developer", team: "Engineering — Web", period: "Jul 2022 – present", current: true },
      { role: "Frontend Developer", team: "Engineering — Product", period: "Feb 2019 – Jun 2022" },
    ],
    teamHistory: [
      { team: "Design System v2", role: "Frontend lead", period: "Q2 2024", outcome: "Component library shipped" },
      { team: "Performance Sprint", role: "Engineer", period: "Q4 2023", outcome: "LCP −40%" },
      { team: "Checkout Redesign", role: "Engineer", period: "Q2 2023", outcome: "Conversion +15%" },
    ],
    certifications: ["Meta Frontend Developer"],
    languages: ["English"],
    strengths: ["Performance-minded", "Design-engineering bridge", "Strong DX advocate"],
    riskFlags: [],
  },
};

export function getProfile(employee: EmployeeDetail) {
  return (
    profiles[employee.name] ?? {
      email: "—",
      location: "—",
      joinDate: "—",
      manager: "—",
      level: "—",
      bio: "No additional details available.",
      topSkills: [],
      careerPath: [],
      teamHistory: [],
      certifications: [],
      languages: [],
      strengths: [],
      riskFlags: [],
    }
  );
}

const trendIcon: Record<string, string> = {
  up: "↑",
  stable: "—",
  new: "✦",
};

const trendColor: Record<string, string> = {
  up: "text-success-foreground",
  stable: "text-muted-foreground",
  new: "text-primary",
};

interface Props {
  employee: EmployeeDetail;
  onClose: () => void;
}

export function EmployeeProfile({ employee, onClose }: Props) {
  const p = getProfile(employee);
  const [assessing, setAssessing] = useState(false);
  const [assessRatings, setAssessRatings] = useState<Record<string, number>>({});
  const [assessNotes, setAssessNotes] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [assessSaved, setAssessSaved] = useState(false);

  const startAssess = () => {
    const initial: Record<string, number> = {};
    p.topSkills.forEach((s) => { initial[s.name] = s.level; });
    setAssessRatings(initial);
    setAssessNotes("");
    setNewSkillName("");
    setAssessSaved(false);
    setAssessing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-foreground/30"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-2xl bg-background border-l border-border shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-8 py-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {employee.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{employee.name}</h2>
              <p className="text-sm text-muted-foreground">{employee.role} · {p.level}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {p.joinDate}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close profile" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{employee.skills}</p>
              <p className="text-sm text-muted-foreground mt-1">Skills mapped</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{employee.proficiency}%</p>
              <p className="text-sm text-muted-foreground mt-1">Avg proficiency</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className={`text-2xl font-bold ${employee.availability >= 70 ? "text-success-foreground" : "text-foreground"}`}>
                {employee.availability}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Availability</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-sm text-foreground leading-relaxed">{p.bio}</p>
          </div>

          {/* Contact & info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={14} /> <span>{p.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase size={14} /> <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={14} /> <span>Reports to {p.manager}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award size={14} /> <span>{p.certifications.length} certification{p.certifications.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Leader strengths & risk */}
          {(p.strengths.length > 0 || p.riskFlags.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target size={14} className="text-primary" /> Leader insights
              </h3>
              {p.strengths.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.strengths.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-success-dark/10 text-success-foreground border border-success-dark/30">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {p.riskFlags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.riskFlags.map((r) => (
                    <span key={r} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                      ⚠ {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Star size={14} className="text-primary" /> Top skills
              </h3>
              {!assessing && (
                <button
                  onClick={startAssess}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ClipboardCheck size={13} /> Assess skills
                </button>
              )}
            </div>

            {assessing ? (
              <div className="space-y-4 bg-muted/30 rounded-xl p-4 border border-border">
                {assessSaved ? (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-success-dark/10 flex items-center justify-center mx-auto">
                      <Check size={20} className="text-success-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Assessment saved!</p>
                  </div>
                ) : (
                  <>
                    {Object.entries(assessRatings).map(([skillName, rating]) => (
                      <div key={skillName} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{skillName}</span>
                          <span className="text-sm font-semibold text-primary">{rating}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={rating}
                          onChange={(e) =>
                            setAssessRatings((prev) => ({ ...prev, [skillName]: Number(e.target.value) }))
                          }
                          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
                        />
                      </div>
                    ))}

                    {/* Add skill */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const trimmed = newSkillName.trim();
                            if (trimmed && !assessRatings[trimmed]) {
                              setAssessRatings((prev) => ({ ...prev, [trimmed]: 50 }));
                              setNewSkillName("");
                            }
                          }
                        }}
                        placeholder="Add a skill…"
                        maxLength={60}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        onClick={() => {
                          const trimmed = newSkillName.trim();
                          if (trimmed && !assessRatings[trimmed]) {
                            setAssessRatings((prev) => ({ ...prev, [trimmed]: 50 }));
                            setNewSkillName("");
                          }
                        }}
                        disabled={!newSkillName.trim() || !!assessRatings[newSkillName.trim()]}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Notes */}
                    <textarea
                      value={assessNotes}
                      onChange={(e) => setAssessNotes(e.target.value)}
                      placeholder="Leader notes…"
                      maxLength={1000}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setAssessing(false)}
                        className="flex-1 px-3 py-2 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setAssessSaved(true);
                          setTimeout(() => setAssessing(false), 2000);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Check size={12} /> Save
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {p.topSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-44 shrink-0">{skill.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">{skill.level}%</span>
                    <span className={`text-sm font-medium w-4 ${trendColor[skill.trend]}`}>
                      {trendIcon[skill.trend]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications & languages */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Certifications</h3>
              <div className="space-y-1.5">
                {p.certifications.map((c) => (
                  <p key={c} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award size={12} className="text-primary shrink-0" /> {c}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {p.languages.map((l) => (
                  <span key={l} className="px-2.5 py-1 rounded-full text-sm font-medium bg-muted text-foreground">{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Career path */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Career path
            </h3>
            <div className="relative pl-5 space-y-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {p.careerPath.map((cp, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 ${
                    cp.current ? "bg-primary border-primary" : "bg-background border-border"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{cp.role}</p>
                    <p className="text-sm text-muted-foreground">{cp.team}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {cp.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team history */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users size={14} className="text-primary" /> Dynamic team history
            </h3>
            <div className="space-y-2">
              {p.teamHistory.map((th, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{th.team}</p>
                    <p className="text-sm text-muted-foreground">{th.role} · {th.period}</p>
                  </div>
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                    th.outcome === "In progress"
                      ? "bg-primary/10 text-primary"
                      : "bg-success-dark/10 text-success-foreground"
                  }`}>
                    {th.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
