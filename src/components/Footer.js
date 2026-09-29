import React from 'react';
import siteConfig from '../siteConfig';

export default function Footer() {
  return (
    <footer className="bg-maroon-dark text-center px-4 py-10" style={{ color: '#f1e2c4' }}>
      <p className="deva" style={{ color: '#e7cf98' }}>॥ शुभ विवाह ॥</p>
      <p className="script mt-1" style={{ fontSize: '2.5rem', color: '#ffe2a3', lineHeight: 1.1 }}>{siteConfig.couple.displayName}</p>
      <p className="font-display italic mt-2" style={{ fontSize: '1.2rem' }}>“{siteConfig.footer.tagline}”</p>
      <p className="text-sm mt-3" style={{ opacity: .75 }}>{siteConfig.wedding.dateLine} · {siteConfig.wedding.city}</p>
    </footer>
  );
}
