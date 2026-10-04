import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import siteConfig from '../siteConfig';

/* ============================================================================
   The invitation film: a full-screen, scroll-through story (made for phones).
   Opens for first-time visitors and on /invite. All words come from siteConfig.js
   (events, dates, venue) plus the small Hinglish lines below.
   ========================================================================== */

export const SEEN_KEY = 'ss_invite_seen';
const MUSIC_SRC = '/audio/invite.mp3'; // optional: drop a royalty-free file here to enable music

const LINES = {
  Faldaan: { hing: 'Rishta pakka, mithai pakki!', icon: 'kalash' },
  Mehndi: { hing: 'Haathon mein mehndi, dil mein khushi', icon: 'hand' },
  'Engagement & Sangeet': { hing: 'Aaj raat dance floor humara hai', icon: 'dhol' },
  Haldi: { hing: 'Peela rang, pyaar ka rang', icon: 'marigold' },
  'Varmala & Shaadi': { hing: 'Saat phere, saat vachan, ek zindagi', icon: 'mandap' },
};

const fmtDate = (iso) =>
  new Date(iso + 'T12:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });

/* ---------- small illustrations (original, drawn in SVG) ---------- */
const GOLD = '#e7b94f';
const MAR = '#7a1f31';

function Lantern({ x, y, s = 1, d = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="iv-float" style={{ animationDelay: d + 's' }}>
        <line x1="0" y1="-30" x2="0" y2="-10" stroke="#ffd98a" strokeWidth="1" />
        <circle cx="0" cy="6" r="26" fill="url(#glow)" opacity=".7" />
        <ellipse cx="0" cy="6" rx="11" ry="15" fill="#ffb347" />
        <rect x="-6" y="-11" width="12" height="4" rx="1.5" fill={GOLD} />
        <rect x="-5" y="19" width="10" height="3" rx="1.5" fill={GOLD} />
      </g>
    </g>
  );
}

function Couple({ scale = 1 }) {
  // groom: short dark hair, light-brown skin, ivory sherwani. bride: long black hair, round glasses, red lehenga.
  return (
    <svg viewBox="0 0 260 300" width={260 * scale} height={300 * scale} role="img" aria-label="Illustration of the couple">
      <defs>
        <linearGradient id="lehenga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c2183b" /><stop offset="1" stopColor="#8e0f2b" /></linearGradient>
        <linearGradient id="sher" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf0d6" /><stop offset="1" stopColor="#ecd8a8" /></linearGradient>
      </defs>
      {/* groom */}
      <g>
        <path d="M60 300 L68 150 Q90 132 112 150 L120 300 Z" fill="url(#sher)" />
        <path d="M90 140 L90 300" stroke={GOLD} strokeWidth="2" strokeDasharray="3 5" />
        <path d="M66 156 Q52 210 60 250" stroke="#ecd8a8" strokeWidth="14" strokeLinecap="round" fill="none" />
        <rect x="83" y="118" width="14" height="20" rx="5" fill="#b9805a" />
        <ellipse cx="90" cy="100" rx="22" ry="26" fill="#c68d63" />
        <path d="M68 96 Q68 70 90 70 Q112 70 112 96 Q104 82 90 82 Q76 82 68 96Z" fill="#1d1511" />
        <circle cx="82" cy="102" r="2" fill="#2a1a12" /><circle cx="98" cy="102" r="2" fill="#2a1a12" />
        <path d="M83 113 Q90 119 97 113" stroke="#7b3f2a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M72 118 Q90 134 108 118 Q104 128 90 130 Q76 128 72 118Z" fill="#2a1d17" opacity=".35" />
        <path d="M70 150 Q90 160 110 150 L108 170 Q90 176 72 170Z" fill={MAR} />
        <path d="M74 150 Q90 164 106 150" stroke={GOLD} strokeWidth="2" fill="none" />
      </g>
      {/* bride */}
      <g>
        <path d="M128 300 L134 168 Q160 150 186 168 L206 300 Z" fill="url(#lehenga)" />
        <path d="M138 176 Q160 196 184 176" stroke={GOLD} strokeWidth="2.5" fill="none" />
        <path d="M130 250 Q167 262 204 250" stroke={GOLD} strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <path d="M134 178 Q108 214 102 252" stroke="#c2183b" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M138 128 Q118 190 128 262 Q150 238 154 140Z" fill="#14100e" />
        <path d="M184 128 Q204 190 192 262 Q172 238 168 140Z" fill="#14100e" />
        <rect x="153" y="130" width="14" height="22" rx="5" fill="#d9a07e" />
        <ellipse cx="160" cy="112" rx="21" ry="25" fill="#e2ae8d" />
        <path d="M138 108 Q138 82 160 82 Q182 82 182 108 Q176 92 160 92 Q144 92 138 108Z" fill="#14100e" />
        <circle cx="152" cy="114" r="7" fill="none" stroke="#3b2a22" strokeWidth="1.6" /><circle cx="168" cy="114" r="7" fill="none" stroke="#3b2a22" strokeWidth="1.6" /><line x1="159" y1="114" x2="161" y2="114" stroke="#3b2a22" strokeWidth="1.6" />
        <circle cx="152" cy="114" r="1.8" fill="#2a1a12" /><circle cx="168" cy="114" r="1.8" fill="#2a1a12" />
        <path d="M153 125 Q160 131 167 125" stroke="#a23a3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="97" r="2.2" fill="#c2183b" />
        <path d="M148 88 Q160 80 172 88" stroke={GOLD} strokeWidth="2" fill="none" />
        <path d="M134 172 Q160 196 186 172 L186 182 Q160 204 134 182Z" fill="#e8b84b" opacity=".9" />
      </g>
      {/* garland between them */}
      <path d="M96 168 Q128 214 160 172" stroke="#f4a62a" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="1 7" />
      <path d="M96 168 Q128 214 160 172" stroke="#e8792b" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="1 11" />
    </svg>
  );
}

function Icon({ name, size = 120 }) {
  const c = { width: size, height: size, viewBox: '0 0 120 120', 'aria-hidden': true };
  if (name === 'kalash')
    return (<svg {...c}><path d="M38 52 Q36 100 60 104 Q84 100 82 52Z" fill="#c9962f" /><rect x="40" y="44" width="40" height="9" rx="4" fill="#e7b94f" /><ellipse cx="60" cy="38" rx="15" ry="11" fill="#7a9a3a" /><circle cx="60" cy="30" r="10" fill="#8b5a2b" /><path d="M46 66 Q60 80 74 66" stroke="#7a1f31" strokeWidth="4" fill="none" /><circle cx="60" cy="86" r="5" fill="#7a1f31" /></svg>);
  if (name === 'hand')
    return (<svg {...c}><path d="M44 104 L40 62 Q38 50 46 50 Q50 50 50 58 L50 36 Q50 28 57 28 Q63 28 63 36 L63 30 Q63 22 70 22 Q76 22 76 30 L76 36 Q82 34 84 42 L84 74 Q84 100 66 106Z" fill="#e3b08c" /><g stroke="#7a2c12" strokeWidth="2.4" fill="none" strokeLinecap="round"><path d="M56 70 q6 -8 12 0 q6 8 12 0" /><circle cx="66" cy="86" r="5" /><path d="M57 40 v14 M70 34 v18 M78 44 v12" /><circle cx="66" cy="86" r="1.4" fill="#7a2c12" /></g></svg>);
  if (name === 'dhol')
    return (<svg {...c}><ellipse cx="60" cy="60" rx="38" ry="22" fill="#a8541f" /><rect x="22" y="48" width="76" height="24" fill="#c7692a" /><ellipse cx="22" cy="60" rx="9" ry="22" fill="#e9c27a" /><ellipse cx="98" cy="60" rx="9" ry="22" fill="#e9c27a" /><path d="M30 44 L44 76 M46 44 L60 76 M62 44 L76 76 M78 44 L92 76" stroke="#7a1f31" strokeWidth="3" /><path d="M96 20 q8 -6 8 6 M88 14 q8 -6 8 6" stroke="#e7b94f" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>);
  if (name === 'marigold')
    return (<svg {...c}>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <ellipse key={a} cx="60" cy="32" rx="11" ry="20" fill="#f5a300" transform={`rotate(${a} 60 60)`} />)}{[22, 67, 112, 157, 202, 247, 292, 337].map((a) => <ellipse key={a} cx="60" cy="38" rx="8" ry="15" fill="#ffc933" transform={`rotate(${a} 60 60)`} />)}<circle cx="60" cy="60" r="11" fill="#c46a00" /></svg>);
  return (<svg {...c}><path d="M18 104 L18 56 Q60 8 102 56 L102 104Z" fill="#e8c36a" /><path d="M28 104 L28 62 Q60 24 92 62 L92 104Z" fill="#7a1f31" /><path d="M20 58 Q60 14 100 58" stroke="#fff3c9" strokeWidth="3" fill="none" strokeDasharray="2 6" strokeLinecap="round" /><path d="M36 104 Q60 58 84 104Z" fill="#f4a62a" opacity=".92" /><path d="M42 74 Q60 90 78 74" stroke="#e8792b" strokeWidth="5" fill="none" strokeDasharray="1 8" strokeLinecap="round" /></svg>);
}

