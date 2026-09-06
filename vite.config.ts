import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'disable-preview-hmr-client',
        enforce: 'post',
        transformIndexHtml(html: string) {
          return html
            .replace(/<script[^>]+src=["']\/@vite\/client["'][^>]*><\/script>\s*/g, '')
            .replace(/<script[^>]+type=["']module["'][^>]*>\s*import\s+\{\s*injectIntoGlobalHook[\s\S]*?<\/script>\s*/g, '')
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        workbox: { maximumFileSizeToCacheInBytes: 5000000 },
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'Goye Global Sirwise AI WEB3 Academy',
          short_name: 'GOYE Store Global',
          description: 'GOYE Global Worldwide RC BN3583773 - Sirwise AI WEB3 Academy - 100% Digital Products Store - 190+ Countries - GCV $314,159',
          theme_color: '#FFD700',
          background_color: '#FF00FF',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The preview server is mounted behind Express without Vite's WebSocket
      // upgrade handler, so the injected HMR client cannot connect reliably.
      hmr: false,
      watch: null,
      proxy: {
        '/api': 'http://localhost:3000'
      }
    },
  };
});
