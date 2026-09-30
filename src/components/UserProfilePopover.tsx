import { useNavigate } from "react-router-dom";
import { KeyRound, Settings, FileText, HelpCircle, LogOut, ChevronRight, Moon, Sun, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { usePersona } from "@/hooks/use-persona";
import { useBrand, type Brand } from "@/hooks/use-brand";
import davidLinAvatar from "@/assets/david-lin.jpg";

interface UserProfilePopoverProps {
  children: React.ReactNode;
}

export function UserProfilePopover({ children }: UserProfilePopoverProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { persona } = usePersona();
  const { brand, setBrand } = useBrand();

  const handleLogout = () => {
    sessionStorage.removeItem("prototype-auth");
    navigate("/login");
  };

  const topItems = [
    { icon: KeyRound, label: "Switch to Admin", onClick: () => {} },
    {
      icon: theme === "dark" ? Sun : Moon,
      label: theme === "dark" ? "Light mode" : "Dark mode",
      onClick: toggleTheme,
    },
  ];
  const bottomItems = [
    { icon: Settings, label: "Profile settings", onClick: () => {} },
    { icon: FileText, label: "Terms and Policies", onClick: () => {}, hasChevron: true },
    { icon: HelpCircle, label: "Get help", onClick: () => {} },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];
  const brandOptions: { value: Brand; label: string; swatch: string }[] = [];

  const renderItem = (item: {
    icon: typeof Settings;
    label: string;
    onClick: () => void;
    hasChevron?: boolean;
  }) => (
    <button
      key={item.label}
      onClick={item.onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
    >
      <item.icon size={18} className="text-muted-foreground" aria-hidden="true" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.hasChevron && <ChevronRight size={16} className="text-muted-foreground" aria-hidden="true" />}
    </button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={12}
        className="w-[280px] rounded-2xl p-0 border border-border shadow-lg"
      >
        {/* User info header */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 p-4 pb-3 hover:bg-secondary hover:text-secondary-foreground transition-colors rounded-t-2xl text-left"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
            {persona.id === "david" ? (
              <img src={davidLinAvatar} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              persona.initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{persona.name}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{persona.email}</p>
          </div>
        </button>

        <div role="separator" className="border-t border-border" />

        <div className="p-1.5">{topItems.map(renderItem)}</div>

        <div role="separator" className="border-t border-border" />

        <div className="p-1.5" role="radiogroup" aria-label="Brand theme">
          {brandOptions.map((opt) => {
            const selected = brand === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={selected}
                onClick={() => setBrand(opt.value)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              >
                <span
                  aria-hidden="true"
                  className="w-[18px] h-[18px] rounded-full border border-border flex-shrink-0"
                  style={{ backgroundColor: opt.swatch }}
                />
                <span className="flex-1 text-left">{opt.label}</span>
                {selected && <Check size={16} className="text-foreground" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div role="separator" className="border-t border-border" />

        <div className="p-1.5">{bottomItems.map(renderItem)}</div>
      </PopoverContent>
    </Popover>
  );
}
