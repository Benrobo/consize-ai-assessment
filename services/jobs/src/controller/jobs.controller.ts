import { Request, Response } from "express";
import shortUUID from "short-uuid";
import { HttpException } from "@consizeai/shared/utils/exception";
import { prisma } from "@consizeai/db";
import sendResponse from "@consizeai/shared/utils/send-response";
import {
  VALID_JOBS_SOURCE_COUNTRIES,
  VALID_SOURCES,
} from "@consizeai/shared/constant";

type PaginationQuery = {
  page: string;
  limit: string;
};

export class JobController {
  constructor() {}

  async getJobs(req: Request, res: Response) {
    const paginations = req.query as PaginationQuery;
    const page = Number(paginations.page ?? 1);
    const limit = Number(paginations?.limit ?? 20);

    const totalJobs = await prisma.job.count({
      where: {
        // details_status: "completed",
        // status: "completed",
      },
    });
    const jobs = await prisma.job.findMany({
      where: {
        // details_status: "completed",
        // status: "completed",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return sendResponse.success(res, "Jobs retrieved successfully", 201, {
      jobs,
      pagination: {
        totalPage: Math.ceil(totalJobs / limit),
        totalJobs,
        page,
      },
    });
  }

  async getLatestJobs(req: Request, res: Response) {
    const paginations = req.query as PaginationQuery;
    const page = Number(paginations.page ?? 1);
    const limit = Number(paginations?.limit ?? 20);

    const totalJobs = await prisma.job.count({
      where: {
        details_status: "completed",
        status: "completed",
      },
      take: limit,
      orderBy: {
        created_at: "asc",
      },
    });
    const latestJobs = await prisma.job.findMany({
      where: {
        details_status: "completed",
        status: "completed",
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        created_at: "asc",
      },
    });

    return sendResponse.success(
      res,
      "Latest jobs retrieved successfully",
      201,
      {
        jobs: latestJobs,
        pagination: {
          totalPage: Math.ceil(totalJobs / limit),
          totalJobs,
          page,
        },
      }
    );
  }

  async getJobDetails(req: Request, res: Response) {
    const jobId = req.params["id"];
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new HttpException("Job not found", 404);
    }

    return sendResponse.success(res, "Jobs retrieved successfully", 201, job);
  }
}

const jobController = new JobController();

export default jobController;
