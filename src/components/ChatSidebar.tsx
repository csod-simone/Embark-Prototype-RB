import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, Home, MessageSquare, Layers, Compass, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ChatSidebar() {
  const [activeTab, setActiveTab] = useState<"me" | "team">("me");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-[68px] flex-shrink-0 bg-sidebar flex flex-col items-center rounded-sidebar overflow-hidden sticky top-0 self-start h-[calc(100vh-100px)]">
      <div className="p-2 pt-6 w-full">
        {/* Tab Switcher - shows only active icon */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setActiveTab(activeTab === "me" ? "team" : "me")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-accent border border-primary text-foreground transition-all duration-200"
            aria-label={`Switch to ${activeTab === "me" ? "team" : "me"} view`}
          >
            {activeTab === "me" ? <User size={20} aria-hidden="true" /> : <Users size={20} aria-hidden="true" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1" aria-label="Main navigation">
          <ChatNavItem icon={Home} label="Home" onClick={() => navigate("/")} />
          <ChatNavItem icon={MessageSquare} label="New chat" onClick={() => navigate("/chat")} />
          <ChatNavItem icon={Layers} label="Upskilling" />
          <ChatNavItem icon={Compass} label="Career exploration" onClick={() => navigate("/explore")} />
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-2 pb-6 space-y-1 w-full">
        <ChatNavItem icon={theme === "dark" ? Sun : Moon} label={theme === "dark" ? "Light mode" : "Dark mode"} onClick={toggleTheme} />
        <div className="flex items-center justify-center pt-4 border-t border-foreground/5">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm" role="img" aria-label="John Drapper avatar">
            JD
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChatNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-full flex items-center justify-center h-[52px] rounded-lg text-base font-normal transition-all duration-200 ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-foreground/5"
      }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
    </button>
  );
}
