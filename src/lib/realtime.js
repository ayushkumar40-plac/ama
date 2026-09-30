// Realtime Database layer: live GPS + SOS + share grants.
// Tree:
//   liveLocations/{uid} -> { lat, lng, accuracy, updatedAt, tracking, sosActive }
//   shares/{ownerUid}/{viewerUid} -> { grantedAt, label }
//   sos/{uid} -> { active, lat, lng, updatedAt }
//   evidenceIndex/{uid}/{txHash} -> { fileHash, blockHash, timestamp }
// Falls back gracefully when offline/emulator is down.
import { ref, set, update, get, remove, onValue, off, serverTimestamp } from 'firebase/database';
import { rtdb } from './firebase';

export function liveLocationRef(uid) {
  return ref(rtdb, `liveLocations/${uid}`);
}

export function subscribeLiveLocation(uid, cb) {
  const r = liveLocationRef(uid);
  const handler = (snap) => cb(snap.exists() ? snap.val() : null);
  onValue(r, handler);
  return () => off(r, 'value', handler);
}

export async function publishLiveLocation(uid, { lat, lng, accuracy = 0, tracking = true, sosActive = false }) {
  await set(liveLocationRef(uid), {
    lat, lng, accuracy, tracking, sosActive, updatedAt: Date.now(),
  });
}

export async function stopLiveLocation(uid) {
  await update(liveLocationRef(uid), { tracking: false, updatedAt: Date.now() });
}

export async function grantAccess(ownerUid, viewerUid, label = 'trusted-contact') {
  await set(ref(rtdb, `shares/${ownerUid}/${viewerUid}`), {
    grantedAt: serverTimestamp(), label,
  });
}

export async function revokeAccess(ownerUid, viewerUid) {
  await remove(ref(rtdb, `shares/${ownerUid}/${viewerUid}`));
}

export async function triggerSOS(uid, { lat, lng }) {
  await set(ref(rtdb, `sos/${uid}`), { active: true, lat, lng, updatedAt: Date.now() });
  await update(liveLocationRef(uid), { sosActive: true, updatedAt: Date.now() });
}

export async function clearSOS(uid) {
  await set(ref(rtdb, `sos/${uid}`), { active: false, updatedAt: Date.now() });
  await update(liveLocationRef(uid), { sosActive: false, updatedAt: Date.now() });
}

export async function indexEvidence(uid, txHash, { fileHash, blockHash, timestamp }) {
  await set(ref(rtdb, `evidenceIndex/${uid}/${txHash.replace(/[.#$/[\]]/g, '_')}`), {
    fileHash, blockHash, timestamp: timestamp || Date.now(),
  });
}

export async function readOnce(path) {
  const snap = await get(ref(rtdb, path));
  return snap.exists() ? snap.val() : null;
}
