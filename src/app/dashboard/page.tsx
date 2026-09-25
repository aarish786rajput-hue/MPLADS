'use client';
import TopBar from '@/components/TopBar';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import MLComponent from '@/components/MLComponent';
import dynamic from 'next/dynamic';
import {
  SYNTHETIC_OVERVIEW, SYNTHETIC_DISTRICT_STATS, SYNTHETIC_SECTOR_STATS,
  SYNTHETIC_MONTHLY_TREND, SYNTHETIC_ALERTS, SYNTHETIC_WORKS,
  formatLakh, formatCrore, getRiskClass, getStatusClass,
} from '@/lib/data';
import { runMLPipeline } from '@/lib/ml';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  IndianRupee, TrendingUp, AlertTriangle, CheckCircle, Clock,
  FileWarning, Copy, Database, ArrowUpRight, Info, Download,
  RefreshCw, Cpu, Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

function MetricCard({ label, value, sub, icon: Icon, color, href, trend }: {
  label: string; value: string; sub?: string; icon: React.ElementType;
  color: string; href?: string; trend?: string;
}) {
  const inner = (
    <div className="metric-card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        {trend && (
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: trend.startsWith('+') ? '#dc2626' : '#15803d' }}>{trend}</span>
        )}
      </div>
      <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.77rem', color: '#374151', marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
      {href && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.73rem', color: 'var(--clr-accent)', fontWeight: 500 }}>
          View details <ArrowUpRight size={11} />
        </div>
      )}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>;
  return inner;
}

