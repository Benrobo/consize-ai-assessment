import axios from "axios";
import env from "../env.js";

type GetTaskResult = {
  errorId: number;
  taskId: string;
  status: string;
  errorCode: string;
  errorDescription: null;
  solution?: {
    token: string;
    type: "turnstile";
    userAgent: string;
  };
};

type PostTaskResult = {
  errorId: number;
  status: string;
  taskId: string;
};

type Response<T> = {
  data: T;
  error: string | null;
};

class CapSolver {
  private result: Response<PostTaskResult | GetTaskResult | null>;
  constructor() {
    this.result = {
      data: null,
      error: null,
    };
  }
  async createTask(url: string, websiteKey: string) {
    try {
      const apiUrl = "https://api.capsolver.com/createTask";
      const payload = {
        clientKey: env.CAPSOLVER_API_KEY,
        task: {
          type: "AntiTurnstileTaskProxyLess",
          websiteURL: url,
          websiteKey,
        },
      };

      const response = await axios.post(apiUrl, payload);
      const data = response?.data;

      this.result.error = null;
      this.result.data = data;
      return this.result as Response<PostTaskResult>;
    } catch (e: any) {
      console.log(`Error creating task: `, e);
      this.result.error = e?.response?.message || e?.message;
      return this.result as Response<PostTaskResult>;
    }
  }

  async getTask(taskId: string) {
    try {
      const apiUrl = "https://api.capsolver.com/getTaskResult";
      const payload = {
        clientKey: env.CAPSOLVER_API_KEY,
        taskId,
      };

      const response = await axios.post(apiUrl, payload);
      const data = response?.data;

      this.result.error = null;
      this.result.data = data;

      return this.result as Response<GetTaskResult>;
    } catch (e: any) {
      console.log(`Error getting task: `, e);
      this.result.error = e?.response?.message || e?.message;
      return this.result as Response<GetTaskResult>;
    }
  }
}

const capSolver = new CapSolver();
export default capSolver;

// Use oxylabs indeed scraper
// create multiple accounts using temp-mail
