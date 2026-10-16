import React, { useState } from 'react';
import { GlobalSettings } from '../../../types';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import PolicyPage from '../../../components/pages/PolicyPage';
import { ShieldCheck, FileText, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

interface VisualEditorPoliciesPageProps {
  settings: GlobalSettings;
  setSettings?: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  onOpenAdminConfig?: () => void;
}

export default function VisualEditorPoliciesPage({
  settings,
  onOpenAdminConfig
}: VisualEditorPoliciesPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'refund'>('privacy');

  return (
    <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-[calc(100vh-60px)]">
      {/* Interactive visual canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100 p-4 md:p-8">
        <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
          <Header
            settings={settings}
            pages={[]}
            currentPageId="policy-privacy"
            setCurrentPageId={() => {}}
          />

          <main className="flex-1">
            <PolicyPage
              initialTab={activeTab}
              settings={settings}
            />
          </main>

          <Footer
            settings={settings}
            pages={[]}
            setCurrentPageId={() => {}}
            viewMode="visual"
          />
        </div>
      </div>

      {/* Policies Quick Switcher & Config Sidebar */}
      <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-6 shrink-0 text-white">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-sm text-white">Legal Documents</h3>
            <span className="text-[10px] text-slate-400">Visual Policy Canvas</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Legal View</label>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Terms &amp; Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Statutory Disclaimer</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Refund &amp; Cancellation Policy</span>
          </button>
        </div>

        {onOpenAdminConfig && (
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <span className="text-[11px] text-slate-400">Need to modify policy clauses, contact email, or jurisdiction?</span>
            <button
              onClick={onOpenAdminConfig}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="h-4 w-4" />
              <span>Open Clause Editor</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
