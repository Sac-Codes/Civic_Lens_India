import React, { useEffect, useState } from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { Incident, ActivityNotification } from '../../types';
import { subscribeToIncidents } from '../../services/firebase/incidents';
import { 
  subscribeToUserNotifications, 
  markNotificationRead, 
  deleteNotification 
} from '../../services/firebase/notifications';
import { CitizenDashboard } from './CitizenDashboard';
import { ReportIssueFlow } from './ReportIssueFlow';
import { CitizenReportsPage } from './CitizenReportsPage';
import { CitizenReportDetails } from './CitizenReportDetails';
import { CitizenProfilePage } from './CitizenProfilePage';
import { CitizenNotificationsPage } from './CitizenNotificationsPage';

interface CitizenAppProps {
  user: { uid: string; name: string; email: string };
  onLogout: () => Promise<void>;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to authenticated citizen's incidents from Firestore
  useEffect(() => {
    return subscribeToIncidents(user.uid, 'citizen', undefined, setIncidents, (error) => {
      console.error('Failed to load citizen incidents:', error);
    });
  }, [user.uid]);

  // Subscribe to authenticated citizen's notifications from Firestore
  useEffect(() => {
    return subscribeToUserNotifications(user.uid, setNotifications, (error) => {
      console.error('Failed to load notifications:', error);
    });
  }, [user.uid]);

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const handleIncidentCreated = (newInc: Incident) => {
    setIncidents((prev) => [newInc, ...prev.filter((i) => i.id !== newInc.id)]);
  };

  const navLinks = [
    { to: '/citizen', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/reports', label: 'My Reports', icon: FileText },
    { to: '/citizen/report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { to: '/citizen/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/citizen/profile', label: 'Profile', icon: User },
  ];

  const isCurrent = (path: string) => {
    if (path === '/citizen') {
      return location.pathname === '/citizen' || location.pathname === '/citizen/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-cyan-200">
      
      {/* Citizen Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/citizen" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              CL
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base tracking-tight">
                CivicLens
              </span>
              <span className="ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                Citizen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.to);

              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="ml-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 transition shadow-sm shadow-blue-500/20"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                    active 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {Boolean(link.badge) && link.badge! > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Status & Logout */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/citizen/profile"
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs text-slate-300 group-hover:text-white truncate max-w-[120px]">
                {user.name}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => void onLogout()}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => navigate('/citizen/notifications')}
              className="relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0f172a] px-4 py-4 space-y-2">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-300 font-bold flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1 pt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isCurrent(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      active ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {Boolean(link.badge) && link.badge! > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void onLogout();
                }}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-950/30 transition text-left mt-3 pt-3 border-t border-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CitizenDashboard user={user} myIncidents={incidents} />} />
          <Route path="/dashboard" element={<CitizenDashboard user={user} myIncidents={incidents} />} />
          <Route path="/report" element={<ReportIssueFlow user={user} existingIncidents={incidents} onIncidentCreated={handleIncidentCreated} />} />
          <Route path="/reports" element={<CitizenReportsPage myIncidents={incidents} />} />
          <Route path="/reports/:id" element={<CitizenReportDetails incidents={incidents} />} />
          <Route path="/profile" element={<CitizenProfilePage user={user} onLogout={onLogout} />} />
          <Route
            path="/notifications"
            element={
              <CitizenNotificationsPage
                notifications={notifications}
                onMarkAllRead={() => {
                  notifications.forEach((n) => void markNotificationRead(n.id));
                  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
                }}
                onClearAll={() => {
                  notifications.forEach((n) => void deleteNotification(n.id));
                  setNotifications([]);
                }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/citizen" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#090e1a] py-6 text-xs text-slate-500 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CivicLens AI • Modern Civic Infrastructure Platform
          </p>
          <p className="text-[11px]">
            Reports are stored securely and routed directly to municipal departments.
          </p>
        </div>
      </footer>

    </div>
  );
};
