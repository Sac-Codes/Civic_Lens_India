import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Calendar,
  FileText,
  Building2,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Incident } from '../../types';
import { StatusBadge } from './StatusBadge';

interface CitizenDashboardProps {
  user: { uid: string; name: string; email: string };
  myIncidents: Incident[];
  onOpenReportModal?: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  user,
  myIncidents,
  onOpenReportModal
}) => {
  const navigate = useNavigate();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user.name ? user.name.split(' ')[0] : 'Citizen';

  // Calculate real metrics directly from Firestore records
  const totalReports = myIncidents.length;
  const pendingReports = myIncidents.filter((i) => i.status === 'Pending').length;
  const inProgressReports = myIncidents.filter((i) => i.status === 'In Progress' || i.status === 'Assigned').length;
  const resolvedReports = myIncidents.filter((i) => i.status === 'Resolved').length;

  const recentReports = myIncidents.slice(0, 5);

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Citizen Welcome Banner */}
      <div className="civic-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0f1d3a] to-slate-900 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Citizen Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Help improve your community by reporting civic issues around you and tracking their resolution in real time.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/citizen/report')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics Grid (Real Firestore values only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="civic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Reports</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {totalReports}
          </p>
          <p className="text-[11px] text-slate-400">All submissions</p>
        </div>

        <div className="civic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Triage</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {pendingReports}
          </p>
          <p className="text-[11px] text-slate-400">Awaiting department routing</p>
        </div>

        <div className="civic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>In Progress</span>
            <Play className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-mono">
            {inProgressReports}
          </p>
          <p className="text-[11px] text-slate-400">Assigned / Field work underway</p>
        </div>

        <div className="civic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            {resolvedReports}
          </p>
          <p className="text-[11px] text-slate-400">Verified & closed cases</p>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="civic-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              My Recent Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status and resolution updates for issues you reported.
            </p>
          </div>

          {myIncidents.length > 0 && (
            <button
              onClick={() => navigate('/citizen/reports')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>View All ({myIncidents.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {myIncidents.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                You haven't submitted any reports yet.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Spot a pothole, streetlight failure, or garbage problem? Report it in seconds to alert municipal teams.
              </p>
            </div>
            <button
              onClick={() => navigate('/citizen/report')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition inline-flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Report an Issue</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentReports.map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate(`/citizen/reports/${inc.id}`)}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  {inc.imageUrl ? (
                    <img
                      src={inc.imageUrl}
                      alt={inc.title}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {inc.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {inc.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition">
                      {inc.title}
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[200px]">{inc.address}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(inc.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pl-16 sm:pl-0">
                  <StatusBadge status={inc.status} />
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
