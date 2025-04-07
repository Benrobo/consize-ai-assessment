import { Request, Response } from "express";
import scraperDo, { ScraperDoService } from "../scraper-do.service";
import { convertHtmlToMarkdown } from "../../utils/html-to-md.js";
import {
  extractJobDetailsPrompt,
  extractJobMetadataPrompt,
} from "../../constant/ai-prompts/indeed.prompt.js";
import aiRouter from "../../constant/ai";
import retry from "async-retry";
import { cleanLLMJson } from "@consizeai/shared/helpers";
import sendResponse from "@consizeai/shared/utils/send-response";
import redis from "../../config/redis.js";

type JobListingResp = {
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
  }>;
};

type JobDetailsResp = {
  role: string;
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

class IndeedScraperService {
  private scraperDo: ScraperDoService;
  private CACHE_TTL = 60 * 60 * 24; // 24 hours

  constructor() {
    this.scraperDo = scraperDo;
  }

  private getCacheKey(type: "listing" | "details", identifier: string): string {
    return `indeed:${type}:${identifier}`;
  }

  private constructIndeedJobDetailsPage(id: string) {
    return `https://www.indeed.com/viewjob?jk=${id}`;
  }

  async scrapeJobListing(url: string) {
    const cacheKey = this.getCacheKey("listing", url);
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for job listing:", url);
      return JSON.parse(cached) as JobListingResp;
    }

    const response = await this.scraperDo.scrape(url);
    const data = response?.data;

    if (!data) {
      throw new Error("Error scraping " + url);
    }

    const markdownConversion = convertHtmlToMarkdown(data);
    const prompt = extractJobMetadataPrompt(markdownConversion);

    const result = await retry(
      async () => {
        const aiResp = await aiRouter.generate({
          prompt,
        });

        const cleanResp = cleanLLMJson({
          response: aiResp,
          requiredFields: ["total_jobs", "job_listings"],
        });

        const formatted = {
          source: "indeed",
          ...cleanResp,
        } as JobListingResp;

        // Cache the result
        await redis.set(
          cacheKey,
          JSON.stringify(formatted),
          "EX",
          this.CACHE_TTL
        );

        return formatted;
      },
      {
        retries: 3,
        onRetry: (e: any, attempt) => {
          console.log(
            `[GenAI]: Error extracting Job metadata ${url}: ${e.message}`
          );
          console.log(`Retrying attempt ${attempt}`);
        },
      }
    );

    return result;
  }

  async scrapeJobDetails(id: string) {
    const cacheKey = this.getCacheKey("details", id);
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for job details:", id);
      return JSON.parse(cached) as JobDetailsResp;
    }

    const url = this.constructIndeedJobDetailsPage(id);
    const response = await this.scraperDo.scrape(url);
    const data = response?.data;

    if (!data) {
      throw new Error("Error scraping " + url);
    }

    const markdownConversion = convertHtmlToMarkdown(data);
    const prompt = extractJobDetailsPrompt(markdownConversion);

    const result = await retry(
      async () => {
        const aiResp = await aiRouter.generate({
          prompt,
        });

        const cleanResp = cleanLLMJson({
          response: aiResp,
          requiredFields: [
            "role",
            "company_info",
            "location",
            "type",
            "pay",
            "full_details",
            "rating",
          ],
        });

        const formatted = {
          source: "indeed",
          ...cleanResp,
        } as JobDetailsResp;

        // Cache the result
        await redis.set(
          cacheKey,
          JSON.stringify(formatted),
          "EX",
          this.CACHE_TTL
        );

        return formatted;
      },
      {
        retries: 3,
        onRetry: (e: any, attempt) => {
          console.log(
            `[GenAI]: Error extracting Job metadata ${url}: ${e.message}`
          );
          console.log(`Retrying attempt ${attempt}`);
        },
      }
    );

    return result;
  }

  async getJobListing(req: Request, res: Response) {
    const { url } = req.body;
    const resp = await this.scrapeJobDetails(url);
    return sendResponse.success(res, "scrapped successfully", 200, resp);
  }

  async getJobDetails(req: Request, res: Response) {
    const params = req.params;
    const jobId = params["id"];
    const details = await this.scrapeJobDetails(jobId);
    return sendResponse.success(res, "scrapped successfully", 200, details);
  }
}

const indeedScraperService = new IndeedScraperService();

export default indeedScraperService;
