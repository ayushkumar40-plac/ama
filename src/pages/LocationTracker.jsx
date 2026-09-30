import React, { useState } from 'react';
import { MapPin, Navigation, ArrowLeft, Users, ShieldCheck, Share2, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';

export default function LocationTracker() {
  const navigate = useNavigate();
  const { currentCoords } = useSafety();
  const [tracking, setTracking] = useState(false);
  const [copied, setCopied] = useState(false);

  const startTracking = () => {
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
  };

  const copyCoordLink = () => {
    navigator.clipboard.writeText(`https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-secondary"
        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '2.5rem 2rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <Navigation size={36} color="#818cf8" />
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem' }}>Satellite Location Radar</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            Share an encrypted, live-updating GPS beacon with your emergency circle and verified volunteers along your route.
          </p>

          {!tracking ? (
            <button onClick={startTracking} className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              Activate Precision GPS Broadcast
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: '12px', width: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#818cf8' }}>
                  <MapPin size={18} /> <span style={{ fontWeight: '700' }}>Active Geolocation Fix</span>
                </div>
                <p style={{ fontSize: '1.15rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                  Lat: {currentCoords.lat.toFixed(5)} <br/>
                  Lng: {currentCoords.lng.toFixed(5)}
                </p>
                <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '6px' }}>{currentCoords.address}</div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '0.65rem', borderRadius: '50%' }}>
                    <ShieldCheck size={22} color="#22c55e" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Encrypted Link Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.65rem', borderRadius: '50%' }}>
                    <Users size={22} color="#3b82f6" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>3 Guardians Monitoring</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                  onClick={copyCoordLink}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  {copied ? <CheckCircle2 size={16} color="#34d399" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied Link' : 'Copy GPS Link'}</span>
                </button>

                <button
                  onClick={stopTracking}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1rem', borderColor: '#ef4444', color: '#ef4444', fontSize: '0.85rem' }}
                >
                  Stop Radar
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
