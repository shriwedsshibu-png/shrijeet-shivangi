import siteConfig from './siteConfig';

const baseUrl = () => String(siteConfig.backend?.scriptUrl || process.env.REACT_APP_BACKEND_URL || '').trim();

export const backendReady = () => baseUrl().length > 0;

export const NOT_READY_MESSAGE = 'This section is opening very soon. Please try again in a little while.';
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
export const fetchPhotos = async () => (await get('photos')).photos || [];
export const fetchFaces = async () => (await get('faces')).faces || [];

export const thumbUrl = (id, size = 600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
export const fullUrl = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
export const downloadUrl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;
