export type ContentCategoryId =
  | "core"
  | "roles"
  | "generic"
  | "consumerDuty"
  | "institute";

export type ContentCategorySelection = Record<ContentCategoryId, string[]>;

export const CONTENT_CATEGORIES: {
  id: ContentCategoryId;
  label: string;
  options: readonly string[];
}[] = [
  {
    id: "core",
    label: "Core competencies",
    options: [
      "Rathbones Purpose",
      "Managing clients",
      "Managing investments",
      "Financial planning",
      "Administration",
      "Developing new business",
      "The Rathbones professional and Ethics",
    ],
  },
  {
    id: "roles",
    label: "Client facing roles",
    options: ["Investment Manager", "Financial Planner", "Wealth Planner"],
  },
  {
    id: "generic",
    label: "Generic",
    options: ["Knowledge", "Technical Skills", "Behavioural skills", "Systems"],
  },
  {
    id: "consumerDuty",
    label: "Consumer Duty",
    options: [
      "Products and service",
      "Price and value",
      "Customer understanding",
      "Customer support",
    ],
  },
  {
    id: "institute",
    label: "Rathbones Institute language",
    options: ["Technical excellence", "Client judgement", "Commercial confidence"],
  },
];

export function emptyContentCategories(): ContentCategorySelection {
  return {
    core: [],
    roles: [],
    generic: [],
    consumerDuty: [],
    institute: [],
  };
}
