import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import { Card, Button, Field, Notice, PageHeader } from './ui';
import { submitRsvp, submitReceptionRsvp, backendReady, NOT_READY_MESSAGE } from '../api';
import { sortedEvents, loadSaved, save } from '../utils';
import { isFullTier, getTier, isReception, tierCfg, invitedByBride } from '../tier';
import { L, locale, isHi } from '../lang';
import { evTime } from '../utils';
import { BlessingCard } from './Blessings';
import { Link } from 'react-router-dom';

const SAVE_KEY = 'wedding_rsvp_v3';
const RECEPTION_KEY = 'reception_rsvp_v1';   // the reception form is kept apart from the wedding one

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
  from: '',     // wedding-day guests: 'vizag' or 'outside'
  events: [],   // the functions this family will come for (3-day guests choose)
});

// one row per group with − and + buttons, so nobody has to type a number
function Stepper({ label, sub, value, onChange, max }) {
  const btn = { width: '2.9rem', height: '2.9rem', borderRadius: '999px', border: '1.5px solid var(--maroon)', background: '#fff', color: 'var(--maroon)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.8rem', padding: '.65rem .9rem', border: '1.5px solid #dccbb0', borderRadius: '1rem', background: '#fffdf8' }}>
      <div style={{ minWidth: 0 }}><b style={{ fontSize: '1.08rem', color: 'var(--maroon)' }}>{label}</b>{sub && <div className="hint" style={{ margin: 0 }}>{sub}</div>}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', flex: 'none' }}>
        <button type="button" style={{ ...btn, opacity: value <= 0 ? 0.35 : 1 }} disabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))} aria-label={L('One less', 'एक कम')}>−</button>
        <span style={{ minWidth: '1.6rem', textAlign: 'center', fontSize: '1.45rem', fontWeight: 700, color: 'var(--maroon)' }} aria-live="polite">{value}</span>
        <button type="button" style={{ ...btn, background: 'var(--maroon)', color: '#fbf3e6', opacity: value >= max ? 0.35 : 1 }} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} aria-label={L('One more', 'एक और')}>+</button>
      </div>
    </div>
  );
}

// "2 men · 1 woman · 2 children = 5 people in all (including you)"
function headLine(m, w, k) {
  const t = m + w + k;
  const parts = isHi()
    ? [m && `${m} पुरुष`, w && `${w} ${w === 1 ? 'महिला' : 'महिलाएँ'}`, k && `${k} ${k === 1 ? 'बच्चा' : 'बच्चे'}`]
    : [m && `${m} ${m === 1 ? 'man' : 'men'}`, w && `${w} ${w === 1 ? 'woman' : 'women'}`, k && `${k} ${k === 1 ? 'child' : 'children'}`];
  const list = parts.filter(Boolean).join(' · ');
  if (!t) return L('Tap + to add the people coming.', 'आने वालों को जोड़ने के लिए + दबाएँ।');
  return isHi() ? <>{list} = <b>कुल {t} {t === 1 ? 'व्यक्ति' : 'लोग'}</b> (आप सहित)</> : <>{list} = <b>{t} {t === 1 ? 'person' : 'people'} in all</b> (including you)</>;
}

function Choice({ on, onClick, children }) {
  return <button type="button" onClick={onClick} className={`choice ${on ? 'choice-on' : ''}`} aria-pressed={on}>{children}</button>;
}

