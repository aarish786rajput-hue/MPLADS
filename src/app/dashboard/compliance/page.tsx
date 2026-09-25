'use client';

import TopBar from '@/components/TopBar';
import { SYNTHETIC_COMPLIANCE, SYNTHETIC_WORKS, formatLakh } from '@/lib/data';
import { Shield, CheckCircle, XCircle, HelpCircle, Info } from 'lucide-react';

export default function CompliancePage() {
  const totalWorks = SYNTHETIC_WORKS.length;

  return (
    <div>
      <TopBar title="Compliance" subtitle="Rule-based checks — Synthetic demonstration data" />
      <main style={{ padding: '20px 24px' }} role="main">

        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 8, fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6,
        }} role="note">
          <Shield size={13} style={{ display: 'inline', marginRight: 6, color: '#8b5cf6' }} />
          Compliance checks are based on versioned rule catalogue derived from applicable guidelines. Each rule has explicit exceptions.
          Status can be: Compliant / Non-compliant / Insufficient information / Not applicable.
          Rules must be domain-approved before use in production. Synthetic data shown here.
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Avg. Compliant Rate', value: `${Math.round(SYNTHETIC_COMPLIANCE.reduce((s, r) => s + r.compliant / totalWorks, 0) / SYNTHETIC_COMPLIANCE.length * 100)}%`, color: '#10b981', icon: CheckCircle },
            { label: 'Total Non-Compliant', value: String(SYNTHETIC_COMPLIANCE.reduce((s, r) => s + r.nonCompliant, 0)), color: '#ef4444', icon: XCircle },
            { label: 'Insufficient Info', value: String(SYNTHETIC_COMPLIANCE.reduce((s, r) => s + r.insufficient, 0)), color: '#f59e0b', icon: HelpCircle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 10, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance rules table */}
        <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--clr-border)' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>Rule-by-Rule Compliance Summary</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginTop: 3 }}>Across {totalWorks} works in pilot scope — synthetic data</p>
          </div>

          {SYNTHETIC_COMPLIANCE.map((rule, i) => {
            const pct = Math.round(rule.compliant / totalWorks * 100);
            return (
              <div key={i} style={{
                padding: '16px 20px',
                borderBottom: i < SYNTHETIC_COMPLIANCE.length - 1 ? '1px solid rgba(30,41,59,0.5)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--clr-text-primary)', marginBottom: 4 }}>{rule.rule}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#10b981' }}><CheckCircle size={11} style={{ display: 'inline', marginRight: 3 }} />{rule.compliant} compliant</span>
                      <span style={{ fontSize: '0.72rem', color: '#ef4444' }}><XCircle size={11} style={{ display: 'inline', marginRight: 3 }} />{rule.nonCompliant} non-compliant</span>
                      <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}><HelpCircle size={11} style={{ display: 'inline', marginRight: 3 }} />{rule.insufficient} insufficient info</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444' }}>{pct}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)' }}>compliant</div>
                  </div>
                </div>
                {/* Multi-segment progress bar */}
                <div style={{ height: 8, background: 'var(--clr-bg-elevated)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${rule.compliant / totalWorks * 100}%`, background: '#10b981', transition: 'width 0.8s' }} />
                  <div style={{ width: `${rule.nonCompliant / totalWorks * 100}%`, background: '#ef4444', transition: 'width 0.8s' }} />
                  <div style={{ width: `${rule.insufficient / totalWorks * 100}%`, background: '#f59e0b', transition: 'width 0.8s' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
          <Info size={13} color="#3b82f6" style={{ display: 'inline', marginRight: 6 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
            Compliance rules are versioned. When a rule or its exceptions change, the affected works are re-evaluated and prior results are preserved.
            Statuses of &quot;Insufficient information&quot; indicate the data needed to check the rule is not yet available — these are data gaps, not confirmed non-compliance.
          </span>
        </div>
      </main>
    </div>
  );
}
