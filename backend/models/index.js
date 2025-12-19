import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import configFile from "../config/config.js";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname);

const files = fs
  .readdirSync(modelsDir)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

// Dynamically import models
for (const file of files) {
  // Convert Windows path to file URL
  const fileUrl = pathToFileURL(path.join(modelsDir, file)).href;
  const modelModule = await import(fileUrl);

  // modelModule.default should be your Sequelize model function
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export const { Article } = db;
export { db as default, sequelize, Sequelize };
