# Osbournes (24 High Street, Yarm) — Concept Website Demonstration

Independent static concept website prepared by **Mark Aszkenasy** for **Osbournes** (`24 High Street, Yarm TS15 9AE`).

> **Disclaimer:** This is an unsolicited concept demonstration and is **not** the official website of Osbournes. All pages carry `<meta name="robots" content="noindex, nofollow">` and a persistent top notice banner. Because public directories currently publish conflicting telephone numbers (`01642 781012` vs `01642 801012`), telephone fields deliberately display `[Phone to confirm]` with **zero** `tel:` links anywhere in the site.

## Design Direction — *"Victorian Gilded Public House Mirror, Tavern Fascia & Chalkboard Broadsheet"*

- **Symmetrical Gilded Pub Signboard Fascia** — Double-lined brass border across top and bottom with navigation split symmetrically left and right of a central ornate `No. 24 · OSBOURNES · YARM HIGH STREET` Tavern Crest (collapsing cleanly to crest + brass `MENU` button on mobile).
- **Ornate Gilded Pub-Mirror Stage + Three Brass-Pinned Tavern Plaques (`index.html`)** — Custom inline SVG Victorian brass filigree corner flourishes framing `images/hero.jpg` behind a calibrated dark coach-green vignette (`10:1+` WCAG AAA contrast), docked at the base with three brass-riveted tavern plaques (`MORNING DOORS`, `ALL DAY & MATCHDAYS`, `FRIDAY & SATURDAY`).
- **"The High Street Chalkboard Slate" (`index.html`)** — Framed dark slate pub chalkboard with hand-ruled chalk dividers, interactive vibe filters (`All House Sessions`, `Morning Brunch`, `Live Sport`, `Weekend Nights`, `Private Party Areas`), and honest `[Schedule – owner to confirm]` placeholders.
- **Kitchen & Cellar Broadsheet Menus (`menus.html`)** — Accessible WAI-ARIA tabbed Bill of Fare (`Breakfast & Brunch`, `Pub Classics & Sharing`, `Drinks & Draught`) with brass corner rivets and `[Menu item – owner to supply]` / `[£—]` ledger rows.
- **What's On & Party Snug Bookings (`whats-on-bookings.html`)** — Brass-pinned live sport & weekend music plaques paired with an accessible **Table, Brunch & Party Snug Enquiry Form**.
- **Self-Hosted Typography & WCAG AA+ Palette** — Self-hosted `Playfair Display` & `Work Sans` WOFF2 fonts (`fonts/`), Deep Coach Green `#101B17`, Aged Gilded Brass `#D4A656`, Warm Tavern Cream `#F4ECD8`, Copper Ale `#B85328` / `#A6461E`, zero external network calls, and a 100% opaque sticky mobile bottom dock.

## Preview Locally

```bash
python3 -m http.server 8081
```
