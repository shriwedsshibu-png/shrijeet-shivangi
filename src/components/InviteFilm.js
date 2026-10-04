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
  Mehndi: { hing: 'Henna, laughter and lots of colour', icon: 'hand' },
  'Engagement & Sangeet': { hing: 'Music, dance and the whole family', icon: 'dhol' },
  Haldi: { hing: 'Yellow hands, golden blessings', icon: 'marigold' },
  'Varmala & Shaadi': { hing: 'Two hearts, seven vows, one forever', icon: 'mandap', note: 'Saat phere, saat vachan, ek zindagi.' },
};

const fmtDate = (iso) =>
  new Date(iso + 'T12:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });

/* ---------- small illustrations (original, drawn in SVG) ---------- */

function Couple({ scale = 1 }) {
  // Original illustration. Groom: short dark hair, light stubble, ivory sherwani. Bride: long black hair, round glasses, red lehenga.
  const marigolds = [];
  for (let i = 0; i < 9; i++) marigolds.push(<circle key={'a' + i} cx={52 + i * 24.5} cy={58 + Math.sin(i * 0.9) * 9 + (i % 2) * 5} r="7" fill={i % 2 ? '#f2c874' : '#f0b684'} />);
  return (
    <svg viewBox="0 0 300 340" width={300 * scale} height={340 * scale} role="img" aria-label="Illustration of the couple under a floral arch">
      <defs>
        <radialGradient id="aura" cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <linearGradient id="sherG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dd" /><stop offset="1" stopColor="#e6cd92" /></linearGradient>
        <linearGradient id="lehG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eaa9ae" /><stop offset="1" stopColor="#c8808c" /></linearGradient>
        <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d49a70" /><stop offset="1" stopColor="#bd8259" /></linearGradient>
        <linearGradient id="skinB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efc3a2" /><stop offset="1" stopColor="#dca883" /></linearGradient>
        <linearGradient id="archG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9962f" /><stop offset=".5" stopColor="#f6dc8c" /><stop offset="1" stopColor="#c9962f" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="170" rx="150" ry="170" fill="url(#aura)" />
      {/* arch */}
      <path d="M30 330 L30 130 Q30 22 150 22 Q270 22 270 130 L270 330" fill="none" stroke="url(#archG)" strokeWidth="7" strokeLinecap="round" />
      <path d="M44 330 L44 134 Q44 38 150 38 Q256 38 256 134 L256 330" fill="none" stroke="#f6dc8c" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" />
      <g>{marigolds}</g>
      {[70, 108, 150, 192, 232].map((x, i) => (<g key={x}><line x1={x} y1={64 + (i % 2) * 6} x2={x} y2={92 + (i % 3) * 8} stroke="#f2c874" strokeWidth="2.4" strokeDasharray="1 5" strokeLinecap="round" /><circle cx={x} cy={96 + (i % 3) * 8} r="5" fill="#f0b684" /></g>))}
      <ellipse cx="150" cy="326" rx="118" ry="10" fill="#000" opacity=".25" />

      {/* groom */}
      <g>
        <path d="M70 330 L76 172 Q106 148 136 172 L146 330Z" fill="url(#sherG)" />
        <path d="M106 160 L106 330" stroke="#c9962f" strokeWidth="2" strokeDasharray="2 6" />
        {[196, 220, 244, 268].map((y) => <circle key={y} cx="106" cy={y} r="2.6" fill="#c9962f" />)}
        <path d="M76 176 Q66 232 74 262 L90 262 Q88 220 92 184Z" fill="#f0e0b3" />
        <path d="M84 168 Q108 190 140 172 L146 200 Q112 214 78 196Z" fill="#27406a" />
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
        <path d="M156 186 Q130 230 128 268 L142 268 Q146 226 168 196Z" fill="#e4bd6a" opacity=".0" />
        <path d="M150 186 Q196 210 244 186 L250 214 Q196 236 144 212Z" fill="#d98d99" />
        <path d="M150 186 Q196 210 244 186" stroke="#f0c75a" strokeWidth="2.4" fill="none" />
        <path d="M232 190 Q262 230 258 290 L240 290 Q240 238 222 200Z" fill="#e8b84b" opacity=".92" />
        <path d="M160 128 Q138 210 150 290 Q176 266 180 150Z" fill="#120e0d" />
        <path d="M234 128 Q256 214 244 288 Q218 262 214 150Z" fill="#120e0d" />
        <rect x="187" y="150" width="16" height="26" rx="7" fill="url(#skinB)" />
        <path d="M180 170 Q196 192 212 170" stroke="#f0c75a" strokeWidth="3.4" fill="none" /><path d="M184 176 Q196 196 208 176" stroke="#e4bd6a" strokeWidth="2" fill="none" />
        <circle cx="196" cy="193" r="3.4" fill="#d98d99" stroke="#f0c75a" strokeWidth="1.4" />
        <ellipse cx="196" cy="128" rx="22" ry="27" fill="url(#skinB)" />
        <path d="M172 120 Q170 90 196 88 Q222 90 220 120 Q214 100 196 100 Q178 100 172 120Z" fill="#120e0d" />
        <path d="M168 112 Q196 70 224 112 Q232 150 226 176 L214 150 Q220 118 196 98 Q172 118 178 150 L166 176 Q160 150 168 112Z" fill="#e4bd6a" opacity=".0" />
        <path d="M164 118 Q192 66 228 118 L226 136 Q222 112 196 94 Q170 112 166 136Z" fill="#eaa9ae" opacity=".72" />
        <path d="M164 118 Q192 66 228 118" stroke="#f0c75a" strokeWidth="2" fill="none" />
        <path d="M196 90 L196 100" stroke="#f0c75a" strokeWidth="2" /><circle cx="196" cy="103" r="3" fill="#d98d99" stroke="#f0c75a" strokeWidth="1.3" />
        <path d="M181 120 q6 -4 12 0 M199 120 q6 -4 12 0" stroke="#2a1a12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="187" cy="129" r="8.4" fill="#fff" fillOpacity=".25" stroke="#3b2a22" strokeWidth="1.8" /><circle cx="205" cy="129" r="8.4" fill="#fff" fillOpacity=".25" stroke="#3b2a22" strokeWidth="1.8" /><path d="M195.4 128 q1.6 -1.4 3.2 0" stroke="#3b2a22" strokeWidth="1.8" fill="none" />
        <circle cx="187" cy="130" r="3" fill="#2a1a12" /><circle cx="205" cy="130" r="3" fill="#2a1a12" /><circle cx="188" cy="129" r="1" fill="#fff" /><circle cx="206" cy="129" r="1" fill="#fff" />
        <path d="M188 142 Q196 150 204 142" stroke="#b45b64" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="175" cy="136" r="2.6" fill="#f0c75a" /><circle cx="217" cy="136" r="2.6" fill="#f0c75a" />
        <circle cx="181" cy="141" r="3.6" fill="#f2a3a3" opacity=".35" /><circle cx="211" cy="141" r="3.6" fill="#f2a3a3" opacity=".35" />
      </g>

      {/* joined hands + garland */}
      <path d="M126 214 Q148 232 170 214" stroke="#d99a3d" strokeWidth="2" fill="none" />
      <ellipse cx="148" cy="226" rx="15" ry="9" fill="#d9a07a" /><ellipse cx="148" cy="226" rx="15" ry="9" fill="none" stroke="#f0c75a" strokeWidth="2" strokeDasharray="1 4" />
      <path d="M104 178 Q150 262 198 182" stroke="#f2c874" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="1 8" />
      <path d="M104 178 Q150 262 198 182" stroke="#eeb07c" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="1 14" strokeDashoffset="6" />
      {[[52, 300], [250, 296], [72, 318], [236, 316], [150, 322]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4 + (i % 2)} fill={i % 2 ? '#f0b684' : '#f2c874'} opacity=".9" />)}
    </svg>
  );
}

