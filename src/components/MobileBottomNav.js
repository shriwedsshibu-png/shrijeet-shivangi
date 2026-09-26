import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../siteConfig';

const links = [
  { key: 'home', path: '/', label: 'Home', icon: '⌂' },
  { key: 'rsvp', path: '/rsvp', label: 'RSVP', icon: '✓' },
  { key: 'events', path: '/events', label: 'Events', icon: '◷' },
  { key: 'uploadPhotos', path: '/upload-photos', label: 'Photos', icon: '📸' },
  { key: 'photoGallery', path: '/gallery', label: 'Gallery', icon: '▦' },
];

function MobileBottomNav() {
  const location = useLocation();
  return (
    <nav className="mobile-bottom-nav lg:hidden" aria-label="Quick navigation">
      {links.filter((link) => link.key === 'home' || siteConfig.features[link.key]?.enabled).map((link) => {
        const active = location.pathname === link.path;
        return (
          <Link key={link.key} to={link.path} className={`mobile-bottom-link ${active ? 'active' : ''}`}>
            <span className="mobile-bottom-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
