import express from "express";
import proxy from "express-http-proxy";

const app = express();

const SERVICES = [
  {
    name: "jobs",
    path: "/jobs",
    port: 1991,
    baseUrl: "http://localhost",
  },
  {
    name: "workers",
    path: "/workers",
    port: 1992,
    baseUrl: "http://localhost",
  },
  {
    name: "scraper",
    path: "/scraper",
    port: 1993,
    baseUrl: "http://localhost",
  },
  //   {
  //     name: "flaresolverr",
  //     path: "/cf-flare-solver",
  //     port: 8191,
  //     baseUrl: "http://localhost",
  //   },
  //   {
  //     name: "capsolver",
  //     path: "/capsolver",
  //     port: 1994,
  //     baseUrl: "http://localhost",
  //   },
];

SERVICES.forEach((service) => {
  const basePath = `/api${service.path}`;
  const proxyUrl = `${service.baseUrl}:${service.port}`;
  const path = service.name === "flaresolverr" ? `${basePath}/v1` : basePath;

  app.use(
    path,
    proxy(proxyUrl, {
      proxyReqPathResolver: function (req) {
        return `/api${req.url}`;
      },
    })
  );
});

const PORT = process.env.PORT || 1999;

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
