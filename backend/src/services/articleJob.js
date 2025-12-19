import { generateText } from "./aiClient.js";
import { Article } from "../../models/index.js";

export async function generateAndSave({ topic = null } = {}) {
  const result = await generateText(topic);

  const article = await Article.create({
    title: result.title,
    content: result.content,
    summary: result.summary,
  });

  return article;
}
