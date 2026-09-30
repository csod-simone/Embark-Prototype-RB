import { useState, useRef, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReviewDeployDialog } from "./ReviewDeployDialog";
import type { CreatedTeam } from "./ReviewDeployDialog";
import { SmartBarInline } from "./SmartBar";
import { EditSkillsDialog, type InferredSkills } from "./EditSkillsDialog";
import {
  ArrowUp,
  ArrowLeft,
  Paperclip,
  FileText,
  X,
  Sparkles,
  Users,
  ChevronRight,
  CheckCircle,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Target,
  Pencil,
  ShieldCheck,
  BadgeCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

/* ─── Mock data ─── */
const objectives = [
  "Go to market",
  "Product launch",
  "Strategic partnership",
  "Internal transformation",
  "Research & innovation",
];

const CONFIRM_PROMPT = "Let's go with this team";

const initiativePrompts = [
  "Find the best team for this initiative",
  "Review my brief",
  "Show recommended skills",
];

const suggestedPrompts = [
  "Focus on engineering and design functions",
  "Prioritise people with partnership experience",
  "Add a senior product lead to the team",
];

const defaultInferredSkills: InferredSkills = {
  aiInferred: ["Go-to-market strategy", "Product management", "Cross-functional leadership", "Market analysis", "Stakeholder communication"],
  documentInferred: ["Enterprise sales", "API integration", "Partner onboarding", "Technical writing", "Competitive analysis"],
  additional: [],
};

interface TeamMember {
  name: string;
  role: string;
  department: string;
  matchReason: string;
  availability: number;
}

interface VerificationSource {
  type: "self" | "manager" | "peer" | "performance";
  label: string;
}

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
  verified?: boolean;
  verificationSources?: VerificationSource[];
  proficiencyScore?: number;
}

const mockTeamSuggestions: TeamMember[] = [
  { name: "Sarah Chen", role: "Data Scientist", department: "Engineering", matchReason: "Strong analytical skills, experience with market research models", availability: 85 },
  { name: "Aisha Patel", role: "UX Designer", department: "Design", matchReason: "Led 3 go-to-market design sprints, understands user acquisition flows", availability: 90 },
  { name: "David Kim", role: "Software Engineer", department: "Engineering", matchReason: "Full-stack expertise, built 2 product launch platforms", availability: 75 },
  { name: "Marcus Johnson", role: "Product Manager", department: "Product", matchReason: "Cross-functional leadership, managed 5 strategic launches", availability: 40 },
  { name: "Elena Rodriguez", role: "Business Analyst", department: "Operations", matchReason: "Market analysis specialist, strong stakeholder communication", availability: 95 },
];

const mockTeamOption2: TeamMember[] = [
  { name: "James Liu", role: "Backend Engineer", department: "Engineering", matchReason: "API architecture expert, built scalable microservices for 3 product launches", availability: 92 },
  { name: "Priya Sharma", role: "Product Designer", department: "Design", matchReason: "Enterprise UX specialist, redesigned onboarding reducing churn by 25%", availability: 88 },
  { name: "Carlos Mendez", role: "DevOps Engineer", department: "Infrastructure", matchReason: "CI/CD pipeline expert, reduced deployment time by 60%", availability: 80 },
  { name: "Nina Kowalski", role: "Data Analyst", department: "Analytics", matchReason: "Market intelligence lead, built competitive analysis framework", availability: 70 },
];

const mockTeamOption3: TeamMember[] = [
  { name: "Alex Thompson", role: "Tech Lead", department: "Engineering", matchReason: "Led platform migration for 10K+ users, strong architecture skills", availability: 65 },
  { name: "Maya Williams", role: "Growth PM", department: "Product", matchReason: "Scaled 2 products from 0→1, deep go-to-market expertise", availability: 78 },
  { name: "Raj Patel", role: "ML Engineer", department: "Engineering", matchReason: "Built recommendation engine, NLP expertise for content personalization", availability: 85 },
  { name: "Sophie Laurent", role: "Strategy Analyst", department: "Strategy", matchReason: "McKinsey background, led 5 strategic partnership assessments", availability: 90 },
  { name: "Tom Fischer", role: "UX Researcher", department: "Design", matchReason: "User testing lead, conducted 200+ enterprise interviews", availability: 95 },
];

