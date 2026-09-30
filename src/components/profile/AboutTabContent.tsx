import { Clock, Hourglass, CalendarDays, Building2, FolderOpen, Users2, Network, UsersRound, Briefcase, Pencil } from "lucide-react";

const orgDetails = [
  { icon: FolderOpen, label: "Division", value: "Product & Engineering" },
  { icon: Building2, label: "Department", value: "Product Management" },
  { icon: UsersRound, label: "Manager", value: "Michael Chen" },
  { icon: Network, label: "Position in hierarchy", value: "Manager Level (L5)" },
  { icon: Users2, label: "Direct reports", value: "3 team members" },
  { icon: Briefcase, label: "Industry", value: "Enterprise Software & SaaS" },
];

const careerTimeline = [
  { icon: Clock, label: "Time in current role", value: "1 year 8 months" },
  { icon: Hourglass, label: "Total time at organization", value: "4 years 3 months" },
  { icon: CalendarDays, label: "Start date", value: "Jun 2023" },
];

const workExperience = [
  {
    title: "Sales Manager",
    company: "ABC Inc.",
    location: "San Jose, CA",
    period: "06/2023 - Present",
    bullets: [
      "Develop and execute sales strategy aligned with business goals, including market segmentation, territory planning, and go-to-market approaches.",
      "Lead, coach, and motivate the sales team through hiring, training, performance management, and ongoing skill development.",
      "Build and manage the sales pipeline and forecast accurately, setting targets, monitoring KPIs, and adjusting tactics to meet objectives.",
    ],
  },
  {
    title: "Sales Specialist",
    company: "BCD Inc.",
    location: "San Francisco, CA",
    period: "06/2020 - 06/2023",
    bullets: [
      "Drive sales growth by identifying and closing new business opportunities within the assigned territory.",
      "Cultivate strong customer relationships by providing ongoing support and acting as a trusted advisor.",
      "Meet or exceed sales targets by implementing effective sales strategies and managing the sales pipeline.",
    ],
  },
];

const certifications = [
  { name: "Certified Sales Executive (CSE) – Sales Management Association", expires: "06/2026" },
  { name: "Certified Inside Sales Manager (CISM) – AA-ISP", expires: "08/2026" },
];

const education = [
  { school: "Stanford Graduate School of Business", degree: "Bachelor of Business Administration (BBA)", years: "2010 – 2012" },
  { school: "UC Berkeley", degree: "Bachelor of Commerce (B.Com)", years: "2005 – 2007" },
];

export function AboutTabContent() {
  return (
    <div className="space-y-6">
      {/* Organization Details */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5">
          Organization details
        </h3>
        <div className="grid grid-cols-3 gap-y-5 gap-x-8">
          {orgDetails.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon size={18} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-primary">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Timeline */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5">
          Career timeline
        </h3>
        <div className="grid grid-cols-3 gap-x-8">
          {careerTimeline.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon size={18} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-primary">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">About</h3>
          <button className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground" aria-label="Edit about">
            <Pencil size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          Passionate product leader with 8+ years of experience driving innovation in enterprise software. Specialized in user-centric design and cross-functional team leadership. Strong advocate for data-driven decision making and agile methodologies.
        </p>
      </div>

      {/* Work Experience */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
          <button className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground" aria-label="Edit work experience">
            <Pencil size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-6 divide-y divide-border">
          {workExperience.map((job, i) => (
            <div key={i} className={i > 0 ? "pt-6" : ""}>
              <p className="text-sm font-semibold text-foreground">{job.title}</p>
              <p className="text-sm text-foreground mt-0.5">{job.company} | {job.location} | {job.period}</p>
              <div className="mt-2 space-y-1">
                {job.bullets.map((bullet, j) => (
                  <p key={j} className="text-sm text-foreground leading-relaxed">{bullet}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="border-t border-border mt-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
            <button className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground" aria-label="Edit certifications">
              <Pencil size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-foreground">{cert.name}</p>
                <p className="text-sm text-primary mt-0.5">Expires: {cert.expires}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="border-t border-border mt-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Education</h3>
            <button className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground" aria-label="Edit education">
              <Pencil size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-foreground">{edu.school}</p>
                <p className="text-sm text-primary mt-0.5">{edu.degree}</p>
                <p className="text-sm text-foreground">{edu.years}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
