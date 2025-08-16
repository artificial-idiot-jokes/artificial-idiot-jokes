// netlify/functions/joke.js
const MODEL = "meta-llama/llama-3.1-8b-instruct:free";

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { mode = "riddle", topic = "" } = JSON.parse(event.body || "{}");
    const prompt =
      mode === "anti"
        ? `You are a deadpan comedian. Write one short, original anti-joke${
            topic ? " about: " + topic : ""
          }. 1–3 sentences max.`
        : `You are a playful riddle writer. Create one clever, original riddle${
            topic ? " about: " + topic : ""
          }. Keep it under 3 lines. After the riddle, provide the answer on a new line starting with "Answer:".`;
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://artificialidiotjokebot.netlify.app",
        "X-Title": "Artificial Idiot Joke Bot",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "Keep outputs short, original, and PG-13." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 180,
      }),
    });
    const json = await resp.json();
    if (!resp.ok) {
      const msg =
        json?.error?.message ||
        json?.message ||
        JSON.stringify(json, null, 2);
      return { statusCode: resp.status, body: msg };
    }
    const text =
      json?.choices?.[0]?.message?.content?.trim() ||
      "(No content from model)";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return { statusCode: 500, body: String(err?.message || err) };
  }
};