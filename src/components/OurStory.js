import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader, Divider } from './ui';

function Paragraphs({ text }) {
  return (
    <div className="grid gap-4" style={{ fontSize: '1.08rem', lineHeight: 1.75 }}>
      {String(text).split(/\n\s*\n/).map((p, i) => (
        <p key={i} style={{ whiteSpace: 'pre-line' }}>{p.trim()}</p>
      ))}
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <Card className="fade-in">
      <div className="flex flex-col items-center text-center mb-5">
        {story.image && (
          <img src={story.image} alt={story.name} loading="lazy" style={{ width: '9rem', height: '9rem', borderRadius: '999px', objectFit: 'cover', border: '3px solid var(--gold-soft)', boxShadow: '0 0 0 5px rgba(184,137,59,.2)' }} />
        )}
        <h2 className="script mt-4" style={{ fontSize: '2.7rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{story.name}</h2>
      </div>
      <Paragraphs text={story.story} />
    </Card>
  );
}

export default function OurStory() {
  const s = siteConfig.ourStory;
  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="How it began" title={s.title} subtitle={s.subtitle} />
        <div className="grid gap-8">
          <StoryCard story={s.partner1Story} />
          <StoryCard story={s.partner2Story} />
          {s.howWeMet?.enabled && (
            <div className="text-center px-2">
              <Divider />
              <h2 className="font-display font-bold mt-3" style={{ fontSize: '2rem', color: 'var(--maroon)' }}>{s.howWeMet.title}</h2>
              <p className="font-display italic mt-2" style={{ fontSize: '1.35rem' }}>{s.howWeMet.story}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
