import express from "express";
import router from "./routes/index.js";
import utils from "@consizeai/shared/utils";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: 100 }));
app.use(bodyParser.urlencoded({ extended: false }));

const routers = Object.entries(router);

routers.forEach(([_, r]) => {
  app.use("/api", r);
});

app.use((req, res, next) => utils.useCatchErrors(next)(req, res, next));

const PORT = process.env.PORT || 1991;

app.listen(PORT, () => {
  console.log(`Jobs Server running on port ${PORT}`);
});
