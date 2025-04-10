import { prisma } from "@consizeai/db";
import { WorkersException } from "@consizeai/shared/utils/exception";
import { Request, Response } from "express";
import {
  VALID_JOBS_SOURCE_COUNTRIES,
  VALID_SOURCES,
} from "@consizeai/shared/constant";
import axios, { head } from "axios";
import { env } from "../config/env";
import { BaseResponseType } from "@consizeai/shared/types/index.types.js";
import { extractAxiosResponseData } from "@consizeai/shared/utils";
import { logger } from "@trigger.dev/sdk/v3";
import {
  JobDetailsResp,
  JobListingResp,
} from "@consizeai/shared/types/scraper.types.js";
import shortUUID from "short-uuid";

type ScrapingProps = {
  query: string;
  country: string;
  location?: string;
  page: number;

  progressId: string; // not required for scraping
};

export class IndeedJobProcessor {
  private constructListingSearchUrl(props: {
    q: string;
    cn: string;
    loc?: string;
    page: number;
  }) {
    const { q, cn, loc, page } = props;
    const searchUrl = VALID_JOBS_SOURCE_COUNTRIES["indeed"].find(
      (c) => c.name.toLowerCase() === cn.toLowerCase()
    );
    const baseUrl = `https://${searchUrl?.pathname}/jobs`;
    const queryParams = new URLSearchParams({
      q,
    });
    if (loc) queryParams.set("rbl", loc);
    if (loc) queryParams.set("rbl", loc);
    if (page) queryParams.set("start", `${page * 10}`);
    return `${baseUrl}?${queryParams.toString()}`;
  }

  async scrapeJobListing(progressId: string, type: string) {
    if (!type || !progressId) {
      throw new Error("Missing type or progressId");
    }
    const progress = await prisma.jobProfileScrapingProgress.findUnique({
      where: {
        id: progressId as string,
      },
      include: {
        jobProfile: true,
      },
    });

    if (!progress) {
      throw new WorkersException("INVALID_JOB_PROGRESS_ID", {
        message: `invalid progress id of "${progressId}"`,
      });
    }

    const payload = {
      country: progress.jobProfile.country,
      query: progress.jobProfile.query,
      location: progress.jobProfile.location,
      progressId: progress.id,
      page: progress.page,
    };
    const { query, country, location, page } = payload;
    const searchUrl = this.constructListingSearchUrl({
      q: query,
      cn: country,
      loc: location,
      page,
    });

    logger.log(`Scraping job listing: [page: ${page}], [url: ${searchUrl}]`);

    try {
      const source = "indeed";
      const sourceType = "listing";
      const req = await axios.post(
        `${env.API_GATEWAY_URL}/scraper/scrape?source=${source}&s_type=${sourceType}`,
        {
          url: searchUrl,
        },
        {
          timeout: 600000,
        }
      );

      const resp = extractAxiosResponseData<JobListingResp>(
        req.data,
        "success"
      )?.data;

      logger.log("scrapped-data", resp);

      await prisma.$transaction(async (tx) => {
        // add listing  to db
        if (resp?.job_listings) {
          for (const j of resp?.job_listings) {
            if (j.job_id) {
              await tx.job.create({
                data: {
                  id: shortUUID.generate(),
                  job_id: j.job_id,
                  title: j.title,
                  location: j.location,
                  source: source,
                  company_name: j.company_name,
                  date_posted: j.date_posted,
                  link: j.link,
                  short_description: j.short_description,
                  budget: j.budget,
                  job_type: j.job_type,
                  status: "completed",
                },
              });
            } else {
              console.log(
                `Discovered scraped job data without job ID: '${j.company_name}', source=${source}`
              );
            }
          }

          // update job progress status
          await tx.jobProfileScrapingProgress.update({
            where: {
              id: progressId,
            },
            data: {
              status: "completed",
            },
          });
        }
      });

      logger.info(`✅ Successfully scraped ${resp?.total_jobs} successfully`);
    } catch (e: any) {
      logger.info(`🚨 Something went wrong`);
      console.log(e);
      const err = extractAxiosResponseData<any>(e, "error");
      throw new Error(JSON.stringify(err, null, 2));
    }
  }

  async scrapeJobDetails(jobId: string) {
    if (!jobId) {
      throw new Error("Missing job ID");
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      throw new WorkersException("INVALID_JOB_ID", {
        message: `invalid job id of "${jobId}"`,
      });
    }

    logger.info(`Scraping job details for ${job.title} ${job.company_name}`);

    try {
      const source = "indeed";
      const sourceType = "details";
      const url = `https://www.indeed.com/viewjob?jk=${job.job_id}`;
      const req = await axios.post(
        `${env.API_GATEWAY_URL}/scraper/scrape?source=${source}&s_type=${sourceType}`,
        {
          url,
        },
        {
          timeout: 600000,
        }
      );

      const resp = extractAxiosResponseData<JobDetailsResp>(
        req.data,
        "success"
      )?.data;

      logger.log("scrapped-data", resp);
    } catch (e: any) {
      logger.info(`🚨 Something went wrong`);
      console.log(e);
      const err = extractAxiosResponseData<any>(e, "error");
      throw new Error(JSON.stringify(err, null, 2));
    }
  }
}
