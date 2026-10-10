import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, Button, Field, Notice, PageHeader } from './ui';
import { submitRsvp, backendReady, NOT_READY_MESSAGE } from '../api';
import { sortedEvents, loadSaved, save } from '../utils';
import { isFullTier, getTier } from '../tier';

const SAVE_KEY = 'wedding_rsvp_v3';

const blank = () => ({
  contactName: '',
  phone: '',
  attending: 'yes',
  men: '1',
  women: '0',
  children: '0',
  arrivalDate: '',
  accommodation: '',
  notes: '',
  events: [],   // the functions this family will come for (3-day guests choose)
});

function Choice({ on, onClick, children }) {
  return <button type="button" onClick={onClick} className={`choice ${on ? 'choice-on' : ''}`} aria-pressed={on}>{children}</button>;
}

export default function RSVPPage() {
  const saved = loadSaved(SAVE_KEY);
  const [form, setForm] = useState(() => { const f = { ...blank(), ...(saved || {}) }; if (!Array.isArray(f.events)) f.events = []; return f; });
  const [hadSaved] = useState(!!saved);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // null | 'new' | 'updated'
  const [error, setError] = useState('');
  const events = sortedEvents();
  const full = isFullTier();
  const choose = full && events.length > 1;            // 3-day guests pick their functions
  const picked = (name) => form.events.includes(name);
  const allPicked = choose && events.every((ev) => picked(ev.name));
  const toggle = (name) => setForm((f) => ({ ...f, events: f.events.includes(name) ? f.events.filter((x) => x !== name) : [...f.events, name] }));
  const toggleAll = () => setForm((f) => ({ ...f, events: allPicked ? [] : events.map((ev) => ev.name) }));
  const evDay = (d) => new Date(d + 'T12:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  const days = full ? ['2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02'] : ['2026-12-01', '2026-12-02'];
  const dayLabel = (d) => new Date(d + 'T12:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const n = (v) => Math.max(0, parseInt(v, 10) || 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.contactName.trim()) { setError('Please enter your name.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (form.attending === 'yes') {
      if (choose && !events.some((ev) => picked(ev.name))) { setError('Please tick the functions you will attend.'); return; }
      if (n(form.men) + n(form.women) + n(form.children) === 0) { setError('Please tell us how many people are coming.'); return; }
      if (!form.arrivalDate) { setError('Please choose your date of arrival.'); return; }
      if (!form.accommodation) { setError('Please tell us if you need a room.'); return; }
    }
    setLoading(true);
    try {
      const result = await submitRsvp({ ...form, eventsAttending: (choose ? events.filter((ev) => picked(ev.name)) : events).map((ev) => ev.name), inviteType: getTier() });
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
                  {choose && (
                    <section className="grid gap-3">
                      <h2 className="form-title">Which functions will you attend?</h2>
                      <p className="hint" style={{ margin: 0 }}>Tap each one you will come for, so we can plan food and seating for every function.</p>
                      <Choice on={allPicked} onClick={toggleAll}>{allPicked ? '✓ ' : ''}All the functions</Choice>
                      <div className="grid gap-2">
                        {events.map((ev) => (
                          <Choice key={ev.name} on={picked(ev.name)} onClick={() => toggle(ev.name)}>
                            <span className="rsvp-ev">
                              <span className="rsvp-tick" aria-hidden>{picked(ev.name) ? '✓' : ''}</span>
                              <span className="rsvp-ev-name">{ev.nameHi && <span className="deva" style={{ display: 'block' }}>{ev.nameHi}</span>}{ev.name}</span>
                              <span className="rsvp-ev-when">{evDay(ev.date)}, {ev.time}</span>
                            </span>
                          </Choice>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="grid gap-4">
                    <h2 className="form-title">How many of you are coming?</h2>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Men"><input className="input" type="number" inputMode="numeric" min="0" max="30" value={form.men} onChange={(e) => set('men', e.target.value)} /></Field>
                      <Field label="Women"><input className="input" type="number" inputMode="numeric" min="0" max="30" value={form.women} onChange={(e) => set('women', e.target.value)} /></Field>
                      <Field label="Children"><input className="input" type="number" inputMode="numeric" min="0" max="20" value={form.children} onChange={(e) => set('children', e.target.value)} /></Field>
                    </div>
                    <p className="hint" style={{ margin: 0 }}>Total: <b>{n(form.men) + n(form.women) + n(form.children)}</b> {n(form.men) + n(form.women) + n(form.children) === 1 ? 'person' : 'people'} including you</p>
                  </section>

                  <section className="grid gap-3">
                    <h2 className="form-title">When do you arrive?</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {days.map((d) => <Choice key={d} on={form.arrivalDate === d} onClick={() => set('arrivalDate', d)}>{dayLabel(d)}</Choice>)}
                    </div>
                    <Field label="Another date?"><input className="input" type="date" value={days.includes(form.arrivalDate) ? '' : form.arrivalDate} onChange={(e) => set('arrivalDate', e.target.value)} /></Field>
                  </section>

                  <section className="grid gap-3">
                    <h2 className="form-title">Do you need a room?</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice on={form.accommodation === 'yes'} onClick={() => set('accommodation', 'yes')}>Yes, please</Choice>
                      <Choice on={form.accommodation === 'no'} onClick={() => set('accommodation', 'no')}>No, thank you</Choice>
                    </div>
                  </section>
                </>
              )}

              <section className="grid gap-4">
                <Field label="Anything else we should know?" hint="Optional — for example wheelchair help, travel details, or a note for us.">
                  <textarea className="input" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </Field>
              </section>

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
