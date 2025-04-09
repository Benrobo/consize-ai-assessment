import jobsRouter from "./jobs.routes.js";
import jobProfileRouter from "./job-profile.routes.js";
import express from "express";

const indexRouter = express.Router();

// indexRouter.get("/", (req, res) => {
//   res.json({
//     message: "Hello from Jobs Service",
//   });
// });

export default {
  indexRouter,
  jobProfileRouter,
  jobsRouter,
};
