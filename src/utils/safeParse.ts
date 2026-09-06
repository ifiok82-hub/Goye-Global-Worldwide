export function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'NaN' || val === 'undefined' || val === 'null' || val === '') {
      return fallback;
    }
    if (fallback instanceof Array) {
      if (val === '0' || val === '0.00' || (!isNaN(Number(val)) && !val.startsWith('[') && !val.startsWith('{'))) {
        return fallback;
      }
    }
    const parsed = JSON.parse(val);
    if (fallback instanceof Array && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch (e) {
    console.warn(`safeParse failed for key "${key}":`, e);
    try {
      localStorage.removeItem(key);
    } catch (_) {}
    return fallback;
  }
}

export function safeGetNumber(key: string, fallback: number = 0): number {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'NaN' || val === 'undefined' || val === 'null' || val === '') {
      return fallback;
    }
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  } catch (e) {
    return fallback;
  }
}

export function cleanupBadLocalStorage(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v === 'NaN' || v === 'undefined' || v === 'null') {
        console.log('Removing bad NaN key:', k);
        localStorage.removeItem(k);
      }
    });

    const arrayKeys = [
      'completed_orders', 'verified_live_orders', 'registered_customers',
      'live_orders', 'academy_leads', 'live_traffic_activity', 'traffic_log',
      'captured_leads', 'excluded_admin_clicks', 'my_downloads', 'payout_requests',
      'customers_list', 'orders_list', 'CUSTOM_PRODUCTS', 'goye_unlocked_products'
    ];
    arrayKeys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v) {
        try {
          const p = JSON.parse(v);
          if (!Array.isArray(p)) {
            localStorage.setItem(k, '[]');
          }
        } catch (_) {
          localStorage.setItem(k, '[]');
        }
      }
    });

    const numberKeys = ['total_link_clicks', 'total_clicks', 'total_clicks_global'];
    numberKeys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v === 'NaN' || v === 'undefined' || !v) {
        localStorage.setItem(k, '0');
      }
    });
  } catch (e) {
    console.warn('cleanupBadLocalStorage error:', e);
  }
}

if (typeof window !== 'undefined') {
  (window as any).safeParse = safeParse;
  (window as any).safeGetNumber = safeGetNumber;
  (window as any).cleanupBadLocalStorage = cleanupBadLocalStorage;
  cleanupBadLocalStorage();
}