export default function RSVPPage() {
  const rec = isReception();
  const KEY = rec ? RECEPTION_KEY : SAVE_KEY;
  const saved = loadSaved(KEY);
  const [form, setForm] = useState(() => { const f = { ...blank(), ...(saved || {}) }; if (!Array.isArray(f.events)) f.events = []; return f; });
  const [hadSaved] = useState(!!saved);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // null | 'new' | 'updated'
  const [error, setError] = useState('');
  const events = sortedEvents();
  const full = isFullTier();
  const wedOnly = !full && !rec;                      // wedding-day guests: Vizag or outside, no room question
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
      if (full && !form.arrivalDate) { setError(L('Please choose your date of arrival.', 'कृपया अपने पहुँचने की तारीख़ चुनें।')); return; }
      if (wedOnly && !form.from) { setError(L('Please tell us where you are coming from.', 'कृपया बताएँ कि आप कहाँ से आ रहे हैं।')); return; }
      if (full && !form.accommodation) { setError(L('Please tell us if you need a room.', 'कृपया बताएँ कि क्या आपको कमरा चाहिए।')); return; }
    }
    setLoading(true);
    try {
      const payload = { ...form, eventsAttending: (choose ? events.filter((ev) => picked(ev.name)) : events).map((ev) => ev.name), inviteType: getTier() };
      // invited from Shivangi's side (opened a /invite/shivangi/... link): tag the note so the family planner keeps their count apart
      if (invitedByBride()) payload.notes = (payload.notes ? payload.notes + ' · ' : '') + "[Shivangi side]";
      if (wedOnly && form.attending === 'yes') {
        const out = form.from === 'outside';
        payload.arrivalDate = out ? form.arrivalDate : '';
        payload.notes = (out ? 'From outside Vizag' : 'From Vizag') + (form.notes.trim() ? ' · ' + form.notes.trim() : '') + (invitedByBride() ? " · [Shivangi side]" : '');
      }
      const result = rec ? await submitReceptionRsvp({ ...payload, arrivalDate: '', accommodation: '' }) : await submitRsvp(full ? payload : { ...payload, accommodation: '' });
      save(KEY, form);
      setDone(result.updated ? 'updated' : 'new');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const m = err.message || '';
      setError(/unknown request/i.test(m) ? L('The reception RSVP opens in a little while. Please try again later.', 'आशीर्वाद समारोह का उत्तर थोड़ी देर में खुलेगा। कृपया बाद में फिर कोशिश करें।') : (m || L('Could not save your RSVP. Please try again.', 'आपका उत्तर सहेजा नहीं जा सका। कृपया फिर से कोशिश करें।')));
    } finally {
      setLoading(false);
    }
  };

  const attending = form.attending === 'yes';
  const cfg = siteConfig.rsvp;

  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow={L('Help us welcome you', 'आपके स्वागत की तैयारी')} title={cfg.title} subtitle={rec ? (tierCfg().rsvpSubtitle || cfg.subtitle) : full ? cfg.subtitle : (cfg.weddingSubtitle || cfg.subtitle)} />

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
              {!attending && (
                <div className="mt-8 pt-7 text-left" style={{ borderTop: '1px solid rgba(184,137,59,.35)' }}>
                  <BlessingCard bare defaultName={form.contactName}
                    heading={L('Send your blessings', 'अपना आशीर्वाद भेजें')}
                    hint={L('You may not be with us on the day, but your blessings will be. Write a few words for Shrijeet and Shivangi and we will keep them with us forever.', 'आप उस दिन हमारे साथ न हों, पर आपका आशीर्वाद ज़रूर साथ रहेगा। श्रीजीत और शिवांगी के लिए कुछ शब्द लिखें, हम उन्हें सदा सँजोकर रखेंगे।')} />
                  {siteConfig.shagun?.enabled && <p className="text-muted mt-4 text-center"><Link to="/blessings" style={{ color: 'var(--maroon)', textDecoration: 'underline' }}>{L('You can also send a digital shagun on the Blessings page', 'आशीर्वाद पेज पर डिजिटल शगुन भी भेज सकते हैं')}</Link></p>}
                </div>
              )}
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
                    <div className="grid gap-2">
                      <Stepper label={L('Men', 'पुरुष')} value={n(form.men)} onChange={(v) => set('men', String(v))} max={30} />
                      <Stepper label={L('Women', 'महिलाएँ')} value={n(form.women)} onChange={(v) => set('women', String(v))} max={30} />
                      <Stepper label={L('Children', 'बच्चे')} sub={L('below 12 years', '12 साल से कम')} value={n(form.children)} onChange={(v) => set('children', String(v))} max={20} />
                    </div>
                    <p className="hint" style={{ margin: 0, fontSize: '1.02rem' }}>{headLine(n(form.men), n(form.women), n(form.children))}</p>
                  </section>

                  {wedOnly && <section className="grid gap-3">
                    <h2 className="form-title">{L('Where are you coming from?', 'आप कहाँ से आ रहे हैं?')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice on={form.from === 'vizag'} onClick={() => set('from', 'vizag')}>{L('From Vizag', 'विशाखापत्तनम से')}</Choice>
                      <Choice on={form.from === 'outside'} onClick={() => set('from', 'outside')}>{L('From outside Vizag', 'बाहर से')}</Choice>
                    </div>
                  </section>}

                  {(full || (wedOnly && form.from === 'outside')) && <>
                  <section className="grid gap-3">
                    <h2 className="form-title">{full ? L('When do you arrive?', 'आप कब पहुँचेंगे?') : L('When do you arrive? (optional)', 'आप कब पहुँचेंगे? (वैकल्पिक)')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {days.map((d) => <Choice key={d} on={form.arrivalDate === d} onClick={() => set('arrivalDate', d)}>{dayLabel(d)}</Choice>)}
                    </div>
                    <Field label={L('Another date?', 'कोई और तारीख़?')}><input className="input" type="date" value={days.includes(form.arrivalDate) ? '' : form.arrivalDate} onChange={(e) => set('arrivalDate', e.target.value)} /></Field>
                  </section>

                  {full && <section className="grid gap-3">
                    <h2 className="form-title">{L('Do you need a room?', 'क्या आपको कमरा चाहिए?')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice on={form.accommodation === 'yes'} onClick={() => set('accommodation', 'yes')}>{L('Yes, please', 'हाँ, चाहिए')}</Choice>
                      <Choice on={form.accommodation === 'no'} onClick={() => set('accommodation', 'no')}>{L('No, thank you', 'नहीं, धन्यवाद')}</Choice>
                    </div>
                  </section>}
                  </>}
                </>
              )}

              <section className="grid gap-4">
                <Field label={L('Anything else we should know?', 'कुछ और बताना चाहें?')} hint={full ? L('Optional — for example wheelchair help, travel details, or a note for us.', 'वैकल्पिक — जैसे व्हीलचेयर की मदद, यात्रा की जानकारी या हमारे लिए कोई संदेश।') : L('Optional — any help you need, travel details, or a note for us.', 'वैकल्पिक — कोई मदद चाहिए, यात्रा की जानकारी या हमारे लिए कोई संदेश।')}>
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
