'use client';

import TopBar from '@/components/TopBar';
import { SYNTHETIC_ALERTS, getRiskClass, getAlertStatusClass } from '@/lib/data';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, Shield, Copy, Database, Filter, Search,
  TrendingDown, Clock, ArrowRight,
} from 'lucide-react';

const CATEGORIES = ['financial', 'execution', 'compliance', 'data_quality', 'duplicate'] as const;
const STATUSES = ['new', 'triaged', 'assigned', 'under_review', 'closed', 'escalated'] as const;
const RISKS = ['critical', 'high', 'medium', 'low'] as const;

const CATEGORY_META = {
  financial: { icon: TrendingDown, color: '#ef4444', label: 'Financial Anomaly' },
  execution: { icon: Clock, color: '#f59e0b', label: 'Execution Risk' },
  compliance: { icon: Shield, color: '#8b5cf6', label: 'Compliance' },
  data_quality: { icon: Database, color: '#06b6d4', label: 'Data Quality' },
  duplicate: { icon: Copy, color: '#f97316', label: 'Duplicate Candidate' },
};

export default function AlertsPage() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => SYNTHETIC_ALERTS.filter(a => {
    const matchSearch = search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.workId.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'all' || a.riskLevel === filterRisk;
    const matchCat = filterCat === 'all' || a.category === filterCat;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchRisk && matchCat && matchStatus;
  }), [search, filterRisk, filterCat, filterStatus]);

  // Summary by category
  const catCounts = useMemo(() =>
    CATEGORIES.map(cat => ({ cat, count: SYNTHETIC_ALERTS.filter(a => a.category === cat && a.status !== 'closed').length })),
    [],
  );

  return (
    <div>
      <TopBar title="Risk Alerts" subtitle="Open alerts — Synthetic demonstration data" />

      <main style={{ padding: '20px 24px' }} role="main">

        {/* Alert note */}
        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 8, fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6,
        }} role="note">
          <AlertTriangle size={13} style={{ display: 'inline', marginRight: 6, color: '#ef4444' }} />
          <strong>Important:</strong> A model flag does not establish fraud, justify an automatic payment block, or prove an asset exists.
          AI-generated signals are in <strong>shadow review mode</strong> — they do not affect official decisions. Each alert requires independent human review.
        </div>

        {/* Category summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
          {catCounts.map(({ cat, count }) => {
            const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
            return (
              <button
                key={cat}
                onClick={() => setFilterCat(filterCat === cat ? 'all' : cat)}
                aria-pressed={filterCat === cat}
                style={{
                  background: filterCat === cat ? `${meta.color}15` : 'var(--clr-bg-card)',
                  border: `1px solid ${filterCat === cat ? `${meta.color}40` : 'var(--clr-border)'}`,
                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <meta.icon size={14} color={meta.color} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{meta.label}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: meta.color }}>{count}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)' }}>open alerts</div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <Filter size={14} color="var(--clr-text-muted)" />
          <div style={{ position: 'relative', flex: '1 1 180px' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', pointerEvents: 'none' }} />
            <input
              type="search"
              aria-label="Search alerts"
              placeholder="Search alerts or work ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '7px 12px 7px 28px',
                background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border)',
                borderRadius: 7, color: 'var(--clr-text-primary)', fontSize: '0.82rem',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>

          {[
            { id: 'ar', label: 'Risk', value: filterRisk, set: setFilterRisk, opts: [['all', 'All Risks'], ...RISKS.map(r => [r, r])] },
            { id: 'ac', label: 'Category', value: filterCat, set: setFilterCat, opts: [['all', 'All Categories'], ...CATEGORIES.map(c => [c, CATEGORY_META[c as keyof typeof CATEGORY_META].label])] },
            { id: 'as', label: 'Status', value: filterStatus, set: setFilterStatus, opts: [['all', 'All Statuses'], ...STATUSES.map(s => [s, s])] },
          ].map(({ id, label, value, set, opts }) => (
            <div key={id}>
              <label htmlFor={id} style={{ display: 'block', fontSize: '0.62rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</label>
              <select id={id} value={value} onChange={e => set(e.target.value)}
                style={{
                  padding: '6px 10px', background: 'var(--clr-bg-elevated)',
                  border: '1px solid var(--clr-border)', borderRadius: 7,
                  color: 'var(--clr-text-primary)', fontSize: '0.78rem',
                  fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                }}
              >
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Alerts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 40,
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 10, color: 'var(--clr-text-muted)',
            }}>
              No alerts match your filters.
            </div>
          ) : filtered.map(alert => {
            const catMeta = CATEGORY_META[alert.category as keyof typeof CATEGORY_META];
            return (
              <div
                key={alert.id}
                style={{
                  background: 'var(--clr-bg-card)',
                  border: `1px solid ${alert.riskLevel === 'critical' ? 'rgba(239,68,68,0.3)' : alert.riskLevel === 'high' ? 'rgba(249,115,22,0.25)' : 'var(--clr-border)'}`,
                  borderRadius: 10, padding: '16px 20px',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <catMeta.icon size={14} color={catMeta.color} />
                    <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{alert.id}</span>
                    <span className={`badge ${getRiskClass(alert.riskLevel)}`}>{alert.riskLevel}</span>
                    <span className={`badge ${getAlertStatusClass(alert.status)}`}>{alert.status}</span>
                    <span style={{ color: catMeta.color, background: `${catMeta.color}10`, padding: '2px 8px', borderRadius: 9999, fontWeight: 600, fontSize: '0.68rem' }}>
                      {catMeta.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Link href={`/dashboard/works/${alert.workId}`}
                      style={{ fontSize: '0.72rem', color: 'var(--clr-accent-secondary)', textDecoration: 'none', fontFamily: 'monospace' }}>
                      {alert.workId}
                    </Link>
                    <Link href={`/dashboard/alerts/${alert.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '5px 10px', background: 'var(--clr-bg-elevated)',
                        border: '1px solid var(--clr-border-light)', borderRadius: 6,
                        color: 'var(--clr-text-secondary)', textDecoration: 'none', fontSize: '0.75rem',
                      }}>
                      Review <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 6 }}>{alert.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{alert.description}</p>

                {/* Evidence grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', background: 'var(--clr-bg-elevated)', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Observed: </strong>{alert.observedValue}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', background: 'var(--clr-bg-elevated)', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Expected: </strong>{alert.expectedRange}
                  </div>
                  {alert.amountAssociatedLakh !== null && (
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b', background: 'rgba(245,158,11,0.07)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.2)' }}>
                      <strong>Amount associated: </strong>₹{alert.amountAssociatedLakh}L
                      <span style={{ color: 'var(--clr-text-muted)', marginLeft: 4 }}>(not a confirmed loss)</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', background: 'var(--clr-bg-elevated)', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Rule/Model: </strong>{alert.ruleOrModel}
                  </div>
                </div>

                {/* Assigned / Date */}
                <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>
                    Detected: {new Date(alert.detectedAt).toLocaleDateString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>
                    Assigned to: {alert.assignedTo ?? 'Unassigned'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
