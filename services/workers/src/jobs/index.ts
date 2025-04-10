import { scrapeJobs } from "./scrape-jobs.bg.js";
import { runEvery6Hours, runEvery5Minutes } from "./job-sync.cron.js";

export default {
  runEvery6Hours,
  runEvery5Minutes,
  scrapeJobs,
};
