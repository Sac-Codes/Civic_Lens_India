import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CloudRain, 
  Trash2, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  Sliders,
  Calendar,
  Layers,
  Zap,
  Building2
} from 'lucide-react';
import { PREDICTIVE_HOTSPOTS } from '../data/mockData';

export const PredictiveInsights: React.FC = () => {
  const [forecastHorizon, setForecastHorizon] = useState<'7d' | '14d' | '30d'>('7d');
  const [selectedHotspot, setSelectedHotspot] = useState(PREDICTIVE_HOTSPOTS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              NEURAL FORECASTING ENGINE
            </span>
            <span className="text-xs text-slate-400">Proactive Cost Avoidance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            AI Predictive Urban Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Prevent civic hazards before citizen distress by simulating seasonal rainfall, traffic friction, and waste loads.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['7d', '14d', '30d'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition ${
                forecastHorizon === h ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {h} Window
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Hazard Projections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Monsoon Inundation */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CloudRain className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300">
              88% Peak Risk
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Monsoon Flood Siltation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Storm drains in Ward 4 & Ward 7 at 62% silt capacity. High tide forecast will trigger back-pressure flooding.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-300 font-medium">
            💡 <strong>Action:</strong> Stage 2 suction de-watering pumps at Marina Pier.
          </div>
        </div>

        {/* Card 2: Waste Overflow */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
              3.4x Weekend Load
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Commercial Garbage Overflow</h3>
            <p className="text-xs text-slate-400 mt-1">
              Market Square (Ward 2) food markets project 18 tons excess solid waste during festival weekend.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300 font-medium">
            💡 <strong>Action:</strong> Deploy 6 temporary 1100L smart compactors.
          </div>
        </div>

        {/* Card 3: Road Fatigue */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
              $82k Pre-empted
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Sub-Base Micro-Fissuring</h3>
            <p className="text-xs text-slate-400 mt-1">
              Heavy transit corridor on Route 9 showing micro-cracks before pothole cratering begins.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-emerald-300 font-medium">
            💡 <strong>Action:</strong> Overnight slurry micro-surfacing pass.
          </div>
        </div>

      </div>

      {/* Detailed Predictive Hotspots Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              AI Preventive Maintenance Hotspots
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized by risk probability, cost-avoidance yield, and municipal asset impact.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400">{PREDICTIVE_HOTSPOTS.length} ACTIVE MODELS</span>
        </div>

        <div className="space-y-4">
          {PREDICTIVE_HOTSPOTS.map((hotspot) => (
            <div
              key={hotspot.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    {hotspot.id}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {hotspot.hazardType}
                  </h4>
                  <span className="text-xs text-slate-400">• {hotspot.ward}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    Risk Probability: {hotspot.riskProbability}%
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {hotspot.predictedImpact}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recommended Preventive Work Order:</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{hotspot.recommendedPreventativeAction}</p>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                    Estimated Net Municipal Savings: {hotspot.estimatedSavings}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
