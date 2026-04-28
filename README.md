# Rashmi Gupta — AI Product Manager Portfolio

Single-file React + Framer Motion portfolio. Open `index.html` in any browser, or deploy to any static host.

## Stack

- React 18 + Framer Motion 11 (loaded from CDN — no build step)
- Vanilla CSS, Inter + Instrument Serif from Google Fonts
- Single `index.html` — fully self-contained

## Deploy

Drop `index.html` into:
- [Vercel](https://vercel.com) — drag & drop, ~60 seconds
- [Netlify Drop](https://app.netlify.com/drop)
- GitHub Pages — Settings → Pages → Deploy from `main` branch

## Sections

1. Hero
2. About
3. Selected Work — Hoonigan, ADT-Google IoT, ADT financing/RPA
4. AI Side Builds — RAG, MCP, real-time RAG POCs
5. Technical Fluency
6. Writing & POV
7. Contact

## Local edits

All editable content lives in data objects at the top of the `<script type="module">` block in `index.html`: `PROFILE`, `ABOUT`, `CASE_STUDIES`, `POCS`, `TECH`, `ESSAYS`. No JSX or CSS edits required to update content.
