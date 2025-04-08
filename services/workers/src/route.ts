import express, { Request, Response } from "express";
import utils from "@consizeai/shared/utils";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello from Worker Micro Service",
  });
});

export default router;
