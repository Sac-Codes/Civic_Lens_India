import React, { useEffect, useState } from 'react';
import { BarChart3, Bell, Building2, ChevronRight, FileText, LayoutDashboard, LogOut, Map, Menu, Search, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CityCommandCenter } from './CityCommandCenter';
import { CsvReportCenter } from './CsvReportCenter';
import { DepartmentCenter } from './DepartmentCenter';
import { FieldOperationsConsole } from './FieldOperationsConsole';
import { GlobalSearchModal } from './GlobalSearchModal';
import { IncidentManagement } from './IncidentManagement';
import { LiveCityHeatmap } from './LiveCityHeatmap';
import { NotificationsDrawer } from './NotificationsDrawer';
import { PredictiveInsights } from './PredictiveInsights';
import { UrbanIntelligenceDashboard } from './UrbanIntelligenceDashboard';
import { ActivityNotification, CityAnalytics, Incident, UserRole } from '../types';
import { subscribeToIncidents, updateIncident } from '../services/firebase/incidents';
import { deleteNotification, markNotificationRead, subscribeToUserNotifications } from '../services/firebase/notifications';

interface AdminUser { uid: string; name: string; email: string; role: UserRole; department?: string; }
interface AdminAppProps { user: AdminUser; onLogout: () => Promise<void>; }

function analyticsFor(incidents: Incident[]): CityAnalytics {
  const resolved = incidents.filter((incident) => incident.status === 'Resolved');
  const durations = resolved.flatMap((incident) => incident.resolvedAt ? [(Date.parse(incident.resolvedAt) - Date.parse(incident.createdAt)) / 3_600_000] : []).filter((hours) => Number.isFinite(hours) && hours >= 0);
  return { totalComplaints: incidents.length, resolvedComplaints: resolved.length, activeComplaints: incidents.filter((incident) => !['Resolved', 'Rejected'].includes(incident.status)).length, criticalComplaints: incidents.filter((incident) => incident.severity === 'Critical' && incident.status !== 'Resolved').length, inProgressComplaints: incidents.filter((incident) => incident.status === 'In Progress').length, cityHealthScore: null, aiTriageAccuracy: null, avgResponseTimeHours: durations.length ? durations.reduce((sum, hours) => sum + hours, 0) / durations.length : null, duplicateComplaintsPrevented: incidents.reduce((sum, incident) => sum + Math.max(0, incident.duplicateCount - 1), 0), estimatedBudgetSaved: null, citizenSatisfactionRate: null };
}

