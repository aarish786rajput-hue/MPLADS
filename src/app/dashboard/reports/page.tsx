'use client';

import TopBar from '@/components/TopBar';
import { REPORT_TEMPLATES } from '@/lib/data';
import { FileBarChart, Download, Clock, Shield, Lock } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div>
      <TopBar title="Reports" subtitle="Downloadable reports — Access-controlled" />
      <main style={{ padding: '20px 24px' }} role="main">

        <div style={{
          padding: '10px 16px', marginBottom: 20,
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 8, fontSize: '0.78rem', color: 'var(--clr-text-secondary)',
        }} role="note">
          <Shield size={13} style={{ display: 'inline', marginRight: 6, color: '#10b981' }} />
          Reports are generated with jurisdiction-based access control. Every download is logged in the audit trail.
          Reports on active investigations are restricted. Synthetic data shown here.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {REPORT_TEMPLATES.map(rpt => (
            <div key={rpt.id} style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileBarChart size={17} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>{rpt.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginTop: 3 }}>{rpt.description}</div>
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 5, fontSize: '0.68rem', fontWeight: 600,
                  background: rpt.format === 'PDF' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  color: rpt.format === 'PDF' ? '#ef4444' : '#10b981',
                  border: `1px solid ${rpt.format === 'PDF' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                }}>
                  {rpt.format}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>
                <Clock size={11} />
                Last generated: {rpt.lastGenerated}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  aria-label={`Generate ${rpt.name}`}
                  style={{
                    flex: 1, padding: '8px 12px', background: 'var(--clr-accent-primary)',
                    border: 'none', borderRadius: 7, color: 'white', fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  Generate
                </button>
                <button
                  aria-label={`Download last ${rpt.name}`}
                  style={{
                    padding: '8px 12px', background: 'var(--clr-bg-elevated)',
                    border: '1px solid var(--clr-border-light)', borderRadius: 7,
                    color: 'var(--clr-text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem',
                  }}
                >
                  <Download size={13} /> Last
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Lock size={14} color="var(--clr-text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.74rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
              All report downloads enforce jurisdiction-based access control on the server. Reports containing investigation details are restricted.
              Exported files are access-controlled and do not expose cross-jurisdiction data.
              In production, prevent external AI providers from retaining or training on restricted report content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