/* ---------- scratch-to-reveal date ---------- */
function Scratch({ children, onReveal }) {
  const ref = useRef(null);
  const down = useRef(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const r = cv.getBoundingClientRect();
    cv.width = r.width * 2; cv.height = r.height * 2;
    const x = cv.getContext('2d');
    const g = x.createLinearGradient(0, 0, cv.width, cv.height);
    g.addColorStop(0, '#d9a93f'); g.addColorStop(.5, '#f6e2a3'); g.addColorStop(1, '#b8893b');
    x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height);
    x.fillStyle = 'rgba(122,31,49,.75)'; x.textAlign = 'center';
    x.font = `${cv.width * 0.075}px Cinzel, serif`; x.fillText('SCRATCH HERE', cv.width / 2, cv.height / 2 - 6);
    x.font = `${cv.width * 0.055}px Lora, serif`; x.fillText('yahan ragdiye ✨', cv.width / 2, cv.height / 2 + cv.width * 0.075);
  }, []);

  const scratch = (e) => {
    if (!down.current || gone) return;
    const cv = ref.current, r = cv.getBoundingClientRect(), x = cv.getContext('2d');
    const px = ((e.clientX - r.left) / r.width) * cv.width, py = ((e.clientY - r.top) / r.height) * cv.height;
    x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(px, py, cv.width * 0.075, 0, 7); x.fill();
  };
  const check = () => {
    down.current = false;
    const cv = ref.current; if (!cv || gone) return;
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let n = 0, t = 0;
    for (let i = 3; i < d.length; i += 160) { t++; if (d[i] < 40) n++; }
    if (n / t > 0.42) { setGone(true); onReveal && onReveal(); }
  };
  return (
    <div className="iv-scratch">
      {children}
      <canvas ref={ref} className={gone ? 'gone' : ''} onPointerDown={(e) => { down.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }} onPointerMove={scratch} onPointerUp={check} onPointerCancel={check} />
    </div>
  );
}

