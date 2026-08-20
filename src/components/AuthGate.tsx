import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseDiagnostics, missingFirebaseConfigKeys } from '../services/firebase/config';
import { getAuthErrorMessage } from '../services/firebase/auth';
import App from '../App';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminApp } from './AdminExperience';
import { AboutPage, HowItWorksPage, PublicHome, PublicLayout } from './PublicExperience';
import { Loader2, AlertCircle } from 'lucide-react';

export function AuthGate() {
  const location = useLocation();
  const { user, profile, loading, isConfigured, login, register, logout, resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  if (!isConfigured) {
    return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<ConfigurationRequired />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-slate-200 grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm font-medium text-slate-400">Loading secure session...</p>
        </div>
      </main>
    );
  }

  if (!user || !profile?.isActive) {
    const authScreen = (
      <AuthScreen
        registering={registering}
        error={error}
        infoMessage={infoMessage}
        submitting={submitting}
        resettingPassword={resettingPassword}
        onSubmit={async (name, email, password) => {
          try {
            setError('');
            setInfoMessage('');
            setSubmitting(true);
            if (registering) {
              await register(name, email, password);
            } else {
              await login(email, password);
            }
          } catch (err) {
            setError(getAuthErrorMessage(err));
          } finally {
            setSubmitting(false);
          }
        }}
        onReset={async (email) => {
          if (!email.trim()) {
            setError('Please enter your email address to reset password.');
            return;
          }
          try {
            setError('');
            setInfoMessage('');
            setResettingPassword(true);
            await resetPassword(email);
            setInfoMessage('Password reset email sent. Please check your inbox.');
          } catch (err) {
            setError(getAuthErrorMessage(err));
          } finally {
            setResettingPassword(false);
          }
        }}
        onToggle={() => {
          setRegistering((value) => !value);
          setError('');
          setInfoMessage('');
        }}
      />
    );

    return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="/auth" element={authScreen} />
        <Route path="/app/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} />
        <Route path="/admin/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const postAuthPath = new URLSearchParams(location.search).get('next');

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
      <Route
        path="/auth"
        element={<Navigate to={postAuthPath || (profile.role === 'admin' ? '/admin' : '/app/citizen')} replace />}
      />
      <Route path="/app/*" element={<App authenticatedUser={profile} onLogout={logout} />} />
      <Route
        path="/admin/*"
        element={
          profile.role === 'admin' ? (
            <AdminApp user={profile} onLogout={logout} />
          ) : (
            <Navigate to="/app/citizen" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={profile.role === 'admin' ? '/admin' : '/app/citizen'} replace />} />
    </Routes>
  );
}

function ConfigurationRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-4 text-slate-100">
      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">CivicLens AI</p>
        <h1 className="mt-2 text-2xl font-bold text-white">CivicLens configuration incomplete</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The application cannot connect to its backend services.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Please configure the required Firebase environment variables in your deployment environment (Vercel Project Settings) and trigger a new deployment.
        </p>
        
        <div className="mt-6 text-left rounded-lg border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-semibold text-slate-300">Firebase Environment Variable Diagnostics:</p>
          <div className="mt-3 space-y-1.5 font-mono text-xs">
            {firebaseDiagnostics.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1 border-b border-slate-900 last:border-0">
                <span className="text-slate-400">{item.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

interface AuthScreenProps {
  registering: boolean;
  error: string;
  infoMessage: string;
  submitting: boolean;
  resettingPassword: boolean;
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  onReset: (email: string) => Promise<void>;
  onToggle: () => void;
}

function AuthScreen({
  registering,
  error,
  infoMessage,
  submitting,
  resettingPassword,
  onSubmit,
  onReset,
  onToggle,
}: AuthScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 grid place-items-center px-4 py-12">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(name, email, password);
        }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-xs font-bold text-white">
            CL
          </div>
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">CivicLens AI</p>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">
          {registering ? 'Create your account' : 'Sign in to CivicLens'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Live mode uses Firebase Authentication. New accounts are created as citizens.
        </p>

        {registering && (
          <label className="mt-6 block text-sm font-medium text-slate-300">
            Full Name
            <input
              required
              disabled={submitting}
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            />
          </label>
        )}

        <label className="mt-4 block text-sm font-medium text-slate-300">
          Email Address
          <input
            required
            disabled={submitting}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-300">
          Password
          <input
            required
            disabled={submitting}
            minLength={6}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
          />
        </label>

        {error && (
          <div role="alert" className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {infoMessage && (
          <div role="status" className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-300">
            {infoMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || resettingPassword}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {registering ? 'Creating account…' : 'Signing in…'}
            </span>
          ) : registering ? (
            'Register'
          ) : (
            'Login'
          )}
        </button>

        {!registering && (
          <button
            type="button"
            disabled={submitting || resettingPassword}
            className="mt-3 w-full text-center text-xs text-cyan-400 hover:underline disabled:opacity-50"
            onClick={() => void onReset(email)}
          >
            {resettingPassword ? 'Sending reset email…' : 'Forgot your password? Reset it'}
          </button>
        )}

        <button
          type="button"
          disabled={submitting}
          className="mt-5 w-full text-center text-xs text-slate-400 hover:text-slate-200 transition"
          onClick={onToggle}
        >
          {registering ? 'Already registered? Sign in' : 'Need an account? Register'}
        </button>
      </form>
    </main>
  );
}

