import React from 'react';
import { NavLink } from 'react-router-dom';
import { enabledPages } from '../pages';
import Icon from '../icons';

export default function MobileBottomNav() {
  const items = [{ key: 'home', path: '/', icon: 'home', short: 'Home' }, ...enabledPages().filter((p) => p.bottom)];
  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      {items.map((item) => (
        <NavLink key={item.key} to={item.path} end={item.path === '/'} className={({ isActive }) => `bottom-link ${isActive ? 'active' : ''}`}>
          <span className="bottom-icon"><Icon name={item.icon} size={28} strokeWidth={1.9} /></span>
          <span>{item.short}</span>
        </NavLink>
      ))}
    </nav>
  );
}
