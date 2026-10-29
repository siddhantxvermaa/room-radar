import React from 'react';
import { User, MapPin, Clock, Mail, Phone, BookMarked, Sparkles } from 'lucide-react';

export default function FacultyCard({ faculty }) {
  const initials = faculty.name
    .replace('Dr. ', '')
    .replace('Prof. ', '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition backdrop-blur-xl group relative overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-base shadow-inner group-hover:scale-105 transition">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition">{faculty.name}</h3>
            <p className="text-xs font-medium text-sky-400">{faculty.designation}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
          {faculty.department}
        </span>
      </div>

      {/* Cabin & Location */}
      <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800/80 mb-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-white font-bold">
          <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
          <span>{faculty.cabinNumber} &bull; {faculty.building} (Floor {faculty.floor === 0 ? 'Ground' : faculty.floor})</span>
        </div>

        <div className="flex items-start gap-2 text-slate-400">
          <Clock className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span><strong className="text-slate-300">Visiting Hours:</strong> {faculty.consultationHours}</span>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2 text-xs text-slate-400 mb-4">
        {faculty.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-slate-500" />
            <a href={`mailto:${faculty.email}`} className="text-sky-400 hover:text-sky-300 hover:underline truncate">
              {faculty.email}
            </a>
          </div>
        )}
        {faculty.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-300 font-mono text-[11px]">{faculty.phone}</span>
          </div>
        )}
      </div>

      {/* Subjects Taught */}
      {faculty.subjectsTaught && faculty.subjectsTaught.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <BookMarked className="h-3 w-3 text-sky-400" />
            Specialization / Courses
          </div>
          <div className="flex flex-wrap gap-1">
            {faculty.subjectsTaught.map((sub, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded-md border border-slate-700/50">
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
