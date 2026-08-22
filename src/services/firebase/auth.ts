import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from './config';
import type { UserRole } from '../../types';

export interface AuthProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
}

function requireFirebase() {
  if (!firebaseAuth || !firestore) {
    throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* variables to enable live mode.');
  }
  return { auth: firebaseAuth, db: firestore };
}

export function getAuthErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : String(error);
  if (
    code.includes('auth/invalid-credential') ||
    code.includes('auth/wrong-password') ||
    code.includes('auth/user-not-found')
  ) {
    return 'The email or password is incorrect.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Please choose a stronger password with at least 6 characters.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network connection failed. Please check your connection.';
  }
  if (code.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact administration.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Sign-in window was closed before completing.';
  }
  return 'We could not complete that request. Please try again.';
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  const { auth } = requireFirebase();
  return onAuthStateChanged(auth, callback);
}

export async function fetchUserProfile(user: User): Promise<AuthProfile> {
  const { db } = requireFirebase();
  const token = await user.getIdTokenResult();
  const snapshot = await getDoc(doc(db, 'users', user.uid));
  const data = snapshot.data();

  const claimRole = token.claims.admin === true ? 'admin' : token.claims.role;
  const effectiveRole = claimRole || data?.role;
  const role = (
    effectiveRole === 'admin' ||
    effectiveRole === 'department_head' ||
    effectiveRole === 'officer' ||
    effectiveRole === 'citizen'
      ? effectiveRole
      : 'citizen'
  ) as UserRole;

  return {
    uid: user.uid,
    name: data?.name ?? user.displayName ?? 'CivicLens User',
    email: user.email ?? '',
    role,
    department: typeof token.claims.department === 'string' ? token.claims.department : undefined,
    isActive: data?.isActive !== false,
  };
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name: name.trim(),
    email: email.trim(),
    role: 'citizen',
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  return credential.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { auth, db } = requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  // Update last login timestamp in Firestore profile without blocking login
  void setDoc(
    doc(db, 'users', credential.user.uid),
    { lastLoginAt: serverTimestamp() },
    { merge: true }
  ).catch(() => undefined);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  const { auth } = requireFirebase();
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  const { auth } = requireFirebase();
  await sendPasswordResetEmail(auth, email.trim());
}

