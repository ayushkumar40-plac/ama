import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, MapPin, Lock, UserCheck, Car, AlertTriangle } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export default function MobileBottomDock() {
  const { triggerSOS } = useSafety();

  return (
    <nav className="mobile-bottom-dock">
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-dock-item ${isActive ? 'active' : ''}`}
        end
      >
        <Shield size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/safety-map"
        className={({ isActive }) => `bottom-dock-item ${isActive ? 'active' : ''}`}
      >
        <MapPin size={20} />
        <span>Safety Map</span>
      </NavLink>

      {/* Floating Center SOS Button */}
      <button
        onClick={triggerSOS}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          border: '3px solid #070b14',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.6)',
          marginTop: '-18px'
        }}
        className="sos-pulse"
      >
        <AlertTriangle size={22} />
      </button>

      <NavLink
        to="/evidence-vault"
        className={({ isActive }) => `bottom-dock-item ${isActive ? 'active' : ''}`}
      >
        <Lock size={20} />
        <span>Vault</span>
      </NavLink>

      <NavLink
        to="/safe-commute"
        className={({ isActive }) => `bottom-dock-item ${isActive ? 'active' : ''}`}
      >
        <Car size={20} />
        <span>Commute</span>
      </NavLink>
    </nav>
  );
}
