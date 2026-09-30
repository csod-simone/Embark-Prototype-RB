export const EXPERIENCE_TYPES = [
  {
    value: "conversation",
    label: "Conversation",
    description: "An open-ended dialogue between the learner and an AI character.",
  },
  {
    value: "persuasion",
    label: "Persuasion",
    description: "The learner must influence, negotiate, or change the AI character's position.",
  },
  {
    value: "information",
    label: "Information Gathering",
    description: "The learner asks questions to uncover information from the AI character.",
  },
  {
    value: "service",
    label: "Service",
    description: "The learner provides support, guidance, or assistance to the AI character.",
  },
] as const;
