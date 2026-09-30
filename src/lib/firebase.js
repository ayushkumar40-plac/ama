import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
// NOTE: Cloud Storage removed on purpose — new Firebase projects require a
// paid bucket (Blaze). This app never uploads raw media: only SHA-256 hashes
// + metadata go to Firestore/RTDB, so Storage is unnecessary. Free tier only.

// ---------------------------------------------------------------------------
// Config priority: Vite env vars → placeholder (offline/demo mode).
// Copy `.env.example` to `.env` and fill keys from Firebase Console
// (Project Settings → Your apps → Web app → firebaseConfig).
// For zero-key local dev: set VITE_USE_EMULATORS=true and run
// `npm run emulators` (needs Java) — vault works end-to-end locally.
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-guardian',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
  // storageBucket intentionally omitted: new Firebase projects require a
  // paid Blaze bucket for Cloud Storage, and this app never uploads raw
  // files — only SHA-256 hashes + metadata to Firestore/RTDB. No billing.
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'http://127.0.0.1:9000?ns=demo-guardian',
};

export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'YOUR_API_KEY' && !firebaseConfig.apiKey.startsWith('YOUR_');

export const useEmulators =
  import.meta.env.VITE_USE_EMULATORS === 'true' || (!isFirebaseConfigured && import.meta.env.DEV);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

let emulatorsConnected = false;
if (useEmulators && !emulatorsConnected) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectDatabaseEmulator(rtdb, '127.0.0.1', 9000);
    emulatorsConnected = true;
    console.info('[Firebase] Emulators: auth:9099 firestore:8080 rtdb:9000.');
  } catch (e) {
    console.warn('[Firebase] Emulator connect skipped:', e?.message);
  }
}

if (!isFirebaseConfigured && !useEmulators) {
  console.warn('[Firebase] No keys in .env — running offline/demo mode (localStorage ledger only).');
}

export { app, auth, db, rtdb };

