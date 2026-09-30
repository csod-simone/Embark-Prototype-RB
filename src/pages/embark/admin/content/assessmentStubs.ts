export type QuestionType = "multiple_choice" | "true_false" | "multi_select" | "short_answer";

export type AnswerOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type QuestionImage = {
  src: string;
  alt: string;
  textBefore?: string;
  textAfter?: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  /** Question stem. Supports light formatting (**bold**, _italic_, "- " lists). */
  text: string;
  /** Optional scenario / case context shown above the stem. Same formatting support. */
  scenario?: string;
  /** Optional image or screenshot with text before / after it. */
  image?: QuestionImage;
  /** Optional authoring section (question block) this question belongs to. */
  sectionId?: string;
  options: AnswerOption[];
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  multi_select: "Multi-Select",
  short_answer: "Short Answer",
};

export const JOURNEY_OPTIONS = [
  "Medicare CSR Onboarding Journey",
  "New Hire Foundations Journey",
  "Compliance Refresher Journey",
  "Medicare Advantage Product Training Journey",
  "Claims & Billing Essentials Journey",
];

let counter = 0;
const uid = (prefix: string) => `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;

const mc = (text: string, opts: [string, boolean][]): Question => ({
  id: uid("q"),
  type: "multiple_choice",
  text,
  options: opts.map(([text, correct]) => ({ id: uid("a"), text, correct })),
});

const tf = (text: string, correctTrue: boolean): Question => ({
  id: uid("q"),
  type: "true_false",
  text,
  options: [
    { id: uid("a"), text: "True", correct: correctTrue },
    { id: uid("a"), text: "False", correct: !correctTrue },
  ],
});

const ms = (text: string, opts: [string, boolean][]): Question => ({
  id: uid("q"),
  type: "multi_select",
  text,
  options: opts.map(([text, correct]) => ({ id: uid("a"), text, correct })),
});

export function makeStubQuestions(): Question[] {
  counter = 0;
  return [
    mc("Which Medicare plan type combines hospital, medical, and often prescription drug coverage into a single plan?", [
      ["Medicare Supplement (Medigap)", false],
      ["Medicare Advantage (Part C)", true],
      ["Medicare Part D", false],
      ["Medicare Part A", false],
    ]),
    tf("Medicare Part B covers inpatient hospital stays.", false),
    mc("What is the standard Medicare Initial Enrolment Period (IEP)?", [
      ["3 months before and after the month of your 65th birthday", false],
      ["6 months before the month of your 65th birthday", false],
      ["7-month window: 3 months before, the month of, and 3 months after your 65th birthday", true],
      ["12 months from the date of Medicare eligibility", false],
    ]),
    ms("Which of the following are covered under Medicare Part A? (Select all that apply)", [
      ["Inpatient hospital care", true],
      ["Skilled nursing facility care", true],
      ["Outpatient surgery", false],
      ["Hospice care", true],
      ["Prescription drugs", false],
    ]),
    mc("What does the Medicare Part D coverage gap (commonly known as the 'donut hole') refer to?", [
      ["A gap in hospital coverage for stays over 60 days", false],
      ["A temporary limit on what the drug plan will cover for prescription costs", true],
      ["A period when a beneficiary has no Medicare coverage", false],
      ["A penalty for late enrolment in Part D", false],
    ]),
    tf("A Special Enrolment Period (SEP) allows Medicare beneficiaries to make changes to their coverage outside of standard enrolment windows under qualifying circumstances.", true),
    mc("Which federal agency administers the Medicare program?", [
      ["Social Security Administration", false],
      ["Department of Veterans Affairs", false],
      ["Centers for Medicare & Medicaid Services (CMS)", true],
      ["Department of Health and Human Services", false],
    ]),
    ms("Which of the following are valid reasons for a Medicare Special Enrolment Period? (Select all that apply)", [
      ["Losing employer-sponsored coverage", true],
      ["Moving to a new service area", true],
      ["Turning 65", false],
      ["Being released from incarceration", true],
      ["Getting married", false],
    ]),
    mc("What is the primary purpose of Coordination of Benefits (COB) in Medicare?", [
      ["To determine which plan pays first when a beneficiary has multiple coverage sources", true],
      ["To calculate the beneficiary's monthly premium", false],
      ["To enrol beneficiaries in both Part A and Part B simultaneously", false],
      ["To manage the transition from Medicaid to Medicare", false],
    ]),
    tf("Dual eligible beneficiaries are individuals who qualify for both Medicare and Medicaid.", true),
    mc("A Medicare Advantage plan must cover all services covered under Original Medicare, with the exception of:", [
      ["Emergency care", false],
      ["Preventive services", false],
      ["Hospice care", true],
      ["Outpatient care", false],
    ]),
    mc("When a CSR receives a call from a beneficiary who wants to appeal a coverage denial, what is the first step?", [
      ["Transfer the call to a supervisor immediately", false],
      ["Inform the beneficiary they cannot appeal", false],
      ["Document the denial reason and explain the appeal rights and timeline", true],
      ["Submit a new prior authorisation request", false],
    ]),
  ];
}

export function blankQuestion(type: QuestionType = "multiple_choice"): Question {
  const base = { id: uid("q"), text: "" };
  if (type === "true_false") {
    return {
      ...base,
      type,
      options: [
        { id: uid("a"), text: "True", correct: false },
        { id: uid("a"), text: "False", correct: false },
      ],
    };
  }
  if (type === "short_answer") return { ...base, type, options: [] };
  return {
    ...base,
    type,
    options: [
      { id: uid("a"), text: "", correct: false },
      { id: uid("a"), text: "", correct: false },
    ],
  };
}

export const newAnswerId = () => uid("a");

export function makeAiStubQuestions(): Question[] {
  return [
    mc("Which of the following best describes a Medicare Advantage Special Needs Plan (SNP)?", [
      ["A plan exclusively for beneficiaries under 65", false],
      ["A plan tailored for individuals with specific diseases, dual eligibility, or institutional needs", true],
      ["A supplemental plan that covers dental and vision only", false],
      ["A plan available only through employer groups", false],
    ]),
    tf("Medicare Part C (Medicare Advantage) plans are required to cover all services included in Original Medicare Parts A and B, with the exception of hospice care.", true),
    ms("Which of the following actions should a CSR take when a beneficiary reports difficulty affording their Part D prescriptions? (Select all that apply)", [
      ["Explain the Extra Help / Low Income Subsidy (LIS) program", true],
      ["Review the plan's formulary for lower-cost alternatives", true],
      ["Advise the beneficiary to skip doses to make their medication last", false],
      ["Refer the beneficiary to the State Pharmaceutical Assistance Program (SPAP) if applicable", true],
    ]),
    mc("What is the maximum number of days Medicare covers in a skilled nursing facility (SNF) per benefit period?", [
      ["60 days", false],
      ["90 days", false],
      ["100 days", true],
      ["120 days", false],
    ]),
    tf("A beneficiary who misses their Initial Enrolment Period for Medicare Part B may face a permanent premium penalty.", true),
  ];
}

