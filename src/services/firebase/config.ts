import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const rawConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '',
};

const requiredKeys: (keyof typeof rawConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

export interface FirebaseEnvDiagnostic {
  name: string;
  status: 'PRESENT' | 'MISSING';
}

export const firebaseDiagnostics: FirebaseEnvDiagnostic[] = [
  { name: 'VITE_FIREBASE_API_KEY', status: rawConfig.apiKey ? 'PRESENT' : 'MISSING' },
  { name: 'VITE_FIREBASE_AUTH_DOMAIN', status: rawConfig.authDomain ? 'PRESENT' : 'MISSING' },
  { name: 'VITE_FIREBASE_PROJECT_ID', status: rawConfig.projectId ? 'PRESENT' : 'MISSING' },
  { name: 'VITE_FIREBASE_STORAGE_BUCKET', status: rawConfig.storageBucket ? 'PRESENT' : 'MISSING' },
  { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', status: rawConfig.messagingSenderId ? 'PRESENT' : 'MISSING' },
  { name: 'VITE_FIREBASE_APP_ID', status: rawConfig.appId ? 'PRESENT' : 'MISSING' },
];

export const missingFirebaseConfigKeys = requiredKeys
  .filter((key) => !rawConfig[key])
  .map((key) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

if (import.meta.env.DEV && !isFirebaseConfigured) {
  console.warn(
    `[CivicLens Firebase] Incomplete Firebase configuration. Missing required environment variables:\n` +
      missingFirebaseConfigKeys.map((k) => `  - ${k}`).join('\n')
  );
}

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(rawConfig)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseStorage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

