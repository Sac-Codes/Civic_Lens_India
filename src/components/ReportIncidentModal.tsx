import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Upload, 
  Mic, 
  MicOff, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Cpu, 
  DollarSign, 
  Clock, 
  Send,
  Layers,
  ThumbsUp
} from 'lucide-react';
import { Incident, UserRole } from '../types';
import { PRESET_VISION_SAMPLES, INITIAL_WARDS, INITIAL_DEPARTMENTS } from '../data/mockData';
import { runVisionScan, VisionScanResult } from '../services/aiService';
import { findPotentialDuplicate } from '../services/storageService';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentCreated: (newIncident: Incident) => void;
  initialData?: Partial<Incident>;
  allExistingIncidents: Incident[];
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onIncidentCreated,
  initialData,
  allExistingIncidents
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Potholes & Road Cracks');
  const [department, setDepartment] = useState(initialData?.department || 'Roads & Infrastructure');
  const [ward, setWard] = useState(initialData?.ward || 'Ward 2 - Market Square');
  const [address, setAddress] = useState(initialData?.address || '742 Market St, Market Square');
  const [latitude, setLatitude] = useState(initialData?.latitude || 37.7812);
  const [longitude, setLongitude] = useState(initialData?.longitude || -122.4101);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || PRESET_VISION_SAMPLES[0].imageUrl);
  const [citizenName, setCitizenName] = useState('Alexandre Mercer');
  const [citizenPhone, setCitizenPhone] = useState('+1 (555) 782-9901');

  // AI & Media States
  const [isScanning, setIsScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<VisionScanResult | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordedText, setVoiceRecordedText] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<Incident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check duplicates when lat/lng or category changes
  useEffect(() => {
    const dup = findPotentialDuplicate(allExistingIncidents, latitude, longitude, category);
    setDuplicateWarning(dup);
  }, [latitude, longitude, category, allExistingIncidents]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      triggerAIScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerAIScan = async (img = imageUrl) => {
    setIsScanning(true);
    try {
      const res = await runVisionScan(img, category, description);
      setAiScanResult(res);
      setCategory(res.category);
      setDepartment(res.department);
      if (!title) {
        setTitle(`${res.category} at ${address}`);
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Voice recording simulation
  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        const transcript = 'Severe asphalt depression and broken pavement observed near intersection. Pedestrians having trouble crossing and high risk of motorcycle accident.';
        setVoiceRecordedText(transcript);
        setDescription((prev) => (prev ? `${prev} \n\n[Voice Note Transcribed]: ${transcript}` : transcript));
      }, 3500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleMergeDuplicate = () => {
    if (!duplicateWarning) return;
    
    // Upvote & confirm existing
    const updated: Incident = {
      ...duplicateWarning,
      duplicateCount: duplicateWarning.duplicateCount + 1,
      timeline: [
        ...duplicateWarning.timeline,
        {
          id: `t-merge-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Citizen Confirmation Added',
          description: `Citizen ${citizenName} confirmed active defect. Duplicate count increased to ${duplicateWarning.duplicateCount + 1}.`,
          actor: citizenName,
          role: 'Citizen'
        }
      ]
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onIncidentCreated(updated);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date().toISOString();
    const newInc: Incident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || `${category} - ${address}`,
      description: description || 'Reported civic issue via CivicLens intake platform.',
      category,
      department,
      severity: aiScanResult?.severityLevel || 'High',
      severityScore: aiScanResult?.severityScore || 82,
      priority: aiScanResult?.priorityLevel || 'High',
      priorityScore: aiScanResult?.priorityScore || 85,
      status: 'Assigned',
      latitude,
      longitude,
      address,
      ward,
      area: `${ward} Central`,
      imageUrl,
      aiConfidence: aiScanResult ? 0.96 : 0.92,
      detectedObjects: aiScanResult?.detectedObjects || [
        { label: category, confidence: 0.95, bbox: [20, 20, 80, 80], severity: 'High' }
      ],
      estimatedCost: aiScanResult?.estimatedCost || '$450 - $700',
      estimatedResolutionTime: aiScanResult?.estimatedResolutionTime || '12 Hours',
      recommendedMaterials: aiScanResult?.recommendedMaterials || ['Standard Municipal Material Set'],
      safetyRiskLevel: aiScanResult?.safetyRiskLevel || 'Standard municipal safety risk.',
      aiSummary: aiScanResult?.summary || 'AI successfully triaged and assigned to field division.',
      citizenId: `cit-${Math.floor(1000 + Math.random() * 9000)}`,
      citizenName,
      citizenPhone,
      createdAt: now,
      updatedAt: now,
      duplicateCount: 1,
      timeline: [
        {
          id: `t-init-${Date.now()}`,
          timestamp: now,
          title: 'Incident Submitted',
          description: `Citizen ${citizenName} logged incident with GPS and photo evidence.`,
          actor: citizenName,
          role: 'Citizen',
          statusChangedTo: 'Pending'
        },
        {
          id: `t-ai-${Date.now() + 1000}`,
          timestamp: now,
          title: 'AI Smart Triage & Assignment',
          description: `AI Vision classified as ${category} and routed to ${department}.`,
          actor: 'CivicLens AI',
          role: 'AI System',
          statusChangedTo: 'Assigned'
        }
      ]
    };

    setTimeout(() => {
      setIsSubmitting(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onIncidentCreated(newInc);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl glass-panel-glow rounded-3xl border border-blue-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Report Civic Hazard
              </h2>
              <p className="text-xs text-slate-400">
                AI Vision triage & automatic department assignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Alert Banner */}
        {duplicateWarning && (
          <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/50 text-xs text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start space-x-3">
              <Layers className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">
                  Potential Duplicate Detected ({duplicateWarning.id})
                </span>
                <span className="text-slate-300">
                  This issue has already been reported by <strong>{duplicateWarning.duplicateCount} citizens</strong> at {duplicateWarning.address}.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMergeDuplicate}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs whitespace-nowrap flex items-center space-x-1.5 shadow-md transition"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Confirm & Upvote</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Media Capture & AI Scan Visualizer */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  1. Image / Defect Photo
                </label>
                
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-800 group">
                  <img
                    src={imageUrl}
                    alt="Defect Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Scan overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-300">
                      <Cpu className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs font-mono font-bold">ANALYZING DEFECT WITH GEMINI...</span>
                    </div>
                  )}

                  {/* Laser scan line */}
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-laser-scan" />
                  )}

                  {/* Hover upload button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-lg flex items-center space-x-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFile}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Sample Benchmarks Quick Picker */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                  Or pick a test benchmark photo:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_VISION_SAMPLES.slice(0, 3).map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setImageUrl(sample.imageUrl);
                        setCategory(sample.category);
                        setDepartment(sample.department);
                      }}
                      className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-blue-500/50 text-[10px] text-slate-300 truncate"
                    >
                      {sample.category.split('&')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Note Recording Section */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Voice Note Transcription (UI-Ready)</span>
                  </span>
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                      isRecordingVoice
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isRecordingVoice ? (
                      <>
                        <MicOff className="w-3 h-3" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3" />
                        <span>Record Voice Note</span>
                      </>
                    )}
                  </button>
                </div>

                {isRecordingVoice && (
                  <div className="flex items-center justify-center space-x-1 py-2">
                    {[40, 70, 30, 90, 60, 80, 45, 95, 60, 30].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1 bg-cyan-400 rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {voiceRecordedText && (
                  <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 italic">
                    "{voiceRecordedText}"
                  </p>
                )}
              </div>
            </div>

            {/* Right: Metadata & Form Inputs */}
            <div className="space-y-4 text-xs">
              
              <div>
                <label className="text-slate-400 font-bold block mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Severe Asphalt Pothole near School Gate"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option>Potholes & Road Cracks</option>
                    <option>Garbage & Waste</option>
                    <option>Water Leakage & Drainage</option>
                    <option>Streetlight & Electrical</option>
                    <option>Fallen Tree & Hazard</option>
                    <option>Open Drain</option>
                    <option>Traffic Signal Damage</option>
                    <option>Construction Waste</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Assigned Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Ward</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_WARDS.map((w) => (
                      <option key={w.id} value={`Ward ${w.number} - ${w.name}`}>
                        Ward {w.number}: {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street or Landmark"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional context regarding traffic obstruction, size, or water leakage..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Citizen Name</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* AI Auto-Estimate Preview */}
              {aiScanResult && (
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Severity Score:</span>
                    <strong className="text-rose-400 ml-1 font-mono">{aiScanResult.severityScore}/100</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Budget:</span>
                    <strong className="text-emerald-400 ml-1 font-mono">{aiScanResult.estimatedCost}</strong>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Processing Dispatch...' : 'Submit Incident Report'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