function CoupleArt() {
  const [bad, setBad] = useState(false);
  if (bad) return <Couple scale={0.86} />;
  return (<div className="iv-art"><img src="/images/couple-art.jpg" alt="Shrijeet and Shivangi, watercolour illustration" onError={() => setBad(true)} /></div>);
}

/* ---------- soft background art for two functions + the finale ---------- */
function SangeetBG() {
  const wires = [[0, 20, 195, 70, 390, 14], [0, 90, 195, 140, 390, 80]];
  return (
    <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><radialGradient id="bulbg"><stop offset="0" stopColor="#fff6c8" stopOpacity="1" /><stop offset=".35" stopColor="#ffd966" stopOpacity=".75" /><stop offset="1" stopColor="#ffc233" stopOpacity="0" /></radialGradient></defs>
      {[[70, 560, 46], [320, 600, 56], [190, 690, 40], [40, 700, 34], [350, 720, 38], [120, 620, 30], [270, 520, 30]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="url(#bulbg)" opacity=".5" className="iv-tw" style={{ animationDelay: i * 0.5 + 's' }} />)}
      {wires.map(([x0, y0, cx, cy, x1, y1], w) => (
        <g key={w}>
          <path d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`} stroke="#b08a3a" strokeWidth="1.4" fill="none" opacity=".7" />
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (i + 0.5) / 9, x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
            return (<g key={i}><circle cx={x} cy={y + 12} r="22" fill="url(#bulbg)" className="iv-tw" style={{ animationDelay: (i * 0.3 + w * 0.5) + 's' }} /><ellipse cx={x} cy={y + 11} rx="5.2" ry="7.2" fill="#ffe27a" /><rect x={x - 2.6} y={y + 2} width="5.2" height="4" fill="#9a7a30" /></g>);
          })}
        </g>
      ))}
    </svg>
  );
}

function MandapBG() {
  const pillar = (x, y0, h, w) => (<g key={x}><rect x={x - w / 2} y={y0} width={w} height={h} fill="#efe0b8" /><rect x={x - w / 2 - 4} y={y0 + h - 8} width={w + 8} height="10" rx="2" fill="#cfa958" /><rect x={x - w / 2 - 3} y={y0} width={w + 6} height="8" rx="2" fill="#cfa958" />{Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={x + Math.sin(i) * 2} cy={y0 + 14 + i * (h / 7.5)} r={w * 0.42} fill={['#f4b7b0', '#fbe3a8', '#ffffff', '#f7cfa0'][i % 4]} />)}</g>);
  const walker = (x, y, flip) => (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g><path d="M-26 0 L-22 -36 Q-14 -44 -6 -36 L-2 0Z" fill="#f2e4bd" /><path d="M-22 -36 Q-14 -26 -6 -36" fill="#27406a" /><circle cx="-14" cy="-50" r="7.5" fill="#c68d63" /><path d="M-21 -52 Q-14 -62 -7 -52 Q-14 -55 -21 -52Z" fill="#1c1411" /></g>
      <g><path d="M4 0 L8 -34 Q16 -42 24 -34 L32 0Z" fill="#e7a0a8" /><path d="M4 0 L32 0" stroke="#f0c75a" strokeWidth="3" /><circle cx="16" cy="-48" r="7.5" fill="#e2ae8d" /><path d="M8 -50 Q16 -62 24 -50 Q16 -54 8 -50Z" fill="#14100e" /><path d="M10 -50 Q-2 -30 6 -4" stroke="#14100e" strokeWidth="3.4" fill="none" strokeLinecap="round" /></g>
      <path d="M-8 -30 Q8 -22 20 -30" stroke="#f0c75a" strokeWidth="3" fill="none" /><path d="M-8 -30 Q8 -18 20 -30" stroke="#e8792b" strokeWidth="2" fill="none" strokeDasharray="1 4" />
    </g>);
  const petals = []; for (let i = 0; i < 16; i++) petals.push(<ellipse key={'p' + i} cx={(i * 71) % 390} cy={(i * 123) % 760} rx="5" ry="3" fill={['#f4b7b0', '#fbe3a8', '#ffffff'][i % 3]} opacity=".7" className="iv-fall" style={{ animationDelay: (i % 9) * 0.7 + 's' }} />);
  return (
    <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><radialGradient id="fireG"><stop offset="0" stopColor="#ffd16a" stopOpacity=".95" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient></defs>
      <g className="iv-blur" style={{ opacity: 0.7 }}>
        {/* canopy */}
        <path d="M30 150 L360 150 L330 100 L60 100Z" fill="#e7cf98" />
        <path d="M30 150 L360 150" stroke="#c9a24a" strokeWidth="3" />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${34 + i * 23.5} 150 q11 20 23 0`} fill="#f6e8c4" stroke="#c9a24a" strokeWidth="1" />)}
        {[60, 330].map((x) => pillar(x, 170, 560, 20))}
        {[112, 278].map((x) => pillar(x, 190, 470, 12))}
        {/* sacred fire and pheras path */}
        <ellipse cx="195" cy="650" rx="140" ry="44" fill="none" stroke="#c9a24a" strokeWidth="2" strokeDasharray="3 8" />
        <circle cx="195" cy="640" r="64" fill="url(#fireG)" />
        <rect x="165" y="650" width="60" height="22" rx="3" fill="#c98a3a" />
        <path d="M195 566 q22 28 8 52 q-8 12 -22 2 q-14 -22 14 -54Z" fill="#ffb347" /><path d="M195 590 q10 14 4 26 q-8 6 -14 -2 q-2 -14 10 -24Z" fill="#ffe27a" />
        {walker(300, 706, false)}
      </g>
      <path d="M0 800 Q195 730 390 800Z" fill="#f4d7cf" opacity=".5" />
      {petals}
    </svg>
  );
}

