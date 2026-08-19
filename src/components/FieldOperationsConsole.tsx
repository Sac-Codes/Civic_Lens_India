import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Navigation, 
  Upload, 
  Wrench, 
  DollarSign, 
  AlertCircle, 
  ShieldCheck, 
  Send,
  Phone,
  Sparkles
} from 'lucide-react';
import { Incident, Officer } from '../types';
import { INITIAL_OFFICERS } from '../data/mockData';

interface FieldOperationsConsoleProps {
  incidents: Incident[];
  onUpdateIncident: (updated: Incident) => void;
}

export const FieldOperationsConsole: React.FC<FieldOperationsConsoleProps> = ({
  incidents,
  onUpdateIncident
}) => {
  const [activeOfficer, setActiveOfficer] = useState<Officer>(INITIAL_OFFICERS[0]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Work-order step states
  const [materialsLogged, setMaterialsLogged] = useState('25kg Cold Asphalt Mix, 1 Tack Seal Spray');
  const [workNotes, setWorkNotes] = useState('Sub-base compacted and resurfaced with vibratory tamper.');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80');
  const [isResolving, setIsResolving] = useState(false);

  const assignedIncidents = incidents.filter(
    (i) => i.assignedOfficerId === activeOfficer.id || i.status === 'Assigned' || i.status === 'In Progress'
  );

  const currentActive = selectedIncident || assignedIncidents[0] || incidents[0];

  const handleCompleteWorkOrder = () => {
    if (!currentActive) return;
    setIsResolving(true);

    const now = new Date().toISOString();
    const updated: Incident = {
      ...currentActive,
      status: 'Resolved',
      resolvedAt: now,
      timeline: [
        ...currentActive.timeline,
        {
          id: `t-officer-res-${Date.now()}`,
          timestamp: now,
          title: 'Field Repair Completed & Photographed',
          description: `Officer ${activeOfficer.name} logged repair materials: "${materialsLogged}". Work Notes: "${workNotes}"`,
          actor: activeOfficer.name,
          role: 'Officer',
          statusChangedTo: 'Resolved'
        }
      ]
    };

    setTimeout(() => {
      setIsResolving(false);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      onUpdateIncident(updated);
      setSelectedIncident(updated);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Banner & Duty Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              OFFICER MOBILE TERMINAL
            </span>
            <span className="text-xs text-slate-400 font-mono">FIELD UNIT #402</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Field Operations & Work-Order Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Accept work orders, navigate turn-by-turn routes, and verify on-site civic repairs.
          </p>
        </div>

        {/* Officer Switcher */}
        <div className="flex items-center space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <select
              value={activeOfficer.id}
              onChange={(e) => {
                const off = INITIAL_OFFICERS.find((o) => o.id === e.target.value);
                if (off) setActiveOfficer(off);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {INITIAL_OFFICERS.map((off) => (
                <option key={off.id} value={off.id} className="bg-slate-900 text-white">
                  {off.name} ({off.role})
                </option>
              ))}
            </select>
            <span className="block text-[10px] text-emerald-400 font-medium">
              Ward: {activeOfficer.assignedWard} • Rating: {activeOfficer.performanceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Work Order Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Queue of assigned tasks (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white font-heading">
                My Assigned Queue ({assignedIncidents.length})
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">PRIORITY SORTED</span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {assignedIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    currentActive?.id === inc.id
                      ? 'bg-blue-600/20 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={inc.imageUrl}
                    alt={inc.title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{inc.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white truncate mt-1">
                      {inc.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{inc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Work Order Step-by-Step Resolution (8 cols) */}
        {currentActive ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-6 shadow-2xl">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {currentActive.id}
                    </span>
                    <span className="text-xs text-slate-400">{currentActive.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {currentActive.title}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1" />
                    <span>{currentActive.address} ({currentActive.ward})</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`https://maps.google.com/?q=${currentActive.latitude},${currentActive.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate GPS</span>
                  </a>
                </div>
              </div>

              {/* Photo & Defect AI Diagnostic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Citizen Upload / Inspection Target
                  </span>
                  <img
                    src={currentActive.imageUrl}
                    alt={currentActive.title}
                    className="w-full h-44 object-cover rounded-xl border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    AI Recommended Materials & Action:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {currentActive.recommendedMaterials.map((m, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
                    <span>Target Budget SLA:</span>
                    <strong className="text-emerald-400 font-mono">{currentActive.estimatedCost}</strong>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Resolution Form */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-heading">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span>Execute On-Site Resolution & Upload Proof</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Materials Consumed</label>
                    <input
                      type="text"
                      value={materialsLogged}
                      onChange={(e) => setMaterialsLogged(e.target.value)}
                      placeholder="e.g. 50kg asphalt, 2 safety barriers..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Completion Notes</label>
                    <input
                      type="text"
                      value={workNotes}
                      onChange={(e) => setWorkNotes(e.target.value)}
                      placeholder="e.g. Patching complete, asphalt cooled and tested..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Proof of Work Photo Verification */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={afterPhotoUrl}
                      alt="Proof Photo"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Proof-of-Work Photograph</span>
                      <span className="text-[11px] text-slate-400">Ready for AI automatic audit cross-reference</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAfterPhotoUrl('https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Retake Photo</span>
                  </button>
                </div>

                {/* Final Submit Button */}
                <button
                  type="button"
                  onClick={handleCompleteWorkOrder}
                  disabled={isResolving || currentActive.status === 'Resolved'}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2 transition ${
                    currentActive.status === 'Resolved'
                      ? 'bg-emerald-700 opacity-80 cursor-default'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25 active:scale-98'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {currentActive.status === 'Resolved'
                      ? 'Work Order Already Resolved & Verified'
                      : isResolving
                      ? 'Submitting Proof to Command...'
                      : 'Complete Work Order & Notify Citizen'}
                  </span>
                </button>

              </div>

            </div>
          </div>
        ) : null}

      </div>

    </div>
  );
};
