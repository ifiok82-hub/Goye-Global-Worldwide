import { 
  getFirestoreDb, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where 
} from './server-firestore';

export interface AnalyticsEventPayload {
  eventId?: string;
  eventName: string;
  anonymousId?: string;
  sessionId: string;
  page: string;
  target?: string;
  productId?: string;
  productName?: string;
  courseId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  timestamp?: string;
  serverTimestamp?: string;
  referrer?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
  browser?: string;
  language?: string;
  timezone?: string;
  country?: string;
  region?: string;
  city?: string;
  consentState?: 'granted' | 'denied' | 'partial' | string;
  metadata?: Record<string, any>;
  isAdmin?: boolean;
}

export interface CustomerProfileData {
  customerId: string;
  displayName: string;
  email: string;
  phone?: string;
  country?: string;
  preferredLanguage?: string;
  accountCreated: string;
  lastActive: string;
  customerStatus: string;
  isLead: boolean;
  isCustomer: boolean;
  totalSpentUSD: number;
  totalSpentNGN: number;
  ordersCount: number;
  eventsCount: number;
  lastEvent?: string;
  consentStatus: string;
  marketingPreference: boolean;
  interests: string[];
}

let lastReceivedEventTime: string | null = null;
let eventsReceivedCount = 0;
let eventsSavedCount = 0;
let eventsFailedCount = 0;

// Deduplication map: key = eventSignature, value = timestamp
const recentEventSignatures = new Map<string, number>();