function SkyLantern() {
  return (
    <svg viewBox="0 0 40 56" width="100%" height="100%" aria-hidden>
      <defs><radialGradient id="lg"><stop offset="0" stopColor="#fff2b8" stopOpacity=".9" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient></defs>
      <circle cx="20" cy="26" r="26" fill="url(#lg)" opacity=".8" />
      <path d="M8 14 Q20 8 32 14 L36 44 Q20 52 4 44Z" fill="#ffc15a" /><path d="M8 14 Q20 8 32 14 L33 22 Q20 18 7 22Z" fill="#ffd98a" />
      <path d="M12 16 L10 46 M20 12 L20 49 M28 16 L30 46" stroke="#d9923a" strokeWidth=".9" opacity=".7" /><ellipse cx="20" cy="46" rx="6" ry="3" fill="#fff0a8" />
    </svg>
  );
}

function FinaleBG() {
  const lan = [[10, 17, 0, 34], [28, 21, -8, 26], [46, 15, -3, 40], [66, 19, -12, 30], [84, 14, -6, 36], [38, 23, -15, 24]];
  return (
    <>
      <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs><radialGradient id="bulbg2"><stop offset="0" stopColor="#ffe9a0" stopOpacity=".9" /><stop offset="1" stopColor="#ffd060" stopOpacity="0" /></radialGradient></defs>
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} className="iv-tw" cx={(i * 89) % 390} cy={(i * 61) % 780} r={(i % 3) * 0.5 + 0.6} fill="#fff" style={{ animationDelay: (i % 7) * 0.4 + 's' }} />)}
        <Diyas y={780} />
      </svg>
      {lan.map(([left, dur, delay, size], i) => (
        <div key={i} className="iv-lan" style={{ left: left + '%', animationDuration: dur + 's', animationDelay: delay + 's', width: size, height: size * 1.4 }}><SkyLantern /></div>
      ))}
    </>
  );
}

