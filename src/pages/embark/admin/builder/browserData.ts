export type LibraryContentItem = {
  id: string;
  title: string;
  type:
    | "Video"
    | "Document"
    | "SCORM"
    | "Article"
    | "Microlearning"
    | "Role-Play"
    | "Simulation"
    | "External Link";
  durationMin: number;
  topic: string;
  description: string;
  status: "Published" | "Draft";
};

export type LibraryAssessmentItem = {
  id: string;
  title: string;
  type: "Comprehension Check" | "Scored Assessment" | "Competency Assessment" | "Compliance Assessment";
  passMark: number;
  questions: number;
  topic: string;
  description: string;
};

export const CONTENT_TYPES = [
  "Video",
  "Document",
  "SCORM",
  "Article",
  "Microlearning",
  "Role-Play",
  "Simulation",
  "External Link",
] as const;

export const TOPICS = [
  "Objection Handling",
  "Product Knowledge",
  "Compliance",
  "Communication Skills",
  "Leadership",
  "Onboarding",
  "Customer Experience",
] as const;

export const ASSESSMENT_TYPES = [
  "Comprehension Check",
  "Scored Assessment",
  "Competency Assessment",
  "Compliance Assessment",
] as const;

// Ordered newest-first by index (index 0 = newest) for the "Newest first" sort.
export const CONTENT_LIBRARY_ITEMS: LibraryContentItem[] = [
  {
    id: "lib-1",
    title: "Objection Handling Fundamentals",
    type: "Video",
    durationMin: 12,
    topic: "Objection Handling",
    description: "Core frameworks for handling customer objections with structure and confidence.",
    status: "Published",
  },
  {
    id: "lib-2",
    title: "Aetna Plan Benefits — Product Deep Dive",
    type: "Document",
    durationMin: 25,
    topic: "Product Knowledge",
    description:
      "Comprehensive coverage of Aetna plan structures, costs, and key member benefits.",
    status: "Published",
  },
  {
    id: "lib-3",
    title: "Compliance Essentials — Regulated Advice Boundaries",
    type: "SCORM",
    durationMin: 20,
    topic: "Compliance",
    description: "Understanding regulated advice boundaries and how to operate within them.",
    status: "Published",
  },
  {
    id: "lib-4",
    title: "Active Listening in Customer Calls",
    type: "Video",
    durationMin: 8,
    topic: "Communication Skills",
    description: "Techniques for demonstrating active listening and building rapport with customers.",
    status: "Published",
  },
  {
    id: "lib-5",
    title: "New Hire Orientation Overview",
    type: "Article",
    durationMin: 5,
    topic: "Onboarding",
    description:
      "An introduction to the organisation, its values, and what to expect in your first 30 days.",
    status: "Published",
  },
  {
    id: "lib-6",
    title: "Handling Difficult Conversations",
    type: "Microlearning",
    durationMin: 7,
    topic: "Communication Skills",
    description: "Short, practical guidance for navigating challenging customer interactions.",
    status: "Draft",
  },
  {
    id: "lib-7",
    title: "Product Comparison Tool — How to Use",
    type: "Video",
    durationMin: 10,
    topic: "Product Knowledge",
    description: "A walkthrough of the internal product comparison tool for customer-facing staff.",
    status: "Published",
  },
  {
    id: "lib-8",
    title: "GDPR Essentials for Customer Services",
    type: "SCORM",
    durationMin: 30,
    topic: "Compliance",
    description: "Key data protection principles and how they apply to customer service roles.",
    status: "Published",
  },
  {
    id: "lib-9",
    title: "Questioning Techniques for Discovery Calls",
    type: "Article",
    durationMin: 6,
    topic: "Communication Skills",
    description: "How to use open and closed questions to uncover customer needs effectively.",
    status: "Draft",
  },
  {
    id: "lib-10",
    title: "Leadership Foundations",
    type: "Video",
    durationMin: 45,
    topic: "Leadership",
    description: "An introduction to leadership principles for new and aspiring team leaders.",
    status: "Published",
  },
  {
    id: "lib-11",
    title: "Customer Experience — Setting the Standard",
    type: "Microlearning",
    durationMin: 5,
    topic: "Customer Experience",
    description: "What excellent customer experience looks like and how to deliver it consistently.",
    status: "Published",
  },
  {
    id: "lib-12",
    title: "Advanced Objection Handling — Live Scenarios",
    type: "Role-Play",
    durationMin: 20,
    topic: "Objection Handling",
    description: "Practice advanced objection handling through simulated customer conversations.",
    status: "Draft",
  },
  {
    id: "lib-sim-1",
    title: "GPS - Pharmacy Benefits Part 1 - Zenarate Simulation",
    type: "Simulation",
    durationMin: 14,
    topic: "Product Knowledge",
    description:
      "Conversation simulation covering pharmacy benefit enquiries and member guidance.",
    status: "Published",
  },
  {
    id: "lib-sim-2",
    title: "Weight Loss Surgery Benefits - Zenarate Simulation",
    type: "Simulation",
    durationMin: 14,
    topic: "Product Knowledge",
    description: "Conversation simulation covering weight loss surgery benefit enquiries.",
    status: "Published",
  },
  {
    id: "lib-13",
    title: "Plan Options Explained — Member Communications",
    type: "Document",
    durationMin: 15,
    topic: "Product Knowledge",
    description: "How to clearly explain plan options and costs to members.",
    status: "Published",
  },
  {
    id: "lib-14",
    title: "FCA Compliance Refresher 2025",
    type: "SCORM",
    durationMin: 35,
    topic: "Compliance",
    description: "Annual compliance refresher covering FCA conduct rules and recent updates.",
    status: "Published",
  },
  {
    id: "lib-15",
    title: "Empathy in Service Recovery",
    type: "Video",
    durationMin: 9,
    topic: "Customer Experience",
    description: "How to use empathy when resolving complaints and service failures.",
    status: "Published",
  },
];

