import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { X, User, Users, Bell } from "lucide-react";
import { StarIcon } from "@/components/StarIcon";
import logoCSOD from "@/assets/CSOD_logo_black.png";
import logoCSODWhite from "@/assets/CSOD_logo_white.png";
import logoRathbones from "@/assets/rathbones_logo.png";
import logoRathbonesWhite from "@/assets/rathbones_logo_white.png";
import davidLinAvatar from "@/assets/david-lin.jpg";
import { AppSidebar } from "@/components/AppSidebar";
import { AskAIOverlay } from "@/components/AskAIOverlay";

import { UserProfilePopover } from "@/components/UserProfilePopover";
import { useBrand } from "@/hooks/use-brand";
import { useTheme } from "@/hooks/use-theme";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { ChevronLeft, ChevronRight } from "lucide-react";

const meRoute = "/me";
const teamRoute = "/team";

type Subsection = { label?: string; text: string };
type NotesSection = { heading: string; subsections: Subsection[] };
type Notes = { label: string; title: string; sections: NotesSection[] };

const defaultNotes: Notes = {
  label: "Design notes",
  title: "Design notes",
  sections: [
    {
      heading: "Me mode / team mode action center",
      subsections: [
        { label: "Content container & section placement:", text: "To reduce excessive scrolling while avoiding uneven section heights, each section is presented in a two-column card layout. This keeps expanded states more compact and improves scanability." },
        { label: "Card container:", text: "The cards will sit inside a container, separated by a horizontal divider." },
        { label: "View more interaction", text: "Additional cards beyond the default visible set can be revealed using a View more interaction." },
        { label: "Main CTA button color", text: "Used the tech lilac from branding PDF because it's not as loud as the orange." },
        { label: "Critical badge", text: "Instead of a vertical bar and the outline badge for Critical and Risk, we\u2019re suggesting a circle dot with the text outside of the badge." },
        { label: "Agent pack text tags", text: "The agent pack text tag also includes an icon for visual purposes." },
      ],
    },
    { heading: "Sidebar", subsections: [{ text: "We integrated the \u201CAsk AI\u201D button directly into the sidebar navigation, making it feel like a natural part of the navigation experience while ensuring it remains highly visible and easy to access. We also made the sidebar collapsible to maximize screen real estate for the primary workspace." }] },
    { heading: "Chat", subsections: [
      { text: "Uses a softer rounded rectangle in a muted orange tone — feels warmer and less like a generic chat app. The brand orange ties it better to the Cornerstone identity." },
      { text: "AI response bubble keeps the response open and borderless which feels lighter and easier to read." },
    ] },
  ],
};

const designSystemNotes: Notes = {
  label: "Design notes",
  title: "Design system notes",
  sections: [{ heading: "Design system", subsections: [{ text: "We recommend treating the design system as the single source of truth for tokens, components, and patterns used across every option." }] }],
};

