/**
 * Nexus passage overrides.
 *
 * The word map in `nexusTerms.ts` cannot rewrite whole healthcare *sentences* —
 * a question about deductibles stays a question about deductibles whatever the
 * nouns are renamed to. This map replaces complete rendered passages (question
 * stems, answer options, article prose, content descriptions, role-play scripts,
 * tutor replies) with purpose-written technology-company equivalents.
 *
 * Keys are the literal CVS Health source strings, whitespace-normalised.
 * Structure is preserved exactly: same option counts, same answer positions,
 * same paragraph and bullet counts.
 */
export const NEXUS_PASSAGES: Record<string, string> = {
  // --- Curriculum / module titles ----------------------------------------
  "Medicare Part A — Hospital & Inpatient Coverage":
    "Platform Tier 1 — Core Infrastructure Entitlements",
  "Medicare Part B — Outpatient & Medical Coverage":
    "Platform Tier 2 — Standard Support Entitlements",
  "Medicare Part D — Prescription Drug Coverage":
    "Platform Tier 4 — Managed Service Entitlements",
  "Part A Coverage": "Tier 1 Entitlements",
  "Part B Coverage": "Tier 2 Entitlements",
  "Part D — prescription drug coverage.": "Tier 4 — managed service entitlements.",
  "Part D — outpatient prescription drug coverage.":
    "Tier 4 — on-demand managed service entitlements.",
  "Primary vs Secondary Coverage": "Primary vs Secondary Ownership",
  "Coverage & Claims": "Entitlements & Tickets",
  "Dental & Vision": "Observability & Analytics",
  "Premium & Cost Structures": "Pricing & Cost Structures",
  "Department of Health and Human Services": "the Platform Governance Board",
  "Coverage determination and medical necessity":
    "Access determination and technical justification",
  "How Medicare coverage decisions are made":
    "How platform access decisions are made",
  "Comprehensive coverage of Medicare Advantage plan structures, costs, and key selling points.":
    "Comprehensive walkthrough of Nexus Enterprise tier structures, pricing, and key differentiators.",

  // --- Assessment questions and options ----------------------------------
  "PPOs have lower monthly premiums than HMOs":
    "Dedicated tiers have lower monthly subscription costs than shared tiers",
  "Which Medicare plan type combines hospital, medical, and often prescription drug coverage into a single plan?":
    "Which Nexus tier combines infrastructure, standard support, and often managed services into a single subscription?",
  "What is the standard Medicare Initial Enrolment Period (IEP)?":
    "What is the standard Nexus Initial Provisioning Window (IPW)?",
  "A gap in hospital coverage for stays over 60 days":
    "A gap in infrastructure entitlements for workloads running over 60 days",
  "A period when a beneficiary has no Medicare coverage":
    "A period when a customer has no active Nexus entitlements",
  "A Special Enrolment Period (SEP) allows Medicare beneficiaries to make changes to their coverage outside of standard enrolment windows under qualifying circumstances.":
    "An Exception Provisioning Window (EPW) allows Nexus customers to change their entitlements outside standard provisioning windows under qualifying circumstances.",
  "Which of the following are valid reasons for a Medicare Special Enrolment Period? (Select all that apply)":
    "Which of the following are valid reasons for a Nexus Exception Provisioning Window? (Select all that apply)",
  "To determine which plan pays first when a beneficiary has multiple coverage sources":
    "To determine which agreement takes precedence when a customer has multiple entitlement sources",
  "When a CSR receives a call from a beneficiary who wants to appeal a coverage denial, what is the first step?":
    "When a Client Associate receives a call from a customer who wants to escalate a rejected access request, what is the first step?",
  "A supplemental plan that covers dental and vision only":
    "An add-on agreement that covers observability and analytics only",
  "A beneficiary who misses their Initial Enrolment Period for Medicare Part B may face a permanent premium penalty.":
    "A customer who misses their Initial Provisioning Window for Tier 2 support may face a permanent subscription surcharge.",
  "A penalty for late enrolment in Part D": "A surcharge for late provisioning of Tier 4",
  "Losing employer-sponsored coverage": "Losing an inherited workspace entitlement",
  "A Medicare-eligible member is still actively working and covered by their employer's group health plan (employer has 40 employees). Which plan is the primary payer?":
    "A Nexus-eligible team is also covered by a parent organisation's shared workspace agreement (parent org has 40 seats). Which agreement takes precedence?",
  "Medicare Advantage plans must cover all Part A and Part B benefits but may include additional benefits such as dental and vision":
    "Enterprise tiers must include every Tier 1 and Tier 2 entitlement but may add extras such as observability and analytics",
  "The member — they should have confirmed coverage before the appointment":
    "The customer — they should have confirmed entitlements before scheduling the work",
  "Medicare — Medicare automatically approves all medically necessary procedures":
    "Nexus — the platform automatically approves all technically justified changes",
  "A service was determined not to be medically necessary":
    "A change was determined not to be technically justified",

  // --- Learner history / Sage explanations -------------------------------
  "A Special Enrolment Period (SEP) is a time outside of the standard enrolment windows when a member can make changes to their coverage. Common qualifying events include moving to a new area, losing other coverage...":
    "An Exception Provisioning Window (EPW) is a period outside the standard windows when a customer can change their entitlements. Common qualifying events include migrating to a new region, losing an inherited entitlement...",
  "You're not alone — this is one of the most common points of confusion! A grievance is a complaint about the quality of care or service a member received, whereas an appeal is a formal challenge to a coverage, prior authorisation, or payment decision. The key distinction is: grievance = how you were treated, appeal = what was decided...":
    "You're not alone — this is one of the most common points of confusion! A complaint is about the quality of service a customer received, whereas an escalation is a formal challenge to an entitlement, change-approval, or billing decision. The key distinction is: complaint = how you were treated, escalation = what was decided...",
  "the Medicare coverage basics from your onboarding sessions":
    "the platform entitlement basics from your onboarding sessions",
  "One focus area flagged: Part B deductibles with secondary insurance":
    "One focus area flagged: Tier 2 usage thresholds with secondary agreements",
  "Part B deductibles with secondary insurance — you flagged this as unclear":
    "Tier 2 usage thresholds with secondary agreements — you flagged this as unclear",
  "Quick check-in before you dive in — how are you feeling about the Medicare coverage concepts from yesterday's sessions?":
    "Quick check-in before you dive in — how are you feeling about the platform entitlement concepts from yesterday's sessions?",
  "Mostly okay, but Part B deductibles with secondary insurance are still a bit confusing":
    "Mostly okay, but Tier 2 usage thresholds with secondary agreements are still a bit confusing",
  "I'm confused about how Part B deductibles work when a patient has secondary coverage. Sage explained it but I'm still not sure I'd get it right on a real call.":
    "I'm confused about how Tier 2 usage thresholds work when a customer has a secondary agreement. Sage explained it but I'm still not sure I'd get it right on a real call.",
  "Great question. If the member has secondary coverage, the secondary plan may cover the remaining 20% after Medicare pays, depending on the plan type. This is called coordination of benefits.":
    "Great question. If the customer has a secondary agreement, that agreement may absorb the remaining 20% after the primary tier is applied, depending on the tier. This is called entitlement coordination.",
  "Hi Jordan — great question. Let's talk through this. The key rule is: Medicare is always primary for Medicare members, even when they have secondary coverage. The secondary plan only steps in after Medicare has paid its 80%. I'll add a note to your session in this week's training. In the meantime, Sage can walk you through some examples if you ask about COB scenarios.":
    "Hi Noor — great question. Let's talk through this. The key rule is: the platform tier is always primary for Nexus customers, even when a secondary agreement exists. The secondary agreement only steps in after the primary tier has absorbed its 80%. I'll add a note to your session in this week's training. In the meantime, Sage can walk you through some examples if you ask about coordination scenarios.",
  "Leon scored 54% on Module 3 with errors concentrated on Coverage Determination definitions and the relationship between prior authorisation and coverage decisions. Sage attempted to re-explain the concept but Leon's follow-up questions suggest the module content may not be clear enough for learners without prior insurance experience.":
    "Leon scored 54% on Module 3 with errors concentrated on access determination definitions and the relationship between change approval and entitlement decisions. Sage attempted to re-explain the concept but Leon's follow-up questions suggest the module content may not be clear enough for learners without prior platform experience.",

  // --- Role play ----------------------------------------------------------
  "Sandra received a $60 bill from her doctor and doesn't understand why she owes anything when she thought Medicare covered her visits. She is calling your service line to sort it out.":
    "Sandra received a $60 overage charge on her workspace invoice and doesn't understand why she owes anything when she thought her tier covered her usage. She is calling your service line to sort it out.",
  "Hi, yes, I got a bill from my doctor and I don't understand why I owe $60 when I thought Medicare covered everything. Can you help me?":
    "Hi, yes, I got an invoice with a $60 overage charge and I don't understand why I owe anything when I thought my tier covered everything. Can you help me?",
  "You accurately referenced Medicare Part D coverage details in turn 4, consistent with the content you completed.":
    "You accurately referenced Tier 4 managed service entitlements in turn 4, consistent with the content you completed.",
  "Accurate and confident product knowledge — your references to Medicare coverage details were correct and well-placed.":
    "Accurate and confident product knowledge — your references to platform entitlement details were correct and well-placed.",
  "Marcus has been comparing Medicare Advantage plans online and is skeptical that any plan will match the coverage he has today. He is polite but will push back on each point you make.":
    "Tomas has been comparing Enterprise tiers online and is sceptical that any tier will match the capability he has today. He is polite but will push back on each point you make.",
  "You are speaking with a prospect who has been researching Medicare Advantage plans online and is skeptical that any plan will match the coverage they have today. They are polite but sceptical and will push back on each point.":
    "You are speaking with a prospect who has been researching Enterprise tiers online and is sceptical that any tier will match the capability they have today. They are polite but sceptical and will push back on each point.",

  // --- Article and review content ----------------------------------------
  "Medicare Part B covers medically necessary services and preventive services. When determining coverage, the first step is to verify whether the service is a covered benefit under the member's specific plan, and then apply coordination of benefits rules where applicable.":
    "Tier 2 covers standard support requests and proactive maintenance. When determining access, the first step is to verify whether the request is a covered entitlement under the customer's specific tier, and then apply entitlement coordination rules where applicable.",
  "When a member has both Medicare and a secondary insurance plan, Medicare typically acts as the primary payer. The secondary plan may cover costs that Medicare doesn't, such as the 20% coinsurance after Medicare pays.":
    "When a customer holds both a Nexus tier and a secondary agreement, the Nexus tier is typically primary. The secondary agreement may absorb costs the primary tier doesn't, such as the 20% usage share beyond the included allowance.",
  "Always confirm the plan type before quoting coverage or cost share.":
    "Always confirm the tier before quoting entitlements or cost share.",
  "This module covers the Aetna plan families you will see most often on calls, and how to read a member's plan record before answering any coverage question.":
    "This module covers the Nexus tier families you will see most often on tickets, and how to read a customer's account record before answering any entitlement question.",
  "Every member record shows the plan name, effective dates, network tier and accumulators. Check the effective date before quoting anything — a service delivered outside the coverage window is handled differently.":
    "Every account record shows the tier name, effective dates, region and usage counters. Check the effective date before quoting anything — work delivered outside the entitlement window is handled differently.",
  "Adjudication applies the plan's benefit rules in a fixed order: eligibility on the date of service, benefit coverage, network status, then accumulators. Only after those checks does the system calculate the allowed amount and the member's share.":
    "Resolution applies the tier's entitlement rules in a fixed order: account status on the date of the request, entitlement scope, region availability, then usage counters. Only after those checks does the system calculate the allowed amount and the customer's share.",
  "Medicare is the federal health insurance programme for people aged 65 and over, and for certain younger people with disabilities or end-stage renal disease. It is administered by the Centers for Medicare & Medicaid Services (CMS).":
    "The Nexus platform tier is the baseline subscription for organisations running production workloads, and for smaller teams with regulated or high-availability requirements. It is governed by the Platform Governance Board (PGB).",
  "Medicare Advantage plans must cover everything Original Medicare covers, and usually add extras such as dental, vision or fitness benefits. In exchange, members use a defined network and follow plan rules for referrals and prior authorisation.":
    "Enterprise tiers must include everything the Core tier includes, and usually add extras such as observability, analytics or advanced security entitlements. In exchange, customers work within a defined region and follow tier rules for routing and change approval.",
  "Medicare Advantage Open Enrolment — 1 January to 31 March.":
    "Enterprise tier open provisioning — 1 January to 31 March.",
  "A Special Enrolment Period lets a member change coverage outside the standard windows. Common triggers include moving out of the plan's service area, losing employer coverage, or a change in Medicaid or Extra Help status.":
    "An Exception Provisioning Window lets a customer change entitlements outside the standard windows. Common triggers include migrating out of the tier's supported region, losing an inherited entitlement, or a change in Cloud Services or partner-credit status.",
  "This module explains how coverage decisions are made and how payment responsibility is ordered when a member has more than one plan.":
    "This module explains how access decisions are made and how billing responsibility is ordered when a customer holds more than one agreement.",
  "A coverage determination is the plan's decision about whether a service or drug is covered, and how much the member must pay. Determinations can be standard or expedited when the member's health is at risk.":
    "An access determination is the tier's decision about whether a request or add-on is in scope, and how much the customer must pay. Determinations can be standard or expedited when the customer's production service is at risk.",
  "When a member has more than one source of coverage, coordination of benefits decides which plan pays first. Medicare is usually secondary to active employer coverage for larger employers, and primary in most retiree situations.":
    "When a customer has more than one source of entitlement, entitlement coordination decides which agreement applies first. A Nexus tier is usually secondary to an active parent-organisation agreement for larger orgs, and primary in most standalone situations.",
  "Identify every active coverage on the member's record.":
    "Identify every active entitlement on the customer's record.",
  "Record the coverage rule you applied and the source you checked. Clear documentation protects the member if the decision is later appealed.":
    "Record the entitlement rule you applied and the source you checked. Clear documentation protects the customer if the decision is later escalated.",
  "Understanding how to handle disputes and appeals is a critical part of your role as a Medicare CSR. When a member or provider disagrees with a coverage decision, they have the right to challenge it through a formal process.":
    "Understanding how to handle disputes and escalations is a critical part of your role as a Nexus Software Engineer. When a customer or partner disagrees with an access decision, they have the right to challenge it through a formal process.",
  "An appeal is a formal request to review a decision that was made about a member's Medicare coverage or claim. Appeals can be filed by the member, their representative, or their treating provider.":
    "An escalation is a formal request to review a decision made about a customer's entitlements or support ticket. Escalations can be filed by the customer, their account contact, or their implementation partner.",
  "When a member's health is at serious risk, an expedited (fast) appeal can be requested. The plan must respond within 72 hours for standard expedited requests and 24 hours when the member is still receiving the service in question.":
    "When a customer's production service is at serious risk, an expedited (fast-track) escalation can be requested. The team must respond within 72 hours for standard expedited requests and 24 hours when the incident is still active.",
  "A grievance is a complaint about the quality of care or service received — not about a coverage or payment decision.":
    "A complaint is about the quality of the service received — not about an entitlement or billing decision.",
  "An appeal is specifically about a coverage, prior authorisation, or payment decision.":
    "An escalation is specifically about an entitlement, change-approval, or billing decision.",

  // --- Up-skiller content -------------------------------------------------
  '"I already have coverage" — compare like for like on the benefits that matter most to them.':
    '"We already have a provider" — compare like for like on the capabilities that matter most to them.',
  "I already have coverage": "We already have a provider",
  "Medicare Advantage (Part C) plans are offered by private insurers approved by Medicare and bundle Part A and Part B coverage, usually with additional benefits such as prescription drug, dental, and vision cover.":
    "Enterprise tiers are delivered by certified Nexus partners and bundle Tier 1 and Tier 2 entitlements, usually with additional capabilities such as managed services, observability, and analytics.",

  // --- Dashboard and insight copy ----------------------------------------
  "Every coverage decision follows a structured process: Medicare reviews whether the service is medically necessary, whether it falls within the member's benefits, and whether any prior authorisation is required.":
    "Every access decision follows a structured process: the platform reviews whether the request is technically justified, whether it falls within the customer's entitlements, and whether any change approval is required.",
  "Part B covers two categories of services: medically necessary services (doctor visits, outpatient care, durable medical equipment) and preventive services (screenings, vaccinations, counselling).":
    "Tier 2 covers two categories of work: reactive support (incident response, ticket handling, managed hardware replacement) and proactive services (health checks, patching, advisory sessions).",
  "If a member has a Medicare Supplement (Medigap) plan, the secondary plan may cover all or part of the 20% coinsurance, depending on the plan type.":
    "If a customer holds an Extended Support (Nexus Assure) agreement, that agreement may absorb all or part of the 20% usage share, depending on the tier.",
  "When a member has both Medicare and a secondary insurance plan, the coordination of benefits rules determine which plan pays first (the \"primary\" payer) and which pays second (the \"secondary\" payer).":
    "When a customer holds both a Nexus tier and a secondary agreement, the entitlement coordination rules determine which agreement is billed first (the \"primary\" owner) and which is billed second (the \"secondary\" owner).",
  "For most Medicare members, Medicare is always the primary payer. The secondary plan steps in after Medicare has processed the claim and paid its portion.":
    "For most Nexus customers, the platform tier is always the primary owner. The secondary agreement steps in after the platform tier has processed the ticket and absorbed its portion.",
  "Always verify whether the member has secondary coverage before quoting out-of-pocket costs.":
    "Always verify whether the customer holds a secondary agreement before quoting overage costs.",
  "If the member has employer-sponsored coverage through a current employer with 20+ employees, the employer plan is primary and Medicare is secondary.":
    "If the customer inherits entitlements from a parent organisation with 20+ seats, the parent agreement is primary and the team's own tier is secondary.",
  "Medicaid is always the payer of last resort — it pays after Medicare and all other insurance.":
    "Cloud Services credit is always the billing owner of last resort — it applies after the platform tier and every other agreement.",
  "Never guarantee coverage for a service that may require PA":
    "Never guarantee entitlement for work that may require change approval",
  "Part D covers prescription drugs. Standalone PDPs attach to Original Medicare; MA-PD plans bundle drug coverage with Medicare Advantage.":
    "Tier 4 covers managed services. Standalone service plans attach to the Core tier; bundled plans include managed services within the Enterprise tier.",
  "Identifying whether the issue is a grievance or an appeal":
    "Identifying whether the issue is a complaint or an escalation",
  "Grievance vs. appeal edge case": "Complaint vs. escalation edge case",
  "What's the difference between a grievance and an appeal — I always get these mixed up?":
    "What's the difference between a complaint and an escalation — I always get these mixed up?",
  "Benefits Coverage has been marked as a priority area. Claims and Billing has been set to assessment-only.":
    "Entitlement Management has been marked as a priority area. Ticketing and Escalation has been set to assessment-only.",
  "Sage advised that prior authorisations are generally plan-specific and may not transfer following a plan change, but could not confirm the exact reapplication process or whether mid-year exceptions apply for continuity of care. Confidence score: 44%.":
    "Sage advised that change approvals are generally tier-specific and may not transfer following a tier change, but could not confirm the exact reapplication process or whether mid-term exceptions apply for service continuity. Confidence score: 44%.",
  "4 out of 5 open learner escalations relate to Coverage Determination, Prior Authorisation, or COB rules — all within Module 3 content. Average assessment score for this module is 66%, below the 70% threshold. The escalation pattern across multiple learners suggests the article may not provide sufficient clarity for learners without prior insurance experience. Sage recommends reviewing the article for completeness and adding a worked example or scenario-based activity.":
    "4 out of 5 open learner escalations relate to access determination, change approval, or entitlement coordination rules — all within Module 3 content. Average assessment score for this module is 66%, below the 70% threshold. The escalation pattern across multiple learners suggests the article may not provide sufficient clarity for learners without prior platform experience. Sage recommends reviewing the article for completeness and adding a worked example or scenario-based activity.",

  // --- Learner assessment: Security Awareness Knowledge Check -------------
  // Section labels
  "Medicare basics": "Security awareness",
  "Claims and billing": "Access management",
  "Coverage determination": "Incident response",
  // Q1 — cadence (correct answer stays in position B)
  "What is the standard Medicare Part B annual deductible for 2026?":
    "How often are Nexus employees required to complete the Security Awareness Programme?",
  "$198": "Once, during onboarding only",
  "$257": "Annually",
  "$226": "Every two years",
  "$310": "Only when there has been a security incident",
  // Q2 — remote access
  "Medicare is primary; the group plan is secondary":
    "Connect directly using the café's public Wi-Fi — it is password protected so it is secure",
  "The employer group plan is primary; Medicare is secondary":
    "Use the Nexus VPN before accessing any internal systems",
  "The member chooses which is primary each year":
    "Wait until you are back in the office to access the system",
  "Both plans pay 50% of every claim":
    "Use your personal hotspot only if the café Wi-Fi is slow",
  // Q3 — credential sharing
  "A member calls about an EOB showing higher patient responsibility than expected. What is the first thing the CSR should verify?":
    "A colleague asks you to share your login credentials so they can access a system while you are on leave. What should you do?",
  "Whether the member has met their annual out-of-pocket max":
    "Share your credentials securely via an encrypted message",
  "Whether the provider is in-network for the member's plan on the date of service":
    "Decline and advise your colleague to request their own access through the IT helpdesk",
  "Whether the claim was submitted with the correct diagnosis code":
    "Share your credentials verbally so there is no written record",
  "Whether the member wants to file an appeal":
    "Ask your manager for permission first, then share if they agree",
  // Q4 — password strength
  "Which of the following statements about Medicare Advantage (Part C) is correct?":
    "Which of the following describes a strong password for a Nexus system?",
  "Medicare Advantage plans are administered directly by the federal government":
    "Your name and the current year — easy to remember and update annually",
  "Medicare Advantage plans do not have an annual out-of-pocket maximum":
    "A six-digit PIN that matches your employee ID",
  "Members enrolled in Medicare Advantage cannot also enrol in a Part D prescription drug plan":
    "The word 'password' followed by an exclamation mark",
  // Q5 — vulnerability reporting
  "A member's provider wants to perform a procedure that requires prior authorisation. The provider did not obtain authorisation before the service was rendered. Who is responsible for obtaining prior authorisation?":
    "You discover a security vulnerability in the codebase while working on an unrelated feature. What should you do?",
  "The provider — it is always the provider's responsibility to obtain PA before rendering services":
    "Report it through the Nexus responsible disclosure process and raise a security ticket",
  "The CSR — it is the CSR's responsibility to initiate the PA request on the member's call":
    "Leave a comment in the code noting the issue and continue with your current task",
  "What's the Part B deductible?": "How often is security training required?",

  // --- Baseline assessment -----------------------------------------------
  "Medicare Basics": "Security Awareness",
  "Claims and Billing": "Access Management",
  "Which of the following describes the Medicare Part B annual deductible for 2026?":
    "How often are Nexus employees required to complete the Security Awareness Programme?",
  "$185": "Every three years",
  "$240": "Annually",
  "$298": "Only when there has been a security incident",
  "A member has both Medicare and a current employer group plan. Their employer has 30 employees. Which plan is the primary payer?":
    "A customer requests a copy of all personal data Nexus holds about them. Under GDPR, this is known as:",
  "Medicare is always primary": "A Data Retention Request",
  "The employer group plan is primary": "A Subject Access Request",
  "It depends on the member's age": "A Data Portability Enquiry",
  "Medicaid is primary": "A Privacy Impact Assessment",
  "A member calls about an Explanation of Benefits (EOB) that shows a higher patient responsibility than expected. What is the first thing you should verify?":
    "A file containing customer contact details has been shared with an external party not authorised to receive it. What is the correct first step?",
  "Whether the member has met their annual deductible":
    "Delete the file from your own systems and take no further action",
  "Whether the provider is in-network":
    "Contact the external party directly and ask them to delete it without telling anyone internally",
  "Whether the claim has been processed correctly and COB has been applied":
    "Report the incident to the Nexus Data Protection Officer or security team immediately",
  "Whether the member is enrolled in a Medigap plan":
    "Wait to see if there are any consequences before reporting",

  // --- Admin assessment stubs --------------------------------------------
  "Medicare Supplement (Medigap)": "Nexus Assure add-on",
  "Medicare Advantage (Part C)": "Nexus Enterprise (Tier 3)",
  "Medicare Part D": "Nexus Managed Services (Tier 4)",
  "Medicare Part A": "Nexus Core Infrastructure (Tier 1)",
  "Medicare Part B covers inpatient hospital stays.":
    "Tier 2 standard support includes dedicated infrastructure capacity.",
  "3 months before and after the month of your 65th birthday":
    "3 months before and after the contract start date",
  "6 months before the month of your 65th birthday":
    "6 months before the contract start date",
  "7-month window: 3 months before, the month of, and 3 months after your 65th birthday":
    "A 7-month window: 3 months before, the month of, and 3 months after the contract start date",
  "12 months from the date of Medicare eligibility":
    "12 months from the date the account is approved",
  "Which of the following are covered under Medicare Part A? (Select all that apply)":
    "Which of the following are included in Tier 1 core infrastructure? (Select all that apply)",
  "Inpatient hospital care": "Dedicated compute capacity",
  "Skilled nursing facility care": "Extended support cover",
  "Outpatient surgery": "On-site implementation services",
  "Hospice care": "Long-term data retention",
  "Prescription drugs": "Managed services",
  "What does the Medicare Part D coverage gap (commonly known as the 'donut hole') refer to?":
    "What does the Tier 4 usage gap (commonly known as the 'overage band') refer to?",
  "A temporary limit on what the drug plan will cover for prescription costs":
    "A temporary limit on what the managed service plan will cover for usage costs",
  "Which federal agency administers the Medicare programme?":
    "Which internal body owns the Nexus platform entitlement policy?",
  "Social Security Administration": "The Finance Operations team",
  "Department of Veterans Affairs": "The Field Sales organisation",
  "Moving to a new service area": "Migrating to a new region",
  "Turning 65": "Reaching the contract anniversary",
  "Being released from incarceration": "Completing a corporate restructure",
  "Getting married": "Adding a new team workspace",
  "To calculate the beneficiary's monthly premium":
    "To calculate the customer's monthly subscription fee",
  "To enrol beneficiaries in both Part A and Part B simultaneously":
    "To provision customers on Tier 1 and Tier 2 simultaneously",
  "To manage the transition from Medicaid to Medicare":
    "To manage the transition from Cloud Services to the Platform tier",
  "Dual eligible beneficiaries are individuals who qualify for both Medicare and Medicaid.":
    "Cross-platform customers are organisations entitled to both the Platform tier and Cloud Services.",
  "A Medicare Advantage plan must cover all services covered under Original Medicare, with the exception of:":
    "A Nexus Enterprise tier includes every service in the Core tier, with the exception of:",
  "Emergency care": "Priority incident response",
  "Preventive services": "Proactive monitoring",
  "Outpatient care": "Standard support",
  "Transfer the call to a supervisor immediately": "Transfer the case to a supervisor immediately",
  "Inform the beneficiary they cannot appeal": "Inform the customer they cannot escalate",
  "Document the denial reason and explain the appeal rights and timeline":
    "Document the rejection reason and explain the escalation route and timeline",
  "Submit a new prior authorisation request": "Submit a new change approval request",
  "Which of the following best describes a Medicare Advantage Special Needs Plan (SNP)?":
    "Which of the following best describes a Nexus Dedicated Plan (DP)?",
  "A plan exclusively for beneficiaries under 65":
    "An agreement available only to organisations under 65 seats",
  "A plan tailored for individuals with specific diseases, dual eligibility, or institutional needs":
    "An agreement tailored to customers with specialised workloads, cross-platform entitlements, or regulated hosting needs",
  "A plan available only through employer groups":
    "An agreement available only through reseller partners",
  "Medicare Part C (Medicare Advantage) plans are required to cover all services included in Original Medicare Parts A and B, with the exception of hospice care.":
    "The Nexus Enterprise tier includes every service in the Core tier (Tiers 1 and 2), with the exception of long-term data retention.",
  "Which of the following actions should a CSR take when a beneficiary reports difficulty affording their Part D prescriptions? (Select all that apply)":
    "Which of the following actions should a Support Engineer take when a customer reports difficulty covering their managed service costs? (Select all that apply)",
  "Explain the Extra Help / Low Income Subsidy (LIS) programme":
    "Explain the Nexus Growth Credit programme",
  "Review the plan's formulary for lower-cost alternatives":
    "Review the service catalogue for lower-cost alternatives",
  "Advise the beneficiary to skip doses to make their medication last":
    "Advise the customer to disable monitoring to reduce their usage",
  "Refer the beneficiary to the State Pharmaceutical Assistance Programme (SPAP) if applicable":
    "Refer the customer to the Partner Assistance Programme (PAP) if applicable",
  "What is the maximum number of days Medicare covers in a skilled nursing facility (SNF) per benefit period?":
    "What is the maximum number of days of extended support included per entitlement period?",

  // --- Role play ----------------------------------------------------------
  "A skeptical Medicare member frustrated by an unexpected bill":
    "A sceptical Nexus customer frustrated by an unexpected invoice",
  "I understand your concern, and here's why that happens — your plan has a copay for specialist visits, specifically $60 per visit.":
    "I understand your concern, and here's why that happens — your subscription has a usage charge for seats beyond your plan allowance, specifically for the 60 extra seats added last month.",
  "Benefits Navigation — Medicare Member Call": "Platform Navigation — Customer Call",
  "Your explanation of the out-of-pocket maximum was accurate, but the premium and copay detail was less precise than the Module 2 content.":
    "Your explanation of the annual usage cap was accurate, but the subscription and usage-charge detail was less precise than the Module 2 content.",
  "Tighten your premium and copay detail so the numbers match the Module 2 content exactly.":
    "Tighten your subscription and usage-charge detail so the numbers match the Module 2 content exactly.",

  // --- Tutor, recap and article prose -------------------------------------
  "Of course. The Part B deductible is $240 for 2026. Once that's met, Medicare pays 80% of approved amounts for covered services.":
    "Of course. The Tier 2 usage allowance covers the first 240 support hours each year. Once that's used, Nexus covers 80% of the cost of additional hours.",
  "Can you explain Part B deductibles again?": "Can you explain Tier 2 usage allowances again?",
  "Here's a summary of Coverage Determination:\n\nPart B covers medically necessary services. Once the annual deductible is met ($240 for 2026), Medicare pays 80% of approved amounts.\n\nCoordination of Benefits (COB): When a member has secondary insurance, Medicare pays first. The secondary plan may cover the remaining 20% depending on the plan terms.\n\nKey rule: Always verify the COB record before telling a member what they owe.":
    "Here's a summary of Access Determination:\n\nTier 2 covers technically justified support work. Once the annual usage allowance is used, Nexus covers 80% of the cost of additional work.\n\nCross-Team Coordination (CTC): When a customer has a secondary agreement, the primary tier is applied first. The secondary agreement may cover the remaining 20% depending on its terms.\n\nKey rule: Always verify the CTC record before telling a customer what they owe.",
  "The amount a member pays before Medicare begins to pay. For 2026, the Part B deductible is $240.":
    "The usage a customer consumes before Nexus begins to absorb cost. For 2026, the Tier 2 allowance is 240 support hours.",
  "After the Part B deductible, Medicare pays 80% and the member owes 20% coinsurance.":
    "After the Tier 2 allowance is used, Nexus absorbs 80% of overage and the customer owes the remaining 20%.",
  "3 modules — Medicare Part D Formulary Basics, Coordination of Benefits Overview, Prior Authorisation Process":
    "3 modules — Service Catalogue Basics, Cross-Team Coordination Overview, Change Approval Process",
  "You showed strong understanding of formulary tiers — your assessment score reflects that. One area to keep in mind: coverage gap rules came up as a weaker point. I've made a note and we'll revisit it today.":
    "You showed strong understanding of service catalogue tiers — your assessment score reflects that. One area to keep in mind: usage gap rules came up as a weaker point. I've made a note and we'll revisit it today.",
  "The article on deductibles was a bit unclear — can someone explain it differently?":
    "The article on usage allowances was a bit unclear — can someone explain it differently?",
  "Think of the deductible as the amount the member pays before the plan starts contributing. Once it's met, cost sharing kicks in. Let me know if you'd like to run through an example together.":
    "Think of the usage allowance as what the customer consumes before Nexus starts contributing to cost. Once it's used, cost sharing kicks in. Let me know if you'd like to run through an example together.",
  "New patient prep": "New customer prep",
  "HDHP deductibles": "Enterprise usage allowances",
  "Handled the deductible scenarios correctly": "Handled the usage allowance scenarios correctly",
  "Review: Deductibles and Coinsurance — Part B Scenarios":
    "Review: Usage Allowances and Cost Share — Tier 2 Scenarios",
  "Deductibles and Coinsurance": "Usage Allowances and Cost Share",
  "Discussed Part B deductibles · 2 hours ago": "Discussed Tier 2 usage allowances · 2 hours ago",
  "What the Part B deductible means for a member": "What the Tier 2 usage allowance means for a customer",
  "Deductibles and the 80/20 split": "Usage allowances and the 80/20 split",
  "Great question! Medicare Part B covers outpatient services and is part of Original Medicare, while Part C — also known as Medicare Advantage — is a private plan alternative that bundles Parts A and B...":
    "Great question! Tier 2 covers standard support and is part of the Nexus Core tier, while Tier 3 — also known as Nexus Enterprise — is a bundled alternative that combines Tiers 1 and 2...",

  // --- Review and up-skiller content prose --------------------------------
  "The Part B deductible resets each calendar year. Once the deductible is met, Medicare pays 80% of the approved amount for covered services.":
    "The Tier 2 usage allowance resets each calendar year. Once the allowance is used, Nexus absorbs 80% of the cost of approved additional work.",
  "Part A — inpatient hospital, skilled nursing and hospice care.":
    "Tier 1 — dedicated compute, extended support and long-term data retention.",
  "Part B — outpatient care, preventive services and durable medical equipment.":
    "Tier 2 — standard support, proactive monitoring and managed hardware.",
  "Part B — outpatient and preventive services.": "Tier 2 — standard support and proactive monitoring.",
  "Commercial employer-sponsored plans — HMO, PPO and high-deductible variants.":
    "Enterprise organisation-wide agreements — Starter, Standard and high-usage variants.",
  "Accumulators tell you how much of the deductible and out-of-pocket maximum the member has already met this plan year.":
    "Usage counters tell you how much of the allowance and annual usage cap the customer has already consumed this subscription year.",
  "CO-11 — the diagnosis is inconsistent with the procedure.":
    "ERR-11 — the request category is inconsistent with the action performed.",
  "Member responsibility — deductible, copay or coinsurance owed.":
    "Customer responsibility — allowance used, usage charge or overage owed.",
  "Deductibles, copays, and coinsurance for in-network and out-of-network care.":
    "Usage allowances, usage charges and overage for in-scope and out-of-scope work.",
  "Medicare Part D — Formulary Basics": "Platform Tier 4 — Service Catalogue Basics",

  // --- Module 3, Session 1: Access Determination article ------------------
  "Coverage determination is the process Medicare uses to decide whether a specific item or service is covered under a member's plan, and how much will be paid. For a CSR, understanding coverage determination means you can accurately explain to a member whether their treatment or prescription is covered before they receive it.":
    "Access determination is the process Nexus uses to decide whether a specific tool, environment or service is included in a customer's platform tier, and how much of the cost the platform absorbs. For a Support Specialist, understanding access determination means you can tell a customer whether a request is covered by their tier before any work begins.",
  "Medicare Part B — The Basics": "Platform Tier 2 — The Basics",
  "For Part B services, the standard cost-sharing structure is:":
    "For Tier 2 work, the standard cost-share structure is:",
  "Annual deductible: $240 (2026)": "Annual usage allowance: 240 support hours (2026)",
  "After deductible: Medicare pays 80% of the approved amount":
    "After the allowance is used: Nexus absorbs 80% of the approved cost",
  "Member responsibility: 20% of the approved amount (coinsurance)":
    "Customer responsibility: 20% of the approved cost (usage share)",
  "Coordination of Benefits (COB)": "Entitlement Coordination (EC)",
  "Key COB rules to remember:": "Key entitlement coordination rules to remember:",
  "If the member is retired or the employer has fewer than 20 employees, Medicare is primary.":
    "If the team is standalone, or the parent organisation holds fewer than 20 seats, the team's own tier is primary.",
  "Some services require prior authorisation (PA) before Medicare or the member's plan will cover them. If a member receives a service that required PA and did not get it, they may be responsible for the full cost.":
    "Some work requires change approval (CA) before Nexus will treat it as in-scope. If a customer has work carried out that required CA and none was raised, they may be billed for the full cost.",
  "As a CSR, you are not responsible for obtaining PA — that is the provider's responsibility. However, you should:":
    "As a Support Specialist, you are not responsible for raising CA — that sits with the delivery team. However, you should:",
  "Inform the member that certain services may require PA":
    "Tell the customer that certain work may require change approval",
  "Direct them to have their provider contact the plan before the service is rendered":
    "Ask them to have their delivery team raise the request before the work starts",
  "What to tell a member": "What to tell a customer",
  'When a member asks "Is this covered?", follow this structure:':
    'When a customer asks "Do we have access to this?", follow this structure:',
  "Verify the member's plan and effective date":
    "Verify the customer's platform tier and its start date",
  "Check for active prior authorisation requirements":
    "Check whether the request needs an active change approval",
  "Confirm COB — is Medicare primary or secondary?":
    "Confirm entitlement coordination — is their own tier primary or secondary?",
  "Quote the applicable cost-sharing: deductible status, coinsurance percentage":
    "Quote the applicable cost share: allowance used, usage share percentage",
  'If uncertain: "I want to make sure I give you accurate information — let me check that for you."':
    'If uncertain: "I want to make sure I give you accurate information — let me check that for you."',
  "Never guess. If you are not certain, place the member on a courteous hold and verify.":
    "Never guess. If you are not certain, let the customer know you are checking and confirm before you answer.",

  // Video modality takeaways
  "Coverage determination decides whether a service is covered and how much is paid.":
    "Access determination decides whether a request is in scope and how much of the cost Nexus absorbs.",
  "Always confirm coordination of benefits before quoting out-of-pocket costs.":
    "Always confirm entitlement coordination before quoting overage costs.",

  // Suggested prompts on this session
  "Difference between Part A and Part B?": "Difference between Tier 1 and Tier 2?",
  "Give me an example of COB": "Give me an example of entitlement coordination",

  // Knowledge check (correct answer stays in position B — 80%)
  "A Medicare member with a Medigap plan visits their doctor. After the Part B deductible, what percentage does Medicare pay?":
    "A Tier 2 customer has used their annual support-hour allowance. What percentage of the approved cost of additional work does Nexus absorb?",
  "— Medicare pays 80% of the approved amount after the deductible. Medigap may cover the remaining 20%.":
    "— Nexus absorbs 80% of the approved cost once the Tier 2 allowance is used. An Extended Support (Nexus Assure) agreement may absorb the remaining 20%.",
  "— Medicare pays 80% of the approved amount after the deductible is met. The member is responsible for the remaining 20% unless they have a Medigap plan.":
    "— Nexus absorbs 80% of the approved cost once the Tier 2 allowance is used. The customer owes the remaining 20% unless they hold an Extended Support (Nexus Assure) agreement.",
  // --- Role-play content library entries ---------------------------------
  "Pharmacy Technician — Counselling a Patient on a New Medication":
    "Delivering Difficult Performance Feedback",
  "Health Coach Intake Conversation": "Customer Escalation — Handling an At-Risk Account",
  "Handling a Medicare Part D Coverage Question": "Sales Discovery Call Practice",

  // --- Admin: Generate with AI (journey creation) -------------------------
  "Describe the journey you want to create and Sage will generate all the details for you — including journey settings, curricula selection, and configuration. You can review and edit everything before saving.":
    "Describe the journey you want to create and Sage will generate all the details for you — including journey settings, curricula selection, and configuration. You can review and edit everything before saving.",
  "e.g. A comprehensive onboarding journey for new Medicare CSR agents covering product knowledge, compliance, and customer handling — designed to be completed in the first 30 days of employment.":
    "e.g. A comprehensive onboarding journey for new software engineers at Nexus covering the tech stack, engineering standards, and ways of working — designed to be completed in the first 90 days.",
  "e.g. A foundational curriculum for new Medicare CSR agents covering the basics of Medicare Parts A, B, C, and D — designed to be completed in the first two weeks of onboarding.":
    "e.g. A foundational curriculum for new software engineers at Nexus covering the basics of our platform architecture, tooling, and engineering standards — designed to be completed in the first two weeks of onboarding.",
  "I've sequenced these curricula to build foundational knowledge first, then layer in Medicare-specific product training, and close with compliance — matching the progression typically needed before a new CSR handles live calls.":
    "I've sequenced these items to build foundational knowledge first, then layer in Nexus platform and tech-stack training, and close with security and compliance — matching the progression a new engineer needs before their first independent delivery.",
  "I've set sequential progression and a 30-day window based on your description. The completion certificate is enabled — new hire onboarding journeys typically benefit from a formal completion record. Adjust any of these to match your organisation's policies.":
    "I've set sequential progression and a 90-day window based on your description. The completion certificate is enabled — new hire onboarding journeys typically benefit from a formal completion record. Adjust any of these to match your organisation's policies.",
};

const NORMALISED: Record<string, string> = {};
for (const [key, value] of Object.entries(NEXUS_PASSAGES)) {
  NORMALISED[key.replace(/\s+/g, " ").trim()] = value;
}

/**
 * Returns the Nexus rewrite for a complete passage, or null when the text is
 * not a known passage (in which case the word map handles it).
 */
export function swapPassage(text: string): string | null {
  const key = text.replace(/\s+/g, " ").trim();
  if (!key) return null;
  return NORMALISED[key] ?? null;
}
