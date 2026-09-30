import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Database, Lock, Upload, ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { MapPin, Mic, Video, KeyRound, Eye, Trash2, Download, RefreshCw } from 'lucide-react';
import { Fingerprint, Users, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hashFile, sealBlock, loadLedger, verifyChain } from '../utils/evidenceVault';
import { verifyFileAgainstHash, getVaultPin, setVaultPin } from '../utils/evidenceVault';
import { deleteBlock, downloadJson } from '../utils/evidenceVault';
import { useEmulators, isFirebaseConfigured } from '../lib/firebase';
import { cloudSaveBlock, cloudListBlocks } from '../lib/evidenceCloud';
import { useAuth } from '../lib/auth.jsx';

const ACCEPT = 'audio/*,video/*,image/*,.pdf,.txt,.json,.log';
function useGeo() {
  const [loc, setLoc] = useState(null);
  const [locStatus, setLocStatus] = useState('idle');
  const capture = () => new Promise((resolve) => {
    if (!('geolocation' in navigator)) { setLocStatus('denied'); resolve(null); return; }
    setLocStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const v = { lat: Number(pos.coords.latitude.toFixed(6)), lng: Number(pos.coords.longitude.toFixed(6)), accuracy: Math.round(pos.coords.accuracy || 0), capturedAt: new Date().toISOString() };
        setLoc(v); setLocStatus('ok'); resolve(v);
      },
      () => { setLocStatus('denied'); resolve(null); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
  return { loc, locStatus, capture };
}

export default function BlockchainVault() {
  const navigate = useNavigate();
  const { loc, locStatus, capture } = useGeo();
  const [unlocked, setUnlocked] = useState(() => !getVaultPin());
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [gateError, setGateError] = useState('');
  const [uploadState, setUploadState] = useState('idle');
  const [fileMeta, setFileMeta] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [sealedBlock, setSealedBlock] = useState(null);
  const [note, setNote] = useState('');
  const [grantees, setGrantees] = useState('legal-aid-ngo, family');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [chain, setChain] = useState(() => loadLedger());
  const [chainStatus, setChainStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [recState, setRecState] = useState('idle');
  const [recSecs, setRecSecs] = useState(0);
  const fileRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  const stats = useMemo(() => ({
    count: chain.length,
    lastTx: chain.length ? chain[chain.length - 1].txHash.slice(0, 14) + '...' : '-',
  }), [chain]);
  const { user } = useAuth();
  const [cloudMsg, setCloudMsg] = useState('');
  const [cloudBlocks, setCloudBlocks] = useState([]);
  const [cloudLoading, setCloudLoading] = useState(false);

  const refreshCloud = async (uid) => {
    const id = uid || user?.uid;
    if (!id) return;
    setCloudLoading(true);
    try {
      const res = await cloudListBlocks(id);
      setCloudBlocks(res.blocks || []);
    } catch {
      setCloudBlocks([]);
    } finally {
      setCloudLoading(false);
    }
  };

  useEffect(() => { if (user?.uid) refreshCloud(user.uid); }, [user?.uid]);

  const sealFileObject = async (file, label) => {
    setFileMeta({ name: file.name, size: file.size, type: file.type || 'unknown' });
    setVerifyResult(null); setSealedBlock(null);
    setUploadState('hashing');
    const h = await hashFile(file);
    setFileHash(h);
    const location = includeLocation ? (loc || await capture()) : null;
    setUploadState('sealing');
    await new Promise((r) => setTimeout(r, 700));
    const accessList = ['owner', ...grantees.split(',').map((s) => s.trim()).filter(Boolean)];
    const res = await sealBlock({
      fileHash: h, fileName: file.name, fileType: file.type || 'unknown',
      fileSize: file.size, location, note: note || label || '', accessList,
    });
    setSealedBlock(res.block); setChain(res.chain); setUploadState('success');
    try {
      setCloudMsg(useEmulators && !isFirebaseConfigured ? 'Saving to local Firebase emulator…' : 'Mirroring hash to Firebase…');
      const out = await cloudSaveBlock(res.block, user?.uid || 'anonymous');
      setCloudMsg(out.ok ? 'Backed up to Firebase (hash only — media stays private).' : 'Saved locally.');
      refreshCloud();
    } catch (e) {
      setCloudMsg('Firebase unreachable — kept local seal. Run `npm run emulators` or add .env keys.');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { await sealFileObject(file, ''); }
    catch (err) { console.error(err); setUploadState('idle'); }
    finally { if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    const res = await verifyChain(chain);
    setChainStatus(res); setVerifying(false);
  };

  const handleVerifyFile = async () => {
    if (!verifyFile || !verifyTarget) return;
    const target = chain.find((b) => b.txHash === verifyTarget);
    if (!target) { setVerifyResult({ ok: false, msg: 'Evidence ID not found.' }); return; }
    const out = await verifyFileAgainstHash(verifyFile, target.fileHash);
    setVerifyResult({
      ok: out.match,
      msg: out.match ? 'MATCH - file is byte-identical to sealed evidence.' : 'MISMATCH - file differs. Possible tampering.',
      actual: out.actual, expected: target.fileHash,
    });
  };

  const startRecording = async (kind) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(kind === 'audio' ? { audio: true } : { audio: true, video: true });
      streamRef.current = stream; chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      rec.ondataavailable = (ev) => ev.data.size && chunksRef.current.push(ev.data);
      rec.onstop = async () => {
        clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: kind === 'audio' ? 'audio/webm' : 'video/webm' });
        const file = new File([blob], `live-${kind}-${Date.now()}.webm`, { type: blob.type });
        stream.getTracks().forEach((t) => t.stop());
        setRecState('idle'); setRecSecs(0);
        await sealFileObject(file, `Live ${kind} capture`);
      };
      rec.start();
      setRecState(kind === 'audio' ? 'recording-audio' : 'recording-video');
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
    } catch { alert('Microphone/camera unavailable or permission denied.'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); };
  const resetFlow = () => { setUploadState('idle'); setFileMeta(null); setFileHash(''); setSealedBlock(null); setVerifyResult(null); };
  const unlockSubmit = (e) => {
    e.preventDefault();
    if (pinInput === getVaultPin()) { setUnlocked(true); setGateError(''); }
    else setGateError('Incorrect PIN. Try again.');
  };
  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <button onClick={() => navigate('/')} style={backBtn}><ArrowLeft size={20} /> Back</button>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <KeyRound size={44} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Evidence Vault Locked</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>Controlled access: enter your vault PIN.</p>
            {!getVaultPin() ? (
              <form onSubmit={(e) => { e.preventDefault(); if (newPin.length >= 4) { setVaultPin(newPin); setUnlocked(true); } }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>First-time setup: create a PIN (min 4 digits)</p>
                <input value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" placeholder="...." style={pinStyle} />
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}>Create PIN and Unlock</button>
              </form>
            ) : (
              <form onSubmit={unlockSubmit}>
                <input value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" placeholder="Enter PIN" style={pinStyle} />
                {gateError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.5rem' }}>{gateError}</p>}
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}>Unlock Vault</button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/')} style={backBtn}><ArrowLeft size={20} /> Back</button>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span className="glass-panel" style={{ padding: '0.4rem 0.9rem' }}>{stats.count} sealed</span>
          <button onClick={() => { setVaultPin(''); setUnlocked(false); setPinInput(''); setNewPin(''); }} style={chipBtn}><Lock size={14} /> Reset PIN</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={iconBadge}><Database size={26} color="var(--primary-color)" /></div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Blockchain Evidence Vault</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Audio, video, photo, location - SHA-256 hashed and chained</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', margin: '1.25rem 0' }}>
            <label style={fieldLabel}>Case note (optional)
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. incident near MG Road, 9:40pm" style={inputStyle} />
            </label>
            <label style={fieldLabel}>Share with (controlled access)
              <input value={grantees} onChange={(e) => setGrantees(e.target.value)} placeholder="legal-aid-ngo, family" style={inputStyle} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={includeLocation} onChange={(e) => setIncludeLocation(e.target.checked)} />
              <MapPin size={15} /> Attach GPS location + timestamp
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={capture} style={chipBtn}><MapPin size={14} /> {locStatus === 'fetching' ? 'Locating...' : loc ? `GPS ${loc.lat}, ${loc.lng}` : 'Capture GPS'}</button>
              {recState === 'idle' ? (
                <span style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startRecording('audio')} style={chipBtn}><Mic size={14} /> Record audio</button>
                  <button onClick={() => startRecording('video')} style={chipBtn}><Video size={14} /> Record video</button>
                </span>
              ) : (
                <button onClick={stopRecording} style={{ ...chipBtn, borderColor: '#ef4444', color: '#f87171' }}>Recording {recSecs}s - stop and seal</button>
              )}
            </div>
          </div>


          <AnimatePresence mode="wait">
            {uploadState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label style={uploadBox}>
                  <Upload size={36} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>Upload audio / video / photo / log</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hashed locally - raw file stays on device</span>
                  <input ref={fileRef} type="file" accept={ACCEPT} style={{ display: 'none' }} onChange={handleFileSelect} />
                </label>
              </motion.div>
            )}
            {(uploadState === 'hashing' || uploadState === 'sealing') && (
              <motion.div key="busy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Lock size={52} color="var(--secondary-color)" style={{ margin: '0 auto 1rem' }} />
                </motion.div>
                <h3 style={{ fontWeight: 700 }}>{uploadState === 'hashing' ? 'Computing real SHA-256...' : 'Sealing block...'}</h3>
                {fileMeta && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{fileMeta.name} - {(fileMeta.size / 1024).toFixed(1)} KB</p>}
                {fileHash && <div style={hashBox}><strong>SHA-256:</strong><br />{fileHash}</div>}
              </motion.div>
            )}
            {uploadState === 'success' && sealedBlock && (
              <motion.div key="done" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircle2 size={52} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                  <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#22c55e' }}>Evidence Sealed</h3>
                </div>
                <div style={receiptBox}>
                  <Row icon={<FileText size={15} />} label="File" value={`${sealedBlock.fileName} (${(sealedBlock.fileSize / 1024).toFixed(1)} KB)`} mono={false} />
                  <Row icon={<Fingerprint size={15} />} label="SHA-256" value={sealedBlock.fileHash} />
                  <Row icon={<ShieldCheck size={15} />} label="Block hash" value={sealedBlock.blockHash} green />
                  <Row icon={<ShieldCheck size={15} />} label="TX / Evidence ID" value={sealedBlock.txHash} green />
                  <Row icon={<Lock size={15} />} label="Prev hash link" value={sealedBlock.prevHash} />
                  <Row icon={<MapPin size={15} />} label="Location" value={sealedBlock.location ? `${sealedBlock.location.lat}, ${sealedBlock.location.lng}` : 'not attached'} mono={false} />
                  <Row icon={<Users size={15} />} label="Access" value={sealedBlock.accessList.join(', ')} mono={false} />
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                  <button onClick={resetFlow} className="btn-secondary" style={{ flex: 1, padding: '0.8rem' }}>Seal another</button>
                  <button onClick={() => downloadJson(`evidence-${sealedBlock.txHash}.json`, sealedBlock)} style={{ ...chipBtn, flex: 1, justifyContent: 'center' }}><Download size={14} /> Export certificate</button>
                </div>
                {cloudMsg && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>{cloudMsg}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#22c55e" /> Sealed Ledger ({chain.length})
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleVerifyChain} disabled={verifying || !chain.length} style={chipBtn}>
                  <RefreshCw size={14} /> {verifying ? 'Verifying...' : 'Verify chain'}
                </button>
                <button onClick={() => refreshCloud()} disabled={cloudLoading} style={chipBtn}>
                  <RefreshCw size={14} /> {cloudLoading ? 'Syncing…' : `Cloud (${cloudBlocks.length})`}
                </button>
                {chain.length > 0 && (
                  <button onClick={() => downloadJson('guardian-evidence-ledger.json', chain)} style={chipBtn}><Download size={14} /> Backup</button>
                )}
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {useEmulators && !isFirebaseConfigured
                ? 'Firebase target: local emulator (127.0.0.1). Run `npm run emulators`.'
                : isFirebaseConfigured
                  ? ('Firebase target: cloud project (' + (user?.uid ? 'signed in' : 'connecting…') + ').')
                  : 'Firebase target: none — local ledger only.'}
            </p>
            {chainStatus && (
              <div style={{ ...hashBox, borderColor: chainStatus.ok ? '#22c55e' : '#ef4444', color: chainStatus.ok ? '#86efac' : '#fca5a5' }}>
                {chainStatus.ok ? `Chain intact - ${chainStatus.results.length} block(s) verified.` : 'Chain broken - possible tampering.'}
              </div>
            )}
            {!chain.length && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No evidence sealed yet.</p>}
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem', maxHeight: '320px', overflow: 'auto' }}>
              {[...chain].reverse().map((b) => (
                <div key={b.txHash} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.9rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem' }}>#{b.index} - {b.fileName}</strong>
                    <button title="Remove (demo)" onClick={() => setChain(deleteBlock(b.txHash))} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#818cf8', wordBreak: 'break-all', marginTop: '0.35rem' }}>{b.txHash}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(b.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Eye size={20} color="var(--primary-color)" /> Independent Verification
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Re-hash any file and compare to sealed SHA-256.</p>
            <label style={fieldLabel}>Suspect file
              <input type="file" accept={ACCEPT} onChange={(e) => { setVerifyFile(e.target.files?.[0] || null); setVerifyResult(null); }} style={{ ...inputStyle, padding: '0.6rem' }} />
            </label>
            <label style={{ ...fieldLabel, marginTop: '0.75rem' }}>Evidence ID
              <select value={verifyTarget} onChange={(e) => { setVerifyTarget(e.target.value); setVerifyResult(null); }} style={{ ...inputStyle, color: '#fff' }}>
                <option value="">- select sealed evidence -</option>
                {chain.map((b) => <option key={b.txHash} value={b.txHash}>#{b.index} - {b.fileName}</option>)}
              </select>
            </label>
            <button onClick={handleVerifyFile} disabled={!verifyFile || !verifyTarget} className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', opacity: !verifyFile || !verifyTarget ? 0.5 : 1 }}>
              Re-hash and Compare
            </button>
            {verifyResult && (
              <div style={{ ...hashBox, marginTop: '1rem', borderColor: verifyResult.ok ? '#22c55e' : '#ef4444' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: verifyResult.ok ? '#86efac' : '#fca5a5', fontWeight: 700 }}>
                  {verifyResult.ok ? <CheckCircle2 size={17} /> : <XCircle size={17} />} {verifyResult.msg}
                </div>
                {verifyResult.actual && (
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', marginTop: '0.6rem', wordBreak: 'break-all', color: 'var(--text-muted)' }}>
                    computed: {verifyResult.actual}<br />sealed: {verifyResult.expected}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: '.btn-secondary{background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:0.75rem 1.25rem;border-radius:9999px;font-weight:600;cursor:pointer;}' }} />
    </div>
  );
}

function Row(props) {
  const { icon, label, value, mono = true, green = false } = props;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{icon} {label}</div>
      <div style={{ fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? '0.8rem' : '0.9rem', color: green ? '#86efac' : mono ? '#818cf8' : '#fff', wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

const backBtn = { width: 'fit-content', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const pinStyle = { width: '100%', textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' };
const inputStyle = { width: '100%', marginTop: '0.35rem', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.25)', color: '#fff', fontSize: '0.9rem' };
const fieldLabel = { display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' };
const chipBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '9999px', padding: '0.5rem 0.9rem', fontSize: '0.82rem', cursor: 'pointer' };
const iconBadge = { background: 'rgba(99,102,241,0.15)', padding: '0.7rem', borderRadius: '14px' };
const uploadBox = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', padding: '2.5rem 1.5rem', border: '2px dashed var(--primary-color)', borderRadius: '16px', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', textAlign: 'center' };
const hashBox = { background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '10px', wordBreak: 'break-all', fontSize: '0.82rem', color: '#818cf8', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.08)' };
const receiptBox = { textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gap: '0.85rem', marginTop: '1rem' };




