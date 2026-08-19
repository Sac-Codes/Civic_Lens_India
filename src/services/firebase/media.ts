import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { firebaseStorage } from './config';

function requireStorage() {
  if (!firebaseStorage) throw new Error('Firebase Storage is not configured.');
  return firebaseStorage;
}

export async function uploadIncidentImage(incidentId: string, dataUrl: string, ownerId: string): Promise<string> {
  const storage = requireStorage();
  const imageRef = ref(storage, `incidents/${incidentId}/evidence/report-${Date.now()}`);
  await uploadString(imageRef, dataUrl, 'data_url', { customMetadata: { ownerId } });
  return getDownloadURL(imageRef);
}