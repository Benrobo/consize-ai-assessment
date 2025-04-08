import { Request, Response } from "express";
import shortUUID from "short-uuid";
import { VALID_JOBS_SOURCE_COUNTRIES, VALID_SOURCES } from "../constant/job";
import { HttpException } from "@consizeai/shared/utils/exception";
import { prisma } from "@consizeai/db";
import sendResponse from "@consizeai/shared/utils/send-response";

type CreateProfilePayload = {
  query: string;
  country: string;
  location: string;
  invokeJob?: boolean;
  pages: number;
};

export class JobController {
  private validateSourceCountry(
    country: string,
    source: (typeof VALID_SOURCES)[number]
  ) {
    const countryValid = VALID_JOBS_SOURCE_COUNTRIES[source].find(
      (c) => c.name.toLowerCase() === country.toLowerCase()
    );

    if (!countryValid) {
      throw new HttpException(
        "Invalid source supported country provided",
        400,
        {
          supportedCountries: VALID_JOBS_SOURCE_COUNTRIES[source]
            .map((c) => c.name)
            .join(", "),
        }
      );
    }
  }

  async createProfile(req: Request, res: Response) {
    const source = req.params["source"] as (typeof VALID_SOURCES)[number];
    const payload = req.body as CreateProfilePayload;

    if (!VALID_SOURCES.includes(source)) {
      throw new HttpException(
        `Invalid job profile source. expected {${VALID_SOURCES.join(", ")}}`,
        400
      );
    }

    if (!payload.country.length || !payload.query.length) {
      throw new HttpException(
        `Invalid payload. missing "country or location or query"`,
        400
      );
    }

    this.validateSourceCountry(payload.country, source);

    // check duplicate profiles
    const profileExist = await prisma.jobProfile.findFirst({
      where: {
        query: payload.query,
        location: payload.location,
        country: payload.country,
      },
    });

    if (profileExist) {
      throw new HttpException("Duplicate job profile detected", 400, {
        profile: profileExist?.id,
      });
    }

    await prisma.$transaction(async (tx) => {
      const profileId = shortUUID.generate();
      await tx.jobProfile.create({
        data: {
          id: profileId,
          country: payload.country,
          query: payload.query,
          location: payload.location ?? "",
          pages: payload.pages,
          source: source,
        },
      });

      await Promise.all(
        Array(payload.pages)
          .fill(0)
          .map(
            async (_, idx) =>
              await tx.jobProfileScrapingProgress.create({
                data: {
                  id: shortUUID.generate(),
                  source: source,
                  page: (idx += 1),
                  status: "pending",
                  profile_id: profileId,
                },
              })
          )
      );
    });

    return sendResponse.success(res, "Job profile created", 201);
  }

  async getProfiles(req: Request, res: Response) {
    const { source, country, query, location } = req.query;

    const profiles = await prisma.jobProfile.findMany({
      where: {
        ...(source && { source: source as string }),
        ...(country && { country: country as string }),
        ...(query && { query: query as string }),
        ...(location && { location: location as string }),
      },
      include: {
        jobProfileScrapingProgress: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return sendResponse.success(res, "Job profiles retrieved", 200, {
      profiles,
      count: profiles.length,
    });
  }

  async deleteProfile(req: Request, res: Response) {
    const profileId = req.params["profileId"];

    if (!profileId) {
      throw new HttpException("Profile ID is required", 400);
    }

    const profile = await prisma.jobProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new HttpException("Profile not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      // Delete all scraping progress records first
      await tx.jobProfileScrapingProgress.deleteMany({
        where: { profile_id: profileId },
      });

      // Then delete the profile
      await tx.jobProfile.delete({
        where: { id: profileId },
      });
    });

    return sendResponse.success(res, "Job profile deleted", 200);
  }
}

const jobController = new JobController();

export default jobController;
