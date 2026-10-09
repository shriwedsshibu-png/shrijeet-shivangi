import React from 'react';
import siteConfig from '../siteConfig';
import { dateLine } from '../tier';

const gold = '#e7cf98';

export default function Footer() {
  const f = siteConfig.footer;
  return (
    <footer className="bg-maroon-dark text-center px-4 pt-10 pb-12" style={{ color: '#d9e3f0' }}>
      <p className="deva" style={{ color: gold }}>॥ शुभ विवाह ॥</p>

      <div className="mt-3 flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-6 max-w-3xl mx-auto">
        <span className="hidden md:block font-bold" style={{ color: gold, fontSize: '1.15rem', flex: 1, textAlign: 'left' }}>{f.hashtagLeft}</span>
        <p className="script" style={{ fontSize: 'clamp(2rem, 10vw, 2.7rem)', color: '#f1d68e', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          {f.bondLeft}
          <span style={{ fontFamily: 'Georgia, "DejaVu Serif", serif', fontSize: '.85em', margin: '0 .35em', color: gold }} aria-label="and forever">∞</span>
          {f.bondRight}
        </p>
        <span className="hidden md:block font-bold" style={{ color: gold, fontSize: '1.15rem', flex: 1, textAlign: 'right' }}>{f.hashtagRight}</span>
        {/* on phones the two hashtags sit on one line, one on each side */}
        <div className="flex md:hidden w-full justify-between px-2 font-bold" style={{ color: gold }}>
          <span>{f.hashtagLeft}</span>
          <span>{f.hashtagRight}</span>
        </div>
      </div>

      <p className="font-display italic mt-4" style={{ fontSize: '1.2rem' }}>“{f.tagline}”</p>
      <p className="text-sm mt-3" style={{ opacity: .75 }}>{dateLine()} · {siteConfig.wedding.city}</p>
    </footer>
  );
}
