export async function generateText(prompt = "Write a blog article") {
  const HF_TOKEN = process.env.HF_API_KEY;

  if (!HF_TOKEN) {
    throw new Error("Missing HF_TOKEN in environment variables.");
  }

  // Build the message that instructs the model what to generate
  const messages = [
    {
      role: "user",
      content: `${prompt}.
Generate:
1) A clear title
2) 4–6 paragraphs of article content
3) A short 2–3 sentence summary
Return the response formatted as JSON with keys: title, content, summary.`,
    },
  ];

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    }
  );

  const result = await response.json();

  // Extract the text returned by the model
  let text = result?.choices?.[0]?.message?.content || "";

  // Clean up potential code block markers (```json ... ```)
  text = text
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/```$/, "");

  let parsed;
  try {
    parsed = JSON.parse(text); // Model returns JSON because we asked for it
  } catch {
    // Fallback: If model didn't return valid JSON
    parsed = {
      title: "Generated Article",
      content: text,
      summary: text.substring(0, 150) + "...",
    };
  }

  return parsed;
}
