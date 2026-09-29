import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LocationTracker() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  const startTracking = () => {
    setTracking(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
        },
        (err) => {
          setError(err.message);
          // Mock location if denied or error
          setLocation({ lat: "37.774929", lng: "-122.419418" });
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLocation({ lat: "37.774929", lng: "-122.419418" });
    }
  };

  const stopTracking = () => {
    setTracking(false);
    setLocation(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ width: 'fit-content', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Navigation size={48} color="var(--primary-color)" />
            </div>
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Live Location Tracking</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Share your real-time coordinates securely with verified volunteers and trusted contacts.
          </p>

          {!tracking ? (
            <button onClick={startTracking} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Start Live Tracking
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#818cf8' }}>
                  <MapPin size={20} /> <span style={{ fontWeight: 'bold' }}>Current Coordinates</span>
                </div>
                {location ? (
                  <p style={{ fontSize: '1.25rem', fontFamily: 'monospace' }}>Lat: {location.lat} <br/> Lng: {location.lng}</p>
                ) : (
                  <p>Acquiring GPS signal...</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                    <ShieldCheck size={24} color="#22c55e" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Secure Link Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                    <Users size={24} color="#3b82f6" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>3 Contacts Viewing</span>
                </div>
              </div>

              <button onClick={stopTracking} className="btn-secondary" style={{ marginTop: '1rem', borderColor: '#ef4444', color: '#ef4444' }}>
                Stop Tracking
              </button>
            </div>
          )}

          {error && tracking && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>{error} (Using Mock Data)</p>}
        </motion.div>
      </div>
    </div>
  );
}
