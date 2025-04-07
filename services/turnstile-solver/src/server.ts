import express, { Request, Response } from "express";
import router from "./route.js";
import utils from "@consizeai/shared/utils";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use((req, res, next) => utils.useCatchErrors(next)(req, res, next));

const PORT = process.env.PORT || 1994;

app.listen(PORT, () => {
  console.log(`Turnstile Solver Server running on port ${PORT}`);
});
