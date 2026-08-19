import { collection, doc, onSnapshot, query, setDoc, where, type Unsubscribe } from 'firebase/firestore';
import type { Incident } from '../../types';
import { firestore } from './config';

function requireFirestore() {
  if (!firestore) throw new Error('Firebase Firestore is not configured.');
  return firestore;
}

export function subscribeToUserIncidents(userId: string, callback: (incidents: Incident[]) => void, onError: (error: Error) => void): Unsubscribe {
  const db = requireFirestore();
  const incidentsQuery = query(collection(db, 'incidents'), where('reportedBy', '==', userId));
  return onSnapshot(incidentsQuery, (snapshot) => {
    callback(snapshot.docs.map((item) => item.data() as Incident));
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
