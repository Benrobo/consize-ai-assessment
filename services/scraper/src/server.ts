import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Scrapper Server",
  });
});

const PORT = process.env.PORT || 1993;

app.listen(PORT, () => {
  console.log(`Scrapper Server running on port ${PORT}`);
});
