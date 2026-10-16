import React, { useState, useEffect } from 'react';
import { GlobalSettings, PoliciesConfig, PolicyDocument, PolicySectionItem } from '../../types';
import { DEFAULT_POLICIES_CONFIG } from '../../lib/defaultPolicies';
import { 
  ShieldCheck, Lock, FileText, AlertTriangle, RefreshCw, Plus, Trash2, 
  ArrowUp, ArrowDown, Check, Save, RotateCcw, ExternalLink, Mail, Info, CheckCircle2 
} from 'lucide-react';

interface PoliciesAdminEditorProps {
  settings: GlobalSettings;
  setSettings: (s: GlobalSettings) => void;
}

export default function PoliciesAdminEditor({ settings, setSettings }: PoliciesAdminEditorProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'refund'>('privacy');
  const [policies, setPolicies] = useState<PoliciesConfig>(() => {
    return settings.policiesConfig || DEFAULT_POLICIES_CONFIG;
  });

  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync state if settings update externally
  useEffect(() => {
    if (settings.policiesConfig) {
      setPolicies(settings.policiesConfig);
    }
  }, [settings.policiesConfig]);

  const currentDoc: PolicyDocument = policies[activeTab] || DEFAULT_POLICIES_CONFIG[activeTab];

  const updateCurrentDoc = (updatedDoc: PolicyDocument) => {
    const nextPolicies = {
      ...policies,
      [activeTab]: updatedDoc
    };
    setPolicies(nextPolicies);
  };

  const handleSaveAll = () => {
    const updatedSettings: GlobalSettings = {
      ...settings,
      policiesConfig: policies
    };
    setSettings(updatedSettings);
    localStorage.setItem('tpx_settings', JSON.stringify(updatedSettings));
    setSaveToast(`All changes to ${currentDoc.title} and Legal Policies saved successfully!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetCurrentPolicy = () => {
    if (window.confirm(`Are you sure you want to reset the ${currentDoc.title} to its default template?`)) {
      const nextPolicies = {
        ...policies,
        [activeTab]: DEFAULT_POLICIES_CONFIG[activeTab]
      };
      setPolicies(nextPolicies);
      const updatedSettings: GlobalSettings = {
        ...settings,
        policiesConfig: nextPolicies
      };
      setSettings(updatedSettings);
      localStorage.setItem('tpx_settings', JSON.stringify(updatedSettings));
      setSaveToast(`Reset ${DEFAULT_POLICIES_CONFIG[activeTab].title} to default.`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleResetAllPolicies = () => {
    if (window.confirm('Are you sure you want to reset ALL 4 Legal Policy Documents to default templates?')) {
      setPolicies(DEFAULT_POLICIES_CONFIG);
      const updatedSettings: GlobalSettings = {
        ...settings,
        policiesConfig: DEFAULT_POLICIES_CONFIG
      };
      setSettings(updatedSettings);
      localStorage.setItem('tpx_settings', JSON.stringify(updatedSettings));
      setSaveToast('Reset all policy documents to default templates.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Section level operations
  const handleUpdateSection = (sectionIndex: number, updatedFields: Partial<PolicySectionItem>) => {
    const nextSections = [...currentDoc.sections];
    nextSections[sectionIndex] = {
      ...nextSections[sectionIndex],
      ...updatedFields
    };
    updateCurrentDoc({
      ...currentDoc,
      sections: nextSections
    });
  };

  const handleAddSection = () => {
    const newSection: PolicySectionItem = {
      id: `sec-${Date.now()}`,
      title: `${currentDoc.sections.length + 1}. New Policy Clause`,
      content: 'Enter detailed clause content or statement here.',
      bullets: []
    };
    updateCurrentDoc({
      ...currentDoc,
      sections: [...currentDoc.sections, newSection]
    });
  };

  const handleDeleteSection = (index: number) => {
    if (window.confirm('Delete this section clause?')) {
      const nextSections = currentDoc.sections.filter((_, idx) => idx !== index);
      updateCurrentDoc({
        ...currentDoc,
        sections: nextSections
      });
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentDoc.sections.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextSections = [...currentDoc.sections];
    const temp = nextSections[index];
    nextSections[index] = nextSections[targetIndex];
    nextSections[targetIndex] = temp;

    updateCurrentDoc({
      ...currentDoc,
      sections: nextSections
    });
  };

  // Bullet operations inside section
  const handleAddBullet = (sectionIndex: number) => {
    const section = currentDoc.sections[sectionIndex];
    const currentBullets = section.bullets || [];
    const nextBullets = [...currentBullets, 'New bullet point details...'];
    handleUpdateSection(sectionIndex, { bullets: nextBullets });
  };

  const handleUpdateBullet = (sectionIndex: number, bulletIndex: number, val: string) => {
    const section = currentDoc.sections[sectionIndex];
    const currentBullets = [...(section.bullets || [])];
    currentBullets[bulletIndex] = val;
    handleUpdateSection(sectionIndex, { bullets: currentBullets });
  };

  const handleDeleteBullet = (sectionIndex: number, bulletIndex: number) => {
    const section = currentDoc.sections[sectionIndex];
    const currentBullets = (section.bullets || []).filter((_, idx) => idx !== bulletIndex);
    handleUpdateSection(sectionIndex, { bullets: currentBullets });
  };

  // Callout operations
  const handleToggleCallout = (sectionIndex: number, enabled: boolean) => {
    const section = currentDoc.sections[sectionIndex];
    if (!enabled) {
      handleUpdateSection(sectionIndex, { callout: undefined });
    } else {
      handleUpdateSection(sectionIndex, {
        callout: {
          type: 'info',
          text: 'Important note or declaration text here.'
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left text-xs font-sans max-w-6xl mx-auto pb-12">
      {/* Toast notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-xs">{saveToast}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Content Management System
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white mt-0.5">
              Legal Policies & Compliance Editor
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Edit every clause, text section, registration fees, and disclaimer across all 4 official policy pages.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save All Policies</span>
          </button>

          <button
            onClick={handleResetAllPolicies}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            title="Reset all policies to standard template"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Tab Selectors for 4 Policy Pages */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'privacy', label: 'Privacy Policy', hash: '#/privacy', icon: Lock, color: 'text-blue-600' },
          { id: 'terms', label: 'Terms of Service', hash: '#/terms', icon: FileText, color: 'text-amber-600' },
          { id: 'disclaimer', label: 'Disclaimer', hash: '#/disclaimer', icon: AlertTriangle, color: 'text-rose-600' },
          { id: 'refund', label: 'Cancellation & Refund', hash: '#/refund-policy', icon: RefreshCw, color: 'text-emerald-600' }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[180px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#071B4D] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TabIcon className={`h-4 w-4 ${isActive ? 'text-[#F7C400]' : tab.color}`} />
                <span>{tab.label}</span>
              </div>
              <a
                href={tab.hash}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}
                title={`Preview ${tab.label} in new tab`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </button>
          );
        })}
      </div>

      {/* Active Policy Settings Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-lg font-display font-extrabold text-[#071B4D] uppercase">
              Editing: {currentDoc.title} ({currentDoc.id})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`#/${currentDoc.id === 'refund' ? 'refund-policy' : currentDoc.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Page</span>
            </a>
            <button
              onClick={handleResetCurrentPolicy}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset This Policy</span>
            </button>
          </div>
        </div>

        {/* Global Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Document Title</label>
            <input
              type="text"
              value={currentDoc.title}
              onChange={(e) => updateCurrentDoc({ ...currentDoc, title: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Organization / Company Name</label>
            <input
              type="text"
              value={currentDoc.companyName}
              onChange={(e) => updateCurrentDoc({ ...currentDoc, companyName: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Introduction / Preamble Summary</label>
            <textarea
              rows={2}
              value={currentDoc.introText}
              onChange={(e) => updateCurrentDoc({ ...currentDoc, introText: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Contact Email 1</label>
            <input
              type="email"
              value={currentDoc.contactEmail1 || ''}
              onChange={(e) => updateCurrentDoc({ ...currentDoc, contactEmail1: e.target.value })}
              placeholder="e.g. info@tantrapex.com"
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Contact Email 2</label>
            <input
              type="email"
              value={currentDoc.contactEmail2 || ''}
              onChange={(e) => updateCurrentDoc({ ...currentDoc, contactEmail2: e.target.value })}
              placeholder="e.g. hr@tantrapex.com"
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clauses & Sections Editor */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-slate-900 uppercase text-sm">
                Policy Sections & Clauses ({currentDoc.sections?.length || 0})
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                Drag or reorder clause items below
              </span>
            </div>

            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-[#071B4D] hover:bg-blue-900 text-white font-bold text-xs uppercase rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Clause Section</span>
            </button>
          </div>

          {currentDoc.sections && currentDoc.sections.map((sec, sIdx) => (
            <div
              key={sec.id || sIdx}
              className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm space-y-4 relative transition-colors"
            >
              {/* Clause Header Control Strip */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-[#071B4D] text-white text-xs flex items-center justify-center font-bold">
                    {sIdx + 1}
                  </span>
                  <span className="text-xs uppercase font-display text-slate-900">Clause #{sIdx + 1}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveSection(sIdx, 'up')}
                    disabled={sIdx === 0}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move section up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleMoveSection(sIdx, 'down')}
                    disabled={sIdx === currentDoc.sections.length - 1}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move section down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  <div className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    onClick={() => handleDeleteSection(sIdx)}
                    className="p-1.5 rounded hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete section clause"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Clause Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                  Clause Heading Title
                </label>
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => handleUpdateSection(sIdx, { title: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Clause Main Body Text */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                  Clause Content / Paragraph
                </label>
                <textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => handleUpdateSection(sIdx, { content: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-normal text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Bullet Points list */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase text-[10px]">
                    Bullet Points List ({sec.bullets?.length || 0})
                  </span>
                  <button
                    onClick={() => handleAddBullet(sIdx)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 font-bold text-[10px] uppercase rounded border border-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                {sec.bullets && sec.bullets.length > 0 ? (
                  <div className="space-y-2">
                    {sec.bullets.map((bulletStr, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold text-xs shrink-0">&bull;</span>
                        <input
                          type="text"
                          value={bulletStr}
                          onChange={(e) => handleUpdateBullet(sIdx, bIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleDeleteBullet(sIdx, bIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Remove bullet"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic font-sans">No bullet points added to this clause.</p>
                )}
              </div>

              {/* Callout Box Controls */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`callout-toggle-${sIdx}`}
                      checked={!!sec.callout}
                      onChange={(e) => handleToggleCallout(sIdx, e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor={`callout-toggle-${sIdx}`} className="font-bold text-slate-800 uppercase text-[10px] cursor-pointer">
                      Include Highlight Callout Banner
                    </label>
                  </div>

                  {sec.callout && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Callout Style:</span>
                      <select
                        value={sec.callout.type}
                        onChange={(e) =>
                          handleUpdateSection(sIdx, {
                            callout: {
                              ...sec.callout!,
                              type: e.target.value as any
                            }
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="info">Info (Blue)</option>
                        <option value="warning">Warning (Amber)</option>
                        <option value="danger">Danger (Rose)</option>
                        <option value="success">Success (Emerald)</option>
                      </select>
                    </div>
                  )}
                </div>

                {sec.callout && (
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="font-bold text-slate-600 uppercase text-[9px]">Callout Box Text</label>
                    <textarea
                      rows={2}
                      value={sec.callout.text}
                      onChange={(e) =>
                        handleUpdateSection(sIdx, {
                          callout: {
                            ...sec.callout!,
                            text: e.target.value
                          }
                        })
                      }
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save Action bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            Changes saved here update live across the entire application immediately.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save & Publish All Policies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
