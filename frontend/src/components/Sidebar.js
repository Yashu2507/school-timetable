import React from 'react';
import { LayoutDashboard, Users, BookOpen, Building2, Calendar, GraduationCap } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'teachers',  icon: Users,           label: 'Teachers' },
  { id: 'classes',   icon: Building2,        label: 'Classes' },
  { id: 'subjects',  icon: BookOpen,         label: 'Subjects' },
  { id: 'timetable', icon: Calendar,         label: 'Timetable' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '0 0 24px',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--primary)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={20} color="#0a0f1a" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700, fontSize: '1.05rem',
              color: 'var(--text-primary)', lineHeight: 1.2,
            }}>EduSchedule</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              School Timetable System
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', padding: '4px 12px 10px', fontWeight: 600 }}>
          Navigation
        </div>
        {navItems.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => onNavigate(id)} style={{
              display: 'flex', alignItems: 'center', gap: '11px',
              width: '100%', padding: '10px 14px',
              borderRadius: 10, border: 'none',
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
              fontFamily: 'DM Sans, sans-serif',
              marginBottom: 2,
              borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          background: 'var(--primary-glow)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10, padding: '14px',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: 4 }}>
            Auto-Scheduler
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Constraint-based algorithm ensures no teacher conflicts
          </div>
        </div>
      </div>
    </aside>
  );
}