function useCountdown(target) {
  const [t, setT] = useState(() => new Date(target).getTime() - Date.now());
  useEffect(() => { const id = setInterval(() => setT(new Date(target).getTime() - Date.now()), 1000); return () => clearInterval(id); }, [target]);
  const s = Math.max(0, Math.floor(t / 1000));
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
}

/* ---------- the film ---------- */
export default function InviteFilm() {
  const nav = useNavigate();
  const root = useRef(null);
  const audio = useRef(null);
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const cd = useCountdown(siteConfig.wedding.countdownTo);
  const events = siteConfig.events.events;
  const rsvpOn = !!siteConfig.features?.rsvp?.enabled;
  const total = 5 + events.length;

  const mark = () => { try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ } };
  const leave = useCallback((to) => { mark(); if (audio.current) audio.current.pause(); nav(to); window.scrollTo(0, 0); }, [nav]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const a = new Audio(MUSIC_SRC); a.loop = true; a.volume = 0.6; audio.current = a;
    a.addEventListener('canplaythrough', () => setHasMusic(true), { once: true });
    return () => { document.body.style.overflow = ''; a.pause(); };
  }, []);

  // reveal-on-scroll + active dot
  useEffect(() => {
    if (!opened || !root.current) return;
    const secs = root.current.querySelectorAll('.iv-sec');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) { e.target.classList.add('in'); setActive(+e.target.dataset.i); }
    }), { root: root.current, threshold: [0.55] });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [opened]);

  const open = () => {
    setOpened(true);
    if (audio.current && hasMusic) audio.current.play().then(() => setMusicOn(true)).catch(() => {});
    setTimeout(() => root.current && root.current.scrollTo({ top: root.current.clientHeight, behavior: 'smooth' }), 150);
  };
  const toggleMusic = () => {
    const a = audio.current; if (!a) return;
    if (musicOn) { a.pause(); setMusicOn(false); } else a.play().then(() => setMusicOn(true)).catch(() => {});
  };
  const replay = () => { root.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  const next = () => root.current.scrollBy({ top: root.current.clientHeight, behavior: 'smooth' });

  const names = siteConfig.couple;
  let idx = 0;

  return (
    <div className="iv" ref={root} role="dialog" aria-label="Wedding invitation">
      <button className="iv-skip" onClick={() => leave('/')}>Skip <span>· seedha website</span></button>
      {hasMusic && <button className="iv-snd" onClick={toggleMusic} aria-label={musicOn ? 'Mute music' : 'Play music'}>{musicOn ? '🔊' : '🔈'}</button>}
      {opened && <div className="iv-dots" aria-hidden>{Array.from({ length: total }).map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}</div>}

      {/* 1. cover */}
      <section className="iv-sec iv-night in" data-i={idx++}>
        <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs><radialGradient id="glow"><stop offset="0" stopColor="#fff4c4" stopOpacity=".95" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient></defs>
          {Array.from({ length: 36 }).map((_, i) => <circle key={i} className="iv-tw" cx={(i * 97) % 390} cy={(i * 53) % 420} r={(i % 3) * 0.5 + 0.7} fill="#fff" style={{ animationDelay: (i % 7) * 0.4 + 's' }} />)}
          <Lantern x={50} y={90} s={1.1} d={0} /><Lantern x={150} y={150} s={0.8} d={0.7} /><Lantern x={250} y={80} s={1} d={1.2} /><Lantern x={340} y={170} s={1.2} d={0.3} />
          <Lantern x={95} y={240} s={0.7} d={1.5} /><Lantern x={300} y={290} s={0.8} d={0.9} /><Lantern x={30} y={320} s={0.9} d={0.4} />
          <path d="M0 640 Q100 600 200 640 T390 630 L390 800 L0 800Z" fill="#1d1348" />
          <path d="M0 690 Q120 660 220 690 T390 680 L390 800 L0 800Z" fill="#2a1a5c" />
        </svg>
        <div className="iv-in">
          <p className="iv-small rv" style={{ '--d': '.2s' }}>॥ श्री गणेशाय नमः ॥</p>
          <p className="iv-small rv" style={{ '--d': '.5s', marginTop: '.8rem' }}>Hum shaadi kar rahe hain!</p>
          <h1 className="iv-names rv" style={{ '--d': '.9s' }}>{names.name1}<span>&amp;</span>{names.name2}</h1>
          <div className="rv" style={{ '--d': '1.3s' }}><Couple scale={0.9} /></div>
          {!opened
            ? <button className="iv-cta rv" style={{ '--d': '1.7s' }} onClick={open}>✉ Tap to open your invitation</button>
            : <p className="iv-small">scroll ↓</p>}
        </div>
      </section>

      {opened && (<>
        {/* 2. date reveal */}
        <section className="iv-sec iv-rose" data-i={idx++}>
          <div className="iv-in">
            <p className="iv-small dark rv">Save the date · Tareekh note kar lo</p>
            <h2 className="iv-h rv" style={{ '--d': '.2s' }}>Ghisiye aur jaaniye</h2>
            <div className="rv" style={{ '--d': '.4s' }}>
              <Scratch onReveal={() => setRevealed(true)}>
                <div className="iv-date"><b>2 December</b><span>2026 · Wednesday</span></div>
              </Scratch>
            </div>
            <div className={'iv-cd rv ' + (revealed ? 'show' : '')} style={{ '--d': '.6s' }}>
              {[['days', cd[0]], ['hrs', cd[1]], ['min', cd[2]], ['sec', cd[3]]].map(([l, v]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><i>{l}</i></div>)}
            </div>
            <p className="iv-small dark rv" style={{ '--d': '.8s' }}>{revealed ? 'Bas itne din baaki! 🎉' : 'Ungli se ragdiye ☝'}</p>
          </div>
        </section>

        {/* 3. message */}
        <section className="iv-sec iv-cream" data-i={idx++}>
          <div className="iv-in">
            <p className="iv-small dark rv">Aapka invitation</p>
            <h2 className="iv-h rv" style={{ '--d': '.15s' }}>Aap sabko dil se bulaawa hai</h2>
            <p className="iv-p rv" style={{ '--d': '.3s' }}>{siteConfig.homepage.invitationTop}</p>
            <p className="iv-names2 rv" style={{ '--d': '.45s' }}>{names.name1} <em>&amp;</em> {names.name2}</p>
            <p className="iv-p rv" style={{ '--d': '.6s' }}>{siteConfig.homepage.invitationBottom}</p>
            <p className="iv-deva rv" style={{ '--d': '.75s' }}>{siteConfig.homepage.welcomeHindi}</p>
          </div>
        </section>

        {/* 4+. events */}
        {events.map((ev, k) => {
          const l = LINES[ev.name] || { hing: ev.description, icon: 'mandap' };
          return (
            <section key={ev.id} className={'iv-sec ' + ['iv-teal', 'iv-green', 'iv-plum', 'iv-sun', 'iv-royal'][k % 5]} data-i={idx++}>
              <div className="iv-in">
                <p className="iv-small rv">Function {k + 1} of {events.length}</p>
                <div className="iv-card rv" style={{ '--d': '.15s' }}>
                  <div className="iv-ico"><Icon name={l.icon} /></div>
                  <h2>{ev.name}</h2>
                  <p className="iv-hing">{l.hing}</p>
                  <div className="iv-when"><b>{fmtDate(ev.date)}</b><span>{ev.time}</span></div>
                  <div className="iv-dress">Dress code · {ev.dressCode}</div>
                </div>
                <p className="iv-p light rv" style={{ '--d': '.4s' }}>{ev.description}</p>
              </div>
            </section>
          );
        })}

        {/* venue */}
        <section className="iv-sec iv-sea" data-i={idx++}>
          <svg className="iv-waves" viewBox="0 0 390 120" preserveAspectRatio="none" aria-hidden><path className="w1" d="M0 60 Q50 30 100 60 T200 60 T300 60 T400 60 V120 H0Z" fill="#ffffff22" /><path className="w2" d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80 V120 H0Z" fill="#ffffff2e" /></svg>
          <div className="iv-in">
            <p className="iv-small rv">Jahan hum milenge</p>
            <h2 className="iv-h light rv" style={{ '--d': '.15s' }}>{siteConfig.wedding.venueName}</h2>
            <p className="iv-p light rv" style={{ '--d': '.3s' }}>{siteConfig.wedding.city} · samundar ke kinaare, ek hi jagah par saare functions</p>
            <a className="iv-cta rv" style={{ '--d': '.5s' }} href={siteConfig.wedding.mapLink} target="_blank" rel="noopener noreferrer">📍 Open in Google Maps</a>
          </div>
        </section>

        {/* finale */}
        <section className="iv-sec iv-night fin" data-i={idx++}>
          <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {Array.from({ length: 30 }).map((_, i) => <circle key={i} className="iv-tw" cx={(i * 89) % 390} cy={(i * 61) % 500} r={(i % 3) * 0.5 + 0.7} fill="#fff" style={{ animationDelay: (i % 7) * 0.4 + 's' }} />)}
            <Lantern x={60} y={120} s={1} d={0.2} /><Lantern x={330} y={100} s={1.1} d={0.8} /><Lantern x={200} y={60} s={0.8} d={0.5} />
          </svg>
          <div className="iv-in">
            <h2 className="iv-names rv" style={{ fontSize: 'clamp(2.4rem,11vw,3.6rem)' }}>Aap aayenge na?</h2>
            <p className="iv-p light rv" style={{ '--d': '.2s' }}>Aapke bina yeh shaadi adhuri hai. Bas ek tap mein bataiye.</p>
            <div className="iv-btns rv" style={{ '--d': '.4s' }}>
              {rsvpOn && <button className="iv-cta gold" onClick={() => leave('/rsvp')}>💌 Confirm RSVP</button>}
              <button className="iv-cta" onClick={() => leave('/')}>🪔 Explore the website</button>
              <button className="iv-link" onClick={replay}>↺ Replay invitation</button>
            </div>
          </div>
        </section>
        {active < total - 1 && <button className="iv-next" onClick={next} aria-label="Next">⌄</button>}
      </>)}
    </div>
  );
}
