import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  ChevronRight, 
  UserCheck, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Download, 
  SlidersHorizontal,
  X,
  Send,
  MessageSquare,
  Building2,
  Phone,
  ThumbsUp
} from 'lucide-react';
import { Incident, Officer, SeverityLevel, IncidentStatus } from '../types';
import { exportIncidentsToCsv } from '../services/storageService';

interface IncidentManagementProps {
  incidents: Incident[];
  onUpdateIncident: (updated: Incident) => void;
  onSelectIncident: (inc: Incident) => void;
}

export const IncidentManagement: React.FC<IncidentManagementProps> = ({
  incidents,
  onUpdateIncident,
  onSelectIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  
  // Multi-select bulk state
  const [selectedIncidentIds, setSelectedIncidentIds] = useState<string[]>([]);
  const [activeModalIncident, setActiveModalIncident] = useState<Incident | null>(null);
  const [officerNote, setOfficerNote] = useState('');

  // Filtering
  const filtered = incidents.filter((inc) => {
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedDepartment !== 'all' && inc.department !== selectedDepartment) return false;
    if (selectedWard !== 'all' && !inc.ward.toLowerCase().includes(selectedWard.toLowerCase())) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.address.toLowerCase().includes(q) ||
        inc.citizenName.toLowerCase().includes(q) ||
        (inc.assignedOfficerName && inc.assignedOfficerName.toLowerCase().includes(q)) ||
        inc.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    if (selectedIncidentIds.includes(id)) {
      setSelectedIncidentIds(selectedIncidentIds.filter((i) => i !== id));
    } else {
      setSelectedIncidentIds([...selectedIncidentIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIncidentIds.length === filtered.length) {
      setSelectedIncidentIds([]);
    } else {
      setSelectedIncidentIds(filtered.map((i) => i.id));
    }
  };

  const handleBulkStatusChange = (newStatus: IncidentStatus) => {
    incidents.forEach((inc) => {
      if (selectedIncidentIds.includes(inc.id)) {
        const updated: Incident = {
          ...inc,
          status: newStatus,
          timeline: [
            ...inc.timeline,
            {
              id: `t-bulk-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: `Bulk Status Update: ${newStatus}`,
              description: `Command operator updated status in batch.`,
              actor: 'Command Dispatcher',
              role: 'Admin',
              statusChangedTo: newStatus
            }
          ]
        };
        onUpdateIncident(updated);
      }
    });
    setSelectedIncidentIds([]);
  };

  const handleExportSelection = () => {
    const subset = incidents.filter((i) => selectedIncidentIds.includes(i.id));
    const toExport = subset.length > 0 ? subset : filtered;
    const csvData = exportIncidentsToCsv(toExport);
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CivicLens_Incidents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTimelineNote = (inc: Incident) => {
    if (!officerNote.trim()) return;
    const updated: Incident = {
      ...inc,
      timeline: [
        ...inc.timeline,
        {
          id: `t-note-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Officer Work-Log Added',
          description: officerNote,
          actor: inc.assignedOfficerName || 'Field Lead',
          role: 'Officer'
        }
      ]
    };
    onUpdateIncident(updated);
    setActiveModalIncident(updated);
    setOfficerNote('');
  };

  const handleAssignOfficer = (inc: Incident, officer: Officer) => {
    const updated: Incident = {
      ...inc,
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
      status: 'In Progress',
      timeline: [
        ...inc.timeline,
        {
          id: `t-assign-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `Assigned to ${officer.name}`,
          description: `Dispatched to officer mobile console. Location: ${officer.assignedWard}.`,
          actor: 'Command System',
          role: 'Admin',
          statusChangedTo: 'In Progress'
        }
      ]
    };
    onUpdateIncident(updated);
    setActiveModalIncident(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
              DISPATCH QUEUE
            </span>
            <span className="text-xs text-slate-400">Total Cases: {incidents.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Incident Lifecycle & Dispatch Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, bulk-triage, and inspect high-resolution civic telemetry.
          </p>
        </div>

        {/* Global Export Button */}
        <button
          onClick={handleExportSelection}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center space-x-2 shadow-lg transition"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export {selectedIncidentIds.length > 0 ? `Selected (${selectedIncidentIds.length})` : 'Filtered'} to CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, street, citizen, category..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending Triage</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Severity filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Department filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {Array.from(new Set(incidents.map((incident) => incident.department).filter(Boolean))).map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </div>

        </div>

        {/* Bulk Action Strip */}
        {selectedIncidentIds.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between text-xs animate-fade-in">
            <span className="text-cyan-300 font-bold">
              {selectedIncidentIds.length} Incident(s) Selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusChange('In Progress')}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkStatusChange('Resolved')}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setSelectedIncidentIds([])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Incident Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIncidentIds.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
                  />
                </th>
                <th className="p-3.5">Complaint ID & Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Ward & Address</th>
                <th className="p-3.5">Assigned Officer</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && <tr><td colSpan={8} className="p-12 text-center"><p className="text-sm font-semibold text-slate-200">No incidents found</p><p className="mt-1 text-xs text-slate-500">Reports matching your filters will appear here.</p></td></tr>}
              {filtered.slice(0, 30).map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-900/60 transition group cursor-pointer"
                  onClick={() => setActiveModalIncident(inc)}
                >
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIncidentIds.includes(inc.id)}
                      onChange={() => handleToggleSelect(inc.id)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
                    />
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={inc.imageUrl}
                        alt={inc.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-cyan-400">{inc.id}</span>
                          {inc.duplicateCount > 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {inc.duplicateCount} merged
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-white block truncate max-w-xs group-hover:text-cyan-300 transition">
                          {inc.title}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="text-slate-300 block">{inc.category}</span>
                    <span className="text-[10px] text-slate-500">{inc.department}</span>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      inc.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      inc.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                      inc.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400' :
                      inc.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.status}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-slate-300 block font-medium">{inc.ward}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[160px] block">{inc.address}</span>
                  </td>

                  <td className="p-3.5">
                    {inc.assignedOfficerName ? (
                      <span className="text-slate-200 font-medium flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>{inc.assignedOfficerName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveModalIncident(inc)}
                      className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold border border-blue-500/30 transition"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Deep-Dive Inspection Drawer / Modal */}
      {activeModalIncident && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl glass-panel-glow rounded-3xl border border-blue-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  {activeModalIncident.id}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {activeModalIncident.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalIncident(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Photo & Bounding boxes */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-800">
                  <img
                    src={activeModalIncident.imageUrl}
                    alt={activeModalIncident.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeModalIncident.detectedObjects.map((obj, i) => {
                    const [top, left, bottom, right] = obj.bbox;
                    return (
                      <div
                        key={i}
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          width: `${right - left}%`,
                          height: `${bottom - top}%`,
                        }}
                        className="absolute border-2 border-cyan-400 bg-cyan-500/10 rounded"
                      >
                        <span className="absolute -top-6 left-0 bg-slate-950/90 text-cyan-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500">
                          {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reporter:</span>
                    <strong className="text-white">{activeModalIncident.citizenName} ({activeModalIncident.citizenPhone})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ward & Area:</span>
                    <strong className="text-white">{activeModalIncident.ward}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <strong className="text-cyan-400 font-mono">{activeModalIncident.latitude.toFixed(4)}, {activeModalIncident.longitude.toFixed(4)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Estimate:</span>
                    <strong className="text-emerald-400 font-mono">{activeModalIncident.estimatedCost}</strong>
                  </div>
                </div>
              </div>

              {/* Lifecycle Timeline & Work Log */}
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider">
                  Incident Action Timeline
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {activeModalIncident.timeline.map((evt) => (
                    <div key={evt.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-cyan-400">{evt.title}</span>
                        <span className="text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{evt.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono block">By {evt.actor} ({evt.role})</span>
                    </div>
                  ))}
                </div>

                {/* Assign Officer Selector */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Dispatch to Field Officer:
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="officer-select-assign"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="">No officer records available</option>
                    </select>
                    <button
                      onClick={() => {
                        const sel = document.getElementById('officer-select-assign') as HTMLSelectElement;
                        if (!sel?.value) return;
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Add Note Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Log Officer Note or Repair Progress:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      placeholder="e.g. Patching crew en-route with asphalt roller..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddTimelineNote(activeModalIncident)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const updated: Incident = {
                    ...activeModalIncident,
                    status: 'Resolved',
                    timeline: [
                      ...activeModalIncident.timeline,
                      {
                        id: `t-res-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        title: 'Work Order Completed & Resolved',
                        description: 'Field inspection completed and verified with photographic proof.',
                        actor: 'Municipal Supervisor',
                        role: 'Admin',
                        statusChangedTo: 'Resolved'
                      }
                    ]
                  };
                  onUpdateIncident(updated);
                  setActiveModalIncident(updated);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Issue Resolved</span>
              </button>

              <button
                onClick={() => setActiveModalIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
