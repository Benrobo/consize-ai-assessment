import express, { Request, Response } from "express";
import utils from "@consizeai/shared/utils";
import { authMiddlewares } from "@consizeai/shared/middlewares";
import { createJobProfileSchema } from "../utils/schema-validation";
import jobController from "../controller/jobs.controller.js";
import jobProfileController from "../controller/job-profile.controller";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  `/jobProfileList/:source`,
  utils.validateSchema(createJobProfileSchema) as any,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(
    jobProfileController.createProfile.bind(jobProfileController)
  )
);

router.get(
  `/jobProfileList`,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(
    jobProfileController.getProfiles.bind(jobProfileController)
  )
);

router.delete(
  `/jobProfileList/:profileId`,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(
    jobProfileController.deleteProfile.bind(jobProfileController)
  )
);

export default router;
