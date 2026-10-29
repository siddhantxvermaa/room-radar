import React, { useState } from 'react';
import { Search, MapPin, Clock, UserCheck, FileText, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function IssueWizard({ issues, categories, selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  const [expandedIssueId, setExpandedIssueId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

  const quickPrompts = [
    'Attendance shortage',
    'Bonafide certificate',
    'Hall ticket',
    'Internship NOC',
    'Wi-Fi password reset',
    'Fee installment'
  ];

  return (
    <div className="space-y-6">
      {/* Search & Categories Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type your college problem (e.g. attendance shortage, backlog hall ticket, bonafide, fee receipt, internship)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-inner transition"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Quick:</span>
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => onSearchChange(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'All'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Issues ({issues.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-300">No issue guides found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try clicking one of the quick suggestions above or clear your keyword.</p>
          </div>
        ) : (
          issues.map((issue) => {
            const isExpanded = expandedIssueId === issue._id || issues.length <= 2;
            return (
              <div
                key={issue._id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-200 hover:border-slate-700 backdrop-blur-xl"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(issue._id)}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {issue.category}
                      </span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-xs font-semibold text-slate-400">
                        Authority: <strong className="text-slate-200">{issue.responsibleAuthority}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition">{issue.issueTitle}</h3>
                    {issue.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{issue.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-sky-400 border border-slate-700">
                      {issue.cabinNumber}
                    </span>
                    <button className="p-1 rounded-lg text-slate-500 group-hover:text-white transition">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 space-y-4 text-xs">
                    {/* Where to Go Card */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Exact Office Location
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                          <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                          <span>{issue.cabinNumber}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5 text-xs">
                          {issue.building} &bull; Floor {issue.floor === 0 ? 'Ground' : issue.floor}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Designated Official
                        </span>
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <UserCheck className="h-4 w-4 text-sky-400 flex-shrink-0" />
                          <span>{issue.designatedPerson}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5 text-xs">{issue.responsibleAuthority}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Official Visiting Hours
                        </span>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                          <span>{issue.visitingHours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Procedure */}
                    {issue.actionSteps && issue.actionSteps.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Step-by-Step Resolution Roadmap
                        </h4>
                        <ol className="space-y-2">
                          {issue.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold">
                                {idx + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Required Documents */}
                    {issue.requiredDocuments && issue.requiredDocuments.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-400" />
                          Checklist of Documents to Carry
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {issue.requiredDocuments.map((doc, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium"
                            >
                              &bull; {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
