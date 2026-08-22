import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Building2, 
  ChevronRight, 
  FileText, 
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Incident } from '../../types';
import { StatusBadge } from './StatusBadge';

interface CitizenReportsPageProps {
  myIncidents: Incident[];
}

export const CitizenReportsPage: React.FC<CitizenReportsPageProps> = ({ myIncidents }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories list
  const categories = Array.from(new Set(myIncidents.map((i) => i.category).filter(Boolean)));

  // Filter logic
  const filtered = myIncidents.filter((inc) => {
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q) ||
        inc.address.toLowerCase().includes(q) ||
        (inc.department && inc.department.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            History & Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            My Civic Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track real-time progress, inspection logs, and department resolution notes.
          </p>
        </div>

        <button
          onClick={() => navigate('/citizen/report')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition inline-flex items-center space-x-1.5 shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="civic-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, ID, category, or location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses ({myIncidents.length})</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="civic-card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              No reports match your filters.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search keyword or status filter.
            </p>
          </div>
          {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedCategory('all');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => navigate(`/citizen/reports/${inc.id}`)}
              className="civic-card p-4 sm:p-5 hover:border-blue-500/40 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4 min-w-0">
                {inc.imageUrl ? (
                  <img
                    src={inc.imageUrl}
                    alt={inc.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <FileText className="w-8 h-8" />
                  </div>
                )}

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {inc.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {inc.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-cyan-300 transition">
                    {inc.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {inc.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-slate-400 flex-wrap gap-y-1 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{inc.address}</span>
                    </span>

                    {inc.department && (
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{inc.department}</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{formatDate(inc.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <StatusBadge status={inc.status} />
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition group-hover:text-white">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
