export type LearnerQuestion = {
  id: string;
  sectionLabel: string;
  scenario?: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
};

/** Shared question set used outside the Rathbones Managing Clients checks. */
export const questions: LearnerQuestion[] = [
  {
    id: "q1",
    sectionLabel: "Portfolio construction",
    prompt: "What do you explain about portfolio construction at the start of the relationship?",
    options: [
      { id: "A", text: "That construction and suitability are the same conversation" },
      { id: "B", text: "The construction mandate, kept separate from client suitability" },
      { id: "C", text: "A product name before the objective is known" },
      { id: "D", text: "That every request is suitable once the client asks" },
    ],
    correctId: "B",
  },
  {
    id: "q2",
    sectionLabel: "Mandate priority",
    prompt: "A retired client also has a former employer's arrangement. Which is usually primary?",
    options: [
      { id: "A", text: "The former employer's arrangement" },
      { id: "B", text: "Investment Management" },
      { id: "C", text: "Whichever the client prefers that day" },
      { id: "D", text: "Both pay at the same time" },
    ],
    correctId: "B",
  },
  {
    id: "q3",
    sectionLabel: "Fee share",
    prompt: "After the annual risk budget is met, how is the fee share split?",
    options: [
      { id: "A", text: "The client pays 80% and Investment Management pays 20%" },
      { id: "B", text: "Investment Management pays 80% and the client pays 20%" },
      { id: "C", text: "Each side pays half" },
      { id: "D", text: "There is no fee share after the risk budget is met" },
    ],
    correctId: "B",
  },
  {
    id: "q4",
    sectionLabel: "Suitability determination",
    prompt: "What does a suitability determination let you explain?",
    options: [
      { id: "A", text: "Which colleague takes the next meeting" },
      { id: "B", text: "Whether the request sits in the mandate and how much will be paid" },
      { id: "C", text: "That the value will not fall" },
      { id: "D", text: "That the client must onboard again this year" },
    ],
    correctId: "B",
  },
  {
    id: "q5",
    sectionLabel: "Checking the mandate",
    prompt: "You are not sure a request is suitable. What should you do?",
    options: [
      { id: "A", text: "Quote a cost so the meeting can finish" },
      { id: "B", text: "Check the mandate before you quote a cost" },
      { id: "C", text: "Place the instruction and document it later" },
      { id: "D", text: "Ask the client to decide the pass mark" },
    ],
    correctId: "B",
  },
];

const knowledgeCheck1: LearnerQuestion[] = [
  {
    id: "k1-q1",
    sectionLabel: "Medicare basics",
    prompt: "What do you explain to a client about Portfolio Construction at the start of the relationship?",
    options: [
      { id: "A", text: "It replaces every other mandate the client holds" },
      { id: "B", text: "It is the client’s construction mandate, separate from Client Suitability, and it is where the annual risk budget and fee share apply" },
      { id: "C", text: "It is only a discretionary portfolio chosen by the investment committee" },
      { id: "D", text: "It is the mandate you quote from without checking the client’s records" },
    ],
    correctId: "B",
  },
  {
    id: "k1-q2",
    sectionLabel: "Medicare basics",
    prompt: "After the client’s annual risk budget is met, how is an approved Portfolio Construction amount shared?",
    options: [
      { id: "A", text: "Investment Management pays the full approved amount" },
      { id: "B", text: "Investment Management pays 80% and the client pays 20% fee share" },
      { id: "C", text: "The client pays the full approved amount" },
      { id: "D", text: "Investment Management and the client split the approved amount equally" },
    ],
    correctId: "B",
  },
  {
    id: "k1-q3",
    sectionLabel: "Benefits and coverage",
    prompt: "A retired client has Investment Management and a former employer’s arrangement. Which is usually primary?",
    options: [
      { id: "A", text: "The former employer’s arrangement" },
      { id: "B", text: "Investment Management" },
      { id: "C", text: "Whichever the client chooses during the conversation" },
      { id: "D", text: "Both pay at the same time" },
    ],
    correctId: "B",
  },
  {
    id: "k1-q4",
    sectionLabel: "Coverage determination",
    prompt: "What does a suitability determination let you explain to a client?",
    options: [
      { id: "A", text: "Whether the client can change investment manager" },
      { id: "B", text: "Whether the request sits in the client’s mandate and how much will be paid" },
      { id: "C", text: "Whether the client must onboard again this year" },
      { id: "D", text: "Which colleague takes the next meeting" },
    ],
    correctId: "B",
  },
  {
    id: "k1-q5",
    sectionLabel: "Coverage determination",
    prompt: "A client asks whether a request is suitable for their mandate and you are not sure. What should you do?",
    options: [
      { id: "A", text: "Guarantee it so the client can go ahead" },
      { id: "B", text: "Say you will check the mandate before you quote a cost" },
      { id: "C", text: "Tell them Investment Management approves every reasonable request" },
      { id: "D", text: "Ask them to choose which mandate should pay" },
    ],
    correctId: "B",
  },
];

