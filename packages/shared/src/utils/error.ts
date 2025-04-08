import { Prisma } from "@prisma/client";
import { HttpException } from "./exception.js";
import sendResponse from "./send-response.js";
import { NextFunction, Request, Response } from "express";

export default function useCatchErrors(fn: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await fn(req, res, next);
    } catch (err: any) {
      console.log(`😥 Error: ${err?.message}`);
      console.log(err);
      if (
        err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Prisma.PrismaClientUnknownRequestError ||
        err instanceof Prisma.PrismaClientValidationError
      ) {
        return sendResponse.error(res, "INTERNAL SERVER ERROR", 500, err);
      }
      if (err instanceof HttpException) {
        return sendResponse.error(res, err.message, err.statusCode, err);
      }

      return sendResponse.error(res, "INTERNAL SERVER ERROR", 500, err);
    }
  };
}
