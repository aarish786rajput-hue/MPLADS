'use client';

import TopBar from '@/components/TopBar';
import {
  SYNTHETIC_WORKS, SYNTHETIC_MPs, formatLakh, getRiskClass, getStatusClass,
  Work, RiskLevel, WorkStatus,
} from '@/lib/data';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Search, Download, AlertTriangle, Clock, CheckCircle, FileWarning } from 'lucide-react';

const ALL_STATUSES: WorkStatus[] = ['completed', 'in_progress', 'delayed', 'sanctioned', 'not_started'];
const ALL_RISKS: RiskLevel[] = ['critical', 'high', 'medium', 'low', 'info'];

export default function WorksPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<WorkStatus | 'all'>('all');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterSector, setFilterSector] = useState('all');

  const sectors = useMemo(() => ['all', ...Array.from(new Set(SYNTHETIC_WORKS.map(w => w.sector)))], []);

  const filtered = useMemo(() => SYNTHETIC_WORKS.filter(w => {
    const matchSearch = search === '' ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      w.district.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    const matchRisk = filterRisk === 'all' || w.riskLevel === filterRisk;
    const matchSector = filterSector === 'all' || w.sector === filterSector;
    return matchSearch && matchStatus && matchRisk && matchSector;
  }), [search, filterStatus, filterRisk, filterSector]);

  const getMP = (mpId: string) => SYNTHETIC_MPs.find(m => m.id === mpId);

  return (
    <div>
      <TopBar title="Works Register" subtitle="All works — Synthetic demonstration data" />

      <main style={{ padding: '20px 24px' }} role="main">
        {/* Summary counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Works', value: SYNTHETIC_WORKS.length, icon: CheckCircle, color: '#3b82f6' },
            { label: 'Delayed', value: SYNTHETIC_WORKS.filter(w => w.status === 'delayed').length, icon: Clock, color: '#f59e0b' },
            { label: 'Critical/High Risk', value: SYNTHETIC_WORKS.filter(w => w.riskLevel === 'critical' || w.riskLevel === 'high').length, icon: AlertTriangle, color: '#ef4444' },
            { label: 'Missing Evidence', value: SYNTHETIC_WORKS.filter(w => w.missingEvidence).length, icon: FileWarning, color: '#8b5cf6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-text-primary)' }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
          borderRadius: 10, padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <Filter size={15} color="var(--clr-text-muted)" />

          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', pointerEvents: 'none' }} />
            <input
              id="works-search"
              type="search"
              placeholder="Search work name, ID, district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search works"
              style={{
                width: '100%', padding: '7px 12px 7px 30px',
                background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border)',
                borderRadius: 7, color: 'var(--clr-text-primary)',
                fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>

          {[
            { id: 'filter-status', label: 'Status', value: filterStatus, onChange: (v: string) => setFilterStatus(v as WorkStatus | 'all'), options: [['all', 'All Statuses'], ...ALL_STATUSES.map(s => [s, s.replace('_', ' ')])] },
            { id: 'filter-risk', label: 'Risk', value: filterRisk, onChange: (v: string) => setFilterRisk(v as RiskLevel | 'all'), options: [['all', 'All Risk Levels'], ...ALL_RISKS.map(r => [r, r])] },
            { id: 'filter-sector', label: 'Sector', value: filterSector, onChange: (v: string) => setFilterSector(v), options: sectors.map(s => [s, s === 'all' ? 'All Sectors' : s]) },
          ].map(({ id, label, value, onChange, options }) => (
            <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label htmlFor={id} style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              <select
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                  padding: '6px 10px', background: 'var(--clr-bg-elevated)',
                  border: '1px solid var(--clr-border)', borderRadius: 7,
                  color: 'var(--clr-text-primary)', fontSize: '0.8rem',
                  fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                }}
              >
                {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
              </select>
            </div>
          ))}

          <button
            aria-label="Export works to spreadsheet"
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', background: 'var(--clr-bg-elevated)',
              border: '1px solid var(--clr-border-light)', borderRadius: 7,
              color: 'var(--clr-text-secondary)', fontSize: '0.8rem',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Download size={14} /> Export
          </button>
        </div>

        {/* Works table */}
        <div style={{
          background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
              Showing <strong style={{ color: 'var(--clr-text-primary)' }}>{filtered.length}</strong> of {SYNTHETIC_WORKS.length} works
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" aria-label="MPLADS works register">
              <thead>
                <tr>
                  <th scope="col">Work ID</th>
                  <th scope="col">Description</th>
                  <th scope="col">District</th>
                  <th scope="col">Sector</th>
                  <th scope="col">Agency</th>
                  <th scope="col">Sanctioned</th>
                  <th scope="col">Expenditure</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Completion Due</th>
                  <th scope="col">Alerts</th>
                  <th scope="col">Risk</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: 'center', padding: 32, color: 'var(--clr-text-muted)' }}>
                      No works match the current filters.
                    </td>
                  </tr>
                ) : filtered.map(w => {
                  const isOverspend = w.expenditureLakh > w.revisedAmountLakh;
                  const mp = getMP(w.mpId);
                  return (
                    <tr key={w.id}>
                      <td>
                        <Link href={`/dashboard/works/${w.id}`}
                          style={{ color: 'var(--clr-accent-primary)', textDecoration: 'none' }}
                          className="mono"
                        >{w.id}</Link>
                      </td>
                      <td>
                        <div style={{ maxWidth: 220 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--clr-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                          {mp && <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>{mp.name}</div>}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', whiteSpace: 'nowrap' }}>{w.district}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', whiteSpace: 'nowrap' }}>{w.sector}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.agency}</td>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatLakh(w.sanctionedAmountLakh)}</td>
                      <td style={{ fontWeight: 600, color: isOverspend ? '#ef4444' : 'inherit', whiteSpace: 'nowrap' }}>
                        {formatLakh(w.expenditureLakh)}
                        {isOverspend && <span style={{ display: 'block', fontSize: '0.65rem', color: '#ef4444' }}>▲ over sanction</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${w.physicalProgress}%`,
                                background: w.physicalProgress === 100 ? '#10b981' : w.physicalProgress < 40 ? '#f59e0b' : '#3b82f6',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', flexShrink: 0 }}>{w.physicalProgress}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: w.status === 'delayed' ? '#f59e0b' : 'var(--clr-text-secondary)', whiteSpace: 'nowrap' }}>
                        {w.revisedCompletionDate ?? w.originalCompletionDate}
                        {w.revisedCompletionDate && <span style={{ display: 'block', fontSize: '0.65rem', color: '#f59e0b' }}>revised</span>}
                      </td>
                      <td>
                        {w.alerts.length > 0 ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px', borderRadius: 9999,
                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                            fontSize: '0.72rem', fontWeight: 600,
                          }}>
                            <AlertTriangle size={10} /> {w.alerts.length}
                          </span>
                        ) : <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.75rem' }}>—</span>}
                      </td>
                      <td><span className={`badge ${getRiskClass(w.riskLevel)}`}>{w.riskLevel}</span></td>
                      <td><span className={`badge ${getStatusClass(w.status)}`}>{w.status.replace('_', ' ')}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
