'use client';

import TopBar from '@/components/TopBar';
import { SYNTHETIC_ALERTS, SYNTHETIC_CASE_EVENTS, getRiskClass, getAlertStatusClass, formatLakh } from '@/lib/data';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, AlertTriangle, User, Calendar, CheckCircle,
  XCircle, ArrowUp, MessageSquare, RefreshCw, FlaskConical, Info,
} from 'lucide-react';

const LIFECYCLE = ['new', 'triaged', 'assigned', 'under_review', 'closed', 'escalated'];

export default function AlertDetailPage({ params }: PageProps<'/dashboard/alerts/[id]'>) {
  const { id } = use(params);
  const alert = SYNTHETIC_ALERTS.find(a => a.id === id);
  if (!alert) notFound();

  const events = SYNTHETIC_CASE_EVENTS.filter(e => e.alertId === alert.id);
  const [action, setAction] = useState('');
  const [note, setNote] = useState('');

  const currentStepIndex = LIFECYCLE.indexOf(alert.status);

  return (
    <div>
      <TopBar title="Alert Detail" subtitle={`${alert.id} — Case workspace`} />

      <main style={{ padding: '20px 24px' }} role="main">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Link href="/dashboard/alerts" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Alerts
          </Link>
          <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>/</span>
          <span className="mono" style={{ color: 'var(--clr-text-primary)', fontSize: '0.8rem' }}>{alert.id}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Left: Alert detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Synthetic banner */}
            <div className="synthetic-banner" role="note">
              <FlaskConical size={13} />
              <span><strong>SYNTHETIC</strong> — This alert is fabricated for demonstration only.</span>
            </div>

            {/* Header card */}
            <div style={{
              background: 'var(--clr-bg-card)', border: `1px solid ${alert.riskLevel === 'critical' ? 'rgba(239,68,68,0.4)' : alert.riskLevel === 'high' ? 'rgba(249,115,22,0.3)' : 'var(--clr-border)'}`,
              borderRadius: 12, padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                <span className={`badge ${getRiskClass(alert.riskLevel)}`}>{alert.riskLevel}</span>
                <span className={`badge ${getAlertStatusClass(alert.status)}`}>{alert.status}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{alert.category}</span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{alert.id}</span>
              </div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 10 }}>{alert.title}</h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--clr-text-secondary)', lineHeight: 1.7 }}>{alert.description}</p>

              {/* Warning: amount not a proven loss */}
              {alert.amountAssociatedLakh !== null && (
                <div style={{
                  marginTop: 14, padding: '10px 14px',
                  background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 8, display: 'flex', gap: 8,
                }}>
                  <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', color: '#d97706', lineHeight: 1.5 }}>
                    <strong>Amount associated with this case: ₹{alert.amountAssociatedLakh}L</strong> — This is the amount associated with the work/transaction under review.
                    It is <strong>not</strong> a confirmed financial loss or proven fraud. Do not report as savings without authority confirmation.
                  </p>
                </div>
              )}
            </div>

            {/* Evidence detail */}
            <div style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Detection Evidence
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Observed Value', value: alert.observedValue },
                  { label: 'Expected Range', value: alert.expectedRange },
                  { label: 'Rule / Model', value: alert.ruleOrModel },
                  { label: 'Detected At', value: new Date(alert.detectedAt).toLocaleString('en-IN') },
                  { label: 'Work', value: alert.workId },
                  { label: 'Assigned To', value: alert.assignedTo ?? 'Unassigned' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--clr-bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-primary)', wordBreak: 'break-word' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
                <Info size={12} color="#3b82f6" style={{ display: 'inline', marginRight: 6 }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                  A clean model result means no signal was detected in available data; it does not certify judicious use. Independently review random unflagged works to expose missed issues.
                </span>
              </div>
            </div>

            {/* Audit trail */}
            <div style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Audit Trail
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {events.length === 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>No recorded events yet.</p>
                )}
                {events.map((evt, i) => (
                  <div key={evt.id} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(59,130,246,0.12)', border: '2px solid rgba(59,130,246,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <User size={10} color="#3b82f6" />
                      </div>
                      {i < events.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--clr-border)', margin: '4px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: 14 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text-primary)' }}>{evt.action}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>by {evt.actor}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>{new Date(evt.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--clr-text-secondary)', marginTop: 3 }}>{evt.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Case actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Lifecycle progress */}
            <div style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '16px 18px',
            }}>
              <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Case Lifecycle
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {LIFECYCLE.map((step, i) => {
                  const isDone = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: isDone ? '#10b981' : isCurrent ? '#3b82f6' : 'var(--clr-bg-elevated)',
                        border: `2px solid ${isDone ? '#10b981' : isCurrent ? '#3b82f6' : 'var(--clr-border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isDone && <CheckCircle size={11} color="white" />}
                        {isCurrent && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--clr-text-primary)' : isDone ? '#10b981' : 'var(--clr-text-muted)', textTransform: 'capitalize' }}>
                        {step.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '16px 18px',
            }}>
              <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <select
                  aria-label="Select action"
                  value={action}
                  onChange={e => setAction(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px',
                    background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border)',
                    borderRadius: 7, color: 'var(--clr-text-primary)', fontSize: '0.82rem',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                >
                  <option value="">Select action…</option>
                  <option value="assign">Assign to reviewer</option>
                  <option value="clarify">Request clarification</option>
                  <option value="inspection">Schedule inspection</option>
                  <option value="dismiss">Dismiss with reason</option>
                  <option value="escalate">Escalate</option>
                  <option value="close">Close case</option>
                </select>
                <textarea
                  aria-label="Review note"
                  placeholder="Add note or reason…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 10px',
                    background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border)',
                    borderRadius: 7, color: 'var(--clr-text-primary)', fontSize: '0.82rem',
                    fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                  }}
                />
                <button
                  aria-label="Submit case action"
                  style={{
                    width: '100%', padding: '9px', background: 'var(--clr-accent-primary)',
                    border: 'none', borderRadius: 7, color: 'white',
                    fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <MessageSquare size={14} /> Submit Action
                </button>
              </div>

              <p style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginTop: 10, lineHeight: 1.5 }}>
                All actions are recorded in the audit trail. Dismissals require a stated reason. Cases can be reopened.
              </p>
            </div>

            {/* Related work link */}
            <div style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Related Work
              </h2>
              <Link href={`/dashboard/works/${alert.workId}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'var(--clr-bg-elevated)',
                  border: '1px solid var(--clr-border-light)', borderRadius: 8,
                  textDecoration: 'none', color: 'var(--clr-text-primary)',
                }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--clr-accent-primary)' }}>{alert.workId}</span>
                <ArrowLeft size={13} style={{ transform: 'rotate(180deg)' }} color="var(--clr-text-muted)" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
