import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import { ensureInitialSeeds } from './utils/analytics';

const CURRENT_VERSION = '1.0.3'; // App version

// LocalStorage setup & seed preserve
ensureInitialSeeds();

// 3. Cache-Busting & Service Worker (Unregister stale Service Workers)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    let unregPromises = [];
    for (let registration of registrations) {
      unregPromises.push(registration.unregister());
    }
  });
}

// 4. Client-Side Security & Anti-Tampering
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.warn('🔒 GOYE Security Notice: Inspection disabled. 256-Bit SSL Encrypted.');
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's')) {
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
    <Analytics />
    <SpeedInsights />
  </StrictMode>
);

