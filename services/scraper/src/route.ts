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
    const validTypes = ["indeed"] as const;
    const type = req.query["type"] as (typeof validTypes)[number];

    if (!validTypes.includes(type as (typeof validTypes)[number])) {
      res.status(400).json({
        message: "Invalid scraper type",
      });
      return;
    }

    if (type === "indeed") await indeed.init(req, res);
  })
);

export default router;
