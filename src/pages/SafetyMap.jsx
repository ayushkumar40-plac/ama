import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  MapPin,
  Shield,
  AlertTriangle,
  Filter,
  PlusCircle,
  Eye,
  Clock,
  Sun,
  Moon,
  Users,
  CheckCircle,
  Search,
  Compass,
  Building,
  HeartHandshake,
  ThumbsUp,
  X
} from 'lucide-react';

export default function SafetyMap() {
  const { incidents, addIncident } = useSafety();

  // Mode: 'incidents' (red dots / unsafe) vs 'impact' (green dots / safe havens) - just like Safecity!
  const [mapMode, setMapMode] = useState('incidents'); // 'incidents' | 'impact'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  // New Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Catcalling / Harassment');
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('Night (9:00 PM - 12:00 AM)');
  const [newLighting, setNewLighting] = useState(2);
  const [newCrowd, setNewCrowd] = useState(2);
  const [newDescription, setNewDescription] = useState('');
  const [isSafeZoneSubmission, setIsSafeZoneSubmission] = useState(false);

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    // Mode match
    if (mapMode === 'incidents' && inc.isSafePoint) return false;
    if (mapMode === 'impact' && !inc.isSafePoint) return false;

    // Category match
    if (selectedCategory !== 'all' && !inc.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    // Time match
    if (selectedTime === 'night' && !inc.time.toLowerCase().includes('night')) return false;
    if (selectedTime === 'day' && inc.time.toLowerCase().includes('night')) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return inc.locationName.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q) || inc.category.toLowerCase().includes(q);
    }

    return true;
  });

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!newLocation || !newDescription) return;

    addIncident({
      category: isSafeZoneSubmission ? 'Community Safe Point' : newCategory,
      severity: isSafeZoneSubmission ? 'safe' : (newLighting <= 2 ? 'high' : 'medium'),
      locationName: newLocation,
      time: newTime,
      description: newDescription,
      lightingRating: Number(newLighting),
      crowdRating: Number(newCrowd),
      isSafePoint: isSafeZoneSubmission,
      coordinates: {
        x: Math.floor(25 + Math.random() * 55),
        y: Math.floor(25 + Math.random() * 55)
      }
    });

    setReportModalOpen(false);
    setNewLocation('');
    setNewDescription('');
  };

  return (
    <div className="app-container">
      {/* Safecity Inspired Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">
            <Compass size={12} /> CROWDSOURCED SAFETY INTELLIGENCE
          </span>
          <span className="badge badge-blue">
            SAFECITY PROTOCOL INTEGRATION
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '0.5rem' }}>
              Crowdsourced <span className="text-gradient">Safety Map</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '800px' }}>
              Real-time community heatmaps visualizing harassment reports, dimly lit zones, and verified safe havens. Empowering women with safe transit navigation and actionable community audits.
            </p>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="btn-primary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
          >
            <PlusCircle size={18} /> Share Incident Anonymously
          </button>
        </div>

        {/* Mode Switcher: Incidents (Red) vs Impact / Safe Havens (Green) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          width: 'fit-content',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>MAP VIEW:</span>
          <button
            onClick={() => setMapMode('incidents')}
            style={{
              background: mapMode === 'incidents' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              color: mapMode === 'incidents' ? '#f87171' : 'var(--text-muted)',
              border: mapMode === 'incidents' ? '1px solid #ef4444' : '1px solid transparent',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            Unsafe Incidents ({incidents.filter(i => !i.isSafePoint).length})
          </button>

          <button
            onClick={() => setMapMode('impact')}
            style={{
              background: mapMode === 'impact' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: mapMode === 'impact' ? '#34d399' : 'var(--text-muted)',
              border: mapMode === 'impact' ? '1px solid #10b981' : '1px solid transparent',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Safe Spaces & Impact ({incidents.filter(i => i.isSafePoint).length})
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search neighborhood, station, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">All Incident Types</option>
            <option value="harassment">Catcalling / Harassment</option>
            <option value="lighting">Poor Street Lighting</option>
            <option value="stalking">Stalking / Following</option>
            <option value="haven">Verified Safe Haven</option>
          </select>
        </div>

        {/* Time of Day Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--text-muted)" />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="all">Any Time of Day</option>
            <option value="night">Night Time (8 PM - 6 AM)</option>
            <option value="day">Day Time</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Incident List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* LEFT: Interactive Map Canvas */}
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#818cf8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Live Metropolitan Heatmap</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
              Real-Time Feed
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            background: '#090e1a',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <svg style={{ width: '100%', height: '100%' }}>
              <defs>
                {/* Heatmap Gradients */}
                <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatGreen" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#cityGrid)" />

              {/* Simulated Roads & Transit Corridors */}
              <path d="M 0 100 Q 200 130 450 110 T 800 150" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="6" />
              <path d="M 120 0 Q 150 250 130 450" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="5" />
              <path d="M 320 0 Q 300 200 360 450" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="7" />
              <path d="M 0 320 Q 250 280 500 340" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="5" />

              {/* Heatmap Bloom Circles */}
              <circle cx="38%" cy="62%" r="80" fill="url(#heatRed)" />
              <circle cx="25%" cy="30%" r="65" fill="url(#heatRed)" />
              <circle cx="55%" cy="40%" r="75" fill="url(#heatRed)" />
              <circle cx="72%" cy="55%" r="90" fill="url(#heatGreen)" />
              <circle cx="48%" cy="75%" r="85" fill="url(#heatGreen)" />

              {/* Sector Labels */}
              <text x="35" y="45" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">SECTOR 1: UNIVERSITY CAMPUS</text>
              <text x="260" y="85" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">CENTRAL METRO CORRIDOR</text>
              <text x="350" y="380" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">DOWNTOWN CIVIC PLAZA</text>
            </svg>

            {/* Incident Map Markers */}
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isSafe = inc.isSafePoint;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  style={{
                    position: 'absolute',
                    left: `${inc.coordinates.x}%`,
                    top: `${inc.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 50 : 20,
                    transition: 'all 0.2s'
                  }}
                  title={inc.locationName}
                >
                  <div style={{
                    width: isSelected ? '34px' : '26px',
                    height: isSelected ? '34px' : '26px',
                    borderRadius: '50%',
                    background: isSafe
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSafe
                      ? '0 0 15px rgba(16, 185, 129, 0.7)'
                      : '0 0 15px rgba(239, 68, 68, 0.7)',
                    border: '2px solid #fff'
                  }}>
                    {isSafe ? <Shield size={14} color="#fff" /> : <AlertTriangle size={14} color="#fff" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span>High-Risk Zone (Harassment / Poor Lighting)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              <span>Verified Safe Haven (Police Desk / CCTV)</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Incident Detail or Community Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {selectedIncident ? (
            <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span className={`badge ${selectedIncident.isSafePoint ? 'badge-green' : 'badge-red'}`} style={{ marginBottom: '6px' }}>
                    {selectedIncident.isSafePoint ? 'VERIFIED SAFE POINT' : 'COMMUNITY HARASSMENT REPORT'}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{selectedIncident.locationName}</h3>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                "{selectedIncident.description}"
              </p>

              {/* Audit Ratings */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LIGHTING AUDIT</div>
                  <div style={{ fontWeight: '700', color: selectedIncident.lightingRating >= 4 ? '#34d399' : '#f87171' }}>
                    {'★'.repeat(selectedIncident.lightingRating)}{'☆'.repeat(5 - selectedIncident.lightingRating)} ({selectedIncident.lightingRating}/5)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CROWD DENSITY</div>
                  <div style={{ fontWeight: '700', color: '#818cf8' }}>
                    {'★'.repeat(selectedIncident.crowdRating)}{'☆'.repeat(5 - selectedIncident.crowdRating)} ({selectedIncident.crowdRating}/5)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Reported on {selectedIncident.date} • {selectedIncident.time}
                </span>

                <button
                  onClick={() => {
                    selectedIncident.verifiedCount += 1;
                    setSelectedIncident({ ...selectedIncident });
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                >
                  <ThumbsUp size={14} /> I Felt Unsafe Here ({selectedIncident.verifiedCount})
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Community Reports Listing</span>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  {filteredIncidents.length} Records
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '480px', overflowY: 'auto' }}>
                {filteredIncidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className={`badge ${inc.isSafePoint ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                        {inc.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{inc.time}</span>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff', marginTop: '2px' }}>
                      {inc.locationName}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99992,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Share Incident Anonymously</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No login or personal data recorded. Empowers other women with real-time awareness.
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsSafeZoneSubmission(false)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: !isSafeZoneSubmission ? '2px solid #ef4444' : '1px solid var(--border-subtle)',
                    background: !isSafeZoneSubmission ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: !isSafeZoneSubmission ? '#f87171' : 'var(--text-muted)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Unsafe Incident / Harassment
                </button>
                <button
                  type="button"
                  onClick={() => setIsSafeZoneSubmission(true)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: isSafeZoneSubmission ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                    background: isSafeZoneSubmission ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: isSafeZoneSubmission ? '#34d399' : 'var(--text-muted)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Safe Space / Police Booth
                </button>
              </div>

              {!isSafeZoneSubmission && (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Type of Harassment
                  </label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="Catcalling / Harassment">Catcalling / Inappropriate Comments</option>
                    <option value="Stalking & Following">Stalking / Shadowing</option>
                    <option value="Poor / Broken Street Lighting">Dim / Broken Street Lighting</option>
                    <option value="Physical Groping / Assault">Physical Touch / Groping</option>
                    <option value="Unsafe Public Transport">Unsafe Transit / Cab Misconduct</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Location & Nearest Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dadar Station West Foot-Over-Bridge"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Lighting Quality (1 - 5)
                  </label>
                  <select value={newLighting} onChange={(e) => setNewLighting(e.target.value)}>
                    <option value="1">1 - Pitch Black Darkness</option>
                    <option value="2">2 - Dim / Flickering</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Well Lit</option>
                    <option value="5">5 - High Intensity Bright</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Crowd Density (1 - 5)
                  </label>
                  <select value={newCrowd} onChange={(e) => setNewCrowd(e.target.value)}>
                    <option value="1">1 - Totally Isolated</option>
                    <option value="2">2 - Scarce Pedestrians</option>
                    <option value="3">3 - Moderate Activity</option>
                    <option value="4">4 - Busy</option>
                    <option value="5">5 - Highly Populated</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Describe What Happened
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide context (e.g., number of perpetrators, behavior, exact time, warnings for others)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                Submit to Community Map
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
