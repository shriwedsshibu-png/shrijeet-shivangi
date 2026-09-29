# Guide 2 — Put the website online (free) on Vercel

Your Netlify account ran out of credits, so we use **Vercel** (free "Hobby" plan). Every time you save a change on GitHub, Vercel updates the live website automatically.

## First-time setup (about 5 minutes)
1. Go to **https://vercel.com** and log in (best: **Continue with GitHub**, using the GitHub account that has `shrijeet-shivangi`).
2. Click **Add New… → Project**.
3. Find **shrijeet-shivangi** in the list and click **Import**.
   - Not in the list? Click *"Adjust GitHub App Permissions"* → allow Vercel to see the repo → come back.
4. **Project Name:** type exactly `shibugotjeetuu2bethere`
   → this gives the same address style as before: **https://shibugotjeetuu2bethere.vercel.app**
   (If Vercel says the name is taken, tell me the name you used — I will remake the QR code for it.)
5. Leave everything else as it is (Framework should say *Create React App*). Click **Deploy**.
6. After 1–2 minutes you see 🎉. Click the picture to open your live site.

## After that — how updates work
- Edit a file on GitHub → click *Commit changes* → within ~1 minute the live site is updated. Nothing else to do.
- To see if a deployment worked: Vercel → your project → **Deployments**. A green **Ready** = live. A red **Error** = something in the last edit is wrong (click it to read why, or send me a screenshot).
- **Tip:** if you make a typo in `siteConfig.js` (a missing quote or comma) the build will fail, but **your old site stays online** until a good version is ready.

## Later: making the GitHub repo private
Fine to do. Vercel still works. If deployments ever stop after that: GitHub → *Settings → Applications → Vercel → Configure* → make sure the repo is allowed.

## Custom address (optional)
Buying a name like `shrijeetweds shivangi.in` is possible later: Vercel → project → *Settings → Domains*. The free `.vercel.app` address works perfectly without it.

## Is it really free?
Yes. The Hobby plan is free for personal, non-commercial sites like a wedding website. No card is needed.
