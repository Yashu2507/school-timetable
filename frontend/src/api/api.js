// src/api/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const teacherApi = {
  getAll: (division) => request(`/teachers${division ? `?division=${division}` : ''}`),
  getById: (id) => request(`/teachers/${id}`),
  create: (data) => request('/teachers', { method: 'POST', body: data }),
  update: (id, data) => request(`/teachers/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),
};

export const subjectApi = {
  getAll: (division) => request(`/subjects${division ? `?division=${division}` : ''}`),
  create: (data) => request('/subjects', { method: 'POST', body: data }),
  update: (id, data) => request(`/subjects/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/subjects/${id}`, { method: 'DELETE' }),
};

export const classApi = {
  getAll: (division) => request(`/classes${division ? `?division=${division}` : ''}`),
  create: (data) => request('/classes', { method: 'POST', body: data }),
  update: (id, data) => request(`/classes/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/classes/${id}`, { method: 'DELETE' }),
};

export const timetableApi = {
  generate: (data) => request('/timetable/generate', { method: 'POST', body: data }),
  getAll: () => request('/timetable/all'),
  getByClass: (className) => request(`/timetable/class/${encodeURIComponent(className)}`),
  getByTeacher: (id) => request(`/timetable/teacher/${id}`),
  getByDivision: (division) => request(`/timetable/division/${division}`),
  clear: (division) => request(`/timetable/clear${division ? `?division=${division}` : ''}`, { method: 'DELETE' }),
};
