import type { SessionStep } from "../SessionStepsSidebar";
import type { Mod3Progress } from "@/hooks/use-module3-progress";

type CurrentId = "s-article" | "s-video" | "s-assessment" | "s3" | (string & {});

function statusFor(currentId: CurrentId, id: CurrentId, done: boolean, unlocked: boolean): SessionStep["status"] {
  if (id === currentId) return "current";
  if (done) return "completed";
  if (!unlocked) return "locked";
  return "upcoming";
}

export function buildMod3SessionSteps(
  currentId: CurrentId,
  progress: Mod3Progress,
  navigate: (path: string) => void,
): SessionStep[] {
  return [
    {
      id: "s-article",
      name: "Coverage Determination",
      subtitle: "Article · 8 min",
      modality: "article",
      status: statusFor(currentId, "s-article", progress.articleDone, true),
      onClick: () => navigate("/learner/session/s-article"),
    },
    {
      id: "s-video",
      name: "Medicare Plan Types",
      subtitle: "Video · 6 min",
      modality: "video",
      status: statusFor(currentId, "s-video", progress.videoDone, progress.articleDone),
      onClick: () => navigate("/learner/session/s-video"),
    },
    {
      id: "s-assessment",
      name: "Module Assessment",
      subtitle: "Assessment · 10 min",
      modality: "assessment",
      status: statusFor(currentId, "s-assessment", progress.assessmentPassed, progress.videoDone),
      onClick: () => navigate("/learner/assessment/mod3"),
    },
    {
      id: "s3",
      name: "Benefits Lookup Practice",
      subtitle: "Role play · 14 min",
      modality: "role_play",
      status: statusFor(currentId, "s3", progress.rolePlayDone, progress.assessmentPassed),
      onClick: () => navigate("/learner/role-play/s3"),
    },
  ];
}

export function buildMod4SessionSteps(
  currentId: CurrentId,
  navigate: (path: string) => void,
): SessionStep[] {
  return [
    {
      id: "mod4-s1",
      name: "Introduction to Claims Processing",
      subtitle: "Article · 7 min",
      modality: "article",
      status: currentId === "mod4-s1" ? "current" : "upcoming",
      onClick: () => navigate("/learner/session/mod4-s1"),
    },
    {
      id: "mod4-s2",
      name: "Explanation of Benefits (EOB)",
      subtitle: "Article · 9 min",
      modality: "article",
      status: "locked",
    },
    {
      id: "mod4-s3",
      name: "Denials and Appeals",
      subtitle: "Article · 10 min",
      modality: "article",
      status: "locked",
    },
    {
      id: "mod4-s4",
      name: "Claims Practice",
      subtitle: "Role play · 12 min",
      modality: "role_play",
      status: "locked",
    },
  ];
}