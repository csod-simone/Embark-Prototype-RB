import type { ReviewContentEntry } from "@/data/reviewContent";

/**
 * Content registry for the upskiller journey. Each entry maps to one item on
 * the upskiller dashboard journey list and is rendered by the upskiller
 * content view window.
 */
export const upskillerContent: Record<string, ReviewContentEntry> = {
  m1: {
    id: "m1",
    title: "Objection Handling Fundamentals",
    moduleName: "Upskilling Journey · Module 1 of 3",
    programName: "My Journey",
    modality: "article",
    duration: 45,
    intro:
      "Core frameworks for handling customer objections with structure and confidence.",
    sections: [
      {
        heading: "Why objections happen",
        paragraphs: [
          "An objection is rarely a rejection. In most cases it signals that the customer needs more information, more reassurance, or more time before they feel comfortable moving forward.",
          "Treating an objection as a request for clarity — rather than as resistance — changes both the tone and the structure of your response.",
        ],
      },
      {
        heading: "A structured response framework",
        bullets: [
          "Acknowledge the concern in the customer's own words so they know they have been heard.",
          "Clarify with a question to confirm the real underlying issue.",
          "Respond with the specific fact, benefit, or example that addresses that issue.",
          "Confirm the objection has been resolved before moving on.",
        ],
        ordered: true,
      },
      {
        heading: "Common objections and confident responses",
        bullets: [
          '"This is too expensive" — reframe around total cost of care rather than premium alone.',
          '"I need to think about it" — surface the specific hesitation instead of ending the call.',
          '"I already have coverage" — compare like for like on the benefits that matter most to them.',
        ],
      },
    ],
    takeaways: [
      "Objections are requests for clarity, not rejections.",
      "Acknowledge, clarify, respond, confirm — in that order.",
      "Always confirm resolution before moving to the next point.",
    ],
  },

  m2: {
    id: "m2",
    title: "Medicare Advantage — Product Deep Dive",
    moduleName: "Upskilling Journey · Module 2 of 3",
    programName: "My Journey",
    modality: "video",
    duration: 30,
    intro:
      "Comprehensive coverage of Medicare Advantage plan structures, costs, and key selling points.",
    sections: [
      {
        heading: "How Medicare Advantage is structured",
        paragraphs: [
          "Medicare Advantage (Part C) plans are offered by private insurers approved by Medicare and bundle Part A and Part B coverage, usually with additional benefits such as prescription drug, dental, and vision cover.",
        ],
      },
      {
        heading: "Costs members ask about most",
        bullets: [
          "Monthly plan premium, which may be additional to the standard Part B premium.",
          "Deductibles, copays, and coinsurance for in-network and out-of-network care.",
          "The annual out-of-pocket maximum, which caps a member's yearly spend.",
        ],
      },
      {
        heading: "Explaining plan options clearly",
        paragraphs: [
          "Customers rate responses on plan options as unclear when several plans are described at once. Compare two plans at a time on the two or three dimensions that matter most to that member.",
        ],
      },
    ],
    takeaways: [
      "Part C bundles Part A and Part B, usually with extra benefits.",
      "The out-of-pocket maximum is the number most members care about.",
      "Compare two plans at a time to keep explanations clear.",
    ],
  },

  m3: {
    id: "m3",
    title: "Compliance Essentials — Regulated Advice Boundaries",
    moduleName: "Upskilling Journey · Module 3 of 3",
    programName: "My Journey",
    modality: "article",
    duration: 20,
    intro:
      "Understanding where the compliance boundary sits and how to stay within it during customer interactions.",
    sections: [
      {
        heading: "Information versus advice",
        paragraphs: [
          "You can explain how a plan works, what it covers, and what it costs. You cannot recommend which plan a specific member should choose based on their personal circumstances unless you are licensed to do so.",
        ],
      },
      {
        heading: "Staying inside the boundary",
        bullets: [
          "Present options factually and let the member make the decision.",
          "Avoid comparative language that implies a recommendation.",
          "Document what was discussed, using the approved call notes structure.",
          "Escalate to a licensed advisor whenever a member asks what they should do.",
        ],
      },
      {
        heading: "What to do when unsure",
        paragraphs: [
          "If you are not certain whether a response crosses the boundary, pause and use the approved holding language, then check with a supervisor before continuing.",
        ],
      },
    ],
    takeaways: [
      "Explain, don't recommend.",
      "Escalate any request for a personal recommendation.",
      "Document every regulated conversation.",
    ],
  },

  rp1: {
    id: "rp1",
    title: "Objection Handling Role-Play — Skeptical Prospect",
    moduleName: "Upskilling Journey · Role-play practice",
    programName: "My Journey",
    modality: "article",
    duration: 20,
    intro:
      "Practice handling objections in a simulated conversation with a skeptical Medicare prospect.",
    sections: [
      {
        heading: "Scenario brief",
        paragraphs: [
          "You are speaking with a prospect who has been researching Medicare Advantage plans online and is skeptical that any plan will match the coverage they have today. They are polite but sceptical and will push back on each point.",
        ],
      },
      {
        heading: "What you are practising",
        bullets: [
          "Applying the acknowledge, clarify, respond, confirm framework from Module 1.",
          "Keeping plan explanations to two options at a time.",
          "Staying inside the regulated advice boundary throughout.",
        ],
      },
      {
        heading: "How you are assessed",
        paragraphs: [
          "Your response structure, clarity, and compliance are scored. Strong performance may unlock advanced content in your journey; weaker performance may add targeted practice.",
        ],
      },
    ],
    takeaways: [
      "Use the four-step objection framework on every push-back.",
      "Compare no more than two plans at a time.",
      "Never cross into personal recommendations.",
    ],
  },
};

export function getUpskillerContent(id: string): ReviewContentEntry | undefined {
  return upskillerContent[id];
}
