import zod from "zod";

export const scraperSchema = zod.object({
  body: zod.object({
    url: zod.string().url(),
  }),
});
