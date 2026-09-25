'use client';

import TopBar from '@/components/TopBar';
import { Database, AlertTriangle, CheckCircle, RefreshCw, Clock, FileWarning } from 'lucide-react';

const DATA_SOURCES = [
  { name: 'Works & Sanction Data', source: 'eSAKSHI / CSV Upload', lastSync: '2026-09-24 06:00', status: 'ok', records: 148, missing: 0 },
  { name: 'Payment Transactions', source: 'Payment System (pending API access)', lastSync: '—', status: 'pending', records: 0, missing: 0 },
  { name: 'Evidence Documents', source: 'Manual Upload', lastSync: '2026-09-23 18:30', status: 'ok', records: 312, missing: 11 },
  { name: 'Milestone Progress', source: 'Agency Submission', lastSync: '2026-09-22 12:00', status: 'stale', records: 92, missing: 56 },
  { name: 'Schedule of Rates', source: 'State PWD (manual import)', lastSync: '2026-07-01', status: 'stale', records: 1240, missing: 0 },
];

const IMPORT_ISSUES = [
  { id: 'IMP-ERR-001', field: 'Completion Date', record: 'WRK-2024-0044', issue: 'Date format unrecognised (DD/MM/YYYY expected)', severity: 'error', quarantined: true },
  { id: 'IMP-ERR-002', field: 'Sanction Amount', record: 'WRK-2024-0091', issue: 'Negative value received — likely data entry error', severity: 'error', quarantined: true },
  { id: 'IMP-WARN-001', field: 'Lat/Lng', record: 'WRK-2024-0012', issue: 'Coordinates outside expected district boundary ±5 km', severity: 'warning', quarantined: false },
  { id: 'IMP-WARN-002', field: 'Agency Name', record: 'Multiple', issue: '14 agency names could not be standardised — originals preserved', severity: 'warning', quarantined: false },
];

export default function DataQualityPage() {
  return (
    <div>
      <TopBar title="Data Quality" subtitle="Import status & coverage indicators" />
      <main style={{ padding: '20px 24px' }} role="main">

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Active Sources', value: '5', color: '#3b82f6', icon: Database },
            { label: 'Sources Stale/Pending', value: '3', color: '#f59e0b', icon: Clock },
            { label: 'Quarantined Records', value: '2', color: '#ef4444', icon: AlertTriangle },
            { label: 'Missing Evidence Links', value: '11', color: '#8b5cf6', icon: FileWarning },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Data sources */}
        <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--clr-border)' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>Data Source Status</h2>
          </div>
          <table className="data-table" aria-label="Data source status">
            <thead>
              <tr>
                <th scope="col">Dataset</th>
                <th scope="col">Source</th>
                <th scope="col">Last Sync</th>
                <th scope="col">Records</th>
                <th scope="col">Missing Links</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map(ds => (
                <tr key={ds.name}>
                  <td style={{ fontWeight: 500 }}>{ds.name}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{ds.source}</td>
                  <td style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{ds.lastSync}</td>
                  <td style={{ fontWeight: 600 }}>{ds.records > 0 ? ds.records.toLocaleString() : '—'}</td>
                  <td>
                    {ds.missing > 0
                      ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>{ds.missing}</span>
                      : <span style={{ color: '#10b981' }}>—</span>}
                  </td>
                  <td>
                    {ds.status === 'ok' && <span className="badge badge-active"><CheckCircle size={10} /> OK</span>}
                    {ds.status === 'stale' && <span className="badge badge-medium"><Clock size={10} /> Stale</span>}
                    {ds.status === 'pending' && <span className="badge badge-inactive">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Import issues */}
        <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>Import Issues & Quarantine</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>Invalid records are quarantined with actionable error messages — not silently dropped</p>
            </div>
            <button aria-label="Retry failed imports" style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border-light)',
              borderRadius: 7, color: 'var(--clr-text-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
          <table className="data-table" aria-label="Import issues">
            <thead>
              <tr>
                <th scope="col">Issue ID</th>
                <th scope="col">Field</th>
                <th scope="col">Record</th>
                <th scope="col">Description</th>
                <th scope="col">Quarantined</th>
                <th scope="col">Severity</th>
              </tr>
            </thead>
            <tbody>
              {IMPORT_ISSUES.map(issue => (
                <tr key={issue.id}>
                  <td className="mono" style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{issue.id}</td>
                  <td style={{ fontWeight: 500 }}>{issue.field}</td>
                  <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--clr-accent-primary)' }}>{issue.record}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', maxWidth: 300 }}>{issue.issue}</td>
                  <td>
                    {issue.quarantined
                      ? <span className="badge badge-critical"><AlertTriangle size={9} /> Yes</span>
                      : <span className="badge badge-inactive">No</span>}
                  </td>
                  <td>
                    <span className={`badge ${issue.severity === 'error' ? 'badge-critical' : 'badge-medium'}`}>{issue.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
