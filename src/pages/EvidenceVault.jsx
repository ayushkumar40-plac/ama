import React, { useState } from 'react';
import { useSafety, computeSHA256 } from '../context/SafetyContext';
import {
  Lock,
  Upload,
  ShieldCheck,
  FileCheck,
  Eye,
  Trash2,
  FileAudio,
  FileVideo,
  FileText,
  KeyRound,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Fingerprint
} from 'lucide-react';
import EvidenceCertificateModal from '../components/EvidenceCertificateModal';

export default function EvidenceVault() {
  const { evidenceRecords, addEvidenceToVault, toggleGrant } = useSafety();

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('audio');
  const [locationTag, setLocationTag] = useState('Bandra West Junction, Mumbai');
  const [isHashing, setIsHashing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Verification Tool State
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Certificate Modal
  const [activeCert, setActiveCert] = useState(null);

  // Filter tabs
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'upload' | 'verify'

  // Handle File Selection for Upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Submit Evidence to Blockchain Vault
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsHashing(true);
    setUploadSuccess(null);

    try {
      const newRec = await addEvidenceToVault({
        title: title || 'Secured Incident Evidence',
        file: selectedFile,
        location: locationTag,
        category
      });

      setIsHashing(false);
      setUploadSuccess(newRec);
      setSelectedFile(null);
      setTitle('');
      // Auto switch back to records after 2s
      setTimeout(() => setActiveTab('records'), 2000);
    } catch (err) {
      console.error(err);
      setIsHashing(false);
    }
  };

  // Handle Integrity Verification Check
  const handleVerifyCheck = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setVerifyFile(file);
    setIsVerifying(true);
    setVerifyResult(null);

    const calculatedHash = await computeSHA256(file);
    const matchedRecord = evidenceRecords.find(r => r.sha256Hash.toLowerCase() === calculatedHash.toLowerCase());

    setTimeout(() => {
      setIsVerifying(false);
      if (matchedRecord) {
        setVerifyResult({
          matched: true,
          hash: calculatedHash,
          record: matchedRecord,
          message: `100% UNTAMPERED! Matches on-chain Block #${matchedRecord.blockNumber}`
        });
      } else {
        setVerifyResult({
          matched: false,
          hash: calculatedHash,
          message: 'TAMPER WARNING: This file does not match any anchored hash on the ledger.'
        });
      }
    }, 600);
  };

  const getFileIcon = (type) => {
    if (type?.includes('audio')) return <FileAudio size={22} color="#ec4899" />;
    if (type?.includes('video')) return <FileVideo size={22} color="#818cf8" />;
    return <FileText size={22} color="#38bdf8" />;
  };

  return (
    <div className="app-container">
      {/* Top Banner / Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">
            <Lock size={12} /> SECURE CRYPTOGRAPHIC LEDGER
          </span>
          <span className="badge badge-green">
            <Fingerprint size={12} /> SECTION 65B COMPLIANT
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Blockchain <span className="text-gradient">Evidence Vault</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '850px', lineHeight: '1.5' }}>
          A zero-knowledge sanctuary for victims to securely preserve audio, video, dashcam, and geotagged incident evidence. Files are cryptographically hashed using SHA-256 and anchored to decentralized smart contracts, guaranteeing tamper-proof legal admissibility while granting you 100% sovereign control over who accesses your data.
        </p>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.75rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} color="#818cf8" /> Anchored Evidence Items
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {evidenceRecords.length} Files
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
              ✓ Immutable & Tamper-Proof
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={16} color="#ec4899" /> Smart Contract Access
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              Sovereign
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '4px' }}>
              Revocable at any moment
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} color="#38bdf8" /> Storage Architecture
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              IPFS + EVM
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
              Zero-Knowledge Privacy
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.75rem'
      }}>
        <button
          onClick={() => setActiveTab('records')}
          style={{
            background: activeTab === 'records' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: activeTab === 'records' ? '1px solid #818cf8' : '1px solid transparent',
            color: activeTab === 'records' ? '#fff' : 'var(--text-muted)',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Database size={16} /> My Secured Evidence ({evidenceRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          style={{
            background: activeTab === 'upload' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: activeTab === 'upload' ? '1px solid #818cf8' : '1px solid transparent',
            color: activeTab === 'upload' ? '#fff' : 'var(--text-muted)',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Upload size={16} /> Upload & Anchor New Evidence
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          style={{
            background: activeTab === 'verify' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: activeTab === 'verify' ? '1px solid #818cf8' : '1px solid transparent',
            color: activeTab === 'verify' ? '#fff' : 'var(--text-muted)',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={16} /> Verify File Integrity
        </button>
      </div>

      {/* TAB 1: Evidence Records & Smart Contract Permissions */}
      {activeTab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Active Cryptographic Ledger</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Manage who can decrypt and view each piece of evidence using on-chain smart contracts.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Upload size={16} /> Add Evidence
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {evidenceRecords.map((record) => (
              <div
                key={record.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getFileIcon(record.fileType)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{record.title}</h3>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                          <ShieldCheck size={12} /> Block #{record.blockNumber}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                        {record.fileType} • {record.fileSize} • Geotag: {record.location}
                      </div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '2px' }}>
                        Anchored at: {record.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveCert(record)}
                      className="btn-secondary"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                      title="View Section 65B Audit Certificate"
                    >
                      <FileCheck size={15} color="#818cf8" />
                      <span>Legal Certificate</span>
                    </button>
                  </div>
                </div>

                {/* Hashes and Storage Details */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.9rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#818cf8', fontWeight: '600' }}>SHA-256 DIGEST:</span>
                    <span style={{ color: '#f8fafc', wordBreak: 'break-all' }}>{record.sha256Hash}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#ec4899', fontWeight: '600' }}>IPFS CID:</span>
                    <span style={{ color: '#cbd5e1', wordBreak: 'break-all' }}>{record.ipfsCid}</span>
                  </div>
                </div>

                {/* Smart Contract Access Control Matrix */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <KeyRound size={16} color="#818cf8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Smart Contract Access Permissions (Controlled by You)
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {/* Grant 1: Legal Aid */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Legal Aid Counsel</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bar Council Verified</div>
                      </div>
                      <button
                        onClick={() => toggleGrant(record.id, 'legalAid')}
                        style={{
                          background: record.grants.legalAid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                          color: record.grants.legalAid ? '#34d399' : '#f87171',
                          border: `1px solid ${record.grants.legalAid ? '#10b981' : '#ef4444'}`,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {record.grants.legalAid ? '✓ Granted' : '✕ Revoked'}
                      </button>
                    </div>

                    {/* Grant 2: Police Cyber/Women Cell */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Police Women Cell</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FIR Investigation Unit</div>
                      </div>
                      <button
                        onClick={() => toggleGrant(record.id, 'policeCell')}
                        style={{
                          background: record.grants.policeCell ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                          color: record.grants.policeCell ? '#34d399' : '#f87171',
                          border: `1px solid ${record.grants.policeCell ? '#10b981' : '#ef4444'}`,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {record.grants.policeCell ? '✓ Granted' : '✕ Revoked'}
                      </button>
                    </div>

                    {/* Grant 3: NGO Crisis Center */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>SNEHA Crisis NGO</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Advocacy & Support</div>
                      </div>
                      <button
                        onClick={() => toggleGrant(record.id, 'ngoCounsel')}
                        style={{
                          background: record.grants.ngoCounsel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                          color: record.grants.ngoCounsel ? '#34d399' : '#f87171',
                          border: `1px solid ${record.grants.ngoCounsel ? '#10b981' : '#ef4444'}`,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {record.grants.ngoCounsel ? '✓ Granted' : '✕ Revoked'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Upload & Hash Evidence */}
      {activeTab === 'upload' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.15)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Upload size={28} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Anchor Evidence on Blockchain
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Files are cryptographically hashed directly on your device. The raw file is securely encrypted, and only its mathematical fingerprint (SHA-256) is anchored to the decentralized ledger.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* File Dropzone */}
              <div style={{
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.5)',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                  accept="audio/*,video/*,image/*,application/pdf"
                />
                <Upload size={36} color="#818cf8" style={{ margin: '0 auto 0.75rem auto' }} />
                {selectedFile ? (
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '1.1rem' }}>{selectedFile.name}</div>
                    <div style={{ color: '#34d399', fontSize: '0.85rem', marginTop: '4px' }}>
                      Ready to compute SHA-256 ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff' }}>Click or Drag Audio, Video, or Incident Evidence</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
                      Supports MP3, MP4, WAV, JPG, PNG, PDF (Up to 500MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                  Evidence Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Stalking Audio & Photo Proof"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category & Geotag */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                    Incident Evidence Category
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="audio">Audio Voice Note / Harassment Recording</option>
                    <option value="video">Video Footage / Dashcam Clip</option>
                    <option value="photo">Photo Evidence / Number Plate</option>
                    <option value="route">GPS Location Route Logs</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                    Location / Landmark Geotag
                  </label>
                  <input
                    type="text"
                    value={locationTag}
                    onChange={(e) => setLocationTag(e.target.value)}
                    placeholder="e.g. Andheri West Platform 2"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isHashing || !selectedFile}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '1.05rem' }}
              >
                {isHashing ? 'Computing Cryptographic SHA-256 & Anchoring...' : '🔒 Anchor to Blockchain & Encrypt'}
              </button>
            </form>

            {uploadSuccess && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={24} color="#34d399" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: '700', color: '#34d399' }}>Evidence Successfully Anchored On-Chain!</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Block #{uploadSuccess.blockNumber} • Hash: {uploadSuccess.sha256Hash.slice(0, 24)}...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Verify Integrity */}
      {activeTab === 'verify' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <ShieldCheck size={28} color="#34d399" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Tamper-Proof Integrity Verifier
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Lawyers, police officers, and victims can upload any media file here. We recalculate its SHA-256 digest in real-time and verify whether it matches the immutable blockchain record.
              </p>
            </div>

            <div style={{
              border: '2px dashed rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.5)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                onChange={handleVerifyCheck}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
              <FileCheck size={36} color="#34d399" style={{ margin: '0 auto 0.75rem auto' }} />
              <div>
                <div style={{ fontWeight: '600', color: '#fff' }}>Drop file here to verify on-chain authenticity</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
                  Audio, Video, PDF, or Photo
                </div>
              </div>
            </div>

            {isVerifying && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#818cf8', fontWeight: '600' }}>
                Recalculating cryptographic SHA-256 digest & querying smart contract ledger...
              </div>
            )}

            {verifyResult && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: verifyResult.matched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${verifyResult.matched ? '#10b981' : '#ef4444'}`,
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                  {verifyResult.matched ? (
                    <CheckCircle2 size={28} color="#34d399" />
                  ) : (
                    <AlertTriangle size={28} color="#ef4444" />
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: verifyResult.matched ? '#34d399' : '#f87171' }}>
                      {verifyResult.message}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '2px', wordBreak: 'break-all' }}>
                      Calculated Digest: {verifyResult.hash}
                    </div>
                  </div>
                </div>

                {verifyResult.matched && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                      Anchored Title: <strong>{verifyResult.record.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Timestamp: {verifyResult.record.timestamp} • Geotag: {verifyResult.record.location}
                    </div>
                    <button
                      onClick={() => setActiveCert(verifyResult.record)}
                      className="btn-emerald"
                      style={{ marginTop: '0.85rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      View & Print Section 65B Certificate
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 65B Modal */}
      {activeCert && (
        <EvidenceCertificateModal
          record={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
}