/* ---------- soft blurred backgrounds for Faldaan, Mehndi, Haldi and the message page ---------- */
function Marigold({ x, y, r = 22, a = '#f2a93b', b = '#f8c95c' }) {
  return (<g>{Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={x} cy={y - r * 0.55} rx={r * 0.3} ry={r * 0.55} fill={i % 2 ? a : b} transform={`rotate(${i * 30} ${x} ${y})`} />)}<circle cx={x} cy={y} r={r * 0.28} fill="#d98a1f" /></g>);
}
function Rose({ x, y, r = 22 }) {
  return (<g><circle cx={x} cy={y} r={r} fill="#f1b6b0" /><circle cx={x} cy={y} r={r * 0.72} fill="#f6cbc6" /><circle cx={x} cy={y} r={r * 0.46} fill="#eea6a3" /><path d={`M${x - r * 0.3} ${y} q${r * 0.3} -${r * 0.4} ${r * 0.6} 0`} stroke="#e48f8f" strokeWidth="2" fill="none" /></g>);
}
function Leaf({ x, y, r, s = 1, c = '#7fa079' }) {
  return <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0 Q14 -22 0 -52 Q-14 -22 0 0Z" fill={c} />;
}

function FaldaanBG() {
  return (
    <svg className="iv-sky iv-blur" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[[30, 60, 34], [92, 40, 26], [360, 90, 36], [320, 40, 24], [24, 150, 24], [370, 170, 26]].map(([x, y, r], i) => <Rose key={i} x={x} y={y} r={r} />)}
      {[[20, 110, 20], [60, 100, 80], [372, 130, 120], [330, 100, 150]].map(([x, y, r], i) => <Leaf key={i} x={x} y={y} r={r} s={0.9} />)}
      <ellipse cx="195" cy="722" rx="150" ry="40" fill="#d9ae5a" /><ellipse cx="195" cy="714" rx="132" ry="31" fill="#f3d58f" />
      <circle cx="150" cy="700" r="24" fill="#8a5a33" /><circle cx="150" cy="696" r="9" fill="#a7774b" opacity=".6" />
      {[[222, 710], [256, 700], [186, 722]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx="12" ry="7" fill="#c98a3a" /><path d={`M${x} ${y - 6} q5 -10 0 -18 q-5 8 0 18Z`} fill="#ffcf5a" /></g>)}
      {[[110, 722], [290, 722], [205, 696], [175, 728]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill={i % 2 ? '#f1b6b0' : '#fbe3a8'} />)}
      {[[40, 700, 26], [350, 710, 30], [28, 770, 22], [372, 775, 24]].map(([x, y, r], i) => <Rose key={i} x={x} y={y} r={r} />)}
    </svg>
  );
}

