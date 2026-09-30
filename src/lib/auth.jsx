import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, useEmulators } from '../lib/firebase';

const AuthCtx = createContext({
  user: null, profile: null, authReady: false,
  mode: 'offline', signInEmail: async () => {}, signUpEmail: async () => {},
  signOutNow: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        try { await signInAnonymously(auth); return; }
        catch { setUser(null); setAuthReady(true); return; }
      }
      setUser(u);
      try {
        const ref = doc(db, 'users', u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid, isAnonymous: u.isAnonymous,
            email: u.email || null, role: 'survivor',
            createdAt: serverTimestamp(),
          });
        }
        setProfile((await getDoc(ref)).data());
      } catch { setProfile(null); }
      finally { setAuthReady(true); }
    });
    return () => unsub();
  }, []);

  const signInEmail = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
  const signUpEmail = async (email, pw, role = 'survivor') => {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid, email, role, isAnonymous: false, createdAt: serverTimestamp(),
    });
    return cred;
  };
  const signOutNow = async () => { await signOut(auth); setUser(null); setProfile(null); };

  const mode = isFirebaseConfigured ? 'cloud' : useEmulators ? 'emulator' : 'offline';
  return (
    <AuthCtx.Provider value={{ user, profile, authReady, mode, signInEmail, signUpEmail, signOutNow }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
