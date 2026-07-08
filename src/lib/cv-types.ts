export type CvPersonalDetails = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  linkedin: string;
};

export type CvEducationItem = {
  qualification: string;
  institution: string;
  start_year: string;
  end_year: string;
  description: string;
};

export type CvWorkItem = {
  role: string;
  employer: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type CvReferenceItem = {
  name: string;
  relationship: string;
  contact: string;
};

export type CvVolunteerItem = {
  role: string;
  organisation: string;
  description: string;
};

export type CvTemplate = "classic" | "modern";

export type CvProfileData = {
  personal_details: CvPersonalDetails;
  professional_summary: string;
  education: CvEducationItem[];
  work_experience: CvWorkItem[];
  skills: string[];
  languages: string[];
  references: CvReferenceItem[];
  achievements: string[];
  volunteer_work: CvVolunteerItem[];
  certificates: string[];
  interests: string[];
  selected_template: CvTemplate;
};

export const EMPTY_CV: CvProfileData = {
  personal_details: { full_name: "", phone: "", email: "", address: "", linkedin: "" },
  professional_summary: "",
  education: [],
  work_experience: [],
  skills: [],
  languages: [],
  references: [],
  achievements: [],
  volunteer_work: [],
  certificates: [],
  interests: [],
  selected_template: "classic",
};
