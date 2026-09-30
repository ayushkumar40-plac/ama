import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Map, PhoneCall, Route, Volume2, BatteryWarning, Database, Cloud, CloudOff, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const { user, mode, authReady, signInEmail, signUpEmail, signOutNow } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [authErr, setAuthErr] = useState('');

  const features = [
    { title: "AI Voice Trigger", desc: "Trigger alerts completely hands-free with a custom voice code.", icon: Volume2, path: "/voice-trigger" },
    { title: "Live Location Tracking", desc: "Share real-time location with volunteers and trusted contacts.", icon: Map, path: "/location" },
    { title: "Fake Call System", desc: "Escape unsafe situations with realistic pre-recorded calls.", icon: PhoneCall, path: "/fake-call" },
    { title: "Safe Route Navigation", desc: "Find the safest path home based on real-time crowd data.", icon: Route, path: "/safe-route" },
    { title: "Emergency Battery Alert", desc: "Auto-alerts contacts if your battery drops to critical levels.", icon: BatteryWarning, path: "/battery-alert" },
    { title: "Blockchain Evidence Vault", desc: "Seal audio, video & location proof with SHA-256 + tamper-proof ledger.", icon: Database, path: "/vault", highlight: true },
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={32} color="var(--primary-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Guardian<span className="text-gradient">Network</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span title={mode === 'cloud' ? 'Firebase cloud connected' : mode === 'emulator' ? 'Local Firebase emulator' : 'Offline demo mode'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', padding: '0.35rem 0.7rem' }}>
            {mode === 'offline' ? <CloudOff size={13} /> : <Cloud size={13} />}
            {mode === 'cloud' ? 'Firebase live' : mode === 'emulator' ? 'Emulator' : 'Offline'}
          </span>
          {authReady && user && !user.isAnonymous && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
          )}
          {authReady && user && !user.isAnonymous ? (
            <button className="btn-secondary" onClick={signOutNow} title="Sign out" style={{ padding: '0.5rem 1rem' }}><LogOut size={14} /></button>
          ) : (
            <button className="btn-secondary" style={{ marginRight: '1rem' }} onClick={() => setShowLogin((s) => !s)}>Login</button>
          )}
          <button className="btn-primary" onClick={() => navigate('/vault')}>Get the App</button>
        </div>
      </nav>
      {showLogin && (
        <div className="glass-panel" style={{ maxWidth: '420px', margin: '-2rem auto 2rem', padding: '1.5rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>NGO / Legal sign-in</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Survivors stay anonymous automatically. Named accounts are for verifiers.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.25)', color: '#fff' }} />
          <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" type="password"
            style={{ width: '100%', marginBottom: '0.75rem', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.25)', color: '#fff' }} />
          {authErr && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{authErr}</p>}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={async () => {
              setAuthErr('');
              try { await signInEmail(email, pw); setShowLogin(false); }
              catch (e) { setAuthErr(e?.message || 'Sign-in failed.'); }
            }}>Sign in</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={async () => {
              setAuthErr('');
              try { await signUpEmail(email, pw, 'ngo'); setShowLogin(false); }
              catch (e) { setAuthErr(e?.message || 'Sign-up failed.'); }
            }}>Create NGO account</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', margin: '6rem 0', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <h2 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Next-Generation <br/>
          <span className="text-gradient">Women's Safety</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2.5rem', padding: '0 2rem' }}>
          An AI-powered ecosystem designed to protect, connect, and empower. 
          Select a feature below to test it out live.
        </p>
      </motion.section>

      {/* Features Grid */}
      <section style={{ marginTop: '8rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Interactive Features</h3>
          <p style={{ color: 'var(--text-muted)' }}>Click on any feature to try a working simulation.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(feature.path)}
                className="glass-panel"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}
              >
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  width: '50px', height: '50px', 
                  borderRadius: '12px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={24} color="var(--primary-color)" />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <span style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>Try it out →</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
