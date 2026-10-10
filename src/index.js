import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initTierFromUrl, displayNames } from './tier';
import { initLangFromUrl, isHi } from './lang';
import siteConfig from './siteConfig';
import { applyHindi } from './siteConfig.hi';

initLangFromUrl();
if (isHi()) applyHindi(siteConfig);   // guests who opened a Hindi invite link see the Hindi words
initTierFromUrl();
document.title = isHi() ? `${displayNames()} — शुभ विवाह निमंत्रण` : `${displayNames()} — Wedding Invitation`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
