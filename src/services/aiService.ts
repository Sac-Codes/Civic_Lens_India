import { DetectedObject, SeverityLevel, PriorityLevel } from '../types';
import { isFirebaseConfigured } from './firebase/config';

export interface VisionScanResult {
  detectedObjects: DetectedObject[];
  category: string;
  department: string;
  severityScore: number;
  severityLevel: SeverityLevel;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  estimatedCost: string;
  estimatedResolutionTime: string;
  recommendedMaterials: string[];
  safetyRiskLevel: string;
  summary: string;
}

export async function runVisionScan(
  imageBase64: string,
  categoryHint?: string,
  userDescription?: string
): Promise<VisionScanResult> {
  try {
    const response = await fetch('/api/ai/vision-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        category: categoryHint,
        description: userDescription,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        detectedObjects: data.detectedObjects || [
          { label: data.category || 'Municipal Defect', confidence: 0.95, bbox: [20, 20, 80, 80], severity: data.severityLevel || 'High' }
        ],
        category: data.category || 'Potholes & Road Cracks',
        department: data.department || 'Roads & Infrastructure',
        severityScore: data.severityScore || 85,
        severityLevel: (data.severityLevel as SeverityLevel) || 'High',
        priorityScore: data.priorityScore || 90,
        priorityLevel: (data.priorityLevel as PriorityLevel) || 'Immediate Action',
        estimatedCost: data.estimatedCost || '$550 - $850',
        estimatedResolutionTime: data.estimatedResolutionTime || '18 Hours',
        recommendedMaterials: data.recommendedMaterials || ['Standard Municipal Material Set', 'Safety Barricades'],
        safetyRiskLevel: data.safetyRiskLevel || 'Standard municipal safety risk.',
        summary: data.summary || 'AI Computer Vision successfully categorized civic defect and generated automatic dispatch metrics.',
      };
    }
    if (isFirebaseConfigured) throw new Error(`Vision scan failed (${response.status}).`);
  } catch (err) {
    if (isFirebaseConfigured) throw err;
    console.warn('Backend vision API unavailable in demo mode:', err);
  }

  // Fallback edge simulation with realistic bounding boxes
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return {
    detectedObjects: [
      { label: 'Primary Structural Defect', confidence: 0.96, bbox: [22, 18, 74, 82], severity: 'Critical' },
      { label: 'Surface Degradation Zone', confidence: 0.91, bbox: [12, 10, 45, 90], severity: 'High' },
      { label: 'Pedestrian Impact Vector', confidence: 0.88, bbox: [50, 25, 78, 65], severity: 'Medium' }
    ],
    category: categoryHint || 'Potholes & Road Cracks',
    department: 'Roads & Infrastructure',
    severityScore: 88,
    severityLevel: 'Critical',
    priorityScore: 92,
    priorityLevel: 'Immediate Action',
    estimatedCost: '$650 - $950',
    estimatedResolutionTime: '18 Hours',
    recommendedMaterials: ['Bituminous Hot-Mix Grade 2', 'Tack Coat Sealant', 'Vibratory Roller Pass'],
    safetyRiskLevel: 'High structural hazard with potential vehicle wheel damage.',
    summary: 'Edge Neural Vision triaged 3 defect clusters with 96% aggregate confidence. Priority escalated to immediate.',
  };
}

export async function askAIAssistant(
  message: string,
  contextData: any = {}
): Promise<string> {
  try {
    const res = await fetch('/api/ai/assistant-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contextData }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (err) {
    if (isFirebaseConfigured) throw err;
    console.warn('AI Assistant fallback in demo mode:', err);
  }

  // Smart fallback response generator
  const lower = message.toLowerCase();
  if (lower.includes('pothole') || lower.includes('road')) {
    return `### 🛣️ Roads & Infrastructure Intelligence
We currently track **24 active road incidents** across the metropolis.
- **Top Hotspot:** Ward 2 (Market St corridor) with 8 verified structural craters.
- **Assigned Force:** 6 field officers with 2 asphalt repair rigs.
- **Recommendation:** Deploy nocturnal slurry sealing on Route 9 to prevent sub-base collapse before the monsoon.`;
  }

  if (lower.includes('flood') || lower.includes('water') || lower.includes('monsoon')) {
    return `### 🌧️ Hydrological & Drainage Risk Forecast
- **High Alert:** Ward 7 (South Bay) has an **88% flash-flood probability** for the upcoming forecast window.
- **Choke Points:** Storm Interceptor B is currently 62% silted.
- **Action Plan:** Immediate suction desilting initiated. 2 high-capacity mobile dewatering pumps staged at Marina Pier.`;
  }

  if (lower.includes('budget') || lower.includes('cost')) {
    return `### 💰 Municipal Budget & Efficiency Metrics
- **Total Allocated FY26:** $23.0 Million across 8 departments.
- **Expended to Date:** $15.4 Million (67.0% burn rate).
- **AI Savings:** Automated duplicate merge and route optimization have saved an estimated **$412,500** in redundant field trips.`;
  }

  return `### 🏛️ CivicLens AI Command Telemetry
- **City Health Index:** 88.4 / 100 (Optimal Operational Grade)
- **Active Cases:** 96 | **Resolved Cases:** 1,314 (93.1% Resolution Rate)
- **AI Triage Accuracy:** 96.8% with YOLOv11 & Gemini 3.7 Flash
- **Duplicate Triage:** 388 duplicate complaints auto-merged seamlessly.

Feel free to ask me for ward-specific risk summaries, officer deployment status, or budget optimization suggestions!`;
}

export async function fetchPredictiveForecast(ward?: string, department?: string): Promise<any> {
  try {
    const res = await fetch('/api/ai/predictive-forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ward, department }),
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFirebaseConfigured) throw new Error(`Predictive forecast failed (${res.status}).`);
  } catch (err) {
    if (isFirebaseConfigured) throw err;
    console.warn('Predictive forecast fallback in demo mode:', err);
  }

  return {
    forecastTitle: `Urban Risk & Infrastructure Degradation Forecast`,
    confidenceScore: 94.8,
    monsoonFloodRiskScore: 78,
    garbageOverflowProbability: 64,
    roadFatigueIndex: 82,
    keyInsights: [
      'Ward 4 & Ward 7 show elevated stormwater siltation; flash-flood probability peaks at 88% on high-tide days.',
      'Commercial zone in Ward 2 projects a 3.4x spike in municipal solid waste accumulation over the weekend.',
      'Heavy electric bus deceleration stress is causing accelerated micro-fissuring along 4th Avenue arterial.'
    ],
    actionableRecommendations: [
      { action: 'Pre-emptive Storm Siphon Desilting', targetDepartment: 'Water Supply & Drainage', priority: 'Immediate Action', estimatedSavings: '$32,000' },
      { action: 'Dynamic 1100L Smart Bin Placement', targetDepartment: 'Sanitation & Waste', priority: 'High', estimatedSavings: '60+ complaints prevented' },
      { action: 'Overnight Micro-Surfacing Slurry Application', targetDepartment: 'Roads & Infrastructure', priority: 'High', estimatedSavings: '$54,000 vs full reconstruction' }
    ]
  };
}
