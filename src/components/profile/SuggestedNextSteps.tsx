import { ArrowRight, GalleryVertical, AudioLines } from "lucide-react";

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

export function SuggestedNextSteps() {
  return (
    <div>
      <h3
        className="text-lg font-semibold text-foreground mb-4"
       
      >
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
    </div>
  );
}
