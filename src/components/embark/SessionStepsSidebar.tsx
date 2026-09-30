import { BookOpen, Check, ClipboardCheck, FileText, Lock, MessageSquare, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "@/data/mockData";

type Status = "completed" | "current" | "locked" | "upcoming" | "skipped";

export type SessionStep = {
  id: string;
  name: string;
  subtitle: string;
  modality: Session["modality"];
  status: Status;
  onClick?: () => void;
};

const modalityIcon: Record<Session["modality"], typeof BookOpen> = {
  article: FileText,
  video: PlayCircle,
  audio: PlayCircle,
  role_play: MessageSquare,
  exercise: BookOpen,
  assessment: ClipboardCheck,
};

export function SessionStepsSidebar({
  title = "Journey steps",
  meta,
  steps,
}: {
  title?: string;
  meta?: string;
  steps: SessionStep[];
}) {
  const completed = steps.filter((s) => s.status === "completed").length;
  return (
    <aside className="hidden md:flex flex-col w-[300px] flex-shrink-0 border-r border-border bg-background">
      <div className="px-5 py-5 border-b border-border">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {meta ?? `${completed} of ${steps.length} complete`}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ol className="space-y-1">
          {steps.map((s, idx) => {
            const Icon = modalityIcon[s.modality] ?? BookOpen;
            const isCurrent = s.status === "current";
            const isDone = s.status === "completed";
            const isLocked = s.status === "locked";
            const isSkipped = s.status === "skipped";
            const clickable = !isLocked && !!s.onClick;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={s.onClick}
                  className={cn(
                    "w-full flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                    isCurrent && "bg-secondary/60",
                    !isCurrent && clickable && "hover:bg-muted",
                    isLocked && "opacity-60 cursor-not-allowed",
                    isSkipped && "opacity-70",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                      isDone
                        ? "bg-success-dark/20 text-success-dark"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-sm truncate",
                        isCurrent ? "font-semibold text-foreground" : "text-foreground",
                      )}
                    >
                      {isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={cn("truncate", isSkipped && "line-through text-muted-foreground")}>{s.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {s.subtitle}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}