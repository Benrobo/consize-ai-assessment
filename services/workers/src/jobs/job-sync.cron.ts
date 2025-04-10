import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3";
import {
  triggerScrapeJobDetails,
  triggerScrapeJobListing,
} from "../triggers/job-triggers";
import { WorkersException } from "@consizeai/shared/utils/exception";
import { prisma } from "@consizeai/db";

export const runEvery6Hours = schedules.task({
  id: "every-six-hours",
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  cron: "0 */6 * * *", // every 6th hours
  run: async (payload: any, { ctx }) => {
    logger.log(`Running job [every 6th hours]`, { payload, ctx });

    // declare all sort of data
    await triggerScrapeJobListing();
  },
});

export const runEvery5Minutes = schedules.task({
  id: "every-5minutes",
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  cron: "*/5 * * * *", // every 5min
  onFailure: async (payload, error, params) => {
    console.log(`🚨 An Error occured. ${JSON.stringify(payload, null, 2)}`);
    if (error instanceof WorkersException)
      logger.error(error?.message, error?.data);
    else logger.error(error as any);
  },
  run: async (payload: any, { ctx }) => {
    logger.log(`Running job [every 30 minutes]`, { payload, ctx });

    // declare all sort of data
    await triggerScrapeJobDetails();
  },
});
