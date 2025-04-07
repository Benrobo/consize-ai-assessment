import { OpenAI } from "openai";
import retry from "async-retry";

export type Provider = "openai" | string;

export type AIModelConfig = {
  provider: string;
  model: string;
  apiKeys: string[];
  maxRetries?: number;
} & (
  | { provider: "openai"; baseURL?: string }
  | { provider: Exclude<string, "openai">; baseURL: string }
); // make baseURL required for other providers aside openai

interface GenerateOptions {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

export default class AIModelRouter {
  private configs: AIModelConfig[];
  private currentConfigIndex = 0;
  private apiKeyIndices: Record<number, number> = {};

  constructor(configs: AIModelConfig[]) {
    if (!configs.length) throw new Error("No model configs provided");
    this.configs = configs;
    configs.forEach((config, i) => {
      if (config.provider !== "openai" && !config.baseURL) {
        throw new Error(
          `Config at index ${i} requires a baseURL for provider "${config.provider}"`
        );
      }
      this.apiKeyIndices[i] = 0; // Init key index for each config
    });
  }

  private log(rest: any) {
    console.log(rest);
    console.log("");
  }

  private getCurrentClient(): OpenAI {
    const config = this.configs[this.currentConfigIndex];
    const keyIndex = this.apiKeyIndices[this.currentConfigIndex];
    const apiKey = config.apiKeys[keyIndex];

    return new OpenAI({
      apiKey,
      baseURL: config.baseURL,
    });
  }

  private rotateApiKey(modelIndex: number) {
    const totalKeys = this.configs[modelIndex].apiKeys.length;
    this.apiKeyIndices[modelIndex] =
      (this.apiKeyIndices[modelIndex] + 1) % totalKeys;
    console.log(`"${this.configs[modelIndex].provider}" key rotated`);
  }

  private async fallbackAndRetry(
    options: GenerateOptions,
    tried: number[]
  ): Promise<string> {
    for (let i = 0; i < this.configs.length; i++) {
      if (tried.includes(i)) continue;
      this.currentConfigIndex = i;
      const config = this.configs[i];

      return await retry(
        async () => {
          const result = await this.callOpenAI(config, options);
          return result;
        },
        {
          retries: config.maxRetries || 3,
          onRetry: (e: any, attempt) => {
            this.log(
              `[ai-model-router]: failed: ${JSON.stringify(e, null, 2)}`
            );
            console.log(`Attempt ${attempt}, retrying...`);
            console.error(
              `Model ${config.model} failed, trying next...`,
              e?.message
            );
            tried.push(i);
            this.rotateApiKey(i); // Try next key for this model next time
          },
        }
      );
    }

    throw new Error("All model configs failed.");
  }

  private async callOpenAI(
    config: AIModelConfig,
    options: GenerateOptions
  ): Promise<string> {
    const client = this.getCurrentClient();

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: options.prompt }],
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.max_tokens && { max_tokens: options.max_tokens }),
    });

    this.log(
      `[${
        this.configs[this.currentConfigIndex].provider
      }]: Generated successfully ✅`
    );
    return response.choices[0].message.content || "";
  }

  async generate(options: GenerateOptions): Promise<string> {
    const tried: number[] = [];
    try {
      const config = this.configs[this.currentConfigIndex];

      // log
      this.log(`[ai-model-router]: generating with model: ${config.model}`);

      return await this.callOpenAI(config, options);
    } catch (err: any) {
      console.warn(`Initial model failed: ${err.message}`);
      this.rotateApiKey(this.currentConfigIndex);
      tried.push(this.currentConfigIndex);
      return await this.fallbackAndRetry(options, tried);
    }
  }
}
