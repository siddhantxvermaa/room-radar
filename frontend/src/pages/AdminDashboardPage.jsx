import React, { useState, useEffect } from 'react';
import { roomApi, facultyApi, issueApi, authApi, seedApi } from '../services/api';
import { CAMPUS_BUILDINGS, CAMPUS_FLOORS } from '../components/LocationSelector';
import { 
  ShieldCheck, Plus, Trash2, KeyRound, Building2, UserCheck, 
  HelpCircle, Database, CheckCircle2, Clock, Calendar, LogIn 
} from 'lucide-react';

export default function AdminDashboardPage({ user, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms', 'faculty', 'issues'
  
  // Auth state if not logged in
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data state
  const [rooms, setRooms] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states for creating new items
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    building: 'Block B',
    floor: 0,
    capacity: 60,
    type: 'Classroom'
  });

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    designation: '',
    department: 'Computer Science & Engineering',
    cabinNumber: '',
    building: 'Block B',
    floor: 1,
    consultationHours: '10:00 AM - 12:00 PM',
    email: '',
    phone: '',
    subjectsTaught: ''
  });

  const [newIssue, setNewIssue] = useState({
    category: 'Academic',
    issueTitle: '',
    description: '',
    responsibleAuthority: '',
    designatedPerson: '',
    cabinNumber: '',
    building: 'Block B',
    floor: 1,
    visitingHours: '11:00 AM - 01:00 PM',
    actionSteps: '',
    requiredDocuments: ''
  });

  // Modal / drawer state for managing room schedule
  const [selectedRoomForSchedule, setSelectedRoomForSchedule] = useState(null);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    course: '',
    faculty: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, facultyRes, issuesRes] = await Promise.all([
        roomApi.getAll({}),
        facultyApi.getAll({}),
        issueApi.getAll({})
      ]);
      setRooms(roomsRes.data.rooms || []);
      setFaculty(facultyRes.data.faculty || []);
      setIssues(issuesRes.data.issues || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError('');
    try {
      const res = await authApi.login({ email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('room_radar_token', res.data.token);
        if (onLoginSuccess) onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoggingIn(false);
    }
  };

  // Handlers for Room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await roomApi.create(newRoom);
      setMessage('Classroom added successfully!');
      setNewRoom({ roomNumber: '', building: 'Block B', floor: 0, capacity: 60, type: 'Classroom' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error adding room: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await roomApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting room');
    }
  };

  // Handlers for Schedule slot
  const handleAddScheduleSlot = async (e) => {
    e.preventDefault();
    if (!selectedRoomForSchedule) return;

    try {
      const updatedSchedule = [...(selectedRoomForSchedule.schedule || []), newSlot];
      await roomApi.update(selectedRoomForSchedule._id, { schedule: updatedSchedule });
      setMessage('Timetable slot added successfully!');
      setSelectedRoomForSchedule({ ...selectedRoomForSchedule, schedule: updatedSchedule });
      setNewSlot({ dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', course: '', faculty: '' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error adding schedule slot');
    }
  };

  const handleDeleteScheduleSlot = async (slotIdx) => {
    try {
      const updatedSchedule = selectedRoomForSchedule.schedule.filter((_, idx) => idx !== slotIdx);
      await roomApi.update(selectedRoomForSchedule._id, { schedule: updatedSchedule });
      setSelectedRoomForSchedule({ ...selectedRoomForSchedule, schedule: updatedSchedule });
      fetchData();
    } catch (err) {
      alert('Error deleting slot');
    }
  };

  // Handlers for Faculty
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newFaculty,
        subjectsTaught: newFaculty.subjectsTaught ? newFaculty.subjectsTaught.split(',').map(s => s.trim()) : []
      };
      await facultyApi.create(payload);
      setMessage('Faculty added successfully!');
      setNewFaculty({
        name: '',
        designation: '',
        department: 'Computer Science & Engineering',
        cabinNumber: '',
        building: 'Block B',
        floor: 1,
        consultationHours: '10:00 AM - 12:00 PM',
        email: '',
        phone: '',
        subjectsTaught: ''
      });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error adding faculty');
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Delete this faculty entry?')) return;
    try {
      await facultyApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting faculty');
    }
  };

  // Handlers for Issue
  const handleAddIssue = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newIssue,
        actionSteps: newIssue.actionSteps ? newIssue.actionSteps.split('\n').map(s => s.trim()).filter(Boolean) : [],
        requiredDocuments: newIssue.requiredDocuments ? newIssue.requiredDocuments.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      await issueApi.create(payload);
      setMessage('Issue guidance rule added!');
      setNewIssue({
        category: 'Academic',
        issueTitle: '',
        description: '',
        responsibleAuthority: '',
        designatedPerson: '',
        cabinNumber: '',
        building: 'Block B',
        floor: 1,
        visitingHours: '11:00 AM - 01:00 PM',
        actionSteps: '',
        requiredDocuments: ''
      });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error adding issue');
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm('Delete this issue guidance?')) return;
    try {
      await issueApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting issue');
    }
  };

  // If not logged in, show Sleek Login Form
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin & CR Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage rooms, schedules, and faculty cabins.
          </p>
        </div>

        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            {loggingIn ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Default credentials pre-filled for your viva demo:
          </p>
          <code className="inline-block mt-1 text-xs bg-slate-950 px-3 py-1 rounded-lg text-emerald-400 font-mono border border-slate-800">
            admin@college.edu / admin123
          </code>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Admin & CR Control Center</h1>
            <p className="text-xs text-slate-400">Manage classrooms, weekly timetables, faculty cabins, and student routing</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'rooms' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Classrooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'faculty' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Faculty ({faculty.length})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'issues' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Helpdesk ({issues.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* TAB 1: CLASSROOMS & TIMETABLES */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Room Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-fit">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-400" />
              Add New Classroom
            </h2>
            <form onSubmit={handleAddRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-204, LH-101"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Building</label>
                <select
                  value={newRoom.building}
                  onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {CAMPUS_BUILDINGS.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Floor</label>
                  <select
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {CAMPUS_FLOORS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Seminar Hall">Seminar Hall</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
              >
                Create Room
              </button>
            </form>
          </div>

          {/* Rooms Table */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white">Classrooms ({rooms.length})</h2>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Room</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Timetable</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rooms.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white font-mono">{r.roomNumber}</td>
                      <td className="p-3 text-slate-400">{r.building} &bull; Floor {r.floor}</td>
                      <td className="p-3 text-slate-400">{r.capacity} seats</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedRoomForSchedule(r)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-medium transition"
                        >
                          {r.schedule?.length || 0} slots (Edit)
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRoom(r._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {selectedRoomForSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Weekly Schedule for {selectedRoomForSchedule.roomNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedRoomForSchedule.building} &bull; Floor {selectedRoomForSchedule.floor}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoomForSchedule(null)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Existing Slots */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Existing Scheduled Slots</h4>
              {(!selectedRoomForSchedule.schedule || selectedRoomForSchedule.schedule.length === 0) ? (
                <p className="text-xs text-slate-500 italic">No classes scheduled yet. This room is always vacant.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedRoomForSchedule.schedule.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-white">{slot.dayOfWeek}</span> &bull;{' '}
                        <span className="text-emerald-400 font-mono">{slot.startTime} - {slot.endTime}</span>
                        <p className="text-slate-400">{slot.course} ({slot.faculty})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteScheduleSlot(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Slot Form */}
            <form onSubmit={handleAddScheduleSlot} className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase">Add New Timetable Slot</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Day of Week</label>
                  <select
                    value={newSlot.dayOfWeek}
                    onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems"
                    value={newSlot.course}
                    onChange={(e) => setNewSlot({ ...newSlot, course: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Neha Gupta"
                    value={newSlot.faculty}
                    onChange={(e) => setNewSlot({ ...newSlot, faculty: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition"
              >
                Add Slot to Timetable
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-fit">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-sky-400" />
              Add Faculty Cabin Entry
            </h2>
            <form onSubmit={handleAddFaculty} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. A. K. Sharma"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  placeholder="Associate Professor"
                  value={newFaculty.designation}
                  onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newFaculty.department}
                  onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Cabin Number</label>
                  <input
                    type="text"
                    required
                    placeholder="Cabin 312"
                    value={newFaculty.cabinNumber}
                    onChange={(e) => setNewFaculty({ ...newFaculty, cabinNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Building</label>
                  <select
                    value={newFaculty.building}
                    onChange={(e) => setNewFaculty({ ...newFaculty, building: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {CAMPUS_BUILDINGS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Floor</label>
                  <select
                    value={newFaculty.floor}
                    onChange={(e) => setNewFaculty({ ...newFaculty, floor: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {CAMPUS_FLOORS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Visiting Hours</label>
                  <input
                    type="text"
                    value={newFaculty.consultationHours}
                    onChange={(e) => setNewFaculty({ ...newFaculty, consultationHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition shadow-md shadow-sky-500/20"
              >
                Save Faculty
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white">Faculty Records ({faculty.length})</h2>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Faculty</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Cabin & Location</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {faculty.map((f) => (
                    <tr key={f._id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block">{f.name}</span>
                        <span className="text-[11px] text-slate-400">{f.designation}</span>
                      </td>
                      <td className="p-3 text-slate-300">{f.department}</td>
                      <td className="p-3 text-slate-300">
                        <span className="font-bold text-sky-400 block">{f.cabinNumber}</span>
                        <span className="text-[11px] text-slate-400">{f.building} &bull; Floor {f.floor}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteFaculty(f._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ISSUES */}
      {activeTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-fit">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-violet-400" />
              Add Student Issue Guide
            </h2>
            <form onSubmit={handleAddIssue} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Fee & Accounts">Fee & Accounts</option>
                  <option value="Mentorship & Career">Mentorship & Career</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Exemption"
                  value={newIssue.issueTitle}
                  onChange={(e) => setNewIssue({ ...newIssue, issueTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Responsible Authority</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Academic Coordinator"
                  value={newIssue.responsibleAuthority}
                  onChange={(e) => setNewIssue({ ...newIssue, responsibleAuthority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Cabin</label>
                  <input
                    type="text"
                    required
                    placeholder="Cabin 312"
                    value={newIssue.cabinNumber}
                    onChange={(e) => setNewIssue({ ...newIssue, cabinNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Building</label>
                  <select
                    value={newIssue.building}
                    onChange={(e) => setNewIssue({ ...newIssue, building: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                  >
                    {CAMPUS_BUILDINGS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Steps (1 per line)</label>
                <textarea
                  rows="3"
                  value={newIssue.actionSteps}
                  onChange={(e) => setNewIssue({ ...newIssue, actionSteps: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition shadow-md shadow-violet-600/20"
              >
                Save Issue Guide
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white">Configured Guidance Rules ({issues.length})</h2>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Category & Title</th>
                    <th className="p-3">Designated Person & Cabin</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {issues.map((iss) => (
                    <tr key={iss._id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="text-[10px] uppercase font-bold text-violet-400 block">{iss.category}</span>
                        <span className="font-bold text-white">{iss.issueTitle}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-200 block">{iss.designatedPerson}</span>
                        <span className="text-[11px] text-slate-400">{iss.cabinNumber} &bull; {iss.building}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteIssue(iss._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
