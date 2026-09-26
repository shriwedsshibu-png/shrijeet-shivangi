import React from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../siteConfig';
import Countdown from './ui/Countdown';
import Card from './ui/Card';
import Button from './ui/Button';

function HomePage() {
  const actions = [
    { path: '/rsvp', icon: '💌', title: 'Confirm You Are Coming', text: 'Tell us who is joining, and help us plan rooms, meals and cabs.', primary: true },
    { path: '/upload-photos', icon: '📸', title: 'Share Your Moments', text: 'Choose the celebration and upload your photographs.' },
    { path: '/blessings', icon: '🙏', title: 'Digital Blessings', text: 'Leave a message, blessing or good wish for us.' },
    { path: '/token-of-love', icon: '💝', title: 'A Token of Love', text: 'If you wish, bless us with a shagun or gift.' },
  ];

  const exploreLinks = [
    ['Our Story', '/our-story'], ['Events', '/events'], ['Gallery', '/gallery'],
    ['Our Families', '/our-families'], ['Explore Vizag', '/explore-vizag'], ['FAQ', '/faq'],
  ];

  return (
    <main className="min-h-screen">
      <section className="hero relative min-h-[94vh] flex items-center justify-center" style={{ backgroundImage: `url(${siteConfig.homepage.backgroundImage})` }}>
        <div className="hero-overlay" />
        <div className="relative z-10 text-center text-white px-5 max-w-5xl pt-20">
          <p className="eyebrow hero-eyebrow">With the blessings of our families</p>
          <h1 className="font-script hero-couple-name">{siteConfig.homepage.title}</h1>
          <p className="font-display text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed text-white/95">{siteConfig.homepage.subtitle}</p>
          <p className="hero-date-line mt-5 text-sm sm:text-base tracking-[0.18em] uppercase text-white">30 Nov – 02 Dec 2026 · Visakhapatnam</p>

          {siteConfig.homepage.showCountdown && (
            <div className="mt-8 mb-8">
              <p className="text-sm uppercase tracking-[0.18em] text-white/85 mb-3">Counting down to the wedding ceremony · 02 Dec · 09:00 PM</p>
              <Countdown targetDate={siteConfig.wedding.date} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/rsvp"><Button variant="primary" size="lg" className="hero-primary-button">Confirm RSVP</Button></Link>
            <Link to="/upload-photos"><Button variant="secondary" size="lg">Share Your Moments</Button></Link>
          </div>
        </div>
      </section>

      <section className="wedding-surface py-14 sm:py-20">
        <div className="section-container">
          <div className="text-center mb-9">
            <p className="eyebrow">Please join us</p>
            <h2 className="section-title">Be a part of our celebrations</h2>
            <p className="section-subtitle">RSVP, share photographs, leave your blessings or send a shagun — all in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {actions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className={`action-card p-6 sm:p-7 h-full text-center ${action.primary ? 'action-card-primary' : ''}`}>
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-2xl font-display font-semibold text-ink mb-2">{action.title}</h3>
                  <p className="text-muted leading-relaxed">{action.text}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="eyebrow">The celebrations</p>
            <h2 className="section-title">Five moments, one beautiful beginning.</h2>
            <p className="section-subtitle !text-left !mx-0">From Faldaan to the wedding ceremony, find the complete sequence, timings and venue details on the Events page.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/events"><Button variant="primary">View Events</Button></Link><Link to="/gallery"><Button variant="secondary">View Gallery</Button></Link></div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-apple-lg">
            <img src="/images/our2.jpg" alt="Shivangi and Shrijeet" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="wedding-surface py-12 sm:py-16 border-y border-apple-gray-200">
        <div className="section-container">
          <div className="text-center mb-8"><p className="eyebrow">Explore the website</p><h2 className="section-title text-4xl sm:text-5xl">More from our wedding hub</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {exploreLinks.map(([label, path]) => <Link key={path} to={path} className="homepage-link-card">{label}<span>→</span></Link>)}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
