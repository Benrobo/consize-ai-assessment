import { logger, task } from "@trigger.dev/sdk/v3";
import { IndeedJobProcessor } from "../processors/indeed.processor.js";

type ScrapeJobPayload = {
  jobProgressId: string;
  type: "listing" | "details";
  source: string;
};

const indeedJobProcessor = new IndeedJobProcessor();

export const scrapeJobs = task({
  id: "scrape-jobs",
  onFailure: async (payload: ScrapeJobPayload, error, params) => {},
  run: async (payload, params) => {
    logger.log(`Running job [scrape-jobs]`, { payload, params });

    if (payload.source === "indeed") {
      await indeedJobProcessor.init(payload.jobProgressId, payload.type);
    }
  },
});
