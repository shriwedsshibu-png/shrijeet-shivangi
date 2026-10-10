import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, Button, Field, Notice, PageHeader } from './ui';
import { submitRsvp, backendReady, NOT_READY_MESSAGE } from '../api';
import { sortedEvents, loadSaved, save } from '../utils';
import { isFullTier, getTier } from '../tier';
import { L, locale, isHi } from '../lang';
import { evTime } from '../utils';

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
  const evDay = (d) => new Date(d + 'T12:00:00+05:30').toLocaleDateString(locale(), isHi() ? { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' } : { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  const days = full ? ['2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02'] : ['2026-12-01', '2026-12-02'];
  const dayLabel = (d) => new Date(d + 'T12:00:00+05:30').toLocaleDateString(locale(), isHi() ? { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' } : { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const n = (v) => Math.max(0, parseInt(v, 10) || 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.contactName.trim()) { setError(L('Please enter your name.', 'कृपया अपना नाम लिखें।')); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError(L('Please enter a valid 10-digit mobile number.', 'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।')); return; }
    if (form.attending === 'yes') {
      if (choose && !events.some((ev) => picked(ev.name))) { setError(L('Please tick the functions you will attend.', 'कृपया उन कार्यक्रमों पर निशान लगाएँ जिनमें आप आएँगे।')); return; }
      if (n(form.men) + n(form.women) + n(form.children) === 0) { setError(L('Please tell us how many people are coming.', 'कृपया बताएँ कि कितने लोग आ रहे हैं।')); return; }
      if (!form.arrivalDate) { setError(L('Please choose your date of arrival.', 'कृपया अपने पहुँचने की तारीख़ चुनें।')); return; }
      if (!form.accommodation) { setError(L('Please tell us if you need a room.', 'कृपया बताएँ कि क्या आपको कमरा चाहिए।')); return; }
    }
    setLoading(true);
    try {
      const result = await submitRsvp({ ...form, eventsAttending: (choose ? events.filter((ev) => picked(ev.name)) : events).map((ev) => ev.name), inviteType: getTier() });
      save(SAVE_KEY, form);
      setDone(result.updated ? 'updated' : 'new');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || L('Could not save your RSVP. Please try again.', 'आपका उत्तर सहेजा नहीं जा सका। कृपया फिर से कोशिश करें।'));
    } finally {
      setLoading(false);
    }
  };

  const attending = form.attending === 'yes';
  const cfg = siteConfig.rsvp;

  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow={L('Help us welcome you', 'आपके स्वागत की तैयारी')} title={cfg.title} subtitle={full ? cfg.subtitle : (cfg.weddingSubtitle || cfg.subtitle)} />

        {!backendReady() && <div className="mb-5"><Notice kind="info">{NOT_READY_MESSAGE}</Notice></div>}

        <Card>
          {done ? (
            <div className="text-center py-8 fade-in">
              <div style={{ fontSize: '3.2rem' }}>🙏</div>
              <h2 className="script mt-2" style={{ fontSize: '3.2rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{L('Thank you!', 'धन्यवाद!')}</h2>
              <p className="mt-3" style={{ fontSize: '1.1rem' }}>
                {done === 'updated' ? L('Your RSVP has been updated.', 'आपका उत्तर बदल दिया गया है।') : L('Your RSVP has been received.', 'आपका उत्तर हमें मिल गया है।')}{' '}
                {attending ? L('We cannot wait to celebrate with you.', 'आपके साथ उत्सव मनाने की हमें बेसब्री से प्रतीक्षा है।') : L('We will miss you, and we are grateful for your blessings.', 'हमें आपकी कमी खलेगी। आपके आशीर्वाद के लिए हृदय से आभार।')}
              </p>
              <p className="text-muted mt-2">{L('Need to change something? You can edit and send again anytime.', 'कुछ बदलना है? आप कभी भी बदलकर फिर से भेज सकते हैं।')}</p>
              <div className="mt-6"><Button variant="ghost" onClick={() => setDone(null)}>{L('Edit my RSVP', 'उत्तर बदलें')}</Button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8" noValidate>
              {hadSaved && <Notice kind="info">{L('We have filled in your earlier answers. Change anything you like and press “Update my RSVP” — it will replace your old answer.', 'आपके पिछले उत्तर भरे हुए हैं। जो चाहें बदलें और “उत्तर बदलकर भेजें” दबाएँ — नया उत्तर पुराने की जगह ले लेगा।')}</Notice>}

              <section className="grid gap-4">
                <h2 className="form-title">{L('Your details', 'आपकी जानकारी')}</h2>
                <Field label={L('Your name (or family name)', 'आपका नाम (या परिवार का नाम)')} required>
                  <input className="input" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder={L('e.g. Ramesh Sharma & Family', 'जैसे: रमेश शर्मा एवं परिवार')} autoComplete="name" />
                </Field>
                <Field label={L('WhatsApp / mobile number', 'व्हाट्सऐप / मोबाइल नंबर')} required hint={L('We use this number to find your RSVP if you wish to change it later.', 'बाद में उत्तर बदलना हो, तो इसी नंबर से आपका उत्तर मिलेगा।')}>
                  <input className="input" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder={L('10-digit mobile number', '10 अंकों का मोबाइल नंबर')} autoComplete="tel" />
                </Field>
              </section>

              <section className="grid gap-3">
                <h2 className="form-title">{L('Will you be joining us?', 'क्या आप पधारेंगे?')}</h2>
                <Choice on={attending} onClick={() => set('attending', 'yes')}>{L('Yes, we will be there ❤️', 'हाँ, हम अवश्य आएँगे ❤️')}</Choice>
                <Choice on={!attending} onClick={() => set('attending', 'no')}>{L('Sorry, we cannot make it', 'क्षमा करें, हम नहीं आ पाएँगे')}</Choice>
              </section>

              {attending && (
                <>
                  {choose && (
                    <section className="grid gap-3">
                      <h2 className="form-title">{L('Which functions will you attend?', 'आप किन कार्यक्रमों में आएँगे?')}</h2>
                      <p className="hint" style={{ margin: 0 }}>{L('Tap each one you will come for, so we can plan food and seating for every function.', 'जिन कार्यक्रमों में आप आएँगे, उन पर दबाएँ — ताकि हम हर कार्यक्रम के भोजन और बैठने की व्यवस्था कर सकें।')}</p>
                      <Choice on={allPicked} onClick={toggleAll}>{allPicked ? '✓ ' : ''}{L('All the functions', 'सभी कार्यक्रम')}</Choice>
                      <div className="grid gap-2">
                        {events.map((ev) => (
                          <Choice key={ev.name} on={picked(ev.name)} onClick={() => toggle(ev.name)}>
                            <span className="rsvp-ev">
                              <span className="rsvp-tick" aria-hidden>{picked(ev.name) ? '✓' : ''}</span>
                              <span className="rsvp-ev-name">{ev.nameHi && <span className="deva" style={{ display: 'block' }}>{ev.nameHi}</span>}{ev.name}</span>
                              <span className="rsvp-ev-when">{evDay(ev.date)}, {evTime(ev)}</span>
                            </span>
                          </Choice>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="grid gap-4">
                    <h2 className="form-title">{L('How many of you are coming?', 'आप कितने लोग आ रहे हैं?')}</h2>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label={L('Men', 'पुरुष')}><input className="input" type="number" inputMode="numeric" min="0" max="30" value={form.men} onChange={(e) => set('men', e.target.value)} /></Field>
                      <Field label={L('Women', 'महिलाएँ')}><input className="input" type="number" inputMode="numeric" min="0" max="30" value={form.women} onChange={(e) => set('women', e.target.value)} /></Field>
                      <Field label={L('Children', 'बच्चे')}><input className="input" type="number" inputMode="numeric" min="0" max="20" value={form.children} onChange={(e) => set('children', e.target.value)} /></Field>
                    </div>
                    <p className="hint" style={{ margin: 0 }}>{L('Total:', 'कुल:')} <b>{n(form.men) + n(form.women) + n(form.children)}</b> {L(n(form.men) + n(form.women) + n(form.children) === 1 ? 'person including you' : 'people including you', 'व्यक्ति (आप सहित)')}</p>
                  </section>

                  <section className="grid gap-3">
                    <h2 className="form-title">{L('When do you arrive?', 'आप कब पहुँचेंगे?')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {days.map((d) => <Choice key={d} on={form.arrivalDate === d} onClick={() => set('arrivalDate', d)}>{dayLabel(d)}</Choice>)}
                    </div>
                    <Field label={L('Another date?', 'कोई और तारीख़?')}><input className="input" type="date" value={days.includes(form.arrivalDate) ? '' : form.arrivalDate} onChange={(e) => set('arrivalDate', e.target.value)} /></Field>
                  </section>

                  <section className="grid gap-3">
                    <h2 className="form-title">{L('Do you need a room?', 'क्या आपको कमरा चाहिए?')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice on={form.accommodation === 'yes'} onClick={() => set('accommodation', 'yes')}>{L('Yes, please', 'हाँ, चाहिए')}</Choice>
                      <Choice on={form.accommodation === 'no'} onClick={() => set('accommodation', 'no')}>{L('No, thank you', 'नहीं, धन्यवाद')}</Choice>
                    </div>
                  </section>
                </>
              )}

              <section className="grid gap-4">
                <Field label={L('Anything else we should know?', 'कुछ और बताना चाहें?')} hint={L('Optional — for example wheelchair help, travel details, or a note for us.', 'वैकल्पिक — जैसे व्हीलचेयर की मदद, यात्रा की जानकारी या हमारे लिए कोई संदेश।')}>
                  <textarea className="input" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </Field>
              </section>

              {error && <Notice kind="error">{error}</Notice>}
              <Button type="submit" variant="primary" block disabled={loading || !backendReady()}>
                {loading ? L('Saving…', 'सहेजा जा रहा है…') : hadSaved ? L('Update my RSVP', 'उत्तर बदलकर भेजें') : L('Send my RSVP', 'उत्तर भेजें')}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
