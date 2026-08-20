import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });
dotenv.config();

export const app = express();
const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(express.json({ limit: '25mb' }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CivicLens AI Urban Intelligence API',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// AI Vision Scan Endpoint
app.post('/api/ai/vision-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '', category = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) return res.status(503).json({ error: 'Gemini AI is not configured.' });
    if (typeof imageBase64 !== 'string' || imageBase64.length === 0 || imageBase64.length > 12_000_000) {
      return res.status(400).json({ error: 'imageBase64 is required and must be smaller than 9MB encoded.' });
    }
    if (!String(mimeType).startsWith('image/')) return res.status(400).json({ error: 'Only image uploads are supported.' });

    const prompt = `You are the Computer Vision & Smart City Triage Engine for CivicLens AI.
Analyze this civic issue photo. Identify specific urban defects, municipal hazards, bounding boxes, severity score (0-100), appropriate department, priority, cost estimate, and repair materials.
User note: "${description}".

Respond with STRICT JSON format:
{
  "detectedObjects": [
    { "label": "string", "confidence": number (0.0 to 1.0), "bbox": [top_percent, left_percent, bottom_percent, right_percent], "severity": "Low" | "Medium" | "High" | "Critical" }
  ],
  "category": "string (e.g. Potholes & Road Cracks | Garbage & Waste | Water Leakage & Drainage | Streetlight & Electrical | Fallen Tree & Hazard | Open Drain | Traffic Signal Damage | Construction Waste)",
  "department": "Roads & Infrastructure" | "Sanitation & Waste" | "Water Supply & Drainage" | "Electrical & Streetlights" | "Parks & Horticulture" | "Traffic & Transport" | "Public Safety & Hazards" | "Building & Encroachment",
  "severityScore": number (0-100),
  "severityLevel": "Low" | "Medium" | "High" | "Critical",
  "priorityScore": number (0-100),
  "priorityLevel": "Low" | "Normal" | "High" | "Immediate Action",
  "estimatedCost": "string (e.g. $450 - $700)",
  "estimatedResolutionTime": "string (e.g. 12-24 Hours)",
  "recommendedMaterials": ["string", "string"],
  "safetyRiskLevel": "string",
  "summary": "string"
}`;

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: unknown) {
    console.error('Vision scan error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Vision scan processing failed' });
  }
});

// AI Smart City Assistant Copilot Endpoint
app.post('/api/ai/assistant-chat', async (req, res) => {
  try {
    const { message, history = [], contextData = {} } = req.body;
    const ai = getGeminiClient();

    if (!ai) return res.status(503).json({ error: 'Gemini AI is not configured.' });
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 4000) {
      return res.status(400).json({ error: 'message is required and must be shorter than 4000 characters.' });
    }

    const systemInstruction = `You are "Aria", the Senior Smart City AI Copilot for CivicLens AI.
You assist City Commissioners, Municipal Officers, and Citizens in managing urban infrastructure, triaging civic defects (potholes, garbage accumulation, water bursts, open drains, lighting failure), analyzing GIS spatial clusters, and recommending budget and workforce allocations.
Be concise, authoritative, data-driven, structured, and helpful. Use markdown bullet points and numbers.`;

    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: `Context Data: ${JSON.stringify(contextData)}\n\nUser Question: ${message}`,
    });

    res.json({ reply: response.text });
  } catch (error: unknown) {
    console.error('Assistant chat error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Assistant response failed' });
  }
});

// AI Predictive Forecast Endpoint
app.post('/api/ai/predictive-forecast', async (req, res) => {
  try {
    const { ward, department, historicalData = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) return res.status(503).json({ error: 'Gemini AI is not configured.' });

    const prompt = `As the CivicLens Predictive Urban Intelligence Engine, analyze this ward and municipal incident context:
Ward: ${ward || 'All Wards'}
Department: ${department || 'All Departments'}
Data: ${JSON.stringify(historicalData).slice(0, 1500)}

Generate JSON with:
{
  "forecastTitle": "string",
  "confidenceScore": number (0-100),
  "monsoonFloodRiskScore": number (0-100),
  "garbageOverflowProbability": number (0-100),
  "roadFatigueIndex": number (0-100),
  "keyInsights": ["string", "string", "string"],
  "actionableRecommendations": [
    { "action": "string", "targetDepartment": "string", "priority": "Low" | "Medium" | "High" | "Immediate Action", "estimatedSavings": "string" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: unknown) {
    console.error('Predictive forecast error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Forecast computation failed' });
  }
});

// Vite middleware for development & static serving for production
export async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicLens AI Command Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
