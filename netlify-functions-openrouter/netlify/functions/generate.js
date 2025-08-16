// netlify/functions/generate.js
export async function handler(event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Use POST" };
  }

  try {
    const { mode = "riddle", topic = "" } = JSON.parse(event.body || "{}");

    const prompt =
      mode === "anti"
        ? `Write a short, family-friendly anti-joke. Keep it under 40 words. If a topic is provided, work it in. Topic: "${topic}". Return just the joke.`
        : `Write a clever, family-friendly riddle with a one-word answer. Keep it under 40 words. If a topic is provided, work it in. Topic: "${topic}". Return just the riddle and then the answer on the next line like: Answer: <word>.`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing OPENROUTER_API_KEY env var" }),
      };
    }

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "https://example.com",
        "X-Title": process.env.SITE_NAME || "Artificial Idiot – Joke & Riddle Bot",
      },
      body: JSON.stringify({
        model: "openrouter/openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a comedian and riddle-writer." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, headers: corsHeaders, body: text };
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content ?? "No content.";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ ok: true, content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: String(err) }),
    };
  }
}
