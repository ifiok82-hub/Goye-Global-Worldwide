const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const enhancedPush = `  const handlePushNotification = async () => {
    if (!('Notification' in window)) {
      showToast('Push notifications are not supported in this browser.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            registration.showNotification('GOYE Global Store', {
              body: 'Welcome to GOYE! You are now subscribed to updates.',
              icon: '/logo.png',
              badge: '/logo.png',
              vibrate: [200, 100, 200]
            });
          }
        } else {
          new Notification('GOYE Global Store', {
            body: 'Welcome! You are now subscribed to updates.',
            icon: '/logo.png'
          });
        }
        showToast('Push notifications enabled!');
      } else {
        showToast('Notification permission denied.');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to enable notifications.');
    }
  };`;

if (code.includes('const handlePushNotification = () => {')) {
  // Regex replace the old function block
  const regex = /const handlePushNotification = \(\) => \{[\s\S]*?(?=\n  const )/;
  code = code.replace(regex, enhancedPush + '\n');
  fs.writeFileSync(file, code);
  console.log("Patched Push");
} else {
  console.log("Push function not found or already changed");
}
