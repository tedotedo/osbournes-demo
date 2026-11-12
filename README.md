# Osbournes (24 High Street, Yarm) — Concept Website Demonstration

Independent static concept website prepared by **Mark Aszkenasy** for **Osbournes** (`24 High Street, Yarm TS15 9AE`).

> **Disclaimer:** This is an unsolicited concept demonstration and is **not** the official website of Osbournes. All pages carry `<meta name="robots" content="noindex, nofollow">` and a persistent top notice banner. Because public directories currently publish conflicting telephone numbers (`01642 781012` vs `01642 801012`), telephone fields deliberately display `[Phone to confirm]` with no guessed `tel:` link.

## Included Files

- `index.html` — High Street daytime brunch-to-evening pub hero (`images/hero.jpg`), morning breakfast & brunch showcase (`images/feature.jpg`), three hospitality pillars, What's On teaser, opening hours & `[Phone to confirm]` ledger, and Google Maps link (`24 High Street, Yarm TS15 9AE`).
- `menus.html` — Accessible WAI-ARIA tabbed menu board (`Breakfast & Brunch`, `Pub Classics & Sharing`, `Drinks & Draught`) with keyboard arrow navigation and clean `[Menu item – owner to supply]` / `[£—]` rows.
- `whats-on-bookings.html` — Live Music & Sport schedule layout plus accessible **Table & Party / Booth Booking Enquiry Form** (`Brunch Table`, `Dining Table`, `Birthday or Group Area`).
- `css/styles.css` — Mobile-first responsive stylesheet (`360px–1440px`) using self-hosted `Playfair Display` & `Work Sans` variable fonts, WCAG AA high-contrast palette (`#17231E`, `#F7F2E7`, `#AD5122`, `#D8A24A`), and solid opaque mobile action bar.
- `js/main.js` — Zero-dependency client-side script handling `Escape`-accessible mobile navigation, WAI-ARIA menu tabs, quick booking pre-selection, and accessible dummy form validation.
- `favicon.svg` & `images/logo-mark.svg` — Custom geometric signboard crest & monogram SVG emblems.
- `fonts/` — Self-hosted `playfair-latin.woff2`, `playfair-latin-italic.woff2`, and `work-sans-latin.woff2` (zero external font calls).
- `PITCH.md` — High Street walk-in pitch script, public directory & `osbournesyarm.co.uk` domain audit, 3-tap mobile demo flow, objection handlers, and `[...]` launch checklist.

## Preview Locally

Open `index.html` directly in any modern browser or serve locally:

```bash
python3 -m http.server 8081
```
