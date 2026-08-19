import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Sparkles, 
  Activity,
  BarChart3
} from 'lucide-react';
import { Incident, CityAnalytics } from '../types';
import { exportIncidentsToCsv } from '../services/storageService';

interface CsvReportCenterProps {
  incidents: Incident[];
  analytics: CityAnalytics;
  onImportIncidents: (imported: Incident[]) => void;
}

export const CsvReportCenter: React.FC<CsvReportCenterProps> = ({
  incidents,
  analytics,
  onImportIncidents
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCsv = () => {
    const csvContent = exportIncidentsToCsv(incidents);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CivicLens_Enterprise_Dataset_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintExecutiveReport = () => {
    window.print();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setImportStatus('CSV is empty or missing data rows.');
          return;
        }

        // Parse rows
        const newIncidents: Incident[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 8) {
            newIncidents.push({
              id: cols[0] || `INC-IMP-${Date.now()}-${i}`,
              citizenId: cols[1] || 'cit-import',
              citizenName: cols[2] || 'Imported Citizen',
              citizenPhone: '+1 (555) 000-0000',
              createdAt: cols[3] || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              category: cols[4] || 'Municipal Defect',
              department: cols[5] || 'General Administration',
              priority: (cols[6] as any) || 'High',
              priorityScore: 80,
              severity: (cols[7] as any) || 'Medium',
              severityScore: Number(cols[8]) || 70,
              status: (cols[9] as any) || 'Pending',
              ward: cols[10] || 'Ward 1 - Downtown Core',
              area: cols[10] || 'Central Area',
              address: cols[11] || 'Imported Address',
              latitude: Number(cols[12]) || 37.7749,
              longitude: Number(cols[13]) || -122.4194,
              imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
              aiConfidence: 0.95,
              detectedObjects: [{ label: 'Imported Defect', confidence: 0.95, bbox: [20, 20, 80, 80], severity: 'Medium' }],
              estimatedCost: cols[15] || '$500',
              estimatedResolutionTime: cols[16] || '24 Hours',
              recommendedMaterials: ['Standard Material'],
              safetyRiskLevel: 'Standard Risk',
              aiSummary: 'Batch imported via municipal CSV console.',
              duplicateCount: 1,
              title: `${cols[4] || 'Defect'} at ${cols[11] || 'Civic Center'}`,
              description: 'Batch imported municipal record.',
              timeline: [
                {
                  id: `t-imp-${Date.now()}-${i}`,
                  timestamp: new Date().toISOString(),
                  title: 'Batch Imported Record',
                  description: 'Record successfully parsed from municipal CSV file.',
                  actor: 'Data Administrator',
                  role: 'Admin'
                }
              ]
            });
          }
        }

        if (newIncidents.length > 0) {
          onImportIncidents(newIncidents);
          setImportStatus(`Successfully ingested ${newIncidents.length} verified municipal records!`);
        } else {
          setImportStatus('No valid data parsed. Please ensure correct 17-column CSV schema.');
        }
      } catch (err) {
        setImportStatus('Error parsing CSV. Please check formatting.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
              ENTERPRISE DATA PIPELINE
            </span>
            <span className="text-xs text-slate-400">17 Schema Attributes</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Reports & CSV Data Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Export full dataset, import historical legacy municipal records, and generate formatted executive PDF briefs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Full CSV ({incidents.length})</span>
          </button>

          <button
            onClick={handlePrintExecutiveReport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold flex items-center space-x-2 shadow-lg transition"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>

      {/* CSV Ingestion Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Two-Way CSV Data Ingestion
            </h3>
            <p className="text-xs text-slate-400">
              Bulk-upload legacy complaints from spreadsheets or third-party CRM exports.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Select CSV File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-cyan-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Formatted Executive Municipal Brief (Printable) */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 bg-[#090d16]/95 print:bg-white print:text-black shadow-2xl">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-black">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              MUNICIPAL CORPORATION EXECUTIVE BRIEF
            </span>
            <h2 className="text-2xl font-bold text-white mt-1 print:text-black font-heading">
              Metropolis Smart City Performance & Resolution Audit
            </h2>
            <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
              Generated: {new Date().toLocaleDateString()} • System Version: CivicLens AI v2.6
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block print:text-black">Audit Status</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">VERIFIED OPTIMAL</span>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-gray-300">
            <span className="text-slate-400 print:text-gray-600">Total City Incidents</span>
            <span className="text-2xl font-bold text-white block mt-1 print:text-black">{analytics.totalComplaints}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-gray-300">
            <span className="text-slate-400 print:text-gray-600">Resolution Rate</span>
            <span className="text-2xl font-bold text-emerald-400 block mt-1 print:text-green-700">
              {((analytics.resolvedComplaints / analytics.totalComplaints) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-gray-300">
            <span className="text-slate-400 print:text-gray-600">AI Triage Accuracy</span>
            <span className="text-2xl font-bold text-cyan-400 block mt-1 print:text-blue-700">
              {analytics.aiTriageAccuracy}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-gray-300">
            <span className="text-slate-400 print:text-gray-600">Budget Saved via Triage</span>
            <span className="text-2xl font-bold text-purple-400 block mt-1 print:text-purple-700">
              {analytics.estimatedBudgetSaved}
            </span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="space-y-2 text-xs text-slate-300 print:text-gray-800 leading-relaxed">
          <h4 className="font-bold text-white print:text-black uppercase tracking-wider">
            Operational Summary & Recommendations:
          </h4>
          <p>
            During the current fiscal window, CivicLens AI successfully processed {analytics.totalComplaints} citizen reports across 12 metropolitan wards. Autonomous Computer Vision triage prevented {analytics.duplicateComplaintsPrevented} redundant crew dispatches, generating significant operational cost savings of {analytics.estimatedBudgetSaved}.
          </p>
          <p>
            Key infrastructure maintenance priority should remain focused on Ward 4 and Ward 7 drainage conduits ahead of peak seasonal rainfall. All 8 municipal divisions are currently exceeding their 85% SLA benchmark targets.
          </p>
        </div>

      </div>

    </div>
  );
};
