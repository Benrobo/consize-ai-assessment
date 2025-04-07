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
