# Netlify Functions (OpenRouter)

This folder replaces your existing `netlify/functions` and switches your site to **OpenRouter**.

## Set env var in Netlify
Site settings → Environment variables:
- Key: `OPENROUTER_API_KEY`
- Value: your OpenRouter key (starts with `sk-or-...`)

(Optional)
- `SITE_URL`: your deployed site URL
- `SITE_NAME`: `Artificial Idiot – Joke & Riddle Bot`

## Endpoint
POST to `/.netlify/functions/generate` with JSON:
`{ "mode": "riddle", "topic": "bananas" }` or `{ "mode": "anti", "topic": "bananas" }`.
