import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured, firestore } from '../services/firebase/config';
import { loginUser, logoutUser, registerUser, resetPassword, subscribeToAuthState, type AuthProfile } from '../services/firebase/auth';
import type { UserRole } from '../types';
import App from '../App';

export function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return subscribeToAuthState(async (nextUser) => {
      setUser(nextUser);
      if (nextUser && firestore) {
        const snapshot = await getDoc(doc(firestore, 'users', nextUser.uid));
        const data = snapshot.data();
        setProfile({
          uid: nextUser.uid,
          name: data?.name ?? nextUser.displayName ?? 'CivicLens User',
          email: nextUser.email ?? '',
          role: (data?.role as UserRole) ?? 'citizen',
          isActive: data?.isActive !== false,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return <App demoMode />;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#020617] text-slate-200 grid place-items-center">Loading secure session...</div>;
  }

  if (!user || !profile?.isActive) {
    return (
      <AuthScreen
        registering={registering}
        error={error}
        onSubmit={async (name, email, password) => {
          try {
            setError('');
            if (registering) await registerUser(name, email, password);
            else await loginUser(email, password);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed.');
          }
        }}
        onReset={async (email) => {
          try { await resetPassword(email); setError('Password reset email sent.'); }
          catch (err) { setError(err instanceof Error ? err.message : 'Unable to send reset email.'); }
        }}
        onToggle={() => { setRegistering((value) => !value); setError(''); }}
      />
    );
  }

  return <App authenticatedUser={profile} onLogout={logoutUser} />;
}

function AuthScreen({ registering, error, onSubmit, onReset, onToggle }: {
  registering: boolean;
  error: string;
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  onReset: (email: string) => Promise<void>;
  onToggle: () => void;
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
        <button className="mt-6 w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950">{registering ? 'Register' : 'Login'}</button>
        {!registering && <button type="button" className="mt-3 w-full text-sm text-cyan-300" onClick={() => void onReset(email)}>Reset password</button>}
        <button type="button" className="mt-5 w-full text-sm text-slate-400" onClick={onToggle}>{registering ? 'Already registered? Login' : 'Need an account? Register'}</button>
      </form>
    </main>
  );
}
