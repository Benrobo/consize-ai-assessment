import { indeed } from "../services";
import { convertHtmlToMarkdown } from "../utils/html-to-md";
import fs from "fs";
import { AIModelsRouter } from "@consizeai/shared/ai-models-router";
import env from "../config/env.js";

(async () => {
  const aiRouter = new AIModelsRouter([
    {
      apiKeys: env.GEMINI_API_KEYS,
      maxRetries: 3,
      model: "gemini-2.0-flash-exp",
      provider: "gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    },
  ]);
})();
