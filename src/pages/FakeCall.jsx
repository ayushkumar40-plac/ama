import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, ArrowLeft, UserCircle, Shield, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FakeCall() {
  const navigate = useNavigate();
  const [callerType, setCallerType] = useState('Mom (Emergency)');
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
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000',
      color: '#fff',
      position: 'relative',
      padding: '1.5rem'
    }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button 
          onClick={() => navigate('/')}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={16} /> Exit Call
        </button>

        {callState === 'incoming' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCallerType('Mom (Emergency)')}
              style={{
                background: callerType.includes('Mom') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Mom
            </button>
            <button
              onClick={() => setCallerType('Police Inspector Rao')}
              style={{
                background: callerType.includes('Police') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Police Inspector
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          animate={callState === 'incoming' ? { y: [0, -8, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <UserCircle size={90} color="#94a3b8" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{callerType}</h2>
          
          <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
            {callState === 'incoming' && 'Incoming Call...'}
            {callState === 'active' && formatTime(duration)}
            {callState === 'ended' && 'Call Terminated'}
          </p>

          {callState === 'active' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', maxWidth: '360px' }}>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                "Hey! Where are you right now? Dad and the officer are standing right at the corner waiting for you..."
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {callState === 'incoming' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: '420px', margin: '0 auto', width: '100%' }}
          >
            {/* Decline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleDecline}
                style={{ 
                  width: '65px', height: '65px', borderRadius: '50%', 
                  backgroundColor: '#ef4444', border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <PhoneOff size={28} />
              </button>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Decline</span>
            </div>

            {/* Accept */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleAccept}
                style={{ 
                  width: '65px', height: '65px', borderRadius: '50%', 
                  backgroundColor: '#22c55e', border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)'
                }}
              >
                <Phone size={28} />
              </button>
              <span style={{ fontSize: '0.85rem', color: '#34d399' }}>Accept Call</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {callState === 'active' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <button 
              onClick={handleDecline}
              style={{ 
                width: '65px', height: '65px', borderRadius: '50%', 
                backgroundColor: '#ef4444', border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <PhoneOff size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
