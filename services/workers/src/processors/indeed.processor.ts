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

type ScrapingProps = {
  query: string;
  country: string;
  location?: string;
};

export class IndeedJobProcessor {
  private constructSearchUrl(props: { q: string; cn: string; loc?: string }) {
    const { q, cn, loc } = props;
    const searchUrl = VALID_JOBS_SOURCE_COUNTRIES["indeed"].find(
      (c) => c.name.toLowerCase() === cn.toLowerCase()
    );
    const baseUrl = `https://${searchUrl?.pathname}`;
    const queryParams = new URLSearchParams({
      q,
    });
    if (loc) queryParams.set("rbl", loc);
    if (loc) queryParams.set("rbl", loc);
    return encodeURIComponent(`${baseUrl}?${queryParams.toString()}`);
  }

  async scrapeJobListing(props: ScrapingProps) {
    const { query, country, location } = props;
    const searchUrl = this.constructSearchUrl({
      q: query,
      cn: country,
      loc: location,
    });

    const req = await axios.post(
      `${env.API_GATEWAY_URL}/scraper/scrape?type=indeed&s_type=listing`,
      {
        url: searchUrl,
      }
    );

    const resp = extractAxiosResponseData(req.data, "success")?.data;

    console.log(resp);
  }

  async scrapeJobDetails(props: ScrapingProps) {}

  async init(progressId: string, type: string) {
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
    };

    if (type === "listing") {
      await this.scrapeJobListing(payload);
    } else {
      await this.scrapeJobDetails(payload);
    }
  }
}
