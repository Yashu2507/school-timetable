import React, { useState, useEffect } from 'react';
import { Zap, Trash2, Calendar, ChevronDown, Users } from 'lucide-react';
import { timetableApi, teacherApi, classApi } from '../api/api';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIOD_TIMES = {
  1: '8:00', 2: '8:50', 3: '9:40', 4: '10:40',
  5: '11:30', 6: '13:00', 7: '13:50', 8: '14:40'
};

const SUBJECT_COLORS = [
  '#3b82f6','#22c55e','#f59e0b','#a78bfa','#2dd4bf',
  '#f97316','#ec4899','#06b6d4','#84cc16','#8b5cf6'
];

function subjectColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

const DIVISIONS = ['PRIMARY', 'SECONDARY', 'HIGHER'];
const DIV_LABELS = { PRIMARY: 'Primary (1–5)', SECONDARY: 'Secondary (6–10)', HIGHER: 'Higher (11–12)' };

export default function TimetablePage() {
  const [division, setDivision] = useState('PRIMARY');
  const [timetables, setTimetables] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState('class');   // 'class' | 'teacher'
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [periodsPerDay, setPeriodsPerDay] = useState(8);

  useEffect(() => { loadMeta(); }, [division]);
  useEffect(() => { if (selectedClass) loadClassTT(); }, [selectedClass]);
  useEffect(() => { if (selectedTeacher) loadTeacherTT(); }, [selectedTeacher]);

  async function loadMeta() {
    try {
      const [t, c] = await Promise.all([
        teacherApi.getAll(division), classApi.getAll(division)
      ]);
      setTeachers(t); setClasses(c);
      setSelectedClass(''); setSelectedTeacher(''); setTimetableData(null);
    } catch {}
  }

  async function loadClassTT() {
    setLoading(true);
    try {
      const data = await timetableApi.getByClass(selectedClass);
      setTimetableData(data);
    } catch { setTimetableData(null); }
    finally { setLoading(false); }
  }

  async function loadTeacherTT() {
    setLoading(true);
    try {
      const data = await timetableApi.getByTeacher(selectedTeacher);
      setTimetableData(data);
    } catch { setTimetableData(null); }
    finally { setLoading(false); }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await timetableApi.generate({ division, periodsPerDay, clearExisting: true });
      toast.success(`Generated ${result.length} entries for ${DIV_LABELS[division]}`);
      // refresh current view
      if (selectedClass) loadClassTT();
      else if (selectedTeacher) loadTeacherTT();
    } catch (e) { toast.error(e.message); }
    finally { setGenerating(false); }
  }

  async function handleClear() {
    if (!window.confirm(`Clear timetable for ${DIV_LABELS[division]}?`)) return;
    try {
      await timetableApi.clear(division);
      toast.success('Timetable cleared');
      setTimetableData(null);
    } catch (e) { toast.error(e.message); }
  }

  // Get cell data
  function getCell(day, period) {
    if (!timetableData?.schedule) return null;
    const dayIdx = day + 1; // 1-based
    return timetableData.schedule[dayIdx]?.[period] || null;
  }

  // Determine title for current view
  function getViewTitle() {
    if (viewMode === 'class' && selectedClass) return `Class ${selectedClass} — Weekly Schedule`;
    if (viewMode === 'teacher' && timetableData) return `${timetableData.teacher?.name} — Teaching Schedule`;
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-6">
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Timetable</h1>
          <p>Generate and view class & teacher schedules</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-danger btn-sm" onClick={handleClear}>
            <Trash2 size={14} /> Clear
          </button>
          <button className="btn btn-gold" onClick={handleGenerate} disabled={generating}>
            <Zap size={16} />
            {generating ? 'Generating...' : `Generate ${division}`}
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div className="card mb-6" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Division */}
          <div>
            <label className="form-label">Division</label>
            <div className="flex gap-2">
              {DIVISIONS.map(d => (
                <button key={d} className={`btn btn-sm ${division === d ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDivision(d)}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* View mode */}
          <div>
            <label className="form-label">View By</label>
            <div className="flex gap-2">
              <button className={`btn btn-sm ${viewMode === 'class' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setViewMode('class'); setTimetableData(null); }}>
                <Calendar size={13} /> Class
              </button>
              <button className={`btn btn-sm ${viewMode === 'teacher' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setViewMode('teacher'); setTimetableData(null); }}>
                <Users size={13} /> Teacher
              </button>
            </div>
          </div>

          {/* Class or teacher selector */}
          {viewMode === 'class' ? (
            <div>
              <label className="form-label">Select Class</label>
              <select className="form-select" style={{ minWidth: 160 }} value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}>
                <option value="">— Choose Class —</option>
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label className="form-label">Select Teacher</label>
              <select className="form-select" style={{ minWidth: 200 }} value={selectedTeacher}
                onChange={e => setSelectedTeacher(e.target.value)}>
                <option value="">— Choose Teacher —</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
              </select>
            </div>
          )}

          {/* Periods per day */}
          <div>
            <label className="form-label">Periods/Day: {periodsPerDay}</label>
            <input type="range" min={4} max={8} value={periodsPerDay}
              onChange={e => setPeriodsPerDay(parseInt(e.target.value))}
              style={{ display: 'block', width: 120, accentColor: 'var(--accent)', marginTop: 4 }} />
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {loading ? (
        <div className="loader"><div className="spinner" /><span>Loading timetable...</span></div>
      ) : timetableData && (selectedClass || selectedTeacher) ? (
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
              {getViewTitle()}
            </h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {/* Legend */}
              {viewMode === 'class' && (() => {
                const subjectSet = new Set();
                Object.values(timetableData.schedule || {}).forEach(day =>
                  Object.values(day).forEach(cell => subjectSet.add(cell.subjectName)));
                return [...subjectSet].map(s => (
                  <span key={s} className="badge" style={{
                    background: subjectColor(s) + '22', color: subjectColor(s),
                    border: `1px solid ${subjectColor(s)}44`
                  }}>{s}</span>
                ));
              })()}
            </div>
          </div>

          {/* Grid */}
          <div style={{ overflowX: 'auto' }}>
            <div className="tt-grid" style={{ gridTemplateColumns: `90px repeat(5, 1fr)`, minWidth: 700 }}>
              {/* Header row */}
              <div className="tt-header-cell" style={{ background: 'transparent', border: 'none' }} />
              {DAYS.map(day => (
                <div key={day} className="tt-header-cell">{day}</div>
              ))}

              {/* Period rows */}
              {PERIODS.slice(0, periodsPerDay).map(period => (
                <React.Fragment key={period}>
                  <div className="tt-period-label">
                    <span className="period-num">P{period}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                      {PERIOD_TIMES[period]}
                    </span>
                  </div>
                  {DAYS.map((_, di) => {
                    const cell = getCell(di, period);
                    const color = subjectColor(cell?.subjectName);
                    return (
                      <div key={di} className={`tt-cell ${cell ? 'filled' : 'empty'}`}
                        style={cell ? { borderLeftColor: color, borderLeftWidth: 3 } : {}}>
                        {cell ? (
                          <>
                            <div className="tt-subject" style={{ color }}>{cell.subjectName}</div>
                            {viewMode === 'class' && (
                              <div className="tt-teacher">{cell.teacher?.name}</div>
                            )}
                            {viewMode === 'teacher' && (
                              <div className="tt-teacher">Class {cell.className}</div>
                            )}
                            <div className="tt-time">{cell.startTime} – {cell.endTime}</div>
                          </>
                        ) : (
                          <div style={{ color: 'var(--border-light)', fontSize: '0.65rem', textAlign: 'center' }}>—</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Summary row */}
          <div style={{
            marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)',
            display: 'flex', gap: 24, flexWrap: 'wrap'
          }}>
            {(() => {
              let total = 0, filled = 0;
              for (let p = 1; p <= periodsPerDay; p++)
                for (let d = 0; d < 5; d++) { total++; if (getCell(d, p)) filled++; }
              return (
                <>
                  <div className="text-muted">Total slots: <strong style={{ color: 'var(--text-primary)' }}>{total}</strong></div>
                  <div className="text-muted">Scheduled: <strong style={{ color: 'var(--success)' }}>{filled}</strong></div>
                  <div className="text-muted">Free periods: <strong style={{ color: 'var(--text-muted)' }}>{total - filled}</strong></div>
                  <div className="text-muted">Coverage: <strong style={{ color: 'var(--accent)' }}>{Math.round((filled / total) * 100)}%</strong></div>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <Calendar size={48} />
            <div style={{ marginTop: 16, fontSize: '1rem', color: 'var(--text-secondary)' }}>
              {viewMode === 'class' ? 'Select a class to view its timetable' : 'Select a teacher to view their schedule'}
            </div>
            <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
              Use the <strong style={{ color: 'var(--primary)' }}>Generate</strong> button to auto-schedule, then pick a class or teacher.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
