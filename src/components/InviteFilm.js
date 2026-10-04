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
  Faldaan: { hing: 'Two families, one promise', icon: 'kalash' },
  Mehndi: { hing: 'Henna, laughter and lots of colour', icon: 'hand' },
  'Engagement & Sangeet': { hing: 'Music, dance and the whole family', icon: 'dhol' },
  Haldi: { hing: 'Yellow hands, golden blessings', icon: 'marigold' },
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
  // Original illustration. Groom: short dark hair, light stubble, ivory sherwani. Bride: long black hair, round glasses, red lehenga.
  const marigolds = [];
  for (let i = 0; i < 9; i++) marigolds.push(<circle key={'a' + i} cx={52 + i * 24.5} cy={58 + Math.sin(i * 0.9) * 9 + (i % 2) * 5} r="7" fill={i % 2 ? '#f5a300' : '#ff7a1a'} />);
  return (
    <svg viewBox="0 0 300 340" width={300 * scale} height={340 * scale} role="img" aria-label="Illustration of the couple under a floral arch">
      <defs>
        <radialGradient id="aura" cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <linearGradient id="sherG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dd" /><stop offset="1" stopColor="#e6cd92" /></linearGradient>
        <linearGradient id="lehG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d81f45" /><stop offset="1" stopColor="#7d0b24" /></linearGradient>
        <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d49a70" /><stop offset="1" stopColor="#bd8259" /></linearGradient>
        <linearGradient id="skinB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efc3a2" /><stop offset="1" stopColor="#dca883" /></linearGradient>
        <linearGradient id="archG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9962f" /><stop offset=".5" stopColor="#f6dc8c" /><stop offset="1" stopColor="#c9962f" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="170" rx="150" ry="170" fill="url(#aura)" />
      {/* arch */}
      <path d="M30 330 L30 130 Q30 22 150 22 Q270 22 270 130 L270 330" fill="none" stroke="url(#archG)" strokeWidth="7" strokeLinecap="round" />
      <path d="M44 330 L44 134 Q44 38 150 38 Q256 38 256 134 L256 330" fill="none" stroke="#f6dc8c" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" />
      <g>{marigolds}</g>
      {[70, 108, 150, 192, 232].map((x, i) => (<g key={x}><line x1={x} y1={64 + (i % 2) * 6} x2={x} y2={92 + (i % 3) * 8} stroke="#f5a300" strokeWidth="2.4" strokeDasharray="1 5" strokeLinecap="round" /><circle cx={x} cy={96 + (i % 3) * 8} r="5" fill="#ff7a1a" /></g>))}
      <ellipse cx="150" cy="326" rx="118" ry="10" fill="#000" opacity=".25" />

      {/* groom */}
      <g>
        <path d="M70 330 L76 172 Q106 148 136 172 L146 330Z" fill="url(#sherG)" />
        <path d="M106 160 L106 330" stroke="#c9962f" strokeWidth="2" strokeDasharray="2 6" />
        {[196, 220, 244, 268].map((y) => <circle key={y} cx="106" cy={y} r="2.6" fill="#c9962f" />)}
        <path d="M76 176 Q66 232 74 262 L90 262 Q88 220 92 184Z" fill="#f0e0b3" />
        <path d="M84 168 Q108 190 140 172 L146 200 Q112 214 78 196Z" fill="#7a1f31" />
        <path d="M84 168 Q108 190 140 172" stroke="#e9c14f" strokeWidth="2" fill="none" />
        <rect x="97" y="138" width="18" height="26" rx="7" fill="url(#skinG)" />
        <path d="M95 160 Q106 170 117 160 L115 172 Q106 178 97 172Z" fill="#f6e8c4" />
        <ellipse cx="106" cy="116" rx="23" ry="28" fill="url(#skinG)" />
        <ellipse cx="83.5" cy="118" rx="4" ry="6" fill="#c68d63" /><ellipse cx="128.5" cy="118" rx="4" ry="6" fill="#c68d63" />
        <path d="M82 112 Q80 84 106 82 Q132 84 130 112 Q124 96 106 96 Q88 96 82 112Z" fill="#1c1411" />
        <path d="M86 98 Q106 88 126 98" stroke="#2c211b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M90 108 q6 -4 12 0 M110 108 q6 -4 12 0" stroke="#2a1a12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse cx="96" cy="117" rx="3" ry="3.4" fill="#2a1a12" /><ellipse cx="116" cy="117" rx="3" ry="3.4" fill="#2a1a12" />
        <circle cx="97" cy="116" r="1" fill="#fff" /><circle cx="117" cy="116" r="1" fill="#fff" />
        <path d="M98 131 Q106 138 114 131" stroke="#7b3524" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M86 126 Q106 150 126 126 Q122 142 106 146 Q90 142 86 126Z" fill="#241913" opacity=".28" />
        <circle cx="106" cy="94" r="2.4" fill="#c2183b" opacity=".0" />
      </g>

      {/* bride */}
      <g>
        <path d="M150 330 L158 184 Q196 162 232 184 L262 330Z" fill="url(#lehG)" />
        <path d="M152 318 L260 318" stroke="#f0c75a" strokeWidth="6" />
        <path d="M152 318 L260 318" stroke="#fff3c9" strokeWidth="1.6" strokeDasharray="2 5" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${166 + i * 16} 296 q4 -12 8 0 q-4 6 -8 0Z`} fill="#f0c75a" opacity=".85" />)}
        <path d="M160 190 Q196 214 234 190" stroke="#f0c75a" strokeWidth="3" fill="none" />
        <path d="M156 186 Q130 230 128 268 L142 268 Q146 226 168 196Z" fill="#e9a42b" opacity=".0" />
        <path d="M150 186 Q196 210 244 186 L250 214 Q196 236 144 212Z" fill="#c41539" />
        <path d="M150 186 Q196 210 244 186" stroke="#f0c75a" strokeWidth="2.4" fill="none" />
        <path d="M232 190 Q262 230 258 290 L240 290 Q240 238 222 200Z" fill="#e8b84b" opacity=".92" />
        <path d="M160 128 Q138 210 150 290 Q176 266 180 150Z" fill="#120e0d" />
        <path d="M234 128 Q256 214 244 288 Q218 262 214 150Z" fill="#120e0d" />
        <rect x="187" y="150" width="16" height="26" rx="7" fill="url(#skinB)" />
        <path d="M180 170 Q196 192 212 170" stroke="#f0c75a" strokeWidth="3.4" fill="none" /><path d="M184 176 Q196 196 208 176" stroke="#e9a42b" strokeWidth="2" fill="none" />
        <circle cx="196" cy="193" r="3.4" fill="#c41539" stroke="#f0c75a" strokeWidth="1.4" />
        <ellipse cx="196" cy="128" rx="22" ry="27" fill="url(#skinB)" />
        <path d="M172 120 Q170 90 196 88 Q222 90 220 120 Q214 100 196 100 Q178 100 172 120Z" fill="#120e0d" />
        <path d="M168 112 Q196 70 224 112 Q232 150 226 176 L214 150 Q220 118 196 98 Q172 118 178 150 L166 176 Q160 150 168 112Z" fill="#e9a42b" opacity=".0" />
        <path d="M164 118 Q192 66 228 118 L226 136 Q222 112 196 94 Q170 112 166 136Z" fill="#d81f45" opacity=".72" />
        <path d="M164 118 Q192 66 228 118" stroke="#f0c75a" strokeWidth="2" fill="none" />
        <path d="M196 90 L196 100" stroke="#f0c75a" strokeWidth="2" /><circle cx="196" cy="103" r="3" fill="#c41539" stroke="#f0c75a" strokeWidth="1.3" />
        <path d="M181 120 q6 -4 12 0 M199 120 q6 -4 12 0" stroke="#2a1a12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="187" cy="129" r="8.4" fill="#fff" fillOpacity=".25" stroke="#3b2a22" strokeWidth="1.8" /><circle cx="205" cy="129" r="8.4" fill="#fff" fillOpacity=".25" stroke="#3b2a22" strokeWidth="1.8" /><path d="M195.4 128 q1.6 -1.4 3.2 0" stroke="#3b2a22" strokeWidth="1.8" fill="none" />
        <circle cx="187" cy="130" r="3" fill="#2a1a12" /><circle cx="205" cy="130" r="3" fill="#2a1a12" /><circle cx="188" cy="129" r="1" fill="#fff" /><circle cx="206" cy="129" r="1" fill="#fff" />
        <path d="M188 142 Q196 150 204 142" stroke="#b02a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="175" cy="136" r="2.6" fill="#f0c75a" /><circle cx="217" cy="136" r="2.6" fill="#f0c75a" />
        <circle cx="181" cy="141" r="3.6" fill="#f08a8a" opacity=".35" /><circle cx="211" cy="141" r="3.6" fill="#f08a8a" opacity=".35" />
      </g>

      {/* joined hands + garland */}
      <path d="M126 214 Q148 232 170 214" stroke="#d99a3d" strokeWidth="2" fill="none" />
      <ellipse cx="148" cy="226" rx="15" ry="9" fill="#d9a07a" /><ellipse cx="148" cy="226" rx="15" ry="9" fill="none" stroke="#f0c75a" strokeWidth="2" strokeDasharray="1 4" />
      <path d="M104 178 Q150 262 198 182" stroke="#f5a300" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="1 8" />
      <path d="M104 178 Q150 262 198 182" stroke="#ff6f1a" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="1 14" strokeDashoffset="6" />
      {[[52, 300], [250, 296], [72, 318], [236, 316], [150, 322]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4 + (i % 2)} fill={i % 2 ? '#ff7a1a' : '#f5a300'} opacity=".9" />)}
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
    x.font = `${cv.width * 0.055}px Lora, serif`; x.fillText('to reveal our date ✨', cv.width / 2, cv.height / 2 + cv.width * 0.075);
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
      <button className="iv-skip" onClick={() => leave('/')}>Skip <span>· go to website</span></button>
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
          <div className="rv" style={{ '--d': '1.3s' }}><Couple scale={0.86} /></div>
          {!opened
            ? <button className="iv-cta rv" style={{ '--d': '1.7s' }} onClick={open}>✉ Tap to open your invitation</button>
            : <p className="iv-small">scroll ↓</p>}
        </div>
      </section>

      {opened && (<>
        {/* 2. date reveal */}
        <section className="iv-sec iv-rose" data-i={idx++}>
          <div className="iv-in">
            <p className="iv-small dark rv">Save the date</p>
            <h2 className="iv-h rv" style={{ '--d': '.2s' }}>Scratch to reveal the countdown to forever</h2>
            <div className="rv" style={{ '--d': '.4s' }}>
              <Scratch onReveal={() => setRevealed(true)}>
                <div className="iv-date"><b>2 December</b><span>2026 · Wednesday</span></div>
              </Scratch>
            </div>
            <div className={'iv-cd rv ' + (revealed ? 'show' : '')} style={{ '--d': '.6s' }}>
              {[['days', cd[0]], ['hrs', cd[1]], ['min', cd[2]], ['sec', cd[3]]].map(([l, v]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><i>{l}</i></div>)}
            </div>
            <p className="iv-small dark rv" style={{ '--d': '.8s' }}>{revealed ? 'Counting down to forever 🎉' : 'Use your finger to scratch ☝'}</p>
          </div>
        </section>

        {/* 3. message */}
        <section className="iv-sec iv-cream" data-i={idx++}>
          <div className="iv-in">
            <p className="iv-small dark rv">Your invitation</p>
            <h2 className="iv-h rv" style={{ '--d': '.15s' }}>You are warmly invited</h2>
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
            <p className="iv-small rv">Where we celebrate</p>
            <h2 className="iv-h light rv" style={{ '--d': '.15s' }}>{siteConfig.wedding.venueName}</h2>
            <p className="iv-p light rv" style={{ '--d': '.3s' }}>{siteConfig.wedding.city} · by the sea, with every function at one lovely place</p>
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
            <p className="iv-p light rv" style={{ '--d': '.2s' }}>The celebration is incomplete without you. Let us know in one tap.</p>
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
