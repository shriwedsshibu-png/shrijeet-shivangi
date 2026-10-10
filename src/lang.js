// Language of the site for this guest: English ("en") or Hindi ("hi").
//
// The four Hindi invite links are the English links with /hindi at the end:
//   /invite/shrijeet/parivaar/hindi     /invite/shrijeet/shubh-vivah/hindi
//   /invite/shivangi/parivaar/hindi     /invite/shivangi/shubh-vivah/hindi
// A guest who opens a Hindi link sees the invite and the website in Hindi, and the phone remembers it.
// Opening any English invite link switches that phone back to English. Everyone else never sees Hindi.

const KEY = 'ss_lang';
const SEEN = 'ss_lang_hi_seen';   // this phone has opened a Hindi link at least once (shows the हिंदी / English switch)

let memo = '';

export function getLang() {
  if (memo) return memo;
  let l = '';
  try { l = localStorage.getItem(KEY) || ''; } catch (e) { l = ''; }
  memo = l === 'hi' ? 'hi' : 'en';
  return memo;
}

export function setLang(l) {
  memo = l === 'hi' ? 'hi' : 'en';
  try {
    localStorage.setItem(KEY, memo);
    if (memo === 'hi') localStorage.setItem(SEEN, '1');
  } catch (e) { /* private mode */ }
}

export const isHi = () => getLang() === 'hi';

// One line of text in both languages: L('Open', 'खोलें')
export const L = (en, hi) => (isHi() && hi != null ? hi : en);

export function hindiSeen() {
  try { return !!localStorage.getItem(SEEN) || isHi(); } catch (e) { return isHi(); }
}

// /invite/<side>/<code>/hindi -> 'hi';  /invite/<side>/<code> -> 'en';  any other page -> '' (keep what is remembered)
export function langFromPath(pathname) {
  const m = /^\/invite\/([^/?#]+)\/([^/?#]+)(?:\/([^/?#]+))?/i.exec(pathname || '');
  if (!m) return '';
  return /^(hindi|hi)$/i.test(m[3] || '') ? 'hi' : 'en';
}

// Hindi letters: matching Devanagari fonts for each English font (only fetched in Hindi)
function loadHindiFonts() {
  if (document.getElementById('hi-fonts')) return;
  const l = document.createElement('link');
  l.id = 'hi-fonts';
  l.rel = 'stylesheet';
  l.href = '/fonts/hi/hindi.css?v=1';
  document.head.appendChild(l);
}

// Call once before the app renders.
export function initLangFromUrl() {
  const fromUrl = langFromPath(window.location.pathname);
  if (fromUrl) setLang(fromUrl);
  if (isHi()) {
    document.documentElement.lang = 'hi';
    document.documentElement.classList.add('hi');
    loadHindiFonts();
  }
}

// The switch shown to guests who came from a Hindi link
export function switchLang() {
  setLang(isHi() ? 'en' : 'hi');
  window.location.reload();
}

// Dates and weekdays in the guest's language
export const locale = () => (isHi() ? 'hi-IN' : 'en-IN');
