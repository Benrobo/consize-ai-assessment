import { ZodSchema } from "zod";
import sendResponse from "./send-response.js";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "./exception.js";

export function validateSchema(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      let body = {};

      if (req.method !== "GET") {
        body = req.body;
      }

      const validatedData = schema.safeParse({ body, params });

      console.log(validatedData);

      if (!validatedData.success) {
        const issues = validatedData.error?.issues;
        const msg =
          issues?.length > 0
            ? issues[0]?.message && issues[0]?.message === "Required"
              ? "VALIDATION ERROR"
              : issues[0]?.message
            : validatedData.error?.message ?? "VALIDATION ERROR";
        return sendResponse.error(res, msg, 400, validatedData.error);
      }

      // @ts-expect-error
      req["validatedData"] = validatedData.data;
      next();
    } catch (error) {
      console.log({ error });
      return sendResponse.error(res, "Invalid request data", 400, error);
    }
  };
}
