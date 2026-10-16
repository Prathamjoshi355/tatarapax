import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_SERVICES_SECTIONS } from '../../../lib/defaultServices';
import { UniversalImageUploader } from '../../../components/dashboard/UniversalImageUploader';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Send,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AdminServicesPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminServicesPage({
  page,
  setPages,
  media = [],
  setMedia
}: AdminServicesPageProps) {
  const [activeTab, setActiveTab] = useState<
    'hero' | 'spotlight' | 'pillars' | 'process' | 'proof' | 'cta' | 'seo'
  >('hero');

  const [sections, setSections] = useState<CMSSection[]>(() => {
    if (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('services-'))) {
      return page.sections;
    }
    return DEFAULT_SERVICES_SECTIONS;
  });

  const [seoTitle, setSeoTitle] = useState(
    page.seo?.title || 'Our Placement & Training Services | TantraPex Technologies'
  );
  const [seoDesc, setSeoDesc] = useState(
    page.seo?.description ||
      'Complete career preparation and placement support services: 12 employability pillars, technical training, aptitude coaching, ATS resume audits, and mock interview panels.'
  );
  const [seoKeywords, setSeoKeywords] = useState(
    page.seo?.keywords ||
      'placement services, career training, resume building, mock interviews, aptitude tests, technical training, corporate drives, TantraPex'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Helper to update a section
  const updateSection = (sectionId: string, mutator: (sec: CMSSection) => CMSSection) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return mutator({ ...sec });
      })
    );
  };

  const getSection = (type: string, fallbackIdx: number): CMSSection => {
    return sections.find(s => s.type === type) || DEFAULT_SERVICES_SECTIONS[fallbackIdx];
  };

  const heroSec = getSection('services-hero', 0);
  const spotlightSec = getSection('services-spotlight', 1);
  const pillarsSec = getSection('services-pillars', 2);
  const processSec = getSection('services-process', 3);
  const proofSec = getSection('services-proof', 4);
  const ctaSec = getSection('services-cta', 5);

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
        title: 'Our Services',
        slug: '/services',
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
        triggerNotification('All Services CMS changes successfully saved to MongoDB Atlas!');
      } else {
        triggerNotification(`Save failed: ${saveJson.msg || 'Database error'}`);
      }
    } catch (err: any) {
      console.error('Error saving services page:', err);
      triggerNotification(`Save failed: ${err.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all Services sections to the redesign defaults?')) {
      setSections(DEFAULT_SERVICES_SECTIONS);
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
                Services • Live Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Our Services Content Management System
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Full administrative control: configure top hero masthead, impact telemetry, employability spotlight, 12 preparation pillars, 4-step workflow, on-ground photos, and CTA banner.
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
              href="#/services"
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
            { id: 'spotlight', label: 'Employability Spotlight', icon: Zap },
            { id: 'pillars', label: '12 Preparation Pillars', icon: Layers },
            { id: 'process', label: '4-Step Workflow', icon: CheckCircle },
            { id: 'proof', label: 'Campus & Mentorship Proof', icon: ImageIcon },
            { id: 'cta', label: 'CTA Banner', icon: Send },
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

        {/* Status Toast Notification */}
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

        {/* 3. TAB CONTENT EDITORS */}

        {/* --- TAB 1: HERO & IMPACT METRICS --- */}
        {activeTab === 'hero' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 01
              </span>
              <h2 className="text-lg font-bold text-white">Hero Masthead & Student Impact Telemetry</h2>
              <p className="text-xs text-slate-400">
                Configure breadcrumbs, category badge, main title, description, and the ISO 9001:2015 impact stats card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Category Pill Badge</label>
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
              <label className="text-xs font-bold text-slate-300">Page Subtitle</label>
              <textarea
                rows={3}
                value={heroSec.subtitle || ''}
                onChange={e => updateSection(heroSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Telemetry Card Settings */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Telemetry Card Configuration
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Impact Standard Label</label>
                  <input
                    type="text"
                    value={heroSec.content?.telemetry?.standardLabel || ''}
                    onChange={e =>
                      updateSection(heroSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          telemetry: {
                            ...s.content?.telemetry,
                            standardLabel: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">ISO Badge Text</label>
                  <input
                    type="text"
                    value={heroSec.content?.telemetry?.isoBadge || ''}
                    onChange={e =>
                      updateSection(heroSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          telemetry: {
                            ...s.content?.telemetry,
                            isoBadge: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* 2 Telemetry Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(heroSec.content?.telemetry?.stats || []).map((st: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Stat #{idx + 1}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400">Value (e.g. 100% Free)</label>
                        <input
                          type="text"
                          value={st.value || ''}
                          onChange={e => {
                            const newStats = [...(heroSec.content?.telemetry?.stats || [])];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            updateSection(heroSec.id, s => ({
                              ...s,
                              content: {
                                ...s.content,
                                telemetry: {
                                  ...s.content?.telemetry,
                                  stats: newStats
                                }
                              }
                            }));
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400">Label</label>
                        <input
                          type="text"
                          value={st.label || ''}
                          onChange={e => {
                            const newStats = [...(heroSec.content?.telemetry?.stats || [])];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            updateSection(heroSec.id, s => ({
                              ...s,
                              content: {
                                ...s.content,
                                telemetry: {
                                  ...s.content?.telemetry,
                                  stats: newStats
                                }
                              }
                            }));
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: EMPLOYABILITY SPOTLIGHT --- */}
        {activeTab === 'spotlight' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 02
              </span>
              <h2 className="text-lg font-bold text-white">Employability Spotlight & Assessment Banner</h2>
              <p className="text-xs text-slate-400">
                Manage the bridge section: narrative, check points, assessment engine badge, and high-resolution photo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Eyebrow Tag</label>
                <input
                  type="text"
                  value={spotlightSec.content?.eyebrow || ''}
                  onChange={e =>
                    updateSection(spotlightSec.id, s => ({
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
                  value={spotlightSec.title || ''}
                  onChange={e => updateSection(spotlightSec.id, s => ({ ...s, title: e.target.value }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Description</label>
              <textarea
                rows={3}
                value={spotlightSec.subtitle || ''}
                onChange={e => updateSection(spotlightSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Checkpoints */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300">Checkpoints</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(spotlightSec.content?.checkpoints || []).map((cp: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono">#{idx + 1}</span>
                    <input
                      type="text"
                      value={cp}
                      onChange={e => {
                        const newCp = [...(spotlightSec.content?.checkpoints || [])];
                        newCp[idx] = e.target.value;
                        updateSection(spotlightSec.id, s => ({
                          ...s,
                          content: { ...s.content, checkpoints: newCp }
                        }));
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Engine Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Assessment Engine Badge</label>
                <input
                  type="text"
                  value={spotlightSec.content?.engineBadgeText || ''}
                  onChange={e =>
                    updateSection(spotlightSec.id, s => ({
                      ...s,
                      content: { ...s.content, engineBadgeText: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Benchmark Tag Text</label>
                <input
                  type="text"
                  value={spotlightSec.content?.benchmarkText || ''}
                  onChange={e =>
                    updateSection(spotlightSec.id, s => ({
                      ...s,
                      content: { ...s.content, benchmarkText: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Image URL & Cloudinary Uploader */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Spotlight Feature Image</span>
                {spotlightSec.content?.imageUrl && (
                  <a
                    href={spotlightSec.content.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>View Image</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <input
                type="text"
                placeholder="https://..."
                value={spotlightSec.content?.imageUrl || ''}
                onChange={e =>
                  updateSection(spotlightSec.id, s => ({
                    ...s,
                    content: { ...s.content, imageUrl: e.target.value }
                  }))
                }
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />

              <div className="flex items-center gap-3">
                <UniversalImageUploader
                  label="Upload New Spotlight Image (Cloudinary)"
                  value={spotlightSec.content?.imageUrl || ''}
                  onChange={url =>
                    updateSection(spotlightSec.id, s => ({
                      ...s,
                      content: { ...s.content, imageUrl: url }
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: 12 PREPARATION PILLARS --- */}
        {activeTab === 'pillars' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  Section 03
                </span>
                <h2 className="text-lg font-bold text-white">12 Placement Preparation Modules Grid</h2>
                <p className="text-xs text-slate-400">
                  Manage the 12 core service pillars. Reorder, edit copy, change format tag, icon, or target links.
                </p>
              </div>

              <button
                onClick={() => {
                  const newPillar = {
                    id: `pillar-${Date.now()}`,
                    pillarNumber: `Pillar ${String((pillarsSec.content?.pillars?.length || 0) + 1).padStart(2, '0')}`,
                    title: 'New Service Pillar',
                    description: 'Description of the new training module or service offering.',
                    format: 'Live Training',
                    icon: 'FileText',
                    linkText: 'Learn More',
                    linkUrl: '#/contact'
                  };
                  updateSection(pillarsSec.id, s => ({
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

            {/* Grid Header Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Eyebrow</label>
                <input
                  type="text"
                  value={pillarsSec.content?.eyebrow || ''}
                  onChange={e =>
                    updateSection(pillarsSec.id, s => ({
                      ...s,
                      content: { ...s.content, eyebrow: e.target.value }
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-300">Title</label>
                <input
                  type="text"
                  value={pillarsSec.title || ''}
                  onChange={e => updateSection(pillarsSec.id, s => ({ ...s, title: e.target.value }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Subtitle</label>
              <textarea
                rows={2}
                value={pillarsSec.subtitle || ''}
                onChange={e => updateSection(pillarsSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* List of 12 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(pillarsSec.content?.pillars || []).map((pillar: any, pIdx: number) => (
                <div
                  key={pillar.id || pIdx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        #{pIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={pillar.pillarNumber || ''}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], pillarNumber: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-[11px] font-mono text-slate-300 w-24"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {pIdx > 0 && (
                        <button
                          onClick={() => {
                            const updated = [...(pillarsSec.content?.pillars || [])];
                            const temp = updated[pIdx];
                            updated[pIdx] = updated[pIdx - 1];
                            updated[pIdx - 1] = temp;
                            updateSection(pillarsSec.id, s => ({
                              ...s,
                              content: { ...s.content, pillars: updated }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Move up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {pIdx < (pillarsSec.content?.pillars?.length || 0) - 1 && (
                        <button
                          onClick={() => {
                            const updated = [...(pillarsSec.content?.pillars || [])];
                            const temp = updated[pIdx];
                            updated[pIdx] = updated[pIdx + 1];
                            updated[pIdx + 1] = temp;
                            updateSection(pillarsSec.id, s => ({
                              ...s,
                              content: { ...s.content, pillars: updated }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Move down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete pillar "${pillar.title}"?`)) {
                            const updated = (pillarsSec.content?.pillars || []).filter(
                              (_: any, i: number) => i !== pIdx
                            );
                            updateSection(pillarsSec.id, s => ({
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

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title || ''}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold">Format Badge</label>
                      <input
                        type="text"
                        value={pillar.format || ''}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], format: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
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
                      value={pillar.description || ''}
                      onChange={e => {
                        const updated = [...(pillarsSec.content?.pillars || [])];
                        updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                        updateSection(pillarsSec.id, s => ({
                          ...s,
                          content: { ...s.content, pillars: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Icon</label>
                      <select
                        value={pillar.icon || 'FileText'}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], icon: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="FileText">FileText (Resume)</option>
                        <option value="Share2">Share2 (LinkedIn)</option>
                        <option value="Calculator">Calculator (Aptitude)</option>
                        <option value="Terminal">Terminal (Coding)</option>
                        <option value="Mic">Mic (Mock Interview)</option>
                        <option value="Brain">Brain (Interview Prep)</option>
                        <option value="MessageSquare">MessageSquare (Communication)</option>
                        <option value="Compass">Compass (Counseling)</option>
                        <option value="Briefcase">Briefcase (Placement)</option>
                        <option value="Building2">Building2 (Corporate)</option>
                        <option value="BookOpen">BookOpen (LMS)</option>
                        <option value="Award">Award (Certifications)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Link Text</label>
                      <input
                        type="text"
                        value={pillar.linkText || 'Learn More'}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], linkText: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400">Target Route</label>
                      <input
                        type="text"
                        value={pillar.linkUrl || '#/contact'}
                        onChange={e => {
                          const updated = [...(pillarsSec.content?.pillars || [])];
                          updated[pIdx] = { ...updated[pIdx], linkUrl: e.target.value };
                          updateSection(pillarsSec.id, s => ({
                            ...s,
                            content: { ...s.content, pillars: updated }
                          }));
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: 4-STEP WORKFLOW --- */}
        {activeTab === 'process' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 04
              </span>
              <h2 className="text-lg font-bold text-white">How It Works: 4-Step Process & Timeline Tracker</h2>
              <p className="text-xs text-slate-400">
                Configure the linear candidate roadmap from enrollment to final offer letter, plus fast-track timing metrics.
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
                      <label className="text-[10px] text-slate-400">Stage Badge Label</label>
                      <input
                        type="text"
                        value={step.stageLabel || ''}
                        onChange={e => {
                          const updated = [...(processSec.content?.steps || [])];
                          updated[sIdx] = { ...updated[sIdx], stageLabel: e.target.value };
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

            {/* Fast-Track Readiness Tracker Ribbon Settings */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mt-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Fast-Track Readiness Window Tracker
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Banner Title</label>
                  <input
                    type="text"
                    value={processSec.content?.tracker?.title || ''}
                    onChange={e =>
                      updateSection(processSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          tracker: {
                            ...s.content?.tracker,
                            title: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Banner Subtitle / Metric Text</label>
                  <input
                    type="text"
                    value={processSec.content?.tracker?.subtitle || ''}
                    onChange={e =>
                      updateSection(processSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          tracker: {
                            ...s.content?.tracker,
                            subtitle: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Button Text</label>
                  <input
                    type="text"
                    value={processSec.content?.tracker?.buttonText || ''}
                    onChange={e =>
                      updateSection(processSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          tracker: {
                            ...s.content?.tracker,
                            buttonText: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Button Link URL</label>
                  <input
                    type="text"
                    value={processSec.content?.tracker?.buttonUrl || ''}
                    onChange={e =>
                      updateSection(processSec.id, s => ({
                        ...s,
                        content: {
                          ...s.content,
                          tracker: {
                            ...s.content?.tracker,
                            buttonUrl: e.target.value
                          }
                        }
                      }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: CAMPUS & MENTORSHIP PROOF --- */}
        {activeTab === 'proof' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 05
              </span>
              <h2 className="text-lg font-bold text-white">Campus Bootcamps & Interview Panel Proof</h2>
              <p className="text-xs text-slate-400">
                Manage the 2 large photography cards proving on-ground university engagement and recruiter feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(proofSec.content?.cards || []).map((card: any, cIdx: number) => (
                <div
                  key={card.id || cIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                      Photo Card #{cIdx + 1}
                    </span>
                    {card.imageUrl && (
                      <a
                        href={card.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>Preview</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Category Tag</label>
                    <input
                      type="text"
                      value={card.tag || ''}
                      onChange={e => {
                        const updated = [...(proofSec.content?.cards || [])];
                        updated[cIdx] = { ...updated[cIdx], tag: e.target.value };
                        updateSection(proofSec.id, s => ({
                          ...s,
                          content: { ...s.content, cards: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Card Title</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={e => {
                        const updated = [...(proofSec.content?.cards || [])];
                        updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                        updateSection(proofSec.id, s => ({
                          ...s,
                          content: { ...s.content, cards: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Description</label>
                    <textarea
                      rows={2}
                      value={card.description || ''}
                      onChange={e => {
                        const updated = [...(proofSec.content?.cards || [])];
                        updated[cIdx] = { ...updated[cIdx], description: e.target.value };
                        updateSection(proofSec.id, s => ({
                          ...s,
                          content: { ...s.content, cards: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200"
                    />
                  </div>

                  {/* Image URL & Upload */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                    <label className="text-[10px] text-slate-400 font-bold">Image URL</label>
                    <input
                      type="text"
                      value={card.imageUrl || ''}
                      onChange={e => {
                        const updated = [...(proofSec.content?.cards || [])];
                        updated[cIdx] = { ...updated[cIdx], imageUrl: e.target.value };
                        updateSection(proofSec.id, s => ({
                          ...s,
                          content: { ...s.content, cards: updated }
                        }));
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />

                    <div className="pt-1">
                      <UniversalImageUploader
                        label={`Upload Card #${cIdx + 1} Image`}
                        value={card.imageUrl || ''}
                        onChange={url => {
                          const updated = [...(proofSec.content?.cards || [])];
                          updated[cIdx] = { ...updated[cIdx], imageUrl: url };
                          updateSection(proofSec.id, s => ({
                            ...s,
                            content: { ...s.content, cards: updated }
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 6: BOTTOM CTA BANNER --- */}
        {activeTab === 'cta' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col gap-1 border-b border-slate-800/80 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Section 06
              </span>
              <h2 className="text-lg font-bold text-white">Placement Call-To-Action Banner</h2>
              <p className="text-xs text-slate-400">
                Configure the bottom high-conversion lead generation banner with dual action buttons.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Eyebrow Badge</label>
              <input
                type="text"
                value={ctaSec.content?.eyebrow || ''}
                onChange={e =>
                  updateSection(ctaSec.id, s => ({
                    ...s,
                    content: { ...s.content, eyebrow: e.target.value }
                  }))
                }
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Banner Headline (H2)</label>
              <input
                type="text"
                value={ctaSec.title || ''}
                onChange={e => updateSection(ctaSec.id, s => ({ ...s, title: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Subtitle</label>
              <input
                type="text"
                value={ctaSec.subtitle || ''}
                onChange={e => updateSection(ctaSec.id, s => ({ ...s, subtitle: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Primary Action Button (Green)
                </span>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">Button Label</label>
                  <input
                    type="text"
                    value={ctaSec.content?.primaryButtonText || ''}
                    onChange={e =>
                      updateSection(ctaSec.id, s => ({
                        ...s,
                        content: { ...s.content, primaryButtonText: e.target.value }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">Target URL / Hash</label>
                  <input
                    type="text"
                    value={ctaSec.content?.primaryButtonUrl || ''}
                    onChange={e =>
                      updateSection(ctaSec.id, s => ({
                        ...s,
                        content: { ...s.content, primaryButtonUrl: e.target.value }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Secondary Action Button (Light)
                </span>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">Button Label</label>
                  <input
                    type="text"
                    value={ctaSec.content?.secondaryButtonText || ''}
                    onChange={e =>
                      updateSection(ctaSec.id, s => ({
                        ...s,
                        content: { ...s.content, secondaryButtonText: e.target.value }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">Target URL / Hash</label>
                  <input
                    type="text"
                    value={ctaSec.content?.secondaryButtonUrl || ''}
                    onChange={e =>
                      updateSection(ctaSec.id, s => ({
                        ...s,
                        content: { ...s.content, secondaryButtonUrl: e.target.value }
                      }))
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 7: SEO META --- */}
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
