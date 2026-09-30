import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Target,
  Users,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Rocket,
  Calendar,
  MessageSquare,
  CalendarDays,
  Info,
  Sparkles,
} from "lucide-react";
import type { TeamMember } from "./InitiativesTab";
import { DeploySuccessDialog } from "./DeploySuccessDialog";

/* ─── Extended member data for the detail table ─── */
interface DetailedMember extends TeamMember {
  matchScore: number;
  skillGap: number;
  explainability: string;
  location: string;
  manager: string;
  reportsTo: string;
  skills: string[];
  missingSkills: string[];
  tenure: string;
  previousTeams: number;
}

interface CreatedTeam {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Date;
}

interface TeamReviewScreenProps {
  team: CreatedTeam;
  onBack: () => void;
  onDeployed: () => void;
}

/* Enrich basic members with detailed mock data */
function enrichMembers(members: TeamMember[]): DetailedMember[] {
  const extras: Partial<DetailedMember>[] = [
    { matchScore: 92, skillGap: 8, explainability: "Top 5% in data modeling; led 3 similar initiatives; strong cross-functional collaboration history", location: "San Francisco, CA", manager: "Lisa Park", reportsTo: "VP Engineering", skills: ["Python", "ML", "Data Modeling", "SQL"], missingSkills: ["Stakeholder Mgmt"], tenure: "3.2 yrs", previousTeams: 4 },
    { matchScore: 88, skillGap: 12, explainability: "Design sprint leader; user research certified; portfolio aligns with enterprise product UX patterns", location: "Austin, TX", manager: "Tom Rivera", reportsTo: "Dir. Design", skills: ["Figma", "UX Research", "Prototyping", "Design Systems"], missingSkills: ["Data Viz", "A/B Testing"], tenure: "2.8 yrs", previousTeams: 3 },
    { matchScore: 85, skillGap: 15, explainability: "Full-stack generalist with platform launch experience; built internal tools used by 500+ employees", location: "New York, NY", manager: "Rachel Adams", reportsTo: "Engineering Manager", skills: ["React", "Node.js", "TypeScript", "AWS"], missingSkills: ["Go", "System Design"], tenure: "4.1 yrs", previousTeams: 5 },
    { matchScore: 78, skillGap: 22, explainability: "Strong PM with cross-functional track record; managed $2M+ budgets; lower availability is a risk factor", location: "Chicago, IL", manager: "Wei Zhang", reportsTo: "VP Product", skills: ["Roadmapping", "Agile", "Stakeholder Mgmt"], missingSkills: ["Technical Depth", "Data Analysis"], tenure: "5.0 yrs", previousTeams: 7 },
    { matchScore: 95, skillGap: 5, explainability: "Market analysis expert with 95% availability; previous dynamic team performance rated 4.8/5; ideal fit", location: "Denver, CO", manager: "James Foster", reportsTo: "Dir. Operations", skills: ["Market Analysis", "Excel", "Tableau", "Communication"], missingSkills: ["SQL"], tenure: "2.1 yrs", previousTeams: 2 },
  ];

  return members.map((m, i) => ({
    ...m,
    ...(extras[i % extras.length] as Partial<DetailedMember>),
  })) as DetailedMember[];
}

/* ─── Team option presets ─── */
const teamOptions = [
  { id: "balanced", label: "Balanced team", description: "Best overall fit across skills, availability, and experience" },
  { id: "speed", label: "Speed-optimized", description: "Highest availability members for fastest deployment" },
  { id: "expertise", label: "Deep expertise", description: "Strongest skill match, may have lower availability" },
];

