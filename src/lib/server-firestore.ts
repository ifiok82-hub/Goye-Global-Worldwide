import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit as limitFn, 
  where 
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firestoreInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const app = getApps().length ? getApp() : initializeApp(config);
      firestoreInstance = getFirestore(app, config.firestoreDatabaseId || undefined);
      console.log('[SERVER_FIRESTORE] Initialized persistent Firestore database:', config.firestoreDatabaseId);
    }
  } catch (err) {
    console.warn('[SERVER_FIRESTORE] Could not initialize Firestore:', err);
  }

  return firestoreInstance;
}

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limitFn as limit,
  where
};
