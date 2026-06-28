# Astro Tint Solutions — client site

One-page, conversion-focused draft for **Astro Tint Solutions** (window tint, paint
protection film & ceramic coatings — Plainfield, IL). Built from `~/Sites/_template`.
Plain HTML/CSS/JS — **no build step, no dependencies.**

- **Live current site (reference):** https://astrotint.com/
- **Preview deploy (this draft):** https://astrotintsolutions.netlify.app/ *(confirm the
  exact name when the Netlify site is created)*
- **Real domain (later, at handoff):** astrotint.com

## Status: DRAFT / preview
Built under Colton's GitHub + Netlify to send the owner a live preview link. Not yet the
production site. A few things are intentionally placeholder until the owner confirms:

- **Pricing** (`#pricing`) — "$179 / $349 starting" are market-range placeholders. Confirm
  the real numbers with Seb, then update the pricing cards **and** the matching FAQ answer.
- **Work gallery** (`#work`) — "coming soon" cards. Drop real job photos into `assets/work/`
  and set each card's `data-img="assets/work/<file>.jpg"` in `index.html`.
- **About photo** — save a team/shop photo as `assets/about.jpg`.
- **Hero** — currently an abstract glass graphic; swap for a real install photo if available.

## Local preview
Served by `.claude/launch.json` (python http.server on port 4331), or:
```
cd ~/Sites/clients/astro-tint && python3 -m http.server 4331
```
Check desktop **and** mobile @375px; no console errors, no horizontal overflow.

## Deploy (Colton's one-click steps)
1. **GitHub Desktop** → add this folder → **Publish repository** as `client-astro-tint`.
2. **Netlify** → New site from Git → pick `client-astro-tint` (publish dir `.`, no build cmd).
3. In Netlify → **Forms** → set the notification email for the `quote` form to
   **curtnerc@gmail.com** so leads reach Colton during the draft phase.
4. Netlify gives a `*.netlify.app` URL — that's the preview link to send the owner.

## Going live / handoff (per `~/Sites/CLAUDE.md`)
Swap `astrotintsolutions.netlify.app` → `astrotint.com` in `index.html` (canonical, OG,
JSON-LD), `robots.txt`, `sitemap.xml`; add the client's GA4; transfer the GitHub repo +
Netlify site; point the domain. Full checklist in the master SOP.

## Contact (real business)
Phone (630) 362-0909 · seb@astrotint.com · 22300 W Old Renwick Rd, Plainfield, IL 60544
