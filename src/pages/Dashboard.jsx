import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Map, PhoneCall, Route, Volume2, BatteryWarning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const features = [
    { title: "AI Voice Trigger", desc: "Trigger alerts completely hands-free with a custom voice code.", icon: Volume2, path: "/voice-trigger" },
    { title: "Live Location Tracking", desc: "Share real-time location with volunteers and trusted contacts.", icon: Map, path: "/location" },
    { title: "Fake Call System", desc: "Escape unsafe situations with realistic pre-recorded calls.", icon: PhoneCall, path: "/fake-call" },
    { title: "Safe Route Navigation", desc: "Find the safest path home based on real-time crowd data.", icon: Route, path: "/safe-route" },
    { title: "Emergency Battery Alert", desc: "Auto-alerts contacts if your battery drops to critical levels.", icon: BatteryWarning, path: "/battery-alert" },
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
        <div>
          <button className="btn-secondary" style={{ marginRight: '1rem' }}>Login</button>
          <button className="btn-primary">Get the App</button>
        </div>
      </nav>

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
