import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from './config';
import type { UserRole } from '../../types';

export interface AuthProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

function requireFirebase() {
  if (!firebaseAuth || !firestore) {
    throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* variables to enable live mode.');
  }
  return { auth: firebaseAuth, db: firestore };
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  const { auth } = requireFirebase();
  return onAuthStateChanged(auth, callback);
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name,
    email,
    role: 'citizen',
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  return credential.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { auth } = requireFirebase();
  return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export async function logoutUser(): Promise<void> {
  const { auth } = requireFirebase();
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  const { auth } = requireFirebase();
  await sendPasswordResetEmail(auth, email);
}
