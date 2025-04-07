import express from "express";
import router from "./route.js";
import utils from "@consizeai/shared/utils";
import bodyParser from "body-parser";
import "./test/test.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: 100 }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", router);
app.use((req, res, next) => utils.useCatchErrors(next)(req, res, next));

const PORT = process.env.PORT || 1993;

app.listen(PORT, () => {
  console.log(`Scrapper Server running on port ${PORT}`);
});
