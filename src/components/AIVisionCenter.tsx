import React, { useState, useRef } from 'react';
import {
  Cpu,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Layers,
  Clock,
  DollarSign,
  Wrench,
  Building2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { runVisionScan, VisionScanResult } from '../services/aiService';

interface AIVisionCenterProps {
  onOpenReportModalWithData: (data: any) => void;
}

export const AIVisionCenter: React.FC<AIVisionCenterProps> = ({
  onOpenReportModalWithData
}) => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<VisionScanResult | null>(null);
  const [scanError, setScanError] = useState<string>('');

  const [showBoxes, setShowBoxes] = useState(true);
  const [hoveredBoxIdx, setHoveredBoxIdx] = useState<number | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'detection' | 'before-after'>('detection');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError('');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCurrentImage(base64);
      triggerScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerScan = async (imgData = currentImage) => {
    if (!imgData) return;
    setIsScanning(true);
    setScanError('');
    try {
      const result = await runVisionScan(imgData);
      setScanResult(result);
    } catch (e: unknown) {
      console.error('Scan error:', e);
      setScanError(e instanceof Error ? e.message : 'AI analysis is currently unavailable.');
      setScanResult(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateOfficialCase = () => {
    if (!scanResult) return;
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/30">
              AI Vision Assistant
            </span>
            <span className="text-xs text-slate-400">Configured AI service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">
            Computer Vision Analysis Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload a civic issue photo to receive an AI-assisted category and severity review before reporting it.
          </p>
        </div>

        {/* Upload action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center space-x-2 transition"
          >
            <Upload className="w-4 h-4" />
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

      {!currentImage && (
        <div className="civic-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-cyan-400 mx-auto flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              No photo selected
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Upload an image of a road defect, garbage accumulation, or lighting hazard to test autonomous AI classification.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            Select Photo from Device
          </button>
        </div>
      )}

      {scanError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{scanError}</span>
        </div>
      )}

      {/* Main Vision Stage & Telemetry Grid */}
      {currentImage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Viewport Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="civic-card p-4 space-y-3">

              {/* Viewport Control Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('detection')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      viewMode === 'detection' ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Detection Overlay
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
                    <span>Show Boxes</span>
                  </label>
                  <button
                    onClick={() => triggerScan()}
                    disabled={isScanning}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
                    title="Re-run AI Analysis"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Viewport Canvas Stage */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={currentImage}
                  alt="Inspection target"
                  className="w-full h-full object-cover"
                />

                {/* Laser Scan Animation Line */}
                {isScanning && (
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-scan z-20" />
                )}

                {/* Scanning Banner Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/50 shadow-2xl flex items-center space-x-3 text-cyan-300">
                      <Cpu className="w-5 h-5 animate-spin" />
                      <span className="text-xs font-mono font-bold tracking-wider">
                        ANALYZING DEFECT WITH AI...
                      </span>
                    </div>
                  </div>
                )}

                {/* Bounding Boxes Overlays */}
                {!isScanning && showBoxes && scanResult?.detectedObjects?.map((obj, idx) => {
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
                          ? 'border-cyan-300 bg-cyan-400/25 shadow-lg z-20'
                          : 'border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
                      }`}
                    >
                      <div className="absolute -top-6 left-0 bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1 border border-cyan-500 shadow whitespace-nowrap">
                        <span>{obj.label}</span>
                        <span className="text-white opacity-80">({(obj.confidence * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Info */}
              {scanResult && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    Detected Objects: <strong className="text-white">{scanResult.detectedObjects.length}</strong>
                  </span>
                  <span className="text-cyan-400 font-medium">
                    Analysis Completed
                  </span>
                </div>
              )}
            </div>

            {/* Detected Objects Entity Chips */}
            {scanResult && scanResult.detectedObjects.length > 0 && (
              <div className="civic-card p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detected Entities & Confidence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scanResult.detectedObjects.map((obj, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredBoxIdx(idx)}
                      onMouseLeave={() => setHoveredBoxIdx(null)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-xs ${
                        hoveredBoxIdx === idx
                          ? 'bg-blue-600/20 border-cyan-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="font-semibold text-white">{obj.label}</span>
                      </div>
                      <span className="font-mono font-bold text-cyan-400">
                        {(obj.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: AI Intelligence Triage & Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {scanResult ? (
              <div className="civic-card p-6 space-y-5 border-blue-500/30">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      CLASSIFICATION
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {scanResult.category}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    scanResult.severityLevel === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {scanResult.severityLevel} Severity
                  </span>
                </div>

                {/* Assigned Department */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Suggested Department</span>
                      <span className="text-xs font-bold text-white">{scanResult.department}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Description */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    AI Summary Note
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {scanResult.summary}
                  </p>
                </div>

                {/* Convert to Official Incident CTA */}
                <button
                  id="create-incident-from-vision-btn"
                  onClick={handleCreateOfficialCase}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
                >
                  <span>Submit as Civic Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="civic-card p-8 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <p className="font-semibold text-white">Ready for Analysis</p>
                <p>AI will analyze defect category and department routing once the scan runs.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
