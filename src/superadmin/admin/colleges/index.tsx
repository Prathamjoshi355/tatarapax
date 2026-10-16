import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_COLLEGES_SECTIONS } from '../../../lib/defaultColleges';
import {
  Save,
  RotateCcw,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle,
  Send,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  Gavel,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

interface AdminCollegesPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminCollegesPage({
  page,
  setPages
}: AdminCollegesPageProps) {
  const [activeTab, setActiveTab] = useState<
    'hero' | 'benefits' | 'process' | 'enquiry' | 'statutory' | 'seo'
  >('hero');

  const [sections, setSections] = useState<CMSSection[]>(() => {
    if (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('college-'))) {
      return page.sections;
    }
    return DEFAULT_COLLEGES_SECTIONS;
  });

  const [seoTitle, setSeoTitle] = useState(
    page.seo?.title || 'College Partnerships & Institutional Training | TantraPex Technologies'
  );
  const [seoDesc, setSeoDesc] = useState(
    page.seo?.description ||
      'Partner with TantraPex Technologies to bring corporate training, aptitude assessments, and verified pooled recruitment drives to your engineering college campus.'
  );
  const [seoKeywords, setSeoKeywords] = useState(
    page.seo?.keywords ||
      'college partnerships, institutional training, campus recruitment training, TPO tie up, pooled campus drives, engineering placement, TantraPex'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const updateSection = (sectionId: string, mutator: (sec: CMSSection) => CMSSection) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return mutator({ ...sec });
      })
    );
  };

  const getSection = (type: string, fallbackIdx: number): CMSSection => {
    return sections.find(s => s.type === type) || DEFAULT_COLLEGES_SECTIONS[fallbackIdx];
  };

  const heroSec = getSection('college-hero', 0);
  const benefitsSec = getSection('college-benefits', 1);
  const processSec = getSection('college-process', 2);
  const enquirySec = getSection('college-enquiry', 3);
  const statutorySec = getSection('college-statutory', 4);

  const triggerNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3500);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    triggerNotification('Saving changes to MongoDB Atlas...');

    try {
      // 1. Update React Pages state
      const updatedPage: CMSPage = {
        ...page,
        title: 'College Partnerships',
        slug: '/college-partnership',
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: sections
      };

      setPages(prev => prev.map(p => (p.id === page.id ? updatedPage : p)));

      // 2. Fetch full current snapshot to avoid overwriting other collections
      const getRes = await fetch('/api/load-all');
      const getJson = await getRes.json();
      const currentData = getJson.data || {};

      const existingPages: CMSPage[] = currentData.pages || [];
      const mergedPages = existingPages.map(p => (p.id === page.id ? updatedPage : p));
      if (!mergedPages.some(p => p.id === page.id)) {
        mergedPages.push(updatedPage);
      }

      // 3. Persist to MongoDB
      const saveRes = await fetch('/api/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          pages: mergedPages
        })
      });

      const saveJson = await saveRes.json();
      if (saveJson.success) {
        triggerNotification('All College Partnerships changes successfully saved to MongoDB Atlas!');
      } else {
        triggerNotification(`Save failed: ${saveJson.msg || 'Database error'}`);
      }
    } catch (err: any) {
      console.error('Error saving colleges page:', err);
      triggerNotification(`Save failed: ${err.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all College Partnership sections to redesign defaults?')) {
      setSections(DEFAULT_COLLEGES_SECTIONS);
      triggerNotification('Reset to default redesign layout. Click Save & Publish to write to database.');
    }
  };

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* 1. Header Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                TantraPex CMS Editor
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                Colleges • Live Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              College Partnerships CMS Configurator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Full administrative control: configure executive hero masthead, institution metrics, readiness pillars, collaboration roadmap, TPO partnership values, lead intake form, and statutory disclaimers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Reset to default redesign layout"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <a
              href="#/college-partnership"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Page</span>
            </a>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving to MongoDB...' : 'Save & Publish to MongoDB'}</span>
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'hero', label: 'Hero & Metrics', icon: Sparkles },
            { id: 'benefits', label: 'Campus Readiness Pillars', icon: Layers },
            { id: 'process', label: 'Collaboration Roadmap', icon: CheckCircle },
            { id: 'enquiry', label: 'TPO Desk & Enquiry Form', icon: Building2 },
            { id: 'statutory', label: 'Statutory Compliance', icon: Gavel },
            { id: 'seo', label: 'SEO Meta', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Toast */}
        {saveStatus && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg">
            <span>{saveStatus}</span>
            <button
              onClick={() => setSaveStatus(null)}
              className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-3 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. TAB EDITORS */}

        {/* --- TAB 1: HERO & METRICS CHIPS --- */}
        {activeTab === 'hero' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 01
              </span>
              <h2 className="text-lg font-bold text-white">Executive Hero Masthead & Institutional Chips</h2>
              <p className="text-xs text-slate-400">
                Configure top pill badge, page title, partnership description, breadcrumb labels, and data snapshot chips.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Pill Badge Label</label>
                <input
                  type="text"
                  value={heroSec.content?.badgeText || ''}
                  onChange={e =>
                    updateSection(heroSec.id, s => ({
                      ...s,
                      content: { ...s.content, badgeText: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Breadcrumb Current Label</label>
                <input
                  type="text"
                  value={heroSec.content?.breadcrumbCurrent || ''}
                  onChange={e =>
                    updateSection(heroSec.id, s => ({
                      ...s,
                      content: { ...s.content, breadcrumbCurrent: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Page Headline (H1)</label>
              <input
                type="text"
                value={heroSec.title || ''}
                onChange={e => updateSection(heroSec.id, s => ({ ...s, title: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Partnership Description</label>
              <textarea
                rows={3}
                value={heroSec.subtitle || ''}
                onChange={e => updateSection(heroSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Quick Data Snapshot Chips */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Quick Data Snapshot Chips (Stack)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(heroSec.content?.chips || []).map((chip: any, idx: number) => (
                  <div key={chip.id || idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Chip #{idx + 1}
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400">Value (e.g. 120+)</label>
                        <input
                          type="text"
                          value={chip.value || ''}
                          onChange={e => {
                            const newChips = [...(heroSec.content?.chips || [])];
                            newChips[idx] = { ...newChips[idx], value: e.target.value };
                            updateSection(heroSec.id, s => ({
                              ...s,
                              content: { ...s.content, chips: newChips }
                            }));
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400">Label</label>
                        <input
                          type="text"
                          value={chip.label || ''}
                          onChange={e => {
                            const newChips = [...(heroSec.content?.chips || [])];
                            newChips[idx] = { ...newChips[idx], label: e.target.value };
                            updateSection(heroSec.id, s => ({
                              ...s,
                              content: { ...s.content, chips: newChips }
                            }));
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: CAMPUS READINESS PILLARS --- */}
        {activeTab === 'benefits' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  Section 02
                </span>
                <h2 className="text-lg font-bold text-white">Campus Readiness Infrastructure Pillars</h2>
                <p className="text-xs text-slate-400">
                  Manage the 3 high-impact institutional value cards (CRT, Proctored Diagnostics, Pooled Corporate Drives).
                </p>
              </div>

              <button
                onClick={() => {
                  const newPillar = {
                    id: `cpillar-${Date.now()}`,
                    pillarNumber: `Pillar 0${(benefitsSec.content?.pillars?.length || 0) + 1}`,
                    title: 'New Institutional Pillar',
                    description: 'Description of the institutional engagement track for universities.',
                    bottomTag: 'Verified Campus Ready',
                    icon: 'Terminal'
                  };
                  updateSection(benefitsSec.id, s => ({
                    ...s,
                    content: {
                      ...s.content,
                      pillars: [...(s.content?.pillars || []), newPillar]
                    }
                  }));
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Eyebrow</label>
                <input
                  type="text"
                  value={benefitsSec.content?.eyebrow || ''}
                  onChange={e =>
                    updateSection(benefitsSec.id, s => ({
                      ...s,
                      content: { ...s.content, eyebrow: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-300">Section Title</label>
                <input
                  type="text"
                  value={benefitsSec.title || ''}
                  onChange={e => updateSection(benefitsSec.id, s => ({ ...s, title: e.target.value }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* List of Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {(benefitsSec.content?.pillars || []).map((pillar: any, pIdx: number) => (
                <div
                  key={pillar.id || pIdx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      #{pIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={pillar.pillarNumber || ''}
                      onChange={e => {
                        const updated = [...(benefitsSec.content?.pillars || [])];
                        updated[pIdx] = { ...updated[pIdx], pillarNumber: e.target.value };
                        updateSection(benefitsSec.id, s => ({
                          ...s,
                          content: { ...s.content, pillars: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-md px-2 py-0.5 text-[11px] font-mono text-slate-300 w-24 text-center"
                    />

                    <div className="flex items-center gap-1">
                      {pIdx > 0 && (
                        <button
                          onClick={() => {
                            const updated = [...(benefitsSec.content?.pillars || [])];
                            const temp = updated[pIdx];
                            updated[pIdx] = updated[pIdx - 1];
                            updated[pIdx - 1] = temp;
                            updateSection(benefitsSec.id, s => ({
                              ...s,
                              content: { ...s.content, pillars: updated }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Move left"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {pIdx < (benefitsSec.content?.pillars?.length || 0) - 1 && (
                        <button
                          onClick={() => {
                            const updated = [...(benefitsSec.content?.pillars || [])];
                            const temp = updated[pIdx];
                            updated[pIdx] = updated[pIdx + 1];
                            updated[pIdx + 1] = temp;
                            updateSection(benefitsSec.id, s => ({
                              ...s,
                              content: { ...s.content, pillars: updated }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Move right"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete pillar "${pillar.title}"?`)) {
                            const updated = (benefitsSec.content?.pillars || []).filter(
                              (_: any, i: number) => i !== pIdx
                            );
                            updateSection(benefitsSec.id, s => ({
                              ...s,
                              content: { ...s.content, pillars: updated }
                            }));
                          }
                        }}
                        className="p-1 hover:bg-rose-950/60 rounded text-rose-400 hover:text-rose-300 ml-1"
                        title="Delete pillar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title || ''}
                      onChange={e => {
                        const updated = [...(benefitsSec.content?.pillars || [])];
                        updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                        updateSection(benefitsSec.id, s => ({
                          ...s,
                          content: { ...s.content, pillars: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400">Description</label>
                    <textarea
                      rows={3}
                      value={pillar.description || ''}
                      onChange={e => {
                        const updated = [...(benefitsSec.content?.pillars || [])];
                        updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                        updateSection(benefitsSec.id, s => ({
                          ...s,
                          content: { ...s.content, pillars: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Bottom Tag</label>
                      <input
                        type="text"
                        value={pillar.bottomTag || ''}
                        onChange={e => {
                          const updated = [...(benefitsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], bottomTag: e.target.value };
                          updateSection(benefitsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Icon</label>
                      <select
                        value={pillar.icon || 'Terminal'}
                        onChange={e => {
                          const updated = [...(benefitsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], icon: e.target.value };
                          updateSection(benefitsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="Terminal">Terminal (Coding / CRT)</option>
                        <option value="BarChart3">BarChart3 (Diagnostics)</option>
                        <option value="Building2">Building2 (Corporate Drives)</option>
                        <option value="GraduationCap">GraduationCap (Academic)</option>
                        <option value="ShieldCheck">ShieldCheck (Compliance)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: 4-STEP COLLABORATION ROADMAP --- */}
        {activeTab === 'process' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 03
              </span>
              <h2 className="text-lg font-bold text-white">How the College Collaboration Works (4 Steps)</h2>
              <p className="text-xs text-slate-400">
                Configure the linear institutional engagement sequence from initial inquiry to campus drive execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Eyebrow</label>
                <input
                  type="text"
                  value={processSec.content?.eyebrow || ''}
                  onChange={e =>
                    updateSection(processSec.id, s => ({
                      ...s,
                      content: { ...s.content, eyebrow: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Title</label>
                <input
                  type="text"
                  value={processSec.title || ''}
                  onChange={e => updateSection(processSec.id, s => ({ ...s, title: e.target.value }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Subtitle</label>
              <textarea
                rows={2}
                value={processSec.subtitle || ''}
                onChange={e => updateSection(processSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* 4 Steps Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(processSec.content?.steps || []).map((step: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className={`p-4 rounded-xl border flex flex-col gap-3 ${
                    step.isHighlighted
                      ? 'bg-slate-900/90 border-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 font-bold font-display text-xs flex items-center justify-center">
                        {step.stepNumber || sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">{step.title}</span>
                    </div>

                    <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!step.isHighlighted}
                        onChange={e => {
                          const updated = [...(processSec.content?.steps || [])];
                          updated[sIdx] = { ...updated[sIdx], isHighlighted: e.target.checked };
                          updateSection(processSec.id, s => ({
                            ...s,
                            content: { ...s.content, steps: updated }
                          }));
                        }}
                        className="rounded accent-emerald-500"
                      />
                      <span>Highlight (Green)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Step Title</label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={e => {
                          const updated = [...(processSec.content?.steps || [])];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          updateSection(processSec.id, s => ({
                            ...s,
                            content: { ...s.content, steps: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Bottom Protocol Tag</label>
                      <input
                        type="text"
                        value={step.bottomTag || ''}
                        onChange={e => {
                          const updated = [...(processSec.content?.steps || [])];
                          updated[sIdx] = { ...updated[sIdx], bottomTag: e.target.value };
                          updateSection(processSec.id, s => ({
                            ...s,
                            content: { ...s.content, steps: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400">Description</label>
                    <textarea
                      rows={2}
                      value={step.description || ''}
                      onChange={e => {
                        const updated = [...(processSec.content?.steps || [])];
                        updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                        updateSection(processSec.id, s => ({
                          ...s,
                          content: { ...s.content, steps: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: TPO DESK & ENQUIRY FORM --- */}
        {activeTab === 'enquiry' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 04
              </span>
              <h2 className="text-lg font-bold text-white">Direct Partnership Desk & College Enquiry Intake</h2>
              <p className="text-xs text-slate-400">
                Configure the 3 institution value cards, TPO contact channels, and lead capture form settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Eyebrow</label>
                <input
                  type="text"
                  value={enquirySec.content?.eyebrow || ''}
                  onChange={e =>
                    updateSection(enquirySec.id, s => ({
                      ...s,
                      content: { ...s.content, eyebrow: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Left Column Title</label>
                <input
                  type="text"
                  value={enquirySec.title || ''}
                  onChange={e => updateSection(enquirySec.id, s => ({ ...s, title: e.target.value }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Left Column Subtitle</label>
              <textarea
                rows={2}
                value={enquirySec.subtitle || ''}
                onChange={e => updateSection(enquirySec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            {/* 3 Institutional Value Propositions */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                3 Key Institutional Value Propositions
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(enquirySec.content?.features || []).map((feat: any, idx: number) => (
                  <div key={feat.id || idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Value #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat.title || ''}
                      onChange={e => {
                        const updated = [...(enquirySec.content?.features || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        updateSection(enquirySec.id, s => ({
                          ...s,
                          content: { ...s.content, features: updated }
                        }));
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                    <textarea
                      rows={3}
                      value={feat.description || ''}
                      onChange={e => {
                        const updated = [...(enquirySec.content?.features || [])];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        updateSection(enquirySec.id, s => ({
                          ...s,
                          content: { ...s.content, features: updated }
                        }));
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Support Desk Details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Institutional Support Desk Contact Details
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Official Email</label>
                  <input
                    type="email"
                    value={enquirySec.content?.contact?.email || ''}
                    onChange={e =>
                      updateSection(enquirySec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          contact: {
                            ...s.content?.contact,
                            email: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Support Phone</label>
                  <input
                    type="text"
                    value={enquirySec.content?.contact?.phone || ''}
                    onChange={e =>
                      updateSection(enquirySec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          contact: {
                            ...s.content?.contact,
                            phone: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Operating Hours</label>
                  <input
                    type="text"
                    value={enquirySec.content?.contact?.timing || ''}
                    onChange={e =>
                      updateSection(enquirySec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          contact: {
                            ...s.content?.contact,
                            timing: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Form Labels & Success Message */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Enquiry Form Copy & Success Screen
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Form Title</label>
                  <input
                    type="text"
                    value={enquirySec.content?.form?.title || ''}
                    onChange={e =>
                      updateSection(enquirySec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          form: {
                            ...s.content?.form,
                            title: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Submit Button Label</label>
                  <input
                    type="text"
                    value={enquirySec.content?.form?.buttonText || ''}
                    onChange={e =>
                      updateSection(enquirySec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          form: {
                            ...s.content?.form,
                            buttonText: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold">Success Confirmation Title</label>
                <input
                  type="text"
                  value={enquirySec.content?.form?.successTitle || ''}
                  onChange={e =>
                    updateSection(enquirySec.id, s => ({
                      ...s,
                      content: {
                        ...s.content,
                        form: {
                          ...s.content?.form,
                          successTitle: e.target.value
                        }
                      }
                    }))
                  }
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold">Success Confirmation Message</label>
                <textarea
                  rows={2}
                  value={enquirySec.content?.form?.successDesc || ''}
                  onChange={e =>
                    updateSection(enquirySec.id, s => ({
                      ...s,
                      content: {
                        ...s.content,
                        form: {
                          ...s.content?.form,
                          successDesc: e.target.value
                        }
                      }
                    }))
                  }
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: STATUTORY COMPLIANCE --- */}
        {activeTab === 'statutory' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 05
              </span>
              <h2 className="text-lg font-bold text-white">Statutory & Ethical Compliance Note</h2>
              <p className="text-xs text-slate-400">
                Manage the legal / statutory disclaimer ribbon at the bottom of the page.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Prefix Label</label>
              <input
                type="text"
                value={statutorySec.content?.statutoryLabel || 'Statutory Note:'}
                onChange={e =>
                  updateSection(statutorySec.id, s => ({
                    ...s,
                    content: { ...s.content, statutoryLabel: e.target.value }
                  }))
                }
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Full Compliance Disclaimer Text</label>
              <textarea
                rows={4}
                value={statutorySec.content?.statutoryText || statutorySec.subtitle || ''}
                onChange={e =>
                  updateSection(statutorySec.id, s => ({
                    ...s,
                    subtitle: e.target.value,
                    content: { ...s.content, statutoryText: e.target.value }
                  }))
                }
                className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* --- TAB 6: SEO META --- */}
        {activeTab === 'seo' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Metadata Settings
              </span>
              <h2 className="text-lg font-bold text-white">Search Engine Optimization (SEO)</h2>
              <p className="text-xs text-slate-400">
                Configure browser page title, meta description, and discoverability keywords indexed by Google and Bing.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">SEO Page Title Tag</label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Meta Keywords (Comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={e => setSeoKeywords(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