const detailExtras2: Partial<DetailedMember>[] = [
  { matchScore: 90, skillGap: 10, explainability: "API architecture expert with microservices experience; built scalable systems handling 1M+ requests/day", location: "Seattle, WA", manager: "Karen Wu", reportsTo: "VP Engineering", skills: ["Go", "Python", "Kubernetes", "PostgreSQL"], missingSkills: ["Frontend"], tenure: "4.5 yrs", previousTeams: 6, verified: true, proficiencyScore: 4.5, verificationSources: [{ type: "manager", label: "Manager" }, { type: "performance", label: "Performance" }, { type: "peer", label: "Peer" }] },
  { matchScore: 86, skillGap: 14, explainability: "Enterprise UX specialist who reduced churn by 25%; strong design systems background", location: "Portland, OR", manager: "Mike Chen", reportsTo: "Dir. Design", skills: ["Figma", "Design Systems", "User Research", "Accessibility"], missingSkills: ["Motion Design"], tenure: "3.0 yrs", previousTeams: 4, verified: true, proficiencyScore: 4.2, verificationSources: [{ type: "manager", label: "Manager" }, { type: "self", label: "Self" }] },
  { matchScore: 82, skillGap: 18, explainability: "DevOps pipeline expert; reduced deployment cycles by 60%; strong infrastructure automation skills", location: "Boston, MA", manager: "Sarah Lin", reportsTo: "Dir. Infrastructure", skills: ["AWS", "Terraform", "Docker", "CI/CD"], missingSkills: ["Security", "Monitoring"], tenure: "2.5 yrs", previousTeams: 3, verified: false },
  { matchScore: 76, skillGap: 24, explainability: "Market intelligence lead who built competitive analysis framework; lower availability due to ongoing project", location: "Miami, FL", manager: "David Ross", reportsTo: "VP Analytics", skills: ["SQL", "Tableau", "Python", "Market Research"], missingSkills: ["ML", "Presentation"], tenure: "1.8 yrs", previousTeams: 2, verified: false },
];

const detailExtras3: Partial<DetailedMember>[] = [
  { matchScore: 94, skillGap: 6, explainability: "Led platform migration for 10K+ users; deep architecture knowledge; strong mentorship track record", location: "San Jose, CA", manager: "Amy Nguyen", reportsTo: "CTO", skills: ["System Design", "React", "Node.js", "AWS"], missingSkills: ["Mobile Dev"], tenure: "6.2 yrs", previousTeams: 8, verified: true, proficiencyScore: 4.7, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "performance", label: "Performance" }, { type: "self", label: "Self" }] },
  { matchScore: 89, skillGap: 11, explainability: "Scaled 2 products from 0→1 with deep GTM expertise; strong cross-functional communication", location: "Los Angeles, CA", manager: "Ben Carter", reportsTo: "VP Product", skills: ["GTM Strategy", "Analytics", "Roadmapping", "User Interviews"], missingSkills: ["Technical Depth"], tenure: "3.8 yrs", previousTeams: 5, verified: true, proficiencyScore: 4.4, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "self", label: "Self" }] },
  { matchScore: 91, skillGap: 9, explainability: "Built recommendation engine processing 500K daily predictions; NLP expertise for content personalization", location: "Austin, TX", manager: "Lisa Park", reportsTo: "Dir. ML", skills: ["Python", "TensorFlow", "NLP", "Data Pipeline"], missingSkills: ["Production ML Ops"], tenure: "2.9 yrs", previousTeams: 3, verified: false },
  { matchScore: 87, skillGap: 13, explainability: "McKinsey background with 5 strategic partnership assessments; excellent stakeholder management", location: "Washington, DC", manager: "Robert Hill", reportsTo: "VP Strategy", skills: ["Strategy", "Financial Modeling", "Partnerships", "Presentations"], missingSkills: ["Technical Understanding"], tenure: "1.5 yrs", previousTeams: 2, verified: true, proficiencyScore: 4.0, verificationSources: [{ type: "manager", label: "Manager" }, { type: "performance", label: "Performance" }] },
  { matchScore: 93, skillGap: 7, explainability: "Conducted 200+ enterprise user interviews; pioneered new research methodology adopted company-wide", location: "Chicago, IL", manager: "Wei Zhang", reportsTo: "Dir. Research", skills: ["User Testing", "Surveys", "Data Analysis", "Workshop Facilitation"], missingSkills: ["Quantitative Research"], tenure: "4.0 yrs", previousTeams: 4, verified: true, proficiencyScore: 4.6, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "performance", label: "Performance" }] },
];

