import React, { useState, useEffect } from 'react';
import { Battery, BatteryWarning, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BatteryAlert() {
  const navigate = useNavigate();
  const [batteryLevel, setBatteryLevel] = useState(12);
  const [isCharging, setIsCharging] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(true);

  useEffect(() => {
    let batteryManager = null;

    const updateBatteryStatus = (battery) => {
      const level = Math.round(battery.level * 100);
      setBatteryLevel(level);
      setIsCharging(battery.charging);
      if (level < 15) {
        setAlertTriggered(true);
      }
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        batteryManager = battery;
        updateBatteryStatus(battery);
        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
      }).catch(() => {});
    }

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-secondary"
        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="glass-panel"
          style={{ padding: '2.5rem 2rem', maxWidth: '520px', width: '100%' }}
        >
          {alertTriggered ? (
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: '#ef4444', marginBottom: '1.25rem' }}
            >
              <ShieldAlert size={70} style={{ margin: '0 auto' }} />
            </motion.div>
          ) : (
            <div style={{ color: '#818cf8', marginBottom: '1.25rem' }}>
              <Battery size={70} style={{ margin: '0 auto' }} />
            </div>
          )}

          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Battery Level: {batteryLevel !== null ? `${batteryLevel}%` : 'Reading...'}
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            {isCharging ? 'Device is currently connected to power.' : 'Device is discharging on battery.'}
          </p>

          {alertTriggered ? (
            <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '14px', textAlign: 'left' }}>
              <h3 style={{ color: '#ef4444', fontWeight: '700', fontSize: '1rem', marginBottom: '0.4rem' }}>
                CRITICAL BATTERY BEACON ACTIVE
              </h3>
              <p style={{ color: '#fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Your battery is beneath the 15% threshold. An automated emergency dispatch snapshot containing your exact last GPS location and battery timestamp has been staged for your emergency contacts.
              </p>
            </div>
          ) : (
            <div style={{ padding: '1.25rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '14px' }}>
              <p style={{ color: '#86efac', fontSize: '0.9rem' }}>
                Battery level is optimal. Automatic distress beacon will activate if battery drops below 15%.
              </p>
              <button 
                onClick={() => setAlertTriggered(true)} 
                className="btn-primary" 
                style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
              >
                Simulate Low Battery Beacon
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
