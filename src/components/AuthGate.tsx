import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseDiagnostics } from '../services/firebase/config';
import { getAuthErrorMessage } from '../services/firebase/auth';
import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom';
import { AdminApp } from './AdminExperience';
import { CitizenApp } from './citizen/CitizenApp';
import { AboutPage, HowItWorksPage, PublicHome, PublicLayout } from './PublicExperience';
import { Loader2, AlertCircle, ShieldCheck, Lock, Mail, User } from 'lucide-react';

export function AuthGate() {
  const location = useLocation();
  const { user, profile, loading, isConfigured, login, register, logout, resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Configuration check
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

  // Loading state (Zero flickering)
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b1120] text-slate-200 grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-semibold text-slate-400">Verifying secure civic session...</p>
        </div>
      </main>
    );
  }

  // Unauthenticated user
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
            setError('Please enter your email address to reset your password.');
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
        <Route path="/citizen/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} />
        <Route path="/admin/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} />
        <Route path="/app/*" element={<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated user
  const isAdmin = profile.role === 'admin' || profile.role === 'department_head' || profile.role === 'officer';
  const postAuthPath = new URLSearchParams(location.search).get('next');
  const defaultDashboard = isAdmin ? '/admin' : '/citizen';

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      <Route
        path="/auth"
        element={<Navigate to={postAuthPath || defaultDashboard} replace />}
      />

      {/* Legacy app redirect */}
      <Route
        path="/app/*"
        element={<Navigate to={defaultDashboard} replace />}
      />

      {/* Citizen routes */}
      <Route
        path="/citizen/*"
        element={<CitizenApp user={profile} onLogout={logout} />}
      />

      {/* Admin routes with security guard */}
      <Route
        path="/admin/*"
        element={
          isAdmin ? (
            <AdminApp user={profile} onLogout={logout} />
          ) : (
            <Navigate to="/citizen" replace />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={defaultDashboard} replace />} />
    </Routes>
  );
}

function ConfigurationRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b1120] px-4 text-slate-100">
      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">CivicLens AI</p>
        <h1 className="mt-2 text-2xl font-bold text-white">CivicLens Configuration Incomplete</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The application cannot connect to Firebase backend services.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Please configure the required Firebase environment variables in your deployment environment and redeploy.
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
    <main className="min-h-screen bg-[#0b1120] text-slate-100 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Back Link */}
        <Link to="/" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-4 transition">
          <span>← Back to CivicLens Home</span>
        </Link>

        <form
          className="civic-card p-8 shadow-2xl space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(name, email, password);
          }}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              CL
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base">CivicLens</span>
              <span className="text-cyan-400 font-bold text-xs ml-1">AI</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mt-2">
              {registering ? 'Create Citizen Account' : 'Sign In to CivicLens'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {registering
                ? 'Join your community to report and follow civic issue resolutions.'
                : 'Access your citizen reports or municipal administration workspace.'}
            </p>
          </div>

          {registering && (
            <label className="block text-xs font-semibold text-slate-300">
              Full Name
              <div className="relative mt-1.5">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  disabled={submitting}
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </label>
          )}

          <label className="block text-xs font-semibold text-slate-300">
            Email Address
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                disabled={submitting}
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </label>

          <label className="block text-xs font-semibold text-slate-300">
            Password
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                disabled={submitting}
                minLength={6}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </label>

          {error && (
            <div role="alert" className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div role="status" className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || resettingPassword}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition focus-visible:outline-none disabled:opacity-60 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{registering ? 'Creating Account…' : 'Signing In…'}</span>
              </>
            ) : (
              <span>{registering ? 'Register as Citizen' : 'Sign In'}</span>
            )}
          </button>

          {!registering && (
            <button
              type="button"
              disabled={submitting || resettingPassword}
              className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 transition disabled:opacity-50"
              onClick={() => void onReset(email)}
            >
              {resettingPassword ? 'Sending reset email…' : 'Forgot your password? Reset it'}
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              disabled={submitting}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
              onClick={onToggle}
            >
              {registering ? 'Already have an account? Sign In' : 'Need an account? Register as Citizen'}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
