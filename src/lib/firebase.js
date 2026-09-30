import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

// ---------------------------------------------------------------------------
// TODO: paste your Firebase web-app config here (Firebase Console → Project
// Settings → Your apps → Web app → firebaseConfig). Then rebuild + push.
// Get a free config at https://console.firebase.google.com/
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000000000',
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'YOUR_API_KEY';

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analyticsSupported().then((ok) => ok && getAnalytics(app)).catch(() => {});
} else {
  console.warn(
    '[Firebase] Placeholder config — app runs in offline/demo mode. Paste real keys in src/lib/firebase.js'
  );
}

export { app, auth, db, storage };
