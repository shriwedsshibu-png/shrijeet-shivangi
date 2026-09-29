# Guide 3 — Changing things later (no coding)

Almost everything is in one file: **`src/siteConfig.js`**.

## How to change any text
1. On GitHub open the repo → `src` → `siteConfig.js`.
2. Click the ✏️ pencil (top right).
3. Change words **between the quotation marks**. (Don't delete the quotation marks, commas or brackets.)
4. Click **Commit changes → Commit changes**. The live site updates in about a minute.

## Where is what (search with Ctrl+F)
| To change… | Search for |
|---|---|
| Invitation message on the home page | `invitationTop` / `invitationBottom` |
| Countdown time | `countdownTo` |
| Dates line on home page | `dateLine` |
| Events, times, dress code | `events:` |
| Turn Shagun (UPI) back on / its UPI ID | `shagun:` (`enabled: true`) |
| Your story text | `ourStory:` |
| Family names | `families:` |
| Hotel / mall / places | `travel:` |
| Questions & answers | `faq:` |

## Hide a page (for example "Our Story")
In `siteConfig.js` find `features:` and change `true` to `false`:

```js
ourStory:  { enabled: false, label: "Our Story" },
```
The page, its menu link **and** the buttons on the home page disappear. Your text stays saved, so change it back to `true` any time to show it again. The same works for `families`, `travel`, `faq`, `events`, `rsvp`, `photos`, `blessings`.

## Add Shivangi's family
In `siteConfig.js` find `shivangi: [],` and fill it like this (one block per person, comma after each):

```js
shivangi: [
  { name: "Full Name", relation: "Papa" },
  { name: "Full Name", relation: "Mummy" },
],
```
Until you add names, only Shrijeet's family is shown (nothing looks empty or broken).

## Add / replace a photo on the website
GitHub → `public` → `images` → **Add file → Upload files**. Use the **same file name** to replace one (`our2.jpg` is the home page photo). Keep pictures under ~500 KB so the site stays fast for guests.

## Photographer's face-search link (after the wedding)
In `siteConfig.js` find `photographerGalleryUrl: ""` and paste the link between the quotes. A "Photos by our photographer" button appears in the Gallery.

## The wedding QR code
Print **`wedding-qr/Photos-QR-Card-A5.pdf`**. Scanning it opens the Photos page (Share Photos + Gallery). If the website address ever changes, tell me and I will make a new one.

---

## ✅ Before the wedding — test checklist
Do these on 2 different phones (one Android, one iPhone if possible):
- [ ] RSVP works; sending again with the same number **updates** the Sheet row.
- [ ] Blessing appears in the Sheet.
- [ ] **Pay by UPI** opens a payment app, and the UPI ID copies. **Send ₹1 from someone else's phone to check it is received.** (Some special UPI IDs, such as ones tied to a credit card, cannot receive personal payments — better to find out now.)
- [ ] Upload 3 photos → they show in the Gallery and in your Drive folder.
- [ ] *Find my photos*: take a selfie → your photos appear.
- [ ] Scan the printed QR card with a normal phone camera.
- [ ] Open the site on hotel/venue Wi-Fi and on mobile data.

## Things to know
- **Face search** only covers photos guests upload on this website (not the photographer's). It runs on the guest's phone; the selfie is never uploaded. It is very good but not perfect — relatives who look alike may sometimes mix.
- The first time someone uses face features their phone downloads ~12 MB once, so on slow networks it can take a few seconds.
- If Vercel ever shows a red **Error**, your old site stays live. Send me a screenshot of the error.
