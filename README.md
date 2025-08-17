# Artificial Idiot — Public Folder Build

This repo is configured for Netlify with a `public/` publish directory.

## Structure
- `public/` — static site (index.html, style.css)
- `netlify/functions/jokebot.js` — serverless function calling OpenRouter
- `netlify.toml` — sets publish = "public" and functions folder

## Netlify setup
Add env var in **Site settings → Environment variables**:
- `OPENROUTER_API_KEY` = your key (sk-or-…)

Then deploy.