export function TeamReviewScreen({ team, onBack, onDeployed }: TeamReviewScreenProps) {
  const [selectedOption, setSelectedOption] = useState("balanced");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(
    `Hi team,\n\nYou've been selected to join the "${team.name}" dynamic team. Looking forward to collaborating!\n\nBest regards`
  );
  const [showDeploy, setShowDeploy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const detailedMembers = enrichMembers(team.members);

  const handleDeploy = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onDeployed();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-lg font-semibold text-foreground">
            Review & deploy
          </h2>
        </div>

        {/* Split screen */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* ─── LEFT: SOW Summary + Team Options ─── */}
          <div className="w-[340px] flex-shrink-0 space-y-5 overflow-y-auto pr-2">
            {/* SOW Summary */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Initiative summary</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider mb-1">Team name</p>
                  <p className="text-sm font-medium text-foreground">{team.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider mb-1">Description / SOW</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {team.description || "Cross-functional team assembled to execute a strategic go-to-market initiative for the new enterprise product line, including market analysis, UX design, and platform development."}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider mb-1">Key objectives</p>
                  <ul className="space-y-1.5">
                    {["Define go-to-market strategy & timeline", "Build MVP feature set for launch", "Establish partnership framework", "Deliver market analysis & competitive report"].map((obj) => (
                      <li key={obj} className="flex items-start gap-2 text-sm text-foreground">
                        <Target size={12} className="text-primary mt-1 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider mb-1">Team size</p>
                  <p className="text-sm text-foreground">{detailedMembers.length} members recommended</p>
                </div>
              </div>
            </div>

            {/* Team Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Team composition</h3>
              </div>
              {teamOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedOption === opt.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <p className={`text-sm font-semibold ${selectedOption === opt.id ? "text-primary" : "text-foreground"}`}>
                    {opt.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>

            {/* Deploy section */}
            <div className="space-y-4">
              <button
                onClick={() => setShowDeploy(!showDeploy)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Rocket size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">Deployment settings</span>
                </div>
                {showDeploy ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </button>

              {showDeploy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 bg-card rounded-xl border border-border p-5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <CalendarDays size={12} className="text-primary" /> Start
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" /> End
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <MessageSquare size={12} className="text-primary" /> Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <Info size={12} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Each member's <span className="font-medium text-foreground">direct manager</span> will be automatically notified.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Deploy button */}
            <button
              onClick={handleDeploy}
              disabled={detailedMembers.length === 0}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Rocket size={16} />
              Deploy team ({detailedMembers.length} members)
            </button>
          </div>

          {/* ─── RIGHT: Detailed Member Table ─── */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Team members
                </h3>
                <span className="text-sm font-medium text-muted-foreground ml-auto">
                  {detailedMembers.length} members · Avg match {Math.round(detailedMembers.reduce((a, m) => a + m.matchScore, 0) / detailedMembers.length)}%
                </span>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-0 px-5 py-3 border-b border-border bg-muted/30 text-sm font-medium text-muted-foreground tracking-wider">
                <span>Member</span>
                <span>Match</span>
                <span>Skill gap</span>
                <span>Location</span>
                <span>Explainability</span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-border">
                {detailedMembers.map((member) => {
                  const isExpanded = expandedMember === member.name;
                  return (
                    <div key={member.name}>
                      {/* Main row */}
                      <button
                        onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                        className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-0 px-5 py-4 items-center hover:bg-muted/30 transition-colors text-left"
                      >
                        {/* Member */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{member.role} · {member.department}</p>
                          </div>
                        </div>

                        {/* Match score */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                member.matchScore >= 90 ? "bg-success" :
                                member.matchScore >= 80 ? "bg-primary" :
                                "bg-warning"
                              }`}
                              style={{ width: `${member.matchScore}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${
                            member.matchScore >= 90 ? "text-success-foreground" :
                            member.matchScore >= 80 ? "text-primary" :
                            "text-warning-foreground"
                          }`}>
                            {member.matchScore}%
                          </span>
                        </div>

                        {/* Skill gap */}
                        <div className="flex items-center gap-1.5">
                          {member.skillGap > 15 && <AlertTriangle size={12} className="text-star" />}
                          <span className={`text-sm font-medium ${
                            member.skillGap <= 10 ? "text-success-foreground" :
                            member.skillGap <= 20 ? "text-warning-foreground" :
                            "text-destructive"
                          }`}>
                            {member.skillGap}%
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground truncate">{member.location.split(",")[0]}</span>
                        </div>

                        {/* Explainability */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">{member.explainability.slice(0, 60)}…</p>
                          {isExpanded ? <ChevronUp size={14} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />}
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-muted/20 border-t border-border px-5 py-5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
                            {/* Why this recommendation */}
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-foreground tracking-wider">Why recommended</p>
                              <p className="text-sm text-foreground leading-relaxed">{member.explainability}</p>
                            </div>

                            {/* Skills & gaps */}
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-semibold text-foreground tracking-wider mb-2">Matched skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {member.skills.map((s) => (
                                    <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground tracking-wider mb-2">Skill gaps</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {member.missingSkills.map((s) => (
                                    <span key={s} className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Manager & metadata */}
                            <div className="space-y-2.5">
                              <div>
                                <p className="text-sm font-semibold text-foreground tracking-wider">Reports to</p>
                                <p className="text-sm text-foreground">{member.manager} <span className="text-muted-foreground">({member.reportsTo})</span></p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground tracking-wider">Location</p>
                                <p className="text-sm text-foreground">{member.location}</p>
                              </div>
                              <div className="flex gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-foreground tracking-wider">Tenure</p>
                                  <p className="text-sm text-foreground">{member.tenure}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground tracking-wider">Availability</p>
                                  <p className="text-sm text-foreground">{member.availability}%</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground tracking-wider">Past teams</p>
                                  <p className="text-sm text-foreground">{member.previousTeams}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <DeploySuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        teamName={team.name}
        memberCount={detailedMembers.length}
      />
    </>
  );
}

export type { CreatedTeam };
