// Tamper-evident local ledger + SHA-256 helpers for the Evidence Vault.
// In production this would anchor hashes to Polygon / Ethereum / Hyperledger.
// Here we simulate a blockchain: each block commits fileHash + prevHash + metadata.

const LEDGER_KEY = 'guardian_evidence_ledger_v1';
const ACCESS_KEY = 'guardian_vault_access_v1';

export function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256Hex(input) {
  // input: ArrayBuffer | string
  const data = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(digest);
}

export async function hashFile(file) {
  const buf = await file.arrayBuffer();
  return sha256Hex(buf);
}

export function randomHex(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function loadLedger() {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLedger(chain) {
  localStorage.setItem(LEDGER_KEY, JSON.stringify(chain));
}

export function genesisPrevHash() {
  return '0'.repeat(64);
}

// Create a new block chained to previous block.
export async function sealBlock({ fileHash, fileName, fileType, fileSize, location, note, accessList }) {
  const chain = loadLedger();
  const prevHash = chain.length ? chain[chain.length - 1].blockHash : genesisPrevHash();
  const timestamp = new Date().toISOString();
  const txHash = '0x' + randomHex(32);
  const blockPayload = `${prevHash}|${fileHash}|${fileName}|${timestamp}|${txHash}`;
  const blockHash = await sha256Hex(blockPayload);
  const block = {
    index: chain.length,
    timestamp,
    fileName,
    fileType,
    fileSize,
    fileHash,
    prevHash,
    txHash,
    blockHash,
    location: location || null, // { lat, lng, accuracy, capturedAt }
    note: note || '',
    accessList: accessList || ['owner'],
    network: 'GuardianChain (simulated) · anchored SHA-256',
  };
  chain.push(block);
  saveLedger(chain);
  return { block, chain };
}

// Re-verify a single block's linkage + recomputed blockHash.
export async function verifyBlock(block) {
  const recomputed = await sha256Hex(
    `${block.prevHash}|${block.fileHash}|${block.fileName}|${block.timestamp}|${block.txHash}`
  );
  return recomputed === block.blockHash;
}

export async function verifyChain(chain) {
  if (!chain.length) return { ok: true, results: [] };
  const results = [];
  let prev = genesisPrevHash();
  for (const block of chain) {
    const linkOk = block.prevHash === prev;
    const hashOk = await verifyBlock(block);
    const ok = linkOk && hashOk;
    results.push({ index: block.index, ok, linkOk, hashOk, txHash: block.txHash });
    if (!ok) return { ok: false, results };
    prev = block.blockHash;
  }
  return { ok: true, results };
}

// Re-hash a File and compare with sealed fileHash.
export async function verifyFileAgainstHash(file, expectedHash) {
  const actual = await hashFile(file);
  return { match: actual === expectedHash, actual };
}

export function deleteBlock(txHash) {
  const chain = loadLedger().filter((b) => b.txHash !== txHash);
  // Re-index (keeps demo simple; real chain would never delete — we mark as tombstone note)
  saveLedger(chain.map((b, i) => ({ ...b, index: i })));
  return loadLedger();
}

// ---- Controlled access (PIN gate + per-evidence ACL) ----
export function getVaultPin() {
  return localStorage.getItem(ACCESS_KEY) || '';
}

export function setVaultPin(pin) {
  if (!pin) localStorage.removeItem(ACCESS_KEY);
  else localStorage.setItem(ACCESS_KEY, pin);
}

export function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
