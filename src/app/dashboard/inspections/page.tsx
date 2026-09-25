'use client';

import TopBar from '@/components/TopBar';
import { SYNTHETIC_WORKS, SYNTHETIC_OVERVIEW } from '@/lib/data';
import { ClipboardCheck, Calendar, MapPin, User, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';

const INSPECTIONS = [
  { id: 'INS-001', workId: 'WRK-2024-0001', inspector: 'District Inspector A', scheduledDate: '2026-09-28', type: 'Milestone Verification', status: 'scheduled', finding: null },
  { id: 'INS-002', workId: 'WRK-2024-0002', inspector: 'State Auditor B', scheduledDate: '2026-09-20', type: 'Financial Irregularity', status: 'completed', finding: 'Documents requested from agency. Awaiting response.' },
  { id: 'INS-003', workId: 'WRK-2024-0006', inspector: 'Unassigned', scheduledDate: '2026-10-05', type: 'Completion Verification', status: 'pending_assignment', finding: null },
];

export default function InspectionsPage() {
  return (
    <div>
      <TopBar title="Inspections" subtitle="Field verification schedule" />
      <main style={{ padding: '20px 24px' }} role="main">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flex: 1, marginRight: 16 }}>
            {[
              { label: 'Scheduled', value: INSPECTIONS.filter(i => i.status === 'scheduled').length, color: '#3b82f6', icon: Calendar },
              { label: 'Completed', value: INSPECTIONS.filter(i => i.status === 'completed').length, color: '#10b981', icon: CheckCircle },
              { label: 'Pending Assignment', value: INSPECTIONS.filter(i => i.status === 'pending_assignment').length, color: '#f59e0b', icon: Clock },
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

          <button aria-label="Schedule new inspection" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
            background: 'var(--clr-accent-primary)', border: 'none', borderRadius: 9,
            color: 'white', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Plus size={15} /> Schedule Inspection
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INSPECTIONS.map(ins => {
            const work = SYNTHETIC_WORKS.find(w => w.id === ins.workId);
            return (
              <div key={ins.id} style={{
                background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
                borderRadius: 12, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{ins.id}</span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 9999,
                        background: ins.status === 'completed' ? 'rgba(16,185,129,0.1)' : ins.status === 'scheduled' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                        color: ins.status === 'completed' ? '#10b981' : ins.status === 'scheduled' ? '#3b82f6' : '#f59e0b',
                      }}>
                        {ins.status.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', background: 'var(--clr-bg-elevated)', padding: '2px 8px', borderRadius: 9999 }}>
                        {ins.type}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 6 }}>
                      {work?.name ?? ins.workId}
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                        <MapPin size={12} /> {work?.district ?? '—'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                        <User size={12} /> {ins.inspector}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                        <Calendar size={12} /> {ins.scheduledDate}
                      </span>
                    </div>

                    {ins.finding && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--clr-bg-elevated)', borderRadius: 7, fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.5 }}>
                        <strong>Finding: </strong>{ins.finding}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button aria-label={`View details for ${ins.id}`} style={{ padding: '6px 12px', background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border-light)', borderRadius: 7, color: 'var(--clr-text-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      View
                    </button>
                    {ins.status !== 'completed' && (
                      <button aria-label={`Record finding for ${ins.id}`} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 7, color: '#10b981', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Record Finding
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
          <AlertTriangle size={12} color="#f59e0b" style={{ display: 'inline', marginRight: 6 }} />
          <span style={{ fontSize: '0.72rem', color: '#d97706' }}>
            Inspection timelines must be configured with the sponsor — do not invent statutory deadlines.
            Physical progress cannot be verified from photographs alone; corroborate with measurements and document trails.
          </span>
        </div>
      </main>
    </div>
  );
}
