import { scrapeJobs } from "./scrape-jobs.bg.js";
import { runEvery6Hours } from "./every-six-hours.cron.js";

export default {
  runEvery6Hours,
  scrapeJobs,
};