function MehndiBG() {
  const dots = (x, y, n) => Array.from({ length: n }).map((_, i) => <circle key={x + '-' + i} cx={x + i * 12} cy={y + Math.sin(i) * 4} r="2" fill="#8a4b2a" opacity=".6" />);
  return (
    <svg className="iv-sky iv-blur" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[[20, 120, 25], [34, 150, 40], [370, 110, -25], [358, 150, -42], [26, 690, 160], [364, 700, 200], [60, 760, 140], [330, 770, 215]].map(([x, y, r], i) => <Leaf key={i} x={x} y={y} r={r} s={1.15} c={i % 2 ? '#8fb08a' : '#6f9a6a'} />)}
      {[[40, 70, 20], [350, 60, -30], [30, 640, 200], [356, 650, 160]].map(([x, y, r], i) => <Paisley key={i} x={x} y={y} s={1.5} r={r} o={0.75} c="#8a4b2a" />)}
      <g stroke="#8a4b2a" strokeWidth="1.8" fill="none" opacity=".6">
        <path d="M30 720 Q195 660 360 720" /><path d="M30 736 Q195 676 360 736" strokeDasharray="1 7" strokeLinecap="round" />
        <path d="M30 40 Q195 100 360 40" /><path d="M30 56 Q195 116 360 56" strokeDasharray="1 7" strokeLinecap="round" />
      </g>
      {dots(70, 700, 22)}
    </svg>
  );
}

function HaldiBG() {
  return (
    <svg className="iv-sky iv-blur" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[[40, 60, 36], [110, 30, 26], [340, 80, 40], [290, 30, 28], [20, 170, 28], [372, 190, 30], [60, 720, 40], [330, 730, 42], [160, 780, 30], [250, 772, 28], [18, 640, 26], [376, 620, 28]].map(([x, y, r], i) => <Marigold key={i} x={x} y={y} r={r} a={i % 2 ? '#f0a136' : '#f6b94c'} b={i % 3 ? '#f8d26e' : '#f4b542'} />)}
      <ellipse cx="195" cy="735" rx="86" ry="24" fill="#e8b92f" /><ellipse cx="195" cy="726" rx="78" ry="17" fill="#f5d04a" />
      {Array.from({ length: 22 }).map((_, i) => <ellipse key={i} cx={(i * 71) % 390} cy={(i * 137) % 760} rx="6" ry="3.4" fill="#f4b542" opacity=".75" className="iv-fall" style={{ animationDelay: (i % 9) * 0.6 + 's' }} />)}
    </svg>
  );
}

