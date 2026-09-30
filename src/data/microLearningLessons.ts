export type MicroLesson = {
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  remember: string;
};

/**
 * Short lessons for gap micro-learning. Knowledge-check topics use the same
 * source wording as the assessment so the organisation term swap stays aligned
 * with the questions the learner will retake.
 */
export const MICRO_LESSONS: Record<string, MicroLesson> = {
  "Medicare basics": {
    intro:
      "Before you quote a cost, confirm the construction mandate and whether the annual risk budget has already been met. Construction is separate from the suitability conversation.",
    sections: [
      {
        heading: "Construction and suitability",
        paragraphs: [
          "At the start of the relationship you explain how the portfolio will be constructed. That mandate is not the same as deciding whether a later request is suitable.",
          "If you are unsure a request sits in the mandate, check it before you quote a cost.",
        ],
      },
      {
        heading: "Fee share",
        paragraphs: [
          "Once the annual risk budget has been met, Investment Management pays 80% and the client pays 20%.",
        ],
        bullets: [
          "Do not quote a cost from memory.",
          "A retired client with a former employer's arrangement is usually covered first by Investment Management.",
        ],
      },
    ],
    remember: "Check the mandate and the risk budget before you quote what the client will pay.",
  },
  "Portfolio construction": {
    intro: "Construction is the mandate you agree at the start. Suitability is whether a later request sits inside it.",
    sections: [
      {
        heading: "Keep the two conversations apart",
        paragraphs: [
          "Explain the construction mandate before you take a request. Do not treat a product name as a substitute for that mandate.",
        ],
      },
    ],
    remember: "State the construction mandate, then test the request against it.",
  },
  "Mandate priority": {
    intro: "Know which arrangement pays first before you describe a cost.",
    sections: [
      {
        heading: "A retired client",
        paragraphs: [
          "When a retired client also has a former employer's arrangement, Investment Management is usually primary.",
        ],
      },
    ],
    remember: "Confirm which arrangement is primary before you quote a cost.",
  },
  "Fee share": {
    intro: "The fee share applies after the annual risk budget has been met.",
    sections: [
      {
        heading: "The split",
        paragraphs: ["Investment Management pays 80%. The client pays 20%."],
      },
    ],
    remember: "80% Investment Management, 20% client, after the risk budget is met.",
  },
  "Suitability determination": {
    intro: "A suitability determination says whether the request sits in the mandate and how much will be paid.",
    sections: [
      {
        heading: "What you can explain",
        paragraphs: [
          "You can explain the fit with the mandate and the cost. You cannot promise that the value will not fall.",
        ],
      },
    ],
    remember: "Fit and cost, not a guaranteed outcome.",
  },
  "Checking the mandate": {
    intro: "If you are not sure a request is suitable, you check. You do not guess.",
    sections: [
      {
        heading: "Before a cost",
        paragraphs: ["Check the mandate before you quote a cost or carry out an instruction."],
      },
    ],
    remember: "No quote until the mandate has been checked.",
  },
  Empathy: {
    intro:
      "A client who is anxious needs to feel heard before they can hear a recommendation. Empathy is how you do that without agreeing to an unsuitable instruction.",
    sections: [
      {
        heading: "Acknowledge, then return to the brief",
        paragraphs: [
          "Name what the client is feeling in plain language: unsettled markets, worry about retirement, pressure to act today. One clear acknowledgement is enough. Do not rush past it, and do not treat it as a reason to skip the suitability steps.",
          "Empathy is not agreement. You can say you understand why they want to move to cash, then return to objectives and capacity for loss before any product discussion.",
        ],
      },
      {
        heading: "Phrases that hold the line",
        paragraphs: [
          "“I can hear how anxious this feels” keeps trust. “So we’ll sell everything today” gives it away. After the acknowledgement, the next sentence should bring the conversation back to what the client needs the money to do.",
        ],
        bullets: [
          "Acknowledge the emotion in the client’s own terms.",
          "Do not agree to an instruction you have not tested for suitability.",
          "Move back to objectives once the client knows you heard them.",
        ],
      },
    ],
    remember: "Acknowledge the emotion, then return to objectives. Do not agree to an unsuitable instruction.",
  },
  "Suitability Discipline": {
    intro:
      "Suitability starts with the client’s objectives and capacity for loss. Products come after that, not before.",
    sections: [
      {
        heading: "The order that protects the client",
        paragraphs: [
          "Confirm what the client is trying to achieve, how long the money can stay invested, and how much loss they can bear. Only then talk about a portfolio change.",
          "A request to move fully to cash, or to switch everything into gilts, is a prompt to revisit those facts. It is not an instruction you execute on the call.",
        ],
      },
      {
        heading: "What to refuse, and how",
        paragraphs: [
          "You may not execute a full-cash instruction without a suitability review. Say what you will not do, and say what you will do next: confirm objectives, record the discussion, and agree a dated follow-up.",
        ],
        bullets: [
          "Objectives and capacity for loss before products.",
          "No full-cash or all-gilt switch without a suitability review.",
          "Document the advice and the reason you did not proceed.",
        ],
      },
    ],
    remember: "Confirm objectives and capacity for loss before products. Do not execute an unsuitable instruction on the call.",
  },
  Clarity: {
    intro:
      "A correct explanation that the client cannot follow is not a clear one. Risk has to be said in everyday language.",
    sections: [
      {
        heading: "Plain language for risk",
        paragraphs: [
          "Replace jargon with the outcome the client will recognise. “Volatility” becomes “the value can fall, sometimes sharply, and it may take time to recover.” “Drawdown” becomes “how far the portfolio can fall from its high.”",
          "One jargon phrase is enough to lose someone who is already anxious. If you hear yourself use a technical term, restate it in the next sentence.",
        ],
      },
      {
        heading: "Check they can use it",
        paragraphs: [
          "Ask the client to say back what they understood about the downside. If they repeat the jargon, they have not yet got the meaning. Explain it once more, shorter.",
        ],
        bullets: [
          "Say what can happen to the money, not the name of the risk measure.",
          "Restate any technical word immediately.",
          "Ask the client to play back the downside in their own words.",
        ],
      },
    ],
    remember: "Explain downside in everyday words, then check the client can say it back.",
  },
  "Close & Record": {
    intro:
      "The close of a suitability conversation is a recorded next step, not a vague promise to be in touch.",
    sections: [
      {
        heading: "Close with a dated next step",
        paragraphs: [
          "Say what will happen, who will do it, and when. “I’ll send a summary and we’ll speak again on Thursday” is a close. “Let’s see how you feel” is not.",
          "If you are not proceeding with the instruction, say that explicitly so the client does not leave thinking the trade is underway.",
        ],
      },
      {
        heading: "What goes in the file note",
        paragraphs: [
          "The suitability file note should record the client’s objectives, their capacity for loss, the instruction they asked for, what you agreed, and the follow-up date. Say that you are recording it, so the client knows the conversation is part of the file.",
        ],
        bullets: [
          "Name the next step and the date.",
          "State what will be written in the suitability file note.",
          "Confirm whether any instruction is, or is not, being carried out.",
        ],
      },
    ],
    remember: "End with a dated next step and say what will be recorded in the suitability file note.",
  },
  Rapport: {
    intro: "Rapport is the opening that lets a discovery conversation happen. It is short, specific, and then it hands over to questions.",
    sections: [
      {
        heading: "Open on their terms",
        paragraphs: [
          "Use the client’s name and one fact you already know about why they are here. A generic greeting does less than a sentence that shows you prepared.",
          "Keep the opening brief. Rapport that turns into small talk delays the objectives you still have to confirm.",
        ],
      },
    ],
    remember: "Open with something specific to this client, then move into discovery.",
  },
  "Discovery depth": {
    intro: "A useful discovery finds objectives, timescale, and capacity for loss. A list of products the client has heard of is not enough.",
    sections: [
      {
        heading: "Go one question further",
        paragraphs: [
          "When a client names a goal, ask what it is for, when they need it, and what would make the outcome unacceptable. Those three answers are what a later recommendation has to satisfy.",
        ],
      },
    ],
    remember: "Ask what the goal is for, when it is needed, and what loss would be unacceptable.",
  },
  Pacing: {
    intro: "Pacing is letting the client finish, and not jumping to a product while they are still explaining what they need.",
    sections: [
      {
        heading: "Match their speed",
        paragraphs: [
          "If the client is working through a concern, stay with it until you can summarise it. Introducing a fund or a switch in the middle of that explanation forces them to restart.",
        ],
      },
    ],
    remember: "Finish the client’s point, summarise it, and only then move on.",
  },
  Close: {
    intro: "A practice conversation still needs a close: what you agreed, and what happens next.",
    sections: [
      {
        heading: "Leave one clear action",
        paragraphs: [
          "Restate the objective you heard and the single next step. If nothing will be executed today, say so.",
        ],
      },
    ],
    remember: "Restate the objective and one next step before you end the conversation.",
  },
  "Active Listening": {
    intro: "Active listening is proving you heard the client, using their words, before you add your own.",
    sections: [
      {
        heading: "Reflect, then ask",
        paragraphs: [
          "Repeat the concern in a short phrase and check it: “You want the portfolio to fund a house purchase in three years — is that the part that matters most?” Then ask the next question. Do not replace their point with a product feature.",
        ],
      },
    ],
    remember: "Reflect the client’s point in their words and confirm it before you continue.",
  },
  "Objection Handling": {
    intro: "An objection is new information about what the client will not accept. Handle it before you repeat the recommendation.",
    sections: [
      {
        heading: "Deal with the concern itself",
        paragraphs: [
          "Name the objection, answer that point, and check whether it is resolved. A second explanation of the same product, without touching the objection, tells the client you did not hear them.",
        ],
      },
    ],
    remember: "Answer the objection they raised, then check whether that concern is resolved.",
  },
  "Product Knowledge": {
    intro: "Product knowledge in this conversation is knowing what the mandate can and cannot do, and saying that accurately.",
    sections: [
      {
        heading: "Stay inside the mandate",
        paragraphs: [
          "Describe the instrument or service in terms of risk, access to the money, and cost. If you are not sure of a feature, say you will confirm it. Do not fill the gap with a feature from a different mandate.",
        ],
      },
    ],
    remember: "Describe risk, access, and cost accurately. Confirm anything you are not sure of.",
  },
  "Compliance Boundaries": {
    intro: "Some requests sit outside what you are authorised to do on this call. The boundary has to be said out loud.",
    sections: [
      {
        heading: "Say what you cannot do",
        paragraphs: [
          "Do not give personalised investment advice beyond your permissions, and do not guarantee returns. If the client presses for an unsuitable instruction, explain the limit and escalate rather than improvising a way through.",
        ],
      },
    ],
    remember: "State the limit, do not guarantee an outcome, and escalate an unsuitable instruction.",
  },
};

export function lessonForTopic(topic: string): MicroLesson {
  return (
    MICRO_LESSONS[topic] ?? {
      intro: `This short lesson covers ${topic}, the gap from your latest result.`,
      sections: [
        {
          heading: topic,
          paragraphs: [
            `Work through the points below. They are the parts of ${topic} that your latest result showed still need practice. When you finish, you will take the knowledge check again.`,
          ],
        },
      ],
      remember: `Be able to explain ${topic} in your own words before you retake the knowledge check.`,
    }
  );
}