const links = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/incidents', label: 'Incidents', icon: FileText },
  { path: '/admin/map', label: 'Incident map', icon: Map },
  { path: '/admin/departments', label: 'Departments', icon: Building2 },
  { path: '/admin/officers', label: 'Officers', icon: Users },
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

  useEffect(() => subscribeToIncidents(user.uid, 'admin', user.department, setIncidents, (error) => console.error('Failed to load admin incidents', error)), [user.uid, user.department]);
  useEffect(() => subscribeToUserNotifications(user.uid, setNotifications, (error) => console.error('Failed to load admin notifications', error)), [user.uid]);

  const analytics = analyticsFor(incidents);
  const update = (incident: Incident) => { setIncidents((current) => current.map((item) => item.id === incident.id ? incident : item)); void updateIncident(incident).catch((error) => console.error('Failed to update incident', error)); };
  const active = links.find((link) => link.path === location.pathname)?.label ?? (location.pathname.startsWith('/admin/incidents') ? 'Incidents' : 'Admin');
  const go = (path: string) => { navigate(path); setMobileOpen(false); };

  const renderContent = () => {
    if (location.pathname.startsWith('/admin/incidents')) return <IncidentManagement incidents={incidents} onUpdateIncident={update} onSelectIncident={() => undefined} />;
    if (location.pathname === '/admin/map') return <LiveCityHeatmap incidents={incidents} onSelectIncident={() => go('/admin/incidents')} />;
    if (location.pathname === '/admin/departments') return <DepartmentCenter incidents={incidents} onSelectDepartmentIncidents={() => go('/admin/incidents')} />;
    if (location.pathname === '/admin/officers') return <FieldOperationsConsole incidents={incidents} onUpdateIncident={update} />;
    if (location.pathname === '/admin/notifications') return <div className="mx-auto max-w-4xl px-4 py-8"><section className="glass-panel rounded-2xl border border-slate-800 p-6"><h1 className="font-heading text-2xl font-bold text-white">Notifications</h1><p className="mt-1 text-sm text-slate-400">Incident activity addressed to your administrator account.</p>{notifications.length === 0 && <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-500">You're all caught up.</div>}</section></div>;
    if (location.pathname === '/admin/settings') return <div className="mx-auto max-w-4xl px-4 py-8"><section className="glass-panel rounded-2xl border border-dashed border-slate-700 p-12 text-center"><Settings className="mx-auto h-8 w-8 text-slate-600" /><h1 className="mt-4 text-xl font-bold text-white">Settings</h1><p className="mt-2 text-sm text-slate-500">Administrative settings will appear when their Firebase configuration is available.</p></section></div>;
    return <UrbanIntelligenceDashboard analytics={analytics} incidents={incidents} />;
  };

  return <div className="min-h-screen bg-[#020617] text-slate-100"><div className={`fixed inset-0 z-40 bg-black/60 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={() => setMobileOpen(false)} /><aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#090d16] transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-16 items-center justify-between border-b border-slate-800 px-5"><button type="button" onClick={() => go('/admin')} className="flex items-center gap-2 font-heading text-lg font-bold text-white">CivicLens <span className="text-cyan-400">Admin</span></button><button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Close admin navigation"><X className="h-5 w-5" /></button></div><nav aria-label="Admin navigation" className="flex-1 space-y-1 p-3">{links.map(({ path, label, icon: Icon }) => <button type="button" key={path} onClick={() => go(path)} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition ${location.pathname === path || (path === '/admin/incidents' && location.pathname.startsWith('/admin/incidents/')) ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav><div className="border-t border-slate-800 p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-500/15 text-cyan-300">{user.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{user.name}</p><p className="truncate text-xs capitalize text-slate-500">{user.role.replace('_', ' ')}</p></div></div><button type="button" onClick={() => void onLogout()} className="mt-4 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button></div></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-800/80 bg-[#020617]/95 px-4 backdrop-blur-xl sm:px-6"><div className="flex items-center gap-3"><button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-800 p-2 text-slate-300 lg:hidden" aria-label="Open admin navigation"><Menu className="h-5 w-5" /></button><div><p className="text-xs text-slate-500">Admin workspace</p><h1 className="text-sm font-semibold text-white">{active}</h1></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => setSearchOpen(true)} className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white" aria-label="Search incidents"><Search className="h-4 w-4" /></button><button type="button" onClick={() => setNotificationsOpen(true)} className="relative rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white" aria-label={`Notifications${notifications.length ? `, ${notifications.length} available` : ''}`}><Bell className="h-4 w-4" />{notifications.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">{notifications.length > 99 ? '99+' : notifications.length}</span>}</button><span className="hidden items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs capitalize text-slate-300 sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />{user.role.replace('_', ' ')}</span></div></header><main>{renderContent()}</main></div><GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} incidents={incidents} onSelectIncident={() => { setSearchOpen(false); go('/admin/incidents'); }} onNavigateTab={() => go('/admin/incidents')} /><NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} notifications={notifications} onMarkAllRead={() => { notifications.forEach((item) => void markNotificationRead(item.id)); setNotifications((current) => current.map((item) => ({ ...item, read: true, isRead: true }))); }} onClearAll={() => { notifications.forEach((item) => void deleteNotification(item.id)); setNotifications([]); }} /></div>;
};
