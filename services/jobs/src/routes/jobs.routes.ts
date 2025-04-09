import express, { Request, Response } from "express";
import utils from "@consizeai/shared/utils";
import { authMiddlewares } from "@consizeai/shared/middlewares";
import {} from "../utils/schema-validation";
import jobsController from "../controller/jobs.controller.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
  `/`, // this maps to /jobs
  utils.useCatchErrors(jobsController.getJobs.bind(jobsController))
);

router.get(
  `/details/:id`,
  utils.useCatchErrors(jobsController.getJobDetails.bind(jobsController))
);

router.get(
  `/latest`,
  utils.useCatchErrors(jobsController.getLatestJobs.bind(jobsController))
);

export default router;
