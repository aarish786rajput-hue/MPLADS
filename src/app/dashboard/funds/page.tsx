'use client';

import TopBar from '@/components/TopBar';
import {
  SYNTHETIC_OVERVIEW, SYNTHETIC_DISTRICT_STATS, SYNTHETIC_SECTOR_STATS,
  SYNTHETIC_MPs, formatCrore, formatLakh,
} from '@/lib/data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { Info, AlertTriangle, IndianRupee } from 'lucide-react';

export default function FundsPage() {
  const ov = SYNTHETIC_OVERVIEW;
  const utilPct = Math.round(ov.totalExpenditureLakh / ov.totalSanctionedLakh * 100);

  return (
    <div>
      <TopBar title="Fund Utilisation" subtitle="Financial overview — Synthetic demonstration data" />
      <main style={{ padding: '20px 24px' }} role="main">

        {/* Important disclaimer */}
        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 8, fontSize: '0.78rem', color: '#d97706', lineHeight: 1.6,
        }} role="note">
          <AlertTriangle size={13} style={{ display: 'inline', marginRight: 6 }} />
          <strong>Financial definitions matter.</strong> Entitlement, recommendation, sanction, authorisation, commitment, expenditure, settled payment and physical progress are distinct stages.
          This page shows synthetic recorded expenditure — not verified actual spend. Never aggregate these stages as a single &quot;spent&quot; figure.
          Do not impute missing values as genuine expenditure.
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Sanctioned (FY)', value: formatCrore(ov.totalSanctionedLakh), sub: 'Approved sanction value', color: '#3b82f6' },
            { label: 'Recorded Expenditure', value: formatCrore(ov.totalExpenditureLakh), sub: 'Per system records — see note above', color: '#06b6d4' },
            { label: 'Utilisation Rate', value: `${utilPct}%`, sub: 'Expenditure / Sanctioned', color: utilPct > 90 ? '#10b981' : '#f59e0b' },
            { label: 'Unspent Sanction', value: formatCrore(ov.totalSanctionedLakh - ov.totalExpenditureLakh), sub: 'Remaining approved budget', color: '#8b5cf6' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IndianRupee size={15} color={color} />
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--clr-text-secondary)', marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* MP-wise utilisation */}
        <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 4 }}>MP-wise Fund Utilisation</h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginBottom: 16 }}>Synthetic data — not real MP records</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SYNTHETIC_MPs.map(mp => {
              const pct = Math.round(mp.usedLakh / mp.entitlementLakh * 100);
              return (
                <div key={mp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--clr-text-primary)' }}>{mp.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginLeft: 8 }}>{mp.constituency} · {mp.membershipType}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: pct > 90 ? '#10b981' : pct > 60 ? '#3b82f6' : '#f59e0b' }}>{pct}%</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginLeft: 4 }}>{formatLakh(mp.usedLakh)} / {formatLakh(mp.entitlementLakh)}</span>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct > 90 ? '#10b981' : pct > 60 ? '#3b82f6' : '#f59e0b',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* District + Sector charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 16 }}>District-wise Expenditure (₹L)</h2>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SYNTHETIC_DISTRICT_STATS} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="district" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border-light)', borderRadius: 8, fontSize: '0.78rem' }} />
                  <Legend wrapperStyle={{ fontSize: '0.74rem' }} />
                  <Bar dataKey="sanctioned" name="Sanctioned" fill="#3b82f640" stroke="#3b82f6" radius={[3,3,0,0]} />
                  <Bar dataKey="expenditure" name="Expenditure" fill="#06b6d4" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginBottom: 16 }}>Expenditure by Sector (₹L)</h2>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SYNTHETIC_SECTOR_STATS} dataKey="expenditure" nameKey="sector" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {SYNTHETIC_SECTOR_STATS.map(s => <Cell key={s.sector} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--clr-bg-elevated)', border: '1px solid var(--clr-border-light)', borderRadius: 8, fontSize: '0.78rem' }} />
                  <Legend wrapperStyle={{ fontSize: '0.74rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: '0.7rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
          <Info size={11} style={{ display: 'inline', marginRight: 4 }} />
          All figures use fixed-precision decimal arithmetic. Reversed, pending, or adjusted transactions are excluded from recorded expenditure.
          Obtain written definitions and reconciliation rules before comparing figures across sources.
        </div>
      </main>
    </div>
  );
}
