import express from "express";
import db from "../../models/index.js";

import { generateAndSave } from "../services/articleJob.js";

const router = express.Router();

const { Article } = db;

// GET /api/articles
router.get("/", async (req, res) => {
  try {
    const list = await Article.findAll({ order: [["createdAt", "DESC"]] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to list articles" });
  }
});

// GET /api/articles/:id
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: "not found" });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to get article" });
  }
});

// POST /api/articles/generate
router.post("/generate", async (req, res) => {
  try {
    const topic = req.body.topic || null;
    const article = await generateAndSave({ topic });
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to generate article" });
  }
});

export default router;
