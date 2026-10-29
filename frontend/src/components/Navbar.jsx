import React, { useState } from 'react';
import { Compass, BookOpen, UserCheck, ShieldCheck, Database, LogIn, LogOut, CheckCircle2, Radio } from 'lucide-react';
import CampusLiveClock from './CampusLiveClock';
import { seedApi } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, user, onLoginClick, onLogout, onDataRefresh }) {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedApi.seed();
      setSeedSuccess(true);
      if (onDataRefresh) onDataRefresh();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to seed demo data: ' + (err.response?.data?.message || err.message));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => setActiveTab('rooms')}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 via-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition">
                  RoomRadar
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Campus Space & Office Finder</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Free Classes
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'faculty'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Faculty Cabins
            </button>

            <button
              onClick={() => setActiveTab('helpdesk')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'helpdesk'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              Student Helpdesk
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </button>
          </nav>

          {/* Right Section: ALWAYS VISIBLE CLOCK + Actions */}
          <div className="flex items-center gap-2.5">
            {/* Live Master Clock */}
            <CampusLiveClock />

            {/* Quick Demo Seed */}
            <button
              onClick={handleSeed}
              disabled={seeding}
              title="Click to reset and populate realistic campus demo data"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
            >
              {seedSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Data Ready</span>
                </>
              ) : (
                <>
                  <Database className={`h-3.5 w-3.5 text-sky-400 ${seeding ? 'animate-spin' : ''}`} />
                  <span>{seeding ? 'Resetting...' : 'Seed Data'}</span>
                </>
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  {user.name.split(' ')[0]} ({user.role?.toUpperCase()})
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
              >
                <LogIn className="h-3.5 w-3.5 text-sky-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'rooms' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <BookOpen className="h-4 w-4" />
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'faculty' ? 'text-sky-400 font-bold' : 'text-slate-400'}`}
          >
            <UserCheck className="h-4 w-4" />
            Faculty
          </button>
          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'helpdesk' ? 'text-violet-400 font-bold' : 'text-slate-400'}`}
          >
            <Compass className="h-4 w-4" />
            Helpdesk
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'admin' ? 'text-slate-200 font-bold' : 'text-slate-400'}`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
