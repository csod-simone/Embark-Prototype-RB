import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChevronRight,
  GraduationCap,
  Users,
  Presentation,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganisation, type OrgId, ORG_LABEL } from "@/hooks/use-organisation";
import { NEXUS_USERS } from "@/data/nexusTerms";
import { BrandLogo } from "@/components/embark/BrandLogo";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";
import { getReadinessUser } from "@/data/readinessJourney";

type Role = {
  icon: LucideIcon;
  title: string;
  subLabel: string;
  to: string;
};

const ROLES: Role[] = [
  { icon: GraduationCap, title: "Learner", subLabel: "Jordan Kim · CSR · Medicare LOB", to: "/first-login" },
  { icon: Users, title: "Manager", subLabel: "Taylor Reyes · CSR Manager · Medicare & Commercial LOB", to: "/manager/overview" },
  { icon: Presentation, title: "Trainer", subLabel: "Alex Morgan · L&D Trainer · Medicare LOB", to: "/trainer/home" },
  { icon: ShieldCheck, title: "Admin", subLabel: "Sam Patel · L&D Administrator · CVS Health / Aetna", to: "/admin/cohorts" },
  { icon: GraduationCap, title: "Graduating Learner", subLabel: "Alex Morgan · Learner · Medicare CSR Cohort B", to: "/learner/graduating" },
  { icon: Sparkles, title: "Up-skiller", subLabel: "Riley Chen · CSR · Medicare LOB · Upskilling", to: "/upskiller/intro" },
];

const NEXUS_ROLES: Role[] = [
  { icon: GraduationCap, title: "Learner", subLabel: `${NEXUS_USERS.learner.name} · ${NEXUS_USERS.learner.title}`, to: "/first-login" },
  { icon: Users, title: "Manager", subLabel: `${NEXUS_USERS.manager.name} · ${NEXUS_USERS.manager.title}`, to: "/manager/overview" },
  { icon: Presentation, title: "Trainer", subLabel: `${NEXUS_USERS.trainer.name} · ${NEXUS_USERS.trainer.title}`, to: "/trainer/home" },
  { icon: ShieldCheck, title: "Admin", subLabel: `${NEXUS_USERS.admin.name} · ${NEXUS_USERS.admin.title}`, to: "/admin/cohorts" },
  { icon: GraduationCap, title: "Graduating Learner", subLabel: `${NEXUS_USERS.graduating.name} · ${NEXUS_USERS.graduating.title}`, to: "/learner/graduating" },
  { icon: Sparkles, title: "Up-skiller", subLabel: `${NEXUS_USERS.upskiller.name} · ${NEXUS_USERS.upskiller.title}`, to: "/upskiller/intro" },
  {
    icon: Briefcase,
    title: "Project Readiness",
    subLabel: `${getReadinessUser("nexus").name} · ${getReadinessUser("nexus").title}`,
    to: "/readiness/intro",
  },
];

const RATHBONES_ROLES: Role[] = [
  {
    icon: GraduationCap,
    title: "Learner",
    subLabel: `${RATHBONES_USERS.learner.name} · ${RATHBONES_USERS.learner.title}`,
    to: "/first-login",
  },
  {
    icon: Users,
    title: "Manager",
    subLabel: `${RATHBONES_USERS.manager.name} · ${RATHBONES_USERS.manager.title}`,
    to: "/manager/overview",
  },
  {
    icon: ShieldCheck,
    title: "Admin",
    subLabel: `${RATHBONES_USERS.admin.name} · ${RATHBONES_USERS.admin.title}`,
    to: "/admin/cohorts",
  },
  {
    icon: GraduationCap,
    title: "Graduating",
    subLabel: `${RATHBONES_USERS.graduating.name} · ${RATHBONES_USERS.graduating.title}`,
    to: "/learner/graduating",
  },
];

function rolesFor(org: OrgId): Role[] {
  if (org === "nexus") return NEXUS_ROLES;
  if (org === "rathbones") return RATHBONES_ROLES;
  return ROLES;
}

export default function RoleSelect() {
  const navigate = useNavigate();
  const roles = RATHBONES_ROLES;

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <BrandLogo className="h-10" />
        <div className="text-xs text-muted-foreground">Rathbones Institute</div>
      </div>

      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-medium text-foreground">Welcome to Embark</h2>
        <p className="text-sm text-muted-foreground">
          Investment Management pilot. Select a persona to explore.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[540px] mx-auto">
        <h3 data-org-raw className="text-sm font-semibold text-foreground">
          {ORG_LABEL.rathbones}
        </h3>

        <div className="flex flex-col gap-3" data-org-raw>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.title}
                type="button"
                onClick={() => navigate(role.to, { replace: true })}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors text-left"
              >
                <Icon size={32} className="text-primary flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{role.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{role.subLabel}</div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground text-center">
          This is a prototype for demonstration purposes only. No real data is used.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset demo? This will clear all saved progress and reload the page.")) {
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.location.reload();
            }
          }}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}
