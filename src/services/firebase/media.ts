import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { firebaseStorage } from './config';

function requireStorage() {
  if (!firebaseStorage) throw new Error('Firebase Storage is not configured.');
  return firebaseStorage;
}

export async function uploadIncidentImage(incidentId: string, dataUrl: string, ownerId: string): Promise<string> {
  const storage = requireStorage();
  const mimeType = dataUrl.match(/^data:([^;]+);/)?.[1] || 'image/jpeg';
  const ext = mimeType.split('/')[1] || 'jpg';
  const imageRef = ref(storage, `incidents/${incidentId}/evidence/report-${Date.now()}.${ext}`);

  await uploadString(imageRef, dataUrl, 'data_url', {
    contentType: mimeType,
    customMetadata: { ownerId },
  });
  return getDownloadURL(imageRef);
}
