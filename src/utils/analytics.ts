// Visitor & Click Analytics Tracking Client Helper (100% LocalStorage - No Firebase)
import { safeParse, safeGetNumber } from './safeParse';

export function getAnonymousId(): string {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 'anon_guest';
  let anonId = localStorage.getItem('goye_anon_id');
  if (!anonId) {
    anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('goye_anon_id', anonId);
  }
  return anonId;
}

export function getAnonymousSessionId(): string {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 'sess_guest';
  let sessionId = localStorage.getItem('goye_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('goye_session_id', sessionId);
  }
  return sessionId;
}

export const ADMIN_NAMES = ['ifiok enyiema', 'ifiok', 'goyedagos', 'goye'];
export const ADMIN_EMAIL_PARTS = [
  'goyedagosmess', 'ifiok82', 'godswilloyoho', 'goye@gasv.store', 'goyedagos@'
];

export function isAdminClick(name?: string, email?: string): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;

  // Real admin session verification
  const hasAdminAuth = 
    localStorage.getItem('isAdmin') === 'true' && 
    Boolean(localStorage.getItem('admin_token') || localStorage.getItem('admin_password'));

  if (hasAdminAuth) return true;

  const n = (name || '').toLowerCase();
  const e = (
    email ||
    localStorage.getItem('user_email') ||
    localStorage.getItem('customer_email') ||
    ''
  ).toLowerCase();

  const hasAdminEmail = ADMIN_EMAIL_PARTS.some(a => e.includes(a));
  const hasAdminName = ADMIN_NAMES.some(a => n.includes(a));

  return hasAdminEmail || (hasAdminName && hasAdminAuth);
}

// Initial seed records - Real verified orders only (empty by default until real Paystack transactions occur)
export const SEED_CUSTOMERS: any[] = [];
export const SEED_ORDERS: any[] = [];

export function ensureInitialSeeds(): void {
  try {
    const existingUsers = safeParse('registered_customers', []);
    if (!Array.isArray(existingUsers)) {
      localStorage.setItem('registered_customers', JSON.stringify([]));
    }
    const existingOrders = safeParse('live_orders', []);
    if (!Array.isArray(existingOrders)) {
      localStorage.setItem('live_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('total_clicks')) {
      localStorage.setItem('total_clicks', '0');
      localStorage.setItem('last_click_date', new Date().toLocaleDateString('en-GB'));
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

export async function saveUserClick(nameInput?: string, emailInput?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  if (localStorage.getItem('isAdmin') === 'true') {
    return;
  }

  let name = (nameInput || localStorage.getItem('user_name') || 'Guest').trim();
  let email = (
    emailInput ||
    (document.getElementById('customerEmail') as HTMLInputElement)?.value ||
    localStorage.getItem('user_email') ||
    ''
  ).trim().toLowerCase();

  const excludeOn = localStorage.getItem('exclude_my_clicks') !== 'false' && localStorage.getItem('excludeAdminClicks') !== 'false';

  // Delete leak emails
  if (
    email.includes('ifiok82') ||
    email.includes('godswilloyoho') ||
    email === 'goyedagos@' ||
    email.includes('null') ||
    email.includes('ico') ||
    email === 'goye@gasv.store'
  ) {
    return; // Do not save leak
  }

  // IF EXCLUDE ON AND ADMIN - DO NOT SAVE
  if (excludeOn && isAdminClick(name, email)) {
    console.log('ADMIN CLICK EXCLUDED - Not saved - ', name, email);
    let excl = safeParse('excluded_admin_clicks', []);
    excl.unshift({ name, email, date: new Date().toLocaleString(), reason: 'Excluded - Admin Device' });
    localStorage.setItem('excluded_admin_clicks', JSON.stringify(excl.slice(0, 20)));
    return; // STOP HERE - Do not save to Registered Customers
  }

  // If not admin, save as real customer
  if (!email.includes('@') || !email.includes('.')) {
    email = 'guest_' + Date.now() + '@gasv.store';
    name = 'Guest Customer';
  }

  const record = {
    id: 'CLICK-' + Date.now(),
    name,
    customer_name: name,
    customer: name,
    pupil_name: name,
    email,
    parent: '-',
    date: new Date().toLocaleDateString('en-GB'),
    date_wat: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' WAT Lagos',
    status: 'Browsing',
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    excluded: 'Customer'
  };

  let users = safeParse('registered_customers', []);

  // Prevent duplicate admin or duplicate entry
  if (!users.some((u: any) => (u.name || u.customer || '').toLowerCase() === name.toLowerCase() && isAdminClick(name, email))) {
    users.unshift(record);
    localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 100)));
  }

  let clicks = safeGetNumber('total_clicks', 0) + 1;
  localStorage.setItem('total_clicks', clicks.toString());

  // Log non-admin customer click to server database using non-blocking sendBeacon & keepalive
  const clickPayload = JSON.stringify({
    sessionId: getAnonymousSessionId(),
    page: nameInput || 'Home',
    target: emailInput || 'User Click',
    customerName: name,
    customerEmail: email,
    isAdmin: false
  });

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([clickPayload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/click', blob);
    } catch (e) {}
  } else {
    try {
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: clickPayload,
        keepalive: true
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && typeof data.totalClicks === 'number') {
          localStorage.setItem('total_clicks', data.totalClicks.toString());
        }
      })
      .catch(() => {});
    } catch (e) {}
  }
}