function MsgBG() {
  return (
    <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><radialGradient id="msgG" cx=".5" cy=".5" r=".6"><stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#f1e4cc" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx="195" cy="400" rx="250" ry="400" fill="url(#msgG)" />
      <path d="M34 800 L34 190 Q34 44 195 44 Q356 44 356 190 L356 800" fill="none" stroke="#c9a24a" strokeWidth="1.8" opacity=".5" />
      <path d="M46 800 L46 194 Q46 58 195 58 Q344 58 344 194 L344 800" fill="none" stroke="#c9a24a" strokeWidth=".9" strokeDasharray="1 5" opacity=".6" />
      <g className="iv-blur" style={{ opacity: 0.75 }}>
        {[[28, 740, 30], [70, 770, 24], [362, 745, 32], [320, 775, 26], [20, 660, 22], [372, 655, 24]].map(([x, y, r], i) => i % 2 ? <Rose key={i} x={x} y={y} r={r} /> : <Marigold key={i} x={x} y={y} r={r} />)}
        {[[40, 700, 330], [350, 705, 30], [66, 735, 20], [326, 740, -20]].map(([x, y, r], i) => <Leaf key={i} x={x} y={y} r={r} c="#8fb08a" />)}
      </g>
      <g opacity=".7"><Toran y={22} sag={12} n={12} /></g>
    </svg>
  );
}

/* ---------- cover: full-bleed dusk scene (Bihari torans + naval horizon) ---------- */
function Toran({ y = 0, color = '#f2b45a', alt = '#f6d58a', n = 11, sag = 22 }) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = 14 + t * 362, yy = y + 4 * Math.sin(Math.PI * t) * sag / 4 + Math.sin(Math.PI * t) * sag;
    items.push(<g key={i}><circle cx={x} cy={yy} r="7.5" fill={i % 2 ? alt : color} /><circle cx={x} cy={yy} r="3" fill="#d98a2b" opacity=".6" /><line x1={x} y1={yy + 7} x2={x} y2={yy + 16 + (i % 3) * 4} stroke="#d9a73a" strokeWidth="1.6" /><circle cx={x} cy={yy + 19 + (i % 3) * 4} r="2.6" fill="#d9a73a" /></g>);
  }
  return <g>{items}</g>;
}

function Diyas({ y = 760 }) {
  return (
    <g>
      {[44, 100, 156, 234, 290, 346].map((x, i) => (
        <g key={x} className="iv-tw" style={{ animationDelay: i * 0.35 + 's' }}>
          <ellipse cx={x} cy={y - 10} rx="9" ry="14" fill="url(#bulbg2)" />
          <path d={`M${x} ${y - 20} q5 8 0 14 q-5 -6 0 -14Z`} fill="#ffcf5a" />
          <path d={`M${x - 11} ${y} q11 12 22 0 z`} fill="#c98a3a" />
        </g>
      ))}
    </g>
  );
}

function Paisley({ x, y, s = 1, r = 0, o = 0.5, c = '#c9a24a' }) {
  return <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0 C10 -16 30 -12 28 6 C26 22 8 28 -2 14 C-8 6 -6 -2 0 0Z M6 4 C12 -4 20 -2 19 6 C18 13 10 14 7 9" fill="none" stroke={c} strokeWidth="1.6" opacity={o} />;
}

