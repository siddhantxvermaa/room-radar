import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RoomFinderPage from './pages/RoomFinderPage';
import FacultyDirectoryPage from './pages/FacultyDirectoryPage';
import HelpdeskPage from './pages/HelpdeskPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { authApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check stored auth token on startup
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('room_radar_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          localStorage.removeItem('room_radar_token');
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('room_radar_token');
    setUser(null);
  };

  const handleLoginClick = () => {
    setActiveTab('admin');
  };

  const handleDataRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar with Always-Visible Master Clock */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onDataRefresh={handleDataRefresh}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div key={refreshKey}>
          {activeTab === 'rooms' && <RoomFinderPage />}
          {activeTab === 'faculty' && <FacultyDirectoryPage />}
          {activeTab === 'helpdesk' && <HelpdeskPage />}
          {activeTab === 'admin' && (
            <AdminDashboardPage user={user} onLoginSuccess={(u) => setUser(u)} />
          )}
        </div>
      </main>

      {/* Modern High-Tech Campus Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-xl py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">RoomRadar</span>
            <span>&bull;</span>
            <span className="text-slate-400">Campus Empty Classroom & Student Helpdesk Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
            <span>Full-Stack Development Final Practical</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
