import React, { useState } from 'react';
import { CMSPage, GlobalSettings } from '../../types';
import { 
  Sparkles, RefreshCw, Lock, Database, LogOut, ChevronDown, CheckCircle 
} from 'lucide-react';

interface VisualEditorHeaderProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
  onReset: () => void;
  onLogout: () => void;
}

export default function VisualEditorHeader({
  settings,
  pages,
  currentPageId,
  setCurrentPageId,
  onReset,
  onLogout
}: VisualEditorHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activePage = pages.find(p => p.id === currentPageId) || pages[0];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 md:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between font-sans text-xs select-none">
      {/* Brand logo & Studio badge */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 bg-amber-500 rounded flex items-center justify-center font-black text-slate-950 text-sm shadow">
          TX
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-wider text-white uppercase text-[11px]">Tentrapax Design Studio</span>
            <span className="bg-amber-500/10 text-amber-400 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-widest animate-pulse">
              Visual Editor Mode
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">Drag, click, and edit layout dynamically</span>
        </div>
      </div>

      {/* Center: Dynamic Page Selection and Swapping */}
      <div className="relative my-2 md:my-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Currently Editing:</span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all font-bold text-blue-400"
          >
            <span>{activePage.title} Page ({activePage.slug})</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-60 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl z-50 p-1 divide-y divide-slate-900/50">
            <div className="px-2.5 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Select Canvas Page</div>
            <div className="py-1 max-h-60 overflow-y-auto">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentPageId(p.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center justify-between text-xs ${
                    p.id === currentPageId
                      ? 'bg-blue-600/20 text-blue-400 font-bold'
                      : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <span>{p.title} Page</span>
                  <span className="font-mono text-[9px] text-slate-500">{p.slug}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions, DB Status & Lock Exit Gates */}
      <div className="flex items-center gap-4">
        {/* MongoDB cloud cluster tracker badge */}
        <div className="hidden lg:flex flex-col text-right font-mono text-[10px]">
          <div className="flex items-center gap-1.5 justify-end text-emerald-400 font-bold">
            <Database className="h-3 w-3 shrink-0" />
            <span>Atlas Cloud Cluster Synced</span>
          </div>
          <span className="text-slate-500 text-[8px] uppercase">Real-time collections persistent</span>
        </div>

        {/* Database Reset Action */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 px-2.5 py-1 rounded font-medium border border-slate-700"
          title="Restore dynamic data to default demo settings"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Demo DB</span>
        </button>

        {/* Lock / LogOut Gate */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-rose-300 hover:text-white transition-colors bg-rose-950/40 px-3 py-1.5 rounded-lg font-bold border border-rose-900/40 shadow-sm"
          title="Save draft, write changes to MongoDB Atlas cluster and exit visual session"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Exit & Lock</span>
        </button>
      </div>
    </div>
  );
}
