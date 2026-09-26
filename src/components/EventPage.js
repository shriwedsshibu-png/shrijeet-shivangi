import React from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';

function timeToMinutes(time) {
  const match = String(time || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function EventPage() {
  const events = [...(siteConfig.events?.events || [])].sort((a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time));

  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-5xl">
        <div className="text-center mb-14">
          <p className="eyebrow">The wedding celebrations</p>
          <h1 className="section-title">{siteConfig.events.title}</h1>
          <p className="section-subtitle">{siteConfig.events.subtitle}</p>
        </div>

        <div className="space-y-7">
          {events.map((event, index) => (
            <Card key={event.id || index} className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="md:w-36 shrink-0 text-center md:text-left">
                  <p className="eyebrow mb-1">{String(index + 1).padStart(2, '0')}</p>
                  <p className="font-display text-xl font-semibold text-maroon">{formatDate(event.date)}</p>
                  <p className="mt-1 text-sm text-apple-gray-600">{event.time}</p>
                </div>
                <div className="hidden md:block w-px self-stretch bg-gold/40" />
                <div className="flex-1">
                  <h2 className="font-display text-3xl font-semibold text-apple-gray-900">{event.name}</h2>
                  <p className="mt-2 text-muted">{event.description}</p>
                  {event.mapLink && (
                    <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-maroon font-semibold hover:text-gold transition-colors">📍 Open location in Google Maps →</a>
                  )}
                  {event.dressCode && (
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <span className="tag">👗 {event.dressCode}</span>
                    </div>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default EventPage;
