import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, Layers } from 'lucide-react';
import { CityAnalytics, Incident } from '../types';

interface UrbanIntelligenceDashboardProps {
  analytics: CityAnalytics;
  incidents: Incident[];
}

export const UrbanIntelligenceDashboard: React.FC<UrbanIntelligenceDashboardProps> = ({ analytics, incidents }) => {
  const categories = Object.entries(incidents.reduce<Record<string, number>>((counts, incident) => {
    counts[incident.category] = (counts[incident.category] || 0) + 1;
    return counts;
  }, {})).sort(([, first], [, second]) => second - first);

  const cards = [
    { label: 'Total reports', value: analytics.totalComplaints, icon: Activity },
    { label: 'Open reports', value: analytics.activeComplaints, icon: AlertTriangle },
    { label: 'Resolved reports', value: analytics.resolvedComplaints, icon: CheckCircle2 },
    { label: 'Average resolution', value: analytics.avgResponseTimeHours === null ? '—' : `${analytics.avgResponseTimeHours.toFixed(1)}h`, icon: Clock },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-800 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Operations overview</p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-white">Incident analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Metrics are calculated from the incidents available to your account.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-panel rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between text-xs text-slate-400"><span>{label}</span><Icon className="h-4 w-4 text-cyan-400" /></div>
            <p className="mt-3 font-mono text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      <section className="glass-panel rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4"><Layers className="h-4 w-4 text-cyan-400" /><h2 className="font-heading text-base font-bold text-white">Reports by category</h2></div>
        {categories.length === 0 ? <div className="py-12 text-center text-sm text-slate-500">No incident data is available yet.</div> : <div className="mt-5 space-y-4">{categories.map(([category, count]) => <div key={category}><div className="flex justify-between text-xs"><span className="text-slate-300">{category}</span><span className="font-mono text-slate-400">{count}</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${(count / incidents.length) * 100}%` }} /></div></div>)}</div>}
      </section>
    </div>
  );
};
