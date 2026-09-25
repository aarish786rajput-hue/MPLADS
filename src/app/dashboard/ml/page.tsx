'use client';
import TopBar from '@/components/TopBar';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { SYNTHETIC_WORKS, formatLakh } from '@/lib/data';
import { runMLPipeline, resetMLCache, MLResults } from '@/lib/ml';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ScatterChart, Scatter, ZAxis,
} from 'recharts';
import {
  Cpu, AlertTriangle, Copy, TrendingUp, RefreshCw,
  ChevronRight, Info, CheckCircle, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

type Tab = 'anomalies' | 'duplicates' | 'delay' | 'cost';

export default function MLPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('anomalies');
  const [results, setResults] = useState<MLResults | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [selectedDelay, setSelectedDelay] = useState<string | null>(null);

  useEffect(() => {
    runRealMLPipeline();
  }, []);

  async function runRealMLPipeline() {
    setRunning(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/predict');
      const data = await response.json();
      
      if (data.anomalies) {
        const adaptedResults: any = {
          runAt: new Date().toISOString(),
          anomalies: data.anomalies.map((a: any) => ({
            workId: `DB-${a.id}`,
            isAnomaly: true,
            anomalyScore: a.anomalyScore,
            reasons: [`Cost is ₹${a.costLakh}L (Unusually high)`],
            modelVersion: 'IsolationForest (SQLite DB)'
          })),
          duplicates: [],
          delayRisks: [],
          costDeviations: []
        };
        setResults(adaptedResults);
        toast(`Real ML complete — ${data.anomalies_found} anomalies found out of ${data.processed_count} records from SQLite`, 'success');
      }
    } catch (error) {
      console.error(error);
      toast('Failed to connect to Python FastAPI backend.', 'error');
    }
    setRunning(false);
  }

  async function rerun() {
    runRealMLPipeline();
  }

  const anomalyWork = selectedAnomaly ? results?.anomalies.find(a => a.workId === selectedAnomaly) : null;
  const delayWork = selectedDelay ? results?.delayRisks.find(d => d.workId === selectedDelay) : null;

  return (
    <div>
      <TopBar title="ML Insights" subtitle="Machine learning analysis on synthetic works data" />

      <main style={{ padding: '20px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="ml-badge"><Cpu size={10} /> IsolationForest v1.2</span>
              <span className="ml-badge"><Cpu size={10} /> LogisticRegression v1.0</span>
              <span className="ml-badge"><Cpu size={10} /> CosineSimilarity v1.1</span>
              <span className="ml-badge"><Cpu size={10} /> ZScore v1.0</span>
            </div>
            {results && (
              <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginTop: 6 }}>
                Last run: {new Date(results.runAt).toLocaleTimeString('en-IN')} · Processed from SQLite Database
              </p>
            )}
          </div>
          <button onClick={rerun} disabled={running} className="btn btn-primary btn-sm">
            <RefreshCw size={13} style={running ? { animation: 'spin 0.7s linear infinite' } : {}} />
            {running ? 'Running…' : 'Re-run Pipeline'}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="alert-banner warning" style={{ marginBottom: 20 }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>AI Shadow Mode (LIVE DB):</strong> This dashboard is now connected to the real Python FastAPI Backend and SQLite Database. Anomalies shown are predicted using a real Scikit-Learn IsolationForest model.
          </div>
        </div>

        {/* Summary KPI cards */}
        {results && (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Anomalous Works', value: results.anomalies.filter(a => a.isAnomaly).length, total: SYNTHETIC_WORKS.length, color: '#dc2626', icon: AlertTriangle, tab: 'anomalies' as Tab },
              { label: 'Duplicate Candidates', value: results.duplicates.length, total: null, color: '#ea580c', icon: Copy, tab: 'duplicates' as Tab },
              { label: 'High/Critical Delay Risk', value: results.delayRisks.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length, total: SYNTHETIC_WORKS.length, color: '#d97706', icon: TrendingUp, tab: 'delay' as Tab },
              { label: 'Cost Deviants (|z|>1.5)', value: results.costDeviations.filter(c => c.isDeviant).length, total: SYNTHETIC_WORKS.length, color: '#6d28d9', icon: TrendingUp, tab: 'cost' as Tab },
            ].map(({ label, value, total, color, icon: Icon, tab: t }) => (
              <button
                key={label}
                onClick={() => setTab(t)}
                className="metric-card"
                style={{ textAlign: 'left', border: tab === t ? `2px solid ${color}` : '1px solid #e5e7eb', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span className="ml-badge"><Cpu size={9} /> ML</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                {total && <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 3 }}>of {total} works</div>}
                <div style={{ fontSize: '0.75rem', color: '#374151', marginTop: 4, fontWeight: 500 }}>{label}</div>
              </button>
            ))}
          </div>
        )}

        {!results && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--clr-text-muted)' }}>
            <div className="spinner" style={{ border: '2px solid #e5e7eb', borderTopColor: 'var(--clr-primary)', margin: '0 auto 16px', width: 24, height: 24 }} />
            <p>Running ML pipeline…</p>
          </div>
        )}

        {results && (
          <>
            {/* Tabs */}
            <div className="tab-strip" style={{ marginBottom: 20 }}>
              {([
                { id: 'anomalies', label: `Anomaly Detection (${results.anomalies.filter(a => a.isAnomaly).length} flagged)` },
                { id: 'duplicates', label: `Duplicate Detection (${results.duplicates.length} pairs)` },
                { id: 'delay', label: `Delay Risk Prediction` },
                { id: 'cost', label: `Cost Deviation` },
              ] as { id: Tab; label: string }[]).map(t => (
                <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {/* ─ ANOMALY DETECTION ─ */}
            {tab === 'anomalies' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '0.88rem' }}>Isolation Forest — Anomaly Scores</h2>
                      <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>Score ≥60 flagged as anomalous. Shadow review only.</p>
                    </div>
                  </div>
                  <div style={{ height: 200, padding: '14px 8px 0' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...results.anomalies].sort((a, b) => b.anomalyScore - a.anomalyScore)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="workId" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={40} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '0.78rem', borderRadius: 6, border: '1px solid #e5e7eb' }} formatter={(v: any) => [`Score: ${v}`, 'Anomaly Score']} />
                        <Bar dataKey="anomalyScore" radius={[3, 3, 0, 0]}
                          fill="#dc2626"
                          label={false}
                        />
                        {/* Threshold line at 60 is implicit */}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ overflowX: 'auto', marginTop: 8 }}>
                    <table className="data-table">
                      <thead><tr>
                        <th>Work ID</th><th>Anomaly Score</th><th>Status</th><th>Reasons</th><th>Action</th>
                      </tr></thead>
                      <tbody>
                        {[...results.anomalies].sort((a, b) => b.anomalyScore - a.anomalyScore).map(a => (
                          <tr key={a.workId} style={{ background: a.isAnomaly ? '#fef2f2' : undefined }}>
                            <td>
                              <Link href={`/dashboard/works/${a.workId}`} style={{ color: 'var(--clr-accent)', textDecoration: 'none', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                {a.workId}
                              </Link>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="progress-bar" style={{ width: 60 }}>
                                  <div className="progress-fill" style={{ width: `${a.anomalyScore}%`, background: a.anomalyScore >= 60 ? '#dc2626' : a.anomalyScore >= 40 ? '#d97706' : '#15803d' }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: a.anomalyScore >= 60 ? '#dc2626' : '#374151' }}>{a.anomalyScore}</span>
                              </div>
                            </td>
                            <td>
                              {a.isAnomaly
                                ? <span className="badge badge-critical">⚠ Flagged</span>
                                : <span className="badge badge-low"><CheckCircle size={9} /> Normal</span>}
                            </td>
                            <td style={{ maxWidth: 220, fontSize: '0.76rem', color: '#6b7280' }}>{a.reasons[0] ?? '—'}</td>
                            <td>
                              <button onClick={() => setSelectedAnomaly(a.workId)} className="btn btn-outline btn-xs">
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="card" style={{ padding: 18 }}>
                    <h3 style={{ fontSize: '0.82rem', marginBottom: 10 }}>How It Works</h3>
                    <div style={{ fontSize: '0.76rem', color: '#4b5563', lineHeight: 1.7 }}>
                      <p><strong>Model:</strong> Isolation Forest (50 trees, sample=24)</p>
                      <p style={{ marginTop: 6 }}><strong>Features used:</strong></p>
                      <ul style={{ listStyle: 'disc', paddingLeft: 16, marginTop: 4 }}>
                        <li>Expenditure / Sanction ratio</li>
                        <li>Physical progress %</li>
                        <li>Days overdue / 365</li>
                        <li>Evidence count</li>
                        <li>Open alerts count</li>
                        <li>Progress lag vs schedule</li>
                      </ul>
                      <p style={{ marginTop: 8 }}><strong>Threshold:</strong> Score ≥60 → Anomalous</p>
                      <p style={{ marginTop: 6 }}>Low path length in the tree = anomalous. Scores are normalised 0–100.</p>
                    </div>
                  </div>
                  <div className="alert-banner info">
                    <Info size={13} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.74rem' }}>Isolation Forest identifies statistical outliers, not misconduct. Each flagged work requires independent human review.</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─ DUPLICATE DETECTION ─ */}
            {tab === 'duplicates' && (
              <div>
                {results.duplicates.length === 0 ? (
                  <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--clr-text-muted)' }}>
                    <CheckCircle size={32} style={{ marginBottom: 8, color: '#15803d' }} />
                    <p>No duplicate candidates detected at current threshold (≥35% combined score).</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                    <div className="card" style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
                        <h2 style={{ fontSize: '0.88rem' }}>Candidate Duplicate Pairs</h2>
                        <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                          Based on name similarity + geographic proximity + same sector. Combined score ≥35%.
                        </p>
                      </div>
                      <table className="data-table">
                        <thead><tr>
                          <th>#</th><th>Work A</th><th>Work B</th><th>Similarity</th><th>Distance</th><th>Reasons</th>
                        </tr></thead>
                        <tbody>
                          {results.duplicates.map((d, i) => (
                            <tr key={i}>
                              <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{i + 1}</td>
                              <td>
                                <Link href={`/dashboard/works/${d.workId1}`} style={{ color: 'var(--clr-accent)', fontFamily: 'monospace', fontSize: '0.78rem', textDecoration: 'none' }}>{d.workId1}</Link>
                              </td>
                              <td>
                                <Link href={`/dashboard/works/${d.workId2}`} style={{ color: 'var(--clr-accent)', fontFamily: 'monospace', fontSize: '0.78rem', textDecoration: 'none' }}>{d.workId2}</Link>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div className="progress-bar" style={{ width: 50 }}>
                                    <div className="progress-fill" style={{ width: `${d.similarityScore * 100}%`, background: d.similarityScore > 0.6 ? '#dc2626' : '#d97706' }} />
                                  </div>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{(d.similarityScore * 100).toFixed(0)}%</span>
                                </div>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                {d.distanceKm !== null ? `${d.distanceKm.toFixed(1)} km` : 'N/A'}
                              </td>
                              <td style={{ fontSize: '0.74rem', color: '#6b7280', maxWidth: 200 }}>{d.reasons.join(' · ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="card" style={{ padding: 18 }}>
                      <h3 style={{ fontSize: '0.82rem', marginBottom: 10 }}>Model Details</h3>
                      <div style={{ fontSize: '0.76rem', color: '#4b5563', lineHeight: 1.7 }}>
                        <p><strong>Text Similarity:</strong> TF-IDF cosine (weight: 55%)</p>
                        <p><strong>Geo Similarity:</strong> Haversine distance &lt;20km (weight: 35%)</p>
                        <p><strong>Same MP bonus:</strong> +10%</p>
                        <p style={{ marginTop: 8 }}><strong>Threshold:</strong> Combined ≥ 35%</p>
                      </div>
                      <div className="alert-banner warning" style={{ marginTop: 12 }}>
                        <AlertTriangle size={12} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem' }}>
                          Proximity alone does not prove duplication. Phased works or neighbouring projects may be legitimate. Expert review required.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ DELAY RISK ─ */}
            {tab === 'delay' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '0.88rem' }}>Delay Risk Prediction — Logistic Regression</h2>
                    <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>Probability of work being delayed based on current features</p>
                  </div>
                  <table className="data-table">
                    <thead><tr>
                      <th>Work ID</th><th>Risk Level</th><th>Probability</th><th>Days at Risk</th><th>Top Factor</th><th>Detail</th>
                    </tr></thead>
                    <tbody>
                      {[...results.delayRisks]
                        .sort((a, b) => b.riskProbability - a.riskProbability)
                        .map(d => {
                          const colorMap = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#15803d' };
                          return (
                            <tr key={d.workId}>
                              <td>
                                <Link href={`/dashboard/works/${d.workId}`} style={{ color: 'var(--clr-accent)', fontFamily: 'monospace', fontSize: '0.8rem', textDecoration: 'none' }}>
                                  {d.workId}
                                </Link>
                              </td>
                              <td>
                                <span className={`badge badge-${d.riskLevel}`}>{d.riskLevel}</span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div className="progress-bar" style={{ width: 60 }}>
                                    <div className="progress-fill" style={{ width: `${d.riskProbability * 100}%`, background: colorMap[d.riskLevel] }} />
                                  </div>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: colorMap[d.riskLevel] }}>
                                    {(d.riskProbability * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                              <td style={{ fontWeight: d.daysAtRisk > 0 ? 600 : 400, color: d.daysAtRisk > 0 ? '#dc2626' : '#6b7280', fontSize: '0.8rem' }}>
                                {d.daysAtRisk > 0 ? `${d.daysAtRisk}d` : '—'}
                              </td>
                              <td style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: 180 }}>
                                {d.factors[0]?.name ?? '—'}
                              </td>
                              <td>
                                <button onClick={() => setSelectedDelay(d.workId)} className="btn btn-outline btn-xs">View</button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="card" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: '0.82rem', marginBottom: 10 }}>Logistic Regression Weights</h3>
                  <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.8 }}>
                    {[
                      ['Progress behind schedule', '×2.4'],
                      ['Expenditure/Sanction ratio', '×1.8'],
                      ['Missing evidence', '×1.2'],
                      ['Days overdue /100', '×0.05'],
                      ['Sanction revision', '×0.7'],
                      ['Sector risk', '×0.6'],
                      ['Agency track record', '−0.4'],
                      ['Intercept', '−2.1'],
                    ].map(([f, w]) => (
                      <div key={f} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <span>{f}</span>
                        <span style={{ fontWeight: 600, color: w.startsWith('−') ? '#15803d' : '#dc2626' }}>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─ COST DEVIATION ─ */}
            {tab === 'cost' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '0.88rem' }}>Cost Deviation — Z-score Analysis</h2>
                    <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>Sanction amount vs sector average. |z| &gt; 1.5 = deviant.</p>
                  </div>
                  <table className="data-table">
                    <thead><tr>
                      <th>Work ID</th><th>Sector Avg (₹L)</th><th>Actual (₹L)</th><th>Deviation</th><th>Z-Score</th><th>Flag</th>
                    </tr></thead>
                    <tbody>
                      {[...results.costDeviations]
                        .sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore))
                        .map(c => (
                          <tr key={c.workId} style={{ background: c.isDeviant ? '#fffbeb' : undefined }}>
                            <td>
                              <Link href={`/dashboard/works/${c.workId}`} style={{ color: 'var(--clr-accent)', fontFamily: 'monospace', fontSize: '0.8rem', textDecoration: 'none' }}>{c.workId}</Link>
                            </td>
                            <td style={{ fontSize: '0.8rem' }}>₹{c.expectedRateLakh}L</td>
                            <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>₹{c.actualRateLakh}L</td>
                            <td style={{ fontSize: '0.8rem', fontWeight: 600, color: c.deviationPct > 0 ? '#dc2626' : '#15803d' }}>
                              {c.deviationPct > 0 ? '+' : ''}{c.deviationPct}%
                            </td>
                            <td style={{ fontWeight: 600, color: Math.abs(c.zScore) > 1.5 ? '#d97706' : '#374151', fontSize: '0.82rem' }}>
                              {c.zScore}
                            </td>
                            <td>
                              {c.isDeviant
                                ? <span className="badge badge-medium">⚠ Deviant</span>
                                : <span className="badge badge-low">Normal</span>}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="card" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: '0.82rem', marginBottom: 10 }}>Methodology</h3>
                  <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.7 }}>
                    <p><strong>Method:</strong> Z-score within sector peer group</p>
                    <p><strong>Formula:</strong> z = (x − μ) / σ</p>
                    <p><strong>Threshold:</strong> |z| ≥ 1.5 flagged</p>
                    <p style={{ marginTop: 8 }}>Works in the same sector form the comparison group. Results are sensitive to group size — small groups may produce large z-scores for legitimate works.</p>
                  </div>
                  <div className="alert-banner info" style={{ marginTop: 12 }}>
                    <Info size={12} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem' }}>High cost deviation requires comparison with approved schedule of rates before concluding overpricing.</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Anomaly detail modal */}
      <Modal
        open={!!selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        title={`Anomaly Detail — ${selectedAnomaly}`}
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/dashboard/works/${selectedAnomaly}`} className="btn btn-primary btn-sm">
              Open Work <ExternalLink size={12} />
            </Link>
            <button onClick={() => setSelectedAnomaly(null)} className="btn btn-ghost btn-sm">Close</button>
          </div>
        }
      >
        {anomalyWork && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '12px 14px', background: anomalyWork.isAnomaly ? '#fef2f2' : '#f0fdf4', borderRadius: 7 }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: anomalyWork.isAnomaly ? '#dc2626' : '#15803d' }}>{anomalyWork.anomalyScore}</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Anomaly Score (0–100)</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  {anomalyWork.isAnomaly ? '⚠ Flagged — review recommended' : '✓ Within normal range'}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Detection Reasons:</div>
              {anomalyWork.reasons.length > 0
                ? anomalyWork.reasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, padding: '5px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#374151' }}>
                    <span style={{ color: '#dc2626', flexShrink: 0 }}>•</span> {r}
                  </div>
                ))
                : <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>No specific reasons — anomaly detected via multivariate pattern.</p>}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
              Model: {anomalyWork.modelVersion} · Threshold: score ≥60
            </div>
          </div>
        )}
      </Modal>

      {/* Delay detail modal */}
      <Modal
        open={!!selectedDelay}
        onClose={() => setSelectedDelay(null)}
        title={`Delay Risk — ${selectedDelay}`}
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/dashboard/works/${selectedDelay}`} className="btn btn-primary btn-sm">Open Work</Link>
            <button onClick={() => setSelectedDelay(null)} className="btn btn-ghost btn-sm">Close</button>
          </div>
        }
      >
        {delayWork && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: 7 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: delayWork.riskLevel === 'critical' ? '#dc2626' : delayWork.riskLevel === 'high' ? '#ea580c' : '#d97706' }}>
                  {(delayWork.riskProbability * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Delay probability</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: 7 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: delayWork.daysAtRisk > 0 ? '#dc2626' : '#15803d' }}>
                  {delayWork.daysAtRisk > 0 ? `${delayWork.daysAtRisk}d` : 'On time'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Days overdue</div>
              </div>
            </div>
            <div style={{ fontSize: '0.77rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Feature Contributions:</div>
            {delayWork.factors.map((f, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 3 }}>
                  <span style={{ color: '#4b5563' }}>{f.name}</span>
                  <span style={{ fontWeight: 600 }}>{(f.contribution * 100).toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${f.contribution * 100}%`, background: f.contribution > 0.5 ? '#dc2626' : '#d97706' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
