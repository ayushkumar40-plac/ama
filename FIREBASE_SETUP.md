# Guardian App v2 — Firebase setup (done by assistant, verify below)

## What was wired (no clicks needed)
- `firebase@12.19.0` installed; config via `.env` (`VITE_FIREBASE_*`), `.env.example` provided.
- `src/lib/firebase.js` — initializes Auth + Firestore + Realtime DB; auto-connects to
  **local emulators** (auth:9099, firestore:8080, rtdb:9000, UI:4000) in dev when no keys.
  Cloud Storage is NOT used — new Firebase projects require a paid Blaze bucket for it,
  and the app only stores hashes + metadata (never raw files), so everything stays free.
- `src/lib/auth.jsx` — `AuthProvider`: anonymous survivor sign-in + email NGO/legal accounts,
  `users/{uid}` profiles with roles. Wrap already added in `src/main.jsx`.
- `src/lib/evidenceCloud.js` — hash-only Firestore mirror (`evidence` collection).
- Vault (`src/pages/BlockchainVault.jsx`) seals locally (SHA-256 chain) then mirrors hash,
  shows Firebase target + cloud count + sync button.
- Dashboard navbar shows Firebase status pill (live / emulator / offline) + NGO login.
- `firestore.rules` (append-only evidence) + `database.rules.json` (RTDB live GPS/SOS).
  `storage.rules` is kept in repo for reference only and is NOT deployed.
- `firebase.json` — emulator ports. `.gitignore` blocks `.env` / `.firebaserc`.
- Scripts: `npm run emulators`, `npm run deploy:rules`, `npm run firebase:login`.

## Run it locally (emulators, zero keys)
1. Install Java 17+ (emulators need it): `winget install EclipseAdoptium.Temurin.17.JDK`
2. `npm i -g firebase-tools`
3. Terminal A: `npm run emulators` → UI at http://127.0.0.1:4000
4. Terminal B: `npm run dev` → seal evidence in `/vault`, watch Firestore in emulator UI.

## Go live on Firebase cloud (one-time, needs YOUR Google account)
I cannot create a Google Cloud project for you (needs interactive login), but it's 3 min:
1. https://console.firebase.google.com/ → Add project `guardian-network`
2. Build → Authentication → Sign-in method → enable **Anonymous** + **Email/Password**
3. Build → Firestore Database → Create (production mode) → Rules tab → paste `firestore.rules` → Publish
4. Build → Realtime Database → Create database → Rules tab → paste `database.rules.json` → Publish
   (SKIP "Storage" entirely — do NOT click "Get started" there; it asks you to upgrade to Blaze/paid.)
5. Project Settings → Add app (Web `</>`) → copy `firebaseConfig`
6. Locally: copy `.env.example` → `.env`, paste values, set `VITE_USE_EMULATORS=false`
7. `npm run build` → commit + push. Optional: `firebase use --add` then `npm run deploy:rules`.
