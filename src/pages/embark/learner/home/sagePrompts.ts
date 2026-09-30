import {
  LEARNER_PROGRESS,
  articleLabel,
  assessmentLabel,
  moduleLabel,
  sessionLabel,
  type SageContext,
} from "./sageContext";

export const RAISE_A_HAND_LABEL = "Raise a Hand";

export type SagePromptDef = {
  id: string;
  label: string;
  /** Contextual answer. Undefined for the raise-a-hand prompt. */
  response?: string;
  isRaiseHand?: boolean;
};

const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

const take = (items: string[] | undefined, n: number, fallback: string[]) =>
  (items && items.length ? items : fallback).slice(0, n);

const GENERIC_POINTS = [
  "The core concepts introduced in this content",
  "How the concepts apply in a real member conversation",
  "The steps to follow before giving a member an answer",
];

function articlePrompts(c: SageContext): SagePromptDef[] {
  const title = articleLabel(c);
  const module = moduleLabel(c);
  const points = take(c.topics, 4, GENERIC_POINTS);
  return [
    {
      id: "a-summary",
      label: "Summarise this article for me",
      response:
        `Here's a summary of ${title}: this piece sits within ${module} and walks through the ` +
        `essentials you'll use on live calls. It explains the underlying rules, then shows how they ` +
        `change what you tell a member. The worked examples highlight the details that are easy to ` +
        `get wrong. By the end you should be able to apply it confidently without checking with a ` +
        `colleague first.`,
    },
    {
      id: "a-keypoints",
      label: `What are the key points from ${title}?`,
      response: `Here are the key points from ${title}:\n${bullets(points)}`,
    },
    {
      id: "a-help",
      label: "I don't understand something in this article — can you help?",
      response:
        `Of course — I'm here to help! What part of ${title} would you like me to clarify? ` +
        `Feel free to quote the part you're unsure about or describe it in your own words.`,
    },
    {
      id: "a-relate",
      label: "How does this relate to what I've already learned?",
      response:
        `Great question! ${title} builds on ${c.priorTopic ?? `the earlier content in ${module}`}. ` +
        `Here's how they connect:\n` +
        bullets([
          `The earlier material gave you the vocabulary; ${title} shows you how to apply it.`,
          `Both feed the same goal in ${module} — giving members accurate answers first time.`,
          `What you learn here is assessed alongside the earlier sessions in this module.`,
        ]),
    },
    {
      id: "a-focus",
      label: "What should I focus on before moving on?",
      response:
        `Before moving on from ${title}, make sure you're comfortable with:\n` +
        bullets(take(c.topics, 3, GENERIC_POINTS)),
    },
  ];
}

function assessmentPrompts(c: SageContext): SagePromptDef[] {
  const name = assessmentLabel(c);
  const topics = take(c.topics, 5, GENERIC_POINTS);
  return [
    {
      id: "b-topics",
      label: "What topics does this assessment cover?",
      response: `This assessment — ${name} — covers the following topics:\n${bullets(topics)}`,
    },
    {
      id: "b-approach",
      label: "How should I approach this assessment?",
      response:
        `Here are a few tips for approaching ${name}:\n` +
        bullets([
          "Read each question fully before looking at the options.",
          `Draw on the content from the sessions in ${moduleLabel(c)} — the questions map to them.`,
          "Take your time; there's no bonus for finishing quickly.",
          "If a question feels unclear, move on and come back to it.",
        ]),
    },
    {
      id: "b-prepare",
      label: "I'm feeling unsure — can you help me prepare?",
      response:
        `It's completely normal to feel that way before an assessment! Let's make sure you feel ready. ` +
        `The key things to brush up on for ${name} are:\n${bullets(topics)}`,
    },
    {
      id: "b-fail",
      label: "What happens if I don't pass?",
      response:
        "Don't worry — not passing first time isn't the end of the road. Your trainer will be able to " +
        "review your results and discuss next steps with you. The goal is to make sure you feel fully " +
        "confident, so there's support available if you need it.",
    },
  ];
}

