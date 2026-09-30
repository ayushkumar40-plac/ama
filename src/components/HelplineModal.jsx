import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { Phone, Shield, X, ExternalLink, HeartHandshake, Award } from 'lucide-react';

export default function HelplineModal() {
  const { helplineModalOpen, setHelplineModalOpen } = useSafety();

  if (!helplineModalOpen) return null;

  const helplines = [
    { name: "National Emergency (Police, Fire, Ambulance)", number: "112", tag: "24/7 Rapid Response", color: "badge-red" },
    { name: "Women's Helpline (All India)", number: "1091", tag: "24/7 Dedicated Support", color: "badge-purple" },
    { name: "National Commission for Women (NCW)", number: "7827170170", tag: "Legal & Crisis Intervention", color: "badge-blue" },
    { name: "Domestic Abuse & Violence Helpline", number: "181", tag: "Confidential Assistance", color: "badge-amber" },
    { name: "National Cyber Crime Helpline (Stalking/Harassment)", number: "1930", tag: "Digital Abuse & Cybercell", color: "badge-green" },
    { name: "SNEHA Crisis Intervention for Women", number: "9833052684", tag: "Verified NGO Partner", color: "badge-purple" },
    { name: "Childline (Support for Minor Girls)", number: "1098", tag: "Emergency Protection", color: "badge-blue" }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99990,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
              <Shield size={24} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Verified 24/7 Helplines</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Direct tap-to-call emergency services</p>
            </div>
          </div>

          <button
            onClick={() => setHelplineModalOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Directory List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {helplines.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${item.color}`} style={{ fontSize: '0.65rem' }}>{item.tag}</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  Dial: {item.number}
                </div>
              </div>

              <a
                href={`tel:${item.number}`}
                className="btn-primary"
                style={{
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Phone size={14} /> Call Now
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
          All calls to 112 & 1091 are free, toll-free, and operational across all states in India & globally.
        </div>
      </div>
    </div>
  );
}
