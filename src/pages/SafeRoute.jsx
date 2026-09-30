import React, { useState } from 'react';
import { Route, ArrowLeft, Loader, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SafeRoute() {
  const navigate = useNavigate();
  const [routeState, setRouteState] = useState('idle'); // idle, calculating, found

  const calculateRoute = () => {
    setRouteState('calculating');
    setTimeout(() => {
      setRouteState('found');
    }, 1800);
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
          style={{ padding: '2.5rem 2rem', maxWidth: '640px', width: '100%', textAlign: 'center', position: 'relative' }}
        >
          {routeState === 'idle' && (
            <div>
              <div style={{
                background: 'rgba(99, 102, 241, 0.15)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Route size={32} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Safe Route Navigation</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
                Enter your destination. Our AI cross-references real-time Safecity crowd audits, CCTV coverage, street lighting, and police assistance kiosks to plot the safest path home.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <input 
                  type="text" 
                  placeholder="Current Location" 
                  defaultValue="Downtown Central Station (Platform 3 Exit)" 
                  disabled
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}
                />
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  defaultValue="University Women's Hostel (Gate B)" 
                />
              </div>

              <button onClick={calculateRoute} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                Compute Safest Illuminated Path
              </button>
            </div>
          )}

          {routeState === 'calculating' && (
            <div style={{ padding: '2rem 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                <Loader size={54} color="#818cf8" style={{ margin: '0 auto 1.5rem auto' }} />
              </motion.div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Analyzing Safecity Map Grid...</h3>
              <p style={{ color: '#34d399', fontSize: '0.85rem', marginBottom: '0.4rem' }}>✓ Checking high-intensity LED street illumination</p>
              <p style={{ color: '#34d399', fontSize: '0.85rem', marginBottom: '0.4rem' }}>✓ Auditing pedestrian density & 24/7 commercial stores</p>
              <p style={{ color: '#34d399', fontSize: '0.85rem' }}>✓ Pinpointing 2 active Women Police Assistance Desks</p>
            </div>
          )}

          {routeState === 'found' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: '#34d399' }}>
                Safe Corridor Verified
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Avoids unlit alleyways behind the rail line. Prioritizes Main Commercial Avenue.
              </p>
              
              {/* Visual Map Area */}
              <div style={{
                height: '180px',
                background: '#090e1a',
                borderRadius: '12px',
                margin: '1.25rem 0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <motion.path 
                    d="M 40 140 Q 150 140 220 90 T 460 40" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  <circle cx="40" cy="140" r="8" fill="#fff" />
                  <circle cx="460" cy="40" r="8" fill="#10b981" />
                </svg>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '10px' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Est. Walking</p>
                  <p style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>14 mins</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Safety Score</p>
                  <p style={{ fontWeight: '700', fontSize: '1rem', color: '#34d399' }}>98 / 100</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Police Booths</p>
                  <p style={{ fontWeight: '700', fontSize: '1rem', color: '#38bdf8' }}>2 En-Route</p>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}>
                Start Turn-by-Turn Safe Navigation
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
