import siteConfig from './siteConfig';
import { pageHidden } from './tier';
import { L } from './lang';

// Order here = order in the menu. "bottom" pages also get a big button on the phone's bottom bar.
export const PAGES = [
  { key: 'events', path: '/events', icon: 'calendar', bottom: true, short: 'Events', shortHi: 'कार्यक्रम' },
  { key: 'rsvp', path: '/rsvp', icon: 'mail', bottom: true, short: 'RSVP', shortHi: 'पुष्टि' },
  { key: 'photos', path: '/photos', icon: 'camera', bottom: true, short: 'Photos', shortHi: 'फ़ोटो' },
  { key: 'blessings', path: '/blessings', icon: 'heart', bottom: true, short: 'Blessings', shortHi: 'आशीर्वाद' },
  { key: 'ourStory', path: '/our-story', icon: 'book', bottom: false, short: 'Story' },
  { key: 'families', path: '/our-families', icon: 'users', bottom: false, short: 'Families' },
  { key: 'invite', path: '/invite', icon: 'mail', bottom: false, short: 'Invitation' },
  { key: 'travel', path: '/explore-vizag', icon: 'compass', bottom: false, short: 'Vizag' },
  { key: 'faq', path: '/faq', icon: 'help', bottom: false, short: 'FAQ' },
];

export const enabledPages = () =>
  PAGES.filter((p) => siteConfig.features?.[p.key]?.enabled && !pageHidden(p.key)).map((p) => ({
    ...p,
    short: L(p.short, p.shortHi),
    label: siteConfig.features[p.key].label || p.short,
  }));
