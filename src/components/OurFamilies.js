import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader } from './ui';

function Column({ title, members }) {
  return (
    <div>
      <h2 className="script text-center mb-5" style={{ fontSize: 'clamp(1.9rem,7vw,2.8rem)', color: 'var(--maroon)', lineHeight: 1.1 }}>{title}</h2>
      <div className="grid gap-3">
        {members.map((m, i) => (
          <Card key={`${m.name}-${i}`} style={{ padding: '.9rem .5rem', textAlign: 'center' }}>
            <p className="eyebrow" style={{ letterSpacing: '.18em' }}>{m.relation || m.relationship}</p>
            <p className="font-display font-bold" style={{ fontSize: 'clamp(1.05rem,4.6vw,1.45rem)', color: 'var(--ink)', lineHeight: 1.2 }}>{m.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OurFamilies() {
  const f = siteConfig.families;
  const groom = f.shrijeet || [];
  const bride = f.shivangi || [];
  const both = groom.length > 0 && bride.length > 0;
  return (
    <main className="page">
      <div className={both ? 'wrap' : 'wrap-narrow'}>
        <PageHeader eyebrow="With love & blessings" title={f.title} subtitle={f.subtitle} />
        <div className={both ? 'grid gap-10 sm:grid-cols-2 sm:gap-8 max-w-5xl mx-auto' : ''}>
          {groom.length > 0 && <Column title="Shrijeet's Family" members={groom} />}
          {bride.length > 0 && <Column title="Shivangi's Family" members={bride} />}
        </div>
      </div>
    </main>
  );
}
