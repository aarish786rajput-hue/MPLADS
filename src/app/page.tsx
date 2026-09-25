'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, AlertTriangle, Activity, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ROLES = [
  { id: 'admin', label: 'System Administrator', desc: 'Full access — all jurisdictions', password: 'admin123' },
  { id: 'dc', label: 'District Collector', desc: 'District-level view and action', password: 'dc123' },
  { id: 'nodal', label: 'Nodal Officer', desc: 'State-level monitoring', password: 'nodal123' },
  { id: 'mp', label: 'MP / Constituency Office', desc: 'Own constituency works only', password: 'mp123' },
  { id: 'auditor', label: 'Internal Auditor', desc: 'Read-only with export rights', password: 'audit123' },
  { id: 'field', label: 'Field Inspector', desc: 'Field evidence upload', password: 'field123' },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = ROLES.find(r => r.id === role)!;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!password) { setError('Please enter the demo password.'); return; }
    if (password !== selectedRole.password && password !== 'demo1234') {
      setError(`Incorrect password. Hint: try "${selectedRole.password}"`);
      return;
    }
    setLoading(true);
    toast('Authenticating…', 'info', 1500);
    await new Promise(r => setTimeout(r, 1200));
    toast(`Welcome! Signed in as ${selectedRole.label}`, 'success');
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>
      {/* Government header */}
      <div style={{ background: 'var(--gov-blue-dark)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="#e87722" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>MPLADS Insight</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem' }}>Ministry of Statistics & Programme Implementation (MoSPI) · Synthetic Demo</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#" onClick={e => { e.preventDefault(); toast('Help documentation would open here', 'info'); }} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Help <ExternalLink size={12} />
          </a>
        </div>
      </div>
      <div className="gov-stripe" />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

          {/* Left — info */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, marginBottom: 20 }}>
              <AlertTriangle size={13} color="#ea580c" />
              <span style={{ fontSize: '0.73rem', color: '#ea580c', fontWeight: 600 }}>SYNTHETIC DATA DEMONSTRATION</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a3c6e', lineHeight: 1.2, marginBottom: 12 }}>
              AI-Powered MPLADS<br />Monitoring Platform
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>
              Evidence-led monitoring, analytics and case-management for MPLADS works.
              Flags unusual expenditure, execution delays, duplicate works, and missing evidence.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '🤖', label: 'ML Anomaly Detection', desc: 'Isolation Forest + Logistic Regression' },
                { icon: '📊', label: 'Real-time Analytics', desc: 'District, sector & MP-wise dashboards' },
                { icon: '🔔', label: 'Risk Alert Routing', desc: 'Automatic case lifecycle management' },
                { icon: '🔒', label: 'Role-based Access', desc: 'Jurisdiction-scoped secure views' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#1f2937' }}>{f.label}</div>
                    <div style={{ fontSize: '0.73rem', color: '#6b7280' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — login form */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#1a3c6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>Sign In</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Access restricted to authorised users</div>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              {/* Role */}
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="role-select" style={{ display: 'block', fontSize: '0.77rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                  Demo Role
                </label>
                <select
                  id="role-select"
                  value={role}
                  onChange={e => { setRole(e.target.value); setPassword(''); setError(''); }}
                  className="form-select"
                >
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 4 }}>{selectedRole.desc}</div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="password-input" style={{ display: 'block', fontSize: '0.77rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                  Demo Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password-input"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder={`Enter password (hint: ${selectedRole.password})`}
                    className="form-input"
                    style={{ paddingRight: 40 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {showPass ? <EyeOff size={15} color="#9ca3af" /> : <Eye size={15} color="#9ca3af" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert-banner warning" style={{ marginBottom: 12 }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem' }}>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: 40, fontSize: '0.88rem' }}
              >
                {loading ? <><span className="spinner" />Signing in…</> : 'Sign In to Dashboard'}
              </button>
            </form>

            <div style={{
              marginTop: 20, padding: '12px 14px',
              background: '#fffbeb', border: '1px solid #fcd34d',
              borderRadius: 6, fontSize: '0.72rem', color: '#92400e', lineHeight: 1.6,
            }}>
              <strong>⚠️ Demo notice:</strong> All data, persons, works, amounts and MPs shown are entirely synthetic.
              This system is not connected to eSAKSHI or any official MPLADS database.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', textAlign: 'center', fontSize: '0.72rem', color: '#6b7280' }}>
        MPLADS Insight v1.2-demo · Not for official use · Blueprint: MoSPI, 17 Sep 2026 · All data synthetic
      </footer>
    </div>
  );
}
