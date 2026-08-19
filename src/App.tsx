import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { AIVisionCenter } from './components/AIVisionCenter';
import { LiveCityHeatmap } from './components/LiveCityHeatmap';
import { UrbanIntelligenceDashboard } from './components/UrbanIntelligenceDashboard';
import { IncidentManagement } from './components/IncidentManagement';
import { CityCommandCenter } from './components/CityCommandCenter';
import { FieldOperationsConsole } from './components/FieldOperationsConsole';
import { DepartmentCenter } from './components/DepartmentCenter';
import { PredictiveInsights } from './components/PredictiveInsights';
import { CitizenPortal } from './components/CitizenPortal';
import { CsvReportCenter } from './components/CsvReportCenter';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

import { Incident, UserRole, CityAnalytics, ActivityNotification, CitizenProfile } from './types';
import { Language } from './data/translations';
import { Sparkles } from 'lucide-react';
import { subscribeToIncidents, saveIncidentForUser, updateIncident } from './services/firebase/incidents';
import { deleteNotification, markNotificationRead, saveNotification, subscribeToUserNotifications } from './services/firebase/notifications';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppProps {
  authenticatedUser: { uid: string; name: string; role: UserRole; email: string; department?: string };
  onLogout?: () => Promise<void>;
}

function deriveAnalytics(incidents: Incident[]): CityAnalytics {
  const resolved = incidents.filter((incident) => incident.status === 'Resolved');
  const responseHours = resolved.flatMap((incident) => {
    if (!incident.resolvedAt) return [];
    const hours = (Date.parse(incident.resolvedAt) - Date.parse(incident.createdAt)) / 3_600_000;
    return Number.isFinite(hours) && hours >= 0 ? [hours] : [];
  });
  return {
    totalComplaints: incidents.length,
    resolvedComplaints: resolved.length,
    activeComplaints: incidents.filter((incident) => !['Resolved', 'Rejected'].includes(incident.status)).length,
    criticalComplaints: incidents.filter((incident) => incident.severity === 'Critical' && incident.status !== 'Resolved').length,
    inProgressComplaints: incidents.filter((incident) => incident.status === 'In Progress').length,
    cityHealthScore: null,
    aiTriageAccuracy: null,
    avgResponseTimeHours: responseHours.length ? responseHours.reduce((total, hours) => total + hours, 0) / responseHours.length : null,
    duplicateComplaintsPrevented: incidents.reduce((total, incident) => total + Math.max(0, incident.duplicateCount - 1), 0),
    estimatedBudgetSaved: null,
    citizenSatisfactionRate: null,
  };
}

