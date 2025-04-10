import { prisma } from "@consizeai/db";
import { JobWorkers } from "@consizeai/workers";
import { WorkersException } from "@consizeai/shared/utils/exception";

const MAX_SCRAPE_JOBS = 5;
const MAX_SCRAPE_JOBS_PER_PROFILE = 5;

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

export async function triggerScrapeJobDetails() {
  const scrapedJobs = await prisma.job.findMany({
    where: {
      details_status: {
        in: ["pending", "failed", "queued"],
      },
    },
  });

  if (!scrapedJobs.length) {
    // throw new WorkersException("ERR_EMPTY_JOBS_SCRAPED", {
    //   message: "No scraped jobs to scrape",
    // });
    console.info(`No Scraped Jobs to process job details.`);
    return;
  }

  const emptyJobDetails = scrapedJobs.filter(
    (job) => !job.details || job.details === null
  );
  const jobsProfilesToScrape = emptyJobDetails.slice(
    0,
    MAX_SCRAPE_JOBS_PER_PROFILE
  );

  for (const [i, job] of jobsProfilesToScrape.entries()) {
    await JobWorkers.scrapeJobs.trigger(
      {
        type: "details",
        source: job.source as any,
        jobId: job.id,
      },
      {
        delay: i === 0 ? "1s" : `${i * 5}m`,
        ttl: "2h",
      }
    );
  }
  console.log(`🔃 Scraping ${jobsProfilesToScrape.length} job details`);
}
