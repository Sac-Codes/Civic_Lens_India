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
import { INITIAL_CITIZEN_PROFILE } from '../data/mockData';

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
  const [profile, setProfile] = useState<CitizenProfile>(citizenProfile);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Citizen Profile Banner */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20"
              referrerPolicy="no-referrer"
            />
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
                <span>•</span>
                <span>{profile.phone}</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center mt-1">
                <MapPin className="w-3 h-3 text-blue-400 mr-1" />
                <span>Primary Area: {profile.ward}</span>
              </p>
            </div>
          </div>

          {/* Karma Points & Community Rank */}
          <div className="flex items-center space-x-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-center pr-4 border-r border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Civic Karma</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono flex items-center justify-center">
                <Flame className="w-5 h-5 mr-1 text-amber-400" />
                {profile.karmaPoints}
              </span>
            </div>

            <div className="text-center pl-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Leaderboard</span>
              <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
                #{profile.rankInWard} <span className="text-xs font-normal text-slate-400">in Ward</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Badges & Milestones */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Civic Achievements & Verified Badges</span>
          </h3>
          <span className="text-xs text-slate-400">{profile.badges.length} Earned</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profile.badges.map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate group-hover:text-amber-300">
                  {badge}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Verified Active</span>
              </div>
            </div>
          ))}
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
