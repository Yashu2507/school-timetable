import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react';
import { subjectApi } from '../api/api';
import toast from 'react-hot-toast';

const DIVISIONS = ['ALL', 'PRIMARY', 'SECONDARY', 'HIGHER'];
const divBadge = { PRIMARY: 'badge-success', SECONDARY: 'badge-primary', HIGHER: 'badge-purple' };
const EMPTY = { name: '', code: '', periodsPerWeek: 5, division: 'PRIMARY' };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [division, setDivision] = useState('ALL');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [division]);

  async function load() {
    setLoading(true);
    try {
      const data = await subjectApi.getAll(division === 'ALL' ? null : division);
      setSubjects(data);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY); setEditing(null); setModal(true); }
  function openEdit(s) {
    setForm({ name: s.name, code: s.code || '', periodsPerWeek: s.periodsPerWeek, division: s.division });
    setEditing(s.id); setModal(true);
  }

  async function handleSave() {
    if (!form.name) { toast.error('Subject name required'); return; }
    setSaving(true);
    try {
      if (editing) { await subjectApi.update(editing, form); toast.success('Subject updated'); }
      else { await subjectApi.create(form); toast.success('Subject added'); }
      setModal(false); load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this subject?')) return;
    try { await subjectApi.delete(id); toast.success('Subject deleted'); load(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <div>
      <div className="flex-between mb-6">
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Subjects</h1>
          <p>Manage the subject catalog for all divisions</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Subject</button>
      </div>

      <div className="div-tabs">
        {DIVISIONS.map(d => (
          <button key={d} className={`div-tab ${division === d ? 'active' : ''}`} onClick={() => setDivision(d)}>
            {d === 'ALL' ? 'All Divisions' : d.charAt(0) + d.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="loader"><div className="spinner" /><span>Loading subjects...</span></div>
        : subjects.length === 0 ? (
          <div className="empty-state"><BookOpen size={40} /><br />No subjects found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Subject Name</th><th>Code</th><th>Division</th><th>Periods / Week</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>
                    {s.code ? <code style={{ background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 5, fontSize: '0.8rem' }}>{s.code}</code>
                      : '—'}
                  </td>
                  <td><span className={`badge ${divBadge[s.division]}`}>{s.division}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: `${(s.periodsPerWeek / 8) * 80}px`, height: 6,
                        background: 'var(--accent)', borderRadius: 3,
                      }} />
                      <span style={{ fontSize: '0.85rem' }}>{s.periodsPerWeek}/week</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}><Pencil size={13} /> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Subject' : 'Add Subject'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Division *</label>
              <select className="form-select" value={form.division}
                onChange={e => setForm(f => ({ ...f, division: e.target.value }))}>
                <option value="PRIMARY">Primary (1–5)</option>
                <option value="SECONDARY">Secondary (6–10)</option>
                <option value="HIGHER">Higher (11–12)</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mathematics" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input className="form-input" value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. MATH" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Periods Per Week: {form.periodsPerWeek}</label>
              <input type="range" min={1} max={10} value={form.periodsPerWeek}
                onChange={e => setForm(f => ({ ...f, periodsPerWeek: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                <span>1</span><span>5</span><span>10</span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Subject' : 'Add Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
