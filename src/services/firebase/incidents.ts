import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  getDoc,
  type Unsubscribe
} from 'firebase/firestore';
import type { Incident, UserRole } from '../../types';
import { firestore } from './config';

function requireFirestore() {
  if (!firestore) throw new Error('Firebase Firestore is not configured.');
  return firestore;
}

export function subscribeToIncidents(
  userId: string,
  role: UserRole,
  department: string | undefined,
  callback: (incidents: Incident[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();
  const incidentsQuery = role === 'admin'
    ? query(collection(db, 'incidents'))
    : role === 'officer'
    ? query(collection(db, 'incidents'), where('assignedOfficerId', '==', userId))
    : role === 'department_head' && department
    ? query(collection(db, 'incidents'), where('department', '==', department))
    : query(collection(db, 'incidents'), where('reportedBy', '==', userId));

  return onSnapshot(
    incidentsQuery,
    (snapshot) => {
      const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Incident);
      // Sort newest incidents first
      list.sort((a, b) => {
        const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
        const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
        return timeB - timeA;
      });
      callback(list);
    },
    onError
  );
}

export async function createIncident(
  incidentData: Partial<Incident>,
  userId: string
): Promise<string> {
  if (!userId) {
    throw new Error('User authentication required to create an incident.');
  }

  const db = requireFirestore();
  const now = new Date().toISOString();
  const incidentId = incidentData.id || `INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const incidentRef = doc(db, 'incidents', incidentId);

  // Build clean, validated payload (no undefined values)
  const payload: Incident = {
    id: incidentId,
    reportedBy: userId,
    citizenId: userId,
    citizenName: incidentData.citizenName || 'Verified Citizen',
    citizenPhone: incidentData.citizenPhone || '',
    title: incidentData.title?.trim() || `${incidentData.category || 'Civic Hazard'} at ${incidentData.address || 'Reported Location'}`,
    description: incidentData.description?.trim() || 'Reported civic issue via CivicLens intake platform.',
    category: incidentData.category || 'Potholes & Road Cracks',
    department: incidentData.department || 'Roads & Infrastructure',
    severity: incidentData.severity || 'Medium',
    severityScore: typeof incidentData.severityScore === 'number' ? incidentData.severityScore : 50,
    priority: incidentData.priority || 'Normal',
    priorityScore: typeof incidentData.priorityScore === 'number' ? incidentData.priorityScore : 50,
    status: incidentData.status || 'Pending',
    latitude: typeof incidentData.latitude === 'number' ? incidentData.latitude : 0,
    longitude: typeof incidentData.longitude === 'number' ? incidentData.longitude : 0,
    address: incidentData.address?.trim() || 'Location not specified',
    ward: incidentData.ward?.trim() || 'Central Ward',
    area: incidentData.area?.trim() || (incidentData.ward ? `${incidentData.ward} Sector` : 'Civic Sector'),
    imageUrl: incidentData.imageUrl || '',
    aiConfidence: typeof incidentData.aiConfidence === 'number' ? incidentData.aiConfidence : 0,
    detectedObjects: Array.isArray(incidentData.detectedObjects) ? incidentData.detectedObjects : [],
    estimatedCost: incidentData.estimatedCost || 'To be assessed by department',
    estimatedResolutionTime: incidentData.estimatedResolutionTime || 'Standard SLA (24-72 hrs)',
    recommendedMaterials: Array.isArray(incidentData.recommendedMaterials) ? incidentData.recommendedMaterials : [],
    safetyRiskLevel: incidentData.safetyRiskLevel || 'Standard',
    aiSummary: incidentData.aiSummary || '',
    duplicateCount: typeof incidentData.duplicateCount === 'number' ? incidentData.duplicateCount : 1,
    createdAt: incidentData.createdAt || now,
    updatedAt: now,
    timeline: Array.isArray(incidentData.timeline) && incidentData.timeline.length > 0
      ? incidentData.timeline
      : [
          {
            id: `t-init-${Date.now()}`,
            timestamp: now,
            title: 'Report Submitted',
            description: `Citizen ${incidentData.citizenName || 'Verified Citizen'} submitted this civic report.`,
            actor: incidentData.citizenName || 'Verified Citizen',
            role: 'Citizen',
            statusChangedTo: 'Pending',
          }
        ]
  };

  // Perform Firestore write and explicitly await completion
  await setDoc(incidentRef, payload);
  return incidentId;
}

export async function saveIncidentForUser(incident: Incident, userId: string): Promise<void> {
  await createIncident(incident, userId);
}

export async function updateIncident(incident: Incident): Promise<void> {
  const db = requireFirestore();
  const incidentRef = doc(db, 'incidents', incident.id);
  const now = new Date().toISOString();

  await setDoc(incidentRef, {
    ...incident,
    updatedAt: now,
  }, { merge: true });
}

export async function getIncidentById(incidentId: string): Promise<Incident | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, 'incidents', incidentId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Incident;
}
