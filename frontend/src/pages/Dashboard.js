import React, { useState, useEffect } from 'react';
import { Users, Building2, BookOpen, Calendar, ChevronRight, Zap } from 'lucide-react';
import { teacherApi, classApi, subjectApi, timetableApi } from '../api/api';
import toast from 'react-hot-toast';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const divColors = { PRIMARY: 'badge-success', SECONDARY: 'badge-primary', HIGHER: 'badge-purple' };

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ teachers: 0, classes: 0, subjects: 0, entries: 0 });
  const [recentTimetable, setRecentTimetable] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [teachers, classes, subjects, timetables] = await Promise.all([
        teacherApi.getAll(), classApi.getAll(), subjectApi.getAll(), timetableApi.getAll(),
      ]);
      setStats({ teachers: teachers.length, classes: classes.length, subjects: subjects.length,
        entries: timetables.reduce((s, t) => s + Object.values(t.schedule || {})
          .reduce((a, d) => a + Object.keys(d).length, 0), 0) });
      setRecentTimetable(timetables.slice(0, 3));
    } catch {
      // silently handle
    } finally { setLoading(false); }
  }

  async function handleGenerateAll() {
    setGenerating(true);
    try {
      const divisions = ['PRIMARY', 'SECONDARY', 'HIGHER'];
      for (const division of divisions) {
        await timetableApi.generate({ division, periodsPerDay: 8, clearExisting: true });
      }
      toast.success('All timetables generated!');
      loadStats();
    } catch (e) {
      toast.error(e.message);
    } finally { setGenerating(false); }
  }

  const statCards = [
    { label: 'Total Teachers', value: stats.teachers, icon: Users, color: 'blue', iconBg: 'rgba(59,130,246,0.15)', iconColor: '#60a5fa' },
    { label: 'Total Classes', value: stats.classes, icon: Building2, color: 'gold', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#fbbf24' },
    { label: 'Subjects', value: stats.subjects, icon: BookOpen, color: 'green', iconBg: 'rgba(34,197,94,0.15)', iconColor: '#22c55e' },
    { label: 'Scheduled Periods', value: stats.entries, icon: Calendar, color: 'purple', iconBg: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa' },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Dashboard</h1>
          <p>School timetable management overview</p>
        </div>
        <button className="btn btn-gold" onClick={handleGenerateAll} disabled={generating}>
          <Zap size={16} />
          {generating ? 'Generating...' : 'Generate All Timetables'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, iconBg, iconColor }) => (
          <div className={`stat-card ${color}`} key={label}>
            <div className="stat-icon" style={{ background: iconBg }}>
              <Icon size={20} color={iconColor} />
            </div>
            <div className="stat-value">{loading ? '—' : value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Division overview */}
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}>
              Division Summary
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('teachers')}>
              View Teachers <ChevronRight size={13} />
            </button>
          </div>
          {[
            { div: 'PRIMARY', label: 'Primary', grades: '1–5', color: 'var(--success)' },
            { div: 'SECONDARY', label: 'Secondary', grades: '6–10', color: 'var(--accent)' },
            { div: 'HIGHER', label: 'Higher', grades: '11–12', color: 'var(--purple)' },
          ].map(({ div, label, grades, color }) => (
            <div key={div} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: color }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classes {grades}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => onNavigate('timetable')}>
                View Schedule
              </button>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', marginBottom: 20 }}>
            Quick Actions
          </h3>
          {[
            { label: 'Add New Teacher', desc: 'Assign subject & class', page: 'teachers', color: 'var(--accent)' },
            { label: 'Manage Classes', desc: 'Add or edit school classes', page: 'classes', color: 'var(--primary)' },
            { label: 'View Timetable', desc: 'See all class schedules', page: 'timetable', color: 'var(--success)' },
            { label: 'Subject Catalog', desc: 'Manage subject list', page: 'subjects', color: 'var(--purple)' },
          ].map(({ label, desc, page, color }) => (
            <button key={page} onClick={() => onNavigate(page)} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '13px 16px', marginBottom: 10,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
              </div>
              <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
