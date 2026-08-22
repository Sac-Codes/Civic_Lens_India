import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileText,
  Cpu,
  Send,
  Layers,
  ThumbsUp,
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Incident } from '../types';
import { runVisionScan, VisionScanResult } from '../services/aiService';
import { findPotentialDuplicate } from '../services/storageService';
import { uploadIncidentImage } from '../services/firebase/media';
import { createIncident } from '../services/firebase/incidents';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentCreated: (newIncident: Incident) => void;
  initialData?: Partial<Incident>;
  allExistingIncidents: Incident[];
  reporter: { id: string; name: string; phone?: string };
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onIncidentCreated,
  initialData,
  allExistingIncidents,
  reporter
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Potholes & Road Cracks');
  const [department, setDepartment] = useState(initialData?.department || 'Roads & Infrastructure');
  const [ward, setWard] = useState(initialData?.ward || 'Central Ward');
  const [address, setAddress] = useState(initialData?.address || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || 12.9716);
  const [longitude, setLongitude] = useState(initialData?.longitude || 77.5946);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [citizenName] = useState(reporter.name);

  // AI & Media States
  const [isScanning, setIsScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<VisionScanResult | null>(null);
  const [aiError, setAiError] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<Incident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check duplicates when lat/lng or category changes
  useEffect(() => {
    const dup = findPotentialDuplicate(allExistingIncidents, latitude, longitude, category);
    setDuplicateWarning(dup);
  }, [latitude, longitude, category, allExistingIncidents]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitError('');
    setAiError('');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      triggerAIScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerAIScan = async (img = imageUrl) => {
    if (!img) return;
    setIsScanning(true);
    setAiError('');
    try {
      const res = await runVisionScan(img, category, description);
      setAiScanResult(res);
      if (res.category) setCategory(res.category);
      if (res.department) setDepartment(res.department);
      if (!title && res.summary) {
        setTitle(`${res.category} reported`);
      }
    } catch (e: unknown) {
      console.error('Scan error:', e);
      setAiError(e instanceof Error ? e.message : 'AI analysis is currently unavailable.');
      setAiScanResult(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleMergeDuplicate = () => {
    if (!duplicateWarning) return;

    const updated: Incident = {
      ...duplicateWarning,
      duplicateCount: duplicateWarning.duplicateCount + 1,
      timeline: [
        ...duplicateWarning.timeline,
        {
          id: `t-merge-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Citizen Confirmation Added',
          description: `Citizen ${citizenName} confirmed active defect. Duplicate count updated to ${duplicateWarning.duplicateCount + 1}.`,
          actor: citizenName,
          role: 'Citizen'
        }
      ]
    };

    onIncidentCreated(updated);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setSubmitError('Please enter a location or street address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const now = new Date().toISOString();
      const incidentId = `INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      let storedImageUrl = imageUrl;
      if (imageUrl.startsWith('data:image/')) {
        try {
          storedImageUrl = await uploadIncidentImage(incidentId, imageUrl, reporter.id);
        } catch (uploadErr) {
          console.warn('Storage upload notice, keeping base64:', uploadErr);
        }
      }

      // Build the incident payload
      const incidentPayload: Partial<Incident> = {
        id: incidentId,
        title: title.trim() || `${category} - ${address.trim()}`,
        description: description.trim() || `Reported civic hazard at ${address.trim()}.`,
        category,
        department,
        severity: aiScanResult?.severityLevel || 'Medium',
        severityScore: aiScanResult?.severityScore || 50,
        priority: aiScanResult?.priorityLevel || 'Normal',
        priorityScore: aiScanResult?.priorityScore || 50,
        status: 'Pending',
        latitude,
        longitude,
        address: address.trim(),
        ward: ward.trim() || 'Central Ward',
        area: `${ward.trim() || 'Central'} Sector`,
        imageUrl: storedImageUrl,
        aiConfidence: aiScanResult?.detectedObjects?.[0]?.confidence ?? 0,
        detectedObjects: aiScanResult?.detectedObjects ?? [],
        estimatedCost: aiScanResult?.estimatedCost || 'To be assessed by department',
        estimatedResolutionTime: aiScanResult?.estimatedResolutionTime || 'Standard SLA (24-72 hrs)',
        recommendedMaterials: aiScanResult?.recommendedMaterials || [],
        safetyRiskLevel: aiScanResult?.safetyRiskLevel || 'Standard',
        aiSummary: aiScanResult?.summary || (aiError ? 'Manual citizen submission' : 'Awaiting triage'),
        citizenName,
        createdAt: now,
        duplicateCount: 1,
        timeline: [
          {
            id: `t-init-${Date.now()}`,
            timestamp: now,
            title: 'Incident Submitted',
            description: `Citizen ${citizenName} logged incident report.`,
            actor: citizenName,
            role: 'Citizen',
            statusChangedTo: 'Pending'
          },
          ...(aiScanResult ? [{
            id: `t-ai-${Date.now() + 1}`,
            timestamp: now,
            title: 'AI Smart Triage & Assignment',
            description: `AI Vision classified as "${category}" and suggested ${department}.`,
            actor: 'CivicLens AI',
            role: 'AI System'
          }] : [])
        ]
      };

      // Firestore write MUST complete before showing success
      const persistedId = await createIncident(incidentPayload, reporter.id);

      // Build the full Incident object for the callback (using the confirmed persisted ID)
      const newInc: Incident = {
        ...incidentPayload as Incident,
        id: persistedId,
        reportedBy: reporter.id,
        citizenId: reporter.id,
        updatedAt: now,
      };

      setIsSubmitting(false);
      onIncidentCreated(newInc);
      onClose();
    } catch (error: unknown) {
      console.error('Firestore incident creation error:', error);
      setSubmitError(error instanceof Error ? error.message : 'We could not save this report. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl civic-card p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border-slate-700">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Report Civic Issue
              </h2>
              <p className="text-xs text-slate-400">
                Log a municipal problem for department inspection
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
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">
                  Potential Existing Report ({duplicateWarning.id})
                </span>
                <span className="text-slate-300">
                  This issue was previously reported at {duplicateWarning.address}.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMergeDuplicate}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs whitespace-nowrap flex items-center space-x-1.5 transition"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Confirm Active</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left: Media Capture */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Photo Evidence
              </label>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Defect Preview" className="w-full h-full object-cover" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-300 p-4 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Analyzing Photo…</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 text-center cursor-pointer space-y-2"
                  >
                    <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">Click to upload photo</p>
                  </div>
                )}
              </div>

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
              )}

              {aiScanResult && (
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs space-y-1">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Detected: {aiScanResult.category}</span>
                  </span>
                  <p className="text-slate-300 text-[11px]">{aiScanResult.summary}</p>
                </div>
              )}

              {aiError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>AI analysis unavailable; manual submission is enabled.</span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFile}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Right: Form Inputs */}
            <div className="space-y-4 text-xs">

              <div>
                <label className="text-slate-400 font-bold block mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole near main gate"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
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
                <label className="text-slate-400 font-bold block mb-1">Street Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name or landmark"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Ward / Area</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward 4, North Zone"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional context..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

            </div>

          </div>

          {/* Action Footer */}
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {submitError}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
