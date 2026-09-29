import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader } from './ui';
import Icon from '../icons';

export default function FAQ() {
  const { title, subtitle, questions } = siteConfig.faq;
  const [open, setOpen] = useState(0);
  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="Questions & answers" title={title} subtitle={subtitle} />
        <div className="grid gap-3">
          {questions.map((q, i) => {
            const isOpen = open === i;
            return (
              <Card key={q.title} style={{ padding: 0 }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-center justify-between gap-3"
                  style={{ padding: '1.1rem 1.2rem', background: 'transparent', border: 0, cursor: 'pointer', position: 'relative', zIndex: 1 }}
                >
                  <span className="font-display font-bold" style={{ fontSize: '1.4rem', color: 'var(--maroon)' }}>{q.title}</span>
                  <Icon name={isOpen ? 'close' : 'chevronRight'} size={22} className="flex-none" />
                </button>
                {isOpen && <p className="text-muted" style={{ padding: '0 1.2rem 1.2rem', position: 'relative', zIndex: 1, fontSize: '1.05rem' }}>{q.content}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
