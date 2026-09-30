export const SKILL_CATEGORIES = [
  "Sales",
  "Communication",
  "Compliance",
  "Product Knowledge",
  "Leadership",
  "Customer Experience",
  "Technical",
  "Onboarding",
  "Coaching & Development",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SUBCATEGORIES_BY_CATEGORY: Record<SkillCategory, string[]> = {
  Sales: ["Objection Handling", "Negotiation", "Discovery", "Closing", "Pipeline Management"],
  Communication: ["Verbal", "Written", "Active Listening", "Questioning Techniques", "Non-verbal"],
  Compliance: [
    "Regulatory Awareness",
    "Data Protection",
    "Conduct Rules",
    "Risk Management",
    "Financial Crime",
  ],
  "Product Knowledge": ["Plan Types", "Eligibility", "Benefits", "Pricing & Costs", "Enrolment"],
  Leadership: [
    "Team Management",
    "Coaching",
    "Performance Management",
    "Delegation",
    "Decision Making",
  ],
  "Customer Experience": [
    "Service Recovery",
    "Empathy",
    "Complaint Handling",
    "Customer Effort",
    "NPS",
  ],
  Technical: ["Systems & Tools", "Data Entry", "Reporting", "CRM", "Digital Literacy"],
  Onboarding: [
    "Company Orientation",
    "Role Clarity",
    "Process Knowledge",
    "Systems Access",
    "Culture & Values",
  ],
  "Coaching & Development": [
    "Feedback",
    "Goal Setting",
    "Self-Awareness",
    "Growth Mindset",
    "Mentoring",
  ],
};

export const SKILL_LEVELS = ["Foundational", "Intermediate", "Advanced", "Expert"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export type LibrarySkill = {
  name: string;
  category: SkillCategory;
  subcategory: string;
  level: SkillLevel;
};

export const TOTAL_SKILL_COUNT = 10247;

export const SKILL_LIBRARY: LibrarySkill[] = [
  { name: "Objection Handling", category: "Sales", subcategory: "Objection Handling", level: "Intermediate" },
  { name: "Discovery Questioning", category: "Sales", subcategory: "Discovery", level: "Intermediate" },
  { name: "Negotiation Fundamentals", category: "Sales", subcategory: "Negotiation", level: "Foundational" },
  { name: "Pipeline Management", category: "Sales", subcategory: "Pipeline Management", level: "Advanced" },
  { name: "Closing Techniques", category: "Sales", subcategory: "Closing", level: "Advanced" },
  { name: "Value-Based Selling", category: "Sales", subcategory: "Closing", level: "Expert" },
  { name: "Upselling & Cross-Selling", category: "Sales", subcategory: "Closing", level: "Intermediate" },
  { name: "Sales Call Structure", category: "Sales", subcategory: "Discovery", level: "Foundational" },
  { name: "Active Listening", category: "Communication", subcategory: "Active Listening", level: "Intermediate" },
  { name: "Verbal Communication", category: "Communication", subcategory: "Verbal", level: "Foundational" },
  { name: "Written Communication", category: "Communication", subcategory: "Written", level: "Foundational" },
  { name: "Questioning Techniques", category: "Communication", subcategory: "Questioning Techniques", level: "Intermediate" },
  { name: "Stakeholder Communication", category: "Communication", subcategory: "Verbal", level: "Advanced" },
  { name: "Presentation Skills", category: "Communication", subcategory: "Verbal", level: "Advanced" },
  { name: "Email Etiquette", category: "Communication", subcategory: "Written", level: "Foundational" },
  { name: "Regulatory Awareness", category: "Compliance", subcategory: "Regulatory Awareness", level: "Foundational" },
  { name: "Data Protection — GDPR", category: "Compliance", subcategory: "Data Protection", level: "Intermediate" },
  { name: "FCA Conduct Rules", category: "Compliance", subcategory: "Conduct Rules", level: "Intermediate" },
  { name: "Anti-Money Laundering", category: "Compliance", subcategory: "Financial Crime", level: "Advanced" },
  { name: "Risk Identification", category: "Compliance", subcategory: "Risk Management", level: "Advanced" },
  { name: "Treating Customers Fairly", category: "Compliance", subcategory: "Conduct Rules", level: "Foundational" },
  { name: "Medicare Advantage Knowledge", category: "Product Knowledge", subcategory: "Plan Types", level: "Intermediate" },
  { name: "Plan Eligibility Assessment", category: "Product Knowledge", subcategory: "Eligibility", level: "Intermediate" },
  { name: "Benefits Explanation", category: "Product Knowledge", subcategory: "Benefits", level: "Foundational" },
  { name: "Premium & Cost Structures", category: "Product Knowledge", subcategory: "Pricing & Costs", level: "Advanced" },
  { name: "Enrolment Period Guidance", category: "Product Knowledge", subcategory: "Enrolment", level: "Intermediate" },
  { name: "Medicaid Plan Knowledge", category: "Product Knowledge", subcategory: "Plan Types", level: "Intermediate" },
  { name: "Team Leadership", category: "Leadership", subcategory: "Team Management", level: "Advanced" },
  { name: "Performance Coaching", category: "Leadership", subcategory: "Coaching", level: "Advanced" },
  { name: "Delegation Skills", category: "Leadership", subcategory: "Delegation", level: "Intermediate" },
  { name: "Decision Making Under Pressure", category: "Leadership", subcategory: "Decision Making", level: "Expert" },
  { name: "Managing Underperformance", category: "Leadership", subcategory: "Performance Management", level: "Expert" },
  { name: "Customer Empathy", category: "Customer Experience", subcategory: "Empathy", level: "Foundational" },
  { name: "Complaint Handling", category: "Customer Experience", subcategory: "Complaint Handling", level: "Intermediate" },
  { name: "Service Recovery", category: "Customer Experience", subcategory: "Service Recovery", level: "Advanced" },
  { name: "Reducing Customer Effort", category: "Customer Experience", subcategory: "Customer Effort", level: "Intermediate" },
  { name: "NPS & Customer Feedback", category: "Customer Experience", subcategory: "NPS", level: "Intermediate" },
  { name: "CRM System Usage", category: "Technical", subcategory: "CRM", level: "Foundational" },
  { name: "Data Entry Accuracy", category: "Technical", subcategory: "Data Entry", level: "Foundational" },
  { name: "Reporting & Dashboards", category: "Technical", subcategory: "Reporting", level: "Advanced" },
  { name: "Digital Literacy", category: "Technical", subcategory: "Digital Literacy", level: "Foundational" },
  { name: "Systems Navigation", category: "Technical", subcategory: "Systems & Tools", level: "Foundational" },
  { name: "Company Values & Culture", category: "Onboarding", subcategory: "Culture & Values", level: "Foundational" },
  { name: "Role Clarity", category: "Onboarding", subcategory: "Role Clarity", level: "Foundational" },
  { name: "Process Knowledge", category: "Onboarding", subcategory: "Process Knowledge", level: "Intermediate" },
  { name: "Systems Access & Setup", category: "Onboarding", subcategory: "Systems Access", level: "Foundational" },
  { name: "Giving & Receiving Feedback", category: "Coaching & Development", subcategory: "Feedback", level: "Intermediate" },
  { name: "Goal Setting", category: "Coaching & Development", subcategory: "Goal Setting", level: "Foundational" },
  { name: "Growth Mindset", category: "Coaching & Development", subcategory: "Growth Mindset", level: "Intermediate" },
  { name: "Self-Awareness", category: "Coaching & Development", subcategory: "Self-Awareness", level: "Advanced" },
];
