import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Users } from 'lucide-react';
import { teacherApi, subjectApi, classApi } from '../api/api';
import toast from 'react-hot-toast';

const DIVISIONS = ['ALL', 'PRIMARY', 'SECONDARY', 'HIGHER'];
const divBadge = { PRIMARY: 'badge-success', SECONDARY: 'badge-primary', HIGHER: 'badge-purple' };
const divLabel = { PRIMARY: 'Primary (1–5)', SECONDARY: 'Secondary (6–10)', HIGHER: 'Higher (11–12)' };

const EMPTY = { name: '', email: '', division: 'PRIMARY', subject: '', assignedClass: '', maxPeriodsPerDay: 6 };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [division, setDivision] = useState('ALL');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [division]);
  useEffect(() => { loadMeta(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await teacherApi.getAll(division === 'ALL' ? null : division);
      setTeachers(data);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  async function loadMeta() {
    try {
      const [s, c] = await Promise.all([subjectApi.getAll(), classApi.getAll()]);
      setSubjects(s); setClasses(c);
    } catch {}
  }

  function openAdd() { setForm(EMPTY); setEditing(null); setModal(true); }
  function openEdit(t) {
    setForm({ name: t.name, email: t.email, division: t.division, subject: t.subject,
      assignedClass: t.assignedClass || '', maxPeriodsPerDay: t.maxPeriodsPerDay });
    setEditing(t.id); setModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.email || !form.subject) {
      toast.error('Name, email and subject are required'); return;
    }
    setSaving(true);
    try {
      if (editing) { await teacherApi.update(editing, form); toast.success('Teacher updated'); }
      else { await teacherApi.create(form); toast.success('Teacher added'); }
      setModal(false); load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await teacherApi.delete(id);
      toast.success('Teacher deleted');
      load();
    } catch (e) { toast.error(e.message); }
  }

  const filteredSubjects = subjects.filter(s => form.division === 'ALL' || s.division === form.division);
  const filteredClasses = classes.filter(c => form.division === 'ALL' || c.division === form.division);

  return (
    <div>
      <div className="flex-between mb-6">
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Teachers</h1>
          <p>Manage teacher assignments, subjects and class mappings</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {/* Division tabs */}
      <div className="div-tabs">
        {DIVISIONS.map(d => (
          <button key={d} className={`div-tab ${division === d ? 'active' : ''}`}
            onClick={() => setDivision(d)}>
            {d === 'ALL' ? 'All Divisions' : divLabel[d]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /><span>Loading teachers...</span></div>
        ) : teachers.length === 0 ? (
          <div className="empty-state">
            <Users size={40} /><br />
            No teachers found. Add your first teacher!
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Division</th>
                <th>Subject</th><th>Assigned Class</th><th>Max Periods/Day</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</td>
                  <td>{t.email}</td>
                  <td><span className={`badge ${divBadge[t.division]}`}>{t.division}</span></td>
                  <td>{t.subject}</td>
                  <td>
                    {t.assignedClass
                      ? <span className="badge badge-teal">{t.assignedClass}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>{t.maxPeriodsPerDay}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(t)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="teacher@school.edu" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Division *</label>
              <select className="form-select" value={form.division}
                onChange={e => setForm(f => ({ ...f, division: e.target.value, subject: '', assignedClass: '' }))}>
                <option value="PRIMARY">Primary (Classes 1–5)</option>
                <option value="SECONDARY">Secondary (Classes 6–10)</option>
                <option value="HIGHER">Higher (Classes 11–12)</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject * (one-to-one)</label>
                <select className="form-select" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">— Select Subject —</option>
                  {filteredSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Class (one-to-one)</label>
                <select className="form-select" value={form.assignedClass}
                  onChange={e => setForm(f => ({ ...f, assignedClass: e.target.value }))}>
                  <option value="">— Select Class —</option>
                  {filteredClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Max Periods Per Day</label>
              <input className="form-input" type="number" min={1} max={8}
                value={form.maxPeriodsPerDay}
                onChange={e => setForm(f => ({ ...f, maxPeriodsPerDay: parseInt(e.target.value) || 6 }))} />
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Teacher' : 'Add Teacher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
