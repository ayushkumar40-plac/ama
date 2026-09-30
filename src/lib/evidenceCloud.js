// Firestore mirror of the hash-chained evidence ledger.
// Design: raw files stay on-device (or encrypted in Storage); ONLY hashes +
// metadata are written to Firestore so NGOs / legal advisors can verify
// without ever seeing private media. Rules (see firestore.rules) lock
// each record to its owner + explicit grantees.
import {
  collection, addDoc, query, where, orderBy, getDocs,
  serverTimestamp, deleteDoc, doc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION = 'evidence';

export async function cloudSaveBlock(block, ownerUid) {
  if (!isFirebaseConfigured || !db) return { ok: false, reason: 'firebase-not-configured' };
  const ref = await addDoc(collection(db, COLLECTION), {
    ...block,
    ownerUid: ownerUid || 'anonymous',
    createdAt: serverTimestamp(),
  });
  return { ok: true, id: ref.id };
}

export async function cloudListBlocks(ownerUid) {
  if (!isFirebaseConfigured || !db) return { ok: false, reason: 'firebase-not-configured', blocks: [] };
  const q = query(
    collection(db, COLLECTION),
    where('ownerUid', '==', ownerUid || 'anonymous'),
    orderBy('index', 'asc')
  );
  const snap = await getDocs(q);
  return { ok: true, blocks: snap.docs.map((d) => ({ cloudId: d.id, ...d.data() })) };
}

export async function cloudDeleteBlock(cloudId) {
  if (!isFirebaseConfigured || !db) return { ok: false, reason: 'firebase-not-configured' };
  await deleteDoc(doc(db, COLLECTION, cloudId));
  return { ok: true };
}
