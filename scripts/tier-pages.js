// After the build: make a copy of index.html for each invite link with its own WhatsApp preview.
// (The invitation itself is the same app; only the link preview differs.)
//   /invite/<code>                 older links (Shivangi's name first, as on the website)
//   /invite/<side>/<code>          Shrijeet's side or Shivangi's side; that name comes first
const fs = require('fs');
const path = require('path');

const cfg = fs.readFileSync(path.join(__dirname, '..', 'src', 'siteConfig.js'), 'utf8');
const block = (name) => {
  const m = new RegExp(`\\n\\s*${name}: \\{([\\s\\S]*?)\\n\\s*\\},`).exec(cfg.slice(cfg.indexOf('guestTiers')));
  const code = m && /code:\s*"([^"]+)"/.exec(m[1]);
  return code ? code[1] : '';
};
const sides = cfg.slice(cfg.indexOf('inviteSides'));
const slug = (who) => { const m = new RegExp(`${who}:\\s*\\{\\s*slug:\\s*"([^"]+)"`).exec(sides); return m ? m[1] : ''; };
const base = fs.readFileSync(path.join(__dirname, '..', 'build', 'index.html'), 'utf8');
const SITE = 'https://shibugotjeetuu2bethere.vercel.app';

const tiers = [
  { code: block('full'), desc: 'Join us in Visakhapatnam for three days of celebrations, 30 Nov – 2 Dec 2026. Open your invitation and RSVP.' },
  { code: block('wedding'), desc: 'Join us for the Varmala & Shaadi in Visakhapatnam on Wednesday, 2 December 2026. Open your invitation and RSVP.' },
];
const looks = [
  { dir: '', title: 'Shivangi &amp; Shrijeet — Wedding Invitation', img: 'og.jpg' },
  { dir: slug('bride'), title: 'Shivangi &amp; Shrijeet — Wedding Invitation', img: 'og.jpg' },
  { dir: slug('groom'), title: 'Shrijeet &amp; Shivangi — Wedding Invitation', img: 'og-shrijeet.jpg' },
];

tiers.forEach(({ code, desc }) => looks.forEach(({ dir, title, img }) => {
  if (!code || (dir === undefined)) return;
  const html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${SITE}/${img}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`);
  const rel = path.join('invite', dir, code);
  const out = path.join(__dirname, '..', 'build', rel);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), html);
  console.log('Invite link page: /' + rel.split(path.sep).join('/'));
}));
