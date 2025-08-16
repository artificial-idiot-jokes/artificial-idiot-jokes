// netlify/functions/jokebot.js
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_ID = 'meta-llama/llama-3.1-8b-instruct:free';

exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  try {
    const { mode = "riddle", topic = "" } = JSON.parse(event.body || "{}");
    const prompt =
      mode === "anti"
        ? `Write a short, clean anti-joke${topic ? " about " + topic : ""}. One or two sentences.`
        : `Write a short, clean riddle${topic ? " about " + topic : ""}. Give ONLY the riddle; do not include the answer.`;

    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": event.headers?.referer || "https://artificialidiotjokebot.netlify.app",
        "X-Title": "Artificial Idiot Joke Bot",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: "system", content: "You are a witty family-friendly joke and riddle writer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 120
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        statusCode: res.status,
        headers: cors,
        body: JSON.stringify({ error: `Upstream error ${res.status}`, details: errorText }),
      };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "I got nothing 😅";
    return { statusCode: 200, headers: { ...cors, "Content-Type": "application/json" }, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: "Function crashed", details: String(err) }) };
  }
};
