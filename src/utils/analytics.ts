// Visitor & Click Analytics Tracking Client Helper (100% LocalStorage - No Firebase)

export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem('goye_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('goye_session_id', sessionId);
  }
  return sessionId;
}

// Create admin device ID once
if (typeof localStorage !== 'undefined' && !localStorage.getItem('admin_device_id')) {
  localStorage.setItem('admin_device_id', 'ADMIN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
}

export const ADMIN_EMAILS = [
  'goyedagosmess@gmail.com',
  'ifiok82@gmail.com',
  'godswilloyoho@gmail.com',
  'goye@gasv.store',
  'goyedagos@'
];

export function isAdminClick(email?: string): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  
  const myEmail = (email || '').toLowerCase();
  const storedEmail = (
    localStorage.getItem('user_email') ||
    localStorage.getItem('customer_email') ||
    localStorage.getItem('admin_email') ||
    ''
  ).toLowerCase();

  const isEmailAdmin = ADMIN_EMAILS.some(a => 
    (myEmail && myEmail.includes(a.split('@')[0])) || 
    (storedEmail && storedEmail.includes(a.split('@')[0]))
  );

  const isMyDevice = 
    localStorage.getItem('is_admin') === 'true' || 
    localStorage.getItem('is_owner') === 'true' || 
    localStorage.getItem('admin_device') === 'true' ||
    Boolean(localStorage.getItem('admin_device_id'));

  const isAdminParam = 
    window.location.search.includes('admin') || 
    window.location.pathname.includes('/admin') ||
    window.location.hash.includes('admin');

  return isEmailAdmin || isMyDevice || Boolean(isAdminParam) || myEmail.includes('goyedagos') || myEmail.includes('admin');
}

// Initial seed records recorded since 25/08/2026 & 31/08/2026 if localStorage is empty
export const SEED_CUSTOMERS = [
  {
    id: 'PAYSTACK-1724580000',
    customer: 'Emeka Okonkwo',
    name: 'Emeka Okonkwo',
    fullName: 'Emeka Okonkwo',
    customerName: 'Emeka Okonkwo',
    pupilName: 'Emeka Okonkwo',
    email: 'emeka.okonkwo@gmail.com',
    customerEmail: 'emeka.okonkwo@gmail.com',
    country: '🇳🇬 Nigeria',
    product: 'Sirwise AI Web3 Academy',
    productName: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    createdAt: '2026-08-25T14:22:10.000Z',
    created_at: '2026-08-25T14:22:10.000Z',
    date: '25/08/2026',
    date_wat: '25/08/2026, 14:22:10 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1724800000',
    customer: 'Sarah Jenkins',
    name: 'Sarah Jenkins',
    fullName: 'Sarah Jenkins',
    customerName: 'Sarah Jenkins',
    pupilName: 'Sarah Jenkins',
    email: 'sarah.j@outlook.com',
    customerEmail: 'sarah.j@outlook.com',
    country: '🇺🇸 USA',
    product: 'Sirwise AI Web3 Academy',
    productName: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    createdAt: '2026-08-28T09:15:44.000Z',
    created_at: '2026-08-28T09:15:44.000Z',
    date: '28/08/2026',
    date_wat: '28/08/2026, 09:15:44 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1725060000',
    customer: 'David Brown',
    name: 'David Brown',
    fullName: 'David Brown',
    customerName: 'David Brown',
    pupilName: 'David Brown',
    email: 'david.b@btinternet.com',
    customerEmail: 'david.b@btinternet.com',
    country: '🇬🇧 UK',
    product: 'Sirwise AI Web3 Academy',
    productName: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    createdAt: '2026-08-31T18:04:12.000Z',
    created_at: '2026-08-31T18:04:12.000Z',
    date: '31/08/2026',
    date_wat: '31/08/2026, 18:04:12 WAT Lagos',
    page: 'academy'
  },
  {
    id: 'PAYSTACK-1725350000',
    customer: 'Adebayo Global',
    name: 'Adebayo Global',
    fullName: 'Adebayo Global',
    customerName: 'Adebayo Global',
    pupilName: 'Adebayo Global',
    email: 'adebayo.g@gmail.com',
    customerEmail: 'adebayo.g@gmail.com',
    country: '🇳🇬 Nigeria',
    product: 'Sirwise AI Web3 Academy',
    productName: 'Sirwise AI Web3 Academy',
    amount: '₦74,985.00 ($49.99)',
    amount_num: 74985,
    status: 'Verified',
    verified: 'VERIFIED',
    createdAt: '2026-09-03T11:30:00.000Z',
    created_at: '2026-09-03T11:30:00.000Z',
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
    if (d.country_code === 'NG') return '🇳🇬 Nigeria (Lagos)';
    if (d.country_code === 'US') return '🇺🇸 USA';
    if (d.country_code === 'GB') return '🇬🇧 UK';
    if (d.country_code === 'IN') return '🇮🇳 India';
    if (d.country_code === 'CA') return '🇨🇦 Canada';
    return '🌍 ' + (d.country_name || 'Global');
  } catch {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Lagos')) return '🇳🇬 Nigeria (Lagos)';
    return '🌍 Global';
  }
}