function CoverBG() {
  return (
    <svg className="iv-sky" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="bulbg2"><stop offset="0" stopColor="#ffe9a0" stopOpacity=".9" /><stop offset="1" stopColor="#ffd060" stopOpacity="0" /></radialGradient>
        <radialGradient id="royalG" cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#fff8e6" /><stop offset="1" stopColor="#f3e2c8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="390" height="800" fill="#f8efdf" />
      <ellipse cx="195" cy="430" rx="260" ry="420" fill="url(#royalG)" />
      {/* large mughal arch frame */}
      <path d="M34 800 L34 190 Q34 44 195 44 Q356 44 356 190 L356 800" fill="none" stroke="#c9a24a" strokeWidth="2" opacity=".55" />
      <path d="M46 800 L46 194 Q46 58 195 58 Q344 58 344 194 L344 800" fill="none" stroke="#c9a24a" strokeWidth=".9" strokeDasharray="1 5" opacity=".7" />
      {/* paisley border rows */}
      {Array.from({ length: 7 }).map((_, i) => <Paisley key={'b' + i} x={34 + i * 52} y={742} s={0.8} r={-20} o={0.5} />)}
      {[[28, 130, 20], [362, 130, -20], [24, 260, 200], [366, 260, 160]].map(([x, y, r], i) => <Paisley key={'c' + i} x={x} y={y} s={0.9} r={r} o={0.55} />)}
      <Toran y={20} sag={12} n={12} />
      <Diyas y={788} />
      <rect x="10" y="10" width="370" height="780" rx="14" fill="none" stroke="#c9a24a" strokeWidth="1.6" />
      <rect x="17" y="17" width="356" height="766" rx="10" fill="none" stroke="#e7cf98" strokeWidth=".9" />
      {[[10, 10, 1, 1], [380, 10, -1, 1], [10, 790, 1, -1], [380, 790, -1, -1]].map(([x, y, sx, sy], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}><path d="M0 40 Q0 0 40 0" fill="none" stroke="#c9a24a" strokeWidth="2.6" /><path d="M0 26 Q0 0 26 0" fill="none" stroke="#c9a24a" strokeWidth="1.2" /><circle cx="10" cy="10" r="3.4" fill="#c9a24a" /></g>
      ))}
    </svg>
  );
}