export const ASSESSMENT_LIBRARY_ITEMS: LibraryAssessmentItem[] = [
  {
    id: "asm-1",
    title: "Objection Handling — Knowledge Check",
    type: "Comprehension Check",
    passMark: 70,
    questions: 10,
    topic: "Objection Handling",
    description: "Tests understanding of core objection handling frameworks covered in the module.",
  },
  {
    id: "asm-2",
    title: "Aetna Plan Benefits — Product Assessment",
    type: "Scored Assessment",
    passMark: 80,
    questions: 20,
    topic: "Product Knowledge",
    description: "Assesses knowledge of Aetna plan types, eligibility, and costs.",
  },
  {
    id: "asm-3",
    title: "Compliance Assessment — Regulated Advice",
    type: "Compliance Assessment",
    passMark: 90,
    questions: 15,
    topic: "Compliance",
    description: "Formal compliance assessment on regulated advice boundaries — required annually.",
  },
  {
    id: "asm-4",
    title: "Communication Skills — Competency Check",
    type: "Competency Assessment",
    passMark: 75,
    questions: 12,
    topic: "Communication Skills",
    description:
      "Evaluates communication competencies including active listening and questioning technique.",
  },
  {
    id: "asm-5",
    title: "New Hire Orientation Quiz",
    type: "Comprehension Check",
    passMark: 70,
    questions: 8,
    topic: "Onboarding",
    description: "Short quiz to confirm understanding of orientation content before progressing.",
  },
  {
    id: "asm-6",
    title: "FCA Compliance — Annual Assessment",
    type: "Compliance Assessment",
    passMark: 90,
    questions: 25,
    topic: "Compliance",
    description: "Annual FCA compliance assessment — mandatory for all customer-facing staff.",
  },
  {
    id: "asm-7",
    title: "Customer Experience Standards — Check",
    type: "Comprehension Check",
    passMark: 70,
    questions: 10,
    topic: "Customer Experience",
    description: "Confirms understanding of customer experience standards and service expectations.",
  },
  {
    id: "asm-8",
    title: "Product Knowledge — End of Module Assessment",
    type: "Scored Assessment",
    passMark: 80,
    questions: 18,
    topic: "Product Knowledge",
    description: "Comprehensive end-of-module assessment covering all product knowledge topics.",
  },
];