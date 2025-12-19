import express from "express";
import { sequelize } from "../models/index.js";
import articlesRouter from "./routes/articles.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use("/api/articles", articlesRouter);

app.listen(process.env.PORT || 4000, async () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
  await sequelize.authenticate();
  console.log("🟢 Connected to Postgres with Sequelize");
});
