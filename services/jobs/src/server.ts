import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Jobs Service",
  });
});

const PORT = process.env.PORT || 1991;

app.listen(PORT, () => {
  console.log(`Job Service Server running on port ${PORT}`);
});
