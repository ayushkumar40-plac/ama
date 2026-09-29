import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function VoiceTrigger() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [alertTriggered, setAlertTriggered] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Setup Speech Recognition
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
        
        // Check for trigger word (e.g., "help", "emergency", "guardian")
        const lowerCaseTranscript = currentTranscript.toLowerCase();
        if (lowerCaseTranscript.includes('help') || lowerCaseTranscript.includes('emergency') || lowerCaseTranscript.includes('guardian')) {
          setAlertTriggered(true);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Restart if it stops automatically
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAlertTriggered(false);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <button 
        onClick={() => {
          if (recognitionRef.current) recognitionRef.current.stop();
          navigate('/');
        }}
        style={{ width: 'fit-content', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>AI Voice Trigger</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Say <strong>"Help"</strong>, <strong>"Emergency"</strong>, or <strong>"Guardian"</strong> to trigger an SOS.
          </p>

          <button 
            onClick={toggleListening}
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              border: isListening ? '2px solid #ef4444' : '2px solid var(--primary-color)',
              color: isListening ? '#ef4444' : 'var(--primary-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto 2rem auto',
              transition: 'all 0.3s ease'
            }}
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <Mic size={40} />
              </motion.div>
            ) : (
              <MicOff size={40} />
            )}
          </button>

          <div style={{ minHeight: '80px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '2rem' }}>
            <p style={{ color: '#fff', fontStyle: 'italic' }}>
              {transcript || (isListening ? "Listening..." : "Tap the microphone to start.")}
            </p>
          </div>

          {alertTriggered && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}
            >
              <AlertCircle color="#ef4444" size={32} />
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ color: '#ef4444', fontWeight: 'bold' }}>SOS TRIGGERED!</h3>
                <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>Voice keyword detected. Authorities and contacts notified.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
