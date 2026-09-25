'use client';

import TopBar from '@/components/TopBar';
import dynamic from 'next/dynamic';
import { MapPin, AlertTriangle, Info, Map as MapIcon, Database } from 'lucide-react';

// Dynamically import Map component (ssr: false required for Leaflet)
const MapDynamic = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '12px' }}>
      <div className="spinner" style={{ border: '3px solid #e5e7eb', borderTopColor: 'var(--clr-primary)', width: 32, height: 32 }} />
    </div>
  )
});

export default function MapPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f3f4f6' }}>
      <TopBar title="Interactive Map View" subtitle="Live geographic distribution of MPLADS works from SQLite Database" />
      
      <main style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em' }}>
              <MapPin size={24} color="#2563eb" /> Regional Project Distribution
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '6px', maxWidth: '800px', lineHeight: 1.5 }}>
              This interactive map displays all ongoing and completed projects fetched directly from the Python backend. Click on any pin to view the project's exact details, including cost and status.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <Database size={16} color="#059669" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Live Data</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <MapIcon size={16} color="#2563eb" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>OpenStreetMap</span>
            </div>
          </div>
        </div>

        {/* Warning Panel */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '2px' }}>Real-time Coordinates Sync</strong>
            <p style={{ fontSize: '0.8rem', color: '#1d4ed8', margin: 0, lineHeight: 1.4 }}>
              The pins on this map are generated using the `lat` and `lng` coordinates from the SQLite database. In a production environment, physical inspection is still required to verify the true location of the asset.
            </p>
          </div>
        </div>

        {/* Map Container - Full Width & Height */}
        <div style={{ flex: 1, minHeight: '65vh', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <MapDynamic />
        </div>
        
      </main>
    </div>
  );
}
