import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { ShieldCheck, EyeOff } from 'lucide-react';

export default function StealthCalculator() {
  const { setStealthMode } = useSafety();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleBtn = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }

    if (val === '=') {
      // Secret passkey: typing 9999 and pressing = unlocks
      if (display === '9999' || equation.includes('9999')) {
        setStealthMode(false);
        return;
      }
      try {
        // Safe evaluation
        const sanitized = equation.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized + display})`)();
        setDisplay(String(res).slice(0, 10));
        setEquation('');
      } catch (_) {
        setDisplay('Error');
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(val)) {
      setEquation(prev => prev + display + ' ' + val + ' ');
      setDisplay('0');
      return;
    }

    if (display === '0') {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000000',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '2rem 1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Secret Top Bar */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.25,
        color: '#888'
      }}>
        <span style={{ fontSize: '0.75rem' }}>Calc v2.4</span>
        {/* Discrete Unlock Button */}
        <button
          onClick={() => setStealthMode(false)}
          title="Exit Stealth Mode"
          style={{
            background: 'none',
            border: 'none',
            color: '#777',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.7rem'
          }}
        >
          <EyeOff size={14} /> Exit (or enter 9999 =)
        </button>
      </div>

      {/* Screen Display */}
      <div style={{
        textAlign: 'right',
        color: '#fff',
        padding: '1rem 0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{ color: '#888', fontSize: '1.1rem', minHeight: '1.5rem' }}>{equation}</div>
        <div style={{ fontSize: '4rem', fontWeight: '300', letterSpacing: '-1px' }}>{display}</div>
      </div>

      {/* Calculator Keypad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.85rem',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%'
      }}>
        {['C', '+/-', '%', '/'].map(btn => (
          <button
            key={btn}
            onClick={() => handleBtn(btn)}
            style={{
              height: '75px',
              borderRadius: '50px',
              border: 'none',
              background: '#a5a5a5',
              color: '#000',
              fontSize: '1.5rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {btn}
          </button>
        ))}

        {['7', '8', '9', '*'].map(btn => (
          <button
            key={btn}
            onClick={() => handleBtn(btn)}
            style={{
              height: '75px',
              borderRadius: '50px',
              border: 'none',
              background: btn === '*' ? '#f1a33c' : '#333333',
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {btn === '*' ? '×' : btn}
          </button>
        ))}

        {['4', '5', '6', '-'].map(btn => (
          <button
            key={btn}
            onClick={() => handleBtn(btn)}
            style={{
              height: '75px',
              borderRadius: '50px',
              border: 'none',
              background: btn === '-' ? '#f1a33c' : '#333333',
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {btn === '-' ? '−' : btn}
          </button>
        ))}

        {['1', '2', '3', '+'].map(btn => (
          <button
            key={btn}
            onClick={() => handleBtn(btn)}
            style={{
              height: '75px',
              borderRadius: '50px',
              border: 'none',
              background: btn === '+' ? '#f1a33c' : '#333333',
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {btn}
          </button>
        ))}

        <button
          onClick={() => handleBtn('0')}
          style={{
            gridColumn: 'span 2',
            height: '75px',
            borderRadius: '50px',
            border: 'none',
            background: '#333333',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: '500',
            textAlign: 'left',
            paddingLeft: '2rem',
            cursor: 'pointer'
          }}
        >
          0
        </button>

        <button
          onClick={() => handleBtn('.')}
          style={{
            height: '75px',
            borderRadius: '50px',
            border: 'none',
            background: '#333333',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          .
        </button>

        <button
          onClick={() => handleBtn('=')}
          style={{
            height: '75px',
            borderRadius: '50px',
            border: 'none',
            background: '#f1a33c',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          =
        </button>
      </div>
    </div>
  );
}
