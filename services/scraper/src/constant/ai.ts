import { AIModelsRouter } from "@consizeai/shared/ai-models-router";
import env from "../config/env.js";

const aiRouter = new AIModelsRouter([
  {
    apiKeys: env.GEMINI_API_KEYS,
    maxRetries: 3,
    model: "gemini-2.0-flash-exp",
    provider: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  },
]);

export default aiRouter;
