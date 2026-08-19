import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  Activity, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Department, Incident } from '../types';
import { INITIAL_DEPARTMENTS, INITIAL_OFFICERS } from '../data/mockData';

interface DepartmentCenterProps {
  incidents: Incident[];
  onSelectDepartmentIncidents?: (deptName: string) => void;
}

export const DepartmentCenter: React.FC<DepartmentCenterProps> = ({
  incidents,
  onSelectDepartmentIncidents
}) => {
  const [selectedDept, setSelectedDept] = useState<Department>(INITIAL_DEPARTMENTS[0]);

  const deptOfficers = INITIAL_OFFICERS.filter((o) => o.department === selectedDept.name);
  const deptIncidents = incidents.filter((i) => i.department === selectedDept.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
              MUNICIPAL DIVISIONS
            </span>
            <span className="text-xs text-slate-400">8 Integrated Departments</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Department Performance Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Workforce capacity, resolution velocity, and SLA adherence across city agencies.
          </p>
        </div>
      </div>

      {/* 8 Department Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {INITIAL_DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center group ${
              selectedDept.id === dept.id
                ? 'bg-blue-600/25 border-cyan-400 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white leading-tight truncate w-full">
              {dept.name.split('&')[0]}
            </span>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">
              {dept.slaComplianceRate}% SLA
            </span>
          </button>
        ))}
      </div>

      {/* Selected Department Focus View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Department Telemetry & SLA Metrics (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                DIVISION OVERVIEW
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {selectedDept.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Director: <strong className="text-slate-200">{selectedDept.head}</strong> • SLA Target: {selectedDept.slaComplianceRate}%
              </p>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Compliance: {selectedDept.slaComplianceRate}%
            </span>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Allocated Budget</span>
              <span className="text-lg font-bold text-white font-mono mt-1 block">
                {selectedDept.allocatedBudget}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Avg Resolution Speed</span>
              <span className="text-lg font-bold text-cyan-400 font-mono mt-1 block">
                {selectedDept.avgResolutionTimeHours} Hours
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Active Officers</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">
                {selectedDept.activePersonnel} On Duty
              </span>
            </div>
          </div>

          {/* Active Cases for this Dept */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Current Pending Incidents ({deptIncidents.length})
              </h3>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {deptIncidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="font-mono text-cyan-400 font-bold">{inc.id}</span>
                    <span className="text-white truncate font-medium">{inc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{inc.ward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Assigned Officers Roster (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Assigned Field Force</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{deptOfficers.length} Officers</span>
          </div>

          <div className="space-y-3">
            {deptOfficers.map((off) => (
              <div
                key={off.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{off.name}</span>
                  <span className="text-[11px] text-slate-400">{off.role} • Ward: {off.assignedWard}</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{off.phone}</span>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Rating: {off.performanceScore}%
                  </span>
                  <span className="block text-[10px] text-cyan-400 mt-1">
                    {off.activeAssignedCases} Active Orders
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
