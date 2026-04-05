import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react';
import { classApi } from '../api/api';
import toast from 'react-hot-toast';

const DIVISIONS = ['ALL', 'PRIMARY', 'SECONDARY', 'HIGHER'];
const divBadge = { PRIMARY: 'badge-success', SECONDARY: 'badge-primary', HIGHER: 'badge-purple' };
const EMPTY = { name: '', grade: 1, section: 'A', division: 'PRIMARY', studentCount: 30 };

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
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
      const data = await classApi.getAll(division === 'ALL' ? null : division);
      setClasses(data.sort((a, b) => a.grade - b.grade));
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY); setEditing(null); setModal(true); }
  function openEdit(c) {
    setForm({ name: c.name, grade: c.grade, section: c.section, division: c.division, studentCount: c.studentCount });
    setEditing(c.id); setModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.grade) { toast.error('Name and grade required'); return; }
    setSaving(true);
    try {
      if (editing) { await classApi.update(editing, form); toast.success('Class updated'); }
      else { await classApi.create(form); toast.success('Class added'); }
      setModal(false); load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this class?')) return;
    try { await classApi.delete(id); toast.success('Class deleted'); load(); }
    catch (e) { toast.error(e.message); }
  }

  const gradeRanges = { PRIMARY: [1,5], SECONDARY: [6,10], HIGHER: [11,12] };
  const gradeRange = gradeRanges[form.division] || [1,12];

  return (
    <div>
      <div className="flex-between mb-6">
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Classes</h1>
          <p>Manage school classes across all divisions</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Class</button>
      </div>

      <div className="div-tabs">
        {DIVISIONS.map(d => (
          <button key={d} className={`div-tab ${division === d ? 'active' : ''}`} onClick={() => setDivision(d)}>
            {d === 'ALL' ? 'All Divisions' : d.charAt(0) + d.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="loader"><div className="spinner" /><span>Loading classes...</span></div>
        : classes.length === 0 ? (
          <div className="empty-state"><Building2 size={40} /><br />No classes found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Class Name</th><th>Grade</th><th>Section</th><th>Division</th><th>Students</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {classes.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{c.name}</td>
                  <td><span style={{ background: 'var(--bg-hover)', padding: '3px 10px', borderRadius: 6, fontSize: '0.85rem' }}>Grade {c.grade}</span></td>
                  <td>{c.section}</td>
                  <td><span className={`badge ${divBadge[c.division]}`}>{c.division}</span></td>
                  <td>{c.studentCount} students</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}><Pencil size={13} /> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={13} /></button>
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
              <h2>{editing ? 'Edit Class' : 'Add Class'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Division *</label>
              <select className="form-select" value={form.division}
                onChange={e => {
                  const div = e.target.value;
                  const range = gradeRanges[div];
                  setForm(f => ({ ...f, division: div, grade: range[0] }));
                }}>
                <option value="PRIMARY">Primary (Classes 1–5)</option>
                <option value="SECONDARY">Secondary (Classes 6–10)</option>
                <option value="HIGHER">Higher (Classes 11–12)</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Grade *</label>
                <select className="form-select" value={form.grade}
                  onChange={e => setForm(f => ({ ...f, grade: parseInt(e.target.value) }))}>
                  {Array.from({ length: gradeRange[1] - gradeRange[0] + 1 }, (_, i) => gradeRange[0] + i)
                    .map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select className="form-select" value={form.section}
                  onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
                  {['A','B','C','D','Science','Commerce','Arts'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Class Name *</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. 6A, 10B, 11Science" />
              </div>
              <div className="form-group">
                <label className="form-label">Student Count</label>
                <input className="form-input" type="number" min={1} value={form.studentCount}
                  onChange={e => setForm(f => ({ ...f, studentCount: parseInt(e.target.value) || 30 }))} />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Class' : 'Add Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