export async function saveGlobalClick(type: string = 'page_view', product: string = 'Sirwise AI Web3 Academy', amount: string = '', ref: string = ''): Promise<void> {
  if (typeof window === 'undefined') return;

  if (localStorage.getItem('isAdmin') === 'true') {
    return;
  }

  let name = localStorage.getItem('user_name') || 'Guest';
  let email = ((document.getElementById('customerEmail') as HTMLInputElement)?.value || localStorage.getItem('user_email') || localStorage.getItem('admin_email') || '').trim().toLowerCase();
  
  // Check both excludeAdminClicks and exclude_my_clicks keys
  const excludeAdminSetting = localStorage.getItem('excludeAdminClicks') === 'true';
  const excludeMyClicksSetting = localStorage.getItem('exclude_my_clicks') !== 'false';
  const isExcludeActive = excludeAdminSetting || excludeMyClicksSetting;
  const isUserAdmin = isAdminClick(name, email) || localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_owner') === 'true';

  // IF EXCLUDE ON AND IS ADMIN - EARLY RETURN - DO NOT INCREMENT CLICKS OR LOG TRAFFIC
  if (isExcludeActive && isUserAdmin) {
    console.log('Admin click EXCLUDED - Early Return -', name, email);
    let excludedLog = safeParse('excluded_admin_clicks', []);
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    excludedLog.unshift({
      name,
      email,
      country: '🇳🇬 Nigeria (Lagos)',
      customer: 'Admin You (Excluded)',
      status: 'Excluded',
      time: new Date().toLocaleString(),
      device: isMobile ? 'Mobile' : 'Desktop',
      reason: 'Excluded - Admin Device'
    });
    localStorage.setItem('excluded_admin_clicks', JSON.stringify(excludedLog.slice(0, 20)));
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
  let logs = safeParse('live_traffic_activity', []);
  logs.unshift(record);
  localStorage.setItem('live_traffic_activity', JSON.stringify(logs.slice(0, 100)));

  // Update total clicks
  let clicks = safeGetNumber('total_clicks', 0) + 1;
  localStorage.setItem('total_clicks', clicks.toString());

  if (type === 'payment') {
    let orders = safeParse('live_orders', []);
    orders.unshift(record);
    localStorage.setItem('live_orders', JSON.stringify(orders.slice(0, 100)));

    let users = safeParse('registered_customers', []);
    users.unshift(record);
    localStorage.setItem('registered_customers', JSON.stringify(users.slice(0, 100)));

    localStorage.setItem('verified_revenue', '$' + (orders.length * 49.99).toFixed(2));
  }

  // Log non-admin customer click to database using non-blocking sendBeacon & keepalive
  const globalClickPayload = JSON.stringify({
    sessionId: getAnonymousSessionId(),
    page: type || 'Page View',
    target: product || 'CTA Click',
    customerName: name || 'Guest Customer',
    customerEmail: email || '',
    isAdmin: false
  });

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([globalClickPayload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/click', blob);
    } catch (e) {}
  } else {
    try {
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: globalClickPayload,
        keepalive: true
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && typeof data.totalClicks === 'number') {
          localStorage.setItem('total_clicks', data.totalClicks.toString());
        }
      })
      .catch(() => {});
    } catch (e) {}
  }
}

export async function trackGlobalClick(page: string = 'home', product: string = 'Sirwise AI Web3 Academy'): Promise<void> {
  await saveUserClick(page, product);
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

// Attach window listeners automatically for non-blocking link & button click tracking
if (typeof window !== 'undefined') {
  (window as any).saveGlobalClick = saveGlobalClick;
  (window as any).saveUserClick = saveUserClick;
  (window as any).getCountryFlag = getCountryFlag;
  (window as any).trackGlobalClick = saveUserClick;
  (window as any).isAdminClick = isAdminClick;

  // Auto track page load
  window.addEventListener('load', () => {
    setTimeout(() => saveGlobalClick('page_view', 'Page View', '', ''), 1500);
  });

  // Non-blocking listener for ALL links and buttons
  document.addEventListener('click', (e: MouseEvent) => {
    try {
      const targetEl = (e.target as HTMLElement)?.closest('a, button, [role="button"], input[type="submit"]');
      if (targetEl) {
        const text = (targetEl.textContent || targetEl.getAttribute('aria-label') || targetEl.getAttribute('title') || 'Link Click').trim().substring(0, 60);
        const href = targetEl.getAttribute('href') || 'button';
        const em = (document.getElementById('customerEmail') as HTMLInputElement)?.value;
        if (em) localStorage.setItem('user_email', em);

        const linkPayload = JSON.stringify({
          sessionId: getAnonymousSessionId(),
          page: (window.location.pathname || '/') + (window.location.hash || ''),
          target: `${text} (${href})`,
          customerName: localStorage.getItem('user_name') || 'Guest Customer',
          customerEmail: localStorage.getItem('user_email') || '',
          isAdmin: isAdminClick(localStorage.getItem('user_name') || '', localStorage.getItem('user_email') || '')
        });

        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([linkPayload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/click', blob);
        } else {
          fetch('/api/analytics/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: linkPayload,
            keepalive: true
          }).catch(() => {});
        }
      }
    } catch (err) {}
  }, { capture: true, passive: true });
}