export function App({ authenticatedUser, onLogout }: AppProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(() => {
    const segment = location.pathname.split('/')[2];
    return segment === 'report' || segment === 'citizen' || segment === 'vision' || segment === 'heatmap' || segment === 'dashboard' || segment === 'incidents' || segment === 'command' || segment === 'officer' || segment === 'departments' || segment === 'predictive' || segment === 'reports' ? segment : 'home';
  });
  const [userRole, setUserRole] = useState<UserRole>(authenticatedUser.role);
  const [language, setLanguage] = useState<Language>('en');

  // Core Datasets
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(() => ({
    id: authenticatedUser.uid,
    name: authenticatedUser.name,
    email: authenticatedUser.email,
    phone: '',
    ward: '',
    karmaPoints: 0,
    badges: [],
  }));
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalInitialData, setReportModalInitialData] = useState<any>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedIncidentForInspection, setSelectedIncidentForInspection] = useState<Incident | null>(null);

  const analytics = deriveAnalytics(incidents);

  useEffect(() => {
    setUserRole(authenticatedUser.role);
    setCitizenProfile((profile) => ({ ...profile, id: authenticatedUser.uid, name: authenticatedUser.name, email: authenticatedUser.email }));
  }, [authenticatedUser]);

  useEffect(() => {
    const target = activeTab === 'home' ? '/app' : `/app/${activeTab}`;
    if (location.pathname.startsWith('/app') && location.pathname !== target) navigate(target, { replace: true });
  }, [activeTab, location.pathname, navigate]);

  // Core records are read from Firestore according to the authenticated role.
  useEffect(() => {
    return subscribeToIncidents(authenticatedUser.uid, authenticatedUser.role, authenticatedUser.department, setIncidents, (error) => {
      console.error('Failed to load incidents', error);
    });
  }, [authenticatedUser.uid, authenticatedUser.role, authenticatedUser.department]);

  useEffect(() => {
    return subscribeToUserNotifications(authenticatedUser.uid, setNotifications, (error) => {
      console.error('Failed to load notifications', error);
    });
  }, [authenticatedUser.uid]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Incident Handlers
  const handleIncidentCreated = (newInc: Incident) => {
    if (authenticatedUser) {
      void saveIncidentForUser(newInc, authenticatedUser.uid).catch((error: unknown) => {
        console.error('Failed to save incident to Firestore', error);
      });
    }
    setIncidents((prev) => [newInc, ...prev]);

    // Add activity notification
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: `New Incident Logged: ${newInc.id}`,
      message: `${newInc.category} reported at ${newInc.address} (${newInc.ward}). Routed to ${newInc.department}.`,
      timestamp: new Date().toISOString(),
      type: newInc.severity === 'Critical' ? 'danger' : 'info',
      isRead: false,
      incidentId: newInc.id
    };
    setNotifications((prev) => [newNotif, ...prev]);
    void saveNotification(newNotif, authenticatedUser.uid).catch((error: unknown) => {
      console.error('Failed to save notification', error);
    });

  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    void updateIncident(updated).catch((error: unknown) => {
      console.error('Failed to update incident in Firestore', error);
    });
    
    if (updated.status === 'Resolved') {
      const resNotif: ActivityNotification = {
        id: `notif-res-${Date.now()}`,
        title: `Case Resolved: ${updated.id}`,
        message: `${updated.title} has been resolved & verified by field operations.`,
        timestamp: new Date().toISOString(),
        type: 'success',
        isRead: false,
        incidentId: updated.id
      };
      setNotifications((prev) => [resNotif, ...prev]);
      void saveNotification(resNotif, updated.reportedBy || authenticatedUser.uid).catch((error: unknown) => {
        console.error('Failed to save resolution notification', error);
      });
    }
  };

  const handleImportIncidents = (importedList: Incident[]) => {
    setIncidents((prev) => [...importedList, ...prev]);
    importedList.forEach((incident) => {
      void saveIncidentForUser(incident, authenticatedUser.uid).catch((error: unknown) => {
        console.error('Failed to import incident into Firestore', error);
      });
    });
  };

  const handleOpenReportWithData = (data: any) => {
    setReportModalInitialData(data);
    setIsReportModalOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {authenticatedUser && onLogout && (
        <button type="button" onClick={() => void onLogout()} className="fixed bottom-6 left-6 z-40 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-300">
          Sign out {authenticatedUser.name}
        </button>
      )}
      
      {/* Top Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        language={language}
        setLanguage={setLanguage}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenReportModal={() => {
          setReportModalInitialData(null);
          setIsReportModalOpen(true);
        }}
      />

      {/* Main Viewport Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroLanding
            analytics={analytics}
            recentIncidents={incidents}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenReportModal={() => {
              setReportModalInitialData(null);
              setIsReportModalOpen(true);
            }}
            onOpenVisionCenter={() => setActiveTab('vision')}
            language={language}
          />
        )}

        {activeTab === 'report' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <AIVisionCenter
              onOpenReportModalWithData={handleOpenReportWithData}
            />
          </div>
        )}

        {activeTab === 'vision' && (
          <AIVisionCenter
            onOpenReportModalWithData={handleOpenReportWithData}
          />
        )}

        {activeTab === 'heatmap' && (
          <LiveCityHeatmap
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncidentForInspection(inc);
              setActiveTab('incidents');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <UrbanIntelligenceDashboard
            analytics={analytics}
            incidents={incidents}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentManagement
            incidents={incidents}
            onUpdateIncident={handleUpdateIncident}
            onSelectIncident={(inc) => setSelectedIncidentForInspection(inc)}
          />
        )}

        {activeTab === 'command' && (
          <CityCommandCenter
            incidents={incidents}
            analytics={analytics}
            onSelectIncident={(inc) => {
              setSelectedIncidentForInspection(inc);
              setActiveTab('incidents');
            }}
          />
        )}

        {activeTab === 'officer' && (
          <FieldOperationsConsole
            incidents={incidents}
            onUpdateIncident={handleUpdateIncident}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentCenter
            incidents={incidents}
            onSelectDepartmentIncidents={() => setActiveTab('incidents')}
          />
        )}

        {activeTab === 'predictive' && (
          <PredictiveInsights />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            citizenProfile={citizenProfile}
            myIncidents={incidents.filter((incident) => incident.reportedBy === authenticatedUser.uid || incident.citizenId === authenticatedUser.uid)}
            onOpenReportModal={() => {
              setReportModalInitialData(null);
              setIsReportModalOpen(true);
            }}
            onSelectIncident={(inc) => {
              setSelectedIncidentForInspection(inc);
              setActiveTab('incidents');
            }}
          />
        )}

        {activeTab === 'reports' && (
          <CsvReportCenter
            incidents={incidents}
            analytics={analytics}
            onImportIncidents={handleImportIncidents}
          />
        )}
      </main>

      {/* Floating Action Button for AI Copilot */}
      <button
        id="floating-ai-copilot-btn"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group"
        title="Open AI Smart City Copilot"
      >
        <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">Ask Aria</span>
      </button>

      {/* Modals and Drawers */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onIncidentCreated={handleIncidentCreated}
        initialData={reportModalInitialData}
        allExistingIncidents={incidents}
        reporter={{ id: authenticatedUser.uid, name: authenticatedUser.name, phone: citizenProfile.phone }}
      />

      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        analytics={analytics}
        incidents={incidents}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        incidents={incidents}
        onSelectIncident={(inc) => {
          setSelectedIncidentForInspection(inc);
          setActiveTab('incidents');
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          notifications.filter((notification) => !notification.isRead).forEach((notification) => void markNotificationRead(notification.id));
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
        }}
        onClearAll={() => {
          notifications.forEach((notification) => void deleteNotification(notification.id));
          setNotifications([]);
        }}
      />

      {/* Footer */}
      <footer className="w-full bg-[#01040f] border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">CivicLens AI Operating System</span>
            <span>•</span>
            <span>Metropolis Municipal Infrastructure</span>
          </div>
          <p className="text-[11px]">
            AI-assisted civic reporting and response
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
