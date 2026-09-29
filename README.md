# Shrijeet & Shivangi — Wedding Website

Live site: **https://shibugotjeetuu2bethere.vercel.app**

This is a mobile-first wedding invitation website with:

| Page | What it does |
|---|---|
| Home | One invitation message, names in big letters, poetic countdown, quick buttons |
| Events | All six celebrations with map + "Add to calendar" buttons |
| RSVP | Guests confirm. **Saved live to your Google Sheet.** Sending again with the same mobile number *replaces* the old answer |
| Photos | One page: **Share Photos** (upload) and **Gallery** (grouped by celebration, plus *Find my photos* by selfie) |
| Blessings & Shagun | Blessing form (saved live to the Sheet) + optional shagun with **Pay by UPI** button, copyable UPI ID and QR |
| Our Story, Our Families, Explore Vizag, FAQ | Extra pages — any of them can be hidden with one word |

## Read these guides in order (no coding needed)

1. **[GUIDE-1-GOOGLE-SETUP.md](GUIDE-1-GOOGLE-SETUP.md)** — creates the Google Sheet + Drive photo folder that store everything (about 10 minutes).
2. **[GUIDE-2-VERCEL.md](GUIDE-2-VERCEL.md)** — puts the website online for free.
3. **[GUIDE-3-EDITING.md](GUIDE-3-EDITING.md)** — how to change text later, hide a page, add Shivangi's family, and a checklist to test before the wedding.

## Folder map

- `src/siteConfig.js` — **all the words, dates and links live here** (the only file you normally edit)
- `public/images/` — photos used on the website
- `wedding-qr/` — the QR code for the wedding: print `Photos-QR-Card-A5.pdf`
- `google-backend/Code.gs` — the small script you paste into Google (Guide 1)
- `src/` (everything else) — the website's code; leave as it is
