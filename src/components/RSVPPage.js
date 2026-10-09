import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, Button, Field, Notice, PageHeader } from './ui';
import { submitRsvp, backendReady, NOT_READY_MESSAGE } from '../api';
import { sortedEvents, loadSaved, save } from '../utils';
import { isFullTier, getTier } from '../tier';

const SAVE_KEY = 'wedding_rsvp_v2';

const blank = () => ({
  contactName: '',
  phone: '',
  attending: 'yes',
  adults: '1',
  children: '0',
  guestNames: '',
  eventsAttending: [],
  arrivalDate: '',
  arrivalTime: '',
  departureDate: '',
  departureTime: '',
  accommodation: 'no',
  nights: '',
  cab: 'no',
  pickupLocation: '',
  foodPreference: 'No special preference',
  notes: '',
});

function Choice({ on, onClick, children }) {
  return <button type="button" onClick={onClick} className={`choice ${on ? 'choice-on' : ''}`} aria-pressed={on}>{children}</button>;
}

export default function RSVPPage() {
  const saved = loadSaved(SAVE_KEY);
  const [form, setForm] = useState(() => ({ ...blank(), ...(saved || {}) }));
  const [hadSaved] = useState(!!saved);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // null | 'new' | 'updated'
  const [error, setError] = useState('');
  const events = sortedEvents();
  const full = isFullTier();

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleEvent = (name) => set('eventsAttending', form.eventsAttending.includes(name) ? form.eventsAttending.filter((n) => n !== name) : [...form.eventsAttending, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.contactName.trim()) { setError('Please enter your name.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (full && form.attending === 'yes' && form.eventsAttending.length === 0) { setError('Please choose at least one celebration you will attend.'); return; }
    setLoading(true);
    try {
      const payload = full ? form : {
        ...form, eventsAttending: events.map((ev) => ev.name),
        arrivalDate: '', arrivalTime: '', departureDate: '', departureTime: '', accommodation: 'no', nights: '', cab: 'no', pickupLocation: '',
      };
      const result = await submitRsvp({ ...payload, inviteType: getTier() });
      save(SAVE_KEY, form);
      setDone(result.updated ? 'updated' : 'new');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Could not save your RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const attending = form.attending === 'yes';
  const cfg = siteConfig.rsvp;

  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="Help us welcome you" title={cfg.title} subtitle={full ? cfg.subtitle : (cfg.weddingSubtitle || cfg.subtitle)} />

        {!backendReady() && <div className="mb-5"><Notice kind="info">{NOT_READY_MESSAGE}</Notice></div>}

        <Card>
          {done ? (
            <div className="text-center py-8 fade-in">
              <div style={{ fontSize: '3.2rem' }}>🙏</div>
              <h2 className="script mt-2" style={{ fontSize: '3.2rem', color: 'var(--maroon)', lineHeight: 1.1 }}>Thank you!</h2>
              <p className="mt-3" style={{ fontSize: '1.1rem' }}>
                {done === 'updated' ? 'Your RSVP has been updated.' : 'Your RSVP has been received.'}{' '}
                {attending ? 'We cannot wait to celebrate with you.' : 'We will miss you, and we are grateful for your blessings.'}
              </p>
              <p className="text-muted mt-2">Need to change something? You can edit and send again anytime.</p>
              <div className="mt-6"><Button variant="ghost" onClick={() => setDone(null)}>Edit my RSVP</Button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8" noValidate>
              {hadSaved && <Notice kind="info">We have filled in your earlier answers. Change anything you like and press “Update my RSVP” — it will replace your old answer.</Notice>}

              <section className="grid gap-4">
                <h2 className="form-title">Your details</h2>
                <Field label="Your name (or family name)" required>
                  <input className="input" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="e.g. Ramesh Sharma & Family" autoComplete="name" />
                </Field>
                <Field label="WhatsApp / mobile number" required hint="We use this number to find your RSVP if you wish to change it later.">
                  <input className="input" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
                </Field>
              </section>

              <section className="grid gap-3">
                <h2 className="form-title">Will you be joining us?</h2>
                <Choice on={attending} onClick={() => set('attending', 'yes')}>Yes, we will be there ❤️</Choice>
                <Choice on={!attending} onClick={() => set('attending', 'no')}>Sorry, we cannot make it</Choice>
              </section>

              {attending && (
                <>
                  <section className="grid gap-4">
                    <h2 className="form-title">Who is coming?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Adults"><input className="input" type="number" inputMode="numeric" min="1" max="30" value={form.adults} onChange={(e) => set('adults', e.target.value)} /></Field>
                      <Field label="Children"><input className="input" type="number" inputMode="numeric" min="0" max="20" value={form.children} onChange={(e) => set('children', e.target.value)} /></Field>
                    </div>
                    <Field label="Names of everyone coming with you" hint="Separate names with commas.">
                      <textarea className="input" value={form.guestNames} onChange={(e) => set('guestNames', e.target.value)} placeholder="e.g. Sunita, Rahul, Aarav" />
                    </Field>
                  </section>

                  {!full && (
                    <section className="grid gap-2">
                      <h2 className="form-title">Your invitation</h2>
                      {events.map((ev) => (
                        <div key={ev.id} className="choice choice-on" style={{ cursor: 'default' }}>
                          <span style={{ fontSize: '1.05rem' }}>✓ {ev.name}</span>
                          <span className="block" style={{ fontSize: '.85rem', fontWeight: 500, opacity: .85 }}>{ev.date.split('-').reverse().join('/')} · {ev.time}</span>
                        </div>
                      ))}
                    </section>
                  )}

                  {full && (<>
                  <section className="grid gap-3">
                    <h2 className="form-title">Which celebrations will you attend?</h2>
                    <p className="hint" style={{ margin: 0 }}>Tap to select or unselect. This helps us plan food and seating.</p>
                    {events.map((ev) => (
                      <Choice key={ev.id} on={form.eventsAttending.includes(ev.name)} onClick={() => toggleEvent(ev.name)}>
                        <span style={{ fontSize: '1.05rem' }}>{form.eventsAttending.includes(ev.name) ? '✓ ' : ''}{ev.name}</span>
                        <span className="block" style={{ fontSize: '.85rem', fontWeight: 500, opacity: .85 }}>{ev.date.split('-').reverse().join('/')} · {ev.time}{ev.dateNote ? ` (${ev.dateNote})` : ''}</span>
                      </Choice>
                    ))}
                  </section>

                  <section className="grid gap-4">
                    <h2 className="form-title">Arrival &amp; departure</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Arrival date"><input className="input" type="date" value={form.arrivalDate} onChange={(e) => set('arrivalDate', e.target.value)} /></Field>
                      <Field label="Arrival time (approx.)"><input className="input" type="time" value={form.arrivalTime} onChange={(e) => set('arrivalTime', e.target.value)} /></Field>
                      <Field label="Departure date"><input className="input" type="date" value={form.departureDate} onChange={(e) => set('departureDate', e.target.value)} /></Field>
                      <Field label="Departure time (approx.)"><input className="input" type="time" value={form.departureTime} onChange={(e) => set('departureTime', e.target.value)} /></Field>
                    </div>
                  </section>

                  <section className="grid gap-4">
                    <h2 className="form-title">Stay &amp; travel</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Do you need a room?">
                        <select className="input" value={form.accommodation} onChange={(e) => set('accommodation', e.target.value)}><option value="no">No, we have arranged</option><option value="yes">Yes, please arrange</option></select>
                      </Field>
                      <Field label="Number of nights"><input className="input" type="number" inputMode="numeric" min="0" max="20" value={form.nights} onChange={(e) => set('nights', e.target.value)} placeholder="If you need a room" /></Field>
                      <Field label="Do you need a cab / pickup?">
                        <select className="input" value={form.cab} onChange={(e) => set('cab', e.target.value)}><option value="no">No, thank you</option><option value="yes">Yes, please arrange</option></select>
                      </Field>
                      <Field label="Pickup / drop place"><input className="input" value={form.pickupLocation} onChange={(e) => set('pickupLocation', e.target.value)} placeholder="Airport / railway station / other" /></Field>
                    </div>
                  </section>

                  </>)}

                  <section className="grid gap-4">
                    <h2 className="form-title">Food &amp; anything else</h2>
                    <Field label="Food preference">
                      <select className="input" value={form.foodPreference} onChange={(e) => set('foodPreference', e.target.value)}>
                        <option>No special preference</option><option>Vegetarian</option><option>Jain</option><option>Vegan</option><option>Other (please write below)</option>
                      </select>
                    </Field>
                    <Field label="Anything else we should know?" hint="Optional — for example wheelchair help, allergies, or a note for us.">
                      <textarea className="input" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                    </Field>
                  </section>
                </>
              )}

              {error && <Notice kind="error">{error}</Notice>}
              <Button type="submit" variant="primary" block disabled={loading || !backendReady()}>
                {loading ? 'Saving…' : hadSaved ? 'Update my RSVP' : 'Send my RSVP'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
