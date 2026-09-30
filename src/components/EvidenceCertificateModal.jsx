import React from 'react';
import { Shield, CheckCircle, FileText, Download, X, Printer, Lock } from 'lucide-react';

export default function EvidenceCertificateModal({ record, onClose }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99995,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#090d16',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        position: 'relative',
        padding: '2.5rem'
      }} className="printable-certificate">
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }} className="no-print">
          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Printer size={14} /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Watermark Header */}
        <div style={{
          borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Shield size={24} color="#818cf8" />
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Guardian<span className="text-gradient">Safe</span> Evidence Vault
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              DECENTRALIZED CHAIN-OF-CUSTODY ATTESTATION
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              <CheckCircle size={12} /> ON-CHAIN VERIFIED
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              REF: {record.id}
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Evidence Item Title
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
              {record.title}
            </div>
          </div>

          {/* Grid Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>FILE TYPE & SIZE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0' }}>
                {record.fileType} ({record.fileSize})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>IMMUTABLE TIMESTAMP</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0' }}>
                {record.timestamp}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>GEOTAG / LOCATION</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0' }}>
                {record.location}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ETHEREUM BLOCK HEIGHT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                #{record.blockNumber}
              </div>
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ color: '#818cf8', fontWeight: '700', marginBottom: '2px' }}>
                SHA-256 DIGITAL EVIDENCE DIGEST:
              </div>
              <div style={{ color: '#f8fafc', wordBreak: 'break-all' }}>
                {record.sha256Hash}
              </div>
            </div>

            <div>
              <div style={{ color: '#818cf8', fontWeight: '700', marginBottom: '2px' }}>
                ON-CHAIN TRANSACTION HASH:
              </div>
              <div style={{ color: '#94a3b8', wordBreak: 'break-all' }}>
                {record.txHash}
              </div>
            </div>

            <div>
              <div style={{ color: '#818cf8', fontWeight: '700', marginBottom: '2px' }}>
                IPFS DECENTRALIZED CONTENT IDENTIFIER (CID):
              </div>
              <div style={{ color: '#94a3b8', wordBreak: 'break-all' }}>
                {record.ipfsCid}
              </div>
            </div>
          </div>

          {/* Smart Contract Access Permissions */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              SMART CONTRACT ACCESS CONTROL DISCLOSURES:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${record.grants.legalAid ? 'badge-green' : 'badge-red'}`}>
                {record.grants.legalAid ? '✓ Granted' : '✕ Revoked'}: Women Legal Aid Counsel
              </span>
              <span className={`badge ${record.grants.policeCell ? 'badge-green' : 'badge-red'}`}>
                {record.grants.policeCell ? '✓ Granted' : '✕ Revoked'}: Police Women Cybercell
              </span>
              <span className={`badge ${record.grants.ngoCounsel ? 'badge-green' : 'badge-red'}`}>
                {record.grants.ngoCounsel ? '✓ Granted' : '✕ Revoked'}: Verified NGO Crisis Center
              </span>
            </div>
          </div>

          {/* Legal attestation footer */}
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.72rem',
            color: '#64748b',
            lineHeight: '1.5'
          }}>
            This certificate is generated by the GuardianSafe Decentralized Protocol under Section 65B Indian Evidence Act / Uniform Electronic Evidence Standards. The SHA-256 hash was cryptographically anchored at Ethereum Block #{record.blockNumber}, ensuring tamper-proof integrity and complete non-repudiation.
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-certificate, .printable-certificate * {
            visibility: visible;
          }
          .printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
