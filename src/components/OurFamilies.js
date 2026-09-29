import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader } from './ui';

function Column({ title, members }) {
  return (
    <div>
      <h2 className="script text-center mb-5" style={{ fontSize: '2.8rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{title}</h2>
      <div className="grid gap-3">
        {members.map((m, i) => (
          <Card key={`${m.name}-${i}`} style={{ padding: '1rem 1.1rem', textAlign: 'center' }}>
            <p className="eyebrow" style={{ letterSpacing: '.18em' }}>{m.relation || m.relationship}</p>
            <p className="font-display font-bold" style={{ fontSize: '1.45rem', color: 'var(--ink)', lineHeight: 1.2 }}>{m.name}</p>
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
        <div className={both ? 'grid gap-10 lg:grid-cols-2 max-w-5xl mx-auto' : ''}>
          {groom.length > 0 && <Column title={`${siteConfig.couple.name1}'s Family`} members={groom} />}
          {bride.length > 0 && <Column title={`${siteConfig.couple.name2}'s Family`} members={bride} />}
        </div>
      </div>
    </main>
  );
}
