import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../siteConfig';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const routes = {
    ourStory: '/our-story',
    events: '/events',
    photoGallery: '/gallery',
    uploadPhotos: '/upload-photos',
    blessings: '/blessings',
    families: '/our-families',
    tokenOfLove: '/token-of-love',
    travel: '/explore-vizag',
    faq: '/faq',
  };

  const navLinks = Object.entries(siteConfig.features)
    .filter(([key, feature]) => feature.enabled && key !== 'homepage' && routes[key])
    .map(([key, feature]) => ({ key, path: routes[key], label: feature.label }));

  const isActive = (path) => location.pathname === path;
  const navText = scrolled ? 'text-apple-gray-900' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/95 backdrop-blur-apple shadow-apple' : 'bg-maroon/75 backdrop-blur-apple'}`}>
      <div className="section-container">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className={`font-script text-2xl lg:text-3xl ${navText}`}>
            {siteConfig.couple.displayName}
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 ${navText}`} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-gold font-semibold' : `${navText} opacity-85 hover:opacity-100`}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {isOpen && (
          <div className={`lg:hidden pb-5 space-y-1 ${scrolled ? 'text-apple-gray-900' : 'text-white'}`}>
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg">Home</Link>
            {navLinks.map((link) => (
              <Link key={link.key} to={link.path} onClick={() => setIsOpen(false)} className={`block py-2 px-3 rounded-lg ${isActive(link.path) ? 'bg-maroon/10 text-maroon font-semibold' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
