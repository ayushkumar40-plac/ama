import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, ArrowLeft, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FakeCall() {
  const navigate = useNavigate();
  const [callState, setCallState] = useState('incoming'); // incoming, active, ended
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAccept = () => setCallState('active');
  const handleDecline = () => {
    setCallState('ended');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000', color: '#fff', position: 'relative' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 10 }}
      >
        <ArrowLeft size={28} />
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          animate={callState === 'incoming' ? { y: [0, -10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ textAlign: 'center' }}
        >
          <UserCircle size={120} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mom (Emergency)</h2>
          
          <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
            {callState === 'incoming' && 'Incoming Mobile Call...'}
            {callState === 'active' && formatTime(duration)}
            {callState === 'ended' && 'Call Ended'}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {callState === 'incoming' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
          >
            {/* Decline Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleDecline}
                style={{ 
                  width: '70px', height: '70px', borderRadius: '50%', 
                  backgroundColor: '#ef4444', border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <PhoneOff size={32} />
              </button>
              <span style={{ fontSize: '1rem' }}>Decline</span>
            </div>

            {/* Accept Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleAccept}
                style={{ 
                  width: '70px', height: '70px', borderRadius: '50%', 
                  backgroundColor: '#22c55e', border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  animation: 'pulse 1.5s infinite'
                }}
              >
                <Phone size={32} />
              </button>
              <span style={{ fontSize: '1rem' }}>Accept</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {callState === 'active' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <button 
              onClick={handleDecline}
              style={{ 
                width: '70px', height: '70px', borderRadius: '50%', 
                backgroundColor: '#ef4444', border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <PhoneOff size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}} />
    </div>
  );
}
