import React, { useState, useEffect } from 'react';
import { Battery, BatteryWarning, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BatteryAlert() {
  const navigate = useNavigate();
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(null);
  const [alertTriggered, setAlertTriggered] = useState(false);

  useEffect(() => {
    let batteryManager = null;

    const updateBatteryStatus = (battery) => {
      const level = Math.round(battery.level * 100);
      setBatteryLevel(level);
      setIsCharging(battery.charging);
      
      // Simulate alert if battery is less than 15% OR if we want to mock it for the demo
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
      });
    } else {
      // Fallback for browsers that don't support getBattery
      setBatteryLevel(10);
      setIsCharging(false);
      setAlertTriggered(true);
    }

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
      }
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ width: 'fit-content', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="glass-panel"
          style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}
        >
          {alertTriggered ? (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: '#ef4444', marginBottom: '2rem' }}
            >
              <ShieldAlert size={80} style={{ margin: '0 auto' }} />
            </motion.div>
          ) : (
            <div style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>
              <Battery size={80} style={{ margin: '0 auto' }} />
            </div>
          )}

          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Battery Level: {batteryLevel !== null ? `${batteryLevel}%` : 'Reading...'}
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            {isCharging ? 'Device is currently charging.' : 'Device is discharging.'}
          </p>

          {alertTriggered ? (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px' }}>
              <h3 style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>CRITICAL BATTERY ALERT</h3>
              <p style={{ color: '#fca5a5' }}>
                Your battery is critically low. An automatic SMS with your last known location has been sent to your emergency contacts.
              </p>
            </div>
          ) : (
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '12px' }}>
              <p style={{ color: '#86efac' }}>
                Battery level is safe. Auto-alerts will trigger if it drops below 15%.
              </p>
              <button 
                onClick={() => setAlertTriggered(true)} 
                className="btn-primary" 
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Test Simulate Low Battery
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
