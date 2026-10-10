import React from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../siteConfig';
import Countdown from './Countdown';
import Icon from '../icons';
import { Card, ButtonLink, Divider } from './ui';
import { isFeatureOn, sortedEvents, dayAndMonth, evName, evTime } from '../utils';
import { L } from '../lang';
import { dateLine, isFullTier, coupleOrder, groomFirst } from '../tier';

function ActionCard({ to, icon, title, text }) {
  return (
    <Link to={to} className="card flex items-center gap-4 no-underline" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="grid place-items-center flex-none rounded-full" style={{ width: '3.6rem', height: '3.6rem', background: 'linear-gradient(180deg,#2c4a6e,#1f3350)', color: '#f1d68e', border: '1.5px solid var(--gold)' }}>
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
  const { homepage: hp, wedding } = siteConfig;
  const [n1, n2] = coupleOrder();   // Shrijeet's guests see Shrijeet first
  // the same opening words as the guest's invite (Shrijeet's side: Dadi's request)
  const card = groomFirst() ? { ...(hp.inviteCard || {}), ...((hp.inviteCard || {}).groomSide || {}) } : (hp.inviteCard || {});
  const invitationTop = card.blessingsLabel && card.request ? `${card.blessingsLabel}, ${card.request}` : hp.invitationTop;
  const events = sortedEvents();
  const photoHero = hp.heroStyle === 'photo';

  return (
    <main>
      {/* ---------- Invitation ---------- */}
      <section className={`hero ${photoHero ? 'hero-photo' : 'hero-night'}`} style={photoHero ? { backgroundImage: `linear-gradient(180deg, rgba(22,38,61,.15) 0%, rgba(22,38,61,.25) 30%, rgba(22,38,61,.9) 62%, rgba(22,38,61,.95) 100%), url(${hp.heroImage})` } : { backgroundImage: `url(${hp.heroBackground || '/images/invite/finale.jpg'})` }}>
        <div className="relative wrap-narrow fade-in hero-in">
          {hp.invocation && <p className="deva hero-inv">{hp.invocation}</p>}

          {!photoHero && <div className="arch"><img src={hp.heroImage} alt={L(`${n1.short} and ${n2.short}, watercolour illustration`, `${n1.short} एवं ${n2.short}`)} /></div>}

          <p className="hero-text">{invitationTop}</p>
          <h1 className="hero-names">
            {n1.full}
            <span className="hero-amp">{L('&', 'संग')}</span>
            {n2.full}
          </h1>
          <p className="hero-text hero-text2">{card.closing ? `${card.closing} ` : ''}{hp.invitationBottom}</p>

          <div className="hero-date">
            <span className="hero-date1">{dateLine()}</span>
            <span className="hero-date2">{wedding.city}</span>
          </div>

          {hp.welcomeHindi && <p className="deva hero-wel">{hp.welcomeHindi}</p>}

          <div className="hero-btns">
            {isFeatureOn('rsvp') && <ButtonLink to="/rsvp" variant="gold">{L('Confirm Your Presence', 'अपने आने की पुष्टि करें')}</ButtonLink>}
            {isFeatureOn('photos') && <ButtonLink to="/photos" variant="light">{L('Share Your Photos', 'अपनी फ़ोटो भेजें')}</ButtonLink>}
            {siteConfig.inviteFilm?.enabled && siteConfig.inviteFilm?.homeButton && <ButtonLink to="/invite" variant="light">{L('▶ Watch the Invitation', '▶ निमंत्रण देखें')}</ButtonLink>}
          </div>
        </div>
      </section>

      {/* ---------- Countdown ---------- */}
      <section className="wrap text-center" style={{ padding: '3rem 1.1rem 1.5rem' }}>
        {hp.countdownTitle && <p className="eyebrow">{hp.countdownTitle}</p>}
        <h2 className="h-title mt-2" style={{ fontSize: 'clamp(2rem,7vw,3rem)' }}>{L('Our forever begins in', 'शुभ घड़ी में शेष')}</h2>
        <div className="mt-6"><Countdown target={wedding.countdownTo} /></div>
        <p className="font-display italic mt-6" style={{ fontSize: '1.4rem', color: 'var(--maroon)' }}>{hp.countdownPoem}</p>
      </section>

      {/* ---------- Quick actions ---------- */}
      <section className="wrap-narrow" style={{ padding: '1.5rem 1.1rem' }}>
        <Divider />
        <div className="grid gap-4 mt-6">
          {isFeatureOn('rsvp') && <ActionCard to="/rsvp" icon="mail" title={L('RSVP', 'आने की पुष्टि')} text={L('Tell us you are coming, and help us welcome you well.', 'बताइए कि आप आ रहे हैं, ताकि हम आपका अच्छे से स्वागत कर सकें।')} />}
          {isFeatureOn('photos') && <ActionCard to="/photos" icon="camera" title={L('Photos', 'फ़ोटो')} text={L('Share your photos and find your own with a selfie.', 'अपनी फ़ोटो भेजें और एक सेल्फ़ी से अपनी फ़ोटो ढूँढें।')} />}
          {isFeatureOn('blessings') && <ActionCard to="/blessings" icon="heart" title={L('Digital Blessings', 'आशीर्वाद')} text={L('Leave your blessings and good wishes for us.', 'हमारे लिए अपना आशीर्वाद और शुभकामनाएँ लिखें।')} />}
        </div>
      </section>

      {/* ---------- Celebrations preview ---------- */}
      {isFeatureOn('events') && (
        <section className="wrap-narrow" style={{ padding: '2rem 1.1rem' }}>
          <div className="text-center mb-6">
            <p className="eyebrow">{L('The celebrations', 'समारोह')}</p>
            <h2 className="h-title mt-2" style={{ fontSize: 'clamp(2rem,7vw,3rem)' }}>{isFullTier() ? L('Our celebrations', 'हमारे समारोह') : L('The wedding', 'शुभ विवाह')}</h2>
          </div>
          <Card>
            <ul className="divide-y" style={{ borderColor: 'rgba(184,137,59,.3)' }}>
              {events.map((e) => {
                const d = dayAndMonth(e.date);
                return (
                  <li key={e.id} className="flex items-center gap-4 py-3" style={{ borderColor: 'rgba(184,137,59,.3)' }}>
                    <span className="date-badge" style={{ width: '3.6rem', padding: '.35rem .1rem' }}><b style={{ fontSize: '1.5rem' }}>{d.day}</b><span>{d.month}</span></span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold" style={{ fontSize: '1.45rem', color: 'var(--maroon)', lineHeight: 1.1 }}>{evName(e)}</span>
                      <span className="block text-muted" style={{ fontSize: '.95rem' }}>{evTime(e)}{e.dateNote ? ` · ${e.dateNote}` : ''}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="text-center mt-4"><ButtonLink to="/events" variant="ghost">{L('Full details & maps', 'पूरी जानकारी एवं नक्शा')}</ButtonLink></div>
          </Card>
        </section>
      )}

      {/* ---------- Venue ---------- */}
      <section className="wrap-narrow text-center" style={{ padding: '1rem 1.1rem 2rem' }}>
        <Card>
          <p className="eyebrow">{L('Where we celebrate', 'विवाह स्थल')}</p>
          <h2 className="h-title mt-2" style={{ fontSize: '2.2rem' }}>{wedding.venueName}</h2>
          <p className="text-muted mt-1">{wedding.city}, {L('Andhra Pradesh', 'आंध्र प्रदेश')}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonLink href={wedding.mapLink} variant="primary"><Icon name="pin" size={20} /> {L('Open in Google Maps', 'गूगल मैप में देखें')}</ButtonLink>
            {isFeatureOn('travel') && <ButtonLink to="/explore-vizag" variant="ghost">{L('Where to stay', 'कहाँ ठहरें')}</ButtonLink>}
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
