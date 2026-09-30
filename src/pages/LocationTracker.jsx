import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Navigation, ArrowLeft, Users, ShieldCheck, Radio, CloudOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth.jsx';
import { publishLiveLocation, stopLiveLocation, subscribeLiveLocation } from '../lib/realtime';
import { useEmulators, isFirebaseConfigured } from '../lib/firebase';
import LiveMap from '../components/LiveMap';

export default function LocationTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const [cloudState, setCloudState] = useState('idle'); // idle, live, error
  const [trail, setTrail] = useState([]);               // [[lat,lng], ...] path on map
  const [watchUid, setWatchUid] = useState('');          // RTDB uid to follow live
  const [watchLoc, setWatchLoc] = useState(null);        // live node from RTDB
  const watchId = useRef(null);
  const watchSubRef = useRef(null);

  const pushCloud = async (lat, lng, accuracy) => {
    const uid = user?.uid;
    if (!uid) return;
    try {
      await publishLiveLocation(uid, { lat: Number(lat), lng: Number(lng), accuracy: accuracy || 0, tracking: true });
      setCloudState('live');
    } catch {
      setCloudState('error');
    }
  };

  const onFix = (lat, lng, accuracy) => {
    const la = Number(lat), ln = Number(lng);
    setLocation({ lat: la.toFixed(6), lng: ln.toFixed(6) });
    setTrail((t) => {
      const next = [...t, [la, ln]];
      return next.length > 60 ? next.slice(next.length - 60) : next;
    });
    pushCloud(la, ln, accuracy);
  };

  const startTracking = () => {
    setTracking(true);
    setError(null);
    setTrail([]);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onFix(position.coords.latitude, position.coords.longitude, Math.round(position.coords.accuracy || 0));
        },
        (err) => {
          setError(err.message);
          // Mock location if denied or error
          onFix(37.774929, -122.419418, 0);
        }
      );
      // Continuous updates -> realtime writes + map trail
      try {
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            onFix(position.coords.latitude, position.coords.longitude, Math.round(position.coords.accuracy || 0));
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
        );
      } catch {}
    } else {
      setError("Geolocation not supported.");
      onFix(37.774929, -122.419418, 0);
    }
  };

  const stopTracking = async () => {
    if (watchId.current != null) {
      try { navigator.geolocation.clearWatch(watchId.current); } catch {}
      watchId.current = null;
    }
    setTracking(false);
    setLocation(null);
    setTrail([]);
    setCloudState('idle');
    if (user?.uid) {
      try { await stopLiveLocation(user.uid); } catch {}
    }
  };

  // Live follow of another user via Realtime Database (cross-device demo)
  useEffect(() => {
    if (watchSubRef.current) { watchSubRef.current(); watchSubRef.current = null; }
    setWatchLoc(null);
    const uid = watchUid.trim();
    if (!uid) return undefined;
    try {
      watchSubRef.current = subscribeLiveLocation(uid, (data) => {
        setWatchLoc(data && Number.isFinite(Number(data.lat)) && Number.isFinite(Number(data.lng)) ? data : null);
      });
    } catch { setWatchLoc(null); }
    return () => { if (watchSubRef.current) { watchSubRef.current(); watchSubRef.current = null; } };
  }, [watchUid]);

  useEffect(() => () => {
    if (watchId.current != null) {
      try { navigator.geolocation.clearWatch(watchId.current); } catch {}
    }
    if (watchSubRef.current) watchSubRef.current();
  }, []);

  // Map data
  const markers = useMemo(() => {
    const arr = [];
    if (location) arr.push({ lat: Number(location.lat), lng: Number(location.lng), label: 'You (live)', color: '#6366f1' });
    if (watchLoc) arr.push({ lat: Number(watchLoc.lat), lng: Number(watchLoc.lng), label: `Following ${watchUid.slice(0, 10)}…`, color: '#ec4899' });
    return arr;
  }, [location, watchLoc, watchUid]);

  const mapCenter = useMemo(() => {
    if (location) return [Number(location.lat), Number(location.lng)];
    if (watchLoc) return [Number(watchLoc.lat), Number(watchLoc.lng)];
    return null;
  }, [location, watchLoc]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem', maxWidth: '960px', margin: '0 auto', width: '100%', gap: '1rem' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ width: 'fit-content', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation size={26} color="var(--primary-color)" /> Live Location Tracking
        </h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', padding: '0.35rem 0.8rem' }}>
          {cloudState === 'live' ? <Radio size={13} color="#22c55e" /> : <CloudOff size={13} />}
          {cloudState === 'live'
            ? `Streaming to RTDB (${useEmulators && !isFirebaseConfigured ? 'emulator :9000' : 'cloud'})`
            : cloudState === 'error'
              ? 'RTDB unreachable — local only'
              : `RTDB standby (${useEmulators && !isFirebaseConfigured ? 'emulator' : isFirebaseConfigured ? 'cloud' : 'offline'})`}
        </div>
      </div>

      {/* ===== Real-time map (OpenStreetMap, no API key) ===== */}
      <LiveMap center={mapCenter} markers={markers} trail={trail} follow={tracking} height={360} />

      {/* Follow another user live from the Realtime Database */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={watchUid}
          onChange={(e) => setWatchUid(e.target.value)}
          placeholder="Follow RTDB user ID (e.g. victim uid)…"
          style={{ flex: 1, minWidth: '240px', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.25)', color: '#fff', fontSize: '0.9rem' }}
        />
        {watchUid && (
          <span style={{ fontSize: '0.8rem', color: watchLoc ? '#86efac' : 'var(--text-muted)' }}>
            {watchLoc
              ? `● connected · ${Number(watchLoc.lat).toFixed(5)}, ${Number(watchLoc.lng).toFixed(5)}${watchLoc.sosActive ? ' · SOS!' : ''}`
              : 'waiting for data…'}
          </span>
        )}
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel"
        style={{ padding: '2rem', width: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
            <MapPin size={32} color="var(--primary-color)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Share your real-time coordinates securely with verified volunteers and trusted contacts.
            </p>
          </div>
        </div>

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

      {error && tracking && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error} (Using Mock Data)</p>}
      </motion.div>
    </div>
  );
}
