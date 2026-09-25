'use client';
import { Bell, Search, ChevronDown, User, LogOut, Settings, RefreshCw } from 'lucide-react';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from './Toast';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [scope, setScope] = useState('All India');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const { isLoaded, userId } = useAuth();

  const notifs = [
    { id: 1, text: 'Critical alert on WRK-2024-0001', time: '2m ago', type: 'critical' },
    { id: 2, text: 'Evidence missing: WRK-2024-0006', time: '18m ago', type: 'warning' },
    { id: 3, text: 'Duplicate candidate detected', time: '1h ago', type: 'info' },
    { id: 4, text: 'ML pipeline completed: 8 anomalies', time: '2h ago', type: 'success' },
  ];

  const handleSync = async () => {
    setSyncing(true);
    toast('Syncing data from connected sources…', 'info');
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
    toast('Data sync complete. 148 works updated.', 'success');
  };

  return (
    <>
      {/* Government stripe */}
      <div className="gov-stripe" />

      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--clr-border)',
        padding: '0 24px',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Page title */}
        <div>
          <h1 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--clr-primary)', lineHeight: 1 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginTop: 1 }}>{subtitle}</p>}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Search works, IDs, districts…"
              aria-label="Global search"
              style={{
                paddingLeft: 30, paddingRight: 12, height: 34,
                width: 240, border: '1px solid var(--clr-border)',
                borderRadius: 5, fontSize: '0.82rem', color: 'var(--clr-text-primary)',
                background: '#f9fafb', outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--clr-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--clr-border)'}
            />
          </div>

          {/* Scope selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={scope}
              onChange={e => { setScope(e.target.value); toast(`Scope changed to: ${e.target.value}`, 'info'); }}
              aria-label="Select jurisdiction scope"
              style={{
                appearance: 'none', paddingLeft: 10, paddingRight: 28, height: 34,
                border: '1px solid var(--clr-border)', borderRadius: 5,
                fontSize: '0.82rem', color: 'var(--clr-text-primary)',
                background: '#f9fafb', cursor: 'pointer', fontFamily: 'inherit', outline: 'none',
              }}
            >
              <option>All India</option>
              <option>Demo District A</option>
              <option>Demo District B</option>
              <option>Demo District C</option>
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          </div>

          {/* Sync button */}
          <button
            onClick={handleSync}
            className="btn btn-ghost btn-sm"
            aria-label="Sync data"
            disabled={syncing}
            style={{ height: 34 }}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} style={syncing ? { animation: 'spin 0.7s linear infinite' } : {}} />
            {syncing ? 'Syncing…' : 'Sync'}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(v => !v); setUserOpen(false); }}
              aria-label={`Notifications (${notifs.length} unread)`}
              aria-expanded={notifOpen}
              style={{
                position: 'relative', width: 34, height: 34, borderRadius: 5,
                background: notifOpen ? 'var(--clr-bg-hover)' : 'transparent',
                border: '1px solid var(--clr-border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Bell size={16} color="#374151" />
              <span style={{
                position: 'absolute', top: 5, right: 5, width: 7, height: 7,
                borderRadius: '50%', background: '#dc2626', border: '1.5px solid #fff',
              }} aria-hidden="true" />
            </button>
            {notifOpen && (
              <div style={{
                position: 'absolute', top: 42, right: 0, width: 310,
                background: '#fff', border: '1px solid var(--clr-border)',
                borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--clr-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text-primary)' }}>Notifications</span>
                  <button onClick={() => { toast('All notifications marked as read', 'success'); setNotifOpen(false); }} style={{ fontSize: '0.72rem', color: 'var(--clr-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Mark all read
                  </button>
                </div>
                {notifs.map(n => (
                  <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}
                    onClick={() => { setNotifOpen(false); toast(n.text, n.type as 'info' | 'success' | 'warning'); }}
                  >
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                      background: n.type === 'critical' ? '#dc2626' : n.type === 'warning' ? '#d97706' : n.type === 'success' ? '#15803d' : '#3b82f6',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-primary)' }}>{n.text}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '8px 14px', textAlign: 'center' }}>
                  <Link href="/dashboard/alerts" onClick={() => setNotifOpen(false)} style={{ fontSize: '0.78rem', color: 'var(--clr-accent)', textDecoration: 'none', fontWeight: 500 }}>
                    View all alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Clerk User Button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {isLoaded && userId ? (
              <UserButton />
            ) : isLoaded && !userId ? (
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Sign In</button>
              </SignInButton>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}
