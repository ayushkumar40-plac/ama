import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import Navbar from './components/Navbar';
import MobileBottomDock from './components/MobileBottomDock';
import MobileSimulatorWrapper from './components/MobileSimulatorWrapper';
import EmergencyModal from './components/EmergencyModal';
import HelplineModal from './components/HelplineModal';
import StealthCalculator from './components/StealthCalculator';

// Pages
import Dashboard from './pages/Dashboard';
import SafetyMap from './pages/SafetyMap';
import EvidenceVault from './pages/EvidenceVault';
import AnonymousReport from './pages/AnonymousReport';
import SafeCommute from './pages/SafeCommute';
import SafeRoute from './pages/SafeRoute';
import FakeCall from './pages/FakeCall';
import BatteryAlert from './pages/BatteryAlert';
import VoiceTrigger from './pages/VoiceTrigger';
import LocationTracker from './pages/LocationTracker';
import BlockchainVault from './pages/BlockchainVault';

function MainAppLayout() {
  const { stealthMode } = useSafety();

  if (stealthMode) {
    return <StealthCalculator />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <MobileSimulatorWrapper>
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/safety-map" element={<SafetyMap />} />
            <Route path="/evidence-vault" element={<EvidenceVault />} />
            <Route path="/anonymous-report" element={<AnonymousReport />} />
            <Route path="/safe-commute" element={<SafeCommute />} />
            <Route path="/safe-route" element={<SafeRoute />} />
            <Route path="/fake-call" element={<FakeCall />} />
            <Route path="/voice-trigger" element={<VoiceTrigger />} />
            <Route path="/location" element={<LocationTracker />} />
            <Route path="/battery-alert" element={<BatteryAlert />} />
            <Route path="/vault" element={<BlockchainVault />} />
          </Routes>
        </main>
      </MobileSimulatorWrapper>

      <MobileBottomDock />
      <EmergencyModal />
      <HelplineModal />
    </div>
  );
}

function App() {
  return (
    <SafetyProvider>
      <MainAppLayout />
    </SafetyProvider>
  );
}

export default App;
