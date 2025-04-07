import { LLMPromptBuilder } from "@consizeai/shared/helpers";

export const extractJobMetadataPrompt = (md: string) => {
  const prompt = new LLMPromptBuilder()
    .addInstruction(
      `You are a smart extraction agent. Given a job listing page’s content (converted from HTML to Markdown), extract only valid metadata for jobs explicitly present in the content. Do not guess or hallucinate missing information.`
    )
    .addPlainText("Here is the provided markdown:")
    .addCustomBlock("job_markdown_content", md)
    .addRule(
      `- job_id: Extract from the jk=xxxxx param in the job link.
- Do not guess. If a field like budget is not explicitly in the text for eg it contains 'Pay information not provided', simply set it to null.
- total_jobs: If the total number of jobs is clearly stated (e.g., "6,000 jobs"), extract it as a number.
- Parse accurately. Be strict and do not fabricate values.`
    )
    .addCustomBlock(
      `response_format`,
      `
Return the following JSON structure:
{
  "total_jobs": number,
  "job_listings": [
    {
      "job_id": "string",  // Extract from "jk=xxxx" inside the job link
      "link": "string",    // Full job link or relative path if full not available
      "title": "string",
      "job_type": "string",
      "company_name": "string",
      "location": "string",
      "budget": "string",
      "date_posted": "string",
      "short_description": "string",
    }
  ]
}
`
    )
    .compose();

  return prompt;
};

export const extractJobDetailsPrompt = (md: string) => {
  const prompt = new LLMPromptBuilder()
    .addInstruction(
      `You are a smart extraction agent. Given a job listing’s full content (converted from HTML to Markdown), extract structured metadata in JSON format. Only extract information that is explicitly stated in the content. Do not guess or hallucinate missing details.`
    )
    .addPlainText("Here is the provided markdown:")
    .addCustomBlock("job_markdown_content", md)
    .addRule(
      `- All values must be pulled directly from the text. If something is not clearly mentioned, return null (for nullable fields) or an empty array (for list-type fields).
- "type" can be any valid job type (e.g., full-time, part-time, contract, freelance, internship, etc.) or null if not present.
- All extracted text must be clean, free of grammatical errors or broken phrasing.
- Do not format output as markdown. Return clean, plain JSON only.
- Do not infer values. Only extract what is actually present in the job listing.
- Identify responsibilities dynamically from sections that describe the role's duties or expectations.
- Extract all mentions of bonuses and categorize them by type. Only include a bonus if there are sufficient details to describe it.
- If none of the bonuses have meaningful details, return the "bonuses" array as an empty array.
- "bonus_skills_or_experience" refers to optional or nice-to-have qualifications. Only include if clearly stated.
- "work_setting" should identify the job’s work location type, such as:
    - "remote" if the job is fully remote
    - "hybrid" if it’s a combination of remote and in-person work
    - "in-person" if the job requires being on-site
    - "other" if no specific type is mentioned or it’s something else (e.g., location-based flexibility).
- "tech_stacks" must be an array of objects. Each object must include:
  - "name": the technology, language, tool, or platform
  - "type": the category, such as "language", "framework", "cloud", "database", etc.
  - "optionality": one of "required", "preferred", or "optional", based on how it is referenced in the listing (NOT ALL OR EVERY TECHNOLOGIES would be REQUIRED. BE SMART!!).`
    )
    .addCustomBlock(
      "response_format",
      `
Return the following JSON structure with these field purposes:

{
  "role": "string",  // The title or position being hired for, e.g., "Software Engineer"
  "company_info": {
    "name": "string",  // Company name as shown in the listing
    "url": "string | null",  // The company website if listed, or null
    "logo": "string | null"  // A direct link to the company logo image if available
  },
  "location": "string",  // Job location, e.g., "New York, NY" or "Remote"
  "work_setting": "string | null",  // Job's work setting: remote, hybrid, in-person, or other
  "type": "string | null",  // Type of employment: full-time, part-time, contract, freelance, etc. Null if not stated
  "pay": "string",  // Salary or pay info as listed, e.g., "$60k/year", or null if not provided
  "full_details": {
    "about_company": "string",  // Description of the company
    "about_role": "string",  // Overview of the role and expectations
    "responsibilities": string[],  // Key duties and responsibilities the applicant will perform
    "applicants_requirements": string[],  // Required skills, experience, or qualifications
    "tech_stacks": [
      {
        "name": "string",  // The name of the technology (e.g., React, AWS)
        "type": "string",  // Type/category: "language", "framework", "cloud", "tool", etc.
        "optionality": "required" | "preferred" | "optional"  // Based on how it’s referenced in the listing
      }
    ] | null,
    "bonus_skills_or_experience": string[] | null,  // Optional or preferred qualifications (nice-to-haves), or null if not present
    "compensation_and_perks": string[] | null,  // Perks like equity, bonuses, etc.
    "benefits": string[] | null,  // Health, PTO, retirement, etc.
  },
  "rating": number | null  // Employer or company rating, if provided (e.g., 4.2), otherwise null
}
`
    )
    .compose();

  return prompt;
};
