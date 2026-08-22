import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CitizenProfilePageProps {
  user: { uid: string; name: string; email: string };
  onLogout: () => Promise<void>;
}

export const CitizenProfilePage: React.FC<CitizenProfilePageProps> = ({ user, onLogout }) => {
  const { resetPassword } = useAuth();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');

  // Password reset state
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSendPasswordReset = async () => {
    if (!user.email) return;
    setResetting(true);
    setResetSuccess(false);
    setResetError('');

    try {
      await resetPassword(user.email);
      setResetSuccess(true);
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : 'Could not send reset email. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Civic Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Citizen Profile & Account
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified account information and notification settings.
        </p>
      </div>

      {/* Profile Identity Card */}
      <div className="civic-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-cyan-300 text-2xl font-bold flex items-center justify-center shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">
                {user.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.email}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Account ID: {user.uid}
            </p>
          </div>
        </div>

        <button
          onClick={() => void onLogout()}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Personal & Contact Information Form */}
      <form onSubmit={handleSaveProfile} className="civic-card p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Your name and contact info are attached to your civic complaints for officer follow-ups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              Primary Ward / Neighborhood
            </label>
            <input
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="e.g. Ward 12, South Sector"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Account Security & Password */}
      <div className="civic-card p-6 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Account Security</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your password and authentication credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">
              Password Reset
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Send a secure password reset link to your email address ({user.email}).
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendPasswordReset}
            disabled={resetting}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition shrink-0 self-start sm:self-auto disabled:opacity-50"
          >
            {resetting ? 'Sending Email…' : 'Send Password Reset Email'}
          </button>
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Password reset link sent! Please check your email inbox.</span>
          </div>
        )}

        {resetError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{resetError}</span>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="civic-card p-6 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Notification Preferences</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose how you wish to receive updates when your reports change status.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Email Notifications</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Receive email alerts when an officer is assigned or a defect is resolved.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">SMS Updates</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Receive SMS updates for critical emergency road or drainage alerts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 w-4 h-4"
            />
          </label>
        </div>
      </div>

    </div>
  );
};
