import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Auth Service",
  });
});

const PORT = process.env.PORT || 1990;

app.listen(PORT, () => {
  console.log(`Auth Service Server running on port ${PORT}`);
});
