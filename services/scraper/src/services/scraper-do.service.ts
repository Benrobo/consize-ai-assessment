import axios from "axios";
import retry from "async-retry";
import env, { rotateProxyCredentials } from "../config/env.js";
import redis from "../config/redis.js";

type Response<T> = {
  data: T;
  error: string | null;
};

export class ScraperDoService {
  private response: Response<null | string> = {
    data: null,
    error: null,
  };

  private getCacheKey(url: string): string {
    return `scraper:${url}`;
  }

  async scrape(targetUrl: string) {
    try {
      const cacheKey = this.getCacheKey(targetUrl);
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        console.log("Cache hit for:", targetUrl);
        this.response.data = cachedData;
        return this.response;
      }

      return await retry(
        async () => {
          const encodedUrl = encodeURIComponent(targetUrl);
          const render = "false"; // render js
          const superProxy = "true"; // proxy
          const apiUrl = `https://api.scrape.do/?token=${env.SCRAPERDO_API_KEY}&url=${encodedUrl}&render=${render}&super=${superProxy}`;

          const response = await axios({
            method: "GET",
            url: apiUrl,
          });

          const data = response?.data;

          if (!data) throw new Error("No data returned from scraper.do");

          this.response.error = null;
          this.response.data = data;

          // Cache the successful response
          await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            60 * 60 * 24 // Cache for 24 hours
          );

          return this.response;
        },
        {
          retries: 3,
          onRetry: (e, attempt) => {
            console.log(e);
            console.log(`Attempt ${attempt} failed. Retrying...`);
          },
        }
      );
    } catch (e: any) {
      console.log(`Error scraping ${targetUrl}: `, e);
      this.response.error = e?.response?.message || e?.message;
      return this.response;
    }
  }
}

const scraperDo = new ScraperDoService();

export default scraperDo;
