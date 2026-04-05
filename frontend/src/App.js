import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import TimetablePage from './pages/TimetablePage';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <Dashboard onNavigate={setActivePage} />;
      case 'teachers':    return <TeachersPage />;
      case 'classes':     return <ClassesPage />;
      case 'subjects':    return <SubjectsPage />;
      case 'timetable':   return <TimetablePage />;
      default:            return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
      }} />
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
