import siteConfig from './siteConfig';

// Which kind of guest is this? "full" (all 3 days) or "wedding" (wedding day only).
// Set by the invite link they opened (/invite/<code>) and remembered in the browser.
const KEY = 'ss_guest_tier';
const cfg = () => siteConfig.guestTiers || {};

export function tierFromCode(code) {
  const c = String(code || '').toLowerCase();
  if (!c) return '';
  if (cfg().full && c === String(cfg().full.code).toLowerCase()) return 'full';
  if (cfg().wedding && c === String(cfg().wedding.code).toLowerCase()) return 'wedding';
  return '';
}

// /invite/<code>  or  /invite/<side>/<code>   (e.g. /invite/shrijeet/parivaar)
function parts(pathname) {
  const m = /^\/invite\/([^/?#]+)(?:\/([^/?#]+))?/i.exec(pathname || '');
  return m ? [decodeURIComponent(m[1]), m[2] ? decodeURIComponent(m[2]) : ''] : ['', ''];
}

export function codeFromPath(pathname) {
  const [a, b] = parts(pathname);
  return b || (sideFromSlug(a) ? '' : a);
}

/* ---------- whose side sent the invite: "groom" or "bride" ---------- */
const SIDE_KEY = 'ss_invite_side';
const sides = () => siteConfig.inviteSides || {};

export function sideFromSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (!s) return '';
  if (sides().groom && s === String(sides().groom.slug).toLowerCase()) return 'groom';
  if (sides().bride && s === String(sides().bride.slug).toLowerCase()) return 'bride';
  return '';
}

export function sideFromPath(pathname) {
  const [a, b] = parts(pathname);
  return b || sideFromSlug(a) ? sideFromSlug(a) : '';
}

let sideMemo = '';
export function setSide(s) {
  try { localStorage.setItem(SIDE_KEY, s); } catch (e) { /* private mode */ }
  sideMemo = s;
}
export function getSide() {
  if (sideMemo) return sideMemo;
  let s = '';
  try { s = localStorage.getItem(SIDE_KEY) || ''; } catch (e) { s = ''; }
  sideMemo = s === 'groom' || s === 'bride' ? s : (sides().default || 'bride');
  return sideMemo;
}
export const groomFirst = () => getSide() === 'groom';

export function setTier(t) {
  try { localStorage.setItem(KEY, t); } catch (e) { /* private mode */ }
  memo = t;
}

let memo = '';
export function getTier() {
  if (!cfg().full) return 'full';                  // feature not configured -> old behaviour
  if (memo) return memo;
  let t = '';
  try { t = localStorage.getItem(KEY) || ''; } catch (e) { t = ''; }
  memo = t === 'full' || t === 'wedding' ? t : (cfg().defaultTier || 'wedding');
  return memo;
}

export const tierCfg = () => cfg()[getTier()] || {};
export const isFullTier = () => getTier() === 'full';

// Call once before the app renders: picks up /invite/<code> from the address bar.
export function initTierFromUrl() {
  const t = tierFromCode(codeFromPath(window.location.pathname));
  if (t) setTier(t);
  const sd = sideFromPath(window.location.pathname);
  if (sd) setSide(sd);
}

export function eventAllowed(name) {
  const ev = tierCfg().events;
  if (!ev || ev === 'all') return true;
  return ev.includes(name);
}

export function pageHidden(key) {
  return (tierCfg().hidePages || []).includes(key);
}

export function dateLine() {
  return tierCfg().dateLine || siteConfig.wedding.dateLine;
}
