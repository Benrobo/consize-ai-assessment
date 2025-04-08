import { task } from "@trigger.dev/sdk/v3";

type ScrapeJobPayload = {
  queueId: string;
};

export const scrapeJobs = task({
  id: "scrape-jobs",
  onFailure: async (payload: ScrapeJobPayload, error, params) => {},
  run: async (payload, params) => {},
});