export default function OverviewPage() {
  const { toast } = useToast();
  const ov = SYNTHETIC_OVERVIEW;
  const recentAlerts = SYNTHETIC_ALERTS.filter(a => a.status !== 'closed').slice(0, 5);
  const atRiskWorks = SYNTHETIC_WORKS.filter(w => w.riskLevel === 'critical' || w.riskLevel === 'high').slice(0, 5);
  const [showDataModal, setShowDataModal] = useState(false);
  
  // Calculate ML summary using useMemo to avoid hydration mismatches and cascading renders
  const mlSummary = useMemo(() => {
    const r = runMLPipeline(SYNTHETIC_WORKS);
    return {
      anomalies: r.anomalies.filter(a => a.isAnomaly).length,
      duplicates: r.duplicates.length,
      highRisk: r.delayRisks.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length,
    };
  }, []);

  return (
    <div>
      <TopBar title="Overview Dashboard" subtitle={`As of ${ov.dataFreshnessLabel} · Synthetic demonstration data`} />
      <main style={{ padding: '20px 24px' }}>

        {/* Synthetic banner */}
        <div className="alert-banner warning" style={{ marginBottom: 16 }}>
          <AlertTriangle size={13} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem' }}>
            <strong>SYNTHETIC DATA ONLY —</strong> All figures, names, districts and works displayed are fabricated for demonstration.
            They do not represent real MPLADS records, official expenditure, or any MP&apos;s actual portfolio.
          </span>
        </div>
        
        {/* Test ML API */}
        <MLComponent />

        {/* ML summary banner */}
        {mlSummary && (
          <div style={{ marginBottom: 16, padding: '10px 16px', background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="ml-badge"><Cpu size={10} /> ML Active</span>
            <span style={{ fontSize: '0.78rem', color: '#5b21b6' }}>
              Latest analysis: <strong>{mlSummary.anomalies}</strong> anomalies · <strong>{mlSummary.duplicates}</strong> duplicate pairs · <strong>{mlSummary.highRisk}</strong> high/critical delay risks
            </span>
            <Link href="/dashboard/ml" style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#6d28d9', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View ML Insights <ArrowUpRight size={12} />
            </Link>
          </div>
        )}

        {/* ── Metric Cards ── */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14, marginBottom: 22 }}>
          <MetricCard label="Total Sanctioned (FY)" value={formatCrore(ov.totalSanctionedLakh)} sub="Approved sanction value" icon={IndianRupee} color="#1a3c6e" href="/dashboard/funds" />
          <MetricCard label="Recorded Expenditure" value={formatCrore(ov.totalExpenditureLakh)} sub="System records only — see definitions" icon={TrendingUp} color="#0055a5" href="/dashboard/funds" />
          <MetricCard label="Works This Year" value={String(ov.totalWorksThisYear)} sub={`${ov.completedWorks} completed`} icon={CheckCircle} color="#15803d" href="/dashboard/works" />
          <MetricCard label="Delayed Works" value={String(ov.delayedWorks)} sub="Past approved completion" icon={Clock} color="#d97706" trend={`+3 this month`} href="/dashboard/works" />
          <MetricCard label="Open Risk Alerts" value={String(ov.totalAlertsOpen)} sub={`${ov.alertsCritical} critical · ${ov.alertsHigh} high`} icon={AlertTriangle} color="#dc2626" trend={`+5 this week`} href="/dashboard/alerts" />
          <MetricCard label="Missing Evidence" value={String(ov.missingEvidenceWorks)} sub="Incomplete milestone evidence" icon={FileWarning} color="#6d28d9" href="/dashboard/compliance" />
          <MetricCard label="Duplicate Candidates" value={String(ov.duplicateCandidates)} sub="ML shadow-flagged pairs" icon={Copy} color="#ea580c" href="/dashboard/ml" />
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 18 }}>
          {/* Trend chart */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: '0.88rem' }}>Expenditure vs Sanction Trend</h2>
                <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>Monthly cumulative figures (₹ Lakh, synthetic)</p>
              </div>
              <button onClick={() => { toast('Trend data exported to CSV', 'success'); }} className="btn btn-ghost btn-xs">
                <Download size={12} /> Export
              </button>
            </div>
            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SYNTHETIC_MONTHLY_TREND} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3c6e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0055a5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0055a5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '0.78rem', borderRadius: 6, border: '1px solid #e5e7eb' }} formatter={(v: any) => [`₹${v}L`, '']} />
                  <Legend wrapperStyle={{ fontSize: '0.74rem' }} />
                  <Area type="monotone" dataKey="sanctioned" name="Sanctioned" stroke="#1a3c6e" fill="url(#gS)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="expenditure" name="Expenditure" stroke="#0055a5" fill="url(#gE)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 8 }}>
              <Info size={10} style={{ display: 'inline', marginRight: 3 }} />
              Sanction and expenditure are distinct stages — do not aggregate.
            </p>
          </div>

          {/* Sector pie */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <h2 style={{ fontSize: '0.88rem', marginBottom: 4 }}>Works by Sector</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginBottom: 12 }}>Count, synthetic data</p>
            <div style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SYNTHETIC_SECTOR_STATS} dataKey="works" nameKey="sector" cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3}>
                    {SYNTHETIC_SECTOR_STATS.map(s => <Cell key={s.sector} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '0.78rem', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {SYNTHETIC_SECTOR_STATS.map(s => (
                <div key={s.sector} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <span style={{ color: '#4b5563' }}>{s.sector}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{s.works}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── District chart + Recent alerts ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: '0.88rem' }}>District Expenditure (₹L)</h2>
              <Link href="/dashboard/funds" style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                All Districts <ArrowUpRight size={11} />
              </Link>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SYNTHETIC_DISTRICT_STATS} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="district" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '0.78rem', borderRadius: 6, border: '1px solid #e5e7eb' }} formatter={(v: any) => [`₹${v}L`, '']} />
                  <Legend wrapperStyle={{ fontSize: '0.74rem' }} />
                  <Bar dataKey="sanctioned" name="Sanctioned" fill="#e8eef5" stroke="#1a3c6e" strokeWidth={1} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expenditure" name="Expenditure" fill="#1a3c6e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: '0.88rem' }}>Recent Risk Alerts</h2>
              <Link href="/dashboard/alerts" style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                All Alerts <ArrowUpRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {recentAlerts.map(alert => (
                <Link key={alert.id} href={`/dashboard/alerts/${alert.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    background: '#fafafa', borderRadius: 6, border: '1px solid #f3f4f6',
                    transition: 'border-color 0.1s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#d1d5db')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#f3f4f6')}
                  >
                    <span className={`risk-dot ${alert.riskLevel}`} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{alert.workId} · {alert.category}</div>
                    </div>
                    <span className={`badge badge-${alert.riskLevel}`}>{alert.riskLevel}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── At-risk works table ── */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.88rem' }}>Works Requiring Attention</h2>
              <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>Critical & high risk — snapshot</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowDataModal(true)} className="btn btn-ghost btn-sm">
                <Info size={13} /> Data Definitions
              </button>
              <button onClick={() => { toast('Works exported to CSV (demo)', 'success'); }} className="btn btn-outline btn-sm">
                <Download size={13} /> Export
              </button>
              <Link href="/dashboard/works" className="btn btn-primary btn-sm">View All</Link>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Work ID</th><th>Description</th><th>District</th><th>Sector</th>
                  <th>Sanctioned</th><th>Expenditure</th><th>Progress</th><th>Risk</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {atRiskWorks.map(w => {
                  const isOver = w.expenditureLakh > w.revisedAmountLakh;
                  return (
                    <tr key={w.id}>
                      <td>
                        <Link href={`/dashboard/works/${w.id}`} style={{ color: 'var(--clr-accent)', textDecoration: 'none', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {w.id}
                        </Link>
                      </td>
                      <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.82rem' }}>{w.name}</td>
                      <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{w.district}</td>
                      <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{w.sector}</td>
                      <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{formatLakh(w.sanctionedAmountLakh)}</td>
                      <td style={{ fontWeight: 600, color: isOver ? '#dc2626' : '#111827', fontSize: '0.82rem' }}>
                        {formatLakh(w.expenditureLakh)}
                        {isOver && <span style={{ display: 'block', fontSize: '0.65rem', color: '#dc2626' }}>▲ over sanction</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="progress-bar" style={{ width: 55 }}>
                            <div className="progress-fill" style={{ width: `${w.physicalProgress}%`, background: w.physicalProgress < 40 ? '#d97706' : '#15803d' }} />
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#6b7280' }}>{w.physicalProgress}%</span>
                        </div>
                      </td>
                      <td><span className={`badge badge-${w.riskLevel}`}>{w.riskLevel}</span></td>
                      <td><span className={`badge ${getStatusClass(w.status)}`}>{w.status.replace('_', ' ')}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '0.7rem', color: '#9ca3af', lineHeight: 1.6, borderTop: '1px solid #e5e7eb', paddingTop: 14 }}>
          <strong>Disclaimer:</strong> MPLADS Insight is a proposed engineering demonstration under MoSPI Blueprint (17 Sep 2026).
          All data shown is entirely synthetic. A model flag does not establish fraud or justify a payment block.
          Prerequisites including authorised data access, domain-approved compliance rules, and pilot sponsor must be confirmed before production use.
        </div>
      </main>

      {/* Data Definitions Modal */}
      <Modal
        open={showDataModal}
        onClose={() => setShowDataModal(false)}
        title="Financial Stage Definitions"
        size="lg"
        footer={<button onClick={() => setShowDataModal(false)} className="btn btn-primary btn-sm">Close</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Entitlement', 'Annual allocation per MP (₹5 Cr/year). Statutory cap, not a budget line.'],
            ['Recommendation', 'MP\'s written recommendation for a work. Triggers the sanction process.'],
            ['Sanction', 'District Authority approval. Amount may differ from recommendation.'],
            ['Revised Sanction', 'Updated sanction after approved revision. Must be authorised.'],
            ['Commitment', 'Contractual obligation to agency. Not yet settled.'],
            ['Expenditure (Recorded)', 'Settled payments as per system records. Distinct from sanction or commitment.'],
            ['Physical Progress', 'Measured milestone completion — not derivable from expenditure alone.'],
          ].map(([term, def]) => (
            <div key={term} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#111827' }}>{term}</span>
              <span style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5 }}>{def}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
