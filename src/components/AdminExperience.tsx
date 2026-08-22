import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Plus,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLocation, useNavigate, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CityCommandCenter } from './CityCommandCenter';
import { CsvReportCenter } from './CsvReportCenter';
import { DepartmentCenter } from './DepartmentCenter';
import { FieldOperationsConsole } from './FieldOperationsConsole';
import { GlobalSearchModal } from './GlobalSearchModal';
import { IncidentManagement } from './IncidentManagement';
import { LiveCityHeatmap } from './LiveCityHeatmap';
import { NotificationsDrawer } from './NotificationsDrawer';
import { UrbanIntelligenceDashboard } from './UrbanIntelligenceDashboard';
import { ActivityNotification, CityAnalytics, Incident, UserRole } from '../types';
import { subscribeToIncidents, updateIncident } from '../services/firebase/incidents';
import {
  deleteNotification,
  markNotificationRead,
  subscribeToUserNotifications
} from '../services/firebase/notifications';

interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AdminAppProps {
  user: AdminUser;
  onLogout: () => Promise<void>;
}

function deriveAnalytics(incidents: Incident[]): CityAnalytics {
  const resolved = incidents.filter((incident) => incident.status === 'Resolved');
  const durations = resolved
    .flatMap((incident) => incident.resolvedAt ? [(Date.parse(incident.resolvedAt) - Date.parse(incident.createdAt)) / 3_600_000] : [])
    .filter((hours) => Number.isFinite(hours) && hours >= 0);

  return {
    totalComplaints: incidents.length,
    resolvedComplaints: resolved.length,
    activeComplaints: incidents.filter((incident) => !['Resolved', 'Rejected'].includes(incident.status)).length,
    criticalComplaints: incidents.filter((incident) => incident.severity === 'Critical' && incident.status !== 'Resolved').length,
    inProgressComplaints: incidents.filter((incident) => incident.status === 'In Progress' || incident.status === 'Assigned').length,
    cityHealthScore: null,
    aiTriageAccuracy: null,
    avgResponseTimeHours: durations.length ? Math.round((durations.reduce((sum, h) => sum + h, 0) / durations.length) * 10) / 10 : null,
    duplicateComplaintsPrevented: incidents.reduce((sum, incident) => sum + Math.max(0, incident.duplicateCount - 1), 0),
    estimatedBudgetSaved: null,
    citizenSatisfactionRate: null
  };
}

const adminNavLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/incidents', label: 'Incidents', icon: FileText },
  { path: '/admin/map', label: 'Incident Map', icon: Map },
  { path: '/admin/departments', label: 'Departments', icon: Building2 },
  { path: '/admin/officers', label: 'Officers & Field', icon: Users },
  { path: '/admin/reports', label: 'CSV Reports', icon: BarChart3 },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminApp: React.FC<AdminAppProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Subscribe to incidents based on role & scope
  useEffect(() => {
    return subscribeToIncidents(
      user.uid,
      user.role,
      user.department,
      setIncidents,
      (error) => console.error('Failed to load admin incidents:', error)
    );
  }, [user.uid, user.role, user.department]);

  // Subscribe to notifications
  useEffect(() => {
    return subscribeToUserNotifications(
      user.uid,
      setNotifications,
      (error) => console.error('Failed to load admin notifications:', error)
    );
  }, [user.uid]);

  const analytics = deriveAnalytics(incidents);

  const handleUpdateIncident = (incident: Incident) => {
    setIncidents((curr) => curr.map((item) => (item.id === incident.id ? incident : item)));
    void updateIncident(incident).catch((error) => console.error('Failed to update incident:', error));
  };

  const handleImportIncidents = (imported: Incident[]) => {
    setIncidents((curr) => [...imported, ...curr]);
  };

  const activeNav = adminNavLinks.find((link) => {
    if (link.path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(link.path);
  })?.label || 'Admin Workspace';

  const unreadNotifCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-cyan-200">

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0f172a] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <Link to="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              CL
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base tracking-tight">
                CivicLens
              </span>
              <span className="ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-cyan-300 border border-blue-500/30">
                Admin
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {adminNavLinks.map(({ path, label, icon: Icon }) => {
            const active = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);
            return (
              <button
                key={path}
                type="button"
                onClick={() => {
                  navigate(path);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {path === '/admin/notifications' && unreadNotifCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar User Footer */}
        <div className="border-t border-slate-800 p-4 bg-[#0c1424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-300 font-bold flex items-center justify-center shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user.name}</p>
              <p className="truncate text-[10px] capitalize text-slate-400">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void onLogout()}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="lg:pl-64 flex flex-col flex-1">

        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f172a]/95 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl border border-slate-800 text-slate-300 lg:hidden hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Municipal Operations
              </p>
              <h1 className="text-sm sm:text-base font-bold text-white">{activeNav}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Search Incidents"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 capitalize">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user.role.replace('_', ' ')}</span>
            </span>
          </div>
        </header>

        {/* Admin Routed Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={<UrbanIntelligenceDashboard analytics={analytics} incidents={incidents} />}
            />
            <Route
              path="/incidents/*"
              element={
                <IncidentManagement
                  incidents={incidents}
                  onUpdateIncident={handleUpdateIncident}
                  onSelectIncident={() => undefined}
                />
              }
            />
            <Route
              path="/map"
              element={
                <LiveCityHeatmap
                  incidents={incidents}
                  onSelectIncident={() => navigate('/admin/incidents')}
                />
              }
            />
            <Route
              path="/departments"
              element={
                <DepartmentCenter
                  incidents={incidents}
                  onSelectDepartmentIncidents={() => navigate('/admin/incidents')}
                />
              }
            />
            <Route
              path="/officers"
              element={
                <FieldOperationsConsole
                  incidents={incidents}
                  onUpdateIncident={handleUpdateIncident}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <CsvReportCenter
                  incidents={incidents}
                  analytics={analytics}
                  onImportIncidents={handleImportIncidents}
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Admin Notifications</h2>
                      <p className="text-xs text-slate-400">Incident dispatch and escalation alerts</p>
                    </div>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="civic-card p-12 text-center text-xs text-slate-500">
                      No administrative notifications at this time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((n) => (
                        <div key={n.id} className="civic-card p-4 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{n.title}</p>
                            <p className="text-slate-300 text-[11px] mt-0.5">{n.message}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="max-w-3xl mx-auto py-8">
                  <div className="civic-card p-8 space-y-4 text-center">
                    <Settings className="w-10 h-10 text-slate-600 mx-auto" />
                    <h2 className="text-lg font-bold text-white">Platform Settings</h2>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Administrative SLA configurations, ward boundary coordinates, and automated dispatch thresholds can be adjusted through Firebase.
                    </p>
                  </div>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        incidents={incidents}
        onSelectIncident={() => {
          setSearchOpen(false);
          navigate('/admin/incidents');
        }}
        onNavigateTab={() => navigate('/admin/incidents')}
      />

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          notifications.forEach((item) => void markNotificationRead(item.id));
          setNotifications((curr) => curr.map((item) => ({ ...item, read: true, isRead: true })));
        }}
        onClearAll={() => {
          notifications.forEach((item) => void deleteNotification(item.id));
          setNotifications([]);
        }}
      />

    </div>
  );
};
