import React from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../siteConfig';
import Countdown from './Countdown';
import Icon from '../icons';
import { Card, ButtonLink, Divider } from './ui';
import { isFeatureOn, sortedEvents, dayAndMonth } from '../utils';

function ActionCard({ to, icon, title, text }) {
  return (
    <Link to={to} className="card flex items-center gap-4 no-underline" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="grid place-items-center flex-none rounded-full" style={{ width: '3.6rem', height: '3.6rem', background: 'linear-gradient(180deg,#7d2231,#4a1120)', color: '#ffe2a3', border: '1.5px solid var(--gold)' }}>
        <Icon name={icon} size={28} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-display font-bold" style={{ fontSize: '1.6rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{title}</span>
        <span className="block text-muted" style={{ fontSize: '.98rem' }}>{text}</span>
      </span>
      <Icon name="chevronRight" size={26} className="flex-none" />
    </Link>
  );
}

export default function HomePage() {
  const { homepage: hp, wedding, couple } = siteConfig;
  const events = sortedEvents();
  const photoHero = hp.heroStyle === 'photo';

  return (
    <main>
      {/* ---------- Invitation ---------- */}
      <section className={`hero ${photoHero ? 'hero-photo' : ''}`} style={photoHero ? { backgroundImage: `linear-gradient(180deg, rgba(50,10,22,.15) 0%, rgba(50,10,22,.25) 30%, rgba(40,8,18,.9) 62%, rgba(40,8,18,.95) 100%), url(${hp.heroImage})` } : undefined}>
        {!photoHero && <div className="hero-pattern" />}
        <div className="hero-toran" />
        <div className="relative wrap-narrow fade-in">
          {hp.invocation && <p className="deva" style={{ color: '#e7cf98', fontSize: '1.15rem', marginBottom: '1.2rem' }}>{hp.invocation}</p>}

          {!photoHero && <div className="arch"><img src="/images/our2.jpg" alt={`${couple.name1} and ${couple.name2}`} /></div>}

          <p className="hero-text">{hp.invitationTop}</p>
          <h1 className="hero-names mt-2">
            {couple.name1}
            <span className="hero-amp">&amp;</span>
            {couple.name2}
          </h1>
          <p className="hero-text mt-3">{hp.invitationBottom}</p>

          <div className="hero-date">
            <span className="font-display font-bold" style={{ fontSize: '1.6rem', color: '#ffe2a3', lineHeight: 1.1 }}>{wedding.dateLine}</span>
            <span style={{ color: '#f1e2c4', fontSize: '1.05rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>{wedding.city}</span>
          </div>

          {hp.welcomeHindi && <p className="deva mt-5" style={{ color: '#e7cf98', fontSize: '1.1rem' }}>{hp.welcomeHindi}</p>}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            {isFeatureOn('rsvp') && <ButtonLink to="/rsvp" variant="gold">Confirm Your Presence</ButtonLink>}
            {isFeatureOn('photos') && <ButtonLink to="/photos" variant="light">Share Your Photos</ButtonLink>}
          </div>
        </div>
      </section>

      {/* ---------- Countdown ---------- */}
      <section className="wrap text-center" style={{ padding: '3rem 1.1rem 1.5rem' }}>
        <p className="eyebrow">{hp.countdownTitle}</p>
        <h2 className="h-title mt-2" style={{ fontSize: 'clamp(2rem,7vw,3rem)' }}>Our forever begins in</h2>
        <div className="mt-6"><Countdown target={wedding.countdownTo} /></div>
        <p className="font-display italic mt-6" style={{ fontSize: '1.4rem', color: 'var(--maroon)' }}>{hp.countdownPoem}</p>
      </section>

      {/* ---------- Quick actions ---------- */}
      <section className="wrap-narrow" style={{ padding: '1.5rem 1.1rem' }}>
        <Divider />
        <div className="grid gap-4 mt-6">
          {isFeatureOn('rsvp') && <ActionCard to="/rsvp" icon="mail" title="RSVP" text="Tell us you are coming, and help us welcome you well." />}
          {isFeatureOn('photos') && <ActionCard to="/photos" icon="camera" title="Photos" text="Share your photos and find your own with a selfie." />}
          {isFeatureOn('blessings') && <ActionCard to="/blessings" icon="heart" title="Digital Blessings" text="Leave your blessings and good wishes for us." />}
        </div>
      </section>

      {/* ---------- Celebrations preview ---------- */}
      {isFeatureOn('events') && (
        <section className="wrap-narrow" style={{ padding: '2rem 1.1rem' }}>
          <div className="text-center mb-6">
            <p className="eyebrow">The celebrations</p>
            <h2 className="h-title mt-2" style={{ fontSize: 'clamp(2rem,7vw,3rem)' }}>Our celebrations</h2>
          </div>
          <Card>
            <ul className="divide-y" style={{ borderColor: 'rgba(184,137,59,.3)' }}>
              {events.map((e) => {
                const d = dayAndMonth(e.date);
                return (
                  <li key={e.id} className="flex items-center gap-4 py-3" style={{ borderColor: 'rgba(184,137,59,.3)' }}>
                    <span className="date-badge" style={{ width: '3.6rem', padding: '.35rem .1rem' }}><b style={{ fontSize: '1.5rem' }}>{d.day}</b><span>{d.month}</span></span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold" style={{ fontSize: '1.45rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{e.name}</span>
                      <span className="block text-muted" style={{ fontSize: '.95rem' }}>{e.time}{e.dateNote ? ` · ${e.dateNote}` : ''}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="text-center mt-4"><ButtonLink to="/events" variant="ghost">Full details &amp; maps</ButtonLink></div>
          </Card>
        </section>
      )}

      {/* ---------- Venue ---------- */}
      <section className="wrap-narrow text-center" style={{ padding: '1rem 1.1rem 2rem' }}>
        <Card>
          <p className="eyebrow">Where we celebrate</p>
          <h2 className="h-title mt-2" style={{ fontSize: '2.2rem' }}>{wedding.venueName}</h2>
          <p className="text-muted mt-1">{wedding.city}, Andhra Pradesh</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonLink href={wedding.mapLink} variant="primary"><Icon name="pin" size={20} /> Open in Google Maps</ButtonLink>
            {isFeatureOn('travel') && <ButtonLink to="/explore-vizag" variant="ghost">Where to stay</ButtonLink>}
          </div>
        </Card>
      </section>

      {/* ---------- Story teaser (hidden automatically if the page is switched off) ---------- */}
      {isFeatureOn('ourStory') && (
        <section className="wrap-narrow text-center" style={{ padding: '0 1.1rem 3rem' }}>
          <Divider />
          <p className="font-display italic mt-4" style={{ fontSize: '1.45rem', color: 'var(--maroon)' }}>“From a basketball court to forever.”</p>
          <div className="mt-4"><ButtonLink to="/our-story" variant="ghost">Read Our Story</ButtonLink></div>
        </section>
      )}
    </main>
  );
}
