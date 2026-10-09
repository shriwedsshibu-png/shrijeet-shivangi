import siteConfig from './siteConfig';
import { eventAllowed, pageHidden } from './tier';

const IST = 'Asia/Kolkata';

export function parseTime(t) {
  const m = String(t || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return { h: 0, m: 0 };
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return { h, m: Number(m[2]) };
}

const two = (n) => String(n).padStart(2, '0');

// Start of an event as a real Date (Indian time)
export function eventStart(event) {
  const { h, m } = parseTime(event.time);
  return new Date(`${event.date}T${two(h)}:${two(m)}:00+05:30`);
}

// Events this guest is invited to (all of them for 3-day guests). Pass true to get every event.
export function sortedEvents(everyone = false) {
  return [...(siteConfig.events?.events || [])].filter((e) => everyone || eventAllowed(e.name)).sort((a, b) => eventStart(a) - eventStart(b));
}

export function formatLongDate(dateStr) {
  return new Date(`${dateStr}T12:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: IST,
  });
}

export function dayAndMonth(dateStr) {
  const d = new Date(`${dateStr}T12:00:00+05:30`);
  return {
    day: d.toLocaleDateString('en-IN', { day: 'numeric', timeZone: IST }),
    month: d.toLocaleDateString('en-IN', { month: 'short', timeZone: IST }),
    weekday: d.toLocaleDateString('en-IN', { weekday: 'long', timeZone: IST }),
  };
}

function toCalStamp(date) {
  const ist = new Date(date.getTime() + 5.5 * 3600 * 1000);
  return ist.toISOString().replace(/[-:]/g, '').slice(0, 15);
}

export function calendarLink(event) {
  const start = eventStart(event);
  const end = new Date(start.getTime() + 3 * 3600 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.name} — ${siteConfig.couple.name1} & ${siteConfig.couple.name2}'s Wedding`,
    dates: `${toCalStamp(start)}/${toCalStamp(end)}`,
    ctz: IST,
    details: event.description || '',
    location: `${siteConfig.wedding.venueName}, ${siteConfig.wedding.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Which celebration is "on now"? Used to pre-select the photo upload menu.
export function currentEventName(now = new Date()) {
  const list = sortedEvents(true);
  let pick = '';
  list.forEach((e) => {
    const s = eventStart(e).getTime();
    if (now.getTime() >= s - 30 * 60 * 1000 && now.getTime() <= s + 9 * 3600 * 1000) pick = e.name;
  });
  return pick;
}

// Photo uploads: the same list for every guest, whichever invite link they came from.
// Only functions that have already begun (from 30 min before), so on 30 Nov it is just Faldaan,
// and by the wedding evening all of them. Before the first function, every function is listed.
export function uploadableEvents(now = new Date()) {
  const all = sortedEvents(true);
  const started = all.filter((e) => now.getTime() >= eventStart(e).getTime() - 30 * 60 * 1000);
  return started.length ? started : all;
}

// The function to preselect: the one going on now, else the most recent one that has begun.
export function defaultUploadEvent(now = new Date()) {
  const cur = currentEventName(now);
  if (cur) return cur;
  const started = sortedEvents(true).filter((e) => now.getTime() >= eventStart(e).getTime() - 30 * 60 * 1000);
  return started.length ? started[started.length - 1].name : '';
}

export function getDeviceId() {
  try {
    let id = localStorage.getItem('wedding_device_id');
    if (!id) {
      id = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('wedding_device_id', id);
    }
    return id;
  } catch (e) {
    return `t${Math.random().toString(36).slice(2, 12)}`;
  }
}

export function loadSaved(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

export function isFeatureOn(key) {
  return !!siteConfig.features?.[key]?.enabled && !pageHidden(key);
}
