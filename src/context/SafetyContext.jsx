import React, { createContext, useContext, useState, useEffect } from 'react';

const SafetyContext = createContext();

// Native Web Audio Siren Synthesizer
let audioCtx = null;
let sirenOsc = null;
let sirenGain = null;
let sirenInterval = null;

const startAudioSiren = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    sirenOsc = audioCtx.createOscillator();
    sirenGain = audioCtx.createGain();
    sirenOsc.type = 'sawtooth';
    sirenGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    sirenOsc.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);
    sirenOsc.start();

    let toggle = false;
    sirenInterval = setInterval(() => {
      if (sirenOsc && audioCtx) {
        sirenOsc.frequency.setValueAtTime(toggle ? 920 : 620, audioCtx.currentTime);
        toggle = !toggle;
      }
    }, 450);
  } catch (err) {
    console.warn("Audio siren not allowed without user interaction yet:", err);
  }
};

const stopAudioSiren = () => {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOsc) {
    try {
      sirenOsc.stop();
      sirenOsc.disconnect();
    } catch (_) {}
    sirenOsc = null;
  }
};

// Cryptographic SHA-256 Hash using browser Web Crypto API
export async function computeSHA256(data) {
  let buffer;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data);
  } else if (data instanceof Blob) {
    buffer = await data.arrayBuffer();
  } else {
    buffer = new TextEncoder().encode(JSON.stringify(data));
  }
  const hashBuf = await crypto.subtle.digest('SHA-256', buffer);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return '0x' + hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function SafetyProvider({ children }) {
  // SOS & Emergency
  const [sosActive, setSosActive] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: 19.0760, lng: 72.8777, address: "BKC Junction, Central District" });

  // Stealth Disguise Mode (functional calculator disguise)
  const [stealthMode, setStealthMode] = useState(false);

  // Device Simulator Mode ('desktop' | 'mobile') for responsive preview
  const [previewMode, setPreviewMode] = useState('desktop');

  // Emergency Helplines quick drawer
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);

  // 1. Blockchain Evidence Vault State
  const [evidenceRecords, setEvidenceRecords] = useState([
    {
      id: 'EV-8841-A',
      title: 'Incident Stalking Audio Recording',
      fileType: 'audio/mp3',
      fileSize: '4.2 MB',
      timestamp: '2026-09-28 21:44:12 UTC',
      blockNumber: 19482910,
      txHash: '0x8f2d93e1b742881a9c45012e8bfa17c0934177265a12ec82b8a0715cf1a90d81',
      sha256Hash: '0x3e17cf64bda0b95781a5a041f02c61159ce967f08c350119280d0d21a221f73b',
      ipfsCid: 'ipfs://bafybeicg2u7x2r4kqlwvnf77n26b2t64p2e5q273yvkn35n35m6f4327ia',
      location: 'Andheri West Transit Hub, Mumbai',
      status: 'Anchored on Ethereum & IPFS',
      grants: {
        legalAid: true,
        policeCell: true,
        ngoCounsel: false,
      }
    },
    {
      id: 'EV-8842-B',
      title: 'Cab Deviation Route Coordinates & Dashcam Clip',
      fileType: 'video/mp4',
      fileSize: '18.7 MB',
      timestamp: '2026-09-29 23:12:05 UTC',
      blockNumber: 19483422,
      txHash: '0x4c278912ef01399ad567822a9041bc571b0029381745aa667104b9012cdfb847',
      sha256Hash: '0x9924a2ef9b1399ad7788412acb09184511ef56312a00941571ef9941a87b1c34',
      ipfsCid: 'ipfs://bafybeidw5u8v7p3mqlwvnr98o37c3u75q3f6r384zwn46o46n7g54388ea',
      location: 'Eastern Express Highway Exit 4',
      status: 'Anchored on Ethereum & IPFS',
      grants: {
        legalAid: true,
        policeCell: false,
        ngoCounsel: true,
      }
    }
  ]);

  // 2. Crowdsourced Safety Map State (Safecity inspired)
  const [incidents, setIncidents] = useState([
    {
      id: 'INC-101',
      category: 'Catcalling / Harassment',
      severity: 'high',
      locationName: 'Colaba Causeway, Bus Stop 4',
      coordinates: { x: 38, y: 62 },
      time: 'Night (10:30 PM)',
      date: '2026-09-28',
      description: 'Group of men loitering near the unlit bus stop making intrusive remarks.',
      lightingRating: 1, // out of 5
      crowdRating: 2,
      verifiedCount: 14,
      isSafePoint: false
    },
    {
      id: 'INC-102',
      category: 'Poor / Broken Street Lighting',
      severity: 'medium',
      locationName: 'Metro Station Pillar 42-48',
      coordinates: { x: 55, y: 40 },
      time: 'Evening (8:15 PM)',
      date: '2026-09-29',
      description: 'Stretches for 300 meters in pitch black darkness. Several women reported feeling followed.',
      lightingRating: 1,
      crowdRating: 3,
      verifiedCount: 29,
      isSafePoint: false
    },
    {
      id: 'INC-103',
      category: 'Stalking & Following',
      severity: 'high',
      locationName: 'University Back Gate Alley',
      coordinates: { x: 25, y: 30 },
      time: 'Night (11:00 PM)',
      date: '2026-09-27',
      description: 'Two-wheeler continuously shadowed students walking toward the hostel.',
      lightingRating: 2,
      crowdRating: 1,
      verifiedCount: 22,
      isSafePoint: false
    },
    {
      id: 'INC-104',
      category: 'Verified Safe Haven',
      severity: 'safe',
      locationName: '24/7 Apollo Pharmacy & Police Assistance Desk',
      coordinates: { x: 72, y: 55 },
      time: '24/7 Active',
      date: '2026-09-30',
      description: 'CCTV monitored, bright lighting, verified security guard and SOS booth.',
      lightingRating: 5,
      crowdRating: 5,
      verifiedCount: 98,
      isSafePoint: true
    },
    {
      id: 'INC-105',
      category: 'All-Women Help Kiosk',
      severity: 'safe',
      locationName: 'Central Railway Station East Exit',
      coordinates: { x: 48, y: 75 },
      time: '24/7 Active',
      date: '2026-09-30',
      description: 'Dedicated women police assistance booth with charging station and helpline phone.',
      lightingRating: 5,
      crowdRating: 5,
      verifiedCount: 142,
      isSafePoint: true
    }
  ]);

  // 3. Safe Commute State
  const [activeCommute, setActiveCommute] = useState({
    active: false,
    vehicleNumber: 'MH 02 CR 4482',
    driverName: 'Sanjay Verma',
    service: 'Uber Go (Electric)',
    safetyRating: 4.9,
    policeVerified: true,
    origin: 'Bandra Kurla Complex',
    destination: 'Powai Lake Residences',
    routeProgress: 45, // percent
    driftAlert: false,
    shareLink: 'https://guardiansafe.app/track/trip-8842-live'
  });

  // Handle SOS toggle with audio siren
  const triggerSOS = () => {
    setSosActive(true);
    startAudioSiren();
    // Simulate fetching precise GPS coords
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
          });
        },
        () => {}
      );
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    stopAudioSiren();
  };

  // Add Evidence to Blockchain Vault
  const addEvidenceToVault = async ({ title, file, location, category }) => {
    const hash = await computeSHA256(file);
    const newRecord = {
      id: `EV-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      title,
      fileType: file.type || 'application/octet-stream',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      blockNumber: 19483500 + Math.floor(Math.random() * 150),
      txHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
      sha256Hash: hash,
      ipfsCid: `ipfs://bafybei${Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(36)).join('').slice(0, 32)}`,
      location: location || 'Auto-Detected Coordinates',
      status: 'Anchored on Ethereum & IPFS',
      grants: {
        legalAid: true,
        policeCell: false,
        ngoCounsel: false
      }
    };
    setEvidenceRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  // Toggle Smart Contract Access Grants
  const toggleGrant = (recordId, roleKey) => {
    setEvidenceRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          grants: {
            ...rec.grants,
            [roleKey]: !rec.grants[roleKey]
          }
        };
      }
      return rec;
    }));
  };

  // Add Incident to Crowdsourced Safety Map
  const addIncident = (newInc) => {
    const incObj = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      ...newInc,
      date: new Date().toISOString().slice(0, 10),
      verifiedCount: 1,
      coordinates: newInc.coordinates || { x: Math.floor(20 + Math.random() * 60), y: Math.floor(20 + Math.random() * 60) }
    };
    setIncidents(prev => [incObj, ...prev]);
  };

  return (
    <SafetyContext.Provider
      value={{
        sosActive,
        triggerSOS,
        cancelSOS,
        stealthMode,
        setStealthMode,
        previewMode,
        setPreviewMode,
        helplineModalOpen,
        setHelplineModalOpen,
        evidenceRecords,
        addEvidenceToVault,
        toggleGrant,
        incidents,
        addIncident,
        activeCommute,
        setActiveCommute,
        currentCoords,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
