import React from 'react';
import { Link } from 'react-router-dom';

export function Card({ children, className = '', ...rest }) {
  return <div className={`card ${className}`} {...rest}>{children}</div>;
}

export function Divider({ symbol = '✦' }) {
  return <div className="divider" aria-hidden="true"><span>{symbol}</span></div>;
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
