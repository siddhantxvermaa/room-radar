import React, { useState, useEffect } from 'react';
import IssueWizard from '../components/IssueWizard';
import { issueApi } from '../services/api';
import { Compass, HelpCircle, Sparkles } from 'lucide-react';

export default function HelpdeskPage() {
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await issueApi.getAll(params);
      if (res.data) {
        setIssues(res.data.issues || []);
        if (res.data.categories) setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-slate-900 via-violet-950/40 to-slate-900 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-violet-400" />
            <span>Problem-to-Person Guidance Router</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Where Should I Go? Student Helpdesk
          </h1>

          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Stuck with medical leave submissions, backlog exam registration, lost ID cards, or internship permissions? Find out who handles it, where their cabin is, and the exact steps to follow.
          </p>
        </div>
      </div>

      {/* Main Issue Wizard Component */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-36 bg-slate-900/60 border border-slate-800 animate-pulse rounded-3xl"></div>
          <div className="h-44 bg-slate-900/60 border border-slate-800 animate-pulse rounded-3xl"></div>
        </div>
      ) : (
        <IssueWizard
          issues={issues}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
    </div>
  );
}
