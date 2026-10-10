import siteConfig from './siteConfig';

const baseUrl = () => String(siteConfig.backend?.scriptUrl || process.env.REACT_APP_BACKEND_URL || '').trim();

const looksValid = () => /^https:\/\/script\.google(usercontent)?\.com\/(a\/[^/]+\/)?macros\/s\/[^/]+\/exec(\?.*)?$/.test(baseUrl()) || /^https?:\/\/localhost/.test(baseUrl());
export const backendReady = () => baseUrl().length > 0 && looksValid();

export const NOT_READY_MESSAGE = baseUrl().length > 0
  ? 'Setup not finished: the link in siteConfig.js (scriptUrl) must be the Web app link that ends with /exec, not the editor link. See Guide 1.'
  : 'This section is opening very soon. Please try again in a little while.';
const NETWORK_MESSAGE = 'We could not reach the server. Please check your internet and try again.';

async function readJson(response) {
  const text = await response.text();
  try { return JSON.parse(text); } catch (e) { throw new Error('Unexpected reply from the server. Please try again.'); }
}

export async function post(payload, timeoutMs = 90000) {
  if (!backendReady()) throw new Error(NOT_READY_MESSAGE);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    // text/plain keeps this a "simple" request, so Google does not block it (no CORS pre-check)
    response = await fetch(baseUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (e) {
    throw new Error(NETWORK_MESSAGE);
  } finally {
    clearTimeout(timer);
  }
  const data = await readJson(response);
  if (!data.success) throw new Error(data.message || 'Something went wrong. Please try again.');
  return data;
}

export async function get(action) {
  if (!backendReady()) throw new Error(NOT_READY_MESSAGE);
  let response;
  try {
    response = await fetch(`${baseUrl()}${baseUrl().includes('?') ? '&' : '?'}action=${action}&t=${Date.now()}`);
  } catch (e) {
    throw new Error(NETWORK_MESSAGE);
  }
  const data = await readJson(response);
  if (!data.success) throw new Error(data.message || 'Could not load.');
  return data;
}

export const submitRsvp = (form) => post({ action: 'rsvp', ...form });
export const submitBlessing = (form) => post({ action: 'blessing', ...form });
export const uploadPhoto = (payload) => post({ action: 'upload', ...payload }, 120000);
export const fetchPhotos = async () => {
  const list = (await get('photos')).photos || [];
  try { localStorage.setItem(GALLERY_KEY, JSON.stringify({ t: Date.now(), list })); } catch (e) { /* storage full or private mode */ }
  return list;
};
// The last photo list this phone saw, so the gallery can appear instantly while it refreshes.
const GALLERY_KEY = 'ss_gallery_v1';
export function cachedPhotos() {
  try { const c = JSON.parse(localStorage.getItem(GALLERY_KEY) || 'null'); return c && Array.isArray(c.list) ? c.list : null; } catch (e) { return null; }
}
// Fetched quietly a few seconds after any page opens, so the gallery is ready before the guest gets there.
let prefetched = false;
export function prefetchGallery() {
  if (prefetched || !backendReady()) return;
  prefetched = true;
  fetchPhotos().catch(() => { prefetched = false; });
}
export const fetchFaces = async () => (await get('faces')).faces || [];

// Small pictures for the grid, straight from Google's image server (one hop instead of two),
// sized for this phone's screen. Full view and download stay sharp / original.
export const tileSize = () => {
  const w = Math.min(typeof window !== 'undefined' ? window.innerWidth : 400, 1100);
  const cols = w >= 1024 ? 4 : w >= 640 ? 3 : 2;
  const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
  return Math.min(480, Math.ceil((w / cols) * dpr / 80) * 80);
};
export const tileUrl = (id) => `https://lh3.googleusercontent.com/d/${id}=w${tileSize()}`;
export const viewUrl = (id) => `https://lh3.googleusercontent.com/d/${id}=w1600`;
export const thumbUrl = (id, size = 600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
export const fullUrl = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
export const downloadUrl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

// Wakes the Google script up in the background so the first RSVP / photo is not slow.
let warmed = false;
export function warmUp() {
  if (warmed || !backendReady()) return;
  warmed = true;
  try { fetch(`${baseUrl()}?action=ping&t=${Date.now()}`, { mode: 'no-cors' }).catch(() => {}); } catch (e) { /* ignore */ }
}
