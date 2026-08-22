import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  FileText, 
  AlertTriangle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Incident } from '../../types';
import { runVisionScan, VisionScanResult } from '../../services/aiService';
import { uploadIncidentImage } from '../../services/firebase/media';
import { saveIncidentForUser } from '../../services/firebase/incidents';
import { saveNotification } from '../../services/firebase/notifications';
import { findPotentialDuplicate } from '../../services/storageService';

type FlowState = 
  | 'EMPTY'
  | 'IMAGE_SELECTED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'SUBMITTING'
  | 'SUBMITTED';

interface ReportIssueFlowProps {
  user: { uid: string; name: string; email: string };
  existingIncidents: Incident[];
  onIncidentCreated?: (incident: Incident) => void;
}

const CATEGORIES = [
  'Potholes & Road Cracks',
  'Garbage & Waste',
  'Water Leakage & Drainage',
  'Streetlight & Electrical',
  'Fallen Tree & Hazard',
  'Open Drain',
  'Traffic Signal Damage',
  'Construction Waste',
  'Other Civic Hazard'
];

const DEPARTMENTS = [
  'Roads & Infrastructure',
  'Sanitation & Waste',
  'Water Supply & Drainage',
  'Electrical & Streetlights',
  'Parks & Horticulture',
  'Traffic & Transport',
  'Public Safety & Hazards',
  'General Civic Administration'
];

