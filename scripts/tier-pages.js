// After the build: make a copy of index.html for each invite link with its own WhatsApp preview text.
// (The invitation itself is the same app; only the link preview differs.)
const fs = require('fs');
const path = require('path');

const cfg = fs.readFileSync(path.join(__dirname, '..', 'src', 'siteConfig.js'), 'utf8');
const block = (name) => {
  const m = new RegExp(`\\n\\s*${name}: \\{([\\s\\S]*?)\\n\\s*\\},`).exec(cfg.slice(cfg.indexOf('guestTiers')));
  const code = m && /code:\s*"([^"]+)"/.exec(m[1]);
  return code ? code[1] : '';
};
const base = fs.readFileSync(path.join(__dirname, '..', 'build', 'index.html'), 'utf8');

const pages = [
  { code: block('full'), desc: 'Join us in Visakhapatnam for three days of celebrations, 30 Nov – 2 Dec 2026. Open your invitation and RSVP.' },
  { code: block('wedding'), desc: 'Join us for the Varmala & Shaadi in Visakhapatnam on Wednesday, 2 December 2026. Open your invitation and RSVP.' },
];
pages.forEach(({ code, desc }) => {
  if (!code) return;
  const html = base
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`);
  const dir = path.join(__dirname, '..', 'build', 'invite', code);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Invite link page: /invite/' + code);
});
