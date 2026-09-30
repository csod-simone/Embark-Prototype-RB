export type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
};

/** CVS Health platform user directory used by the Business Leader picker. */
export const CVS_DIRECTORY: DirectoryUser[] = [
  { id: "u-1", name: "Alex Morgan", email: "alex.morgan@cvshealth.com", role: "Facilitator", department: "Learning & Development" },
  { id: "u-2", name: "Taylor Reyes", email: "taylor.reyes@cvshealth.com", role: "Manager", department: "Member Services" },
  { id: "u-3", name: "Jordan Lee", email: "jordan.lee@cvshealth.com", role: "Manager", department: "Medicare Operations" },
  { id: "u-4", name: "Priya Raman", email: "priya.raman@cvshealth.com", role: "Director", department: "Medicare Operations" },
  { id: "u-5", name: "Marcus Bell", email: "marcus.bell@cvshealth.com", role: "Director", department: "Pharmacy Services" },
  { id: "u-6", name: "Dana Kim", email: "dana.kim@cvshealth.com", role: "Manager", department: "Pharmacy Services" },
  { id: "u-7", name: "Riley Chen", email: "riley.chen@cvshealth.com", role: "Facilitator", department: "Learning & Development" },
  { id: "u-8", name: "Sam Patel", email: "sam.patel@cvshealth.com", role: "Administrator", department: "Compliance" },
  { id: "u-9", name: "Nina Okafor", email: "nina.okafor@cvshealth.com", role: "Director", department: "Compliance" },
  { id: "u-10", name: "Casey Williams", email: "casey.williams@cvshealth.com", role: "Manager", department: "Commercial Plans" },
  { id: "u-11", name: "Elliot Nguyen", email: "elliot.nguyen@cvshealth.com", role: "Director", department: "Commercial Plans" },
  { id: "u-12", name: "Morgan Davis", email: "morgan.davis@cvshealth.com", role: "Manager", department: "Provider Relations" },
  { id: "u-13", name: "Avery Clark", email: "avery.clark@cvshealth.com", role: "Director", department: "Provider Relations" },
  { id: "u-14", name: "Jamie Thompson", email: "jamie.thompson@cvshealth.com", role: "Manager", department: "Sales & Distribution" },
  { id: "u-15", name: "Drew Martinez", email: "drew.martinez@cvshealth.com", role: "Director", department: "Sales & Distribution" },
  { id: "u-16", name: "Quinn Robinson", email: "quinn.robinson@cvshealth.com", role: "Facilitator", department: "Member Services" },
  { id: "u-17", name: "Blake Lewis", email: "blake.lewis@cvshealth.com", role: "Manager", department: "Dental & Vision" },
  { id: "u-18", name: "Sofia Alvarez", email: "sofia.alvarez@cvshealth.com", role: "Director", department: "Dental & Vision" },
  { id: "u-19", name: "Harper Singh", email: "harper.singh@cvshealth.com", role: "Administrator", department: "Operations" },
  { id: "u-20", name: "Owen Brady", email: "owen.brady@cvshealth.com", role: "Manager", department: "Operations" },
];

export const CVS_DEPARTMENTS = Array.from(
  new Set(CVS_DIRECTORY.map((u) => u.department)),
).sort();

export const CVS_ROLES = Array.from(new Set(CVS_DIRECTORY.map((u) => u.role))).sort();

export const directoryUser = (id: string) => CVS_DIRECTORY.find((u) => u.id === id);