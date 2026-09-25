'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, ClipboardList, IndianRupee, AlertTriangle,
  Shield, MapPin, Search, FileBarChart, Database, Settings,
  ChevronLeft, ChevronRight, Activity, FlaskConical, Cpu,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/ml',           icon: Cpu,             label: 'ML Insights', badge: 'AI' },
  { href: '/dashboard/works',        icon: ClipboardList,   label: 'Works Register' },
  { href: '/dashboard/alerts',       icon: AlertTriangle,   label: 'Risk Alerts' },
  { href: '/dashboard/funds',        icon: IndianRupee,     label: 'Fund Utilisation' },
  { href: '/dashboard/compliance',   icon: Shield,          label: 'Compliance' },
  { href: '/dashboard/map',          icon: MapPin,          label: 'Map View' },
  { href: '/dashboard/inspections',  icon: Search,          label: 'Inspections' },
  { href: '/dashboard/reports',      icon: FileBarChart,    label: 'Reports' },
  { href: '/dashboard/data-quality', icon: Database,        label: 'Data Quality' },
  { href: '/dashboard/admin',        icon: Settings,        label: 'Administration' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 56 : 242,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a3c6e 0%, #0f2544 100%)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '16px 0' : '16px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 64,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg, #e87722, #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Activity size={18} color="white" />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>MPLADS</div>
            <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1, marginTop: 2 }}>Insight Platform</div>
          </div>
        )}
      </div>

      {/* Synthetic indicator */}
      {!collapsed && (
        <div style={{
          margin: '8px 10px',
          padding: '5px 10px',
          background: 'rgba(232,119,34,0.15)',
          border: '1px solid rgba(232,119,34,0.3)',
          borderRadius: 5,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <FlaskConical size={10} color="#e87722" />
          <span style={{ fontSize: '0.62rem', color: '#e87722', fontWeight: 600 }}>SYNTHETIC DATA DEMO</span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '8px 4px' : '8px 10px', overflow: 'hidden auto' }} role="navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? label : undefined}
              style={{ justifyContent: collapsed ? 'center' : undefined }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
              )}
              {!collapsed && badge && (
                <span style={{
                  padding: '1px 5px', borderRadius: 3,
                  background: 'rgba(232,119,34,0.25)', color: '#e87722',
                  fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.05em',
                }}>{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Version */}
      {!collapsed && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            v1.2-demo · Not for official use<br />
            MoSPI Blueprint · 17 Sep 2026
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute', top: 68, right: -13,
          width: 26, height: 26, borderRadius: '50%',
          background: '#fff', border: '1.5px solid #d1d5db',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          zIndex: 10, transition: 'all 0.15s',
        }}
      >
        {collapsed ? <ChevronRight size={13} color="#374151" /> : <ChevronLeft size={13} color="#374151" />}
      </button>
    </aside>
  );
}
