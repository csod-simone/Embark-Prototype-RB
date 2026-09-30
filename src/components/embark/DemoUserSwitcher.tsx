import { useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useOrganisation, ORG_LABEL, ORG_ORDER, type OrgId } from "@/hooks/use-organisation";
import { NEXUS_USERS } from "@/data/nexusTerms";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Persona = "learner" | "graduating" | "manager" | "trainer" | "admin" | "upskiller" | "readiness";

const HOMES: Record<Persona, string> = {
  learner: "/learner/home",
  graduating: "/learner/graduating",
  manager: "/manager/overview",
  trainer: "/trainer/home",
  admin: "/admin/cohorts",
  upskiller: "/upskiller/intro",
  readiness: "/readiness/intro",
};

const ORDER: Persona[] = ["learner", "graduating", "manager", "admin"];

function currentPersona(pathname: string): Persona | null {
  if (pathname.startsWith("/learner/graduating")) return "graduating";
  if (pathname.startsWith("/upskiller")) return "upskiller";
  if (pathname.startsWith("/readiness")) return "readiness";
  const seg = pathname.split("/")[1] as Persona;
  return ORDER.includes(seg) ? seg : null;
}

function readinessLabel(_org: OrgId) {
  return "IM pathway";
}

function personaMenuLabel(persona: Persona, org: OrgId): string {
  if (persona === "readiness") return readinessLabel(org);

  if (org === "rathbones" && persona in RATHBONES_USERS) {
    const user = RATHBONES_USERS[persona as keyof typeof RATHBONES_USERS];
    const roleTitle =
      persona === "graduating"
        ? "Graduating"
        : persona === "admin"
          ? "Admin"
          : persona.charAt(0).toUpperCase() + persona.slice(1);
    return `${roleTitle} · ${user.name}`;
  }

  if (org === "nexus" && persona in NEXUS_USERS) {
    const user = NEXUS_USERS[persona as keyof typeof NEXUS_USERS];
    const roleTitle = persona.charAt(0).toUpperCase() + persona.slice(1);
    return `${roleTitle} · ${user.name}`;
  }

  return persona.charAt(0).toUpperCase() + persona.slice(1);
}

export function DemoUserSwitcher({ variant = "fixed" }: { variant?: "fixed" | "inline" } = {}) {
  const enabled = import.meta.env.VITE_SHOW_DEMO_SWITCHER === "true";
  const location = useLocation();
  const navigate = useNavigate();

  if (!enabled) return null;

  const persona = currentPersona(location.pathname);
  const { org, setOrg } = useOrganisation();
  const label = persona ? personaMenuLabel(persona, org) : "login";

  const switchToOrg = (next: OrgId) => {
    setOrg(next);
    navigate(HOMES[persona ?? "learner"]);
  };

  const isInline = variant === "inline";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            isInline
              ? "h-8 px-3 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition inline-flex items-center"
              : "fixed bottom-4 left-4 z-[60] h-11 md:h-9 px-4 rounded-full bg-foreground text-background text-xs font-semibold shadow-lg hover:opacity-90 transition"
          }
          aria-label={`Viewing as ${label}. Click to switch persona.`}
        >
          Viewing as: <span className="ml-1">{label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isInline ? "bottom" : "top"} align="start" className="w-64" data-org-raw>
        {ORDER.map((p) => (
          <DropdownMenuItem
            key={p}
            onClick={() => navigate(HOMES[p])}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate">{personaMenuLabel(p, org)}</span>
            {persona === p && <Check size={14} aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/")}>← Back to login</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
