import { useState } from "react";
import { Search, Info, MoreHorizontal, AlertTriangle, ArrowUpDown, Filter, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Not accessed";

interface Skill {
  name: string;
  type: "Human" | "Technical";
  yourProficiency: ProficiencyLevel;
  yourLevel: number | null;
  targetProficiency: ProficiencyLevel;
  targetLevel: number;
  assessedBy: string[];
}

const requiredSkills: Skill[] = [
  { name: "Product Strategy", type: "Human", yourProficiency: "Beginner", yourLevel: 1, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Manager", "AI"] },
  { name: "Agile/Scrum", type: "Technical", yourProficiency: "Intermediate", yourLevel: 1, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Peer", "AI"] },
  { name: "User Research", type: "Human", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Manager", "AI"] },
  { name: "Data Analysis", type: "Technical", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Intermediate", targetLevel: 2, assessedBy: ["Self", "Peer", "AI"] },
  { name: "Leadership", type: "Human", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Manager", "Peer"] },
  { name: "Roadmap Planning", type: "Human", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Intermediate", targetLevel: 2, assessedBy: ["Self", "AI"] },
  { name: "Stakeholder Management", type: "Human", yourProficiency: "Beginner", yourLevel: 1, targetProficiency: "Intermediate", targetLevel: 2, assessedBy: ["Self", "Manager", "AI"] },
  { name: "Machine Learning", type: "Technical", yourProficiency: "Not accessed", yourLevel: null, targetProficiency: "Advanced", targetLevel: 4, assessedBy: [] },
];

const otherSkills: Skill[] = [
  { name: "Strategic Vision", type: "Human", yourProficiency: "Beginner", yourLevel: 1, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Manager", "AI"] },
  { name: "Team Leadership", type: "Technical", yourProficiency: "Intermediate", yourLevel: 1, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "AI"] },
  { name: "Market Analysis", type: "Human", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self"] },
  { name: "Financial Acumen", type: "Technical", yourProficiency: "Advanced", yourLevel: 4, targetProficiency: "Advanced", targetLevel: 4, assessedBy: ["Self", "Peer", "AI"] },
];

function getProficiencyColor(level: ProficiencyLevel): string {
  switch (level) {
    case "Beginner": return "text-caution-foreground border-caution";
    case "Intermediate": return "text-caution-foreground border-caution";
    case "Advanced": return "text-success-foreground border-success-dark";
    case "Not accessed": return "text-destructive border-destructive";
  }
}

function ProficiencyBadge({ level, value }: { level: ProficiencyLevel; value: number | null }) {
  const colors = getProficiencyColor(level);
  if (level === "Not accessed") {
    return (
      <span className={`inline-flex items-center gap-1 text-sm font-medium border rounded-full px-2.5 py-1 ${colors}`}>
        <AlertTriangle size={12} aria-hidden="true" />
        Not accessed
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium border rounded-full px-2.5 py-1 ${colors}`}>
      {level}
      {value !== null && (
        <span className={`border-l pl-1.5 ml-0.5 ${colors}`}>{value}</span>
      )}
    </span>
  );
}

function TargetBadge({ level, value }: { level: ProficiencyLevel; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium border border-border text-muted-foreground rounded-full px-2.5 py-1">
      {level}
      <span className="border-l border-border pl-1.5 ml-0.5">{value}</span>
    </span>
  );
}

export function SkillsTabContent() {
  const [activeSubTab, setActiveSubTab] = useState<"required" | "other">("required");
  const [searchQuery, setSearchQuery] = useState("");

  const currentSkills = activeSubTab === "required" ? requiredSkills : otherSkills;
  const filteredSkills = currentSkills.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const showTarget = activeSubTab === "required";

  return (
    <div className="space-y-6">
      {/* Skill Coverage */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5">
          Skill coverage
        </h3>
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm text-muted-foreground font-medium">Your total skills</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Info: Your total skills">
                    <Info size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-sm">Every skill that is currently listed in your profile.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-semibold text-foreground">14</p>
          </div>
          <div className="px-6">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm text-muted-foreground font-medium">Required skills</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Info: Required skills">
                    <Info size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-sm">Skills identified as necessary for success in your role.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-semibold text-foreground">9/10</p>
          </div>
          <div className="pl-6">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm text-muted-foreground font-medium">Skill gaps</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Info: Skill gaps">
                    <Info size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-sm">Skills needed for your role that are either missing from your profile or not yet at the required proficiency level.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-semibold text-destructive">3</p>
          </div>
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Info: Skills">
                    <Info size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-sm">See all required and declared skills.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">See all required and declared skills.</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-foreground border border-border rounded-lg px-3 py-2 hover:bg-foreground/5 transition-colors">
            <Plus size={16} aria-hidden="true" />
            Add skill
          </button>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3 mt-4 mb-4 flex-wrap">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveSubTab("required")}
              className={`p-4 py-[8px] rounded-full text-base font-medium border transition-colors ${
                activeSubTab === "required"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
                  : "bg-transparent text-sidebar-primary-foreground border-border hover:bg-muted"
              }`}
            >
              Required skills
            </button>
            <button
              onClick={() => setActiveSubTab("other")}
              className={`p-4 py-[8px] rounded-full text-base font-medium border transition-colors ${
                activeSubTab === "other"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
                  : "bg-transparent text-sidebar-primary-foreground border-border hover:bg-muted"
              }`}
            >
              Other skills
            </button>
          </div>

          <div className="relative flex-1 max-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills"
              className="w-full bg-background border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {["Skill type", "Assessed by", "Skill proficiency"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-1.5 text-sm font-medium border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-foreground/5 transition-colors"
            >
              {filter}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 w-8">
                  <input type="checkbox" className="rounded border-border" aria-label="Select all skills" />
                </th>
                <th className="text-left py-3 pr-4">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    Skill name <ArrowUpDown size={12} aria-hidden="true" />
                  </button>
                </th>
                <th className="text-left py-3 pr-4">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    Your proficiency <ArrowUpDown size={12} aria-hidden="true" />
                  </button>
                </th>
                {showTarget && (
                  <th className="text-left py-3 pr-4">
                    <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      Target proficiency <ArrowUpDown size={12} aria-hidden="true" />
                    </button>
                  </th>
                )}
                <th className="text-left py-3 pr-4">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    Assessed by <Filter size={12} aria-hidden="true" />
                  </button>
                </th>
                <th className="text-right py-3">
                  <span className="text-sm font-medium text-muted-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((skill) => (
                <tr key={skill.name} className="border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors">
                  <td className="py-3.5 pr-4">
                    <input type="checkbox" className="rounded border-border" aria-label={`Select ${skill.name}`} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="text-sm font-medium text-foreground">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.type}</p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <ProficiencyBadge level={skill.yourProficiency} value={skill.yourLevel} />
                  </td>
                  {showTarget && (
                    <td className="py-3.5 pr-4">
                      <TargetBadge level={skill.targetProficiency} value={skill.targetLevel} />
                    </td>
                  )}
                  <td className="py-3.5 pr-4">
                    <div className="flex gap-1">
                      {skill.assessedBy.map((source) => (
                        <span key={source} className="text-xs font-medium border border-border rounded-md px-2 py-0.5 text-muted-foreground">
                          {source}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="p-1 rounded hover:bg-foreground/5 text-muted-foreground" aria-label={`Actions for ${skill.name}`}>
                      <MoreHorizontal size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
