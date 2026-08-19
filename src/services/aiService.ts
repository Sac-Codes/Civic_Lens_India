import { DetectedObject, SeverityLevel, PriorityLevel } from '../types';

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
      if (!Array.isArray(data.detectedObjects) || typeof data.category !== 'string' || typeof data.department !== 'string' || typeof data.severityScore !== 'number' || typeof data.severityLevel !== 'string' || typeof data.priorityScore !== 'number' || typeof data.priorityLevel !== 'string' || typeof data.summary !== 'string') {
        throw new Error('AI analysis returned incomplete data. Please try again.');
      }
      return {
        detectedObjects: data.detectedObjects as DetectedObject[],
        category: data.category,
        department: data.department,
        severityScore: data.severityScore,
        severityLevel: data.severityLevel as SeverityLevel,
        priorityScore: data.priorityScore,
        priorityLevel: data.priorityLevel as PriorityLevel,
        estimatedCost: typeof data.estimatedCost === 'string' ? data.estimatedCost : 'Not available',
        estimatedResolutionTime: typeof data.estimatedResolutionTime === 'string' ? data.estimatedResolutionTime : 'Not available',
        recommendedMaterials: Array.isArray(data.recommendedMaterials) ? data.recommendedMaterials : [],
        safetyRiskLevel: typeof data.safetyRiskLevel === 'string' ? data.safetyRiskLevel : 'Not available',
        summary: data.summary,
      };
    }
    throw new Error(response.status === 503 ? 'AI analysis is not configured for this environment.' : `AI analysis failed (${response.status}).`);
  } catch (err) {
    throw err instanceof Error ? err : new Error('AI analysis failed.');
  }
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
      if (typeof data.reply === 'string' && data.reply.trim()) return data.reply;
      throw new Error('The AI assistant returned an empty response.');
    }
    throw new Error(res.status === 503 ? 'AI assistant is not configured for this environment.' : `AI assistant failed (${res.status}).`);
  } catch (err) {
    throw err instanceof Error ? err : new Error('AI assistant failed.');
  }
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
    throw new Error(res.status === 503 ? 'Predictive analysis is not configured for this environment.' : `Predictive analysis failed (${res.status}).`);
  } catch (err) {
    throw err instanceof Error ? err : new Error('Predictive analysis failed.');
  }
}
