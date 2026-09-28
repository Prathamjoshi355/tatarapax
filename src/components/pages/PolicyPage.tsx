import React, { useState, useEffect } from 'react';
import { GlobalSettings, PolicyDocument, PolicySectionItem } from '../../types';
import { DEFAULT_POLICIES_CONFIG } from '../../lib/defaultPolicies';
import { ShieldCheck, FileText, AlertTriangle, RefreshCw, Mail, CheckCircle2, Lock } from 'lucide-react';

interface PolicyPageProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer' | 'refund';
  settings?: GlobalSettings;
}

export default function PolicyPage({ initialTab = 'privacy', settings }: PolicyPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'refund'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const policies = settings?.policiesConfig || DEFAULT_POLICIES_CONFIG;
  const currentDoc: PolicyDocument = policies[activeTab] || DEFAULT_POLICIES_CONFIG[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header Banner */}
      <div className="bg-[#071B4D] text-white py-12 md:py-16 px-4 border-b border-blue-900 shadow-inner">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F7C400] mb-4 shadow-lg backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F7C400] font-mono bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-3">
            {currentDoc.companyName || 'Tantrapex Technology Pvt. Ltd.'}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white">
            {currentDoc.title || 'Legal Policies & Terms'}
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mt-3 leading-relaxed">
            Please read our Privacy Policy, Terms of Service, Disclaimer, and Cancellation & Refund Policy carefully.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        {/* Policy Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('privacy');
              window.location.hash = '#/privacy';
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#071B4D] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Lock className="h-4 w-4 text-[#F7C400]" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('terms');
              window.location.hash = '#/terms';
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#071B4D] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="h-4 w-4 text-[#F7C400]" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('disclaimer');
              window.location.hash = '#/disclaimer';
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-[#071B4D] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-[#F7C400]" />
            <span>Disclaimer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('refund');
              window.location.hash = '#/refund-policy';
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-[#071B4D] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RefreshCw className="h-4 w-4 text-[#F7C400]" />
            <span>Cancellation & Refund</span>
          </button>
        </div>

        {/* Document Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />

          <div className="relative z-10 space-y-8 text-slate-700">
            {/* Document Header */}
            <div className="border-b border-slate-100 pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Official Policy Document</span>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#071B4D] mt-1">
                {currentDoc.title}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-2">
                {currentDoc.companyName} {currentDoc.lastUpdated ? `• ${currentDoc.lastUpdated}` : ''}
              </p>
              {currentDoc.introText && (
                <p className="text-sm text-slate-600 mt-4 leading-relaxed bg-blue-50/60 border border-blue-100 p-4 rounded-xl font-medium">
                  {currentDoc.introText}
                </p>
              )}
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-8 text-sm leading-relaxed">
              {currentDoc.sections && currentDoc.sections.map((section: PolicySectionItem, idx: number) => (
                <div key={section.id || idx} className="space-y-3">
                  <h3 className="text-lg font-bold text-[#071B4D] flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-900 text-xs flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{section.title}</span>
                  </h3>

                  {section.content && (
                    <p className="text-slate-700 leading-relaxed font-sans">
                      {section.content}
                    </p>
                  )}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="list-disc pl-6 space-y-2 text-slate-700 font-sans">
                      {section.bullets.map((b: string, bIdx: number) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {section.callout && (
                    <div
                      className={`p-4 rounded-2xl border text-sm font-medium mt-3 ${
                        section.callout.type === 'danger'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : section.callout.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : section.callout.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-blue-50 border-blue-200 text-blue-950'
                      }`}
                    >
                      <p>{section.callout.text}</p>
                    </div>
                  )}

                  {idx < currentDoc.sections.length - 1 && (
                    <hr className="border-slate-100 mt-6" />
                  )}
                </div>
              ))}

              {/* Contact Footer block for Privacy/Terms */}
              {(currentDoc.contactEmail1 || currentDoc.contactEmail2) && (
                <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-md mt-8">
                  <h3 className="text-lg font-bold text-[#F7C400] mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Us
                  </h3>
                  <p className="text-xs text-slate-300 mb-3">
                    For any questions, legal queries, or policy requests, please contact us at:
                  </p>
                  <div className="font-semibold text-sm space-y-1">
                    <p className="text-white font-bold">{currentDoc.companyName}</p>
                    <p className="text-slate-300 font-mono text-xs">
                      Email: {[currentDoc.contactEmail1, currentDoc.contactEmail2].filter(Boolean).join(' | ')}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
