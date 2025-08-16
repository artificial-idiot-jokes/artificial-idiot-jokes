// Netlify Functions (manual deploy): use netlify/functions/jokebot.js
export async function handler(event, context) {
  // CORS for local testing; Netlify serves same origin in prod
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY || process.env.OPENAI_KEY;
  if (!OPENAI_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (_) {}
  const type = (body.type || "riddle").toLowerCase(); // "riddle" | "anti-joke"
  const topic = body.topic || "";

  const prompt = type === "anti-joke"
    ? `Tell a single-line anti-joke. Keep it clean. If a topic is provided, theme it around "${topic}".`
    : `Write a short, clever riddle with its answer on the next line prefixed by "Answer:". Keep it clean. If a topic is provided, theme it around "${topic}".`;

  try {
    // Call OpenAI chat completions (widely supported). Use a small, fast model.
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a witty, family-friendly comedy writer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 120
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, headers, body: JSON.stringify({ error: text }) };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "No response";
    return { statusCode: 200, headers, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
}
