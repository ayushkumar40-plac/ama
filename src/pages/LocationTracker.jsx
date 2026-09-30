import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ArrowLeft, Users, ShieldCheck, Radio, CloudOff, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth.jsx';
import { publishLiveLocation, stopLiveLocation } from '../lib/realtime';
import { isFirebaseConfigured, useEmulators } from '../lib/firebase';

export default function LocationTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [cloudState, setCloudState] = useState('idle');
  const watchId = useRef(null);

  const publishPosition = async (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    const nextLocation = {
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy || 0)
    };
    setLocation(nextLocation);

    if (!user?.uid) return;
    try {
      await publishLiveLocation(user.uid, {
        ...nextLocation,
        tracking: true
      });
      setCloudState('live');
    } catch {
      setCloudState('error');
    }
  };

  const stopTracking = async () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setTracking(false);
    setLocation(null);
    setCloudState('idle');
    if (user?.uid) {
      try { await stopLiveLocation(user.uid); } catch {}
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.');
      return;
    }

    setError('');
    setTracking(true);
    setCloudState(user?.uid ? 'connecting' : 'idle');
    watchId.current = navigator.geolocation.watchPosition(
      (position) => publishPosition(position),
      (locationError) => {
        setError(locationError.message || 'Location permission is required to start live tracking.');
        setTracking(false);
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  };

  const copyCoordLink = async () => {
    if (!location) return;
    try {
      await navigator.clipboard.writeText(`https://maps.google.com/?q=${location.lat},${location.lng}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy the location link.');
    }
  };

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (user?.uid) stopLiveLocation(user.uid).catch(() => {});
  }, [user?.uid]);

  const cloudLabel = cloudState === 'live'
    ? `Streaming to RTDB (${useEmulators && !isFirebaseConfigured ? 'emulator' : 'cloud'})`
    : cloudState === 'error'
      ? 'Cloud sync unavailable; tracking locally'
      : cloudState === 'connecting'
        ? 'Connecting to Firebase...'
        : `RTDB standby (${useEmulators && !isFirebaseConfigured ? 'emulator' : isFirebaseConfigured ? 'cloud' : 'offline'})`;

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
              background: 'var(--primary-glow)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-glow)'
            }}>
              <Navigation size={36} color="var(--primary-light)" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem' }}>Satellite Location Radar</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: '1.5' }}>
            Share your live GPS position with your emergency circle and verified volunteers.
          </p>
          <div role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: '9999px', padding: '0.35rem 0.8rem', marginBottom: '1.25rem' }}>
            {cloudState === 'live' ? <Radio size={13} color="var(--safe-green)" /> : <CloudOff size={13} />}
            {cloudLabel}
          </div>

          {error && <p role="alert" style={{ color: '#e9a0a0', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

          {!tracking ? (
            <button onClick={startTracking} className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              Activate Precision GPS Broadcast
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: '12px', width: '100%', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-light)' }}>
                  <MapPin size={18} /> <span style={{ fontWeight: '700' }}>Active Geolocation Fix</span>
                </div>
                {location ? (
                  <>
                    <p style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      Lat: {location.lat.toFixed(5)}<br />Lng: {location.lng.toFixed(5)}
                    </p>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '6px' }}>
                      Accuracy: +/- {location.accuracy} m
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Waiting for a GPS fix...</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ background: 'rgba(104, 173, 137, 0.16)', padding: '0.65rem', borderRadius: '50%' }}>
                    <ShieldCheck size={22} color="var(--safe-green)" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live location active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ background: 'rgba(125, 174, 181, 0.16)', padding: '0.65rem', borderRadius: '50%' }}>
                    <Users size={22} color="var(--cyan-accent)" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email || 'Signed-in safety account'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
                <button
                  onClick={copyCoordLink}
                  className="btn-secondary"
                  disabled={!location}
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  {copied ? <CheckCircle2 size={16} color="var(--safe-green)" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied Link' : 'Copy GPS Link'}</span>
                </button>
                <button onClick={stopTracking} className="btn-danger" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
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
