import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileSearch,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trash2,
  Construction,
  Lightbulb,
  Droplet,
  AlertTriangle,
  HelpCircle,
  Clock,
  Send,
  Building2,
  Users
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
];

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-cyan-200">
      {/* Public Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0f172a]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              CL
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base tracking-tight">
                CivicLens
              </span>
              <span className="text-cyan-400 font-bold text-xs ml-1">AI</span>
            </div>
          </Link>

          <nav aria-label="Public navigation" className="hidden items-center gap-1 sm:flex text-xs font-semibold">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-3.5 py-2 transition hover:bg-slate-800 hover:text-white ${
                  location.pathname === link.to ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/auth?next=/citizen/report"
              className="ml-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-bold transition hover:bg-blue-500 shadow-sm shadow-blue-500/20"
            >
              Report an Issue
            </Link>

            <Link
              to="/auth"
              className="ml-1 rounded-xl border border-slate-700 hover:border-slate-600 px-3.5 py-2 text-slate-300 transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/auth?next=/citizen/report"
              className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
            >
              Report
            </Link>
            <Link
              to="/auth"
              className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-[#090e1a] py-12 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                CL
              </div>
              <span className="font-bold text-white text-sm">CivicLens AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An AI-assisted civic issue reporting and municipal management platform. Empowering citizens and municipal teams for faster, accountable issue resolution.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Citizens</p>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/auth?next=/citizen/report" className="hover:text-white transition">Report an Issue</Link></li>
              <li><Link to="/auth?next=/citizen/reports" className="hover:text-white transition">Track Reports</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Administration</p>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/auth?next=/admin" className="hover:text-white transition">Admin Portal</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About the Platform</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CivicLens AI. All rights reserved.</p>
          <p>Built for public transparency, accountable governance, and rapid community response.</p>
        </div>
      </footer>
    </div>
  );
}

export function PublicHome() {
  const categories = [
    { title: 'Roads & Potholes', desc: 'Asphalt damage, severe potholes, and missing manhole covers', icon: Construction },
    { title: 'Garbage & Waste', desc: 'Illegal dumping, overflowing community bins, and unswept roads', icon: Trash2 },
    { title: 'Streetlights & Electrical', desc: 'Broken streetlights, hanging power cables, and dark public corridors', icon: Lightbulb },
    { title: 'Water & Drainage', desc: 'Pipeline bursts, sewage overflow, and choked stormwater drains', icon: Droplet },
    { title: 'Public Infrastructure', desc: 'Fallen trees, broken park benches, and damaged civic signage', icon: Building2 },
    { title: 'Safety Hazards', desc: 'Unbarricaded construction pits and open electrical boxes', icon: AlertTriangle },
  ];

  return (
    <main className="space-y-20 pb-20">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-[#0f1d3a]/50 via-[#0b1120] to-[#0b1120]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-cyan-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">AI-Assisted Civic Response Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight font-heading">
            See a problem. Report it. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Help get it resolved.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CivicLens empowers citizens to report everyday neighborhood issues—from potholes to streetlights—and track them directly through to municipal resolution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/auth?next=/citizen/report"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How CivicLens Works
          </h2>
          <p className="text-sm text-slate-400">
            From your phone to the municipal work crew in four clear stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Spot an Issue', desc: 'Take a photo of the defect and note the location.', icon: MapPin },
            { step: '2', title: 'Submit a Report', desc: 'Upload the photo with a brief description.', icon: Send },
            { step: '3', title: 'We Analyze & Route It', desc: 'AI suggests the defect category and routes it to the right department.', icon: Sparkles },
            { step: '4', title: 'Track Resolution', desc: 'Follow the progress and view completion notes once resolved.', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="civic-card p-6 space-y-3 relative group hover:border-blue-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Stage 0{item.step}
                </span>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. What Can You Report? */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Civic Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What Can You Report?
          </h2>
          <p className="text-sm text-slate-400">
            CivicLens supports common public infrastructure and civic hazards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="civic-card p-5 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Why CivicLens? */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Built for Community Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why CivicLens?
            </h2>
            <p className="text-sm text-slate-400">
              Modern civic technology designed for transparency and accountable follow-through.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="civic-card p-6 space-y-3">
              <Eye className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Transparent Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See exactly when your report was reviewed, which department was assigned, and when work began.
              </p>
            </div>

            <div className="civic-card p-6 space-y-3">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">AI-Assisted Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computer vision helps classify defect types and severity instantly to speed up department response.
              </p>
            </div>

            <div className="civic-card p-6 space-y-3">
              <LockKeyhole className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Secure & Authenticated</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reports are tied to authenticated accounts and stored with Firebase security rules to prevent spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Transparency Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="civic-card p-6 sm:p-8 space-y-4 border-blue-500/20 bg-gradient-to-r from-slate-900 via-[#0f1d3a]/60 to-slate-900">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Public Trust & Responsible AI</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Committed to Truthful Civic Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            CivicLens AI uses authenticated accounts, genuine GPS coordinates, and real-time Firestore database records. AI analysis suggestions are advisory and may make mistakes; citizens review all details before submission. We never fabricate metrics, fake leaderboard scores, or simulated responses.
          </p>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="civic-card p-8 sm:p-12 text-center space-y-6 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border-blue-500/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            See something in your neighborhood that needs attention?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join your fellow citizens in reporting road defects, broken streetlights, and sanitation hazards.
          </p>
          <div>
            <Link
              to="/auth?next=/citizen/report"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-500/25"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export function HowItWorksPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 space-y-10">
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Citizen Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          How CivicLens Works
        </h1>
        <p className="text-sm text-slate-400">
          A clear, accountable path from a resident's report to a documented civic response.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="civic-card p-6 space-y-2">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
            <span>Submit a Civic Report</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign in with your verified email account, select or take a photo of the defect, and enter the street address or let your device locate you via GPS.
          </p>
        </section>

        <section className="civic-card p-6 space-y-2">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
            <span>Review AI Analysis</span>
          </h2>
          <p className="text-xs text-slate-400">
            Our computer vision engine scans the image to identify the defect category (such as pothole, broken streetlight, or drainage choke) and suggests the appropriate department. You can verify and adjust all fields before confirming submission.
          </p>
        </section>

        <section className="civic-card p-6 space-y-2">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
            <span>Municipal Routing & Dispatch</span>
          </h2>
          <p className="text-xs text-slate-400">
            Once submitted, your report appears in the administrative dispatch queue. Department supervisors assign field personnel to inspect and repair the hazard.
          </p>
        </section>

        <section className="civic-card p-6 space-y-2">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">4</span>
            <span>Track Progress & Resolution</span>
          </h2>
          <p className="text-xs text-slate-400">
            Log in at any time to view real-time status updates, field officer notes, and verified completion details on your personal citizen dashboard.
          </p>
        </section>
      </div>
    </main>
  );
}

export function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 space-y-10">
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Platform Overview
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          About CivicLens AI
        </h1>
        <p className="text-sm text-slate-400">
          Civic technology built for clearer reporting, transparent communication, and accountable municipal service delivery.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="civic-card p-6 space-y-3">
          <h2 className="text-base font-bold text-white">Our Mission</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every citizen deserves safe roads, clean public spaces, functional streetlights, and reliable drainage. CivicLens bridges the communication gap between residents and city administrations by providing a fast, direct, and verifiable reporting system.
          </p>
        </div>

        <div className="civic-card p-6 space-y-3">
          <h2 className="text-base font-bold text-white">Role-Based Operations</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            CivicLens maintains strict role separation: residents access a streamlined citizen dashboard for reporting and tracking, while authorized municipal administrators and officers manage dispatch queues, spatial GIS maps, and repair verifications.
          </p>
        </div>

        <div className="civic-card p-6 space-y-3">
          <h2 className="text-base font-bold text-white">Privacy & Security</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            All user data, photographs, and complaint records are managed under Firebase Authentication, Firestore, and Firebase Storage security rules. We only collect the minimal information needed to verify and follow up on municipal issues.
          </p>
        </div>
      </div>
    </main>
  );
}
