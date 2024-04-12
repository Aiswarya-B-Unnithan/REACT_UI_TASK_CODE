const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: process.env.APP_URL,
};
app.use(cors(corsOptions));

app.get("/api/photo-gallery-feed/:page", async (req, res) => {
  const { page } = req.params;
  try {
    const response = await fetch(`${process.env.FETCH_URL}${page}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
