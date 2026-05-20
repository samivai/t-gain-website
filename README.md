# T-Gain Website

Marketing site and legal pages for **T-Gain** — the daily habit app for training, fueling, sleep, and recharge.

Live at **[t-gain.app](https://t-gain.app)**.

## Stack

Pure static HTML + CSS. No build step. Deploys to Cloudflare Pages on push.

- `index.html` — landing page
- `legal.html` — Terms, Privacy, Contact (all on one page)
- `styles.css` — shared styles
- `assets/` — logo, pillar icons, hero mockup

## Local preview

Just open `index.html` in a browser, or run any static server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushes to `main` auto-deploy via Cloudflare Pages.
