# Shivangi & Shrijeet Wedding Website — What to Fill Later

## 1. Family names
Open `src/siteConfig.js` and find `families:`.

Use this format:

```js
families: {
  title: "Our Families",
  subtitle: "With the love and blessings of the families who have shaped our lives.",
  shrijeet: [
    { name: "Father's Name", relationship: "Father" },
    { name: "Mother's Name", relationship: "Mother" },
    { name: "Sister's Name", relationship: "Sister" },
    { name: "Grandfather's Name", relationship: "Grandfather" },
    { name: "Bade Papa's Name", relationship: "Bade Papa" },
    { name: "Badi Mummy's Name", relationship: "Badi Mummy" },
  ],
  shivangi: [
    { name: "Father's Name", relationship: "Father" },
    { name: "Mother's Name", relationship: "Mother" },
  ],
  blessingLine: "With the blessings of our families, we request the pleasure of your presence at our wedding celebrations.",
},
```

Add as many family members as needed. No photographs are required.

## 2. UPI QR
Put the QR image in `public/images/`, then change:

```js
upiQrImage: "/images/your-upi-qr.png",
upiId: "yourupi@bank",
```

## 3. Hotel and bungalow Google Maps
In `src/siteConfig.js` under `travel.stays`, replace the empty links:

```js
stays: [
  { name: "Hotel Name", mapLink: "GOOGLE_MAPS_LINK" },
  { name: "Bungalow Name", mapLink: "GOOGLE_MAPS_LINK" },
],
```

They will not appear until a link is supplied, so there are no fake/broken map buttons.

## 4. Photographer face-search gallery
After the photographer gives the final face-search/gallery URL, set:

```js
photographerGalleryUrl: "PHOTOGRAPHER_LINK",
```

The Gallery page will then show a **Find My Photos** button.

## 5. RSVP Google Sheet
The RSVP form writes to a Google Sheet tab named `RSVP` using the same Google service-account setup as the existing blessings/photo system.

Create a sheet tab named exactly:

`RSVP`

Recommended first row:

`Timestamp | Main Guest | Phone | Attending | Adults | Children | Guest Names | Functions Attending | Arrival Date | Arrival Time | Departure Date | Departure Time | Accommodation | Nights | Cab | Pickup/Drop | Food Preference | Other Requirements`

The Netlify function is:

`netlify/functions/submit-rsvp/submit-rsvp.mjs`

The existing environment variable `GOOGLE_SPREADSHEET_ID` is used.

## 6. Wedding countdown
The countdown is currently set to:

**03 December 2026, 03:00 AM IST**

Change only `wedding.date` in `src/siteConfig.js` if the final muhurat changes.


## Latest visual/content updates
- Countdown target is 02 Dec 2026 at 9:00 PM IST.
- Homepage date line is 30 Nov – 02 Dec 2026 · Visakhapatnam.
- Event cards show only the Google Maps link; the repeated venue tag has been removed.
- Our Families uses one combined invitation sentence.
- Gallery is presented as one wedding gallery with filters; static couple photos are labelled Our Photos and guest uploads are grouped by celebration.
- Face-search remains a separate photographer service and is linked from the Gallery once the photographer URL is supplied.
