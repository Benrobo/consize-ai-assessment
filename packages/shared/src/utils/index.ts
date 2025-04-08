import useCatchErrors from "./error.js";
import { HttpException, WorkersException } from "./exception.js";
import { validateSchema } from "./validate-zod-schema.js";
import ZodValidation from "./zodValidation.js";
import { BaseResponseType } from "../types/index.types.js";

const lowerCase = (str: string) => {
  if (!str) return str;
  return str.toLowerCase();
};

export const extractAxiosResponseData = <T>(
  res: any | null,
  type: "success" | "error"
) => {
  if (type === "error") {
    return res?.response?.data as BaseResponseType<T>;
  }
  return res as BaseResponseType<T>;
};

export default {
  lowerCase,
  HttpException,
  WorkersException,
  useCatchErrors,
  validateSchema,
  ZodValidation,
};
