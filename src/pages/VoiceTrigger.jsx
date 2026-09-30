import React from 'react';
import { Mic, MicOff, ArrowLeft, ShieldAlert, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';

export default function VoiceTrigger() {
  const navigate = useNavigate();
  const {
    triggerSOS,
    voiceTriggerEnabled,
    voiceTriggerStatus,
    voiceTranscript,
    startVoiceTrigger,
    stopVoiceTrigger,
    shakeTriggerEnabled,
    shakeTriggerStatus,
    enableShakeTrigger,
    disableShakeTrigger
  } = useSafety();

  const toggleVoiceTrigger = () => {
    if (voiceTriggerEnabled) stopVoiceTrigger();
    else startVoiceTrigger();
  };

  const toggleShakeTrigger = () => {
    if (shakeTriggerEnabled) disableShakeTrigger();
    else enableShakeTrigger();
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        className="btn-secondary"
        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '2.5rem 2rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
            <span className="badge badge-green">HANDS-FREE SOS TRIGGERS</span>
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hands-Free SOS</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            Enable either trigger below. When one is detected, the SOS alert opens with your location and a one-tap call to 112.
          </p>

          <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Voice phrase</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>“Help me”, “need help”, “emergency”, or “save me”</p>
                </div>
                <button onClick={toggleVoiceTrigger} className={voiceTriggerEnabled ? 'btn-danger' : 'btn-secondary'} style={{ flexShrink: 0 }}>
                  {voiceTriggerEnabled ? <MicOff size={17} /> : <Mic size={17} />}
                  {voiceTriggerEnabled ? 'Turn off' : 'Turn on'}
                </button>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {voiceTriggerStatus || 'Microphone access is requested when you turn this on.'}
              </p>
              {voiceTranscript && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.35rem' }}>Heard: “{voiceTranscript}”</p>}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Shake phone</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Shake firmly four times to activate SOS.</p>
                </div>
                <button onClick={toggleShakeTrigger} className={shakeTriggerEnabled ? 'btn-danger' : 'btn-secondary'} style={{ flexShrink: 0 }}>
                  <Smartphone size={17} />
                  {shakeTriggerEnabled ? 'Turn off' : 'Turn on'}
                </button>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {shakeTriggerStatus || 'Motion access may be requested by your device.'}
              </p>
            </div>
          </div>

          <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', margin: '1.25rem 0', lineHeight: '1.45' }}>
            Voice and motion triggers open the SOS screen; your browser still requires a tap to place the emergency call.
          </p>

          <button onClick={triggerSOS} className="btn-danger" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
            <ShieldAlert size={18} /> Test SOS Alert
          </button>
        </motion.div>
      </div>
    </div>
  );
}
