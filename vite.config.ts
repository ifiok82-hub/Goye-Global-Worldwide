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
          name: 'GOYE Store Global',
          short_name: 'GOYE',
          description: '100% Digital Products Store',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            {
              src: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#000000" stroke="#FFD700" stroke-width="6"/></svg>`),
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
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
