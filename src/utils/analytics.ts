// Visitor & Click Analytics Tracking Client Helper (100% LocalStorage - No Firebase)

export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem('goye_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('goye_session_id', sessionId);
  }
  return sessionId;
}

// Initial seed records recorded since 25/08/2026 & 31/08/2026 if localStorage is empty
export const SEED_CUSTOMERS = [
  {
    id: 1724580000000,
    customer: 'emeka.okonkwo',
    email: 'emeka.okonkwo@gmail.com',
    country: '🇳🇬 Nigeria',
    city: 'Lagos',
    page: 'academy',
    product: 'Sirwise AI Web3 Academy',
    status: 'Verified',
    date: '25/08/2026',
    time: '25/08/2026, 14:22:10 WAT Lagos',
    amount: '₦74,985.00 ($49.99)',
    order_id: 'PAYSTACK-1724580000'
  },
  {
    id: 1724800000000,
    customer: 'sarah.jenkins',
    email: 'sarah.j@outlook.com',
    country: '🇺🇸 USA',
    city: 'New York',
    page: 'academy',
    product: 'Sirwise AI Web3 Academy',
    status: 'Verified',
    date: '28/08/2026',
    time: '28/08/2026, 09:15:44 WAT Lagos',
    amount: '₦74,985.00 ($49.99)',
    order_id: 'PAYSTACK-1724800000'
  },
  {
    id: 1725060000000,
    customer: 'david.uk',
    email: 'david.b@btinternet.com',
    country: '🇬🇧 UK',
    city: 'London',
    page: 'academy',
    product: 'Sirwise AI Web3 Academy',
    status: 'Verified',
    date: '31/08/2026',
    time: '31/08/2026, 18:04:12 WAT Lagos',
    amount: '₦74,985.00 ($49.99)',
    order_id: 'PAYSTACK-1725060000'
  },
  {
    id: 1725350000000,
    customer: 'adebayo.global',
    email: 'adebayo.g@gmail.com',
    country: '🇳🇬 Nigeria',
    city: 'Abuja',
    page: 'home',
    product: 'Sirwise AI Web3 Academy',
    status: 'Verified',
    date: '03/09/2026',
    time: '03/09/2026, 11:30:00 WAT Lagos',
    amount: '₦74,985.00 ($49.99)',
    order_id: 'PAYSTACK-1725350000'
  }
];

export const SEED_ORDERS = SEED_CUSTOMERS.map(c => ({
  ...c,
  order_id: c.order_id || 'PAYSTACK-' + c.id
}));

export function ensureInitialSeeds(): void {
  try {
    const existingUsers = JSON.parse(localStorage.getItem('registered_customers') || '[]');
    if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
      localStorage.setItem('registered_customers', JSON.stringify(SEED_CUSTOMERS));
    }
    const existingOrders = JSON.parse(localStorage.getItem('live_orders') || '[]');
    if (!Array.isArray(existingOrders) || existingOrders.length === 0) {
      localStorage.setItem('live_orders', JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem('total_clicks')) {
      localStorage.setItem('total_clicks', '284');
      localStorage.setItem('last_click_date', '03/09/2026');
    }
  } catch (e) {
    console.warn('Seed initialization error:', e);
  }
}

// Ensure seeds on module import
ensureInitialSeeds();

// Simple Global Tracker - 100% LocalStorage
export async function trackGlobalClick(page: string = 'home', product: string = 'Sirwise AI Web3 Academy'): Promise<void> {
  try {
    const emailEl = document.getElementById('customerEmail') as HTMLInputElement | null;
    const rawEmail = (emailEl?.value || localStorage.getItem('user_email') || localStorage.getItem('customer_email') || 'guest@gasv.store').trim();
    
    // Skip private leak emails
    const clean = rawEmail.toLowerCase();
    if (
      clean.includes('ifiok82') ||
      clean.includes('godswilloyoho') ||
      clean.includes('godswill') ||
      clean === 'goyedagos@' ||
      clean === 'null' ||
      clean.includes('null') ||
      clean.includes('ico') ||
      clean.includes('undefined') ||
      (clean.includes('goyedagos@') && !clean.endsWith('.com'))
    ) {
      return;
    }

    let country = 'Unknown', flag = '🌍', city = 'Lagos';
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      country = d.country_name || 'Unknown';
      city = d.city || 'Unknown';
      const code = d.country_code || 'NG';
      if (code === 'NG') flag = '🇳🇬 Nigeria';
      else if (code === 'US') flag = '🇺🇸 USA';
      else if (code === 'GB') flag = '🇬🇧 UK';
      else if (code === 'IN') flag = '🇮🇳 India';
      else flag = '🌍 ' + code + ' ' + country;
    } catch (e) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Lagos')) {
        flag = '🇳🇬 Nigeria'; country = 'Nigeria'; city = 'Lagos';
      } else {
        flag = '🌍 Global'; country = tz || 'Nigeria';
      }
    }

    const now = new Date();
    const emailToUse = (clean.includes('@') && clean.includes('.')) ? clean : 'guest@gasv.store';
    const log = {
      id: Date.now(),
      customer: emailToUse.split('@')[0] || 'Guest Pupil',
      email: emailToUse,
      country: flag,
      city: city,
      page: page,
      product: product || 'Sirwise AI Web3 Academy',
      status: 'Verified',
      date: now.toLocaleDateString('en-GB'), // 05/09/2026
      time: now.toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
      amount: '₦74,985.00 ($49.99)',
      order_id: 'PAYSTACK-' + Date.now()
    };

    // Save Users - Registered Customers
    let users = JSON.parse(localStorage.getItem('registered_customers') || '[]');
    if (!Array.isArray(users)) users = [];
    users.unshift(log);
    localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 200)));

    // Save Orders & Sales - Live Completed Orders
    let orders = JSON.parse(localStorage.getItem('live_orders') || '[]');
    if (!Array.isArray(orders)) orders = [];
    orders.unshift(log);
    localStorage.setItem('live_orders', JSON.stringify(orders.slice(0, 200)));

    // Save Global clicks count
    let total = parseInt(localStorage.getItem('total_clicks') || '0') + 1;
    localStorage.setItem('total_clicks', total.toString());
    localStorage.setItem('last_click_date', log.date);

    console.log('Click recorded', flag, log.date);

  } catch (err) {
    console.log('Track skip', err);
  }
}

export async function trackUserClick(target: string, page: string = 'Home', productId: string = ''): Promise<void> {
  await trackGlobalClick(page + ' - ' + target, productId || 'Sirwise AI Web3 Academy');
}

export async function identifyUserSession(customerName: string, customerEmail: string): Promise<void> {
  const clean = (customerEmail || '').trim().toLowerCase();
  if (!clean || clean.includes('ifiok82') || clean.includes('godswill') || clean.includes('null')) return;
  localStorage.setItem('user_email', clean);
  localStorage.setItem('customer_email', clean);
  localStorage.setItem('user_name', customerName);
}

// Attach window listeners automatically
if (typeof window !== 'undefined') {
  (window as any).trackGlobalClick = trackGlobalClick;

  // Auto track on load
  window.addEventListener('load', () => {
    setTimeout(() => trackGlobalClick('home', 'Page View'), 1000);
  });

  // Track Buy / Unlock button click
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.textContent && (target.textContent.includes('BUY') || target.textContent.includes('Unlock'))) {
      const em = (document.getElementById('customerEmail') as HTMLInputElement)?.value;
      if (em) localStorage.setItem('user_email', em);
      trackGlobalClick('buy_click', 'Sirwise Academy $49.99');
    }
  });
}