function overviewPrompts(c: SageContext): SagePromptDef[] {
  const module = moduleLabel(c);
  const session = sessionLabel(c);
  const outcomes = take(c.topics, 5, GENERIC_POINTS);
  const prereqs = c.prerequisites ?? [];
  return [
    {
      id: "c-learn",
      label: "What will I learn in this module?",
      response: `In ${module}, you'll cover:\n${bullets(outcomes)}`,
    },
    {
      id: "c-duration",
      label: "How long will this take to complete?",
      response:
        `Based on the content in this module, most learners complete ${module} in approximately ` +
        `${c.moduleHours ?? "3"} hours. Your pace may vary — take the time you need to feel confident ` +
        `with the material.`,
    },
    {
      id: "c-approach",
      label: `What's the best way to work through ${session}?`,
      response:
        `For the best experience with ${session}, I'd recommend:\n` +
        bullets([
          "Work through the content in order — each part builds on the last.",
          "Make short notes on the key concepts as you go.",
          "Use me to clarify anything you're unsure about before you move on.",
        ]),
    },
    {
      id: "c-overview",
      label: `Can you give me an overview of ${module}?`,
      response:
        `${module} gives you the practical grounding you need for live member conversations. It moves ` +
        `from the underlying rules to how those rules change what you say and do on a call, then gives ` +
        `you a chance to practise. It matters because most member questions in this area come down to ` +
        `getting these details right first time.`,
    },
    {
      id: "c-prereq",
      label: "What do I need to complete before this session?",
      response: prereqs.length
        ? `Before diving into ${session}, it's helpful to have completed:\n${bullets(prereqs)}`
        : `There are no specific prerequisites for ${session} — you're good to go! If you'd like a quick ` +
          `recap of anything from earlier sessions, just ask.`,
    },
  ];
}

function dashboardPrompts(): SagePromptDef[] {
  const p = LEARNER_PROGRESS;
  return [
    {
      id: "d-today",
      label: "What should I focus on today?",
      response:
        `Based on where you are in your training, I'd suggest focusing on:\n` +
        bullets([
          p.nextItem,
          "Part B deductibles with secondary insurance — you flagged this as unclear",
          "A quick recap of Coverage Determination before your module assessment",
        ]),
    },
    {
      id: "d-leftoff",
      label: "Where did I leave off?",
      response:
        `Last time, you were working on ${p.recentItem}. You can pick up right where you left off from ` +
        `your dashboard.`,
    },
    {
      id: "d-upcoming",
      label: "What's coming up soon in my training?",
      response: `Coming up in your training:\n${bullets(p.upcoming)}`,
    },
    {
      id: "d-progress",
      label: "How am I progressing overall?",
      response: `You're making great progress! Here's a quick snapshot:\n${bullets(p.highlights)}`,
    },
    {
      id: "d-prepare",
      label: "Can you help me prepare for my next session?",
      response:
        `Absolutely! Your next session is ${p.nextItem}. Here's what to expect and how to prepare:\n` +
        bullets([
          "It's a short role play — you'll answer a member's benefits question live.",
          "Re-read your notes on coordination of benefits before you start.",
          "Have the coverage determination steps clear in your head so you can talk them through.",
        ]),
    },
  ];
}

export function buildSagePrompts(context: SageContext): SagePromptDef[] {
  let base: SagePromptDef[];
  switch (context.kind) {
    case "article":
      base = articlePrompts(context);
      break;
    case "assessment":
      base = assessmentPrompts(context);
      break;
    case "overview":
      base = overviewPrompts(context);
      break;
    default:
      base = dashboardPrompts();
  }
  return [...base, { id: "raise-hand", label: RAISE_A_HAND_LABEL, isRaiseHand: true }];
}
