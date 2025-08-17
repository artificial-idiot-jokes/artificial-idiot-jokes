const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const topic = (body.topic || "random").toString().replace(/[^a-zA-Z0-9 ]/g, "");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: `Tell me an anti-joke or riddle about ${topic}.` }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ joke: data.choices?.[0]?.message?.content || "No joke found." }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error", details: err.message }),
    };
  }
};
