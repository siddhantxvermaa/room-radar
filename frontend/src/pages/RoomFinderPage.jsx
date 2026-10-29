import React, { useState, useEffect } from 'react';
import LocationSelector, { CAMPUS_BUILDINGS } from '../components/LocationSelector';
import RoomCard from '../components/RoomCard';
import { roomApi } from '../services/api';
import { Sparkles, CheckCircle2, XCircle, Search, RefreshCw, Radio, Compass } from 'lucide-react';

export default function RoomFinderPage() {
  const [building, setBuilding] = useState('Block B');
  const [floor, setFloor] = useState(2);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ totalRooms: 0, vacantCount: 0, occupiedCount: 0 });
  const [filterType, setFilterType] = useState('all'); // 'all', 'vacant', 'occupied'
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await roomApi.getNearest(building, floor);
      if (res.data && res.data.rooms) {
        setRooms(res.data.rooms);
        setStats(res.data.stats || { totalRooms: res.data.rooms.length, vacantCount: 0, occupiedCount: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [building, floor]);

  const handleToggleStatus = async (roomId, isOccupied) => {
    await roomApi.toggleStatus(roomId, isOccupied);
    fetchRooms();
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterType === 'vacant' && !r.isVacant) return false;
    if (filterType === 'occupied' && r.isVacant) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        r.roomNumber.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        (r.type && r.type.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sleek Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Autonomous Proximity Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Stop Wandering Around. Find Free Classrooms Instantly.
          </h1>

          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Pick your current spot on campus. RoomRadar checks live weekly timetable schedules and ranks the nearest vacant study spaces by walking distance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-6 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Classrooms Monitored</span>
              <span className="text-2xl font-black text-white font-mono">{stats.totalRooms}</span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Currently Vacant</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{stats.vacantCount}</span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">Occupied by Lectures</span>
              <span className="text-2xl font-black text-rose-400 font-mono">{stats.occupiedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Location Matrix */}
      <LocationSelector
        building={building}
        floor={floor}
        onBuildingChange={setBuilding}
        onFloorChange={setFloor}
      />

      {/* Control Bar: Filters & Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === 'all'
                ? 'bg-white text-slate-950 shadow-md font-black'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Rooms ({stats.totalRooms})
          </button>

          <button
            onClick={() => setFilterType('vacant')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === 'vacant'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-500/30'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Vacant Only ({stats.vacantCount})
          </button>

          <button
            onClick={() => setFilterType('occupied')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === 'occupied'
                ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
                : 'bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 border border-rose-500/30'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Occupied ({stats.occupiedCount})
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search room code (e.g. B-205)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={fetchRooms}
            title="Refresh availability"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-slate-900/60 border border-slate-800 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-white">No classrooms match the active criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try switching to "All Rooms" or change your building/floor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} onToggleStatus={handleToggleStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
