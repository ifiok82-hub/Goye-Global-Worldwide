const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace("import {defineConfig} from 'vite';", "import {defineConfig} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';");
code = code.replace("plugins: [react(), tailwindcss()],", "plugins: [\n      react(), \n      tailwindcss(),\n      VitePWA({\n        registerType: 'autoUpdate',\n        devOptions: {\n          enabled: true\n        },\n        manifest: {\n          name: 'GOYE Store Global',\n          short_name: 'GOYE',\n          description: '100% Digital Products Store',\n          theme_color: '#000000',\n          background_color: '#000000',\n          display: 'standalone',\n          icons: [\n            {\n              src: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" width=\"200\" height=\"200\"><circle cx=\"100\" cy=\"100\" r=\"96\" fill=\"#000000\" stroke=\"#FFD700\" stroke-width=\"6\"/></svg>`),\n              sizes: '192x192',\n              type: 'image/svg+xml',\n              purpose: 'any maskable'\n            }\n          ]\n        }\n      })\n    ],");

fs.writeFileSync('vite.config.ts', code);
