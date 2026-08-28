const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Firebase pageView with localStorage
const trackCode = `
          const pageView = {
            ip,
            country,
            path: window.location.hash || window.location.pathname || '/',
            timestamp: new Date().toISOString()
          };
          await addDoc(collection(db, 'page_views'), pageView);
`;
const newTrackCode = `
          const pageView = {
            id: Date.now().toString(),
            ip: ip !== 'Unknown' ? ip.replace(/\\.\\d+\\.\\d+$/, '.***.***').replace(/:[0-9a-fA-F:]+$/, ':****') : ip,
            country,
            city: data.city || 'Unknown',
            flag: data.country_code ? String.fromCodePoint(...[...data.country_code.toUpperCase()].map(c => c.charCodeAt(0) + 127397)) : '🌍',
            path: window.location.hash || window.location.pathname || '/',
            timestamp: new Date().toISOString(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Phone' : 'Desktop'
          };
          
          const isAdmin = localStorage.getItem('is_admin') === 'true';
          const excludeMyClicks = localStorage.getItem('exclude_my_clicks') !== 'false'; // default true
          
          if (!(isAdmin && excludeMyClicks)) {
              let logs = JSON.parse(localStorage.getItem('traffic_log') || '[]');
              logs.unshift(pageView);
              localStorage.setItem('traffic_log', JSON.stringify(logs.slice(0, 500)));
              
              let total = parseInt(localStorage.getItem('total_clicks') || '0');
              localStorage.setItem('total_clicks', (total + 1).toString());
          }
`;
code = code.replace(trackCode, newTrackCode);

fs.writeFileSync('src/App.tsx', code);
