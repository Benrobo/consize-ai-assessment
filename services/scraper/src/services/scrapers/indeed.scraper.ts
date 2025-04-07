import { Request, Response } from "express";
import scraperDo, { ScraperDoService } from "../scraper-do.service";
import { convertHtmlToMarkdown } from "../../utils/html-to-md.js";
import { extractJobMetadataPrompt } from "../../constant/ai-prompts/indeed.prompt.js";
import aiRouter from "../../constant/ai";
import retry from "async-retry";
import { cleanLLMJson } from "@consizeai/shared/helpers";
import sendResponse from "@consizeai/shared/utils/send-response";
import { HttpException } from "@consizeai/shared/utils/exception";

type JobListingResp = {
  total_jobs: number;
  job_listings: {
    job_id: string;
    link: string;
    title: string;
    job_type: string;
    company_name: string;
    location: string;
    date_posted: string;
    short_description: string;
  }[];
};

class IndeedScraperService {
  private scraperDo: ScraperDoService;
  constructor() {
    this.scraperDo = scraperDo;
  }

  async scrapeJobListing(url: string) {
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

        return cleanResp;
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

  async init(req: Request, res: Response) {
    const { url } = req.body;
    const queries = req.query;
    const scrapingTypes = ["listing", "details"] as const;
    const s_type = queries["s_type"] as (typeof scrapingTypes)[number];

    if (!scrapingTypes.includes(s_type)) {
      throw new HttpException(
        `Invalid scraping type. Expected {${scrapingTypes.join(", ")}}.`,
        400
      );
    }

    switch (s_type) {
      case "listing":
        const resp = await this.scrapeJobListing(url);
        return sendResponse.success(res, "scrapped successfully", 200, resp);
      default:
        break;
    }
  }
}

const indeedScraperService = new IndeedScraperService();

export default indeedScraperService;
