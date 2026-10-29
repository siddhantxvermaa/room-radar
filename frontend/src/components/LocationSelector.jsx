import React from 'react';
import { MapPin, Building2, Layers, Compass, Radio } from 'lucide-react';

export const CAMPUS_BUILDINGS = [
  { name: 'Block D1', desc: 'AIT-CSE Core & Department Offices', badge: 'AIT CSE Hub' },
  { name: 'Block D2', desc: 'AIT Cloud Computing & Big Data', badge: 'Cloud & DevOps' },
  { name: 'Block D3', desc: 'AIT AI, Machine Learning & Cyber Security', badge: 'AI & Security' },
  { name: 'Block D4', desc: 'AIT Advanced Workstations & Mac Labs', badge: 'Specialized Labs' },
  { name: 'Central Library', desc: 'Knowledge Resource Centre (Silent Halls)', badge: 'Study KRC' },
  { name: 'Student Care (SCD)', desc: 'DSW, CUIMS Helpdesk & Registrar', badge: 'Student Care' }
];

export const CAMPUS_FLOORS = [
  { label: 'Ground Floor', sub: 'Level 0', value: 0 },
  { label: '1st Floor', sub: 'Level 1', value: 1 },
  { label: '2nd Floor', sub: 'Level 2', value: 2 },
  { label: '3rd Floor', sub: 'Level 3', value: 3 },
  { label: '4th Floor', sub: 'Level 4', value: 4 }
];

export default function LocationSelector({ building, floor, onBuildingChange, onFloorChange }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Chandigarh University &bull; AIT-CSE (D-Blocks)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                AIT RADAR ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Select your AIT block (D1 - D4) and floor level to find nearest empty classrooms right now</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sorting by shortest walk</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Step 1: Pick Building */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Building2 className="h-3.5 w-3.5 text-sky-400" />
            1. Select AIT-CSE Block
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CAMPUS_BUILDINGS.map((b) => {
              const isSelected = building === b.name;
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => onBuildingChange(b.name)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 relative group ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {b.badge}
                    </span>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-emerald-400"></span>}
                  </div>
                  <h3 className={`font-bold text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {b.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{b.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick Floor */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            2. Select Current Floor Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CAMPUS_FLOORS.map((f) => {
              const isSelected = floor === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onFloorChange(f.value)}
                  className={`py-3 px-4 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 text-white font-bold ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-bold">{f.label}</span>
                  <span className={`text-[10px] font-mono mt-0.5 block ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                    {f.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
