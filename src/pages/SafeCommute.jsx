import React, { useState, useEffect } from 'react';
import {
  Car,
  Shield,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Share2,
  PhoneCall,
  CheckCircle2,
  Navigation,
  Clock,
  Radio,
  Copy,
  Users,
  Volume2
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { useNavigate } from 'react-router-dom';

export default function SafeCommute() {
  const navigate = useNavigate();
  const { triggerSOS } = useSafety();

  // Ride verification state
  const [vehiclePlate, setVehiclePlate] = useState('MH 02 CR 4482');
  const [driverName, setDriverName] = useState('Sanjay Verma');
  const [cabService, setCabService] = useState('Uber / Ola Premium');
  const [verificationStatus, setVerificationStatus] = useState('verified'); // 'idle' | 'checking' | 'verified'

  // Live Trip Shield State
  const [tripActive, setTripActive] = useState(false);
  const [progress, setProgress] = useState(25);
  const [driftDetected, setDriftDetected] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulate Trip Progress when active
  useEffect(() => {
    let interval;
    if (tripActive && progress < 100 && !driftDetected) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 2, 98));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [tripActive, progress, driftDetected]);

  const handleVerify = (e) => {
    e.preventDefault();
    setVerificationStatus('checking');
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 1200);
  };

  const handleStartTrip = () => {
    setTripActive(true);
    setDriftDetected(false);
    setProgress(30);
  };

  const simulateRouteDrift = () => {
    setDriftDetected(true);
  };

  const copyTripLink = () => {
    navigator.clipboard.writeText(`https://guardiansafe.app/track/trip-4482-live`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTripWhatsApp = () => {
    const text = encodeURIComponent(
      `I am traveling in vehicle ${vehiclePlate} (${cabService}) driven by ${driverName}. Monitor my live trajectory here: https://guardiansafe.app/track/trip-4482-live`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">
            <Car size={12} /> COMMUTE AUTHENTICATION ENGINE
          </span>
          <span className="badge badge-green">
            REAL-TIME FAMILY RADAR
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Safe Commute <span className="text-gradient">Verification</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '850px' }}>
          Verify cab and driver credentials against police registries before boarding. Activate Ride Shield to continuously monitor your route with automated route-drift detection and instant family broadcast.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {/* LEFT COLUMN: Cab Authentication Scanner & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} color="#818cf8" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Ride & Vehicle Authentication</h3>
            </div>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Vehicle License Plate
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH 02 CR 4482 or DL 1T 9920"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  required
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', letterSpacing: '1px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Driver Name (from app)
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Transit Service
                  </label>
                  <select value={cabService} onChange={(e) => setCabService(e.target.value)}>
                    <option value="Uber / Ola Premium">Uber / Ola</option>
                    <option value="Auto Rickshaw / Metered Taxi">Auto Rickshaw</option>
                    <option value="BluSmart EV Cab">BluSmart EV</option>
                    <option value="Rapido / Bike Taxi">Bike Taxi</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem' }}
              >
                {verificationStatus === 'checking' ? 'Querying Police & Transport Registry...' : 'Authenticate Ride Credentials'}
              </button>
            </form>

            {/* Verification Result Card */}
            {verificationStatus === 'verified' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={22} color="#34d399" />
                    <div>
                      <div style={{ fontWeight: '700', color: '#34d399' }}>RIDE AUTHENTICATED SAFE</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match confirmed in State Transport Portal</div>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>PASSED 100%</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div>PLATE: <strong style={{ color: '#fff' }}>{vehiclePlate}</strong></div>
                  <div>DRIVER: <strong style={{ color: '#fff' }}>{driverName}</strong></div>
                  <div>POLICE CLEARANCE: <strong style={{ color: '#34d399' }}>VERIFIED</strong></div>
                  <div>SAFETY RATING: <strong style={{ color: '#fbbf24' }}>★ 4.92/5</strong></div>
                </div>

                {!tripActive && (
                  <button
                    onClick={handleStartTrip}
                    className="btn-emerald"
                    style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                  >
                    <Radio size={16} /> Board Cab & Launch Ride Shield
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick In-Cab Escape Tools */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} color="#ec4899" /> In-Cab Deterrence & Escape Tools
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/fake-call')}
                className="btn-secondary"
                style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}
              >
                <PhoneCall size={16} color="#818cf8" />
                <span>Fake Police Call</span>
              </button>

              <button
                onClick={triggerSOS}
                className="btn-danger"
                style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}
              >
                <AlertTriangle size={16} />
                <span>Panic SOS</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Ride Shield & Family Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={22} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Ride Shield Trajectory Monitor</h3>
                  <div style={{ fontSize: '0.75rem', color: tripActive ? '#34d399' : 'var(--text-dim)' }}>
                    {tripActive ? '● Satellite Radar Tracking Live' : 'Standby Mode'}
                  </div>
                </div>
              </div>

              {tripActive && (
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  <Users size={12} /> 2 Family Observers
                </span>
              )}
            </div>

            {/* Visual Route Path Map */}
            <div style={{
              height: '220px',
              background: '#090e1a',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${driftDetected ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'}`,
              marginBottom: '1.25rem'
            }}>
              <svg style={{ width: '100%', height: '100%' }}>
                {/* Expected Route Line */}
                <path
                  d="M 40 180 Q 180 160 260 90 T 520 40"
                  fill="none"
                  stroke={driftDetected ? 'rgba(255, 255, 255, 0.15)' : '#6366f1'}
                  strokeWidth="6"
                  strokeDasharray={driftDetected ? '4 4' : 'none'}
                />

                {/* If Drift is Detected, show diverted line */}
                {driftDetected && (
                  <path
                    d="M 180 160 Q 230 200 320 210"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="6"
                  />
                )}

                {/* Origin Marker */}
                <circle cx="40" cy="180" r="8" fill="#fff" />
                <text x="55" y="185" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Bandra BKC (Origin)</text>

                {/* Destination Marker */}
                <circle cx="520" cy="40" r="8" fill="#10b981" />
                <text x="400" y="35" fill="#34d399" fontSize="11" fontFamily="sans-serif">Powai Residences</text>

                {/* Moving Cab Icon */}
                <circle
                  cx={driftDetected ? 280 : 180 + (progress * 2)}
                  cy={driftDetected ? 200 : 160 - (progress * 0.9)}
                  r="12"
                  fill={driftDetected ? '#ef4444' : '#38bdf8'}
                  stroke="#fff"
                  strokeWidth="3"
                />
              </svg>

              {driftDetected && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  backdropFilter: 'blur(4px)'
                }}>
                  <AlertTriangle size={36} color="#ef4444" className="sos-pulse" />
                  <div style={{ fontWeight: '800', color: '#fff', fontSize: '1.2rem', marginTop: '6px' }}>
                    ROUTE DEVIATION DETECTED!
                  </div>
                  <div style={{ color: '#fecaca', fontSize: '0.85rem', textAlign: 'center', marginTop: '2px' }}>
                    Cab has drifted 420 meters off the official GPS corridor into an unlit route.
                  </div>
                  <button
                    onClick={triggerSOS}
                    className="btn-danger"
                    style={{ marginTop: '0.75rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Trigger Emergency Broadcast
                  </button>
                </div>
              )}
            </div>

            {/* Commute Progress Bar */}
            {tripActive && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Progress to Destination</span>
                  <span style={{ fontWeight: '700', color: '#38bdf8' }}>{progress}% (ETA: 18 Mins)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            )}

            {/* Test Simulation Controls */}
            {tripActive && !driftDetected && (
              <button
                onClick={simulateRouteDrift}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px dashed #ef4444',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                ⚠️ Test Route Drift Alert (Simulate Cab Deviation)
              </button>
            )}

            {/* Family Tracking Share Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Share Live Trip With Family & Friends
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Your trusted contacts can see your cab's live speed, battery level, and deviation alerts on their phone without installing an app.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={shareTripWhatsApp}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Share2 size={16} /> Share via WhatsApp
                </button>

                <button
                  onClick={copyTripLink}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                >
                  {copied ? <CheckCircle2 size={16} color="#34d399" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
