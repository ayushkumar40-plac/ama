import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  Shield,
  MapPin,
  Lock,
  UserCheck,
  Car,
  AlertTriangle,
  PhoneCall,
  Volume2,
  Route,
  BatteryWarning,
  Navigation,
  Compass,
  CheckCircle2,
  ArrowRight,
  Database,
  KeyRound,
  ShieldCheck,
  Share2,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { triggerSOS, setHelplineModalOpen, setStealthMode } = useSafety();

  const corePillars = [
    {
      title: "Crowdsourced Safety Map",
      badge: "SAFECITY INSPIRED",
      desc: "Empowering communities to mark unsafe zones, catcalling spots, and dim lighting. Visualizes real-time heatmaps for safe transit.",
      icon: MapPin,
      path: "/safety-map",
      color: "#ec4899",
      glow: "rgba(236, 72, 153, 0.2)"
    },
    {
      title: "Blockchain Evidence Vault",
      badge: "WEB3 & SMART CONTRACTS",
      desc: "Cryptographically hash audio, video, and location evidence using SHA-256. Tamper-proof smart contracts give victims sovereign control over who can access their data.",
      icon: Lock,
      path: "/evidence-vault",
      color: "#818cf8",
      glow: "rgba(99, 102, 241, 0.2)"
    },
    {
      title: "Anonymous Reporting Hub",
      badge: "ZERO KNOWLEDGE",
      desc: "Connect directly with verified NGOs, legal aid advisors, and emergency helplines without revealing your identity or phone number.",
      icon: UserCheck,
      path: "/anonymous-report",
      color: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.2)"
    },
    {
      title: "Safe Commute Verification",
      badge: "RIDE SHIELD",
      desc: "Instant vehicle plate and driver authentication, automated route-drift detection, and 1-click live tracking for family.",
      icon: Car,
      path: "/safe-commute",
      color: "#34d399",
      glow: "rgba(16, 185, 129, 0.2)"
    }
  ];

  const safetyTools = [
    { title: "Safe Route Navigation", desc: "AI-calculated safest walking paths with streetlights & police booths.", icon: Route, path: "/safe-route" },
    { title: "Fake Call Escaper", desc: "Realistic simulated incoming call to quickly exit uncomfortable situations.", icon: PhoneCall, path: "/fake-call" },
    { title: "AI Voice Trigger", desc: "Hands-free distress alert triggered by secret verbal codewords.", icon: Volume2, path: "/voice-trigger" },
    { title: "Live Satellite Radar", desc: "Share precision GPS coordinates securely with trusted contacts.", icon: Navigation, path: "/location" },
    { title: "Critical Battery Alert", desc: "Auto-broadcasts final coordinates before phone shuts off.", icon: BatteryWarning, path: "/battery-alert" }
  ];

  return (
    <div className="app-container">
      {/* Top Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', margin: '1.5rem 0 3.5rem 0', maxWidth: '920px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <span className="badge badge-purple" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> DECENTRALIZED SAFETY ECOSYSTEM
          </span>
          <span className="badge badge-green" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            <ShieldCheck size={14} /> ZERO-KNOWLEDGE ENCRYPTED
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
          fontWeight: '800',
          lineHeight: 1.12,
          letterSpacing: '-1px',
          marginBottom: '1.25rem'
        }}>
          Technological Sovereignty <br />
          for <span className="text-gradient">Women’s Safety & Justice</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          lineHeight: 1.6,
          marginBottom: '2.25rem',
          maxWidth: '780px',
          margin: '0 auto 2.25rem auto'
        }}>
          A unified platform combining crowdsourced community safety maps, tamper-proof blockchain evidence vaults, anonymous legal aid reporting, and live ride verification.
        </p>

        {/* Hero Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={triggerSOS}
            className="btn-danger sos-pulse"
            style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: '800' }}
          >
            <AlertTriangle size={20} /> ONE-TAP EMERGENCY SOS
          </button>

          <button
            onClick={() => navigate('/evidence-vault')}
            className="btn-primary"
            style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
          >
            <Lock size={18} /> Open Evidence Vault
          </button>

          <button
            onClick={() => navigate('/safety-map')}
            className="btn-secondary"
            style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
          >
            <MapPin size={18} color="#ec4899" /> Explore Safety Map
          </button>
        </div>
      </motion.section>

      {/* Live Impact Counters Bar */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{
          padding: '1.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.75)'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>14,850+</div>
            <div style={{ color: '#ec4899', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
              Safety Audit Points
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Safecity Heatmap Mapped</div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>2,940+</div>
            <div style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
              Anchored Vault Hashes
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>100% Tamper-Proof Legal Custody</div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>0.00%</div>
            <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
              Identity Tracking
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Zero-Knowledge Confidentiality</div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>24 / 7</div>
            <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
              Verified Legal & NGOs
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>112, 1091 & SNEHA Active</div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Highlight Grid */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>CORE ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            The Four Pillars of GuardianSafe
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
            Click any pillar to experience working simulations of the blockchain vault, crowdsourced heatmap, anonymous reporting hub, and safe commute portal.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem'
        }}>
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.015 }}
                onClick={() => navigate(pillar.path)}
                className="glass-panel"
                style={{
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    background: pillar.glow,
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${pillar.color}`
                  }}>
                    <Icon size={28} color={pillar.color} />
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{pillar.badge}</span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '0.5rem' }}>
                  {pillar.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                  {pillar.desc}
                </p>

                <div style={{
                  marginTop: 'auto',
                  paddingTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: pillar.color,
                  fontWeight: '700',
                  fontSize: '0.92rem'
                }}>
                  <span>Launch Experience</span>
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Micro-Tools Suite */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Active Defense & Escort Tools</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Integrated smart tools for rapid situation de-escalation and family alerts.</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {safetyTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(tool.path)}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color="#818cf8" />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{tool.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>{tool.desc}</p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#818cf8', fontWeight: '600' }}>
                  Open Tool →
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Footer Banner */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>
          In Immediate Danger Right Now?
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Call police emergency line 112 or Women Helpline 1091 instantly. Your call is toll-free and immediate.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="tel:112"
            className="btn-danger"
            style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', textDecoration: 'none' }}
          >
            <PhoneCall size={18} /> Call 112 Immediately
          </a>
          <button
            onClick={() => setHelplineModalOpen(true)}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
          >
            View All Helplines Directory
          </button>
        </div>
      </section>
    </div>
  );
}
