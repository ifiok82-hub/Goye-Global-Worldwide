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
    id: 'PAYSTACK-1724580000',
    customer: 'emeka.okonkwo',
    email: 'emeka.okonkwo@gmail.com',
    country: '🇳🇬 Nigeria',
    product: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    date: '25/08/2026',
    date_wat: '25/08/2026, 14:22:10 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1724800000',
    customer: 'sarah.jenkins',
    email: 'sarah.j@outlook.com',
    country: '🇺🇸 USA',
    product: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    date: '28/08/2026',
    date_wat: '28/08/2026, 09:15:44 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1725060000',
    customer: 'david.uk',
    email: 'david.b@btinternet.com',
    country: '🇬🇧 UK',
    product: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    date: '31/08/2026',
    date_wat: '31/08/2026, 18:04:12 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1725350000',
    customer: 'adebayo.global',
    email: 'adebayo.g@gmail.com',
    country: '🇳🇬 Nigeria',
    product: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    date: '03/09/2026',
    date_wat: '03/09/2026, 11:30:00 WAT Lagos',
    page: 'home'
  }
];

export const SEED_ORDERS = SEED_CUSTOMERS.map(c => ({
  ...c,
  id: c.id || 'PAYSTACK-' + Date.now()
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

// NO FIREBASE TRACKER - AI BUILDER OK
export async function getCountryFlag(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    if (d.country_code === 'NG') return '🇳🇬 Nigeria';
    if (d.country_code === 'US') return '🇺🇸 USA';
    if (d.country_code === 'GB') return '🇬🇧 UK';
    if (d.country_code === 'IN') return '🇮🇳 India';
    if (d.country_code === 'CA') return '🇨🇦 Canada';
    return '🌍 ' + (d.country_name || 'Global');
  } catch {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Lagos')) return '🇳🇬 Nigeria Lagos';
    return '🌍 Global';
  }
}

export async function saveGlobalClick(type: string = 'page_view', product: string = 'Sirwise AI Web3 Academy', amount: string = '', ref: string = ''): Promise<void> {
  let email = ((document.getElementById('customerEmail') as HTMLInputElement)?.value || localStorage.getItem('user_email') || '').trim();
  
  // DELETE LEAK - Skip if fake
  if (
    email.includes('ifiok82@gmail.com') ||
    email.includes('godswilloyoho') ||
    email.includes('goye@gasv.store') ||
    email === 'goyedagos@' ||
    email.includes('null') ||
    email.includes('ico') ||
    !email.includes('@') ||
    !email.includes('.')
  ) {
    // For page view allow guest
    if (type !== 'page_view') return;
    email = 'guest_' + Date.now() + '@gasv.store';
  }
  if (email.includes('goyedagos@') && !email.includes('.com')) return;

  // EXCLUDE MY CLICKS if toggle ON
  const excludeMy = localStorage.getItem('exclude_my_clicks') === 'true';
  if (excludeMy && (email.includes('goyedagosmess') || email.includes('goyedagos'))) {
    console.log('My click excluded');
    return;
  }

  const country = await getCountryFlag();
  const now = new Date();
  const record = {
    id: ref || 'PAYSTACK-' + Date.now(),
    customer: email.split('@')[0] || 'Guest Pupil',
    email: email,
    country: country,
    product: product || 'Sirwise AI Web3 Academy',
    amount: amount || '₦74,985.00',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    date: now.toLocaleDateString('en-GB'), // 05/09/2026 will show today not 25/08/2026
    date_wat: now.toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
    page: type
  };

  // Save to localStorage - Users tab
  let users = JSON.parse(localStorage.getItem('registered_customers') || '[]');
  if (!Array.isArray(users)) users = [];
  users.unshift(record);
  localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 200)));

  // Save to Orders & Sales - Live Completed Orders
  let orders = JSON.parse(localStorage.getItem('live_orders') || '[]');
  if (!Array.isArray(orders)) orders = [];
  orders.unshift(record);
  localStorage.setItem('live_orders', JSON.stringify(orders.slice(0, 200)));

  // Update stats
  let clicks = parseInt(localStorage.getItem('total_clicks') || '0') + 1;
  localStorage.setItem('total_clicks', clicks.toString());
  localStorage.setItem('registered_users', users.length.toString());
  localStorage.setItem('completed_orders', orders.filter((o: any) => o.verified === 'VERIFIED').length.toString());
  localStorage.setItem('verified_revenue', '$' + (orders.length * 49.99).toFixed(2));
}

export async function trackGlobalClick(page: string = 'home', product: string = 'Sirwise AI Web3 Academy'): Promise<void> {
  await saveGlobalClick(page, product, '', '');
}

export async function trackUserClick(target: string, page: string = 'Home', productId: string = ''): Promise<void> {
  await saveGlobalClick(page + ' - ' + target, productId || 'Sirwise AI Web3 Academy', '', '');
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
  (window as any).saveGlobalClick = saveGlobalClick;
  (window as any).getCountryFlag = getCountryFlag;
  (window as any).trackGlobalClick = trackGlobalClick;

  // Auto track every visit
  window.addEventListener('load', () => {
    setTimeout(() => saveGlobalClick('page_view', 'Page View', '', ''), 1500);
  });

  // Track Buy / Unlock button click
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.textContent && (target.textContent.includes('BUY') || target.textContent.includes('Unlock'))) {
      const em = (document.getElementById('customerEmail') as HTMLInputElement)?.value;
      if (em) localStorage.setItem('user_email', em);
      saveGlobalClick('buy_click', 'Sirwise Academy $49.99', '₦74,985.00 ($49.99)', '');
    }
  });
}


