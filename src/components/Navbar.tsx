import React, { useEffect, useRef, useState } from 'react';
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
  Briefcase,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { Language, translations } from '../data/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
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
  language,
  setLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenAssistant,
  onOpenReportModal
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const roleNavigation: Record<UserRole, string[]> = {
    citizen: ['home', 'report', 'vision', 'heatmap', 'citizen'],
    officer: ['home', 'incidents', 'heatmap', 'officer'],
    department_head: ['home', 'incidents', 'heatmap', 'dashboard', 'departments', 'predictive'],
    admin: navLinks.map((item) => item.id),
  };
  const visibleNavLinks = navLinks.filter((item) => roleNavigation[userRole].includes(item.id));

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderNavLink = (item: (typeof navLinks)[number], compact = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        id={`nav-btn-${item.id}`}
        type="button"
        onClick={() => handleTabChange(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          compact ? 'px-2.5 py-2 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          item.highlight
            ? 'border border-blue-500/30 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30'
            : isActive
            ? 'border border-blue-500/40 bg-blue-500/15 text-white shadow-sm'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        }`}
      >
        <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#020617]/95 shadow-2xl backdrop-blur-xl">
      <div className="relative mx-auto max-w-[1600px] px-2 sm:px-5 lg:px-8">
        <div className="relative z-40 flex min-h-16 items-center gap-3">
          {/* Brand & Live Pulse */}
          <button type="button" className="flex min-w-0 shrink-0 items-center gap-2 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:gap-2.5" onClick={() => handleTabChange('home')} aria-label="Go to CivicLens home">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-px shadow-lg shadow-blue-500/20 sm:h-10 sm:w-10">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090d16]">
                <Cpu className="h-5 w-5 animate-pulse text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text font-heading text-[15px] font-bold tracking-tight text-transparent sm:text-lg">
                  CivicLens <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden shrink-0 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 sm:inline-flex">
                  <span className="mr-1 h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>
              <p className="hidden truncate text-[10px] tracking-wide text-slate-400 sm:block">
                Smart City Operating System
              </p>
            </div>
          </button>

          {/* Wide desktop navigation stays in the flexible middle region. */}
          <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-1 min-[1440px]:flex">
            {visibleNavLinks.slice(0, 7).map((item) => {
              return renderNavLink(item);
            })}
            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label="Open more navigation options">
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </nav>

          {/* Right tools remain fixed-size and never compete with the brand. */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Global Search Button */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              type="button"
              className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:px-3"
              title="Search incidents, wards, officers (Cmd+K)"
              aria-label="Search incidents, wards, and officers"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden min-[1440px]:inline">Search...</span>
              <kbd className="hidden min-[1440px]:inline-block rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">⌘K</kbd>
            </button>

            {/* AI Copilot Float Trigger */}
            <button
              id="ai-assistant-trigger"
              onClick={onOpenAssistant}
              type="button"
              className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 px-2.5 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10 transition hover:border-cyan-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-[1440px]:flex"
              aria-label="Open AI Copilot"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:rotate-12" />
              <span>AI Copilot</span>
            </button>

            {/* Authenticated role indicator */}
            <div className="hidden h-9 max-w-36 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-200 min-[1440px]:flex">
                <UserCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                <span className="min-w-0 truncate font-medium capitalize text-slate-300">
                  {userRole.replace('_', ' ')}
                </span>
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-0 text-xs text-slate-300 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:w-auto sm:justify-start sm:px-2"
              title="Switch Language"
              aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-mono text-[11px] font-medium uppercase max-[399px]:hidden">{language}</span>
            </button>

            {/* Notifications Trigger */}
            <button
              id="notifications-trigger-btn"
              onClick={onOpenNotifications}
              type="button"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Activity Notifications"
              aria-label={`Activity notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell className="h-4 w-4 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white shadow-md animate-bounce">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Report Button Quick Action */}
            <button
              id="navbar-quick-report-btn"
              onClick={onOpenReportModal}
              type="button"
              className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 min-[1440px]:flex"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Report Defect</span>
            </button>

            <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-[1440px]:hidden" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && <button type="button" aria-label="Dismiss navigation menu" onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-20 bg-slate-950/60 min-[1440px]:hidden" />}
        <div id="mobile-navigation" className={`absolute inset-x-0 top-full z-30 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-800 bg-[#090d16] px-3 py-3 shadow-2xl min-[1440px]:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <nav aria-label="Mobile navigation" className="grid gap-1 sm:grid-cols-2">
            {visibleNavLinks.map((item) => renderNavLink(item, true))}
          </nav>
          <div className="mt-3 grid gap-2 border-t border-slate-800/80 pt-3 sm:grid-cols-2">
            <button type="button" onClick={() => { onOpenAssistant(); setIsMobileMenuOpen(false); }} className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              <Sparkles className="h-4 w-4" /> AI Copilot
            </button>
            <button type="button" onClick={() => { onOpenReportModal(); setIsMobileMenuOpen(false); }} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              <ShieldAlert className="h-4 w-4" /> Report Defect
            </button>
            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 sm:col-span-2"><UserCheck className="h-4 w-4 shrink-0 text-blue-400" /><span className="truncate capitalize">{userRole.replace('_', ' ')}</span></div>
          </div>
        </div>
      </div>
    </header>
  );
};