/* Royal divider: lotus with gold vine scrolls */
function Ornament({ color = '#b8893b', width = 230 }) {
  const Side = ({ flip }) => (
    <g transform={flip ? 'translate(220 0) scale(-1 1)' : ''} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <path d="M92 22 Q70 22 56 22 Q40 22 34 14 Q30 8 36 6 Q42 5 42 11" />
      <path d="M92 22 Q72 30 58 30 Q42 30 36 36 Q32 41 38 42" />
      <circle cx="12" cy="22" r="2.2" fill={color} /><path d="M18 22 L28 22" />
    </g>
  );
  return (
    <svg viewBox="0 0 220 44" width={width} height={width * 0.2} aria-hidden>
      <Side /><Side flip />
      <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M110 6 Q101 18 110 34 Q119 18 110 6Z" fill={color} fillOpacity=".18" />
        <path d="M110 34 Q92 32 90 18 Q102 20 110 34Z" /><path d="M110 34 Q128 32 130 18 Q118 20 110 34Z" />
        <path d="M110 34 Q84 36 80 26 Q98 26 110 34Z" /><path d="M110 34 Q136 36 140 26 Q122 26 110 34Z" />
      </g>
    </svg>
  );
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
  const [hasMusic, setHasMusic] = useState(true);
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
    a.preload = 'auto'; a.addEventListener('error', () => setHasMusic(false));
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
    if (audio.current) audio.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
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
      {hasMusic && <button className="iv-snd" onClick={toggleMusic} aria-label={musicOn ? 'Mute music' : 'Play music'}>{musicOn ? '🔊 Music on' : '🔈 Play music'}</button>}
      {opened && <div className="iv-dots" aria-hidden>{Array.from({ length: total }).map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}</div>}

      {/* 1. cover */}
      <section className="iv-sec iv-night in" data-i={idx++}>
        <CoverBG />
        <div className="iv-in">
          <p className="iv-small rv" style={{ '--d': '.2s' }}>॥ श्री गणेशाय नमः ॥</p>
          <p className="iv-small rv" style={{ '--d': '.5s', marginTop: '.8rem' }}>We are getting married</p>
          <h1 className="iv-names rv" style={{ '--d': '.9s' }}>{names.name1}<span>&amp;</span>{names.name2}</h1>
          <div className="rv" style={{ '--d': '1.3s' }}><CoupleArt /></div>
          <div className="rv" style={{ '--d': '1.5s' }}><Ornament width={210} /></div>
          {!opened
            ? <button className="iv-cta rv" style={{ '--d': '1.7s' }} onClick={open}>Open Your Invitation</button>
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

        {/* 3. message: one heading-cum-message */}
        <section className="iv-sec iv-cream" data-i={idx++}>
          <MsgBG />
          <div className="iv-in">
            <p className="iv-small rv">By the grace of God</p>
            <div className="rv" style={{ '--d': '.1s' }}><Ornament /></div>
            <p className="iv-p rv" style={{ '--d': '.25s', fontSize: '1.2rem' }}>{siteConfig.homepage.invitationTop}</p>
            <p className="iv-names2 rv" style={{ '--d': '.45s' }}>{names.name1} <em>&amp;</em> {names.name2}</p>
            <p className="iv-p rv" style={{ '--d': '.6s' }}>{siteConfig.homepage.invitationBottom}</p>
            <p className="iv-deva rv" style={{ '--d': '.8s' }}>{siteConfig.homepage.welcomeHindi}</p>
          </div>
        </section>

        {/* 4+. events */}
        {events.map((ev, k) => {
          const l = LINES[ev.name] || { hing: ev.description, icon: 'mandap' };
          return (
            <section key={ev.id} className={'iv-sec ' + ['iv-teal', 'iv-green', 'iv-dusk', 'iv-sun', 'iv-royal'][k % 5]} data-i={idx++}>
              {/faldaan/i.test(ev.name) && <FaldaanBG />}
              {/mehndi/i.test(ev.name) && <MehndiBG />}
              {/haldi/i.test(ev.name) && <HaldiBG />}
              {/sangeet/i.test(ev.name) && <SangeetBG />}
              {/shaadi|varmala/i.test(ev.name) && <MandapBG />}
              <div className="iv-in">
                <p className="iv-small rv">Function {k + 1} of {events.length}</p>
                <div className="iv-card rv" style={{ '--d': '.15s' }}>
                  <div className="iv-orn" aria-hidden>❖</div>
                  <h2>{ev.name}</h2>
                  <p className="iv-hing">{l.hing}</p>
                  <div className="iv-when"><b>{fmtDate(ev.date)}</b><span>{ev.time}</span></div>
                  <div className="iv-dress">Dress code · {ev.dressCode}</div>
                </div>
                <p className="iv-p light rv" style={{ '--d': '.4s' }}>{l.note || ev.description}</p>
              </div>
            </section>
          );
        })}

        {/* venue */}
        <section className="iv-sec iv-sea" data-i={idx++}>
          <svg className="iv-waves" viewBox="0 0 390 120" preserveAspectRatio="none" aria-hidden><path className="w1" d="M0 60 Q50 30 100 60 T200 60 T300 60 T400 60 V120 H0Z" fill="#ffffff22" /><path className="w2" d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80 V120 H0Z" fill="#ffffff2e" /></svg>
          <div className="iv-in">
            <p className="iv-small rv">The Venue</p>
            <h2 className="iv-h light rv" style={{ '--d': '.15s' }}>{siteConfig.wedding.venueName}</h2>
            <p className="iv-p light rv" style={{ '--d': '.3s' }}>{siteConfig.wedding.city}</p>
            <a className="iv-cta rv" style={{ '--d': '.5s' }} href={siteConfig.wedding.mapLink} target="_blank" rel="noopener noreferrer">📍 Open in Google Maps</a>
          </div>
        </section>

        {/* finale */}
        <section className="iv-sec iv-night fin" data-i={idx++}>
          <FinaleBG />
          <div className="iv-in">
            <h2 className="iv-names rv" style={{ '--d': '.1s', fontSize: 'clamp(2.6rem,12vw,3.6rem)' }}>Aap aayenge na?</h2>
            <p className="iv-p rv" style={{ '--d': '.3s' }}>Your presence will make our celebration complete. Kindly let us know you are coming.</p>
            <div className="iv-btns rv" style={{ '--d': '.5s' }}>
              {rsvpOn && <button className="iv-cta gold" onClick={() => leave('/rsvp')}>Confirm Your Presence</button>}
              <button className="iv-cta ghost" onClick={() => leave('/')}>Explore the Wedding Website</button>
              <button className="iv-link" onClick={replay}>↺ Replay invitation</button>
            </div>
          </div>
        </section>
        {active < total - 1 && <button className="iv-next" onClick={next} aria-label="Next">⌄</button>}
      </>)}
    </div>
  );
}
