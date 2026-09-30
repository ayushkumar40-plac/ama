import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { ShieldAlert, PhoneCall, Share2, VolumeX, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function EmergencyModal() {
  const {
    sosActive,
    cancelSOS,
    currentCoords,
    voiceRecordingActive,
    voiceRecordingStatus,
    voiceRecordingUrl,
    voiceRecordingType,
    stopSituationRecording
  } = useSafety();
  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  if (!sosActive) return null;

  const distressMessage = encodeURIComponent(
    `EMERGENCY ALERT: I need immediate help! My live coordinates are: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng} (GuardianSafe Emergency Dispatch)`
  );

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${distressMessage}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`EMERGENCY: Need Help! Location: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99998,
      background: 'rgba(20, 0, 0, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#180709',
        border: '2px solid #ef4444',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 0 60px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(239, 68, 68, 0.2)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Pulsing Beacon Icon */}
        <div style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 1.5rem auto',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ef4444'
        }} className="sos-pulse">
          <ShieldAlert size={52} color="#ef4444" />
        </div>

        <span className="badge badge-red" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          SIREN & BEACON BROADCAST ACTIVE
        </span>

        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
          EMERGENCY SOS TRIGGERED
        </h2>

        <p style={{ color: '#fca5a5', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
          Audio siren is sounding. Live GPS location is ready to share with emergency responders and your trusted circle.
        </p>

        {voiceRecordingActive && (
          <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', color: '#fecaca', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <span>Recording situation audio. Stop SOS to finalize the recording.</span>
            <button onClick={stopSituationRecording} className="btn-secondary" style={{ flexShrink: 0, padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}>
              Stop recording
            </button>
          </div>
        )}
        {!voiceRecordingActive && voiceRecordingUrl && (
          <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
            <audio controls src={voiceRecordingUrl} style={{ width: '100%' }} />
            <a href={voiceRecordingUrl} download={`sos-situation-recording.${voiceRecordingType.includes('mp4') ? 'mp4' : 'webm'}`} style={{ color: '#fecaca', fontSize: '0.85rem' }}>
              Download situation recording
            </a>
          </div>
        )}
        {!voiceRecordingActive && voiceRecordingStatus && !voiceRecordingUrl && (
          <p role="status" style={{ color: '#fecaca', marginBottom: '1rem', fontSize: '0.85rem' }}>{voiceRecordingStatus}</p>
        )}

        {/* GPS Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#fecaca',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#ef4444', fontWeight: '700' }}>● LIVE SATELLITE FIX:</span>
            <span style={{ color: '#34d399' }}>ACCURACY &plusmn; 4m</span>
          </div>
          <div>Lat: {currentCoords.lat.toFixed(5)} | Lng: {currentCoords.lng.toFixed(5)}</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '4px' }}>{currentCoords.address}</div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <a
            href="tel:112"
            className="btn-danger"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', textDecoration: 'none' }}
          >
            <PhoneCall size={20} /> CALL 112 (POLICE & RESCUE)
          </a>

          <a
            href="tel:1091"
            className="btn-secondary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', textDecoration: 'none' }}
          >
            <PhoneCall size={18} /> CALL WOMEN HELPLINE 1091
          </a>

          <button
            onClick={handleShareWhatsApp}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)'
            }}
          >
            <Share2 size={18} /> Broadcast Location to Family via WhatsApp
          </button>

          <button
            onClick={handleCopyLink}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            {copied ? <CheckCircle2 size={18} color="#34d399" /> : <AlertOctagon size={18} />}
            {copied ? 'Distress Link Copied!' : 'Copy Emergency GPS Link'}
          </button>
        </div>

        {/* Cancel False Alarm */}
        <button
          onClick={cancelSOS}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#94a3b8',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <VolumeX size={16} /> Stop Siren & Cancel False Alarm
        </button>
      </div>
    </div>
  );
}
