'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix missing marker icons in Next.js + Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const [works, setWorks] = useState<any[]>([]);
  
  useEffect(() => {
    // Backend se MPLADS works fetch karna jisme lat/lng hain
    fetch('http://127.0.0.1:8000/api/works')
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(e => console.error("Error fetching map data:", e));
  }, []);

  return (
    <div style={{ minHeight: '65vh', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Delhi ka central coordinate */}
      <MapContainer center={[28.6139, 77.2090]} zoom={11} scrollWheelZoom={false} style={{ minHeight: '65vh', height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {works.map((work) => (
          work.lat && work.lng ? (
            <Marker key={work.id} position={[work.lat, work.lng]} icon={icon}>
              <Popup>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#1f2937' }}>{work.workName}</strong>
                  <span style={{ display: 'block', color: '#4b5563' }}>Status: <strong>{work.status}</strong></span>
                  <span style={{ display: 'block', color: '#dc2626' }}>Cost: ₹{work.costLakh}L</span>
                  <span style={{ display: 'block', color: '#1d4ed8', marginTop: '4px' }}>{work.category}</span>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
