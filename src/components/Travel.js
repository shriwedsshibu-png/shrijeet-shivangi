import React from 'react';
import siteConfig from '../siteConfig';
import { Card, PageHeader, ButtonLink } from './ui';
import Icon from '../icons';

function PlaceCard({ eyebrow, icon, name, note, href, cta, image }) {
  return (
    <Card style={image ? { padding: 0, overflow: 'hidden' } : undefined}>
      {image && (
        <div style={{ margin: '-1px -1px 0', borderRadius: '1.1rem 1.1rem 0 0', overflow: 'hidden' }}>
          <img src={image} alt="" style={{ width: '100%', height: '9.5rem', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <div style={image ? { padding: '1.2rem 1.4rem 1.4rem' } : undefined}>
        <p className="eyebrow flex items-center gap-2"><Icon name={icon} size={18} /> {eyebrow}</p>
        <h3 className="font-display font-bold mt-1" style={{ fontSize: '1.9rem', color: 'var(--maroon)' }}>{name}</h3>
        {note && <p className="text-muted mt-1">{note}</p>}
        {href && <div className="mt-4"><ButtonLink href={href} variant="ghost"><Icon name="pin" size={18} /> {cta}</ButtonLink></div>}
      </div>
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
          <PlaceCard eyebrow="Wedding venue" icon="pin" name={t.venueName} note={t.venueAddress} href={t.venueMapLink} cta="Open in Google Maps" image="/images/cards/venue.jpg" />

          {stays.map((s) => <PlaceCard key={s.name} eyebrow="Where to stay" icon="bed" name={s.name} note={s.note} href={s.mapLink} cta="Open in Google Maps" />)}

          {malls.map((m) => <PlaceCard key={m.name} eyebrow="Nearby mall" icon="bag" name={m.name} note={m.note} href={m.mapLink} cta="Open in Google Maps" />)}

          {attractions.map((a) => (
            <PlaceCard key={a.name} eyebrow="Explore Vizag" icon="compass" name={a.name} note={a.description} href={a.website} cta="Open the tourism guide" />
          ))}
        </div>
      </div>
    </main>
  );
}