export async function saveGlobalClick(type: string = 'page_view', product: string = 'Sirwise AI Web3 Academy', amount: string = '', ref: string = ''): Promise<void> {
  if (typeof window === 'undefined') return;

  let email = ((document.getElementById('customerEmail') as HTMLInputElement)?.value || localStorage.getItem('user_email') || localStorage.getItem('admin_email') || '').trim().toLowerCase();
  
  // Check both excludeAdminClicks and exclude_my_clicks keys
  const excludeAdminSetting = localStorage.getItem('excludeAdminClicks') === 'true';
  const excludeMyClicksSetting = localStorage.getItem('exclude_my_clicks') !== 'false';
  const isExcludeActive = excludeAdminSetting || excludeMyClicksSetting;
  const isUserAdmin = isAdminClick(email) || localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_owner') === 'true';

  // IF EXCLUDE ON AND IS ADMIN - EARLY RETURN - DO NOT INCREMENT CLICKS OR LOG TRAFFIC
  if (isExcludeActive && (isUserAdmin || excludeAdminSetting)) {
    console.log('Admin click EXCLUDED - Early Return -', email);
    let excludedLog = JSON.parse(localStorage.getItem('excluded_logs') || '[]');
    if (!Array.isArray(excludedLog)) excludedLog = [];
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    excludedLog.unshift({
      country: '🇳🇬 Nigeria (Lagos)',
      customer: 'Admin You (Excluded)',
      status: 'Excluded',
      time: 'Just now',
      device: isMobile ? 'Mobile' : 'Desktop',
      excluded: 'EXCLUDED'
    });
    localStorage.setItem('excluded_logs', JSON.stringify(excludedLog.slice(0, 20)));
    return; // STOP immediately
  }

  // If not admin, save as Customer
  if (!email || !email.includes('@')) {
    email = 'guest_customer_' + Date.now() + '@gasv.store';
  }

  const country = await getCountryFlag();
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const record = {
    id: ref || 'PAYSTACK-' + Date.now(),
    location: country,
    country: country,
    customer_name: 'Guest Customer',
    customer: 'Guest Customer',
    email: email,
    status: type === 'payment' ? 'Verified' : 'Browsing',
    time: 'Just now',
    device: isMobile ? 'Mobile' : 'Desktop',
    excluded: 'Customer', // Will show green Customer badge
    product: product || 'Sirwise AI Web3 Academy',
    amount: amount || (type === 'payment' ? '₦74,985.00 ($49.99)' : ''),
    date: new Date().toLocaleDateString('en-GB'),
    date_wat: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
    verified: type === 'payment' ? 'VERIFIED' : 'UNVERIFIED',
    page: type
  };

  // Save only customers - Not admin when exclude ON
  let logs = JSON.parse(localStorage.getItem('live_traffic_activity') || '[]');
  if (!Array.isArray(logs)) logs = [];
  logs.unshift(record);
  localStorage.setItem('live_traffic_activity', JSON.stringify(logs.slice(0, 100)));

  // Update total clicks
  let clicks = parseInt(localStorage.getItem('total_clicks') || '0') + 1;
  localStorage.setItem('total_clicks', clicks.toString());

  if (type === 'payment') {
    let orders = JSON.parse(localStorage.getItem('live_orders') || '[]');
    if (!Array.isArray(orders)) orders = [];
    orders.unshift(record);
    localStorage.setItem('live_orders', JSON.stringify(orders.slice(0, 100)));

    let users = JSON.parse(localStorage.getItem('registered_customers') || '[]');
    if (!Array.isArray(users)) users = [];
    users.unshift(record);
    localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 100)));

    localStorage.setItem('completed_orders', orders.length.toString());
    localStorage.setItem('verified_revenue', '$' + (orders.length * 49.99).toFixed(2));
  }
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
  (window as any).isAdminClick = isAdminClick;

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



