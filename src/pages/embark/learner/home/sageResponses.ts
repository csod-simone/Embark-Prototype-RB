const CONCEPT_UNCLEAR =
  "Try completing this section first. If you still need help or have a customer scenario you're unsure about, you can raise your hand at any time. Your trainer will receive your learning progress and conversation history so they can pick up where you left off.";

const MODULE_ASSIGNED =
  "Based on your onboarding journey and assessment results, this module was assigned to strengthen areas where additional practice will help prepare you for production.";

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const unclearPhrases = [
  "isn't clear",
  "is not clear",
  "not clear",
  "unclear",
  "don't understand",
  "do not understand",
  "dont understand",
  "didn't understand",
  "not understanding",
  "i'm confused",
  "im confused",
  "confused",
  "when should i raise",
  "raise a call",
  "raise my hand",
  "raise your hand",
  "raise a hand",
  "escalate",
  "makes no sense",
  "doesn't make sense",
];

const trainerCues = ["contact", "call", "talk", "speak", "need", "should", "reach out", "ask"];

const assignedPhrases = [
  "why am i doing this",
  "why do i have this",
  "why is this in my journey",
  "why did i get this",
  "why have i been assigned",
  "reason for this module",
  "reason for this course",
  "who assigned",
];

export function matchSageResponse(text: string): string | null {
  const t = normalise(text);
  if (!t) return null;

  if (unclearPhrases.some((p) => t.includes(p))) return CONCEPT_UNCLEAR;
  if (t.includes("trainer") && trainerCues.some((c) => t.includes(c))) return CONCEPT_UNCLEAR;

  if (assignedPhrases.some((p) => t.includes(p))) return MODULE_ASSIGNED;
  if (
    t.includes("assigned") &&
    ["this", "module", "course", "me", "who", "why"].some((c) => t.includes(c))
  ) {
    return MODULE_ASSIGNED;
  }

  return null;
}