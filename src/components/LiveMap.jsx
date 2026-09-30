import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Pulsing dot markers via divIcon — avoids Leaflet's PNG asset paths entirely.
const dotIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="position:relative;width:16px;height:16px;">
      <span style="position:absolute;inset:-6px;border-radius:50%;background:${color}44;animation:lm-pulse 1.6s ease-out infinite;"></span>
      <span style="position:absolute;inset:0;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color};"></span>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

/**
 * Real-time map (Leaflet + OpenStreetMap — no API key).
 * props:
 *   center   [lat,lng] | null   — follow target
 *   markers  [{lat,lng,label,color}]
 *   trail    [[lat,lng], ...]   — path polyline
 *   follow   boolean            — auto-pan to center
 *   height   number
 */
export default function LiveMap({ center, markers = [], trail = [], follow = true, height = 340 }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ markers: [], trail: null });

  // Init map once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    map.setView([20.5937, 78.9629], 5); // India-wide default
    mapRef.current = map;

    if (!document.getElementById('lm-pulse-style')) {
      const s = document.createElement('style');
      s.id = 'lm-pulse-style';
      s.textContent = '@keyframes lm-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.4);opacity:0}}';
      document.head.appendChild(s);
    }
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => { clearTimeout(t); map.remove(); mapRef.current = null; };
  }, []);

  // Re-draw markers + trail whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const prev = layersRef.current;
    prev.markers.forEach((m) => map.removeLayer(m));
    if (prev.trail) map.removeLayer(prev.trail);

    const newMarkers = markers
      .filter((m) => m && Number.isFinite(Number(m.lat)) && Number.isFinite(Number(m.lng)))
      .map((m) =>
        L.marker([Number(m.lat), Number(m.lng)], { icon: dotIcon(m.color || '#6366f1') })
          .addTo(map)
          .bindPopup(`<b>${m.label || 'Live'}</b><br/>${Number(m.lat).toFixed(5)}, ${Number(m.lng).toFixed(5)}`)
      );

    const pts = trail.filter((p) => Array.isArray(p) && Number.isFinite(Number(p[0])) && Number.isFinite(Number(p[1])));
    let trailLayer = null;
    if (pts.length > 1) {
      trailLayer = L.polyline(pts, { color: '#818cf8', weight: 4, opacity: 0.8 }).addTo(map);
    }
    layersRef.current = { markers: newMarkers, trail: trailLayer };
  }, [markers, trail]);

  // Follow mode: keep target centered
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !follow || !center) return;
    const [lat, lng] = center;
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
    map.setView([Number(lat), Number(lng)], Math.max(map.getZoom(), 16), { animate: true, duration: 0.6 });
  }, [center, follow]);

  return (
    <div
      ref={elRef}
      style={{
        height,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        zIndex: 0,
        background: '#0b1220',
      }}
    />
  );
}
