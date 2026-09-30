import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play, Pause } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

/** Text/article presentation — renders the item's existing article body. */
export function TextPane({ children }: { children: ReactNode }) {
  return (
    <PageContainer
      as="article"
      className="pt-8 pb-32 space-y-6 text-[15px] leading-relaxed text-foreground"
    >
      {children}
    </PageContainer>
  );
}

type Phase = "idle" | "playing" | "paused" | "done";

/**
 * Video presentation — the same placeholder player already used by the
 * learner video session (dark 16:9 panel, play/pause, playhead, takeaways).
 */
export function VideoPane({
  title,
  duration,
  meta,
  takeaways,
  header,
  onComplete,
}: {
  title: string;
  duration: string;
  meta?: string;
  takeaways?: string[];
  header?: ReactNode;
  /** Fired once the playhead passes 90% so callers can unlock navigation. */
  onComplete?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const skipTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!completedRef.current && progress >= 90) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [progress, onComplete]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 100 / 60);
        if (next >= 100) {
          window.clearInterval(id);
          setPhase("done");
          return 100;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && skipTimerRef.current === null) {
      skipTimerRef.current = window.setTimeout(() => setShowSkip(true), 4000);
    }
    return () => {
      if (skipTimerRef.current) window.clearTimeout(skipTimerRef.current);
    };
  }, [phase]);

  const togglePlay = () => {
    if (phase === "idle" || phase === "paused") setPhase("playing");
    else if (phase === "playing") setPhase("paused");
  };

  return (
    <PageContainer as="div" className="pt-6 pb-32 space-y-4">
      {header}
      <div className="relative">
        <div className="relative rounded-lg overflow-hidden bg-foreground aspect-video flex items-center justify-center">
          <div className="text-center space-y-2 px-6">
            <div className="text-background font-semibold text-lg">{title} — Training Video</div>
            <div className="text-background/70 text-xs">Duration: {duration}</div>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={phase === "playing" ? "Pause" : "Play"}
            className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-background/90 hover:bg-background text-foreground inline-flex items-center justify-center shadow-lg"
          >
            {phase === "playing" ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </button>
          {showSkip && phase !== "done" && (
            <button
              type="button"
              onClick={() => {
                setProgress(100);
                setPhase("done");
              }}
              className="absolute bottom-3 right-3 text-xs text-background/80 hover:text-background underline"
            >
              Skip to end
            </button>
          )}
        </div>
        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
          <div className="h-1 bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {meta && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{meta}</span>
          <span>·</span>
          <span>{duration}</span>
          <span>·</span>
          <span>Video</span>
        </div>
      )}

      {takeaways && takeaways.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-3">
            Key takeaways
          </div>
          <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
            {takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}