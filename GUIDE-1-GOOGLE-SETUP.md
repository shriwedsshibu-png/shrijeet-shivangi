# Guide 1 — Connect Google (RSVP, Blessings and Photos)

**Why:** Guests' RSVPs, blessings and photos need somewhere to be saved. We use *your own* Google account:

- RSVPs and blessings become new **rows in a Google Sheet** (you can open it on your phone and watch it fill up live).
- Photos are saved in a **folder in your Google Drive** (your free 15 GB).

It costs nothing and needs no secret keys. Do this once. It takes about 10 minutes.

> Use the Google account where you want the data to live (for example Shrijeet's Gmail). Everything below is done in a normal browser on a laptop/PC.

---

## Step 1 — Make the Google Sheet
1. Open **https://sheets.new** (this creates a blank Google Sheet).
2. Click the title at top-left ("Untitled spreadsheet") and rename it **Wedding Data**.

## Step 2 — Paste the script
1. In that sheet, click the menu **Extensions → Apps Script**. A new tab opens with some code.
2. Click inside the code box, press **Ctrl+A** (select all) and **Delete**.
3. On GitHub, open the file `google-backend/Code.gs` in your repo, click the **Copy raw file** button (two-squares icon, top right of the file), and **paste** into the Apps Script box (Ctrl+V).
4. Click the **Save** (disk) icon.

## Step 3 — Authorise and publish (this is the step where Google asks permission)
The script creates its own tabs and Drive folder the first time it is used, so you do **not** need to run "setup" separately. If Step 3 (Run) gets stuck, skip it and go straight to publishing:

1. Click the blue **Deploy** button (top right) → **New deployment**.
2. Click the ⚙ gear next to "Select type" → choose **Web app**.
3. Fill in:
   - Description: `Wedding`
   - **Execute as: Me**
   - **Who has access: Anyone**
4. Click **Deploy**. Click **Authorize access** → choose your Google account.
5. Google shows *"Google hasn't verified this app"*. This is normal (you wrote it yourself). Click the small grey **Advanced** link at the bottom-left → **Go to (project name) (unsafe)** → **Allow**.
6. Copy the **Web app URL** (ends with `/exec`).
7. Open that URL in a new tab. You should see `{"success":true,"message":"Wedding backend is running."}`
8. Back in Apps Script, choose **setup** in the function dropdown → **▶ Run** (optional). It just creates the Sheet tabs and Drive folder early; if you skip it, the first RSVP creates them.

### If the permission screen is stuck or will not appear
- Use **one** Google account only: open the page in a **Chrome Incognito window**, sign in with just the wedding Gmail, and repeat.
- Turn off pop-up blocking for script.google.com (the permission window is a pop-up).
- Rename the project (top-left "Untitled project" → `Wedding`) and Save before running.
- If you only see "Back to safety" and no Advanced link, you are on a school/office Google account. Use a normal @gmail.com account instead.
- Still stuck? Take a screenshot of the screen and send it to Claude.

## Step 4 — (merged into Step 3 above)

## Step 5 — Give the URL to the website
1. On GitHub open `src/siteConfig.js`, click the ✏️ pencil icon.
2. Near the top find:
   ```js
   backend: {
     scriptUrl: "",
   },
   ```
3. Paste your URL between the quotation marks, like `scriptUrl: "https://script.google.com/macros/s/AKfy.../exec",`
4. Click **Commit changes** (green button) → **Commit changes**. The website updates by itself in about a minute.

## Step 6 — Test it (important!)
1. Open the website on your phone → **RSVP** → fill and send. Open your Google Sheet → **RSVP** tab → a row appears.
2. Send the RSVP again with the same mobile number but a different number of adults → the **same row changes** (no duplicate).
3. **Blessings** page → send one → see it in the **Blessings** tab.
4. **Photos** page → choose a celebration → upload 2–3 photos → open the **Gallery** tab → they appear. Also check your Drive folder.

---

## Good to know
- **Where is my data?** The Sheet "Wedding Data" (RSVP + Blessings) and the Drive folder. Download the RSVP list any time: *File → Download → Microsoft Excel*.
- **If you ever change `Code.gs`:** in Apps Script click *Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy*. The URL stays the same.
- **Please don't rename or delete** the tabs RSVP / Blessings / Photos / Faces or the Drive folder while the wedding is on.
- **Photo space:** photos are stored in good quality (about 1–2 MB each), so 15 GB holds several thousand. Check *Google One → Storage* if you expect very many.
- **Privacy:** anyone with the link to a photo can view it (that is how the gallery shows them), but the folder is not searchable.

---

## Step 7 — Updating the script later (faster uploads)
1. In Apps Script select all, delete, paste the latest `google-backend/Code.gs` from GitHub, click Save.
2. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.** The `/exec` link stays the same.
