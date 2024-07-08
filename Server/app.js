const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const depositRoute = require("./Routes/depositRoute");
const authRoute = require("./Routes/authRoutes");
const withdrawRoute = require("./Routes/withdrawRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Database connection error: " + err);
  });

app.use("/api/auth", authRoute);
app.use("/api/deposit", depositRoute);
app.use("/api/withdraw", withdrawRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
