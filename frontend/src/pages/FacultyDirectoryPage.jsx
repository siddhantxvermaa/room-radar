import React, { useState, useEffect } from 'react';
import FacultyCard from '../components/FacultyCard';
import { facultyApi } from '../services/api';
import { Search, UserCheck, Building2, Filter, RefreshCw } from 'lucide-react';

export default function FacultyDirectoryPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedBuilding !== 'All') params.building = selectedBuilding;

      const res = await facultyApi.getAll(params);
      if (res.data) {
        setFacultyList(res.data.faculty || []);
        if (res.data.departments) setDepartments(res.data.departments);
        if (res.data.buildings) setBuildings(res.data.buildings);
      }
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedBuilding]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <UserCheck className="h-3.5 w-3.5 text-sky-400" />
            <span>Campus Office & Faculty Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Faculty Cabins & Consultation Timings
          </h1>

          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Need to submit an assignment, consult your HOD, or find your Class Mentor? Check their exact cabin, academic block, floor, and official consultation hours.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by faculty name, cabin (e.g. Cabin 312), subject, or coordinator..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Department Filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="w-full sm:w-52">
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : facultyList.length === 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-white">No faculty records match your search.</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your keyword or selecting "All Departments".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyList.map((faculty) => (
            <FacultyCard key={faculty._id} faculty={faculty} />
          ))}
        </div>
      )}
    </div>
  );
}
