import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FakeCall from './pages/FakeCall';
import BatteryAlert from './pages/BatteryAlert';
import VoiceTrigger from './pages/VoiceTrigger';
import LocationTracker from './pages/LocationTracker';
import SafeRoute from './pages/SafeRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fake-call" element={<FakeCall />} />
      <Route path="/voice-trigger" element={<VoiceTrigger />} />
      <Route path="/location" element={<LocationTracker />} />
      <Route path="/safe-route" element={<SafeRoute />} />
      <Route path="/battery-alert" element={<BatteryAlert />} />
    </Routes>
  );
}

export default App;
