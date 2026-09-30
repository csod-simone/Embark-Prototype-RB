import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Users, MessageSquare, X, CalendarDays, Search, Plus, Info, GraduationCap } from "lucide-react";
import type { TeamMember } from "./InitiativesTab";
import { DeploySuccessDialog } from "./DeploySuccessDialog";

interface CreatedTeam {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Date;
}

interface ReviewDeployDialogProps {
  open: boolean;
  onClose: () => void;
  team: CreatedTeam;
  onDeployed: () => void;
}

const allEmployees: TeamMember[] = [
  { name: "Sarah Chen", role: "Data Scientist", department: "Engineering", matchReason: "Strong analytical skills", availability: 85 },
  { name: "Aisha Patel", role: "UX Designer", department: "Design", matchReason: "Led go-to-market design sprints", availability: 90 },
  { name: "David Kim", role: "Software Engineer", department: "Engineering", matchReason: "Full-stack expertise", availability: 75 },
  { name: "Marcus Johnson", role: "Product Manager", department: "Product", matchReason: "Cross-functional leadership", availability: 40 },
  { name: "Elena Rodriguez", role: "Business Analyst", department: "Operations", matchReason: "Market analysis specialist", availability: 95 },
  { name: "James Wright", role: "DevOps Engineer", department: "Engineering", matchReason: "Cloud infrastructure expert", availability: 80 },
  { name: "Priya Sharma", role: "Marketing Lead", department: "Marketing", matchReason: "Go-to-market strategy", availability: 65 },
  { name: "Tom Nakamura", role: "QA Engineer", department: "Engineering", matchReason: "Automation testing specialist", availability: 70 },
  { name: "Lisa Chang", role: "Finance Analyst", department: "Finance", matchReason: "Budget planning and forecasting", availability: 88 },
  { name: "Carlos Mendez", role: "Solutions Architect", department: "Engineering", matchReason: "Enterprise integration expert", availability: 55 },
];

export function ReviewDeployDialog({ open, onClose, team, onDeployed }: ReviewDeployDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(
    `Hi team,\n\nYou've been selected to join the "${team.name}" dynamic team. Looking forward to collaborating with you!\n\nBest regards`
  );
  const [members, setMembers] = useState<TeamMember[]>(team.members);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allEmployees.filter(
      (e) =>
        !members.some((m) => m.name === e.name) &&
        (e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q))
    );
  }, [searchQuery, members]);

  const removeMember = (name: string) => {
    setMembers((prev) => prev.filter((m) => m.name !== name));
  };

  const addMember = (member: TeamMember) => {
    setMembers((prev) => [...prev, member]);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleDeploy = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    onDeployed();
  };

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden rounded-2xl border-border p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-semibold">
              Review & deploy team
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Finalize your team setup before sending invitations
            </p>
          </DialogHeader>

          <div className="px-6 pt-4 pb-4 space-y-5 overflow-y-auto flex-1 min-h-0">
            {/* Team members */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users size={14} className="text-primary" />
                  Team members ({members.length})
                </label>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus size={14} />
                  Add member
                </button>
              </div>

              {/* Search to add members */}
              {showSearch && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, or department…"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 top-full mt-1 w-full bg-card rounded-xl border border-border shadow-lg max-h-[200px] overflow-y-auto">
                      {searchResults.map((person) => (
                        <button
                          key={person.name}
                          onClick={() => addMember(person)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {person.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{person.name}</p>
                            <p className="text-sm text-muted-foreground">{person.role} · {person.department}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{person.availability}% avail.</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery.trim() && searchResults.length === 0 && (
                    <div className="absolute z-10 top-full mt-1 w-full bg-card rounded-xl border border-border shadow-lg px-4 py-3">
                      <p className="text-sm text-muted-foreground">No matching employees found</p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-muted/30 rounded-xl border border-border divide-y divide-border">
                {members.map((member) => (
                  <div key={member.name} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role} · {member.department}</p>
                    </div>
                    <button
                      onClick={() => removeMember(member.name)}
                      aria-label={`Remove ${member.name}`}
                      className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarDays size={14} className="text-primary" />
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  End date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                Message to team members
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
               
              />
            </div>

            {/* Manager notification info */}
            <div className="flex items-start gap-3 bg-muted/50 rounded-xl px-4 py-3">
              <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each team member's <span className="font-medium text-foreground">direct manager</span> will automatically be notified about this assignment, including the team details, dates, and expected time commitment.
              </p>
            </div>

            {/* Targeted learning info */}
            <div className="flex items-start gap-3 bg-muted/50 rounded-xl px-4 py-3">
              <GraduationCap size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Targeted learning paths</span> will be automatically assigned to each member based on their identified skill gaps and initiative requirements, helping close gaps before kickoff.
              </p>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={members.length === 0}
              className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deploy team
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <DeploySuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        teamName={team.name}
        memberCount={members.length}
      />
    </>
  );
}

export type { CreatedTeam };
