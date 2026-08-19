import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured, firestore } from '../services/firebase/config';
import { loginUser, logoutUser, registerUser, resetPassword, subscribeToAuthState, type AuthProfile } from '../services/firebase/auth';
import type { UserRole } from '../types';
import App from '../App';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminApp } from './AdminExperience';
import { AboutPage, HowItWorksPage, PublicHome, PublicLayout } from './PublicExperience';

export function AuthGate() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return subscribeToAuthState(async (nextUser) => {
      setUser(nextUser);
      if (nextUser && firestore) {
        const token = await nextUser.getIdTokenResult();
        const snapshot = await getDoc(doc(firestore, 'users', nextUser.uid));
        const data = snapshot.data();
        const claimRole = token.claims.admin === true ? 'admin' : token.claims.role;
        const role = (claimRole === 'admin' || claimRole === 'department_head' || claimRole === 'officer' || claimRole === 'citizen' ? claimRole : 'citizen') as UserRole;
        setProfile({
          uid: nextUser.uid,
          name: data?.name ?? nextUser.displayName ?? 'CivicLens User',
          email: nextUser.email ?? '',
          role: role ?? 'citizen',
          department: typeof token.claims.department === 'string' ? token.claims.department : undefined,
          isActive: data?.isActive !== false,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return <Routes><Route element={<PublicLayout />}><Route path="/" element={<PublicHome />} /><Route path="/how-it-works" element={<HowItWorksPage />} /><Route path="/about" element={<AboutPage />} /></Route><Route path="*" element={<ConfigurationRequired />} /></Routes>;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#020617] text-slate-200 grid place-items-center">Loading secure session...</div>;
  }

  if (!user || !profile?.isActive) {
    const authScreen = <AuthScreen registering={registering} error={error} onSubmit={async (name, email, password) => { try { setError(''); setSubmitting(true); if (registering) await registerUser(name, email, password); else await loginUser(email, password); } catch (err) { setError(toAuthMessage(err)); } finally { setSubmitting(false); } }} onReset={async (email) => { try { await resetPassword(email); setError('Password reset email sent.'); } catch (err) { setError(toAuthMessage(err)); } }} onToggle={() => { setRegistering((value) => !value); setError(''); }} submitting={submitting} />;
    return <Routes><Route element={<PublicLayout />}><Route path="/" element={<PublicHome />} /><Route path="/how-it-works" element={<HowItWorksPage />} /><Route path="/about" element={<AboutPage />} /></Route><Route path="/auth" element={authScreen} /><Route path="/app/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} /><Route path="/admin/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
  }

  const postAuthPath = new URLSearchParams(location.search).get('next');
  return <Routes><Route element={<PublicLayout />}><Route path="/" element={<PublicHome />} /><Route path="/how-it-works" element={<HowItWorksPage />} /><Route path="/about" element={<AboutPage />} /></Route><Route path="/auth" element={<Navigate to={postAuthPath || (profile.role === 'admin' ? '/admin' : '/app/citizen')} replace />} /><Route path="/app/*" element={<App authenticatedUser={profile} onLogout={logoutUser} />} /><Route path="/admin/*" element={profile.role === 'admin' ? <AdminApp user={profile} onLogout={logoutUser} /> : <Navigate to="/app/citizen" replace />} /><Route path="*" element={<Navigate to={profile.role === 'admin' ? '/admin' : '/app/citizen'} replace />} /></Routes>;
}

function toAuthMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) return 'The email or password is incorrect.';
  if (code.includes('auth/email-already-in-use')) return 'An account already exists for this email.';
  if (code.includes('auth/weak-password')) return 'Choose a stronger password with at least six characters.';
  if (code.includes('auth/too-many-requests')) return 'Too many attempts. Please wait and try again.';
  if (code.includes('auth/invalid-email')) return 'Enter a valid email address.';
  return 'We could not complete that request. Please try again.';
}

function ConfigurationRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-4 text-slate-100">
      <section className="w-full max-w-lg rounded-2xl border border-slate-700/70 bg-slate-900/80 p-8 text-center shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">CivicLens AI</p>
        <h1 className="mt-3 text-2xl font-bold">Service configuration required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          CivicLens is not configured for this environment yet. Add the Firebase web configuration to the server environment, then reload the application.
        </p>
        <p className="mt-5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-500">VITE_FIREBASE_* variables</p>
      </section>
    </main>
  );
}

function AuthScreen({ registering, error, onSubmit, onReset, onToggle, submitting }: {
  registering: boolean;
  error: string;
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  onReset: (email: string) => Promise<void>;
  onToggle: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 grid place-items-center px-4">
      <form className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/80 p-7 shadow-2xl" onSubmit={(event) => { event.preventDefault(); void onSubmit(name, email, password); }}>
        <p className="text-cyan-300 text-xs font-bold uppercase tracking-[0.2em]">CivicLens AI</p>
        <h1 className="mt-3 text-2xl font-bold">{registering ? 'Create your account' : 'Sign in to CivicLens'}</h1>
        <p className="mt-2 text-sm text-slate-400">Live mode uses Firebase Authentication. New accounts are created as citizens.</p>
        {registering && <label className="mt-6 block text-sm">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" /></label>}
        <label className="mt-6 block text-sm">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" /></label>
        <label className="mt-4 block text-sm">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" /></label>
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
        <button disabled={submitting} className="mt-6 w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-60">{submitting ? 'Please wait…' : registering ? 'Register' : 'Login'}</button>
        {!registering && <button type="button" className="mt-3 w-full text-sm text-cyan-300" onClick={() => void onReset(email)}>Reset password</button>}
        <button type="button" className="mt-5 w-full text-sm text-slate-400" onClick={onToggle}>{registering ? 'Already registered? Login' : 'Need an account? Register'}</button>
      </form>
    </main>
  );
}
