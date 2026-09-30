import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  Shield,
  MapPin,
  Lock,
  UserCheck,
  Car,
  AlertTriangle,
  Smartphone,
  Monitor,
  EyeOff,
  PhoneCall,
  Menu,
  X,
  Compass,
  Zap
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const {
    triggerSOS,
    stealthMode,
    setStealthMode,
    previewMode,
    setPreviewMode,
    setHelplineModalOpen
  } = useSafety();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Shield },
    { name: 'Safety Map', path: '/safety-map', icon: MapPin },
    { name: 'Evidence Vault', path: '/evidence-vault', icon: Lock },
    { name: 'Anonymous Hub', path: '/anonymous-report', icon: UserCheck },
    { name: 'Safe Commute', path: '/safe-commute', icon: Car },
    { name: 'Safe Route', path: '/safe-route', icon: Compass }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.25rem'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff', lineHeight: 1.1 }}>
              Guardian<span className="text-gradient">Safe</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: '600', letterSpacing: '0.5px' }}>
              WOMEN SAFETY & EVIDENCE VAULT
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', gap: '0.4rem', alignItems: 'center' }} className="desktop-nav-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? '#fff' : 'var(--text-muted)',
                  background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={active ? '#818cf8' : 'currentColor'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Device Simulator Toggle (Desktop only) */}
          <button
            onClick={() => setPreviewMode(p => p === 'desktop' ? 'mobile' : 'desktop')}
            className="btn-secondary"
            title="Toggle between Native Mobile App view and Desktop Web view"
            style={{
              padding: '0.5rem 0.8rem',
              fontSize: '0.8rem',
              display: 'none'
            }}
            id="device-toggle-btn"
          >
            {previewMode === 'desktop' ? (
              <>
                <Smartphone size={15} color="#38bdf8" />
                <span>Mobile View</span>
              </>
            ) : (
              <>
                <Monitor size={15} color="#34d399" />
                <span>Desktop View</span>
              </>
            )}
          </button>

          {/* Stealth Mode / Panic Disguise Button */}
          <button
            onClick={() => setStealthMode(true)}
            className="btn-secondary"
            title="Instant Calculator Disguise if someone is watching"
            style={{
              padding: '0.5rem 0.8rem',
              fontSize: '0.8rem',
              borderColor: 'rgba(236, 72, 153, 0.3)',
              color: '#f472b6'
            }}
          >
            <EyeOff size={15} />
            <span className="hide-on-compact">Stealth Disguise</span>
          </button>

          {/* 24/7 Helplines Trigger */}
          <button
            onClick={() => setHelplineModalOpen(true)}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.8rem',
              fontSize: '0.8rem',
              color: '#38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.3)'
            }}
          >
            <PhoneCall size={15} />
            <span className="hide-on-compact">112 / 1091</span>
          </button>

          {/* SOS Panic Trigger */}
          <button
            onClick={triggerSOS}
            className="btn-danger sos-pulse"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.88rem',
              fontWeight: '800',
              letterSpacing: '0.5px'
            }}
          >
            <AlertTriangle size={16} />
            <span>SOS</span>
          </button>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '0.75rem',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.98)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? '#818cf8' : 'var(--text-main)',
                  background: active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/fake-call"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                padding: '0.65rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Fake Call
            </Link>
            <Link
              to="/voice-trigger"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                padding: '0.65rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Voice SOS
            </Link>
            <Link
              to="/battery-alert"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                padding: '0.65rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Battery Guard
            </Link>
          </div>
        </div>
      )}

      {/* Media query styling inline for responsiveness */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
          #device-toggle-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-compact {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
