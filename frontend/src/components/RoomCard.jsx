import React, { useState } from 'react';
import { CheckCircle2, XCircle, Navigation, Users, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export default function RoomCard({ room, onToggleStatus }) {
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (status) => {
    try {
      setUpdating(true);
      await onToggleStatus(room._id, status);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const isSameFloor = room.proximityLabel.includes('this floor');

  return (
    <div
      className={`rounded-3xl border p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
        room.isVacant
          ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/20 group'
          : 'bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      {/* Background ambient glow if vacant */}
      {room.isVacant && (
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/15 transition"></div>
      )}

      {/* Top Proximity & Walk Time Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
            isSameFloor
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
          }`}
        >
          <Navigation className={`h-3 w-3 ${isSameFloor ? 'text-emerald-400' : 'text-slate-400'}`} />
          {room.proximityLabel}
        </span>

        {/* Capacity */}
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/40">
          <Users className="h-3 w-3 text-slate-400" />
          {room.capacity} seats
        </span>
      </div>

      {/* Main Room Code & Building */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl font-black text-white tracking-tight font-mono">
            {room.roomNumber}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {room.type || 'Classroom'}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          {room.building} &bull; Floor {room.floor === 0 ? 'Ground (0)' : room.floor}
        </p>
      </div>

      {/* Vacancy Status Banner */}
      <div
        className={`p-3.5 rounded-2xl border mb-4 transition ${
          room.isVacant
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              {room.isVacant ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              )}
            </span>
            <div>
              <span className="font-bold text-sm block tracking-wide">
                {room.isVacant ? 'Currently Vacant' : 'Class in Progress'}
              </span>
              {!room.isVacant && room.activeClass && (
                <span className="text-[11px] text-rose-300 block truncate max-w-[210px] mt-0.5">
                  {room.activeClass}
                </span>
              )}
            </div>
          </div>

          {room.isVacant && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Free to Study
            </span>
          )}
        </div>
      </div>

      {/* Bottom Quick-Action Crowdsource Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px]">
        <span className="text-slate-500">Spot checked recently</span>
        {room.isVacant ? (
          <button
            onClick={() => handleToggle(true)}
            disabled={updating}
            className="text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 rounded-lg hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition"
          >
            Mark Taken
          </button>
        ) : (
          <button
            onClick={() => handleToggle(false)}
            disabled={updating}
            className="text-slate-400 hover:text-emerald-400 font-semibold px-2 py-1 rounded-lg hover:bg-emerald-950/30 border border-transparent hover:border-emerald-900/50 transition"
          >
            Mark Free
          </button>
        )}
      </div>
    </div>
  );
}
