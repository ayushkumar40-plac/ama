import React, { useState } from 'react';
import { Route, ArrowLeft, Map as MapIcon, Loader, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafeRoute() {
  const navigate = useNavigate();
  const [routeState, setRouteState] = useState('idle'); // idle, calculating, found

  const calculateRoute = () => {
    setRouteState('calculating');
    setTimeout(() => {
      setRouteState('found');
    }, 2500);
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
          style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          {routeState === 'idle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Route size={60} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem auto' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Safe Route Navigation</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Enter your destination. Our AI will analyze real-time crowd data, street lighting, and police zones to find the safest path.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                  type="text" 
                  placeholder="Current Location" 
                  defaultValue="Downtown Central Station" 
                  disabled
                  style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}
                />
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  defaultValue="Home (Saved)" 
                  style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
              </div>

              <button onClick={calculateRoute} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                Find Safest Route
              </button>
            </motion.div>
          )}

          {routeState === 'calculating' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                <Loader size={60} color="var(--primary-color)" style={{ margin: '0 auto 2rem auto' }} />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Analyzing Map Data...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>✓ Checking street lighting</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>✓ Analyzing crowd activity</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>✓ Verifying police checkpoints</p>
            </motion.div>
          )}

          {routeState === 'found' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle2 size={60} color="#22c55e" style={{ margin: '0 auto 1.5rem auto' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#22c55e' }}>Safe Route Found</h2>
              
              {/* Mock Map Area */}
              <div style={{ height: '200px', background: '#1e293b', borderRadius: '12px', margin: '1.5rem 0', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {/* Fake map lines */}
                <div style={{ position: 'absolute', top: '50%', left: '-10%', width: '120%', height: '4px', background: 'rgba(255,255,255,0.1)', transform: 'rotate(15deg)' }}></div>
                <div style={{ position: 'absolute', top: '20%', left: '30%', width: '4px', height: '120%', background: 'rgba(255,255,255,0.1)', transform: 'rotate(-20deg)' }}></div>
                
                {/* Safe Route line */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <motion.path 
                    d="M 50 150 Q 150 150 200 100 T 400 50" 
                    fill="transparent" 
                    stroke="var(--primary-color)" 
                    strokeWidth="6" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <circle cx="50" cy="150" r="8" fill="#fff" />
                  <circle cx="400" cy="50" r="8" fill="var(--primary-color)" />
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Est. Time</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>14 mins</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Safety Score</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#22c55e' }}>98 / 100</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Active Cops</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>2 on route</p>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
                Start Navigation
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
