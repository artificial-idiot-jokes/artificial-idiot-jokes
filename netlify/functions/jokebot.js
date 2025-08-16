// netlify/functions/jokebot.js
export default async (req, context) => {
  try {
    const { category = "riddles", topic = "" } = await req.json();

    const system = `
You are a tiny comedy engine. Keep outputs short and punchy.
If category = "riddles", return exactly ONE clever riddle (2–4 lines) and the answer on a new line prefixed with "Answer:".
If category = "anti-jokes", return exactly ONE anti-joke (1–3 lines).
If a topic is given, weave it in. Keep it family-friendly.
`;

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": context.site?.url || "https://netlify.app",
        "X-Title": "Artificial Idiot – Joke & Riddle Bot"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free", // ✅ switched model
        messages: [
          { role: "system", content: system.trim() },
          { role: "user", content: JSON.stringify({ category, topic }) }
        ],
        temperature: 0.9,
        max_tokens: 180
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: `HTTP ${resp.status}`, details: errText }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Oops — I came up empty.";

    return new Response(JSON.stringify({ ok: true, text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
