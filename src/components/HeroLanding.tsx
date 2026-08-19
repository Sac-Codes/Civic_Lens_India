import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  MapPin, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Activity, 
  Eye, 
  Layers, 
  Zap, 
  AlertTriangle,
  FileSpreadsheet,
  Users,
  Compass,
  Play
} from 'lucide-react';
import { CityAnalytics, Incident } from '../types';
import { Language, translations } from '../data/translations';

interface HeroLandingProps {
  analytics: CityAnalytics;
  recentIncidents: Incident[];
  onNavigate: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenVisionCenter: () => void;
  language: Language;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  analytics,
  recentIncidents,
  onNavigate,
  onOpenReportModal,
  onOpenVisionCenter,
  language
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Futuristic Background Glows & Radar Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/20 via-cyan-500/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/15 blur-3xl rounded-full" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-cyan-600/15 blur-3xl rounded-full" />
          
          {/* Subtle Grid Lines */}
          <div className="w-full h-full opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-300 mb-8 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-medium tracking-wide">CivicLens AI Operating System v2.6</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Smart City Command & CV Triage</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight font-heading">
            Transforming Citizen Complaints into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Smart City Intelligence
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            The next-generation municipal platform bridging citizens, autonomous AI Computer Vision, and smart command centers for instantaneous civic hazard resolution.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-report-btn"
              onClick={onOpenReportModal}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Civic Defect</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-vision-btn"
              onClick={onOpenVisionCenter}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-100 font-semibold text-sm shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Launch AI Vision Center</span>
            </button>

            <button
              id="hero-heatmap-btn"
              onClick={() => onNavigate('heatmap')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm flex items-center space-x-2 transition"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Live GIS Heatmap</span>
            </button>
          </div>

          {/* Live Telemetry Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-left">
            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">City Health Score</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white metric-number">
                  {analytics.cityHealthScore ?? '—'}
                </span>
                <span className="text-xs font-semibold text-emerald-400">/ 100</span>
              </div>
              <p className="text-[10px] text-emerald-400/90 mt-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Optimal Status
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">AI Accuracy</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 metric-number">
                  {analytics.aiTriageAccuracy === null ? '—' : `${analytics.aiTriageAccuracy}%`}
                </span>
              </div>
                <p className="text-[10px] text-slate-400 mt-1">AI-assisted review</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Resolution</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white metric-number">
                  {analytics.avgResponseTimeHours ?? '—'}
                </span>
                <span className="text-xs font-semibold text-slate-400">{analytics.avgResponseTimeHours === null ? '' : 'Hours'}</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Based on resolved reports
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Incidents</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white metric-number">
                  {analytics.totalComplaints}
                </span>
              </div>
                <p className="text-[10px] text-slate-400 mt-1">Available to your account</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Resolved Cases</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 metric-number">
                  {analytics.resolvedComplaints}
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Based on submitted reports
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Duplicates Prevented</p>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 metric-number">
                  {analytics.duplicateComplaintsPrevented}
                </span>
              </div>
                <p className="text-[10px] text-purple-300 mt-1">Derived from duplicate reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Process Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Autonomous Urban Incident Lifecycle
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            How CivicLens AI transforms raw smartphone uploads into verified civic repairs in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {[
            { step: '01', title: 'Citizen Intake', desc: 'Add a description, photo, and location for the issue.', icon: ShieldAlert, color: 'from-blue-500 to-indigo-500' },
            { step: '02', title: 'AI Neural Scan', desc: 'Bounding box defect extraction, object counting & confidence scoring.', icon: Cpu, color: 'from-cyan-500 to-blue-500' },
            { step: '03', title: 'Duplicate Triage', desc: 'Spatial cluster matching merges repetitive complaints instantly.', icon: Layers, color: 'from-purple-500 to-pink-500' },
            { step: '04', title: 'Smart Dispatch', desc: 'Automated assignment to nearest ward officer with materials estimation.', icon: Users, color: 'from-amber-500 to-orange-500' },
            { step: '05', title: 'Field Execution', desc: 'Officer completes on-site repair with route tracking & materials log.', icon: Zap, color: 'from-emerald-500 to-teal-500' },
            { step: '06', title: 'Proof & Audit', desc: 'AI verifies Before/After repair photos and notifies citizen.', icon: CheckCircle2, color: 'from-green-500 to-emerald-600' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative glass-panel p-5 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition group hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Step {item.step}
                </span>
                <h3 className="text-base font-semibold text-white mt-1 group-hover:text-cyan-300 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Enterprise Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">
              Smart City Operating Modules
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md mt-2 md:mt-0">
            Engineered for Municipal Corporations, Smart City Command Centers, and Active Citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={onOpenVisionCenter}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-blue-500/20 transition">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
              <span>Computer Vision Studio</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Upload a civic issue photo for AI-assisted classification and severity review before submitting a report.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Review before submission</span>
              <span className="text-cyan-400 font-semibold">Open AI review →</span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('heatmap')}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-blue-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition flex items-center justify-between">
              <span>GIS Heatmap & Ward Boundaries</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              View incident locations available to your account on an interactive map.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Live incident records</span>
              <span className="text-indigo-400 font-semibold">Explore Map →</span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-emerald-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition flex items-center justify-between">
              <span>Urban Intelligence Dashboard</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Review report counts, open work, resolved cases, and category distribution from live records.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Live account scope</span>
              <span className="text-emerald-400 font-semibold">View Analytics →</span>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('predictive')}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-purple-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/20 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition flex items-center justify-between">
              <span>AI Predictive Forecasting</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Predicts monsoon flood choke points, weekend garbage accumulation hotspots, and road fatigue before hazards disrupt citizens.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Historical data required</span>
              <span className="text-purple-400 font-semibold">View availability →</span>
            </div>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => onNavigate('command')}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-rose-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-rose-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:bg-rose-500/20 transition">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition flex items-center justify-between">
              <span>City Command Center (Admin)</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Executive command room with real-time ward telemetry, emergency SOS broadcaster, officer dispatch modal, and tamper-evident audit logs.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Authorized access</span>
              <span className="text-rose-400 font-semibold">Open Command →</span>
            </div>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => onNavigate('reports')}
            className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-amber-400/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition flex items-center justify-between">
              <span>CSV Data & Printable Reports</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Full two-way CSV import/export capabilities, bulk incident batch processing, and formatted Executive PDF/Print reports.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Live report records</span>
              <span className="text-amber-400 font-semibold">Manage Data →</span>
            </div>
          </div>

        </div>
      </section>

      {/* Live Recent Incidents Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-base font-bold text-white font-heading">
                Live City Incident Ticker
              </h3>
            </div>
            <button
              onClick={() => onNavigate('incidents')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>View available incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentIncidents.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">No incidents reported yet.</div>}
            {recentIncidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                onClick={() => onNavigate('incidents')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition flex items-start space-x-3 group"
              >
                <img
                  src={inc.imageUrl}
                  alt={inc.title}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">{inc.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      inc.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      inc.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-1 group-hover:text-cyan-300 transition">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{inc.address}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{inc.ward}</span>
                    <span className="text-purple-400 font-medium">{inc.duplicateCount} citizen reports</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
