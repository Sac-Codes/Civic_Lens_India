import React from 'react';
import { 
  Building, 
  ShieldAlert, 
  Search, 
  Bell, 
  Globe, 
  UserCheck, 
  Sparkles, 
  Radio, 
  Layers,
  MapPin,
  Cpu,
  BarChart3,
  FileText,
  TrendingUp,
  Award,
  Users,
  Briefcase
} from 'lucide-react';
import { UserRole } from '../types';
import { Language, translations } from '../data/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  language,
  setLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenAssistant,
  onOpenReportModal
}) => {
  const t = translations[language];

  const navLinks = [
    { id: 'home', label: 'Home', icon: Building },
    { id: 'report', label: t.reportIncident, icon: ShieldAlert, highlight: true },
    { id: 'vision', label: t.visionCenter, icon: Cpu },
    { id: 'heatmap', label: t.liveHeatmap, icon: MapPin },
    { id: 'dashboard', label: t.urbanDashboard, icon: BarChart3 },
    { id: 'incidents', label: t.incidentManagement, icon: Layers },
    { id: 'command', label: t.commandCenter, icon: Radio, adminOnly: true },
    { id: 'officer', label: t.fieldConsole, icon: Briefcase, officerOnly: true },
    { id: 'departments', label: t.departmentCenter, icon: Users },
    { id: 'predictive', label: t.predictiveInsights, icon: TrendingUp },
    { id: 'citizen', label: t.citizenPortal, icon: Award },
    { id: 'reports', label: t.csvReports, icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Live Pulse */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-300 font-heading">
                  CivicLens <span className="text-cyan-400">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Smart City Operating System
              </p>
            </div>
          </div>

          {/* Primary Navigation Desktop Menu */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    item.highlight
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30'
                      : isActive
                      ? 'bg-blue-500/15 text-white border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Global Search Button */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition"
              title="Search incidents, wards, officers (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-400 rounded border border-slate-700">⌘K</kbd>
            </button>

            {/* AI Copilot Float Trigger */}
            <button
              id="ai-assistant-trigger"
              onClick={onOpenAssistant}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-semibold shadow-lg shadow-cyan-500/10 transition group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Role Switcher */}
            <div className="relative group">
              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 cursor-pointer">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="capitalize hidden lg:inline font-medium text-slate-300">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#090d16] border border-slate-800 shadow-2xl p-1.5 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Select Persona
                </div>
                {(['citizen', 'officer', 'department_head', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRole(r)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition ${
                      userRole === r ? 'bg-blue-600/20 text-blue-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{r.replace('_', ' ')}</span>
                    {userRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase font-mono text-[11px] font-medium">{language}</span>
            </button>

            {/* Notifications Trigger */}
            <button
              id="notifications-trigger-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              title="Activity Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Report Button Quick Action */}
            <button
              id="navbar-quick-report-btn"
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition transform active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report Defect</span>
            </button>

          </div>
        </div>

        {/* Secondary Navigation Scrollbar for Mobile / Medium devices */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-1 scrollbar-none border-t border-slate-800/40">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs flex items-center space-x-1.5 transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
