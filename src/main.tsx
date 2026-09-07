import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import { ensureInitialSeeds } from './utils/analytics';

// LocalStorage setup & seed preserve
try {
  ensureInitialSeeds();
} catch (e) {
  console.warn('Initial seeds error:', e);
}

// Service Worker cleanup
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
  } catch (e) {}
}

// Client-Side Security
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's')) {
        e.preventDefault();
      }
    });
  } catch (e) {}
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
        <Analytics />
        <SpeedInsights />
      </ErrorBoundary>
    </StrictMode>
  );
}
