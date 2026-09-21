import { 
  getFirestoreDb, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from './server-firestore';
import fs from 'fs';
import path from 'path';

export interface MigrationReport {
  localEventsFound: number;
  eventsMigrated: number;
  profilesMigrated: number;
  leadsMigrated: number;
  invalidRecords: number;
  duplicates: number;
  migrationStatus: string;
}

let lastReport: MigrationReport = {
  localEventsFound: 0,
  eventsMigrated: 0,
  profilesMigrated: 0,
  leadsMigrated: 0,
  invalidRecords: 0,
  duplicates: 0,
  migrationStatus: 'PENDING'
};

export function getMigrationReport(): MigrationReport {
  return lastReport;
}

export async function runFirestoreMigration(): Promise<MigrationReport> {
  const db = getFirestoreDb();
  if (!db) {
    console.warn('[FIRESTORE_MIGRATION] Firestore not initialized yet');
    lastReport.migrationStatus = 'FAILED_NO_DB';
    return lastReport;
  }

  console.log('[FIRESTORE_MIGRATION] Starting migration of local JSON records to Cloud Firestore...');

  let localEventsFound = 0;
  let eventsMigrated = 0;
  let profilesMigrated = 0;
  let leadsMigrated = 0;
  let invalidRecords = 0;
  let duplicates = 0;

  const processedEventIds = new Set<string>();
  const processedEmails = new Set<string>();

  // 1. Migrate leads.json
  const leadsPath = path.resolve(process.cwd(), 'leads.json');
  if (fs.existsSync(leadsPath)) {
    try {
      const raw = fs.readFileSync(leadsPath, 'utf8');
      const leads = JSON.parse(raw);
      if (Array.isArray(leads)) {
        for (const lead of leads) {
          localEventsFound++;

          const email = (lead.email || lead.customerEmail || '').trim().toLowerCase();
          if (!email || !email.includes('@')) {
            invalidRecords++;
            continue;
          }

          // Skip admin emails
          if (email.includes('goyedagos') || email.includes('ifiok82') || email.includes('godswill') || email.includes('goye@gasv.store')) {
            invalidRecords++;
            continue;
          }

          if (processedEmails.has(email)) {
            duplicates++;
          } else {
            processedEmails.add(email);
          }

          const leadId = lead.id ? `lead_${lead.id}` : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          const leadData = {
            leadId,
            name: lead.name || 'Lead Customer',
            email,
            phone: lead.phone || '',
            country: lead.country || 'Nigeria',
            source: lead.source || '5-Minute AI Prompt Blueprint',
            interest: lead.action || 'AI Prompt / Academy',
            status: lead.status || 'QUALIFIED',
            createdAt: lead.date || lead.purchasedAt || new Date().toISOString(),
            lastActivity: lead.purchasedAt || new Date().toISOString()
          };

          const profileData = {
            customerId: `cust_${leadId}`,
            displayName: leadData.name,
            email: leadData.email,
            country: leadData.country,
            accountCreated: leadData.createdAt,
            lastActive: leadData.lastActivity,
            customerStatus: lead.status === 'PAID' ? 'CUSTOMER' : 'LEAD',
            isLead: true,
            isCustomer: lead.status === 'PAID',
            totalSpentUSD: lead.amount ? Number(lead.amount) : 0,
            eventsCount: 1,
            consentStatus: 'granted',
            marketingPreference: true,
            interests: [leadData.source]
          };

          try {
            await setDoc(doc(db, 'leads', email), leadData as any, { merge: true });
            leadsMigrated++;

            await setDoc(doc(db, 'customer_profiles', email), profileData as any, { merge: true });
            profilesMigrated++;
          } catch (e) {
            console.warn('[FIRESTORE_MIGRATION] Error migrating lead record:', e);
          }
        }
      }
    } catch (e) {
      console.warn('[FIRESTORE_MIGRATION] Could not parse leads.json:', e);
    }
  }

  // 2. Migrate analytics_events.json if present
  const analyticsPath = path.resolve(process.cwd(), 'analytics_events.json');
  if (fs.existsSync(analyticsPath)) {
    try {
      const raw = fs.readFileSync(analyticsPath, 'utf8');
      const events = JSON.parse(raw);
      if (Array.isArray(events)) {
        for (const evt of events) {
          localEventsFound++;
          const eventId = evt.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          
          if (processedEventIds.has(eventId)) {
            duplicates++;
            continue;
          }
          processedEventIds.add(eventId);

          const email = (evt.customerEmail || '').trim().toLowerCase();
          if (email && (email.includes('goyedagos') || email.includes('ifiok82') || email.includes('godswill') || email.includes('goye@gasv.store'))) {
            invalidRecords++;
            continue;
          }

          try {
            await setDoc(doc(db, 'analytics_events', eventId), evt, { merge: true });
            eventsMigrated++;
          } catch (e) {
            console.warn('[FIRESTORE_MIGRATION] Error migrating analytics event:', e);
          }
        }
      }
    } catch (e) {}
  }

  lastReport = {
    localEventsFound,
    eventsMigrated,
    profilesMigrated,
    leadsMigrated,
    invalidRecords,
    duplicates,
    migrationStatus: 'COMPLETED'
  };

  console.log('[FIRESTORE_MIGRATION] Migration finished successfully:', lastReport);
  return lastReport;
}

// 90-Day Analytics Event Retention Automated Cleanup
export async function runRetentionCleanup(): Promise<{ deletedCount: number }> {
  const db = getFirestoreDb();
  if (!db) return { deletedCount: 0 };

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  console.log(`[RETENTION_CLEANUP] Running 90-day retention cleanup for events prior to ${ninetyDaysAgo}...`);

  let deletedCount = 0;
  try {
    const q = query(collection(db, 'analytics_events'), where('serverTimestamp', '<', ninetyDaysAgo));
    const oldEventsSnap = await getDocs(q);

    if (!oldEventsSnap.empty) {
      for (const docSnap of oldEventsSnap.docs) {
        await deleteDoc(docSnap.ref);
        deletedCount++;
      }
      console.log(`[RETENTION_CLEANUP] Purged ${deletedCount} raw events older than 90 days.`);
    }
  } catch (err) {
    console.warn('[RETENTION_CLEANUP] Cleanup notice:', err);
  }

  return { deletedCount };
}
