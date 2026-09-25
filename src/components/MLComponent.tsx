'use client';
import { useState } from 'react';

export default function MLComponent() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feature1: 10.5, feature2: 20.0 }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error connecting to Python backend:', error);
      setResult({ error: 'Failed to connect to backend' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Test ML API Connection</h2>
      <button 
        onClick={getPrediction}
        disabled={loading}
        className="btn btn-primary btn-sm"
        style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', background: 'var(--clr-primary)', color: 'white', border: 'none' }}
      >
        {loading ? 'Fetching...' : 'Get ML Insights'}
      </button>
      
      {result && (
        <pre style={{ marginTop: '16px', background: '#f3f4f6', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
