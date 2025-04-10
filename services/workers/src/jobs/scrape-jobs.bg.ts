import { logger, task } from "@trigger.dev/sdk/v3";
import { IndeedJobProcessor } from "../processors/indeed.processor.js";
import { WorkersException } from "@consizeai/shared/utils/exception.js";
import { prisma } from "@consizeai/db";

type ScrapeJobPayload = {
  jobProgressId?: string;
  type: "listing" | "details";
  source: string;

  // details job ONLY
  jobId?: string;
};

const indeedJobProcessor = new IndeedJobProcessor();

export const scrapeJobs = task({
  id: "scrape-jobs",
  onFailure: async (payload: ScrapeJobPayload, error, params) => {
    console.log(`🚨 An Error occured. ${JSON.stringify(payload, null, 2)}`);
    if (error instanceof WorkersException)
      logger.error(error?.message, error?.data);

    // update database
    const progressExists = await prisma.jobProfileScrapingProgress.findFirst({
      where: {
        profile_id: payload?.jobProgressId,
      },
    });

    if (!progressExists) {
      console.warn(`Job progress '${payload?.jobProgressId}' not found`);
    } else {
      await prisma.jobProfileScrapingProgress.update({
        where: {
          id: payload?.jobProgressId,
        },
        data: {
          status: "failed",
          error: error as any,
          error_page: null,
        },
      });
    }
  },
  run: async (payload, params) => {
    logger.log(`Running job [scrape-jobs]`, { payload, params });

    if (payload.type === "listing" && payload.jobProgressId) {
      await indeedJobProcessor.scrapeJobListing(
        payload.jobProgressId,
        payload.type
      );
    }
    if (payload.type === "details" && payload.jobId) {
      await indeedJobProcessor.scrapeJobDetails(payload.jobId);
    }
  },
});
