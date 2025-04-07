import express, { Request, Response } from "express";
import utils from "@consizeai/shared/utils";
import { indeed } from "./services/index.js";
import { scraperSchema } from "./utils/zod-schema.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello from Scraper Server",
  });
});

router.post(
  `/scrape`,
  utils.validateSchema(scraperSchema) as any,
  utils.useCatchErrors(async (req: Request, res: Response) => {
    const validSources = ["indeed"] as const;
    const source = req.query["source"] as (typeof validSources)[number];

    if (!validSources.includes(source)) {
      res.status(400).json({
        message: "Invalid scraper source",
      });
      return;
    }

    if (source === "indeed") await indeed.getJobListing(req, res);
  })
);

router.get(
  `/scrape/:id`,
  utils.useCatchErrors(async (req: Request, res: Response) => {
    const validSources = ["indeed"] as const;
    const source = req.query["source"] as (typeof validSources)[number];

    if (!validSources.includes(source)) {
      res.status(400).json({
        message: "Invalid scraper source",
      });
      return;
    }

    if (source === "indeed") await indeed.getJobDetails(req, res);
  })
);

export default router;
