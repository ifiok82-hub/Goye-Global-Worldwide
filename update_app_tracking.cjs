const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const trackingLogic = `
  useEffect(() => {
    // Analytics Page View Tracker
    const trackPageView = async () => {
      try {
        if (!sessionStorage.getItem('session_tracked')) {
          sessionStorage.setItem('session_tracked', 'true');
          
          let country = 'Unknown';
          let ip = 'Unknown';
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            country = data.country_code || data.country_name || 'Unknown';
            ip = data.ip || 'Unknown';
          } catch(e) {}
          
          const pageView = {
            ip,
            country,
            path: window.location.hash || window.location.pathname || '/',
            timestamp: new Date().toISOString()
          };
          await addDoc(collection(db, 'page_views'), pageView);
        }
      } catch (e) {
        console.error('Page view tracking error', e);
      }
    };
    trackPageView();
`;

code = code.replace("useEffect(() => {\n    // 1. Firebase Real-time listeners (onSnapshot)", trackingLogic + "\n    // 1. Firebase Real-time listeners (onSnapshot)");

fs.writeFileSync('src/App.tsx', code);
