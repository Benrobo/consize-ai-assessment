import dotenv from "dotenv";

dotenv.config();

const PROXY_URL = process.env.PROXY_URL ?? "";
const [HOST, PORT, USERNAME, PASSWORD] = PROXY_URL.split(":");

const env = {
  SMART_PROXY: {
    HOST,
    PORT,
    USERNAME,
    PASSWORD,
    URL: `http://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`,
  },
};

export default env;