const knowledgeCheck2: LearnerQuestion[] = [
  {
    id: "k2-q1",
    sectionLabel: "Objectives",
    prompt: "What do you confirm before you discuss a product or a portfolio change?",
    options: [
      { id: "A", text: "The fund the client saw in the news" },
      { id: "B", text: "The client's objectives and capacity for loss" },
      { id: "C", text: "How quickly the trade can be placed" },
      { id: "D", text: "Which colleague last spoke to the client" },
    ],
    correctId: "B",
  },
  {
    id: "k2-q2",
    sectionLabel: "Discovery order",
    prompt: "A new client names a goal. What do you ask next?",
    options: [
      { id: "A", text: "Which product they want to buy today" },
      { id: "B", text: "What the goal is for, when they need it, and what loss would be unacceptable" },
      { id: "C", text: "Whether markets were up yesterday" },
      { id: "D", text: "How large a gift they plan to make" },
    ],
    correctId: "B",
  },
  {
    id: "k2-q3",
    sectionLabel: "Capacity for loss",
    prompt: "Why does capacity for loss come before a recommendation?",
    options: [
      { id: "A", text: "So the meeting stays under ten minutes" },
      { id: "B", text: "So the recommendation matches what the client can bear to lose" },
      { id: "C", text: "So you can skip the file note" },
      { id: "D", text: "So the client can choose the product first" },
    ],
    correctId: "B",
  },
  {
    id: "k2-q4",
    sectionLabel: "Clarity",
    prompt: "The client does not follow a risk term you used. What do you do?",
    options: [
      { id: "A", text: "Repeat the same term more slowly" },
      { id: "B", text: "Restate the downside in everyday words and ask them to say it back" },
      { id: "C", text: "Move on to the product" },
      { id: "D", text: "End the meeting" },
    ],
    correctId: "B",
  },
  {
    id: "k2-q5",
    sectionLabel: "Close",
    prompt: "How do you close a discovery conversation?",
    options: [
      { id: "A", text: "Promise to be in touch at some point" },
      { id: "B", text: "Restate the objective and one dated next step" },
      { id: "C", text: "Place the trade while you are still on the call" },
      { id: "D", text: "Ask the client to email a product name" },
    ],
    correctId: "B",
  },
];

