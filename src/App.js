import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PAGES } from './pages';
import siteConfig from './siteConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MobileBottomNav from './components/MobileBottomNav';
import { warmUp, prefetchGallery } from './api';
import InviteFilm, { SEEN_KEY } from './components/InviteFilm';
import { tierFromCode, codeFromPath, getTier, setTier, sideFromPath, getSide, setSide } from './tier';
import { langFromPath, getLang, setLang } from './lang';

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
  invite: InviteFilm,
};

const Loading = () => (
  <div className="page flex items-center justify-center">
    <p className="script" style={{ fontSize: '2rem', color: 'var(--maroon)' }}>Loading…</p>
  </div>
);

// First-time visitors on the main link see the invitation film once.
function FirstVisit() {
  const { pathname, search } = useLocation();
  const cfg = siteConfig.inviteFilm || {};
  let seen = true;
  try { seen = !!localStorage.getItem(SEEN_KEY); } catch (e) { seen = true; }
  if (cfg.enabled && cfg.firstVisitOnly && pathname === '/' && !seen && !/skip/.test(search)) return <Navigate to="/invite" replace />;
  return <HomePage />;
}

// /invite/<code> or /invite/<side>/<code>: remember which kind of guest this is and whose
// side invited them, then play the invitation.
function TierInvite() {
  const { pathname } = useLocation();
  const t = tierFromCode(codeFromPath(pathname));
  const sd = sideFromPath(pathname);
  const lg = langFromPath(pathname);
  const changed = (t && t !== getTier()) || (sd && sd !== getSide()) || (lg && lg !== getLang());
  if (lg) setLang(lg);
  if (sd) setSide(sd);
  if (t && t !== getTier()) setTier(t);
  if (changed) { window.location.reload(); return null; }
  return <InviteFilm />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { warmUp(); }, []);
  // a few seconds after the site opens, quietly fetch the photo list so the gallery opens instantly
  useEffect(() => { const t = setTimeout(prefetchGallery, 4000); return () => clearTimeout(t); }, []);
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
            <Route path="/" element={<FirstVisit />} />
            {routes}
            {siteConfig.features?.invite?.enabled && <Route path="/invite/:code" element={<TierInvite />} />}
            {siteConfig.features?.invite?.enabled && <Route path="/invite/:side/:code" element={<TierInvite />} />}
            {siteConfig.features?.invite?.enabled && <Route path="/invite/:side/:code/:lang" element={<TierInvite />} />}
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
