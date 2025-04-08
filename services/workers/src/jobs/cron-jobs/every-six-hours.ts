import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3";

export const runEvery6Hours = schedules.task({
  id: "every-six-hours",
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  cron: "0 */6 * * *", // every 6th hours
  run: async (payload: any, { ctx }) => {
    logger.log(`Running job [every 6th hours]`, { payload, ctx });

    // declare all sort of data
  },
});
