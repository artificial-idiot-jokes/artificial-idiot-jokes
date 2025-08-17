// netlify/functions/jokebot.js
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // safe default; change if you like

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { mode = "riddle", topic = "" } = JSON.parse(event.body || "{}");
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }) };
    }

    const style = mode === "riddle"
      ? "Write a short, clever riddle. One or two sentences max. Then give the answer on a new line prefixed with 'Answer:'."
      : "Write a short anti-joke (deadpan, literal humor). One or two sentences max. Keep it clean.";

    const payload = {
      model: MODEL,
      messages: [
        { role: "system", content: "You generate very brief, family-friendly jokes and riddles. Keep outputs under 40 words." },
        { role: "user", content: `${style}\n${topic ? "Topic: " + topic : ""}`.trim() }
      ],
      temperature: 0.9,
      max_tokens: 120
    };

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    const utf8Body = Buffer.from(text, "utf8").toString();

    if (!response.ok) {
      return { statusCode: response.status, headers: corsHeaders, body: utf8Body };
    }

    let data;
    try { data = JSON.parse(utf8Body); }
    catch { return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ content: utf8Body }) }; }

    const content = data?.choices?.[0]?.message?.content?.trim() || "Empty response";
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ text: content }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Unexpected error", details: String(err) }) };
  }
};
