import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader, ButtonLink } from './ui';
import Icon from '../icons';

function PlaceCard({ eyebrow, icon, name, note, href, cta }) {
  return (
    <Card>
      <p className="eyebrow flex items-center gap-2"><Icon name={icon} size={18} /> {eyebrow}</p>
      <h3 className="font-display font-bold mt-1" style={{ fontSize: '1.9rem', color: 'var(--maroon)' }}>{name}</h3>
      {note && <p className="text-muted mt-1">{note}</p>}
      {href && <div className="mt-4"><ButtonLink href={href} variant="ghost"><Icon name="pin" size={18} /> {cta}</ButtonLink></div>}
    </Card>
  );
}

export default function Travel() {
  const t = siteConfig.travel;
  const stays = (t.stays || []).filter((s) => s.mapLink);
  const malls = (t.nearbyMalls || []).filter((m) => m.mapLink);
  const attractions = t.attractions || [];

  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="Stay · Shop · Explore" title={t.title} subtitle={t.subtitle} />

        <div className="grid gap-5">
          <Card>
            <p className="eyebrow flex items-center gap-2"><Icon name="pin" size={18} /> Wedding venue</p>
            <h3 className="font-display font-bold mt-1" style={{ fontSize: '1.9rem', color: 'var(--maroon)' }}>{t.venueName}</h3>
            <p className="text-muted mt-1">{t.venueAddress}</p>
            {t.venueEmbedUrl && (
              <div className="mt-4 overflow-hidden" style={{ borderRadius: '1rem', border: '1px solid rgba(184,137,59,.4)' }}>
                <iframe title="Venue map" src={t.venueEmbedUrl} loading="lazy" style={{ border: 0, width: '100%', height: '15rem' }} referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
            <div className="mt-4"><ButtonLink href={t.venueMapLink} variant="primary"><Icon name="pin" size={18} /> Open in Google Maps</ButtonLink></div>
          </Card>

          {stays.map((s) => <PlaceCard key={s.name} eyebrow="Where to stay" icon="bed" name={s.name} note={s.note} href={s.mapLink} cta={`Open ${s.name} in Maps`} />)}

          {malls.length > 0 && (
            <Card>
              <p className="eyebrow flex items-center gap-2"><Icon name="bag" size={18} /> Nearby malls</p>
              <div className="grid gap-4 mt-3">
                {malls.map((m) => (
                  <div key={m.name} className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="font-display font-bold" style={{ fontSize: '1.5rem', color: 'var(--maroon)' }}>{m.name}</span>
                    <ButtonLink href={m.mapLink} variant="ghost" style={{ minHeight: '2.7rem', padding: '.4rem 1.1rem', fontSize: '.95rem' }}><Icon name="pin" size={18} /> Map</ButtonLink>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {attractions.map((a) => (
            <PlaceCard key={a.name} eyebrow="Explore Vizag" icon="compass" name={a.name} note={a.description} href={a.website} cta="Open the tourism guide" />
          ))}
        </div>
      </div>
    </main>
  );
}
