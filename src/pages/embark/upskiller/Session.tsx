import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SessionShell } from "@/components/embark/SessionShell";
import { ModalitySwitcher } from "@/components/embark/ModalitySwitcher";
import { TextPane, VideoPane } from "@/components/embark/session/ModalityPanes";
import { ContentSections } from "@/components/embark/session/ContentSections";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { useLearnerPreferences } from "@/hooks/use-learner-preferences";
import { useUpskillerProgress } from "@/hooks/use-upskiller-progress";
import { upskillerContent } from "@/data/upskillerContent";
import {
  getAvailableModalities,
  MODALITY_LABEL,
  readRememberedModality,
  rememberModality,
  resolveDefaultModality,
  type Modality,
} from "@/lib/modality";

const ORDER = ["m1", "m2", "m3", "rp1"] as const;

export default function UpskillerSession() {
  const { sessionId = "" } = useParams();
  // Remount per item so progress, video and modality state reset like a fresh open.
  return <UpskillerSessionView key={sessionId} />;
}

function UpskillerSessionView() {
  const navigate = useNavigate();
  const { sessionId = "" } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();

  const content = upskillerContent[sessionId] ?? upskillerContent.m1;
  const { markStarted, markCompleted } = useUpskillerProgress();

  useEffect(() => {
    markStarted(content.id);
  }, [content.id, markStarted]);

  const available = useMemo(
    () => getAvailableModalities({ id: content.id, moduleId: content.id, modality: content.modality }),
    [content.id, content.modality],
  );
  const { prefs } = useLearnerPreferences();
  const [modality, setModality] = useState<Modality>(() =>
    resolveDefaultModality(
      available,
      prefs.preferredModality,
      readRememberedModality(content.id),
      content.modality === "video" ? "video" : "text",
    ),
  );

  const handleModalityChange = (m: Modality) => {
    if (m === modality) return;
    setModality(m);
    rememberModality(content.id, m);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const [videoDone, setVideoDone] = useState(false);
  const canContinue = modality === "video" ? videoDone : reached;

  const index = ORDER.indexOf(content.id as (typeof ORDER)[number]);
  const steps: SessionStep[] = useMemo(
    () =>
      ORDER.map((id) => {
        const entry = upskillerContent[id];
        return {
          id,
          name: entry.title,
          subtitle: `${entry.id === "rp1" ? "Role play" : entry.modality === "video" ? "Video" : "Article"} · ${entry.duration} min`,
          modality: entry.id === "rp1" ? "role_play" : entry.modality,
          status: id === content.id ? "current" : "upcoming",
          onClick: () =>
            navigate(id === "rp1" ? "/upskiller/roleplay" : `/upskiller/session/${id}`),
        } satisfies SessionStep;
      }),
    [content.id, navigate],
  );

  const progressPct = modality === "video" ? (videoDone ? 100 : 0) : scrollPct;

  return (
    <SessionShell
      topHeader={null}
      title={content.title}
      subtitle={`${content.moduleName} · ${MODALITY_LABEL[modality]} · ~${content.duration} min`}
      onBack={() => navigate("/upskiller/dashboard")}
      steps={steps}
      stepsMeta="Your upskilling journey"
      positionLabel={index >= 0 ? `Item ${index + 1} of ${ORDER.length}` : undefined}
      prev={null}
      next={{
        label: "Mark as complete",
        disabled: !canContinue,
        disabledReason:
          modality === "video"
            ? "Watch the video to the end to continue."
            : "Read to the end of the article to continue.",
        onClick: () => {
          const newlyCompleted = markCompleted(content.id);
          if (newlyCompleted && content.id === "m1") {
            toast("Journey updated — Objection Handling Role-Play is now available.");
          }
          const nextId = index >= 0 ? ORDER[index + 1] : undefined;
          if (nextId) {
            navigate(nextId === "rp1" ? "/upskiller/roleplay" : `/upskiller/session/${nextId}`);
          } else {
            navigate("/upskiller/dashboard");
          }
        },
      }}
      topSlot={
        available.length > 1 ? (
          <ModalitySwitcher available={available} value={modality} onChange={handleModalityChange} />
        ) : undefined
      }
    >
      <div className="h-1 w-full bg-muted flex-shrink-0">
        <div className="h-1 bg-primary transition-all" style={{ width: `${progressPct}%` }} />
      </div>
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
        {modality === "video" ? (
          <VideoPane
            title={content.title}
            duration={`${content.duration}:00`}
            meta={content.moduleName}
            takeaways={content.takeaways}
            onComplete={() => setVideoDone(true)}
          />
        ) : (
          <TextPane>
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <ContentSections intro={content.intro} sections={content.sections} />
          </TextPane>
        )}
      </div>
    </SessionShell>
  );
}