const knowledgeCheck3: LearnerQuestion[] = [
  {
    id: "k3-q1",
    sectionLabel: "Suitability Discipline",
    prompt: "A client under pressure asks you to move everything to cash on this call. What do you do?",
    options: [
      { id: "A", text: "Execute the instruction so they feel heard" },
      { id: "B", text: "Acknowledge the concern, then return to objectives and capacity for loss" },
      { id: "C", text: "Agree and document it afterwards" },
      { id: "D", text: "Offer a guaranteed return if they stay invested" },
    ],
    correctId: "B",
  },
  {
    id: "k3-q2",
    sectionLabel: "Suitability Discipline",
    prompt: "The client wants an instruction that sits outside the mandate. Who checks that before anything is carried out?",
    options: [
      { id: "A", text: "The client, after the instruction is placed" },
      { id: "B", text: "You, against the mandate, before you quote a cost or proceed" },
      { id: "C", text: "Whoever is free at the end of the day" },
      { id: "D", text: "No one, if the client is insistent" },
    ],
    correctId: "B",
  },
  {
    id: "k3-q3",
    sectionLabel: "Close & Record",
    prompt: "What belongs in the suitability file note?",
    options: [
      { id: "A", text: "Only the product name" },
      { id: "B", text: "Objectives, capacity for loss, the instruction asked for, what was agreed, and the follow-up date" },
      { id: "C", text: "A promise that the value will not fall" },
      { id: "D", text: "Nothing, if the client sounded calm" },
    ],
    correctId: "B",
  },
  {
    id: "k3-q4",
    sectionLabel: "Close & Record",
    prompt: "You are not proceeding with the instruction. What do you tell the client?",
    options: [
      { id: "A", text: "That the trade is underway" },
      { id: "B", text: "That the instruction is not being carried out, and the dated next step" },
      { id: "C", text: "That you will decide later without telling them" },
      { id: "D", text: "That suitability does not apply under pressure" },
    ],
    correctId: "B",
  },
  {
    id: "k3-q5",
    sectionLabel: "Empathy",
    prompt: "Which response acknowledges the client without agreeing to an unsuitable instruction?",
    options: [
      { id: "A", text: "So we'll sell everything today" },
      { id: "B", text: "I can hear how anxious this feels. Let's go back to what you need the money to do" },
      { id: "C", text: "Markets always recover, so there is nothing to discuss" },
      { id: "D", text: "I need a product name before we talk about your goals" },
    ],
    correctId: "B",
  },
];

const chapterGate: LearnerQuestion[] = [
  {
    id: "cg-q1",
    sectionLabel: "Client relationships",
    prompt: "Before you quote what a client will pay, what do you confirm?",
    options: [
      { id: "A", text: "Only the client's preferred product" },
      { id: "B", text: "Which part of the mandate applies and whether the annual risk budget has been met" },
      { id: "C", text: "That Medicare approves every request" },
      { id: "D", text: "That the client will not ask again" },
    ],
    correctId: "B",
  },
  {
    id: "cg-q2",
    sectionLabel: "Discovery",
    prompt: "A client wants a change today. What still has to happen first?",
    options: [
      { id: "A", text: "Place the instruction, then record the goal" },
      { id: "B", text: "Confirm objectives and capacity for loss" },
      { id: "C", text: "Skip the file note because they are in a hurry" },
      { id: "D", text: "Guarantee the outcome so they stay calm" },
    ],
    correctId: "B",
  },
  {
    id: "cg-q3",
    sectionLabel: "Suitability",
    prompt: "An instruction would be unsuitable. What is the right close?",
    options: [
      { id: "A", text: "Carry it out and mention the concern later" },
      { id: "B", text: "Refuse the instruction, explain why, and agree a dated follow-up" },
      { id: "C", text: "Let the client choose a different pass mark" },
      { id: "D", text: "Ask another client what they would do" },
    ],
    correctId: "B",
  },
  {
    id: "cg-q4",
    sectionLabel: "Documentation",
    prompt: "What makes the end of the meeting auditable?",
    options: [
      { id: "A", text: "An open-ended offer to talk again" },
      { id: "B", text: "A dated next step and a suitability file note of what was agreed" },
      { id: "C", text: "A verbal promise with nothing written down" },
      { id: "D", text: "The client's mood at the start of the call" },
    ],
    correctId: "B",
  },
  {
    id: "cg-q5",
    sectionLabel: "Readiness",
    prompt: "You are unsure whether a request is suitable. What do you say?",
    options: [
      { id: "A", text: "It is suitable" },
      { id: "B", text: "I will check the mandate rather than guess" },
      { id: "C", text: "The client should decide and we will follow" },
      { id: "D", text: "It has already been approved" },
    ],
    correctId: "B",
  },
];

const SETS: Record<string, LearnerQuestion[]> = {
  "mc-k1": knowledgeCheck1,
  "mc-k2": knowledgeCheck2,
  "mc-k3": knowledgeCheck3,
  "mc-ma": questions,
  "mc-cg": chapterGate,
};

export function questionsForItem(itemId: string | null): LearnerQuestion[] {
  if (itemId && SETS[itemId]) return SETS[itemId];
  return questions;
}
