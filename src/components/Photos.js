import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, Button, Notice, PageHeader } from './ui';
import Icon from '../icons';
import { backendReady, NOT_READY_MESSAGE, uploadPhoto, fetchPhotos, fetchFaces, thumbUrl, fullUrl, downloadUrl } from '../api';
import { prepareForUpload, selfieCanvas } from '../photoTools';
import { loadFaceApi, describeFaces, matchPhotos } from '../faces';
import { sortedEvents, defaultUploadEvent } from '../utils';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

/* ============================================================
   SHARE  — choose celebration, pick photos, upload
   ============================================================ */
function SharePanel({ onUploaded, openGallery }) {
  const events = useMemo(() => sortedEvents(true), []);   // every function, for every guest
  const [event, setEvent] = useState(defaultUploadEvent());
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const inputRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!busy) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  const patch = (id, changes) => setItems((list) => list.map((it) => (it.id === id ? { ...it, ...changes } : it)));

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name));
    if (!files.length) return;
    setSummary('');
    setItems((list) => [...list, ...files.map((file) => ({ id: ++idRef.current, file, preview: URL.createObjectURL(file), status: 'ready', msg: '' }))]);
    loadFaceApi().catch(() => {}); // start fetching the face models in the background
  };

  const remove = (id) => setItems((list) => {
    const it = list.find((x) => x.id === id);
    if (it) URL.revokeObjectURL(it.preview);
    return list.filter((x) => x.id !== id);
  });

  const upload = async () => {
    setError('');
    if (!event) { setError('Please choose the celebration these photos are from.'); return; }
    const queue = items.filter((i) => i.status === 'ready' || i.status === 'error');
    if (!queue.length) { setError('Please choose at least one photo.'); return; }
    setBusy(true);
    setSummary('');

    let faceMode = 'unknown'; // unknown -> on/off
    let detectChain = Promise.resolve();
    const detect = (canvas) => {
      const run = detectChain.then(() => describeFaces(canvas, { minConfidence: 0.5 }));
      detectChain = run.catch(() => {});
      return run;
    };
    const facesFor = async (canvas) => {
      if (faceMode === 'off') return [];
      if (faceMode === 'unknown') {
        try { await withTimeout(loadFaceApi(), 45000); faceMode = 'on'; } catch (e) { faceMode = 'off'; return []; }
      }
      try { return (await withTimeout(detect(canvas), 40000)).map((f) => f.descriptor); } catch (e) { return []; }
    };

    let next = 0;
    let ok = 0;
    const worker = async () => {
      while (next < queue.length) {
        const item = queue[next]; next += 1;
        patch(item.id, { status: 'working', msg: '' });
        try {
          const prep = await prepareForUpload(item.file);
          const faces = await facesFor(prep.faceCanvas);
          let lastErr;
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await uploadPhoto({ event, mime: prep.mime, data: prep.base64, faces });
              lastErr = null;
              break;
            } catch (e) {
              lastErr = e;
              // eslint-disable-next-line no-await-in-loop
              await wait(1500 * (attempt + 1));
            }
          }
          if (lastErr) throw lastErr;
          ok += 1;
          patch(item.id, { status: 'done' });
        } catch (e) {
          patch(item.id, { status: 'error', msg: e.message === 'unsupported' ? 'This photo type is not supported' : 'Could not upload — tap Upload to retry' });
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    setBusy(false);
    const failed = queue.length - ok;
    setSummary(failed ? `${ok} photo${ok === 1 ? '' : 's'} added. ${failed} did not go through — please press Upload again to retry.` : `${ok} photo${ok === 1 ? '' : 's'} added to our wedding gallery. Thank you! ❤️`);
    if (ok) onUploaded();
  };

  const waiting = items.filter((i) => i.status === 'ready' || i.status === 'error').length;
  const doneCount = items.filter((i) => i.status === 'done').length;
  const total = items.length;
  const finished = items.filter((i) => i.status === 'done' || i.status === 'error').length;

  return (
    <Card>
      <h2 className="form-title">Share your photos</h2>
      {!backendReady() && <div className="mb-4"><Notice kind="info">{NOT_READY_MESSAGE}</Notice></div>}

      <label className="label" htmlFor="celebration">1. Which celebration are they from?</label>
      <select id="celebration" className="input" value={event} onChange={(e) => setEvent(e.target.value)} disabled={busy}>
        <option value="">Choose the celebration…</option>
        {events.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
      </select>

      <p className="label mt-5">2. Choose your photos</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      <button type="button" className="btn btn-gold btn-block" style={{ minHeight: '4rem', fontSize: '1.1rem' }} onClick={() => inputRef.current?.click()} disabled={busy}>
        <Icon name="image" size={26} /> Choose photos from your phone
      </button>
      <p className="hint mt-2">You can pick many photos at once. They are saved in good quality.</p>

      {items.length > 0 && (
        <div className="mt-5">
          <div className="g-grid">
            {items.map((it) => (
              <div key={it.id} className="g-tile" style={{ cursor: 'default' }}>
                <img src={it.preview} alt="" />
                <span className="absolute inset-0 grid place-items-center text-white font-bold" style={{ background: it.status === 'ready' ? 'transparent' : it.status === 'done' ? 'rgba(44,90,34,.55)' : it.status === 'error' ? 'rgba(138,31,31,.6)' : 'rgba(0,0,0,.45)', fontSize: '1.4rem' }}>
                  {it.status === 'done' ? '✓' : it.status === 'error' ? '!' : it.status === 'working' ? '…' : ''}
                </span>
                {!busy && it.status !== 'done' && (
                  <button type="button" aria-label="Remove photo" onClick={() => remove(it.id)} className="absolute top-1 right-1 grid place-items-center rounded-full" style={{ width: '1.7rem', height: '1.7rem', background: 'rgba(31,51,80,.85)', color: '#fff', border: 0 }}>
                    <Icon name="close" size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {items.some((i) => i.msg) && <p className="hint mt-2" style={{ color: '#8a1f1f' }}>{items.find((i) => i.msg).msg}</p>}
        </div>
      )}

      {busy && (
        <div className="mt-5">
          <div className="progress"><div style={{ width: `${total ? (finished / total) * 100 : 0}%` }} /></div>
          <p className="hint mt-2 text-center">Uploading {Math.min(finished + 1, total)} of {total}… please keep this page open.</p>
        </div>
      )}

      {error && <div className="mt-4"><Notice kind="error">{error}</Notice></div>}
      {summary && <div className="mt-4"><Notice kind="ok">{summary}</Notice></div>}

      <div className="mt-6 grid gap-3">
        <Button variant="primary" block onClick={upload} disabled={busy || !waiting || !backendReady()}>
          <Icon name="upload" size={22} /> {busy ? 'Uploading…' : waiting ? `Upload ${waiting} photo${waiting === 1 ? '' : 's'}` : 'Upload'}
        </Button>
        {doneCount > 0 && !busy && <Button variant="ghost" block onClick={openGallery}>See everyone’s photos</Button>}
      </div>
    </Card>
  );
}

/* ============================================================
   GALLERY — grouped by celebration, with "find my photos"
   ============================================================ */
const PREVIEW = 6; // photos shown per celebration before "See all"

function Tile({ photo, onOpen }) {
  const [src, setSrc] = useState(photo.thumb);
  return (
    <button className="g-tile" onClick={onOpen} aria-label="Open photo">
      <img src={src} alt="Wedding moment" loading="lazy" onError={() => { if (!photo.static && src === photo.thumb) setSrc(`https://lh3.googleusercontent.com/d/${photo.id}=w600`); }} />
    </button>
  );
}

function GalleryPanel({ active, openShare }) {
  const cfg = siteConfig.photos;
  const [guest, setGuest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [face, setFace] = useState({ status: 'idle', text: '' });
  const [matches, setMatches] = useState(null);
  const [selfie, setSelfie] = useState('');
  const [openIndex, setOpenIndex] = useState(-1);
  const facesCache = useRef(null);
  const cameraRef = useRef(null);
  const pickRef = useRef(null);

  const load = useCallback(async () => {
    if (!backendReady()) { setLoading(false); return; }
    setLoading(true);
    setError('');
    try {
      const list = await fetchPhotos();
      setGuest(list.map((p) => ({ id: p.id, event: p.event || 'Other', ts: p.ts, thumb: thumbUrl(p.id, 600), full: fullUrl(p.id), download: downloadUrl(p.id) })));
      facesCache.current = null; // new photos may have arrived
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (active) load(); }, [active, load]);

  const ours = useMemo(() => (cfg.ourPhotos || []).map((url, i) => ({ id: `our-${i}`, static: true, event: cfg.ourPhotosLabel || 'Our Photos', thumb: url, full: url, download: url })), [cfg]);
  const eventOrder = useMemo(() => sortedEvents(true).map((e) => e.name), []);

  const all = useMemo(() => {
    const pool = matches ? guest.filter((p) => matches.has(p.id)) : [...ours, ...guest];
    return pool;
  }, [guest, ours, matches]);

  // groups in celebration order
  const groups = useMemo(() => {
    const map = new Map();
    all.forEach((p) => { if (!map.has(p.event)) map.set(p.event, []); map.get(p.event).push(p); });
    const label = cfg.ourPhotosLabel || 'Our Photos';
    const names = [...map.keys()].sort((a, b) => {
      const ra = a === label ? -1 : eventOrder.indexOf(a) === -1 ? 999 : eventOrder.indexOf(a);
      const rb = b === label ? -1 : eventOrder.indexOf(b) === -1 ? 999 : eventOrder.indexOf(b);
      return ra - rb;
    });
    return names.map((name) => ({ name, photos: map.get(name) }));
  }, [all, eventOrder, cfg]);

  const shownGroups = filter === 'all' ? groups : groups.filter((g) => g.name === filter);
  const flat = useMemo(() => shownGroups.flatMap((g) => g.photos), [shownGroups]);

  useEffect(() => {
    if (openIndex < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIndex(-1);
      if (e.key === 'ArrowRight') setOpenIndex((i) => Math.min(i + 1, flat.length - 1));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openIndex, flat.length]);

  const findMe = async (file) => {
    if (!file) return;
    setFace({ status: 'working', text: 'Getting ready… the first time can take a few seconds.' });
    try {
      const canvas = await selfieCanvas(file);
      setSelfie(canvas.toDataURL('image/jpeg', 0.6));
      const found = await describeFaces(canvas, { minConfidence: 0.4 });
      if (!found.length) {
        setMatches(null);
        setFace({ status: 'error', text: 'We could not see a face clearly. Please try again in good light, looking straight at the camera.' });
        return;
      }
      setFace({ status: 'working', text: 'Looking through the photos…' });
      const records = facesCache.current || (await fetchFaces());
      facesCache.current = records;
      const m = matchPhotos(found[0].descriptor, records);
      setMatches(m);
      setFilter('all');
      setFace({ status: 'done', text: m.size ? '' : 'We could not find you in the photos yet. More photos are added all the time, so please check again later.' });
    } catch (e) {
      setFace({ status: 'error', text: e.message === 'unsupported' ? 'That picture type is not supported. Please try another.' : 'Face search is not available on this phone right now. You can still browse all the photos.' });
    }
  };

  const topRef = useRef(null);
  const pick = (name) => {
    setFilter(name);
    requestAnimationFrame(() => topRef.current && topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const swipe = useRef(null);

  const clearFace = () => { setMatches(null); setSelfie(''); setFace({ status: 'idle', text: '' }); };

  const chips = useMemo(() => {
    const src = matches ? groups : groups;
    return src.map((g) => ({ name: g.name, count: g.photos.length }));
  }, [groups, matches]);

  const current = openIndex >= 0 ? flat[openIndex] : null;
  const guestCount = guest.length;

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
      {/* find my photos */}
      {guestCount > 0 && (
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center flex-none rounded-full" style={{ width: '3.2rem', height: '3.2rem', background: 'var(--maroon)', color: '#f1d68e' }}><Icon name="face" size={26} /></span>
            <div>
              <h2 className="font-display font-bold" style={{ fontSize: '1.7rem', color: 'var(--maroon)', lineHeight: 1.1 }}>Find my photos</h2>
              <p className="text-muted" style={{ fontSize: '.95rem' }}>Take a quick selfie and we will show the photos you are in.</p>
            </div>
          </div>

          {!matches && face.status !== 'working' && (
            <div className="grid sm:grid-cols-2 gap-3 mt-4 fm-btns">
              <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => { findMe(e.target.files[0]); e.target.value = ''; }} />
              <input ref={pickRef} type="file" accept="image/*" className="hidden" onChange={(e) => { findMe(e.target.files[0]); e.target.value = ''; }} />
              <Button variant="primary" onClick={() => cameraRef.current?.click()}><Icon name="camera" size={22} /> Take a selfie</Button>
              <Button variant="ghost" onClick={() => pickRef.current?.click()}><Icon name="image" size={22} /> Choose a picture</Button>
            </div>
          )}

          {face.status === 'working' && <div className="mt-4"><Notice kind="info">{face.text}</Notice></div>}
          {face.status === 'error' && <div className="mt-4"><Notice kind="error">{face.text}</Notice></div>}
          {face.status === 'done' && face.text && <div className="mt-4"><Notice kind="info">{face.text}</Notice></div>}

          {matches && (
            <div className="mt-4 flex items-center gap-3">
              {selfie && <img src={selfie} alt="Your selfie" style={{ width: '3.4rem', height: '3.4rem', borderRadius: '999px', objectFit: 'cover', border: '2px solid var(--gold)' }} />}
              <p className="flex-1 font-semibold">{matches.size ? `Found ${matches.size} photo${matches.size === 1 ? '' : 's'} of you` : 'No photos of you yet'}</p>
              <Button variant="ghost" onClick={clearFace} style={{ minHeight: '2.6rem', padding: '.3rem 1rem' }}>Show all</Button>
            </div>
          )}
          <p className="hint mt-3" style={{ marginBottom: 0 }}>🔒 Your selfie stays on your phone. It is never uploaded or saved.</p>
        </Card>
      )}

      {/* filters */}
      <div ref={topRef} style={{ scrollMarginTop: '5.5rem' }}>
        <div className="flex items-center justify-between mb-3 gap-3">
          <p className="font-semibold">{loading ? 'Loading photos…' : `${all.length} photo${all.length === 1 ? '' : 's'}`}</p>
          <button className="chip" onClick={load} disabled={loading}><Icon name="refresh" size={16} /> Refresh</button>
        </div>
        {chips.length > 1 && (
          <div className="g-filters">
            <button className={`chip ${filter === 'all' ? 'chip-on' : ''}`} onClick={() => pick('all')}>All</button>
            {chips.map((c) => (
              <button key={c.name} className={`chip ${filter === c.name ? 'chip-on' : ''}`} onClick={() => pick(c.name)}>{c.name} · {c.count}</button>
            ))}
          </div>
        )}
      </div>

      {!backendReady() && <Notice kind="info">Guest photos will appear here once sharing opens.</Notice>}
      {error && <Notice kind="error">{error}</Notice>}

      {filter !== 'all' && (
        <button className="btn btn-ghost g-back" onClick={() => pick('all')}><Icon name="chevronLeft" size={20} /> All celebrations</button>
      )}

      {shownGroups.map((g) => {
        const preview = filter === 'all' && !matches && shownGroups.length > 1;
        const list = preview ? g.photos.slice(0, PREVIEW) : g.photos;
        return (
          <section key={g.name}>
            <h3 className="font-display font-bold mb-2" style={{ fontSize: '1.7rem', color: 'var(--maroon)', lineHeight: 1.15 }}>{g.name} <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}>· {g.photos.length} photo{g.photos.length === 1 ? '' : 's'}</span></h3>
            <div className="g-grid">
              {list.map((p) => (
                <Tile key={p.id} photo={p} onOpen={() => setOpenIndex(flat.indexOf(p))} />
              ))}
            </div>
            {list.length < g.photos.length && (
              <button className="btn btn-ghost btn-block g-more" onClick={() => pick(g.name)}>See all {g.photos.length} photos from {g.name} <Icon name="chevronRight" size={20} /></button>
            )}
          </section>
        );
      })}

      {!loading && guestCount === 0 && backendReady() && !error && (
        <Card className="text-center">
          <p className="font-display font-bold" style={{ fontSize: '1.6rem', color: 'var(--maroon)' }}>No guest photos yet</p>
          <p className="text-muted mt-1">Be the first to share a memory!</p>
          <div className="mt-4"><Button variant="primary" onClick={openShare}><Icon name="camera" size={20} /> Share photos</Button></div>
        </Card>
      )}

      {cfg.photographerGalleryUrl && (
        <Card className="text-center">
          <p className="eyebrow">Professional photographs</p>
          <h3 className="font-display font-bold mt-1" style={{ fontSize: '1.7rem', color: 'var(--maroon)' }}>Photos by our photographer</h3>
          <div className="mt-4"><a className="btn btn-primary" href={cfg.photographerGalleryUrl} target="_blank" rel="noopener noreferrer">Open the photographer’s gallery</a></div>
        </Card>
      )}

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpenIndex(-1)}
          onTouchStart={(e) => { const t = e.touches[0]; swipe.current = { x: t.clientX, y: t.clientY }; }}
          onTouchEnd={(e) => {
            const s0 = swipe.current; swipe.current = null; if (!s0) return;
            const t = e.changedTouches[0]; const dx = t.clientX - s0.x; const dy = t.clientY - s0.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) setOpenIndex((i) => (dx < 0 ? Math.min(i + 1, flat.length - 1) : Math.max(i - 1, 0)));
          }}>
          <button className="btn btn-light" style={{ position: 'absolute', top: '.8rem', right: '.8rem', minHeight: '2.8rem', padding: '.3rem 1rem' }} onClick={() => setOpenIndex(-1)}><Icon name="close" size={20} /> Close</button>
          <img src={current.full} alt="Wedding moment" onClick={(e) => e.stopPropagation()} onError={(e) => { if (!current.static && !e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = `https://lh3.googleusercontent.com/d/${current.id}=w1600`; } }} />
          <div className="flex items-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-light" style={{ minHeight: '3rem', padding: '.3rem 1rem' }} onClick={() => setOpenIndex((i) => Math.max(i - 1, 0))} disabled={openIndex === 0} aria-label="Previous"><Icon name="chevronLeft" size={22} /></button>
            <a className="btn btn-gold" href={current.download} target="_blank" rel="noopener noreferrer" download><Icon name="download" size={20} /> Download</a>
            <button className="btn btn-light" style={{ minHeight: '3rem', padding: '.3rem 1rem' }} onClick={() => setOpenIndex((i) => Math.min(i + 1, flat.length - 1))} disabled={openIndex === flat.length - 1} aria-label="Next"><Icon name="chevronRight" size={22} /></button>
          </div>
          <p className="mt-3 text-center" style={{ color: '#e9edf4', fontSize: '1rem' }}>{current.event} · {openIndex + 1} of {flat.length}<br /><span style={{ fontSize: '.85rem', opacity: .75 }}>Swipe or use the arrows</span></p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Photos() {
  const cfg = siteConfig.photos;
  const [tab, setTab] = useState(() => (window.location.hash === '#gallery' ? 'gallery' : 'share'));
  const [refreshKey, setRefreshKey] = useState(0);

  const go = (t) => {
    setTab(t);
    try { window.history.replaceState(null, '', t === 'gallery' ? '#gallery' : '#share'); } catch (e) { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="Scan · Share · Relive" title={cfg.title} subtitle={cfg.subtitle} />

        <div className="seg mb-6" role="tablist">
          <button role="tab" aria-selected={tab === 'share'} className={tab === 'share' ? 'on' : ''} onClick={() => go('share')}><Icon name="camera" size={22} /> Share Photos</button>
          <button role="tab" aria-selected={tab === 'gallery'} className={tab === 'gallery' ? 'on' : ''} onClick={() => go('gallery')}><Icon name="image" size={22} /> Gallery</button>
        </div>

        <div hidden={tab !== 'share'}><SharePanel onUploaded={() => setRefreshKey((k) => k + 1)} openGallery={() => go('gallery')} /></div>
        <div hidden={tab !== 'gallery'}><GalleryPanel key={refreshKey} active={tab === 'gallery'} openShare={() => go('share')} /></div>
      </div>
    </main>
  );
}
