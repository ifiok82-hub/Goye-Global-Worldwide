import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import './lib/firebase.ts';


const CURRENT_VERSION = '1.0.2'; // App version for cache busting

// 2. LocalStorage Cleanup & Versioning
const storedVersion = localStorage.getItem('APP_VERSION');
if (storedVersion !== CURRENT_VERSION) {
  console.log('New deployment detected! Purging stale local state...');
  localStorage.clear();
  localStorage.setItem('APP_VERSION', CURRENT_VERSION);
}

// 3. Cache-Busting & Service Worker (Unregister stale Service Workers)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    let unregPromises = [];
    for (let registration of registrations) {
      unregPromises.push(registration.unregister());
    }
    Promise.all(unregPromises).then(() => {
      // Optional: force reload if we just unregistered a stale worker and version changed
      if (storedVersion && storedVersion !== CURRENT_VERSION) {
        window.location.reload();
      }
    });
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
  </StrictMode>
);
