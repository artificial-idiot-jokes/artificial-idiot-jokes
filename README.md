# Artificial Idiot — Jokes & Riddles (OpenRouter)

This folder is ready to drop into your GitHub repo and deploy on Netlify.

## Files
- `index.html` – UI for topic + mode (riddle / anti-joke)
- `style.css` – simple dark theme
- `netlify/functions/jokebot.js` – serverless function that calls OpenRouter
- `netlify.toml` – Netlify config (publishes root, uses functions folder, skips post-processing)

## One‑time Netlify setup
1. Go to **Site settings → Environment variables**.
2. Add:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** your key from https://openrouter.ai (starts with `sk-or-…`)
3. Save, then **Deploys → Trigger deploy → Deploy site** (or push a commit).

## How it works
The website calls `/.netlify/functions/jokebot` with JSON:
```json
{ "mode": "riddle", "topic": "bananas" }
```
The function uses OpenRouter and returns a short joke/riddle.

## Optional customizations
- Change model: edit `MODEL_ID` in `netlify/functions/jokebot.js`
  - e.g., `nousresearch/nous-hermes-2-mistral-7b-dpo` for witty banter
- Tweak tone: change the `system` prompt or `temperature`.
