export type JobListingResp = {
  source: "indeed";
  total_jobs: number;
  job_listings: Array<{
    job_id: string;
    link: string;
    title: string;
    job_type: string;
    company_name: string;
    location: string;
    date_posted: string;
    short_description: string;
    budget: string;
  }>;
};

export type JobDetailsResp = {
  role: string;
  datePosted: string;
  company_info: {
    name: string;
    url: string | null;
    logo: string | null;
  };
  location: string;
  work_setting: string | null;
  type: string | null;
  pay: string;
  full_details: {
    about_company: string;
    about_role: string;
    responsibilities: string[];
    applicants_requirements: string[];
    bonus_skills_or_experience: string[] | null;
    compensation_and_perks: string[] | null;
    benefits: string[] | null;
    tech_stacks: Array<{
      name: string;
      type: string;
      optionality: "required" | "preferred" | "optional";
    }> | null;
  };
  rating: number | null;
};
