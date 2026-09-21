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

export function safeFormatDate(dateVal: any, fallbackStr: string = 'N/A'): string {
  if (dateVal === null || dateVal === undefined || dateVal === '') return fallbackStr;

  try {
    // 1. Firestore Timestamp object with .toDate() method
    if (dateVal && typeof dateVal.toDate === 'function') {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) return d.toLocaleDateString();
    }

    // 2. Firestore Timestamp raw object with seconds or _seconds
    if (dateVal && typeof dateVal === 'object') {
      const secs = dateVal.seconds ?? dateVal._seconds;
      if (typeof secs === 'number') {
        const d = new Date(secs * 1000);
        if (!isNaN(d.getTime())) return d.toLocaleDateString();
      }
    }

    // 3. Numeric timestamp
    if (typeof dateVal === 'number') {
      const ms = dateVal < 10000000000 ? dateVal * 1000 : dateVal;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    }

    // 4. String format parsing
    if (typeof dateVal === 'string') {
      const trimmed = dateVal.trim();
      if (!trimmed || trimmed === 'Invalid Date' || trimmed === 'null' || trimmed === 'undefined') {
        return fallbackStr;
      }

      // Try native JS Date parse first
      const dNative = new Date(trimmed);
      if (!isNaN(dNative.getTime())) {
        return dNative.toLocaleDateString();
      }

      // Match DD/MM/YYYY or MM/DD/YYYY
      const datePartMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (datePartMatch) {
        const [_, p1, p2, p3] = datePartMatch;
        const d1 = new Date(`${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`);
        if (!isNaN(d1.getTime())) return d1.toLocaleDateString();

        const d2 = new Date(`${p3}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`);
        if (!isNaN(d2.getTime())) return d2.toLocaleDateString();

        return `${p1.padStart(2, '0')}/${p2.padStart(2, '0')}/${p3}`;
      }

      // Match YYYY-MM-DD
      const isoDateMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
      if (isoDateMatch) {
        const [_, y, m, d] = isoDateMatch;
        return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
      }

      // Strip trailing non-standard timezone names
      const cleanedStr = trimmed.replace(/\s+[A-Za-z]+(\s+[A-Za-z]+)?$/, '');
      const dClean = new Date(cleanedStr);
      if (!isNaN(dClean.getTime())) {
        return dClean.toLocaleDateString();
      }
    }
  } catch (e) {
    console.warn('safeFormatDate error:', e);
  }

  return fallbackStr;
}

export function safeFormatDateTime(dateVal: any, fallbackStr: string = 'N/A'): string {
  if (dateVal === null || dateVal === undefined || dateVal === '') return fallbackStr;

  try {
    if (dateVal && typeof dateVal.toDate === 'function') {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) return d.toLocaleString();
    }

    if (dateVal && typeof dateVal === 'object') {
      const secs = dateVal.seconds ?? dateVal._seconds;
      if (typeof secs === 'number') {
        const d = new Date(secs * 1000);
        if (!isNaN(d.getTime())) return d.toLocaleString();
      }
    }

    if (typeof dateVal === 'number') {
      const ms = dateVal < 10000000000 ? dateVal * 1000 : dateVal;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }

    if (typeof dateVal === 'string') {
      const trimmed = dateVal.trim();
      if (!trimmed || trimmed === 'Invalid Date' || trimmed === 'null' || trimmed === 'undefined') {
        return fallbackStr;
      }

      const dNative = new Date(trimmed);
      if (!isNaN(dNative.getTime())) {
        return dNative.toLocaleString();
      }

      if (trimmed.includes('/') || trimmed.includes('-')) {
        const cleanedStr = trimmed.replace(/\s+[A-Za-z]+(\s+[A-Za-z]+)?$/, '');
        const dClean = new Date(cleanedStr);
        if (!isNaN(dClean.getTime())) return dClean.toLocaleString();
        return trimmed;
      }
    }
  } catch (e) {
    console.warn('safeFormatDateTime error:', e);
  }

  return fallbackStr;
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
