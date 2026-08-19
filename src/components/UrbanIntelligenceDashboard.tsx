import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  Building2
} from 'lucide-react';
import { CityAnalytics, Incident, Department, Ward } from '../types';
import { INITIAL_DEPARTMENTS, INITIAL_WARDS } from '../data/mockData';

interface UrbanIntelligenceDashboardProps {
  analytics: CityAnalytics;
  incidents: Incident[];
  onSelectDepartment?: (dept: Department) => void;
  onSelectWard?: (ward: Ward) => void;
}

export const UrbanIntelligenceDashboard: React.FC<UrbanIntelligenceDashboardProps> = ({
  analytics,
  incidents
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'ytd'>('7d');

  // Category counts
  const categoryMap: Record<string, number> = {};
  incidents.forEach((inc) => {
    categoryMap[inc.category] = (categoryMap[inc.category] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Hourly Flux data (24-hour simulation)
  const hourlyFlux = [
    { hour: '00:00', count: 12, resolved: 8 },
    { hour: '04:00', count: 6, resolved: 5 },
    { hour: '08:00', count: 48, resolved: 32 },
    { hour: '12:00', count: 62, resolved: 54 },
    { hour: '16:00', count: 74, resolved: 68 },
    { hour: '20:00', count: 35, resolved: 29 },
    { hour: '23:59', count: 18, resolved: 16 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              OPERATIONAL METRICS
            </span>
            <span className="text-xs text-slate-400">Live Municipal Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Urban Intelligence & SLA Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time municipal performance, department velocity, and civic resolution telemetry.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['24h', '7d', '30d', 'ytd'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition ${
                timeRange === range ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>City Health Score</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white metric-number">
              {analytics.cityHealthScore}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Optimal status across 12 wards</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Triage Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-400 metric-number">
              {analytics.aiTriageAccuracy}%
            </span>
            <span className="text-xs font-bold text-cyan-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +1.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">YOLOv11 & Gemini Multimodal</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Resolution Speed</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white metric-number">
              {analytics.avgResponseTimeHours}h
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -38% time
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">SLA Benchmark: 24.0h</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Duplicates Prevented</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-purple-400 metric-number">
              {analytics.duplicateComplaintsPrevented}
            </span>
            <span className="text-xs font-bold text-purple-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 388 merged
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saved {analytics.estimatedBudgetSaved} in trips</p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: 24-Hour Incident Inflow vs Resolution Curve (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Incident Inflow vs. Field Resolution Velocity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly throughput across all metropolitan dispatch centers.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-1.5" /> Reported
              </span>
              <span className="flex items-center text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" /> Resolved
              </span>
            </div>
          </div>

          {/* SVG Line & Area Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="gradReported" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              {[40, 80, 120, 160].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="700" y2={y} stroke="#1e293b" strokeDasharray="4 4" />
              ))}

              {/* Area & Line for Reported */}
              <path
                d="M 0 170 Q 116 185 233 80 T 466 30 T 700 155 L 700 200 L 0 200 Z"
                fill="url(#gradReported)"
              />
              <path
                d="M 0 170 Q 116 185 233 80 T 466 30 T 700 155"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
              />

              {/* Area & Line for Resolved */}
              <path
                d="M 0 180 Q 116 190 233 110 T 466 50 T 700 160 L 700 200 L 0 200 Z"
                fill="url(#gradResolved)"
              />
              <path
                d="M 0 180 Q 116 190 233 110 T 466 50 T 700 160"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />

              {/* Chart Nodes */}
              {[
                { x: 0, y: 170 },
                { x: 116, y: 185 },
                { x: 233, y: 80 },
                { x: 350, y: 55 },
                { x: 466, y: 30 },
                { x: 583, y: 110 },
                { x: 700, y: 155 }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              {hourlyFlux.map((h, i) => (
                <span key={i}>{h.hour}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Peak Load Inflow</span>
              <strong className="text-white block text-sm mt-0.5">74 Reports / hr</strong>
            </div>
            <div>
              <span className="text-slate-400">Resolution Velocity</span>
              <strong className="text-emerald-400 block text-sm mt-0.5">68 Fixes / hr</strong>
            </div>
            <div>
              <span className="text-slate-400">Backlog Clearance</span>
              <strong className="text-cyan-400 block text-sm mt-0.5">91.8% in &lt; 24h</strong>
            </div>
          </div>
        </div>

        {/* Right: Category Breakdown Donut / Progress Bar List (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">
              Category Distribution
            </h3>
            <span className="text-xs text-slate-500 font-mono">100% Normalized</span>
          </div>

          <div className="space-y-3.5">
            {sortedCategories.slice(0, 6).map(([cat, count], idx) => {
              const pct = ((count / incidents.length) * 100).toFixed(0);
              const colors = ['bg-blue-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500'];
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">{cat}</span>
                    <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Municipal Focus:</span>
            <strong className="text-cyan-300">Potholes & Drainage</strong>
          </div>
        </div>

      </div>

      {/* Department SLA & Performance Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Department Performance & SLA Adherence
            </h3>
            <p className="text-xs text-slate-400">
              Live efficiency benchmarks and active personnel capacity per division.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">8 Municipal Divisions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                  {dept.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {dept.slaComplianceRate}% SLA
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Avg Resolution:</span>
                  <strong className="text-slate-200">{dept.avgResolutionTimeHours} Hours</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Officers:</span>
                  <strong className="text-slate-200">{dept.activePersonnel} On Duty</strong>
                </div>
                <div className="flex justify-between">
                  <span>Resolved:</span>
                  <strong className="text-emerald-400">{dept.resolvedIncidents} cases</strong>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Budget: {dept.allocatedBudget}</span>
                <span className="text-cyan-400 font-semibold">{dept.pendingIncidents} In Queue</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