const detailExtras: Partial<DetailedMember>[] = [
  { matchScore: 92, skillGap: 8, explainability: "Top 5% in data modeling; led 3 similar initiatives; strong cross-functional collaboration history", location: "San Francisco, CA", manager: "Lisa Park", reportsTo: "VP Engineering", skills: ["Python", "ML", "Data Modeling", "SQL"], missingSkills: ["Stakeholder Mgmt"], tenure: "3.2 yrs", previousTeams: 4, verified: true, proficiencyScore: 4.6, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "performance", label: "Performance" }, { type: "self", label: "Self" }] },
  { matchScore: 88, skillGap: 12, explainability: "Design sprint leader; user research certified; portfolio aligns with enterprise product UX patterns", location: "Austin, TX", manager: "Tom Rivera", reportsTo: "Dir. Design", skills: ["Figma", "UX Research", "Prototyping", "Design Systems"], missingSkills: ["Data Viz", "A/B Testing"], tenure: "2.8 yrs", previousTeams: 3, verified: true, proficiencyScore: 4.3, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "self", label: "Self" }] },
  { matchScore: 85, skillGap: 15, explainability: "Full-stack generalist with platform launch experience; built internal tools used by 500+ employees", location: "New York, NY", manager: "Rachel Adams", reportsTo: "Engineering Manager", skills: ["React", "Node.js", "TypeScript", "AWS"], missingSkills: ["Go", "System Design"], tenure: "4.1 yrs", previousTeams: 5, verified: false },
  { matchScore: 78, skillGap: 22, explainability: "Strong PM with cross-functional track record; managed $2M+ budgets; lower availability is a risk factor", location: "Chicago, IL", manager: "Wei Zhang", reportsTo: "VP Product", skills: ["Roadmapping", "Agile", "Stakeholder Mgmt"], missingSkills: ["Technical Depth", "Data Analysis"], tenure: "5.0 yrs", previousTeams: 7, verified: true, proficiencyScore: 4.1, verificationSources: [{ type: "manager", label: "Manager" }, { type: "performance", label: "Performance" }] },
  { matchScore: 95, skillGap: 5, explainability: "Market analysis expert with 95% availability; previous dynamic team performance rated 4.8/5; ideal fit", location: "Denver, CO", manager: "James Foster", reportsTo: "Dir. Operations", skills: ["Market Analysis", "Excel", "Tableau", "Communication"], missingSkills: ["SQL"], tenure: "2.1 yrs", previousTeams: 2, verified: true, proficiencyScore: 4.8, verificationSources: [{ type: "manager", label: "Manager" }, { type: "peer", label: "Peer" }, { type: "performance", label: "Performance" }, { type: "self", label: "Self" }] },
];

function enrichMembers(members: TeamMember[]): DetailedMember[] {
  return members.map((m, i) => ({
    ...m,
    ...(detailExtras[i % detailExtras.length] as Partial<DetailedMember>),
  })) as DetailedMember[];
}

function enrichMembersWithExtras(members: TeamMember[], extras: Partial<DetailedMember>[]): DetailedMember[] {
  return members.map((m, i) => ({
    ...m,
    ...(extras[i % extras.length] as Partial<DetailedMember>),
  })) as DetailedMember[];
}

interface TeamOption {
  id: string;
  label: string;
  description: string;
  members: TeamMember[];
  extras: Partial<DetailedMember>[];
}

const teamOptionPresets: TeamOption[] = [
  { id: "balanced", label: "Balanced team", description: "Best overall fit across skills, availability & experience", members: mockTeamSuggestions.slice(0, 4), extras: detailExtras },
  { id: "speed", label: "Speed-optimized", description: "Highest availability for fastest deployment", members: mockTeamOption2, extras: detailExtras2 },
  { id: "expertise", label: "Deep expertise", description: "Strongest skill match with domain depth", members: mockTeamOption3, extras: detailExtras3 },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  teamSuggestions?: TeamMember[];
  teamCreated?: boolean;
}

type Phase = "setup" | "conversation";

interface InitiativesTabProps {
  onBack?: () => void;
  onTeamCreated?: (team: { name: string; description: string; members: TeamMember[] }) => void;
  onReviewTeam?: (team: { name: string; description: string; members: TeamMember[] }) => void;
}

