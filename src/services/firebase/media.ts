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

  // 4-second timeout to prevent UI hang if Cloud Storage bucket is not enabled/initialized
  const uploadPromise = uploadString(imageRef, dataUrl, 'data_url', {
    contentType: mimeType,
    customMetadata: { ownerId },
  }).then(() => getDownloadURL(imageRef));

  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error('Storage upload timeout')), 4000)
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}