const blackBarRoutes = ["/design-system"];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notesOpen, setNotesOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const { brand } = useBrand();
  const { theme } = useTheme();
  const { collapsed: sidebarCollapsed, toggle: toggleSidebar } = useSidebarCollapsed();

  useEffect(() => {
    const handler = () => setAskOpen(true);
    window.addEventListener("open-ask-ai", handler);
    return () => window.removeEventListener("open-ask-ai", handler);
  }, []);

  useEffect(() => {
    setAskOpen(false);
  }, [location.pathname]);

  const isMeRoute = location.pathname === meRoute;
  const isTeamRoute = location.pathname === teamRoute;
  const isCombinedRoute = location.pathname === "/combined";
  const isPaperRoute = location.pathname === "/paper";
  const isAnyTeamRoute = isTeamRoute || isCombinedRoute || isPaperRoute;
  const isDesignSystemRoute = location.pathname === "/design-system";
  const showAppSidebar = isMeRoute || isAnyTeamRoute;
  const showModeToggle = showAppSidebar || isDesignSystemRoute;
  const mode: "me" | "team" | "design" = isDesignSystemRoute
    ? "design"
    : isAnyTeamRoute
    ? "team"
    : "me";

  const notes = isDesignSystemRoute ? designSystemNotes : defaultNotes;
  const showBlackBar = blackBarRoutes.includes(location.pathname);

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      <a href="#main-content" className="sr-skip-link sr-only focus:not-sr-only">
        Skip to main content
      </a>


      <header className="sticky top-0 z-40 bg-background px-6 h-16 flex items-center flex-shrink-0 w-full border-b border-border relative">
        {isDesignSystemRoute ? (
          <Link to="/team" aria-label="Go to Team">
            <img
              src={
                brand === "rathbones"
                  ? theme === "dark" ? logoRathbonesWhite : logoRathbones
                  : theme === "dark"
                  ? logoCSODWhite
                  : logoCSOD
              }
              alt={brand === "rathbones" ? "Rathbones" : "Cornerstone"}
              className="h-7"
            />
          </Link>
        ) : (
          <img
            src={
              brand === "rathbones"
                ? theme === "dark" ? logoRathbonesWhite : logoRathbones
                : theme === "dark"
                ? logoCSODWhite
                : logoCSOD
            }
            alt={brand === "rathbones" ? "Rathbones" : "Cornerstone"}
            className="h-7"
          />
        )}



        <div className="ml-auto flex items-center gap-4">
          {isDesignSystemRoute && (
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="text-sm font-medium text-foreground underline underline-offset-4"
              aria-expanded={notesOpen}
              aria-controls="design-notes-modal"
            >
              {notes.label}
            </button>
          )}
          {(isCombinedRoute || isPaperRoute || isMeRoute || isTeamRoute) && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-ask-ai"))}
              className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold"
            >
              <StarIcon size={14} />
              Ask AI
            </button>
          )}
          {showModeToggle && !isDesignSystemRoute && !isTeamRoute && (
            <div className="bg-card border border-border p-0.5 rounded-full flex h-7">
              <button
                onClick={() => navigate(meRoute)}
                className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                  mode === "me"
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "text-muted-foreground border border-transparent"
                }`}
              >
                <User size={14} aria-hidden="true" />
                Me
              </button>
              <button
                onClick={() => navigate(teamRoute)}
                className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                  mode === "team"
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "text-muted-foreground border border-transparent"
                }`}
              >
                <Users size={14} aria-hidden="true" />
                Team
              </button>
            </div>
          )}
          {!isDesignSystemRoute && (
            <>
              <button
                type="button"
                aria-label="Notifications (4 unread)"
                className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted"
              >
                <Bell size={14} aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none border-2 border-background"
                >
                  4
                </span>
              </button>
              <UserProfilePopover>
                <button
                  type="button"
                  aria-label="David Lin"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border overflow-hidden bg-ds-100 text-ds-700"
                >
                  <img
                    src={davidLinAvatar}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </UserProfilePopover>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {showAppSidebar && mode !== "design" && (
          <AppSidebar mode={mode} forceCollapsed={askOpen} />
        )}

        {showAppSidebar && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
            style={{
              left: sidebarCollapsed ? "calc(32px - 14px)" : "calc(240px - 14px)",
              top: 18,
            }}
            className="absolute z-40 h-7 w-7 inline-flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground shadow-sm hover:text-foreground hover:bg-muted transition-[left,colors] duration-200"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}



        <main
          id="main-content"
          className="flex-1 overflow-y-auto flex flex-col relative"
        >
          <Outlet />
          {askOpen && <AskAIOverlay onClose={() => setAskOpen(false)} />}
        </main>
      </div>

      {notesOpen && notes && (
        <>
          <div
            onClick={() => setNotesOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/25"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center px-6 pt-20 pb-6 pointer-events-none">
            <div
              id="design-notes-modal"
              role="dialog"
              aria-modal="true"
              aria-label={notes.title}
              style={{ borderRadius: 24 }}
              className="pointer-events-auto w-full max-w-[800px] max-h-[85vh] bg-background/80 backdrop-blur-md border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="overflow-y-auto px-6 py-5 space-y-6">
                {notes.sections.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-foreground">{s.heading}</h3>
                      {i === 0 && (
                        <button
                          onClick={() => setNotesOpen(false)}
                          aria-label="Close design notes"
                          className="p-1 -mt-1 rounded-full hover:bg-foreground/5 text-foreground flex-shrink-0"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {s.subsections.map((sub, j) => (
                        <li key={j} className="text-sm leading-relaxed text-foreground">
                          {sub.label && <span className="font-semibold">{sub.label} </span>}
                          {sub.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {!isDesignSystemRoute && (
        <Link
          to="/design-system"
          className="fixed right-0 top-20 z-50 bg-foreground text-background text-xs font-semibold px-2 py-4 rounded-l-lg shadow-lg hover:bg-foreground/90 transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          Design system
        </Link>
      )}
      {isDesignSystemRoute && (
        <Link
          to="/team"
          className="fixed right-0 top-20 z-50 bg-foreground text-background text-xs font-semibold px-2 py-4 rounded-l-lg shadow-lg hover:bg-foreground/90 transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          Page examples
        </Link>
      )}
    </div>
  );
}
