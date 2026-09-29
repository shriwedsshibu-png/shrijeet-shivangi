import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PAGES } from './pages';
import siteConfig from './siteConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MobileBottomNav from './components/MobileBottomNav';
import { warmUp } from './api';

const OurStory = lazy(() => import('./components/OurStory'));
const EventPage = lazy(() => import('./components/EventPage'));
const Photos = lazy(() => import('./components/Photos'));
const Blessings = lazy(() => import('./components/Blessings'));
const OurFamilies = lazy(() => import('./components/OurFamilies'));
const Travel = lazy(() => import('./components/Travel'));
const FAQ = lazy(() => import('./components/FAQ'));
const RSVPPage = lazy(() => import('./components/RSVPPage'));

const components = {
  ourStory: OurStory,
  events: EventPage,
  photos: Photos,
  blessings: Blessings,
  families: OurFamilies,
  travel: Travel,
  faq: FAQ,
  rsvp: RSVPPage,
};

const Loading = () => (
  <div className="page flex items-center justify-center">
    <p className="script" style={{ fontSize: '2rem', color: 'var(--maroon)' }}>Loading…</p>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { warmUp(); }, []);
  return null;
}

// Old links from earlier versions of the site keep working
const legacy = [
  ['/gallery', '/photos'],
  ['/upload-photos', '/photos'],
  ['/token-of-love', '/blessings'],
];

export default function App() {
  const routes = PAGES.filter((p) => siteConfig.features?.[p.key]?.enabled).map((p) => {
    const Component = components[p.key];
    return <Route key={p.key} path={p.path} element={<Suspense fallback={<Loading />}><Component /></Suspense>} />;
  });

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {routes}
            {legacy.map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    </Router>
  );
}
