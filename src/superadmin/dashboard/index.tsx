import React from 'react';
import { CMSPage, GlobalSettings } from '../../types';
import { 
  ShieldCheck, LayoutDashboard, Database, Lock, LogOut, FileCode, Edit3, Settings, ExternalLink, HelpCircle, 
  BarChart3, Users, Award, BookOpen, Globe 
} from 'lucide-react';

interface SuperAdminDashboardProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  onOpenAdmin: (pageId: string) => void;
  onOpenVisual: (pageId: string) => void;
  onLogout: () => void;
  onViewLiveSite?: () => void;
  leadsCount: number;
  mongoDbStatus: 'connected' | 'disconnected' | 'loading';
  mongoDbError: string | null;
}

export default function SuperAdminDashboard({
  settings,
  pages,
  onOpenAdmin,
  onOpenVisual,
  onLogout,
  onViewLiveSite,
  leadsCount,
  mongoDbStatus,
  mongoDbError
}: SuperAdminDashboardProps) {
  // Determine if it looks like an IP Whitelist / SSL Alert 80 failure
  const isWhitelistError = mongoDbError && (
    mongoDbError.includes('SSL alert number 80') || 
    mongoDbError.includes('tlsv1 alert internal error') ||
    mongoDbError.includes('MongoServerSelectionError') ||
    mongoDbError.includes('MongoNetworkError')
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans select-none flex flex-col">
      
      {/* Top Banner Control Ribbon */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md border border-blue-500">
            TP
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white uppercase text-sm">Tentrapax Control Center</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Super Admin</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">MongoDB Atlas Persistent Enterprise Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right font-mono text-[10px]">
            {mongoDbStatus === 'connected' ? (
              <div className="flex items-center gap-1.5 justify-end text-emerald-400 font-bold">
                <Database className="h-3.5 w-3.5" />
                <span>Atlas Cloud Cluster Online</span>
              </div>
            ) : mongoDbStatus === 'loading' ? (
              <div className="flex items-center gap-1.5 justify-end text-amber-400 font-bold">
                <Database className="h-3.5 w-3.5 animate-pulse" />
                <span>Connecting Cloud Cluster...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 justify-end text-rose-400 font-bold">
                <Database className="h-3.5 w-3.5" />
                <span>Atlas Cloud Cluster Offline</span>
              </div>
            )}
            <span className="text-slate-500 text-[8px] uppercase">
              {mongoDbStatus === 'connected' ? 'Synced with cluster db' : 'Falling back to browser storage'}
            </span>
          </div>

          <button 
            onClick={() => {
              if (onViewLiveSite) onViewLiveSite();
              else window.location.hash = '#/';
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/40 hover:border-blue-700 rounded-xl text-blue-300 hover:text-white font-bold transition-all text-xs cursor-pointer shadow"
            title="Return to the live public website preview"
          >
            <Globe className="h-4 w-4" />
            <span>View Live Site</span>
          </button>

          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/40 hover:border-rose-700 rounded-xl text-rose-300 hover:text-white font-bold transition-all text-xs cursor-pointer shadow"
            title="Securely log out of administrative systems"
          >
            <LogOut className="h-4 w-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        
        {/* MongoDB Troubleshooting Card if Disconnected */}
        {mongoDbStatus === 'disconnected' && (
          <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>MongoDB Atlas Connection Required</span>
                  <span className="bg-rose-500/15 text-rose-400 text-[9px] px-2 py-0.5 rounded border border-rose-500/30 font-bold uppercase tracking-wider">
                    Network Error (SSL 80)
                  </span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                  The application could not establish a secure handshake with your MongoDB database cluster. This is almost always caused by MongoDB Atlas dropping incoming connections from Cloud Run when the client IP is not whitelisted.
                </p>
              </div>
            </div>

            {mongoDbError && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-slate-300 whitespace-pre-wrap break-all max-h-32 overflow-y-auto leading-relaxed">
                <strong className="text-rose-400">Database Connection Log:</strong>
                <div className="mt-1 text-slate-400">{mongoDbError}</div>
              </div>
            )}

            <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-5 flex flex-col gap-3">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">How to resolve this in 2 Steps:</span>
              <ul className="text-xs text-slate-300 flex flex-col gap-2.5 list-none pl-0">
                <li className="flex gap-2 items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>
                    Log in to your <strong>MongoDB Atlas Dashboard</strong>, navigate to <strong>Network Access</strong> under Security, and click <strong>Add IP Address</strong>.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>
                    Add <strong>Allow Access From Anywhere</strong> (<code className="bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">0.0.0.0/0</code>) or Whitelist the cluster IP, then wait 1 minute for MongoDB Atlas to deploy updates.
                  </span>
                </li>
              </ul>
              <div className="text-[10px] text-slate-400 font-medium italic mt-1 border-t border-blue-900/25 pt-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span>Note: While disconnected, your changes are safely stored in your browser's Local Storage cache, so you won't lose any progress!</span>
              </div>
            </div>
          </div>
        )}
        {/* Quick Insights Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-inner">
              <Globe className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dynamic Pages</span>
              <span className="text-2xl font-black text-white">{pages.length} Pages</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-inner">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Leads</span>
              <span className="text-2xl font-black text-white">{leadsCount} Submitted</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Award className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Storage Engine</span>
              <span className="text-2xl font-black text-white">MongoDB Atlas</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Access Node</span>
              <span className="text-2xl font-black text-white">Secure SSL</span>
            </div>
          </div>

        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-blue-500" />
              <span>MongoDB Dynamic Collections Map</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Select any dynamic document path below to edit via visual front-end canvas or structured admin metadata config.</p>
          </div>
        </div>

        {/* Dynamic Pages Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((p) => {
            // Check if page has special support for admin/visual routing (Home, About, Services, Blog, Contact)
            const isFullySupported = ['home', 'about', 'services', 'blog', 'contact'].includes(p.id);

            return (
              <div 
                key={p.id} 
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-6 transition-all group relative overflow-hidden"
              >
                {/* Visual abstract highlight for key pages */}
                {isFullySupported && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-white group-hover:text-blue-400 transition-colors">{p.title} Page</h3>
                      {isFullySupported ? (
                        <span className="bg-blue-500/10 text-blue-400 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider border border-blue-500/20">
                          Three-Page Architecture
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                          CMS Core
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">Path Reference: {p.slug}</span>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{p.seo.description || "Fully customizable document containing design schemes and component nodes."}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <button 
                    onClick={() => onOpenAdmin(p.id)}
                    className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-bold rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Open Admin Config</span>
                  </button>

                  <button 
                    onClick={() => onOpenVisual(p.id)}
                    className="w-full sm:w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Open Visual Editor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
