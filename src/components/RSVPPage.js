import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';

const initialForm = {
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
};

function RSVPPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/submit-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Unable to save your RSVP.');
      setSubmitted(true);
      setFormData(initialForm);
    } catch (err) {
      setError(err.message || 'Unable to save your RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen wedding-surface pt-28 pb-24">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-10">
          <p className="eyebrow">Help us plan your welcome</p>
          <h1 className="section-title">{siteConfig.rsvp.title}</h1>
          <p className="section-subtitle">{siteConfig.rsvp.subtitle}</p>
        </div>

        <Card className="p-5 sm:p-7 md:p-10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-5">💛</div>
              <h2 className="font-display text-4xl font-semibold text-maroon">Thank you!</h2>
              <p className="text-apple-gray-700 mt-3 max-w-xl mx-auto">Your RSVP has been received. We will use these details to plan your stay, meals and transport.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-maroon font-semibold hover:underline">Update / submit another RSVP</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <h2 className="form-section-title">Your details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Name of main guest / family" required>
                    <input className="input-apple" value={formData.contactName} onChange={(e) => update('contactName', e.target.value)} required placeholder="Your name" />
                  </Field>
                  <Field label="WhatsApp / mobile number" required>
                    <input className="input-apple" type="tel" inputMode="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} required placeholder="10-digit mobile number" />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="form-section-title">Will you be joining us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Choice active={formData.attending === 'yes'} onClick={() => update('attending', 'yes')}>Yes, we will be there ❤️</Choice>
                  <Choice active={formData.attending === 'no'} onClick={() => update('attending', 'no')}>Sorry, we cannot make it</Choice>
                </div>
              </section>

              {formData.attending === 'yes' && (
                <>
                  <section>
                    <h2 className="form-section-title">Who is coming?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Adults attending">
                        <input className="input-apple" type="number" min="1" max="30" value={formData.adults} onChange={(e) => update('adults', e.target.value)} />
                      </Field>
                      <Field label="Children attending">
                        <input className="input-apple" type="number" min="0" max="20" value={formData.children} onChange={(e) => update('children', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Names of accompanying guests / children" hint="Please separate names with commas.">
                      <textarea className="input-apple min-h-[90px] resize-none" value={formData.guestNames} onChange={(e) => update('guestNames', e.target.value)} placeholder="e.g. Rahul, Priya, Aarav" />
                    </Field>
                  </section>

                  <section>
                    <h2 className="form-section-title">Which celebrations will you attend?</h2>
                    <p className="text-sm text-muted mb-4">This helps us plan food and seating for each function.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(siteConfig.events?.events || []).map((event) => {
                        const selected = formData.eventsAttending.includes(event.name);
                        return <button type="button" key={event.id} onClick={() => update('eventsAttending', selected ? formData.eventsAttending.filter((name) => name !== event.name) : [...formData.eventsAttending, event.name])} className={`rounded-2xl border px-4 py-4 text-left transition ${selected ? 'border-maroon bg-maroon text-white' : 'border-apple-gray-200 bg-white text-ink hover:border-gold'}`}><span className="font-semibold">{event.name}</span><span className={`block text-xs mt-1 ${selected ? 'text-white/80' : 'text-muted'}`}>{event.date} · {event.time}</span></button>;
                      })}
                    </div>
                  </section>

                  <section>
                    <h2 className="form-section-title">Arrival & departure</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Arrival date"><input className="input-apple" type="date" value={formData.arrivalDate} onChange={(e) => update('arrivalDate', e.target.value)} /></Field>
                      <Field label="Approx. arrival time"><input className="input-apple" type="time" value={formData.arrivalTime} onChange={(e) => update('arrivalTime', e.target.value)} /></Field>
                      <Field label="Departure date"><input className="input-apple" type="date" value={formData.departureDate} onChange={(e) => update('departureDate', e.target.value)} /></Field>
                      <Field label="Approx. departure time"><input className="input-apple" type="time" value={formData.departureTime} onChange={(e) => update('departureTime', e.target.value)} /></Field>
                    </div>
                  </section>

                  <section>
                    <h2 className="form-section-title">Stay & transport</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Accommodation required?"><select className="input-apple" value={formData.accommodation} onChange={(e) => update('accommodation', e.target.value)}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                      <Field label="Number of nights"><input className="input-apple" type="number" min="0" max="20" value={formData.nights} onChange={(e) => update('nights', e.target.value)} placeholder="If required" /></Field>
                      <Field label="Cab / local transport required?"><select className="input-apple" value={formData.cab} onChange={(e) => update('cab', e.target.value)}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                      <Field label="Pickup / drop location"><input className="input-apple" value={formData.pickupLocation} onChange={(e) => update('pickupLocation', e.target.value)} placeholder="Airport / station / hotel / other" /></Field>
                    </div>
                  </section>

                  <section>
                    <h2 className="form-section-title">Food & anything we should know</h2>
                    <Field label="Food preference"><select className="input-apple" value={formData.foodPreference} onChange={(e) => update('foodPreference', e.target.value)}><option>No special preference</option><option>Vegetarian</option><option>Jain</option><option>Vegan</option><option>Other / please mention below</option></select></Field>
                    <Field label="Other requirements" hint="Optional"><textarea className="input-apple min-h-[100px] resize-none" value={formData.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything useful for us to know?" /></Field>
                  </section>
                </>
              )}

              {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">{loading ? 'Saving your RSVP…' : 'Confirm RSVP'}</Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}

function Field({ label, hint, required, children }) {
  return <div className="space-y-2"><label className="block text-sm font-semibold text-ink">{label}{required ? ' *' : ''}</label>{hint && <p className="text-xs text-muted">{hint}</p>}{children}</div>;
}

function Choice({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className={`w-full rounded-2xl border px-4 py-4 text-left font-medium transition ${active ? 'border-maroon bg-maroon text-white shadow-apple' : 'border-apple-gray-200 bg-white text-ink hover:border-gold'}`}>{children}</button>;
}

export default RSVPPage;
