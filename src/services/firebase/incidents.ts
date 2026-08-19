import { collection, doc, onSnapshot, query, setDoc, where, type Unsubscribe } from 'firebase/firestore';
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
  return onSnapshot(incidentsQuery, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Incident));
  }, onError);
}

export async function saveIncidentForUser(incident: Incident, userId: string): Promise<void> {
  const db = requireFirestore();
  await setDoc(doc(db, 'incidents', incident.id), {
    ...incident,
    reportedBy: userId,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateIncident(incident: Incident): Promise<void> {
  const db = requireFirestore();
  await setDoc(doc(db, 'incidents', incident.id), {
    ...incident,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
