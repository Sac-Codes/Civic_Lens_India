import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Star, 
  Trophy, 
  ThumbsUp, 
  Flame, 
  Layers, 
  TrendingUp, 
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { CitizenProfile, Incident } from '../types';

interface CitizenPortalProps {
  citizenProfile: CitizenProfile;
  myIncidents: Incident[];
  onOpenReportModal: () => void;
  onSelectIncident: (inc: Incident) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  citizenProfile,
  myIncidents,
  onOpenReportModal,
  onSelectIncident
}) => {
  const profile = citizenProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Citizen Profile Banner */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center space-x-4">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20" referrerPolicy="no-referrer" /> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 text-xl font-bold text-cyan-300 sm:h-20 sm:w-20">{profile.name.charAt(0).toUpperCase()}</div>}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Level {profile.level} Citizen
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-2 mt-1">
                <span>{profile.email}</span>
                {profile.phone && <><span>•</span><span>{profile.phone}</span></>}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center mt-1">
                <MapPin className="w-3 h-3 text-blue-400 mr-1" />
                {profile.ward ? <span>Primary Area: {profile.ward}</span> : <span>Primary area not set</span>}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">Your account information and submitted reports are shown here.</div>

        </div>
      </div>

      {/* My Submitted Issues Tracker */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              My Tracked Civic Complaints ({myIncidents.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live milestones and officer resolution logs for your submissions.
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>

        <div className="space-y-3">
          {myIncidents.length === 0 && <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center"><p className="text-sm font-semibold text-slate-200">No reports yet</p><p className="mt-1 text-xs text-slate-500">Your civic reports will appear here once you submit one.</p></div>}
          {myIncidents.slice(0, 5).map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={inc.imageUrl}
                  alt={inc.title}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{inc.id}</span>
                    <span className="text-xs text-slate-400">• {inc.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-cyan-300">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{inc.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  inc.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {inc.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
