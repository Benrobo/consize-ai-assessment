import { prisma } from "@consizeai/db";
import { JobWorkers } from "@consizeai/workers";
import { WorkersException } from "@consizeai/shared/utils/exception";

const MAX_SCRAPE_JOBS = 5;
const MAX_SCRAPE_JOBS_PER_PROFILE = 2;

export async function triggerScrapeJobListing() {
  const jobProfiles = await prisma.jobProfile.findMany({
    where: {
      status: {
        in: ["pending", "failed"],
      },
    },
  });

  if (!jobProfiles.length) {
    throw new WorkersException("ERR_EMPTY_JOB_PROFILE", {
      message: "No job profiles to scrape",
    });
  }

  const jobsProfilesToScrape = jobProfiles.slice(
    0,
    MAX_SCRAPE_JOBS_PER_PROFILE
  );

  for (const profile of jobsProfilesToScrape) {
    const jobsToScrape = await prisma.jobProfileScrapingProgress.findMany({
      where: {
        profile_id: profile.id,
        status: {
          in: ["pending", "failed"],
        },
      },
      take: MAX_SCRAPE_JOBS,
    });

    if (!jobsToScrape.length) {
      throw new WorkersException("ERR_EMPTY_JOBS", {
        message: "jobsToScrape is empty",
      });
    }

    for (let i = 0; i < jobsToScrape.length; i++) {
      const job = jobsToScrape[i];
      await JobWorkers.scrapeJobs.trigger(
        {
          jobProgressId: job.id,
          type: "listing",
          source: job.source as any,
        },
        {
          delay: i === 0 ? "1s" : `${i * 5}m`,
          ttl: "2h",
        }
      );
    }

    console.log(
      `🔃 Scraping ${jobsToScrape.length} jobs for profile ${profile.id}`
    );
  }
}
