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

import { Incident, UserRole, CityAnalytics, ActivityNotification } from './types';
import { Language, translations } from './data/translations';
import { 
  getStoredIncidents, 
  saveStoredIncidents, 
  getStoredCitizenProfile, 
  saveStoredCitizenProfile, 
  getStoredNotifications, 
  saveStoredNotifications 
} from './services/storageService';
import { INITIAL_ANALYTICS } from './data/mockData';
import { Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';
import { subscribeToUserIncidents, saveIncidentForUser } from './services/firebase/incidents';

interface AppProps {
  demoMode?: boolean;
  authenticatedUser?: { uid: string; name: string; role: UserRole; email: string };
  onLogout?: () => Promise<void>;
}

export function App({ demoMode = false, authenticatedUser, onLogout }: AppProps) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>(authenticatedUser?.role ?? 'citizen');
  const [language, setLanguage] = useState<Language>('en');

  // Core Datasets
  const [incidents, setIncidents] = useState<Incident[]>(() => demoMode ? getStoredIncidents() : []);
  const [citizenProfile, setCitizenProfile] = useState(() => getStoredCitizenProfile());
  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => getStoredNotifications());
  const [analytics, setAnalytics] = useState<CityAnalytics>(INITIAL_ANALYTICS);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalInitialData, setReportModalInitialData] = useState<any>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedIncidentForInspection, setSelectedIncidentForInspection] = useState<Incident | null>(null);

  useEffect(() => {
    if (authenticatedUser) setUserRole(authenticatedUser.role);
  }, [authenticatedUser]);

  // Sync state to local storage
  useEffect(() => {
    if (!authenticatedUser) return;
    return subscribeToUserIncidents(authenticatedUser.uid, setIncidents, (error) => {
      console.error('Failed to subscribe to live incidents', error);
    });
  }, [authenticatedUser]);

  useEffect(() => {
    if (!demoMode) return;
    saveStoredIncidents(incidents);
    // Recalculate dynamic analytics
    const resolved = incidents.filter((i) => i.status === 'Resolved').length;
    setAnalytics((prev) => ({
      ...prev,
      totalComplaints: incidents.length,
      resolvedComplaints: resolved,
      activeComplaints: incidents.length - resolved,
      criticalComplaints: incidents.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length
    }));
  }, [demoMode, incidents]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredCitizenProfile(citizenProfile);
  }, [citizenProfile]);

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

    // Add citizen karma
    setCitizenProfile((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + 25,
      reportedCount: prev.reportedCount + 1,
    }));
  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    
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
    }
  };

  const handleImportIncidents = (importedList: Incident[]) => {
    setIncidents((prev) => [...importedList, ...prev]);
  };

  const handleOpenReportWithData = (data: any) => {
    setReportModalInitialData(data);
    setIsReportModalOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {demoMode && (
        <div role="status" className="bg-amber-500/15 border-b border-amber-400/30 px-4 py-2 text-center text-xs text-amber-200">
          DEMO MODE: data is stored only in this browser. Configure Firebase to enable live multi-user mode.
        </div>
      )}
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
        setUserRole={setUserRole}
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
              onIncidentCreatedFromVision={handleIncidentCreated}
              onOpenReportModalWithData={handleOpenReportWithData}
            />
          </div>
        )}

        {activeTab === 'vision' && (
          <AIVisionCenter
            onIncidentCreatedFromVision={handleIncidentCreated}
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
            myIncidents={incidents.filter((i) => i.citizenName === citizenProfile.name || i.citizenId === 'cit-001')}
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
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
        onClearAll={() => setNotifications([])}
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
            Autonomous Smart City Vision • YOLOv11 & Gemini 3.7 Flash Engine
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