export const ReportIssueFlow: React.FC<ReportIssueFlowProps> = ({
  user,
  existingIncidents,
  onIncidentCreated
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow State Machine
  const [flowState, setFlowState] = useState<FlowState>('EMPTY');
  
  // Image data
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [uploadedStorageUrl, setUploadedStorageUrl] = useState<string>('');

  // AI Analysis state
  const [aiResult, setAiResult] = useState<VisionScanResult | null>(null);
  const [aiError, setAiError] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Potholes & Road Cracks');
  const [department, setDepartment] = useState('Roads & Infrastructure');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [severityScore, setSeverityScore] = useState<number>(50);
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number>(12.9716); // Default geographic coordinates
  const [longitude, setLongitude] = useState<number>(77.5946);
  
  // Submission Output
  const [createdIncidentId, setCreatedIncidentId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Step 1: File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('The selected image is larger than 10MB. Please choose a smaller photo.');
      return;
    }

    setSelectedFile(file);
    setSubmitError('');
    setAiError('');
    setAiResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreviewUrl(base64);
      setFlowState('IMAGE_SELECTED');
    };
    reader.readAsDataURL(file);
  };

  // Step 2: Trigger AI Analysis
  const handleRunAIAnalysis = async () => {
    if (!imagePreviewUrl) return;

    setFlowState('ANALYZING');
    setAiError('');

    try {
      const result = await runVisionScan(imagePreviewUrl, category, description);
      setAiResult(result);
      setCategory(result.category || category);
      if (result.department) setDepartment(result.department);
      if (result.severityLevel) setSeverity(result.severityLevel);
      if (typeof result.severityScore === 'number') setSeverityScore(result.severityScore);
      if (!title && result.summary) {
        setTitle(`${result.category} issue reported`);
      }
      setFlowState('ANALYZED');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI analysis is currently unavailable.';
      setAiError(msg);
      // Move to analyzed state with manual review path so citizen can proceed
      setFlowState('ANALYZED');
    }
  };

  // Reset or Change Image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl('');
    setUploadedStorageUrl('');
    setAiResult(null);
    setAiError('');
    setFlowState('EMPTY');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Geolocation trigger
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          if (!address) {
            setAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          }
        },
        (err) => {
          console.warn('Geolocation failed:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  // Submit Incident
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setSubmitError('Please provide a street address or location for the issue.');
      return;
    }

    setFlowState('SUBMITTING');
    setSubmitError('');

    try {
      const now = new Date().toISOString();
      const incidentId = `INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Upload image to Firebase Storage if available, else keep preview URL
      let finalImageUrl = imagePreviewUrl;
      if (imagePreviewUrl.startsWith('data:image/')) {
        try {
          finalImageUrl = await uploadIncidentImage(incidentId, imagePreviewUrl, user.uid);
        } catch (uploadErr) {
          console.warn('Firebase storage upload fallback to base64 preview:', uploadErr);
          // Keep base64 preview as fallback
        }
      }

      const newIncident: Incident = {
        id: incidentId,
        title: title.trim() || `${category} - ${address.trim()}`,
        description: description.trim() || `Citizen report for ${category} at ${address.trim()}.`,
        category,
        department,
        severity,
        severityScore: aiResult ? aiResult.severityScore : severityScore,
        priority: aiResult ? aiResult.priorityLevel : severity === 'Critical' ? 'Immediate Action' : severity === 'High' ? 'High' : 'Normal',
        priorityScore: aiResult ? aiResult.priorityScore : severityScore,
        status: 'Pending',
        latitude,
        longitude,
        address: address.trim(),
        ward: ward.trim() || 'Central Ward',
        area: ward.trim() ? `${ward.trim()} Sector` : 'Civic Sector',
        imageUrl: finalImageUrl,
        aiConfidence: aiResult?.detectedObjects?.[0]?.confidence ?? 0,
        detectedObjects: aiResult?.detectedObjects ?? [],
        estimatedCost: aiResult?.estimatedCost ?? 'To be assessed by department',
        estimatedResolutionTime: aiResult?.estimatedResolutionTime ?? 'Standard SLA (24-72 hrs)',
        recommendedMaterials: aiResult?.recommendedMaterials ?? [],
        safetyRiskLevel: aiResult?.safetyRiskLevel ?? (severity === 'Critical' ? 'High Hazard' : 'Standard'),
        aiSummary: aiResult?.summary ?? (aiError ? 'Manual citizen submission' : 'Awaiting inspection'),
        citizenId: user.uid,
        citizenName: user.name,
        createdAt: now,
        updatedAt: now,
        duplicateCount: 1,
        timeline: [
          {
            id: `t-${Date.now()}`,
            timestamp: now,
            title: 'Report Submitted',
            description: `Citizen ${user.name} submitted this civic issue report.`,
            actor: user.name,
            role: 'Citizen',
            statusChangedTo: 'Pending'
          },
          ...(aiResult ? [{
            id: `t-ai-${Date.now() + 1}`,
            timestamp: now,
            title: 'AI Analysis Completed',
            description: `AI triage identified category as "${category}" with ${severity} severity. Routed to ${department}.`,
            actor: 'CivicLens AI',
            role: 'AI System'
          }] : [])
        ]
      };

      await saveIncidentForUser(newIncident, user.uid);

      // Create confirmation notification for the citizen
      const notif = {
        id: `notif-${Date.now()}`,
        title: `Report Logged: ${incidentId}`,
        message: `Your report for "${category}" has been received and routed to ${department}.`,
        timestamp: now,
        type: 'info' as const,
        isRead: false,
        incidentId: incidentId
      };
      await saveNotification(notif, user.uid).catch((nErr) => console.warn('Notification save error:', nErr));

      if (onIncidentCreated) {
        onIncidentCreated(newIncident);
      }

      setCreatedIncidentId(incidentId);
      setFlowState('SUBMITTED');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'We could not submit your report. Please check your connection and try again.');
      setFlowState('ANALYZED');
    }
  };

  // SUCCESS VIEW (SUBMITTED)
  if (flowState === 'SUBMITTED') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="civic-card p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Submission Confirmed
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Report Submitted Successfully
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
              Your report has been logged and assigned to the relevant department for inspection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Reference ID:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{createdIncidentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Category:</span>
              <span className="font-medium text-white">{category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Routed Department:</span>
              <span className="font-medium text-white">{department}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pending Triage
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate(`/citizen/reports/${createdIncidentId}`)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <span>View My Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleRemoveImage();
                setTitle('');
                setDescription('');
                setAddress('');
                setWard('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Citizen Intake
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Report a Civic Issue
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit details and photos of civic hazards in your area. Our system will analyze the defect and route it directly to the responsible municipal team.
        </p>
      </div>

      {/* Main Multi-Step Form */}
      <form onSubmit={handleSubmitReport} className="space-y-8">
        
        {/* Step 1: Image Capture / Upload */}
        <section className="civic-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-white">
                Photo Evidence
              </h2>
            </div>
            {flowState !== 'EMPTY' && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change / Remove</span>
              </button>
            )}
          </div>

          {/* Upload Dropzone / Preview */}
          {flowState === 'EMPTY' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Click to select or capture a photo
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, or WebP up to 10MB
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Image Preview */}
              <div className="md:col-span-6 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3]">
                <img
                  src={imagePreviewUrl}
                  alt="Selected civic issue"
                  className="w-full h-full object-cover"
                />
                
                {/* Analyzing Overlay */}
                {flowState === 'ANALYZING' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-300 p-4 text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Analyzing your report…
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Evaluating defect type, severity grade, and department routing.
                    </p>
                  </div>
                )}
              </div>

              {/* File Info & AI Action */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-white font-medium truncate max-w-[180px]">
                      {selectedFile?.name || 'Uploaded photo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size:</span>
                    <span className="text-white font-medium">
                      {selectedFile ? formatFileSize(selectedFile.size) : 'Ready'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-cyan-400 font-medium">
                      {flowState === 'ANALYZING' ? 'Running AI Scan...' : flowState === 'ANALYZED' ? 'Analysis Complete' : 'Image Ready'}
                    </span>
                  </div>
                </div>

                {flowState === 'IMAGE_SELECTED' && (
                  <button
                    type="button"
                    onClick={handleRunAIAnalysis}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Run AI Analysis & Auto-Triage</span>
                  </button>
                )}

                {/* AI Result Card */}
                {flowState === 'ANALYZED' && aiResult && (
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Analysis Completed</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                        {aiResult.severityLevel} Severity ({aiResult.severityScore}/100)
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {aiResult.summary}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Suggested Department:</span>
                      <span className="text-white font-medium">{aiResult.department}</span>
                    </div>
                  </div>
                )}

                {/* Graceful AI Error Notice */}
                {flowState === 'ANALYZED' && aiError && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-200">AI analysis is currently unavailable.</p>
                      <p className="text-[11px] text-amber-300/80 mt-0.5">
                        You can fill in the category and location manually below to submit your report for municipal review.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Step 2: Issue Details & Review */}
        <section className="civic-card p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-white">
              Issue Information & Review
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-slate-300 font-bold block mb-1.5">
                Issue Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole near community center gate"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Responsible Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => {
                  const val = e.target.value as 'Low' | 'Medium' | 'High' | 'Critical';
                  setSeverity(val);
                  setSeverityScore(val === 'Critical' ? 90 : val === 'High' ? 70 : val === 'Medium' ? 50 : 25);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Low">Low (Minor inconvenience)</option>
                <option value="Medium">Medium (Needs attention)</option>
                <option value="High">High (Impacting traffic / safety)</option>
                <option value="Critical">Critical (Immediate public danger)</option>
              </select>
            </div>

            {/* Ward */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Ward / Sector
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Ward 4, North Zone"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Street Address */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-bold">
                  Street Address & Landmark *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center space-x-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Use Current GPS Location</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Opposite Metro Station Pillar #42, Main Ring Road"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-slate-300 font-bold block mb-1.5">
                Detailed Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe any additional details like how long the defect has existed, traffic obstruction, or safety hazards..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {submitError}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Report will be logged under your verified citizen account.</span>
            </p>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/citizen')}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={flowState === 'SUBMITTING'}
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {flowState === 'SUBMITTING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Report…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

      </form>

    </div>
  );
};
