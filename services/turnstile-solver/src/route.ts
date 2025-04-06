import express, { Request, Response } from "express";
import cfTurnstileSolver from "./cf-solver.js";
import utils from "@consizeai/shared/utils";
import { captchaSchema } from "./zod-schema.js";

const router = express.Router();

router.post(
  `/solve`,
  utils.validateSchema(captchaSchema) as any,
  utils.useCatchErrors(async (req: Request, res: Response) => {
    const type = req.query["type"];
    const validTypes = ["cf"] as const;

    if (!validTypes.includes(type as (typeof validTypes)[number])) {
      res.status(400).json({
        message: "Invalid type",
      });
      return;
    }

    if (type === "cf") await cfTurnstileSolver.init(req, res);
  })
);

export default router;
