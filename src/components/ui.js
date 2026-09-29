import React from 'react';
import { Link } from 'react-router-dom';

export function Card({ children, className = '', ...rest }) {
  return <div className={`card ${className}`} {...rest}>{children}</div>;
}

export function Divider({ symbol = '✦' }) {
  return <div className="divider" aria-hidden="true"><span>{symbol === '✦' ? (
    <svg className="orn" viewBox="0 0 52 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M26 4c4 5 4 11 0 16-4-5-4-11 0-16z" fill="currentColor" fillOpacity=".25" />
      <path d="M26 20c-6-1-11-5-13-11 6 0 11 3 13 8zM26 20c6-1 11-5 13-11-6 0-11 3-13 8z" />
      <path d="M26 20v8M20 28h12" /><circle cx="26" cy="2.5" r="1.3" fill="currentColor" />
    </svg>) : symbol}</span></div>;
}

export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="text-center mb-9 fade-in">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="h-title mt-2">{title}</h1>
      <Divider />
      {subtitle && <p className="h-sub">{subtitle}</p>}
    </header>
  );
}

// A button that is really a link (internal page, or external address)
export function ButtonLink({ to, href, variant = 'primary', block, children, className = '', ...rest }) {
  const cls = `btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
}

export function Button({ variant = 'primary', block, className = '', children, ...rest }) {
  return <button className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`} {...rest}>{children}</button>;
}

export function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="label">{label}{required ? <span className="text-maroon"> *</span> : null}</label>
      {hint && <p className="hint">{hint}</p>}
      {children}
    </div>
  );
}

export function Notice({ kind = 'info', children }) {
  return <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>;
}
