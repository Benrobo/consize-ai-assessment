import { Request, Response } from "express";
import puppeteer from "puppeteer";
import env from "./env.js";

export class CFTurnstileSolver {
  async solve(url: string) {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${env.SMART_PROXY.URL}`,
      ],

      slowMo: 10000,
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: env.SMART_PROXY.USERNAME,
      password: env.SMART_PROXY.PASSWORD,
    });

    try {
      await page.goto(url);
      await page.waitForSelector("#challenge-stage");

      // Wait for the turnstile iframe to load
      const turnstileFrame = await page.waitForFrame((frame) =>
        frame.url().includes("challenges.cloudflare.com")
      );

      // Wait for the widget to be ready
      await turnstileFrame.waitForSelector("#turnstile-widget");

      // Click the checkbox
      const checkbox = await turnstileFrame.waitForSelector(
        'input[type="checkbox"]'
      );
      await checkbox?.click();

      // Wait for challenge completion
      await page.waitForFunction(
        () => {
          return !document.querySelector("#challenge-stage");
        },
        { timeout: 30000 }
      );

      const cookies = await page.cookies();
      return cookies;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async init(req: Request, res: Response) {
    const { url } = req.body;
    const cookies = await this.solve(url);
    res.json({ success: true, cookies });
  }
}

const cfTurnstileSolver = new CFTurnstileSolver();

export default cfTurnstileSolver;
