'use client';

import TopBar from '@/components/TopBar';
import {
  SYNTHETIC_WORKS, SYNTHETIC_MPs, SYNTHETIC_ALERTS, SYNTHETIC_CASE_EVENTS,
  formatLakh,
} from '@/lib/data';
import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, IndianRupee, FileText,
  AlertTriangle, History, CheckCircle, Clock, Building2,
  Info, FlaskConical, Image,
} from 'lucide-react';

function DetailRow({ label, value, mono, warn }: { label: string; value: React.ReactNode; mono?: boolean; warn?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(30,41,59,0.4)' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, paddingTop: 2 }}>{label}</span>
      <span style={{ fontSize: '0.84rem', color: warn ? '#f59e0b' : 'var(--clr-text-primary)', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: mono ? 500 : 400 }}>{value}</span>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        padding: '8px 16px', border: 'none', cursor: 'pointer',
        background: 'transparent', fontFamily: 'inherit',
        fontSize: '0.83rem', fontWeight: active ? 600 : 400,
        color: active ? 'var(--clr-accent-primary)' : 'var(--clr-text-muted)',
        borderBottom: active ? '2px solid var(--clr-accent-primary)' : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

import { useState } from 'react';

export default function WorkDetailPage({ params }: PageProps<'/dashboard/works/[id]'>) {
  const { id } = use(params);
  const work = SYNTHETIC_WORKS.find(w => w.id === id);
  if (!work) notFound();

  const [tab, setTab] = useState<'overview' | 'timeline' | 'alerts' | 'evidence'>('overview');
  const mp = SYNTHETIC_MPs.find(m => m.id === work.mpId);
  const alerts = SYNTHETIC_ALERTS.filter(a => a.workId === work.id);
  const events = SYNTHETIC_CASE_EVENTS.filter(e => alerts.some(a => a.id === e.alertId));
  const isOverspend = work.expenditureLakh > work.revisedAmountLakh;

  return (
    <div>
      <TopBar title="Work Detail" subtitle={`${work.id} — Synthetic demonstration data`} />

      <main style={{ padding: '20px 24px' }} role="main">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Link href="/dashboard/works" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Works
          </Link>
          <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>/</span>
          <span style={{ color: 'var(--clr-text-primary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>{work.id}</span>
        </div>

        {/* Synthetic banner */}
        <div className="synthetic-banner" style={{ marginBottom: 16 }} role="note">
          <FlaskConical size={13} />
          <span><strong>SYNTHETIC</strong> — This work record is fabricated for demonstration only.</span>
        </div>

        {/* Header */}
        <div style={{
          background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--clr-accent-secondary)', background: 'rgba(6,182,212,0.08)', padding: '2px 8px', borderRadius: 5 }}>{work.id}</span>
                <span className={`badge badge-${work.status === 'delayed' ? 'critical' : work.status === 'completed' ? 'active' : 'info'}`}>
                  {work.status.replace('_', ' ')}
                </span>
                {work.missingEvidence && <span className="badge badge-high"><AlertTriangle size={9} /> Missing Evidence</span>}
              </div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 4 }}>{work.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                  <MapPin size={12} /> {work.district}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                  <Building2 size={12} /> {work.agency}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                  <FileText size={12} /> {work.sector}
                </span>
              </div>
            </div>

            {/* Risk badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Score</div>
              <div style={{
                fontSize: '2rem', fontWeight: 800, lineHeight: 1,
                color: work.riskLevel === 'critical' ? '#ef4444' : work.riskLevel === 'high' ? '#f97316' : '#f59e0b',
              }}>{work.riskScore}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>Review priority (0–100)</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', marginTop: 2, maxWidth: 140 }}>Operational ranking only, not a fraud probability</div>
            </div>
          </div>

          {/* Financial summary row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12, marginTop: 20,
            paddingTop: 16, borderTop: '1px solid var(--clr-border)',
          }}>
            {[
              { label: 'Original Sanction', value: formatLakh(work.sanctionedAmountLakh), color: '#3b82f6' },
              { label: 'Revised Sanction', value: formatLakh(work.revisedAmountLakh), color: '#06b6d4', note: work.revisedAmountLakh === work.sanctionedAmountLakh ? 'no revision' : 'revised' },
              { label: 'Expenditure Recorded', value: formatLakh(work.expenditureLakh), color: isOverspend ? '#ef4444' : '#10b981', note: isOverspend ? '▲ exceeds sanction' : 'within sanction' },
              { label: 'Physical Progress', value: `${work.physicalProgress}%`, color: work.physicalProgress === 100 ? '#10b981' : '#f59e0b' },
              { label: 'Evidence Count', value: String(work.evidenceCount), color: work.missingEvidence ? '#f97316' : '#10b981', note: work.missingEvidence ? 'some missing' : 'complete' },
              { label: 'Open Alerts', value: String(alerts.filter(a => a.status !== 'closed').length), color: alerts.length > 0 ? '#ef4444' : '#10b981' },
            ].map(({ label, value, color, note }) => (
              <div key={label} style={{ background: 'var(--clr-bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
                {note && <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>{note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div role="tablist" aria-label="Work details sections" style={{
            display: 'flex',
            borderBottom: '1px solid var(--clr-border)',
            padding: '0 16px',
            background: 'var(--clr-bg-elevated)',
          }}>
            <Tab label="Overview" active={tab === 'overview'} onClick={() => setTab('overview')} />
            <Tab label={`Alerts (${alerts.length})`} active={tab === 'alerts'} onClick={() => setTab('alerts')} />
            <Tab label="Timeline" active={tab === 'timeline'} onClick={() => setTab('timeline')} />
            <Tab label="Evidence" active={tab === 'evidence'} onClick={() => setTab('evidence')} />
          </div>

          <div role="tabpanel" style={{ padding: 24 }}>
            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Details</h2>
                  <DetailRow label="Work ID" value={work.id} mono />
                  <DetailRow label="Name" value={work.name} />
                  <DetailRow label="District" value={work.district} />
                  <DetailRow label="Sector" value={work.sector} />
                  <DetailRow label="Implementing Agency" value={work.agency} />
                  <DetailRow label="MP (Synthetic)" value={mp?.name ?? '—'} />
                  <DetailRow label="Lat / Lng" value={`${work.lat}, ${work.lng}`} mono />
                </div>
                <div>
                  <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Schedule</h2>
                  <DetailRow label="Sanction Date" value={work.sanctionDate} />
                  <DetailRow label="Original Completion" value={work.originalCompletionDate} />
                  <DetailRow label="Revised Completion" value={work.revisedCompletionDate ?? 'No revision recorded'} warn={!!work.revisedCompletionDate} />
                  <DetailRow label="Actual Completion" value={work.actualCompletionDate ?? 'Not yet complete'} />
                  <DetailRow label="Status" value={work.status.replace('_', ' ')} />

                  {isOverspend && (
                    <div style={{
                      marginTop: 16, padding: '12px 14px',
                      background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 8,
                    }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>Expenditure exceeds approved sanction</div>
                          <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 3, lineHeight: 1.5 }}>
                            Recorded expenditure {formatLakh(work.expenditureLakh)} exceeds revised sanction {formatLakh(work.revisedAmountLakh)}.
                            First check approved revisions and accounting adjustments. Raise clarification if no valid approval found.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{
                    marginTop: 16, padding: '10px 12px',
                    background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: 8,
                  }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <Info size={13} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
                        Source, timestamp and history fields would appear here in production. All values shown are synthetic.
                        Disputed fields show the source system ID, ingestion timestamp, and change history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alerts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: 32 }}>
                    <CheckCircle size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <p>No alerts for this work.</p>
                  </div>
                ) : alerts.map(alert => (
                  <Link
                    key={alert.id}
                    href={`/dashboard/alerts/${alert.id}`}
                    style={{
                      display: 'block', padding: '14px 16px',
                      background: 'var(--clr-bg-elevated)',
                      border: `1px solid ${alert.riskLevel === 'critical' ? 'rgba(239,68,68,0.3)' : alert.riskLevel === 'high' ? 'rgba(249,115,22,0.3)' : 'var(--clr-border)'}`,
                      borderRadius: 8, textDecoration: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className={`badge badge-${alert.riskLevel}`}>{alert.riskLevel}</span>
                          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{alert.id}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{alert.category}</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--clr-text-primary)', marginBottom: 6 }}>{alert.title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6 }}>{alert.description}</div>
                      </div>
                      <span className={`badge badge-${alert.status === 'new' ? 'critical' : alert.status === 'closed' ? 'active' : 'medium'}`} style={{ flexShrink: 0 }}>
                        {alert.status}
                      </span>
                    </div>
                    <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                        <span style={{ fontWeight: 600 }}>Observed: </span>{alert.observedValue}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                        <span style={{ fontWeight: 600 }}>Expected: </span>{alert.expectedRange}
                      </div>
                    </div>
                    <div style={{ marginTop: 6, fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>
                      Rule/Model: {alert.ruleOrModel} · Detected: {new Date(alert.detectedAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {tab === 'timeline' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { date: work.sanctionDate, event: 'Work Sanctioned', detail: `Sanction issued for ${formatLakh(work.sanctionedAmountLakh)}`, icon: CheckCircle, color: '#3b82f6' },
                    { date: work.sanctionDate, event: 'Work Order Issued', detail: `Agency: ${work.agency}`, icon: FileText, color: '#06b6d4' },
                    ...(events.map(e => ({ date: e.timestamp.split('T')[0], event: e.action, detail: e.note, icon: History, color: '#8b5cf6' }))),
                    ...(work.revisedCompletionDate ? [{ date: work.revisedCompletionDate, event: 'Revised Completion Date', detail: `Original: ${work.originalCompletionDate}`, icon: Calendar, color: '#f59e0b' }] : []),
                    ...(work.actualCompletionDate ? [{ date: work.actualCompletionDate, event: 'Work Completed', detail: 'Physical completion confirmed', icon: CheckCircle, color: '#10b981' }] : []),
                  ].sort((a, b) => a.date.localeCompare(b.date))
                  .map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: `${item.color}18`, border: `2px solid ${item.color}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <item.icon size={13} color={item.color} />
                        </div>
                        {i < 5 && <div style={{ width: 1, flex: 1, background: 'var(--clr-border)', margin: '4px 0' }} />}
                      </div>
                      <div style={{ paddingBottom: 16, flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{item.date}</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--clr-text-primary)', marginTop: 2 }}>{item.event}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--clr-text-secondary)', marginTop: 2 }}>{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'evidence' && (
              <div>
                <div style={{
                  padding: '16px', background: 'rgba(59,130,246,0.05)',
                  border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, marginBottom: 16,
                }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6 }}>
                    <Info size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Evidence records include: capture timestamp, upload timestamp, uploader, content hash and verification status.
                    Physical progress cannot be derived from photographs alone; corroborate with measurements, inspections and document trails.
                    In this demonstration, evidence counts are synthetic.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {Array.from({ length: work.evidenceCount }).map((_, i) => (
                    <div key={i} style={{
                      background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border)',
                      borderRadius: 8, padding: '14px', textAlign: 'center',
                    }}>
                      <div style={{
                        width: '100%', height: 80, borderRadius: 6, marginBottom: 8,
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Image size={24} color="var(--clr-text-muted)" />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-secondary)', fontWeight: 500 }}>Evidence #{i + 1}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>
                        {i < work.evidenceCount - (work.missingEvidence ? 1 : 0) ? '✓ Verified' : '⚠ Pending review'}
                      </div>
                    </div>
                  ))}
                  {work.missingEvidence && (
                    <div style={{
                      background: 'rgba(239,68,68,0.05)', border: '1px dashed rgba(239,68,68,0.3)',
                      borderRadius: 8, padding: '14px', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <AlertTriangle size={20} color="#ef4444" />
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>Missing Evidence</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--clr-text-muted)' }}>Required for milestone sign-off</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
