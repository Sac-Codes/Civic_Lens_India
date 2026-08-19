import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Activity, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Volume2, 
  Send, 
  MapPin, 
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { Incident, CityAnalytics } from '../types';

interface CityCommandCenterProps {
  incidents: Incident[];
  analytics: CityAnalytics;
  onSelectIncident: (inc: Incident) => void;
}

export const CityCommandCenter: React.FC<CityCommandCenterProps> = ({
  incidents,
  analytics,
  onSelectIncident
}) => {
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState<'Normal' | 'Elevated' | 'Red Alert'>('Normal');

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalIncidents = incidents.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-400 mr-1.5 animate-ping" />
              COMMAND & CONTROL SYSTEM
            </span>
            <span className="text-xs text-slate-400 font-mono">SECTOR METROPOLIS HQ</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Executive Smart City Command Room
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time municipal emergency monitoring, ward dispatching, and field personnel telemetry.
          </p>
        </div>

        {/* Live Clock & Emergency Switcher */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">UTC System Time</span>
            <span className="text-xl font-extrabold text-cyan-400 font-mono">{liveTime}</span>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['Normal', 'Elevated', 'Red Alert'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setEmergencyLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  emergencyLevel === lvl
                    ? lvl === 'Red Alert'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                      : lvl === 'Elevated'
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Hazards Hot-List & Live Emergency Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Critical Unresolved Hazards (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white font-heading">
                Active Priority Hazards Requiring Dispatch ({criticalIncidents.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold animate-pulse">
              🔴 HIGH THREAT MATRIX
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {criticalIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active critical hazards. All metropolitan emergency sectors clear.
              </div>
            ) : (
              criticalIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/60 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <img
                      src={inc.imageUrl}
                      alt={inc.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-rose-400">{inc.id}</span>
                        <span className="text-[10px] text-slate-400">{inc.ward}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-cyan-300">
                        {inc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{inc.address}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Severity: {inc.severityScore}/100
                    </span>
                    <span className="block text-[10px] text-purple-400 font-medium mt-1">
                      {inc.duplicateCount} Citizen Calls
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Emergency Broadcaster & Field Officers on Duty (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Emergency Alert Broadcast to Officers */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-heading">
                Citywide Mobile Officer Dispatch
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              Transmit high-priority alert or traffic diversion advisory directly to all active municipal tablets.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                rows={2}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write an alert for authorized field staff..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Priority Alert</span>
              </button>

              {broadcastSent && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Alert queued for authorized field staff.</span>
                </div>
              )}
            </form>
          </div>

          {/* Officers On-Duty Feed */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">
                Active Field Roster
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">100% ONLINE</span>
            </div>

            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500">No field roster data is available yet.</div>
          </div>

        </div>

      </div>

    </div>
  );
};
