import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, GalleryVertical, AudioLines } from "lucide-react";

const stats = [
  { label: "Active upskilling", value: "14", tooltip: "Learning programs you're currently working on." },
  { label: "Weekly learning engagement", value: "2", tooltip: "Learning spaces you participated in this week." },
  { label: "Weekly activity engagement", value: "8", tooltip: "Activities completed this week, including content, roleplays, and quizzes." },
  { label: "Focus area", value: "ServiceNow Ticketing", tooltip: "Your top learning domain based on recent activity." },
];

const steps = [
  {
    icon: GalleryVertical,
    title: "Product strategy",
    description: "Keep your learning momentum going create an upskilling space",
  },
  {
    icon: AudioLines,
    title: "Sales strategy & planning",
    description: "Boost your learning streak by completing a role play",
  },
  {
    icon: GalleryVertical,
    title: "Pipeline management",
    description: "Keep your learning momentum going take a quiz",
  },
];

export function UpskillingCard() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      {/* Upskilling section */}
      <h3 className="text-lg font-semibold text-foreground mb-5">
        Upskilling
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-sm text-primary font-medium">
                {stat.label}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`Info: ${stat.label}`}>
                    <Info size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-sm">{stat.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Horizontal divider */}
      <div className="h-px bg-border my-6" />

      {/* Suggested next steps section */}
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Suggested next steps
      </h3>

      <div className="space-y-1">
        {steps.map((step) => (
          <button
            key={step.title}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-foreground/5 transition-colors group text-left"
          >
            <div className="flex-shrink-0">
              <step.icon size={24} className="text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {step.description}
              </p>
            </div>
            <ArrowRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="text-sm font-semibold text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
          View all upskilling
        </button>
      </div>
    </div>
  );
}
