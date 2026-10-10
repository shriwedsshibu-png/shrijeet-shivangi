import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { displayNames } from '../tier';
import { enabledPages } from '../pages';
import Icon from '../icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pages = enabledPages();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Home">{displayNames()}</Link>
          <nav className="desk-links flex items-center gap-1" aria-label="Main">
            <NavLink to="/" end className={({ isActive }) => `desk-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            {pages.map((p) => (
              <NavLink key={p.key} to={p.path} className={({ isActive }) => `desk-link ${isActive ? 'active' : ''}`}>{p.label}</NavLink>
            ))}
          </nav>
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Icon name="menu" size={20} /> Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="sheet" onClick={() => setOpen(false)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu">
            <div className="flex items-center justify-between mb-3">
              <span className="brand">{displayNames()}</span>
              <button className="menu-btn" onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="close" size={20} /> Close</button>
            </div>
            <NavLink to="/" end className={({ isActive }) => `sheet-link ${isActive ? 'active' : ''}`}><Icon name="home" /> Home</NavLink>
            {pages.map((p) => (
              <NavLink key={p.key} to={p.path} className={({ isActive }) => `sheet-link ${isActive ? 'active' : ''}`}>
                <Icon name={p.icon} /> {p.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
