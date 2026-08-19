import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  ShieldAlert, 
  UserCheck, 
  Cpu, 
  Building2, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Incident, Ward, Department, Officer } from '../types';
import { INITIAL_WARDS, INITIAL_DEPARTMENTS, INITIAL_OFFICERS } from '../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onSelectIncident,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchingIncidents = q ? incidents.filter(
    (i) => i.id.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.address.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const matchingWards = q ? INITIAL_WARDS.filter(
    (w) => w.name.toLowerCase().includes(q) || `ward ${w.number}`.includes(q)
  ).slice(0, 3) : [];

  const matchingOfficers = q ? INITIAL_OFFICERS.filter(
    (o) => o.name.toLowerCase().includes(q) || o.department.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl border border-blue-500/40 shadow-2xl p-4 space-y-4">
        
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-cyan-400 absolute left-3.5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search incidents, wards, officers, departments... (ESC to exit)"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-4 max-h-96 overflow-y-auto text-xs pr-1">
          {!q && (
            <div className="p-4 text-center text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
              <p>Search across 110+ verified municipal complaints, 12 wards, and 8 department divisions.</p>
            </div>
          )}

          {/* Incident Matches */}
          {matchingIncidents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Incidents ({matchingIncidents.length})
              </span>
              {matchingIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    onSelectIncident(inc);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-white block truncate">{inc.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{inc.id} • {inc.ward}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* Ward Matches */}
          {matchingWards.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Wards ({matchingWards.length})
              </span>
              {matchingWards.map((ward) => (
                <div
                  key={ward.id}
                  onClick={() => {
                    onNavigateTab('heatmap');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Ward {ward.number}: {ward.name}</span>
                      <span className="text-[10px] text-slate-400">Risk Score: {ward.riskScore}% • Pop: {(ward.population / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* Officer Matches */}
          {matchingOfficers.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Officers ({matchingOfficers.length})
              </span>
              {matchingOfficers.map((off) => (
                <div
                  key={off.id}
                  onClick={() => {
                    onNavigateTab('officer');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">{off.name}</span>
                      <span className="text-[10px] text-slate-400">{off.role} • {off.department}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
