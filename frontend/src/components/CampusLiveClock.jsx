import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, ChevronDown } from 'lucide-react';

export default function CampusLiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format 12h time with seconds and AM/PM
  const hours = currentTime.getHours();
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  // Format day and date
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  // Calculate current academic period based on time
  const time24 = `${String(hours).padStart(2, '0')}:${minutes}`;
  let activePeriod = { name: 'Free Study Hours', status: 'quiet' };

  if (time24 >= '09:00' && time24 < '10:30') {
    activePeriod = { name: 'Period 1 (09:00 - 10:30)', status: 'lecture' };
  } else if (time24 >= '10:30' && time24 < '11:00') {
    activePeriod = { name: 'Morning Break', status: 'break' };
  } else if (time24 >= '11:00' && time24 < '12:30') {
    activePeriod = { name: 'Period 2 (11:00 - 12:30)', status: 'lecture' };
  } else if (time24 >= '12:30' && time24 < '13:30') {
    activePeriod = { name: 'Lunch Recess', status: 'break' };
  } else if (time24 >= '13:30' && time24 < '15:00') {
    activePeriod = { name: 'Period 3 (13:30 - 15:00)', status: 'lecture' };
  } else if (time24 >= '15:00' && time24 < '16:30') {
    activePeriod = { name: 'Period 4 (15:00 - 16:30)', status: 'lecture' };
  } else if (time24 >= '16:30' && time24 < '18:00') {
    activePeriod = { name: 'Labs & Club Activities', status: 'quiet' };
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowScheduleModal(!showScheduleModal)}
        title="Campus Live Master Clock & Period Sync"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-emerald-500/50 shadow-inner text-slate-200 transition group select-none"
      >
        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        {/* Live Clock Digits */}
        <div className="flex items-baseline font-mono tracking-wider font-bold text-sm text-emerald-400">
          <span>{displayHours}</span>
          <span className="animate-pulse mx-0.5 text-emerald-500">:</span>
          <span>{minutes}</span>
          <span className="animate-pulse mx-0.5 text-emerald-500">:</span>
          <span className="text-xs text-emerald-300/80">{seconds}</span>
          <span className="text-[10px] ml-1 text-slate-400 font-sans">{ampm}</span>
        </div>

        {/* Divider */}
        <span className="text-slate-700 hidden sm:inline">|</span>

        {/* Day & Academic Period */}
        <div className="hidden sm:flex flex-col text-left">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
            <span>{dayName}, {dateStr}</span>
          </div>
          <span className="text-[9px] font-medium text-sky-400 uppercase tracking-wider">
            {activePeriod.name.split(' (')[0]}
          </span>
        </div>

        <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-200 transition" />
      </button>

      {/* Dropdown Schedule Overview */}
      {showScheduleModal && (
        <div className="absolute right-0 top-12 w-64 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              Campus Timetable Slots
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Clock</span>
          </div>

          <div className="space-y-1.5">
            {[
              { slot: 'Period 1', time: '09:00 - 10:30' },
              { slot: 'Morning Break', time: '10:30 - 11:00' },
              { slot: 'Period 2', time: '11:00 - 12:30' },
              { slot: 'Lunch Recess', time: '12:30 - 01:30' },
              { slot: 'Period 3', time: '01:30 - 03:00' },
              { slot: 'Period 4', time: '03:00 - 04:30' },
              { slot: 'Open Study / Clubs', time: '04:30 PM Onwards' }
            ].map((p, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                  activePeriod.name.includes(p.slot)
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <span>{p.slot}</span>
                <span className="font-mono text-[10px]">{p.time}</span>
              </div>
            ))}
          </div>

          <div className="pt-1 text-[10px] text-slate-500 text-center">
            Vacancy engine continuously checks empty rooms against these slots.
          </div>
        </div>
      )}
    </div>
  );
}
