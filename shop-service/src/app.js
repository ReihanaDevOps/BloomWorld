const express = require("express");
const cors = require("cors");

const shopRoutes = require("./routes/shopRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BloomWorld Shop Service is running"
  });
});

app.use("/api/shops", shopRoutes);

module.exports = app;