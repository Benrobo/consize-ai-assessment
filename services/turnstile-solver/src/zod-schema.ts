import zod from "zod";

export const captchaSchema = zod.object({
  body: zod.object({
    url: zod.string().url(),
  }),
});
