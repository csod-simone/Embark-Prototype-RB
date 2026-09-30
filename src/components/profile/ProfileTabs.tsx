interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "insights", label: "Insights" },
  { id: "skills", label: "Skills" },
  { id: "career-exploration", label: "Career Exploration" },
  { id: "about", label: "About" },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex gap-3" role="tablist" aria-label="Profile sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`p-4 py-[8px] rounded-full text-base font-medium border transition-colors ${
            activeTab === tab.id
              ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border"
              : "bg-transparent text-sidebar-primary-foreground border-border hover:bg-muted"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
