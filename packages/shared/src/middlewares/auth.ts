import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/exception.js";
import sendResponse from "../utils/send-response.js";

async function isAPIAuthorised(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.headers["x-consize-token"];

    if (!apiKey || apiKey !== process.env.X_CONSIZE_API_KEY) {
      throw new HttpException("Unauthorized", 403);
    }

    next();
  } catch (e: any) {
    console.log(e);
    sendResponse.error(res, "Unauthorized", e?.statusCode, e);
  }
}

export default {
  isAPIAuthorised,
};
