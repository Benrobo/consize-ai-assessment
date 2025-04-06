import { Request, Response } from "express";
import puppeteer from "puppeteer";
import env, { rotateProxyCredentials } from "./env.js";
import UserAgents from "user-agents";
import capSolver from "./helpers/capsolver.js";
import retry from "async-retry";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class CFTurnstileSolver {
  async solve(url: string) {
    const credentials = rotateProxyCredentials();
    const randAgent = new UserAgents().random().toString();
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${credentials.url}`,
      ],
    });
    const page = await browser.newPage();
    await page.authenticate({
      username: credentials?.username,
      password: credentials?.password,
    });
    await page.setUserAgent(randAgent);
    await page.goto(url);

    try {
      return await retry(
        async () => {
          console.log("waiting 10sec");
          await sleep(10000);
          console.log("finised waiting");

          const frames = page.frames();

          const turnstileFrame = frames.find((frame) =>
            frame.url().includes("challenges.cloudflare.com")
          );

          if (turnstileFrame) {
            const frameUrl = turnstileFrame.url();
            const websiteKey = frameUrl
              .split("/")
              .find((s) => s.startsWith("0x"));

            if (!websiteKey) {
              throw new Error("No website key found: " + frameUrl);
            }

            // solve captcha
            const task = await capSolver.createTask(url, websiteKey);
            if (task?.data) {
              const solvedTask = await retry(
                async () => {
                  const result = await capSolver.getTask(task?.data?.taskId!);

                  if (result?.data?.status === "idle") {
                    throw new Error("Task still processing");
                  }

                  if (result?.data?.status === "failed") {
                    throw new Error(result?.data?.errorCode);
                  }

                  return result;
                },
                {
                  retries: 5,
                  factor: 1,
                  minTimeout: 2000,
                  maxTimeout: 5000,
                  onRetry: (error, attempt) => {
                    console.log(error);
                    console.log(
                      `Waiting for task completion... Attempt ${attempt}`
                    );
                  },
                }
              );

              console.log({ solvedTask });
            } else {
              console.log("Error solving task...");
              console.log(task);
            }
          } else {
            throw new Error("No turnstile frame found.");
          }

          return;
          const cookies = await page.cookies();
          return cookies;
        },
        {
          retries: 3,
          minTimeout: 10000,
          onRetry: async (e, attempt) => {
            // await browser.close();
            console.log(`Failed solving captcha. retrying...`);
            console.log(e);
            console.log(`Attempt: ${attempt}`);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      //   await browser.close();
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
