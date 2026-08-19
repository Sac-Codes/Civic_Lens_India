import React, { useState, useRef } from 'react';
import { 
  Cpu, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Layers, 
  Zap, 
  Clock, 
  DollarSign, 
  Wrench, 
  Building2, 
  RefreshCw, 
  Sliders,
  Maximize2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { PRESET_VISION_SAMPLES } from '../data/mockData';
import { runVisionScan, VisionScanResult } from '../services/aiService';
import { Incident } from '../types';

interface AIVisionCenterProps {
  onIncidentCreatedFromVision: (incidentData: Partial<Incident>) => void;
  onOpenReportModalWithData: (data: any) => void;
}

export const AIVisionCenter: React.FC<AIVisionCenterProps> = ({
  onIncidentCreatedFromVision,
  onOpenReportModalWithData
}) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_VISION_SAMPLES[0]);
  const [currentImage, setCurrentImage] = useState<string>(PRESET_VISION_SAMPLES[0].imageUrl);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<VisionScanResult>({
    detectedObjects: PRESET_VISION_SAMPLES[0].detectedObjects,
    category: PRESET_VISION_SAMPLES[0].category,
    department: PRESET_VISION_SAMPLES[0].department,
    severityScore: PRESET_VISION_SAMPLES[0].severityScore,
    severityLevel: 'Critical',
    priorityScore: PRESET_VISION_SAMPLES[0].priorityScore,
    priorityLevel: 'Immediate Action',
    estimatedCost: PRESET_VISION_SAMPLES[0].estimatedCost,
    estimatedResolutionTime: PRESET_VISION_SAMPLES[0].estimatedResolutionTime,
    recommendedMaterials: PRESET_VISION_SAMPLES[0].recommendedMaterials,
    safetyRiskLevel: PRESET_VISION_SAMPLES[0].safetyRisk,
    summary: PRESET_VISION_SAMPLES[0].description
  });

  const [activeModel, setActiveModel] = useState<'gemini-3.7' | 'yolov11-urban'>('gemini-3.7');
  const [showBoxes, setShowBoxes] = useState(true);
  const [hoveredBoxIdx, setHoveredBoxIdx] = useState<number | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'detection' | 'before-after'>('detection');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (sample: typeof PRESET_VISION_SAMPLES[0]) => {
    setSelectedPreset(sample);
    setCurrentImage(sample.imageUrl);
    setIsCustomImage(false);
    setScanResult({
      detectedObjects: sample.detectedObjects,
      category: sample.category,
      department: sample.department,
      severityScore: sample.severityScore,
      severityLevel: sample.severityScore > 85 ? 'Critical' : 'High',
      priorityScore: sample.priorityScore,
      priorityLevel: sample.priorityScore > 90 ? 'Immediate Action' : 'High',
      estimatedCost: sample.estimatedCost,
      estimatedResolutionTime: sample.estimatedResolutionTime,
      recommendedMaterials: sample.recommendedMaterials,
      safetyRiskLevel: sample.safetyRisk,
      summary: sample.description
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCurrentImage(base64);
      setIsCustomImage(true);
      triggerScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerScan = async (imgData = currentImage) => {
    setIsScanning(true);
    try {
      const result = await runVisionScan(imgData, selectedPreset.category);
      setScanResult(result);
    } catch (e) {
      console.error('Scan error', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateOfficialCase = () => {
    onOpenReportModalWithData({
      imageUrl: currentImage,
      category: scanResult.category,
      department: scanResult.department,
      severity: scanResult.severityLevel,
      severityScore: scanResult.severityScore,
      priority: scanResult.priorityLevel,
      priorityScore: scanResult.priorityScore,
      estimatedCost: scanResult.estimatedCost,
      estimatedResolutionTime: scanResult.estimatedResolutionTime,
      detectedObjects: scanResult.detectedObjects,
      description: scanResult.summary
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              ENGINE v2.6
            </span>
            <span className="text-xs text-slate-400">Sub-second Multimodal Inference</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            AI Computer Vision Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time urban defect recognition, bounding box localization, and severity index estimation.
          </p>
        </div>

        {/* Model Selector & Action Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveModel('gemini-3.7')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeModel === 'gemini-3.7'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.7 Flash</span>
            </button>
            <button
              onClick={() => setActiveModel('yolov11-urban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeModel === 'yolov11-urban'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>YOLOv11-Urban</span>
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Preset Test Suite Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Municipal Hazard Benchmark:
          </span>
          <span className="text-xs text-slate-500">6 Pre-calibrated Urban Scenarios</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_VISION_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectPreset(sample)}
              className={`p-2 rounded-xl border text-left transition flex flex-col items-center group ${
                selectedPreset.id === sample.id && !isCustomImage
                  ? 'bg-blue-600/20 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={sample.imageUrl}
                alt={sample.title}
                className="w-full h-16 object-cover rounded-lg mb-2 group-hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] font-semibold text-slate-200 text-center truncate w-full">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Vision Stage & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Viewport Stage with Scanning Line & Bounding Boxes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
            
            {/* Viewport Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('detection')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    viewMode === 'detection' ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Detection Overlay
                </button>
                <button
                  onClick={() => setViewMode('before-after')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    viewMode === 'before-after' ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Before / After Comparison
                </button>
              </div>

              <div className="flex items-center space-x-3 text-slate-400">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBoxes}
                    onChange={(e) => setShowBoxes(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
                  />
                  <span>Show Bounding Boxes</span>
                </label>
                <button
                  onClick={() => triggerScan()}
                  disabled={isScanning}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
                  title="Re-run AI Inference"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Viewport Canvas Stage */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              
              {viewMode === 'detection' ? (
                <>
                  <img
                    src={currentImage}
                    alt="Inspection target"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Laser Scan Animation Line */}
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-scan z-20" />
                  )}

                  {/* Scanning Banner Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                      <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/50 shadow-2xl flex items-center space-x-3 text-cyan-300">
                        <Cpu className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-mono font-bold tracking-wider">
                          RUNNING NEURAL VISION INFERENCE...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bounding Boxes Overlays */}
                  {!isScanning && showBoxes && scanResult.detectedObjects.map((obj, idx) => {
                    const [top, left, bottom, right] = obj.bbox;
                    const isHovered = hoveredBoxIdx === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredBoxIdx(idx)}
                        onMouseLeave={() => setHoveredBoxIdx(null)}
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          width: `${right - left}%`,
                          height: `${bottom - top}%`,
                        }}
                        className={`absolute border-2 rounded transition-all duration-200 cursor-pointer ${
                          isHovered
                            ? 'border-cyan-300 bg-cyan-400/25 shadow-[0_0_20px_rgba(6,182,212,0.6)] z-20'
                            : 'border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
                        }`}
                      >
                        <div className="absolute -top-7 left-0 bg-[#090d16]/95 border border-cyan-400 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1 shadow-lg whitespace-nowrap">
                          <span>{obj.label}</span>
                          <span className="text-white opacity-80">({(obj.confidence * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                /* Before / After Comparison Split View */
                <div className="relative w-full h-full select-none">
                  {/* Resolved After Image */}
                  <img
                    src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80"
                    alt="After repair"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 right-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded text-xs font-bold">
                    AFTER: Resolved & Verified
                  </div>

                  {/* Defect Before Image (Clipped by slider) */}
                  <div
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={currentImage}
                      alt="Before defect"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 px-2.5 py-1 rounded text-xs font-bold">
                      BEFORE: Citizen Upload
                    </div>
                  </div>

                  {/* Slider Control Line */}
                  <div
                    style={{ left: `${sliderPosition}%` }}
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] cursor-ew-resize flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white">
                      ⇄
                    </div>
                  </div>

                  {/* Invisible Range Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                  />
                </div>
              )}

            </div>

            {/* Bottom Legend */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                Detected Entities: <strong className="text-white">{scanResult.detectedObjects.length} Objects</strong>
              </span>
              <span className="text-slate-400">
                Inference Latency: <strong className="text-cyan-400 font-mono">142ms</strong>
              </span>
            </div>
          </div>

          {/* Detected Objects Entity Chips */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Detected Feature Vector Log
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scanResult.detectedObjects.map((obj, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBoxIdx(idx)}
                  onMouseLeave={() => setHoveredBoxIdx(null)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    hoveredBoxIdx === idx
                      ? 'bg-blue-600/20 border-cyan-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-semibold text-white">{obj.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {(obj.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Intelligence Triage & Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Smart Triage Card */}
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  AUTONOMOUS CLASSIFICATION
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {scanResult.category}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                scanResult.severityLevel === 'Critical'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {scanResult.severityLevel} Severity
              </span>
            </div>

            {/* Severity & Priority Gauges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Severity Score</span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold text-rose-400 metric-number">
                    {scanResult.severityScore}
                  </span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    style={{ width: `${scanResult.severityScore}%` }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Priority Level</span>
                <span className="text-sm font-bold text-amber-400 block mt-1">
                  {scanResult.priorityLevel}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Score: {scanResult.priorityScore} / 100
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    style={{ width: `${scanResult.priorityScore}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Assigned Department */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Auto-Assigned Department</span>
                  <span className="text-xs font-bold text-white">{scanResult.department}</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono font-semibold">
                SLA: 24h
              </span>
            </div>

            {/* Cost & Resolution Estimates */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Budget</span>
                </div>
                <span className="font-bold text-white font-mono">{scanResult.estimatedCost}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resolution SLA</span>
                </div>
                <span className="font-bold text-white font-mono">{scanResult.estimatedResolutionTime}</span>
              </div>
            </div>

            {/* Materials & Action Steps */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Recommended Materials & Work Order:
              </span>
              <ul className="space-y-1.5">
                {scanResult.recommendedMaterials.map((mat, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Risk Alert */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span><strong>Safety Alert:</strong> {scanResult.safetyRiskLevel}</span>
            </div>

            {/* Convert to Official Incident CTA */}
            <button
              id="create-incident-from-vision-btn"
              onClick={handleCreateOfficialCase}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition transform active:scale-98"
            >
              <span>Dispatch & Log Official Municipal Incident</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