export function InitiativesTab({ onBack, onTeamCreated, onReviewTeam }: InitiativesTabProps) {
  const [selectedInitiativePrompt, setSelectedInitiativePrompt] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");

  // Setup state
  const [description, setDescription] = useState("");
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Constraints state
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [minAvailability, setMinAvailability] = useState(50);
  const [teamSize, setTeamSize] = useState<[number, number]>([3, 6]);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [deployDialogTeam, setDeployDialogTeam] = useState<CreatedTeam | null>(null);
  const [inferredSkills, setInferredSkills] = useState<InferredSkills>(defaultInferredSkills);
  const [teamReady, setTeamReady] = useState(false);
  const [showEditSkills, setShowEditSkills] = useState(false);
  const [memberDecisions, setMemberDecisions] = useState<Record<string, { status: "accepted" | "rejected"; reason?: string }>>({});
  const [showReasonFor, setShowReasonFor] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const canSubmitSetup = description.trim().length > 0;

  // Get current team suggestions from messages
  const currentTeamMembers = (() => {
    const lastTeamMsg = [...messages].reverse().find((m) => m.teamSuggestions);
    return lastTeamMsg?.teamSuggestions || null;
  })();

  const [selectedTeamOption, setSelectedTeamOption] = useState("balanced");

  const activeTeamOption = teamOptionPresets.find(o => o.id === selectedTeamOption) || teamOptionPresets[0];
  const detailedMembers = currentTeamMembers ? enrichMembersWithExtras(activeTeamOption.members, activeTeamOption.extras) : [];

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  const handleStartConversation = () => {
    if (!canSubmitSetup) return;

    setMessages([]);
    setSelectedInitiativePrompt(null);
    setTeamReady(false);
    setPhase("conversation");
  };

  // After entering conversation phase, mark team as ready after a few seconds
  useEffect(() => {
    if (phase === "conversation" && !selectedInitiativePrompt && !teamReady) {
      const timer = setTimeout(() => setTeamReady(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, selectedInitiativePrompt, teamReady]);

  const handleInitiativePromptClick = (prompt: string) => {
    if (selectedInitiativePrompt) return;
    setSelectedInitiativePrompt(prompt);

    // Add as user message (skip for the main CTA prompt)
    if (prompt !== "Find the best team for this initiative") {
      setMessages([{ role: "user", content: prompt }]);
    }
    setIsTyping(true);
    setTimeout(() => {
      const objectiveText = selectedObjective || "your initiative";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great, I've reviewed your brief${attachedFile ? " and the attached document" : ""}. You're looking at a **${objectiveText.toLowerCase()}** dynamic team. Based on the scope and skills needed, here are the members that may be a good fit:`,
          teamSuggestions: mockTeamSuggestions.slice(0, 4),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (text?: string) => {
    const message = text || inputValue.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInputValue("");
    setIsTyping(true);

    // Handle team confirmation
    if (message === CONFIRM_PROMPT) {
      setTimeout(() => {
        const lastTeamMsg = [...messages].reverse().find((m) => m.teamSuggestions);
        const teamMembers = lastTeamMsg?.teamSuggestions || mockTeamSuggestions.slice(0, 4);
        const teamName = selectedObjective
          ? `${selectedObjective} Team`
          : "Dynamic Team";

        const response: Message = {
          role: "assistant",
          content: `Your **${teamName}** has been created with **${teamMembers.length} members**. The team is ready for review — head to the dashboard to finalize and deploy.`,
          teamCreated: true,
        };

        setMessages((prev) => [...prev, response]);
        setIsTyping(false);

        onTeamCreated?.({
          name: teamName,
          description: description.trim(),
          members: teamMembers,
        });
      }, 2000);
      return;
    }

    // Mock AI response
    setTimeout(() => {
      let response: Message;

      if (message.toLowerCase().includes("function")) {
        response = {
          role: "assistant",
          content:
            "Based on your objectives, I'd recommend pulling from these functions:\n\n• **Engineering** — for technical build-out and platform readiness\n• **Product** — to drive the roadmap and prioritization\n• **Design** — for customer-facing experience work\n• **Operations** — to handle go-to-market logistics\n\nWould you like me to refine the team based on specific functions, or should I look across all departments?",
        };
      } else if (message.toLowerCase().includes("objective") || message.toLowerCase().includes("partnership")) {
        response = {
          role: "assistant",
          content:
            "Understanding the partnership objective helps me match the right talent. Here are some follow-ups:\n\n• Is this a **revenue-generating** partnership or a **strategic/ecosystem** play?\n• Will there be **shared resources** or a dedicated team from our side?\n• What's the expected **duration** — sprint-based or ongoing?\n\nThis will help me filter for people with the right collaboration style and availability window.",
        };
      } else if (message.toLowerCase().includes("timeline") || message.toLowerCase().includes("delivery")) {
        response = {
          role: "assistant",
          content:
            "Got it. For the timeline, I'll factor in:\n\n• **Current availability** of suggested members\n• **Ramp-up time** for any skill gaps\n• **Overlap with existing commitments**\n\nI'd recommend a **core team of 3-4** for the first sprint, then scaling up as needed. Want me to show you who's available to start immediately?",
          teamSuggestions: mockTeamSuggestions.filter((m) => m.availability >= 75),
        };
      } else {
        response = {
          role: "assistant",
          content:
            "Thanks for that context. Let me factor that into my recommendations. Based on what you've shared, I'd suggest we focus on cross-functional coverage and high-availability members first.\n\nWould you like me to:\n• **Deep dive** into any specific candidate's background?\n• **Adjust** the team composition based on new criteria?\n• **Finalize** the team and send invitations?",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ─── Setup Phase ─── */
  if (phase === "setup") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 max-w-[800px] mx-auto"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dynamic team
        </button>
        <div>
          <h3
            className="text-lg font-semibold text-foreground mb-1"
           
          >
            Build your dynamic team
          </h3>
          <p className="text-sm text-muted-foreground">
            Describe what you need and we'll find the right people.
          </p>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              What are you working on?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Coming out of a strategic meeting, we need a team to execute a go-to-market plan for our new enterprise product line…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
             
            />
          </div>

          {/* Objective picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Objective
            </label>
            <div className="flex flex-wrap gap-2">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() =>
                    setSelectedObjective(
                      selectedObjective === obj ? null : obj
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedObjective === obj
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* File attachment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Attach a document{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.pptx,.xlsx"
            />
            {attachedFile ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                <FileText size={18} className="text-primary" />
                <span className="text-sm text-foreground flex-1 truncate">
                  {attachedFile}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  aria-label="Remove attached file"
                  className="p-1 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleFileAttach}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors w-full"
              >
                <Paperclip size={16} />
                Attach SOW, brief, or any relevant document
              </button>
            )}
          </div>
        </div>

        {/* Other details (optional) - Collapsible */}
        <Collapsible>
        <div className="bg-card rounded-2xl border border-border p-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div className="text-left">
              <h4 className="text-sm font-medium text-foreground mb-0.5">Other details <span className="text-muted-foreground font-normal">(optional)</span></h4>
              <p className="text-sm text-muted-foreground">Set practical boundaries for team recommendations</p>
            </div>
            <ChevronDown size={16} className="text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-5 pt-5">

          {/* Function */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground tracking-wider">Function</label>
            <div className="flex flex-wrap gap-2">
              {["Engineering", "Product", "Design", "Operations", "Analytics", "Strategy", "Marketing"].map((fn) => {
                const selected = selectedFunctions.includes(fn);
                return (
                  <button
                    key={fn}
                    onClick={() => setSelectedFunctions(selected ? selectedFunctions.filter(f => f !== fn) : [...selectedFunctions, fn])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {fn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground tracking-wider">Location</label>
            <div className="flex flex-wrap gap-2">
              {["Any", "US West", "US East", "EMEA", "APAC", "Remote only"].map((loc) => {
                const selected = selectedLocations.includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => {
                      if (loc === "Any") {
                        setSelectedLocations(selected ? [] : ["Any"]);
                      } else {
                        setSelectedLocations(
                          selected
                            ? selectedLocations.filter(l => l !== loc)
                            : [...selectedLocations.filter(l => l !== "Any"), loc]
                        );
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground tracking-wider">Seniority level</label>
            <div className="flex flex-wrap gap-2">
              {["Junior", "Mid-level", "Senior", "Lead", "Principal", "Director+"].map((lvl) => {
                const selected = selectedLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevels(selected ? selectedLevels.filter(l => l !== lvl) : [...selectedLevels, lvl])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground tracking-wider">Min. availability</label>
              <span className="text-sm font-semibold text-primary">{minAvailability}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={minAvailability}
              onChange={(e) => setMinAvailability(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Team size */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground tracking-wider">Team size</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Min</span>
                <select
                  value={teamSize[0]}
                  onChange={(e) => setTeamSize([Number(e.target.value), Math.max(Number(e.target.value), teamSize[1])])}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Max</span>
                <select
                  value={teamSize[1]}
                  onChange={(e) => setTeamSize([Math.min(teamSize[0], Number(e.target.value)), Number(e.target.value)])}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {[2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <span className="text-sm text-muted-foreground ml-1">members</span>
            </div>
          </div>
          </CollapsibleContent>
        </div>
        </Collapsible>
        <div className="sticky bottom-0 bg-background pt-4 pb-2 -mx-2 px-2">
          <button
            onClick={handleStartConversation}
            disabled={!canSubmitSetup}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
          >
            <Sparkles size={16} />
            Find the right team
          </button>
        </div>
      </motion.div>
    );
  }

  /* ─── Conversation Phase — Split Screen ─── */
  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {!selectedInitiativePrompt ? (
        /* ─── Centered: Initiative Summary + Prompt Chips ─── */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pt-4">
            <div className="max-w-[800px] w-full mx-auto space-y-4 pb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dynamic team
            </button>
            {/* AI Building Banner */}
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer-border bg-[length:200%_100%]" />
              <div className="relative w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {teamReady ? (
                  <CheckCircle size={14} className="text-primary" />
                ) : (
                  <>
                    <Sparkles size={14} className="text-primary animate-pulse" />
                    <span className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '2s' }} />
                  </>
                )}
              </div>
              <div className="relative">
                <p className="text-sm font-medium text-foreground">
                  {teamReady ? "Your team is ready" : "We're assembling your ideal team"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teamReady
                    ? "We've found the best matches based on skills, experience, and availability."
                    : "Matching skills, experience, and availability across your organization to find the best people for this initiative."}
                </p>
              </div>
            </div>

            {/* SOW Summary Card */}
            <InitiativeSummaryCard
              description={description}
              selectedObjective={selectedObjective}
              onDescriptionChange={(v) => setDescription(v)}
              onObjectiveChange={(v) => setSelectedObjective(v)}
            />

            {/* Inferred Skills */}
            <InferredSkillsSection skills={inferredSkills} onEdit={() => setShowEditSkills(true)} />

            {/* CTA */}
            <button
              onClick={() => handleInitiativePromptClick("Find the best team for this initiative")}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                teamReady
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
              disabled={!teamReady}
            >
              {teamReady ? "View teams" : "Find the best team for this initiative"}
            </button>

            {/* Secondary prompts */}
            <div className="flex flex-wrap gap-2">
              {["Review my brief", "Show recommended skills"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleInitiativePromptClick(prompt)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* Smart bar pinned to bottom */}
          <div className="flex-shrink-0 pb-4 pt-2 px-2">
            <div className="max-w-[800px] mx-auto">
              <SmartBarInline onSend={(msg) => handleInitiativePromptClick(msg)} />
            </div>
          </div>
        </div>
      ) : (
        /* ─── Split Screen: Conversation + Team Table ─── */
      <div className="flex gap-3 flex-1 min-h-0">
      {/* ─── LEFT: Conversation (35%) ─── */}
      <div className="w-[35%] flex-shrink-0 flex flex-col min-h-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dynamic team
        </button>

        {/* Scrollable area with summary, skills, and messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          {/* AI Building Banner */}
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer-border bg-[length:200%_100%]" />
            <div className="relative w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {teamReady ? (
                <CheckCircle size={14} className="text-primary" />
              ) : (
                <>
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '2s' }} />
                </>
              )}
            </div>
            <div className="relative">
              <p className="text-sm font-medium text-foreground">
                {teamReady ? "Your team is ready" : "We're assembling your ideal team"}
              </p>
              <p className="text-sm text-muted-foreground">
                {teamReady
                  ? "We've found the best matches based on skills, experience, and availability."
                  : "Matching skills, experience, and availability across your organization to find the best people for this initiative."}
              </p>
            </div>
          </div>

          {/* SOW Summary Card */}
          <InitiativeSummaryCard
            description={description}
            selectedObjective={selectedObjective}
            onDescriptionChange={(v) => setDescription(v)}
            onObjectiveChange={(v) => setSelectedObjective(v)}
          />

          {/* Inferred Skills in split view */}
          <InferredSkillsSection skills={inferredSkills} compact onEdit={() => setShowEditSkills(true)} />

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i === messages.length - 1 ? 0.05 : 0 }}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="px-4 py-2.5 bg-foreground/5 border border-border rounded-2xl text-sm max-w-[90%]"
                     
                    >
                      <MessageContent text={msg.content} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="text-sm leading-relaxed text-foreground max-w-[95%]"
                     
                    >
                      <MessageContent text={msg.content} />
                    </div>
                    {msg.teamSuggestions && (
                      <div className="space-y-2 pt-1">
                        {teamOptionPresets.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => { setSelectedTeamOption(opt.id); setExpandedMember(null); }}
                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                              selectedTeamOption === opt.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border bg-card hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-semibold ${selectedTeamOption === opt.id ? "text-primary" : "text-foreground"}`}>
                                  {opt.label}
                                </p>
                                <span className={`text-sm font-medium ${selectedTeamOption === opt.id ? "text-primary" : "text-muted-foreground"}`}>
                                  {opt.members.length} members
                                </span>
                              </div>
                              <ChevronRight size={14} className={`flex-shrink-0 transition-colors ${selectedTeamOption === opt.id ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                          </button>
                        ))}
                        {!messages.some(m => m.teamCreated) && (
                          <button
                            onClick={() => handleSendMessage(CONFIRM_PROMPT)}
                            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={14} />
                            Let's go with this team
                          </button>
                        )}
                      </div>
                    )}
                    {msg.teamCreated && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle size={16} className="text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">Team created</p>
                          <p className="text-sm text-muted-foreground">Ready for review & deployment</p>
                        </div>
                        <button
                          onClick={() => {
                            const lastTeamMsg = [...messages].reverse().find((m) => m.teamSuggestions);
                            const teamMembers = lastTeamMsg?.teamSuggestions || mockTeamSuggestions.slice(0, 4);
                            const teamName = selectedObjective ? `${selectedObjective} Team` : "Dynamic Team";
                            setDeployDialogTeam({
                              id: crypto.randomUUID(),
                              name: teamName,
                              description: description.trim(),
                              members: teamMembers,
                              createdAt: new Date(),
                            });
                          }}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
                        >
                          Deploy
                        </button>
                      </div>
                    )}
                    {/* Follow-up prompts */}
                    {msg.teamSuggestions && !msg.teamCreated && i === messages.length - 1 && !isTyping && !messages.some(m => m.teamCreated) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {suggestedPrompts
                          .filter((p) => !messages.some((m) => m.content === p))
                          .slice(0, 3)
                          .map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => handleSendMessage(prompt)}
                              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            >
                              {prompt}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-muted-foreground text-sm"
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="ml-1">{messages[messages.length - 1]?.content === CONFIRM_PROMPT ? "Creating your team…" : "Researching talent…"}</span>
            </motion.div>
          )}

          {/* Follow-up prompts for non-team messages */}
          {messages.length > 0 && messages.length < 4 && !isTyping && !messages[messages.length - 1]?.teamSuggestions && !messages.some(m => m.teamCreated) && (
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts
                .filter((p) => !messages.some((m) => m.content === p))
                .slice(0, 3)
                .map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Smart bar */}
        <div className="flex-shrink-0">
          <SmartBarInline onSend={(msg) => handleSendMessage(msg)} />
        </div>
      </div>

      {/* ─── RIGHT: Team Details Table (60%) ─── */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-4 bg-muted/50 rounded-2xl p-4 border border-border mt-8">
        {detailedMembers.length > 0 ? (
          <>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {activeTeamOption.label}
              </h3>
              <span className="text-sm font-medium text-muted-foreground ml-auto">
                {detailedMembers.length} members · Avg match {Math.round(detailedMembers.reduce((a, m) => a + m.matchScore, 0) / detailedMembers.length)}%
              </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2fr_0.8fr_0.8fr_1fr_1.5fr] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-sm font-medium text-muted-foreground tracking-wider">
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
                  <div key={member.name} className={`relative ${
                    memberDecisions[member.name]?.status === "accepted" ? "border-l-2 border-l-green-500" :
                    memberDecisions[member.name]?.status === "rejected" ? "border-l-2 border-l-destructive opacity-60" : ""
                  }`}>
                    <button
                      onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                      className="w-full grid grid-cols-[2fr_0.8fr_0.8fr_1fr_1.5fr] gap-4 px-5 py-4 items-center hover:bg-muted/30 transition-colors text-left"
                    >
                      {/* Member */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                          {member.verified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                              <BadgeCheck size={13} className="text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                            {member.verified && member.proficiencyScore && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold cursor-help flex-shrink-0">
                                    <ShieldCheck size={10} />
                                    {member.proficiencyScore}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[200px]">
                                  <p className="text-sm font-semibold mb-1">Verified proficiency</p>
                                  <p className="text-xs text-muted-foreground">
                                    Score based on {member.verificationSources?.map(s => s.label.toLowerCase()).join(", ")} signals
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
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
                        <div className="grid grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground tracking-wider">Why recommended</p>
                            <p className="text-sm text-foreground leading-relaxed">{member.explainability}</p>
                          </div>
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
                          {/* Verification section */}
                          {member.verified && member.verificationSources && (
                            <div className="col-span-3 mt-2 pt-3 border-t border-border">
                              <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck size={13} className="text-primary" />
                                <p className="text-sm font-semibold text-foreground tracking-wider">Verified proficiency — {member.proficiencyScore}/5.0</p>
                              </div>
                              <div className="flex gap-2">
                                {(
                                  [
                                    { type: "self", label: "Self-rated", icon: "👤" },
                                    { type: "manager", label: "Manager input", icon: "👔" },
                                    { type: "peer", label: "Peer feedback", icon: "🤝" },
                                    { type: "performance", label: "Performance data", icon: "📊" },
                                  ] as const
                                ).map((source) => {
                                  const active = member.verificationSources!.some(s => s.type === source.type);
                                  return (
                                    <span
                                      key={source.type}
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        active
                                          ? "bg-primary/10 text-primary"
                                          : "bg-muted text-muted-foreground opacity-50"
                                      }`}
                                    >
                                      <span>{source.icon}</span>
                                      {source.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Accept / Reject controls */}
                          <div className="col-span-3 mt-2 pt-3 border-t border-border">
                            {memberDecisions[member.name] ? (
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                  memberDecisions[member.name].status === "accepted"
                                    ? "bg-success-dark/10 text-success-foreground"
                                    : "bg-destructive/10 text-destructive"
                                }`}>
                                  {memberDecisions[member.name].status === "accepted" ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                                  {memberDecisions[member.name].status === "accepted" ? "Accepted" : "Rejected"}
                                </span>
                                {memberDecisions[member.name].reason && (
                                  <span className="text-sm text-muted-foreground italic flex items-center gap-1">
                                    <MessageSquare size={10} />
                                    "{memberDecisions[member.name].reason}"
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMemberDecisions(prev => { const next = { ...prev }; delete next[member.name]; return next; });
                                  }}
                                  className="text-sm text-muted-foreground hover:text-foreground ml-auto underline"
                                >
                                  Undo
                                </button>
                              </div>
                            ) : showReasonFor === member.name ? (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Why? <span className="text-muted-foreground font-normal">(optional)</span></p>
                                <div className="flex gap-2">
                                  <input
                                    value={reasonInput}
                                    onChange={(e) => setReasonInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.stopPropagation();
                                        const pendingStatus = memberDecisions[`__pending_${member.name}`]?.status || "rejected";
                                        setMemberDecisions(prev => {
                                          const next = { ...prev };
                                          delete next[`__pending_${member.name}`];
                                          next[member.name] = { status: pendingStatus as "accepted" | "rejected", reason: reasonInput.trim() || undefined };
                                          return next;
                                        });
                                        setShowReasonFor(null);
                                        setReasonInput("");
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="e.g. Availability too low for this sprint"
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    autoFocus
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const pendingStatus = memberDecisions[`__pending_${member.name}`]?.status || "rejected";
                                      setMemberDecisions(prev => {
                                        const next = { ...prev };
                                        delete next[`__pending_${member.name}`];
                                        next[member.name] = { status: pendingStatus as "accepted" | "rejected", reason: reasonInput.trim() || undefined };
                                        return next;
                                      });
                                      setShowReasonFor(null);
                                      setReasonInput("");
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setShowReasonFor(null); setReasonInput(""); }}
                                    className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
                                  >
                                    Skip
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMemberDecisions(prev => ({ ...prev, [`__pending_${member.name}`]: { status: "accepted" } }));
                                    setShowReasonFor(member.name);
                                    setReasonInput("");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-dark/10 text-success-foreground text-sm font-semibold hover:bg-success-dark/20 transition-colors"
                                >
                                  <ThumbsUp size={12} />
                                  Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMemberDecisions(prev => ({ ...prev, [`__pending_${member.name}`]: { status: "rejected" } }));
                                    setShowReasonFor(member.name);
                                    setReasonInput("");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors"
                                >
                                  <ThumbsDown size={12} />
                                  Reject
                                </button>
                                <span className="text-xs text-muted-foreground ml-2">Your feedback helps improve future recommendations</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <Users size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Team recommendations</p>
                <p className="text-sm text-muted-foreground mt-1">Member details will appear here as the<br />AI suggests candidates for your team</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      )}
    </motion.div>

    {deployDialogTeam && (
      <ReviewDeployDialog
        open={!!deployDialogTeam}
        onClose={() => setDeployDialogTeam(null)}
        team={deployDialogTeam}
        onDeployed={() => {
          setDeployDialogTeam(null);
          onTeamCreated?.({
            name: deployDialogTeam.name,
            description: deployDialogTeam.description,
            members: deployDialogTeam.members,
          });
        }}
      />
    )}

    <EditSkillsDialog
      open={showEditSkills}
      onClose={() => setShowEditSkills(false)}
      skills={inferredSkills}
      onSave={setInferredSkills}
    />
    </>
  );
}

/* ─── Initiative Summary Card ─── */
function InitiativeSummaryCard({
  description,
  selectedObjective,
  onDescriptionChange,
  onObjectiveChange,
}: {
  description: string;
  selectedObjective: string;
  onDescriptionChange: (v: string) => void;
  onObjectiveChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(description);
  const [editObjective, setEditObjective] = useState(selectedObjective);

  const handleEdit = () => {
    setEditDesc(description);
    setEditObjective(selectedObjective);
    setEditing(true);
  };

  const handleSave = () => {
    onDescriptionChange(editDesc);
    onObjectiveChange(editObjective);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground tracking-wider">Initiative summary</h3>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
          >
            <Pencil size={10} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              rows={3}
            />
          </div>
          {selectedObjective && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Objective</p>
              <input
                value={editObjective}
                onChange={(e) => setEditObjective(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm text-foreground leading-relaxed line-clamp-3">{description.trim()}</p>
          </div>
          {selectedObjective && (
            <div>
              <p className="text-sm text-muted-foreground">Objective</p>
              <p className="text-sm font-medium text-foreground">{selectedObjective}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Key objectives</p>
            <ul className="space-y-1">
              {["Define go-to-market strategy & timeline", "Build MVP feature set for launch", "Establish partnership framework"].map((obj) => (
                <li key={obj} className="flex items-start gap-1.5 text-sm text-foreground">
                  <Target size={10} className="text-primary mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inferred Skills Section ─── */
function InferredSkillsSection({ skills, compact, onEdit }: { skills: InferredSkills; compact?: boolean; onEdit?: () => void }) {
  const allSkills = [...skills.aiInferred, ...skills.documentInferred, ...skills.additional];
  if (allSkills.length === 0) return null;

  return (
    <div className={`bg-card rounded-2xl border border-border ${compact ? "p-3 mb-3 flex-shrink-0" : "p-4"} space-y-2.5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground tracking-wider">Skills identified</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
          >
            <Pencil size={10} />
            Edit
          </button>
        )}
      </div>

      {skills.aiInferred.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground tracking-wider flex items-center gap-1">
            <Sparkles size={9} /> AI-inferred
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.aiInferred.map((skill) => (
              <span key={skill} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills.documentInferred.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground tracking-wider flex items-center gap-1">
            <FileText size={9} /> From document
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.documentInferred.map((skill) => (
              <span key={skill} className="px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills.additional.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground tracking-wider">Added manually</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.additional.map((skill) => (
              <span key={skill} className="px-2 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Simple markdown-like rendering ─── */
function MessageContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const lines = part.split("\n");
        return lines.map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ));
      })}
    </>
  );
}

/* ─── Team suggestions card (kept for potential reuse) ─── */
function TeamSuggestionsCard({ members }: { members: TeamMember[] }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Users size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Suggested team members
        </span>
        <span className="text-sm font-medium text-muted-foreground ml-auto">
          {members.length} matches
        </span>
      </div>
      <div className="divide-y divide-border">
        {members.map((member) => (
          <div
            key={member.name}
            className="px-5 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {member.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {member.role} · {member.department}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {member.matchReason}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  member.availability >= 70
                    ? "bg-success"
                    : member.availability >= 50
                    ? "bg-warning"
                    : "bg-destructive/60"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {member.availability}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { TeamMember };
export interface Initiative {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Planning" | "Completed";
  skills: string[];
  team: string[];
  progress: number;
}
