import express, { Request, Response } from "express";
import utils from "@consizeai/shared/utils";
import { authMiddlewares } from "@consizeai/shared/middlewares";
import { createJobProfileSchema } from "../utils/schema-validation";
import jobController from "../controller/jobs.controller.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello from Jobs Service",
  });
});

router.post(
  `/jobProfileList/:source`,
  utils.validateSchema(createJobProfileSchema) as any,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(jobController.createProfile.bind(jobController))
);

router.get(
  `/jobProfileList`,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(jobController.getProfiles.bind(jobController))
);

router.delete(
  `/jobProfileList/:profileId`,
  authMiddlewares.isAPIAuthorised,
  utils.useCatchErrors(jobController.deleteProfile.bind(jobController))
);

export default router;
