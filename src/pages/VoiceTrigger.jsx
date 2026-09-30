import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, ArrowLeft, Volume2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';

export default function VoiceTrigger() {
  const navigate = useNavigate();
  const { triggerSOS } = useSafety();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [alertTriggered, setAlertTriggered] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        
        const lowerCase = currentTranscript.toLowerCase();
        if (lowerCase.includes('help') || lowerCase.includes('emergency') || lowerCase.includes('save me') || lowerCase.includes('guardian')) {
          setAlertTriggered(true);
          triggerSOS();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [isListening, triggerSOS]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAlertTriggered(false);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (_) {
        setIsListening(true);
      }
    }
  };

  const simulateVoiceSOS = () => {
    setTranscript('Simulated Codeword: "Emergency Help Required!"');
    setAlertTriggered(true);
    triggerSOS();
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <button 
        onClick={() => {
          if (recognitionRef.current) recognitionRef.current.stop();
          navigate('/');
        }}
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
            <span className="badge badge-purple">HANDS-FREE ACOUSTIC SENSOR</span>
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>AI Voice Trigger</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            When under duress or unable to touch your phone, speak trigger phrases: <strong style={{ color: '#f472b6' }}>"Help"</strong>, <strong style={{ color: '#f472b6' }}>"Emergency"</strong>, or <strong style={{ color: '#f472b6' }}>"Guardian"</strong>.
          </p>

          <button 
            onClick={toggleListening}
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              border: isListening ? '3px solid #ef4444' : '3px solid #6366f1',
              color: isListening ? '#ef4444' : '#818cf8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto 1.5rem auto',
              boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <Mic size={44} />
              </motion.div>
            ) : (
              <MicOff size={44} />
            )}
          </button>

          <div style={{
            minHeight: '70px',
            padding: '1rem',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '0.9rem' }}>
              {transcript || (isListening ? "Listening actively for trigger keywords..." : "Tap the mic to activate voice listener.")}
            </p>
          </div>

          <button
            onClick={simulateVoiceSOS}
            className="btn-danger"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            <ShieldAlert size={18} /> Test Simulate Voice Keyword Trigger
          </button>
        </motion.div>
      </div>
    </div>
  );
}
