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
  };

  console.log(`Rotated credentials: `, {
    ...cred,
    password: "********",
  });

  return cred;
};

const env = {
  SMART_PROXY: {
    USERNAME: process.env.SMART_PROXY_USERNAME!,
    PASSWORD: process.env.SMART_PROXY_PASSWORD!,
    URL: process.env.SMART_PROXY_URL!,
  },
  CAPSOLVER_API_KEY: process.env.CAPSOLVER_API_KEY!,
};

export default env;
