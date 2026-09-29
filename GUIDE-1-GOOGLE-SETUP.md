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

## Step 3 — Run the one-time setup
1. At the top of the Apps Script page there is a dropdown showing a function name. Choose **setup**.
2. Click **▶ Run**.
3. Google will say **"Authorization required"** → click **Review permissions** → choose your account.
4. You will see *"Google hasn't verified this app"*. This is normal because you wrote it for yourself. Click **Advanced → Go to Untitled project (unsafe) → Allow**.
5. Wait for **"Execution completed"** at the bottom. 
   - Your Sheet now has four tabs: **RSVP, Blessings, Photos, Faces**.
   - Your Google Drive now has a folder **Shrijeet & Shivangi - Wedding Photos**.

## Step 4 — Publish it as a "web app"
1. Click the blue **Deploy** button (top right) → **New deployment**.
2. Click the ⚙ gear next to "Select type" → choose **Web app**.
3. Fill in:
   - Description: `Wedding`
   - **Execute as: Me**
   - **Who has access: Anyone**
4. Click **Deploy** (allow access again if asked).
5. Copy the **Web app URL** (it ends with `/exec`). Keep it — you need it next.

> Quick check: paste that URL in a new browser tab. You should see `{"success":true,"message":"Wedding backend is running."}`

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
