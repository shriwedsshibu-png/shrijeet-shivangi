import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import siteConfig from '../siteConfig';
import { Card, Button, Field, Notice, PageHeader, Divider } from './ui';
import Icon from '../icons';
import { submitBlessing, backendReady, NOT_READY_MESSAGE } from '../api';
import { copyText, getDeviceId, loadSaved, save } from '../utils';

const SAVE_KEY = 'wedding_blessing_v1';

function BlessingCard() {
  const cfg = siteConfig.blessings;
  const saved = loadSaved(SAVE_KEY);
  const [name, setName] = useState(saved?.name || '');
  const [message, setMessage] = useState(saved?.message || '');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !message.trim()) { setError('Please write your name and your blessing.'); return; }
    setLoading(true);
    try {
      await submitBlessing({ name, message, deviceId: getDeviceId() });
      save(SAVE_KEY, { name, message });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not send your blessing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="form-title flex items-center gap-2"><Icon name="heart" size={26} /> {cfg.blessingHeading}</h2>
      {done ? (
        <div className="text-center py-6 fade-in">
          <div style={{ fontSize: '3rem' }}>🙏</div>
          <h3 className="script mt-2" style={{ fontSize: '2.8rem', color: 'var(--maroon)', lineHeight: 1.1 }}>Thank you</h3>
          <p className="mt-2 text-muted">Your blessing has reached us. We will treasure your words forever.</p>
          <div className="mt-5"><Button variant="ghost" onClick={() => setDone(false)}>Edit my blessing</Button></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <p className="text-muted">{cfg.blessingHint}</p>
          <Field label="Your name" required>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </Field>
          <Field label="Your blessing" required>
            <textarea className="input" style={{ minHeight: '9rem' }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your good wishes or prayers here…" />
          </Field>
          {!backendReady() && <Notice kind="info">{NOT_READY_MESSAGE}</Notice>}
          {error && <Notice kind="error">{error}</Notice>}
          <Button type="submit" variant="primary" block disabled={loading || !backendReady()}>{loading ? 'Sending…' : saved ? 'Update my blessing' : 'Send my blessing'}</Button>
        </form>
      )}
    </Card>
  );
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function ShagunCard() {
  const s = siteConfig.shagun;
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState(s.qrImage || '');
  const ios = useMemo(() => isIOS(), []);

  const query = useMemo(() => {
    let q = `pa=${s.upiId}&pn=${encodeURIComponent(s.payeeName)}&cu=INR`;
    if (s.note) q += `&tn=${encodeURIComponent(s.note)}`;
    return q;
  }, [s]);
  const upiLink = `upi://pay?${query}`;

  useEffect(() => {
    if (s.qrImage) return undefined;
    let alive = true;
    QRCode.toDataURL(upiLink, { width: 480, margin: 2, color: { dark: '#4a1120', light: '#ffffff' } })
      .then((url) => { if (alive) setQr(url); })
      .catch(() => {});
    return () => { alive = false; };
  }, [upiLink, s.qrImage]);

  const copy = async () => {
    const ok = await copyText(s.upiId);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  return (
    <Card id="shagun" className="text-center">
      <h2 className="form-title flex items-center justify-center gap-2"><Icon name="phone" size={26} /> {s.heading}</h2>
      <p className="font-display font-bold" style={{ fontSize: '1.5rem', color: 'var(--gold-deep, #8f6a26)', lineHeight: 1.25 }}>{s.optionalNote}</p>

      <div className="mt-6 grid gap-3">
        <a className="btn btn-primary btn-block" style={{ minHeight: '3.6rem', fontSize: '1.12rem' }} href={upiLink}>Pay by UPI</a>
        <p className="hint" style={{ margin: 0 }}>Tap the button, choose your UPI app (GPay, PhonePe, Paytm, BHIM…), type any amount and send.</p>
        {ios && (
          <div className="grid grid-cols-3 gap-2">
            <a className="btn btn-ghost" style={{ padding: '.4rem', fontSize: '.9rem' }} href={`gpay://upi/pay?${query}`}>GPay</a>
            <a className="btn btn-ghost" style={{ padding: '.4rem', fontSize: '.9rem' }} href={`phonepe://pay?${query}`}>PhonePe</a>
            <a className="btn btn-ghost" style={{ padding: '.4rem', fontSize: '.9rem' }} href={`paytmmp://pay?${query}`}>Paytm</a>
          </div>
        )}
      </div>

      <Divider symbol="or" />

      <div className="mx-auto" style={{ maxWidth: '20rem' }}>
        <p className="label" style={{ textAlign: 'center' }}>Copy our UPI ID</p>
        <div className="flex items-center gap-2 rounded-2xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,137,59,.5)', padding: '.5rem .5rem .5rem 1rem' }}>
          <span className="flex-1 font-bold select-all break-all text-left" style={{ fontSize: '1.05rem' }}>{s.upiId}</span>
          <button onClick={copy} className="btn btn-primary" style={{ minHeight: '2.8rem', padding: '.3rem 1rem', fontSize: '.95rem' }} aria-label="Copy UPI ID">
            <Icon name={copied ? 'check' : 'copy'} size={18} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {qr && (
        <div className="mt-7">
          <p className="label" style={{ textAlign: 'center' }}>Or scan this QR from any UPI app</p>
          <img src={qr} alt={`UPI QR code for ${s.payeeName}`} className="mx-auto" style={{ width: '13rem', height: '13rem', borderRadius: '1rem', border: '1px solid rgba(184,137,59,.5)', padding: '.5rem', background: '#fff' }} />
        </div>
      )}
    </Card>
  );
}

export default function Blessings() {
  const cfg = siteConfig.blessings;
  return (
    <main className="page">
      <div className="wrap-narrow">
        <PageHeader eyebrow="With love" title={cfg.title} subtitle={cfg.subtitle} />
        <div className="grid gap-7">
          <BlessingCard />
          <ShagunCard />
        </div>
      </div>
    </main>
  );
}
