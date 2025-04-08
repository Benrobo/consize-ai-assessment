import zod from "zod";

export const createJobProfileSchema = zod.object({
  body: zod.object({
    query: zod.string(),
    location: zod.string().optional(),
    country: zod.string(),
    pages: zod.number().min(1), // max num of paginated pages to scrape
    invokeJob: zod.boolean().optional(),
  }),
  params: zod.object({
    source: zod.string(),
  }),
});
