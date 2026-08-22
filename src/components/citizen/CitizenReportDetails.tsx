import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Incident } from '../../types';
import { StatusBadge } from './StatusBadge';

interface CitizenReportDetailsProps {
  incidents: Incident[];
}

export const CitizenReportDetails: React.FC<CitizenReportDetailsProps> = ({ incidents }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="civic-card p-12 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Not Found</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            The report you requested ({id}) could not be found or you do not have permission to view it.
          </p>
          <button
            onClick={() => navigate('/citizen/reports')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
          >
            Back to My Reports
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/citizen/reports')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-cyan-400">
            {incident.id}
          </span>
          <StatusBadge status={incident.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Main Details & Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Info Card */}
          <div className="civic-card p-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                {incident.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {incident.title}
              </h1>
              <p className="text-xs text-slate-400 flex items-center space-x-2 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted on {formatDate(incident.createdAt)}</span>
              </p>
            </div>

            {/* Photo Evidence */}
            {incident.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3]">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Citizen Description
              </h3>
              <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {incident.description}
              </p>
            </div>

            {/* Location & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Location</span>
                </span>
                <p className="text-white font-medium">{incident.address}</p>
                <p className="text-slate-400 text-[11px]">{incident.ward}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Routed Department</span>
                </span>
                <p className="text-white font-medium">{incident.department || 'Under Review'}</p>
                {incident.assignedOfficerName && (
                  <p className="text-cyan-400 text-[11px]">Officer: {incident.assignedOfficerName}</p>
                )}
              </div>
            </div>

            {/* AI Advisory Box (if available from real analysis) */}
            {incident.aiSummary && incident.aiSummary !== 'Manual citizen submission' && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Advisory Summary</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-cyan-300">
                    {incident.severity} Severity
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {incident.aiSummary}
                </p>
              </div>
            )}

            {/* Resolution Completion Note (when resolved) */}
            {incident.status === 'Resolved' && incident.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolution Details</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {incident.resolutionNotes}
                </p>
                {incident.resolvedAt && (
                  <p className="text-[11px] text-slate-400">
                    Closed on: {formatDate(incident.resolvedAt)}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right: Chronological Timeline Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="civic-card p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Action & Audit Timeline</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official milestone log for this incident report.
              </p>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline && incident.timeline.length > 0 ? (
                incident.timeline.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative space-y-1 text-xs">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">
                        {evt.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(evt.timestamp)}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {evt.description}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Logged by: <span className="text-slate-300">{evt.actor}</span> ({evt.role})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No timeline events recorded yet.</p>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
