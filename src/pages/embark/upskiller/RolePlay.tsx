import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RolePlayExperience } from "@/components/embark/roleplay/RolePlayExperience";
import type { RolePlayScenario } from "@/components/embark/roleplay/types";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { upskillerContent } from "@/data/upskillerContent";
import { useUpskillerProgress } from "@/hooks/use-upskiller-progress";

const ORDER = ["m1", "m2", "m3", "rp1"] as const;

const SCENARIO: RolePlayScenario = {
  scoringMode: "practice",
  inputMode: "choice",
  passThreshold: 70,
  maxAttempts: 3,
  attemptNumber: 1,
  scenarioId: "rp-upskiller-objections",
  personaName: "Marcus",
  personaDescription: "A skeptical Medicare prospect who has been researching plans online",
  situation:
    "Marcus has been comparing Medicare Advantage plans online and is skeptical that any plan will match the coverage he has today. He is polite but will push back on each point you make.",
  objective:
    "Handle each objection using acknowledge, clarify, respond, confirm — keeping plan explanations to two options at a time and staying inside the regulated advice boundary.",
  scenarioTitle: "Objection Handling Role-Play — Skeptical Prospect",
  openingLine:
    "I've been reading about these Medicare Advantage plans and honestly, I don't see how any of them beat what I already have. Convince me otherwise.",
  voiceSampleResponse:
    "That's a fair concern, and here's why it's worth comparing — specifically, your out-of-pocket maximum caps what you'd spend in a year.",
  feedback: {
    score: 74,
    confidence: "Medium",
    skills: [
      {
        name: "Objection Handling",
        confidence: "High",
        score: 82,
        evidence:
          "You acknowledged the prospect's scepticism before responding and confirmed resolution before moving on — the four-step framework from Module 1 was clearly applied.",
      },
      {
        name: "Product Knowledge",
        confidence: "Medium",
        score: 71,
        evidence:
          "Your explanation of the out-of-pocket maximum was accurate, but the premium and copay detail was less precise than the Module 2 content.",
      },
      {
        name: "Clarity of Explanation",
        confidence: "Medium",
        score: 68,
        evidence:
          "Three plans were introduced in one response. Comparing two plans at a time would have kept the explanation easier to follow.",
      },
      {
        name: "Compliance Boundaries",
        confidence: "High",
        score: 80,
        evidence:
          "When the prospect asked which plan he should pick, you presented options factually and offered to escalate rather than recommending.",
      },
    ],
    worked: [
      "You acknowledged each objection in the prospect's own words before responding.",
      "You stayed inside the regulated advice boundary when asked for a personal recommendation.",
      "You confirmed the objection was resolved before moving to the next point.",
    ],
    improve: [
      "Compare no more than two plans at a time — the prospect lost track when three were introduced together.",
      "Tighten your premium and copay detail so the numbers match the Module 2 content exactly.",
      "Close with a clear, specific next step rather than an open-ended offer to help.",
    ],
  },
};

export default function UpskillerRolePlay() {
  const navigate = useNavigate();
  const { markCompleted } = useUpskillerProgress();

  const steps: SessionStep[] = useMemo(
    () =>
      ORDER.map((id) => {
        const entry = upskillerContent[id];
        return {
          id,
          name: entry.title,
          subtitle: `${id === "rp1" ? "Role play" : entry.modality === "video" ? "Video" : "Article"} · ${entry.duration} min`,
          modality: id === "rp1" ? "role_play" : entry.modality,
          status: id === "rp1" ? "current" : "upcoming",
          onClick: () =>
            navigate(id === "rp1" ? "/upskiller/roleplay" : `/upskiller/session/${id}`),
        } satisfies SessionStep;
      }),
    [navigate],
  );

  const markComplete = () => {
    if (markCompleted("rp1")) {
      toast("Role-play complete — your journey has been updated.");
    }
  };

  return (
    <RolePlayExperience
      topHeader={null}
      scenario={SCENARIO}
      steps={steps}
      stepsMeta="Your upskilling journey"
      positionLabel={`Item ${ORDER.length} of ${ORDER.length}`}
      subtitleBase="Upskilling Journey · Role play"
      framingSubtitle="Upskilling Journey · Role play · ~20 min"
      onBack={() => navigate("/upskiller/dashboard")}
      framingPrev={{ label: "Previous", onClick: () => navigate("/upskiller/session/m3") }}
      onExit={() => navigate("/upskiller/dashboard")}
      onContinue={() => navigate("/upskiller/dashboard")}
      onComplete={markComplete}
    />
  );
}
