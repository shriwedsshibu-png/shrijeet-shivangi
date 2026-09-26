import React from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';

function Travel() {
  const travel = siteConfig.travel || {};
  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-5xl">
        <div className="text-center mb-12">
          <p className="eyebrow">A little beyond the wedding</p>
          <h1 className="section-title">{travel.title}</h1>
          <p className="section-subtitle">{travel.subtitle}</p>
        </div>

        <div className="space-y-5 mb-10">
          {(travel.attractions || []).map((attraction, index) => (
            <Card key={index} className="p-6 md:p-8">
              <p className="eyebrow">Explore Vizag</p>
              <h2 className="font-display text-3xl font-semibold text-ink">{attraction.name}</h2>
              <p className="text-muted mt-3 mb-5">{attraction.description}</p>
              {attraction.website && <a href={attraction.website} target="_blank" rel="noopener noreferrer"><Button variant="primary">Open Incredible India Guide</Button></a>}
            </Card>
          ))}

          <Card className="p-6 md:p-8">
            <p className="eyebrow">Wedding venue</p>
            <h2 className="font-display text-3xl font-semibold text-ink">{travel.venueName}</h2>
            <p className="text-muted mt-2">{travel.venueAddress}</p>
            <a href={travel.venueMapLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-5"><Button variant="secondary">Open Resort in Google Maps</Button></a>
          </Card>

          {(travel.stays || []).map((stay, index) => stay.mapLink ? (
            <Card key={index} className="p-6 md:p-8">
              <p className="eyebrow">For reference</p>
              <h2 className="font-display text-2xl font-semibold text-ink">{stay.name}</h2>
              <a href={stay.mapLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4"><Button variant="secondary">Open {stay.name} in Google Maps</Button></a>
            </Card>
          ) : null)}
        </div>


      </div>
    </main>
  );
}

export default Travel;
