import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initTierFromUrl, displayNames } from './tier';

initTierFromUrl();
document.title = `${displayNames()} — Wedding Invitation`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
