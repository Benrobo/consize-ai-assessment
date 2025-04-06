import useCatchErrors from "./error.js";
import { HttpException } from "./exception.js";
import { validateSchema } from "./validate-zod-schema.js";
import ZodValidation from "./zodValidation.js";

const lowerCase = (str: string) => {
  if (!str) return str;
  return str.toLowerCase();
};

export default {
  lowerCase,
  HttpException,
  useCatchErrors,
  validateSchema,
  ZodValidation,
};
