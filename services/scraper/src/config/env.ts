import dotenv from "dotenv";
dotenv.config();

export const rotateProxyCredentials = () => {
  const COUNT = 10;
  const ports = process.env.SMART_PROXY_PORTS?.split(",") || [];
  const username = Array(COUNT).fill(process.env.SMART_PROXY_USERNAME!);
  const passwords = Array(COUNT).fill(process.env.SMART_PROXY_PASSWORD!);
  const randomPortIndex = Math.floor(Math.random() * ports.length);
  const selectedPort = ports[randomPortIndex];
  const cred = {
    username: username[randomPortIndex],
    password: passwords[randomPortIndex],
    url: `http://gate.smartproxy.com:${selectedPort}`,
    host: `gate.smartproxy.com`,
    port: selectedPort,
  };

  console.log(`Rotated credentials: `, {
    ...cred,
    password: "********",
  });

  return cred;
};

const getGeminiKeys = (key: string) => {
  if (!key) return [];
  return key.split("::");
};

const env = {
  SCRAPERDO_API_KEY: process.env.SCRAPERDO_API_KEY!,
  GEMINI_API_KEYS: getGeminiKeys(process.env.GEMINI_API_KEYS! ?? ""),
};

export default env;