export async function recordCustomerEvent(payload: AnalyticsEventPayload, isAdminRequest: boolean = false) {
  eventsReceivedCount++;
  const nowIso = new Date().toISOString();
  lastReceivedEventTime = nowIso;

  // Filter out admin users from customer analytics
  const isExplicitAdmin = Boolean(
    isAdminRequest ||
    payload.isAdmin === true ||
    (payload.customerEmail && (
      payload.customerEmail.toLowerCase().includes('goyedagos') ||
      payload.customerEmail.toLowerCase().includes('ifiok82') ||
      payload.customerEmail.toLowerCase().includes('godswill') ||
      payload.customerEmail.toLowerCase() === 'goye@gasv.store'
    ))
  );

  if (isExplicitAdmin) {
    return {
      success: true,
      excluded: true,
      message: 'Admin activity excluded from customer intelligence database'
    };
  }

  // Deduplication check: ignore identical event payload within 30 seconds
  const eventSig = `${payload.sessionId}_${payload.eventName}_${payload.page}_${payload.target || ''}`;
  const nowMs = Date.now();
  const lastTime = recentEventSignatures.get(eventSig);
  if (lastTime && (nowMs - lastTime < 30000)) {
    return {
      success: true,
      deduplicated: true,
      message: 'Duplicate event ignored within 30-second window'
    };
  }
  recentEventSignatures.set(eventSig, nowMs);

  const eventId = payload.eventId || ('evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  const sessionId = payload.sessionId || ('sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  const timestamp = payload.timestamp || nowIso;

  const sanitizedEvent: AnalyticsEventPayload = {
    eventId,
    eventName: payload.eventName || 'PAGE_VIEW',
    anonymousId: payload.anonymousId || ('anon_' + sessionId),
    sessionId,
    page: payload.page || 'Home',
    target: payload.target || '',
    productId: payload.productId || '',
    productName: payload.productName || '',
    courseId: payload.courseId || '',
    customerName: payload.customerName || 'Guest Customer',
    customerEmail: (payload.customerEmail || '').trim().toLowerCase(),
    customerPhone: payload.customerPhone || '',
    timestamp,
    serverTimestamp: nowIso,
    referrer: payload.referrer || 'Direct',
    source: payload.source || payload.referrer || 'Direct',
    utmSource: payload.utmSource || '',
    utmMedium: payload.utmMedium || '',
    utmCampaign: payload.utmCampaign || '',
    deviceType: payload.deviceType || 'Desktop',
    browser: payload.browser || 'Unknown',
    language: payload.language || 'en',
    timezone: payload.timezone || 'UTC',
    country: payload.country || 'Global',
    region: payload.region || '',
    city: payload.city || '',
    consentState: payload.consentState || 'granted',
    metadata: payload.metadata || {},
    isAdmin: false
  };

  const db = getFirestoreDb();
  let firestoreSaved = false;

  if (db) {
    try {
      // 1. Write Analytics Event to Firestore
      await setDoc(doc(db, 'analytics_events', eventId), sanitizedEvent as any);

      // 2. Write Live Visitor session
      const liveVisitorDoc = {
        sessionId,
        anonymousId: sanitizedEvent.anonymousId,
        customerEmail: sanitizedEvent.customerEmail,
        customerName: sanitizedEvent.customerName,
        country: sanitizedEvent.country,
        currentSection: sanitizedEvent.page,
        currentPage: sanitizedEvent.page,
        deviceType: sanitizedEvent.deviceType,
        browser: sanitizedEvent.browser,
        lastActiveTime: nowIso
      };
      await setDoc(doc(db, 'live_visitors', sessionId), liveVisitorDoc, { merge: true });

      // 3. Write/Update Customer Profile
      if (sanitizedEvent.customerEmail && sanitizedEvent.customerEmail.includes('@') && !sanitizedEvent.customerEmail.includes('guest_')) {
        const emailKey = sanitizedEvent.customerEmail.toLowerCase();
        
        // Fetch existing profile if available
        let existingProfile: CustomerProfileData | null = null;
        try {
          const profileSnap = await getDocs(query(collection(db, 'customer_profiles'), where('email', '==', emailKey), limit(1)));
          if (!profileSnap.empty) {
            existingProfile = profileSnap.docs[0].data() as CustomerProfileData;
          }
        } catch (e) {}

        const profile: CustomerProfileData = {
          customerId: existingProfile?.customerId || ('cust_' + Date.now()),
          displayName: sanitizedEvent.customerName && sanitizedEvent.customerName !== 'Guest Customer' ? sanitizedEvent.customerName : (existingProfile?.displayName || 'Customer'),
          email: emailKey,
          phone: sanitizedEvent.customerPhone || existingProfile?.phone || '',
          country: sanitizedEvent.country || existingProfile?.country || 'Global',
          preferredLanguage: sanitizedEvent.language || existingProfile?.preferredLanguage || 'en',
          accountCreated: existingProfile?.accountCreated || nowIso,
          lastActive: nowIso,
          customerStatus: existingProfile?.isCustomer ? 'CUSTOMER' : 'LEAD',
          isLead: existingProfile?.isLead ?? true,
          isCustomer: existingProfile?.isCustomer ?? false,
          totalSpentUSD: existingProfile?.totalSpentUSD || 0,
          totalSpentNGN: existingProfile?.totalSpentNGN || 0,
          ordersCount: existingProfile?.ordersCount || 0,
          eventsCount: (existingProfile?.eventsCount || 0) + 1,
          lastEvent: `${sanitizedEvent.eventName} on ${sanitizedEvent.page}`,
          consentStatus: sanitizedEvent.consentState || 'granted',
          marketingPreference: true,
          interests: Array.from(new Set([...(existingProfile?.interests || []), sanitizedEvent.productId, sanitizedEvent.page].filter(Boolean)))
        };

        await setDoc(doc(db, 'customer_profiles', emailKey), profile as any, { merge: true });

        // 4. Record Lead if lead acquisition event
        if (['CONTACT_SUBMITTED', 'NEWSLETTER_OPT_IN', 'LEAD_MAGNET_DOWNLOAD', 'CHECKOUT_STARTED'].includes(sanitizedEvent.eventName)) {
          const leadDoc = {
            leadId: 'lead_' + Date.now(),
            name: profile.displayName,
            email: emailKey,
            phone: profile.phone,
            country: profile.country,
            source: sanitizedEvent.referrer,
            interest: sanitizedEvent.productId || sanitizedEvent.page,
            status: 'NEW',
            createdAt: nowIso,
            lastActivity: nowIso
          };
          await setDoc(doc(db, 'leads', emailKey), leadDoc, { merge: true });
        }
      }

      firestoreSaved = true;
      eventsSavedCount++;
    } catch (err) {
      console.warn('[ANALYTICS_SERVICE] Firestore write error:', err);
      eventsFailedCount++;
    }
  }

  return {
    success: true,
    eventId,
    sessionId,
    firestoreSaved
  };
}

export async function fetchAllAnalyticsEvents(limitCount = 1000): Promise<AnalyticsEventPayload[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const q = query(collection(db, 'analytics_events'), orderBy('serverTimestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AnalyticsEventPayload);
  } catch (err) {
    console.warn('[ANALYTICS_SERVICE] Firestore fetchAllAnalyticsEvents error:', err);
    try {
      // Fallback query without orderBy if index is building
      const snap = await getDocs(query(collection(db, 'analytics_events'), limit(limitCount)));
      return snap.docs.map(d => d.data() as AnalyticsEventPayload);
    } catch (e) {
      return [];
    }
  }
}

export async function fetchCustomerProfiles(): Promise<CustomerProfileData[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const snap = await getDocs(collection(db, 'customer_profiles'));
    return snap.docs.map(d => d.data() as CustomerProfileData);
  } catch (e) {
    return [];
  }
}

export async function fetchLiveVisitors(): Promise<any[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const cutoffTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  try {
    const q = query(collection(db, 'live_visitors'), where('lastActiveTime', '>=', cutoffTime));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    try {
      const snap = await getDocs(collection(db, 'live_visitors'));
      return snap.docs.map(d => d.data()).filter((v: any) => v.lastActiveTime >= cutoffTime);
    } catch (err) {
      return [];
    }
  }
}

export async function fetchLeads(): Promise<any[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const snap = await getDocs(collection(db, 'leads'));
    return snap.docs.map(d => d.data());
  } catch (e) {
    return [];
  }
}

export async function deleteCustomerData(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await deleteDoc(doc(db, 'customer_profiles', cleanEmail));
    await deleteDoc(doc(db, 'leads', cleanEmail));
    return true;
  } catch (e) {
    return false;
  }
}

export function getAnalyticsDiagnostics() {
  const db = getFirestoreDb();
  return {
    analyticsApiStatus: 'ONLINE',
    databaseStatus: db ? 'ONLINE' : 'OFFLINE',
    eventIngestionStatus: 'ONLINE',
    adminListenerStatus: 'ONLINE',
    lastEventTimestamp: lastReceivedEventTime || 'No events recorded yet',
    eventsReceivedCount,
    eventsSavedCount,
    eventsFailedCount
  };
}
