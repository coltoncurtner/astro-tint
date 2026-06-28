# Per-client customization checklist

Work top to bottom. Everything in `[BRACKETS]` in the HTML is a placeholder; every
`REPLACE_DOMAIN` is the client's final domain. The `_template` folder itself is never
edited — you're working inside a copy under `~/Sites/clients/<name>` or `~/Sites/demos/<name>`.

## 1. Brand (the only design work that changes per site)
- [ ] `css/styles.css` → `:root` palette: swap every color to the client's brand
      (treat the var names as roles — see the comment block at the top of the file).
- [ ] `css/styles.css` → `:root` fonts: pick the client's typefaces; update the
      Google Fonts `<link>` in `index.html` AND `thanks.html` to match.
- [ ] `assets/favicon.svg`: recolor / replace with the client's mark.

## 2. Copy & structure
- [ ] Fill every `[BRACKET]` in `index.html`: title, meta description, hero, services,
      pricing, process, FAQ, footer, CTAs. Write real, specific, benefit-led copy.
- [ ] Set the `[AB]` brand monogram in the header + footer.
- [ ] Remove any section the client doesn't need (each is a self-contained `<section>`).
- [ ] `thanks.html`: business name + confirmation message.

## 3. SEO
- [ ] Replace all `REPLACE_DOMAIN` (meta/OG/canonical, `robots.txt`, `sitemap.xml`).
- [ ] Fill the `LocalBusiness` JSON-LD — pick the most specific `@type`, add real
      address/geo/phone so it's eligible for the local pack.
- [ ] Keep the `FAQPage` JSON-LD in sync with the on-page FAQ.
- [ ] Generate `assets/og-image.png` (1200×630). Quick method on this Mac (no rsvg/PIL):
      author a 1200×1200 SVG with the card centered → `qlmanage -t -s 1200 -o . card.svg`
      → `sips -c 630 1200 card.svg.png --out og-image.png`.

## 4. Forms, booking, analytics
- [ ] Lead form: confirm `name="..."` fields + the Netlify dashboard email notification.
- [ ] Booking: paste the client's Cal.com/Calendly embed in `#book`, or wire a contact CTA.
- [ ] Analytics: paste the CLIENT'S OWN GA4/GTM in `<head>` (never Colton's container).
- [ ] Update `mailto:`/`tel:` links to the client's real email + phone.

## 5. Verify (desktop AND mobile @375px)
- [ ] Preview locally; no console errors, no horizontal overflow.
- [ ] Primary CTA above the fold on mobile; sticky mobile CTA works.
- [ ] All links resolve; form submits to `thanks.html`.

## 6. Ship & hand off
Follow the deploy workflow and the **client handoff / ownership transfer** checklist
in `~/Sites/CLAUDE.md`.
