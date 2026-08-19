import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Incident } from '../types';

interface DepartmentCenterProps { incidents: Incident[]; onSelectDepartmentIncidents?: (deptName: string) => void; }

export const DepartmentCenter: React.FC<DepartmentCenterProps> = ({ incidents, onSelectDepartmentIncidents }) => {
  const departments = Object.entries(incidents.reduce<Record<string, number>>((counts, incident) => {
    if (incident.department) counts[incident.department] = (counts[incident.department] || 0) + 1;
    return counts;
  }, {})).sort(([, first], [, second]) => second - first);

  return <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <header className="border-b border-slate-800 pb-6"><p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Department activity</p><h1 className="mt-1 font-heading text-3xl font-extrabold text-white">Department workspace</h1><p className="mt-1 text-sm text-slate-400">Live activity is based on incidents assigned to your account.</p></header>
    {departments.length === 0 ? <section className="glass-panel rounded-2xl border border-dashed border-slate-700 p-12 text-center"><Building2 className="mx-auto h-8 w-8 text-slate-600" /><h2 className="mt-4 text-base font-semibold text-slate-200">No department activity yet</h2><p className="mt-1 text-sm text-slate-500">Live performance metrics will appear as incidents are processed.</p></section> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{departments.map(([name, count]) => <button type="button" key={name} onClick={() => onSelectDepartmentIncidents?.(name)} className="glass-panel rounded-2xl border border-slate-800 p-5 text-left transition hover:border-cyan-500/40"><div className="flex items-center justify-between"><span className="font-semibold text-white">{name}</span><Building2 className="h-4 w-4 text-cyan-400" /></div><p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Users className="h-3.5 w-3.5" />{count} incident{count === 1 ? '' : 's'} in scope</p></button>)}</div>}
  </div>;
};
