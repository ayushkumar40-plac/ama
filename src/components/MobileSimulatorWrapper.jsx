import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';

export default function MobileSimulatorWrapper({ children }) {
  const { previewMode, setPreviewMode } = useSafety();

  if (previewMode === 'desktop') {
    return <>{children}</>;
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }}>
      {/* Simulator Control Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.25rem',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Smartphone size={16} color="#818cf8" />
          <span>Mobile Device Simulation (iPhone 16 Pro)</span>
        </span>
        <button
          onClick={() => setPreviewMode('desktop')}
          style={{
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Monitor size={12} /> Switch to Desktop Web
        </button>
      </div>

      {/* Realistic Mobile Device Mockup */}
      <div className="phone-shell">
        {/* Dynamic Island / Notch */}
        <div className="phone-notch">
          <div className="phone-camera"></div>
          <div className="phone-speaker"></div>
        </div>

        {/* Phone Content Screen */}
        <div className="phone-content custom-scrollbar">
          {children}
        </div>

        {/* Home swipe indicator */}
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
}
