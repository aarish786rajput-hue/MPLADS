'use client';

import TopBar from '@/components/TopBar';
import { Settings, Users, Key, Database, Bell, Shield, Lock, AlertTriangle } from 'lucide-react';

const ADMIN_SECTIONS = [
  {
    icon: Users, color: '#3b82f6', title: 'User & Role Management',
    desc: 'Manage user accounts, role assignments, jurisdiction scope and validity dates. Least-privilege assignment only.',
    items: ['View active users', 'Assign roles', 'Manage jurisdiction scope', 'Review access log'],
  },
  {
    icon: Key, color: '#8b5cf6', title: 'Identity & Authentication',
    desc: 'OIDC/SAML identity provider settings, MFA enforcement, session policy and administrator elevation controls.',
    items: ['Identity provider config', 'MFA enforcement policy', 'Session timeout settings', 'Privileged access review'],
  },
  {
    icon: Database, color: '#06b6d4', title: 'Data Integration',
    desc: 'Configure API connectors, CSV template specifications, import schedules, reconciliation settings and freshness SLAs.',
    items: ['Source connections', 'Import templates', 'Reconciliation rules', 'Freshness alerts'],
  },
  {
    icon: Bell, color: '#f59e0b', title: 'Alert & Escalation Config',
    desc: 'Configure rule versions, model thresholds, escalation timelines and reviewer capacity targets.',
    items: ['Rule catalogue versions', 'Model deployment settings', 'Escalation timelines', 'Reviewer assignment'],
  },
  {
    icon: Shield, color: '#10b981', title: 'Audit & Compliance Logs',
    desc: 'Append-only audit events covering financial corrections, evidence changes, access and case decisions.',
    items: ['Access audit log', 'Case decision log', 'Financial correction log', 'Export audit trail'],
  },
  {
    icon: Lock, color: '#ef4444', title: 'Security Configuration',
    desc: 'Encryption settings, network access controls, secret rotation, malware scanning and incident contact.',
    items: ['Encryption status', 'Network access rules', 'Secret rotation schedule', 'Incident contacts'],
  },
];

export default function AdminPage() {
  return (
    <div>
      <TopBar title="Administration" subtitle="System configuration — Privileged access" />
      <main style={{ padding: '20px 24px' }} role="main">

        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8, fontSize: '0.78rem', color: '#dc2626', lineHeight: 1.6,
        }} role="note">
          <AlertTriangle size={13} style={{ display: 'inline', marginRight: 6 }} />
          <strong>Privileged access zone.</strong> System administrators should operate with least-privilege access to business data.
          Separate submission and approval powers are enforced. All administrator actions are logged in the append-only audit trail.
          MFA is required for all privileged sessions. Actions in this section cannot be reversed without audit trace.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {ADMIN_SECTIONS.map(section => (
            <div key={section.title} style={{
              background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)',
              borderRadius: 12, padding: '20px 22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: `${section.color}15`, border: `1px solid ${section.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <section.icon size={18} color={section.color} />
                </div>
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>{section.title}</h2>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{section.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {section.items.map(item => (
                  <button
                    key={item}
                    aria-label={item}
                    style={{
                      padding: '7px 12px', background: 'var(--clr-bg-elevated)',
                      border: '1px solid var(--clr-border)', borderRadius: 7,
                      color: 'var(--clr-text-secondary)', fontSize: '0.8rem',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      transition: 'all 0.15s', width: '100%',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 8 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 8 }}>Operational prerequisites before production</div>
          <ul style={{ listStyle: 'disc', paddingLeft: 20, fontSize: '0.74rem', color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
            <li>Government hosting, residency and security assessment confirmation</li>
            <li>Approved deployment location with named incident contact</li>
            <li>CERT-In direction applicability confirmed for 6-hour reporting and 180-day log retention</li>
            <li>Data-processing agreement, SLA and exit/data-export provisions signed</li>
            <li>Backup restore and rollback tested and documented</li>
            <li>NTP synchronisation and central log aggregation active</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
