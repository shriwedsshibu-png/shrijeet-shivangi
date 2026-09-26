import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import siteConfig from './siteConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MobileBottomNav from './components/MobileBottomNav';

const OurStory = lazy(() => import('./components/OurStory'));
const EventPage = lazy(() => import('./components/EventPage'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const UploadPhotos = lazy(() => import('./components/UploadPhotos'));
const Blessings = lazy(() => import('./components/Blessings'));
const OurFamilies = lazy(() => import('./components/OurFamilies'));
const TokenOfLove = lazy(() => import('./components/TokenOfLove'));
const Travel = lazy(() => import('./components/Travel'));
const FAQ = lazy(() => import('./components/FAQ'));
const RSVPPage = lazy(() => import('./components/RSVPPage'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center wedding-surface">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-600 mx-auto mb-4" />
      <p className="text-apple-gray-600">Loading...</p>
    </div>
  </div>
);

const routeMap = {
  ourStory: { path: '/our-story', Component: OurStory },
  events: { path: '/events', Component: EventPage },
  photoGallery: { path: '/gallery', Component: PhotoGallery },
  uploadPhotos: { path: '/upload-photos', Component: UploadPhotos },
  blessings: { path: '/blessings', Component: Blessings },
  families: { path: '/our-families', Component: OurFamilies },
  tokenOfLove: { path: '/token-of-love', Component: TokenOfLove },
  travel: { path: '/explore-vizag', Component: Travel },
  faq: { path: '/faq', Component: FAQ },
  rsvp: { path: '/rsvp', Component: RSVPPage },
};

function App() {
  const routes = Object.entries(siteConfig.features)
    .filter(([key, feature]) => feature.enabled && routeMap[key])
    .map(([key]) => {
      const { path, Component } = routeMap[key];
      return (
        <Route
          key={key}
          path={path}
          element={
            <Suspense fallback={<Loading />}>
              <Component />
            </Suspense>
          }
        />
      );
    });

  return (
    <Router>
      <div className="App flex flex-col min-h-screen wedding-surface">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {routes}
          </Routes>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    </Router>
  );
}

export default App;
