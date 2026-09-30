import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

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
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-guardian.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'YOUR_API_KEY' && !firebaseConfig.apiKey.startsWith('YOUR_');

export const useEmulators =
  import.meta.env.VITE_USE_EMULATORS === 'true' || (!isFirebaseConfigured && import.meta.env.DEV);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let emulatorsConnected = false;
if (useEmulators && !emulatorsConnected) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    emulatorsConnected = true;
    console.info('[Firebase] Connected to local emulators (auth:9099 firestore:8080 storage:9199).');
  } catch (e) {
    console.warn('[Firebase] Emulator connect skipped:', e?.message);
  }
}

if (!isFirebaseConfigured && !useEmulators) {
  console.warn('[Firebase] No keys in .env — running offline/demo mode (localStorage ledger only).');
}

export { app, auth, db, storage };

