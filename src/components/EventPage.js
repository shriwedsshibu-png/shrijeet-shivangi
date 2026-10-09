import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader } from './ui';
import Icon from '../icons';
import { sortedEvents, dayAndMonth, calendarLink } from '../utils';
import { tierCfg } from '../tier';

function eventImage(name) {
  const n = String(name).toLowerCase();
  if (n.includes('faldaan')) return '/images/cards/faldaan.jpg';
  if (n.includes('mehndi')) return '/images/cards/mehndi.jpg';
  if (n.includes('sangeet') || n.includes('engagement')) return '/images/cards/sangeet.jpg';
  if (n.includes('haldi')) return '/images/cards/haldi.jpg';
  if (n.includes('shaadi') || n.includes('varmala')) return '/images/cards/shaadi.jpg';
  return null;
}

export default function EventPage() {
  const events = sortedEvents();
  const { events: cfg, wedding } = siteConfig;

  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="The celebrations" title={cfg.title} subtitle={tierCfg().eventsSubtitle || cfg.subtitle} />

        <div className="timeline grid gap-5">
          {events.map((e) => {
            const d = dayAndMonth(e.date);
            const img = eventImage(e.name);
            return (
              <div key={e.id} className="flex gap-4 items-start fade-in">
                <div className="date-badge" style={{ marginTop: '.6rem' }}>
                  <b>{d.day}</b>
                  <span>{d.month}</span>
                </div>
                <Card className="flex-1 min-w-0" style={{ padding: 0, overflow: 'hidden' }}>
                  {img && (
                    <div style={{ margin: '-1px -1px 0', borderRadius: '1.1rem 1.1rem 0 0', overflow: 'hidden' }}>
                      <img src={img} alt="" style={{ width: '100%', aspectRatio: '1.45', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ padding: '1.2rem 1.2rem 1.3rem' }}>
                    <h2 className="font-display font-bold" style={{ fontSize: '2rem', color: 'var(--maroon)' }}>{e.name}</h2>
                    <p className="font-semibold mt-1">{d.weekday}, {e.time}</p>
                    {e.dateNote && <p className="text-muted" style={{ fontSize: '.95rem' }}>({e.dateNote})</p>}
                    <p className="text-muted mt-2">{e.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {e.dressCode && <span className="tag">👗 {e.dressCode}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <a className="btn btn-ghost" style={{ minHeight: '2.7rem', padding: '.4rem 1.1rem', fontSize: '.95rem' }} href={e.mapLink || wedding.mapLink} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={18} /> Map</a>
                      <a className="btn btn-ghost" style={{ minHeight: '2.7rem', padding: '.4rem 1.1rem', fontSize: '.95rem' }} href={calendarLink(e)} target="_blank" rel="noopener noreferrer"><Icon name="calendar" size={18} /> Add to calendar</a>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
