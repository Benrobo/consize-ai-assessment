import { indeed } from "../services";
import { convertHtmlToMarkdown } from "../utils/html-to-md";
import fs from "fs";
import { AIModelsRouter } from "@consizeai/shared/ai-models-router";
import env from "../config/env.js";

// console.log(convertHtmlToMarkdown(htmlData));
// fs.writeFileSync("job.md", convertHtmlToMarkdown(htmlData));

// const username = "benrobo_dqnmn";
// const password = "Benrobotut71=";

// console.log(Buffer.from(`${username}:${password}`).toString("base64"));

(async () => {
  //   const resp = await indeed.scrape(
  //     "https://www.indeed.com/jobs?q=full+stack+engineer"
  //   );
  //   fs.writeFileSync("job-3.md", convertHtmlToMarkdown(resp.data!));

  const aiRouter = new AIModelsRouter([
    {
      apiKeys: env.GEMINI_API_KEYS,
      maxRetries: 3,
      model: "gemini-2.0-flash-exp",
      provider: "gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    },
  ]);

  //   const response = await aiRouter.generate({
  //     prompt: "what is TMA, SAM, SOM?",
  //   });

  //   console.log(response);
})();
