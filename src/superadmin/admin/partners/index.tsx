import React, { useState, useEffect } from 'react';
import { CMSPage, CMSSection, MediaItem, HiringPartner } from '../../../types';
import { DEFAULT_HIRING_PARTNERS_LIST, DEFAULT_PARTNERS_SECTIONS } from '../../../lib/defaultPartners';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Building2,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Globe,
  Info,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Users,
  CheckSquare,
  Zap,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPartnersPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  hiringPartners: HiringPartner[];
  setHiringPartners: React.Dispatch<React.SetStateAction<HiringPartner[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminPartnersPage({
  page,
  setPages,
  hiringPartners,
  setHiringPartners
}: AdminPartnersPageProps) {
  const [activeTab, setActiveTab] = useState<
    'partners' | 'hero' | 'notice' | 'process' | 'cta' | 'seo'
  >('partners');

  const [sections, setSections] = useState<CMSSection[]>(() => {
    if (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('partners-'))) {
      return page.sections;
    }
    return DEFAULT_PARTNERS_SECTIONS;
  });

  const [partnersList, setLocalPartnersList] = useState<HiringPartner[]>(() => {
    if (hiringPartners && hiringPartners.length > 0) {
      return hiringPartners;
    }
    return [];
  });

  useEffect(() => {
    if (hiringPartners) {
      setLocalPartnersList(hiringPartners);
    }
  }, [hiringPartners]);

  const [seoTitle, setSeoTitle] = useState(
    page.seo?.title || 'Placement Partners & Corporate Recruiters Directory | TantraPex'
  );
  const [seoDesc, setSeoDesc] = useState(
    page.seo?.description ||
      'Explore corporate placement partners, active recruitment drives, intake routes, and enterprise hiring tracks through TantraPex Technologies.'
  );
  const [seoKeywords, setSeoKeywords] = useState(
    page.seo?.keywords ||
      'placement partners, corporate hiring companies, enterprise recruiters, campus drives, IT services, TantraPex'
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
    return sections.find(s => s.type === type) || DEFAULT_PARTNERS_SECTIONS[fallbackIdx];
  };

  const heroSec = getSection('partners-hero', 0);
  const noticeSec = getSection('partners-notice', 1);
  const processSec = getSection('partners-process', 2);
  const ctaSec = getSection('partners-cta', 3);

  // Hiring Partners CRUD
  const handleAddPartner = () => {
    const newPartner: HiringPartner = {
      id: `hp-${Date.now()}`,
      name: 'New Corporate Partner',
      shortCode: 'NCP',
      logoUrl: '',
      tier: 'Tier-1',
      hasActiveDrive: true,
      category: 'it-services',
      industry: 'IT Services & Cloud',
      trackLabel: 'Current Intake',
      trackValue: 'Associate Engineer',
      status: 'active',
      isVisible: true
    };
    setLocalPartnersList(prev => [newPartner, ...prev]);
  };

  const handleUpdatePartner = (id: string, field: keyof HiringPartner, value: any) => {
    setLocalPartnersList(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDeletePartner = (id: string) => {
    if (window.confirm('Are you sure you want to remove this hiring partner company?')) {
      setLocalPartnersList(prev => prev.filter(p => p.id !== id));
    }
  };

  // Reset to original stitch defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all Placement Partners content and company directory to original defaults?')) {
      setSections(DEFAULT_PARTNERS_SECTIONS);
      setLocalPartnersList(DEFAULT_HIRING_PARTNERS_LIST);
      setSeoTitle('Placement Partners & Corporate Recruiters Directory | TantraPex');
      setSeoDesc('Explore corporate placement partners, active recruitment drives, and enterprise hiring tracks.');
      setSeoKeywords('placement partners, corporate hiring companies, enterprise recruiters, campus drives, TantraPex');
    }
  };

  // Save to MongoDB Atlas via /api/save-all
  const handleSaveToMongoDB = async () => {
    setIsSaving(true);
    setSaveStatus('Saving to MongoDB Atlas...');

    const updatedPage: CMSPage = {
      ...page,
      id: 'companies',
      title: 'Placement Partners',
      slug: '/companies',
      sections,
      seo: {
        title: seoTitle,
        description: seoDesc,
        keywords: seoKeywords
      },
      updatedAt: new Date().toISOString()
    };

    setPages(prevPages =>
      prevPages.map(p => (p.id === 'companies' ? updatedPage : p))
    );
    setHiringPartners(partnersList);

    try {
      const getRes = await fetch('/api/load-all');
      const getJson = await getRes.json();
      const currentData = getJson.data || {};

      const existingPages: CMSPage[] = currentData.pages || [];
      const mergedPages = existingPages.map(p => (p.id === 'companies' ? updatedPage : p));
      if (!mergedPages.some(p => p.id === 'companies')) {
        mergedPages.push(updatedPage);
      }

      const response = await fetch('/api/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          pages: mergedPages,
          hiring_partners: partnersList
        })
      });

      const res = await response.json();
      if (res.success) {
        setSaveStatus('Saved & Published to MongoDB Atlas Successfully!');
      } else {
        setSaveStatus(`Saved locally. Note: ${res.msg || 'MongoDB sync pending'}`);
      }
    } catch (err: any) {
      setSaveStatus(`Saved locally in browser. ${err.message || ''}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Action Ribbon */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              TantraPex CMS Editor • Placement Partners • Live Connected
            </span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Placement Partners CMS Configurator</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage 22+ corporate recruiters, tier labels, active drive status, recruitment workflow, and recruiter acquisition CTA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Reset to default stitch configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => { window.location.hash = '#/companies'; }}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Preview live public page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live Page</span>
          </button>

          <button
            onClick={handleSaveToMongoDB}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish to MongoDB'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveStatus && (
        <div className="w-full bg-emerald-950/90 border-b border-emerald-800 text-emerald-300 px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{saveStatus}</span>
          </div>
          <button onClick={() => setSaveStatus(null)} className="text-emerald-400 hover:text-white text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation Controls */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'partners', label: `Companies Directory (${partnersList.length})`, icon: Building2 },
          { id: 'hero', label: 'Hero & Metrics', icon: Sparkles },
          { id: 'notice', label: 'Transparency Note', icon: Info },
          { id: 'process', label: 'Hiring Process (3 Steps)', icon: Users },
          { id: 'cta', label: 'Recruiter CTA Block', icon: Briefcase },
          { id: 'seo', label: 'SEO Meta', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANIES DIRECTORY CRUD */}
      {activeTab === 'partners' && (
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                RECRUITER DIRECTORY
              </span>
              <h2 className="text-lg font-bold text-white">Partner Companies & Active Drives</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure company shortCode, tier badge, active drive status, category, and recruitment tracks.
              </p>
            </div>
            <button
              onClick={handleAddPartner}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Company</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnersList.map((partner, idx) => (
              <div
                key={partner.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-md"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[160px]">{partner.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePartner(partner.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Partner Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => handleUpdatePartner(partner.id, 'name', e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ShortCode / Box</label>
                      <input
                        type="text"
                        value={partner.shortCode || ''}
                        onChange={(e) => handleUpdatePartner(partner.id, 'shortCode', e.target.value)}
                        placeholder="e.g. TCS"
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                      <select
                        value={partner.category || 'it-services'}
                        onChange={(e) => handleUpdatePartner(partner.id, 'category', e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="it-services">IT Services</option>
                        <option value="product-enterprise">Product & Enterprise</option>
                        <option value="core-engineering">Core Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tier Badge Text</label>
                      <input
                        type="text"
                        value={partner.tier || 'Tier-1'}
                        onChange={(e) => handleUpdatePartner(partner.id, 'tier', e.target.value)}
                        placeholder="e.g. Tier-1"
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Industry Subtitle</label>
                      <input
                        type="text"
                        value={partner.industry || ''}
                        onChange={(e) => handleUpdatePartner(partner.id, 'industry', e.target.value)}
                        placeholder="e.g. IT Services & Consulting"
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Track Label</label>
                      <input
                        type="text"
                        value={partner.trackLabel || 'Intake Route'}
                        onChange={(e) => handleUpdatePartner(partner.id, 'trackLabel', e.target.value)}
                        placeholder="e.g. Current Intake"
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Track Program</label>
                      <input
                        type="text"
                        value={partner.trackValue || ''}
                        onChange={(e) => handleUpdatePartner(partner.id, 'trackValue', e.target.value)}
                        placeholder="e.g. Specialist Programmer"
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* Logo URL */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Logo Image URL (Optional)</label>
                    <input
                      type="text"
                      value={partner.logoUrl || ''}
                      onChange={(e) => handleUpdatePartner(partner.id, 'logoUrl', e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Active Drive Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!partner.hasActiveDrive}
                      onChange={(e) => handleUpdatePartner(partner.id, 'hasActiveDrive', e.target.checked)}
                      className="rounded accent-emerald-500 h-4 w-4"
                    />
                    <span className="text-emerald-400">● Active Drive Live</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {partner.hasActiveDrive ? 'Pill Shown' : 'Standard Badge'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HERO & METRICS */}
      {activeTab === 'hero' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 01
              </span>
              <h2 className="text-lg font-bold text-white">Hero Masthead & Recruitment Metrics</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure top masthead title, pill badge, description, and metric counter pills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pill Badge Text</label>
                <input
                  type="text"
                  value={heroSec.content?.badgeText || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, badgeText: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Page Headline</label>
                <input
                  type="text"
                  value={heroSec.title || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({ ...sec, title: e.target.value }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle Description</label>
              <textarea
                rows={3}
                value={heroSec.subtitle || ''}
                onChange={(e) =>
                  updateSection(heroSec.id, sec => ({ ...sec, subtitle: e.target.value }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Partners Label</label>
                <input
                  type="text"
                  value={heroSec.content?.verifiedPartnersLabel || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, verifiedPartnersLabel: e.target.value }
                    }))
                  }
                  placeholder="Verified Partners"
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Drives Label</label>
                <input
                  type="text"
                  value={heroSec.content?.activeDrivesLabel || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, activeDrivesLabel: e.target.value }
                    }))
                  }
                  placeholder="Drives Active Today"
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Placeholder</label>
              <input
                type="text"
                value={heroSec.content?.searchPlaceholder || ''}
                onChange={(e) =>
                  updateSection(heroSec.id, sec => ({
                    ...sec,
                    content: { ...sec.content, searchPlaceholder: e.target.value }
                  }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSPARENCY NOTICE */}
      {activeTab === 'notice' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 02
              </span>
              <h2 className="text-lg font-bold text-white">Corporate Transparency Note</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Disclaimer explaining that displayed logos represent organizations participating in our network.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notice Text</label>
              <textarea
                rows={4}
                value={noticeSec.content?.noticeText || ''}
                onChange={(e) =>
                  updateSection(noticeSec.id, sec => ({
                    ...sec,
                    content: { ...sec.content, noticeText: e.target.value }
                  }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HIRING PROCESS STEPS */}
      {activeTab === 'process' && (
        <div className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 03
              </span>
              <h2 className="text-lg font-bold text-white">How Companies Hire Through TantraPex</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The 3 structured value steps explaining the zero-cost recruiter onboarding process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eyebrow Tag</label>
                <input
                  type="text"
                  value={processSec.content?.eyebrow || ''}
                  onChange={(e) =>
                    updateSection(processSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, eyebrow: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold text-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section Title</label>
                <input
                  type="text"
                  value={processSec.title || ''}
                  onChange={(e) =>
                    updateSection(processSec.id, sec => ({ ...sec, title: e.target.value }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle</label>
              <textarea
                rows={2}
                value={processSec.subtitle || ''}
                onChange={(e) =>
                  updateSection(processSec.id, sec => ({ ...sec, subtitle: e.target.value }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              {(processSec.content?.steps || []).map((step: any, sIdx: number) => (
                <div key={step.id || sIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Step 0{sIdx + 1}</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Step Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const newSteps = [...(processSec.content?.steps || [])];
                        newSteps[sIdx] = { ...newSteps[sIdx], title: e.target.value };
                        updateSection(processSec.id, sec => ({
                          ...sec,
                          content: { ...sec.content, steps: newSteps }
                        }));
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:border-emerald-500 outline-none font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => {
                        const newSteps = [...(processSec.content?.steps || [])];
                        newSteps[sIdx] = { ...newSteps[sIdx], description: e.target.value };
                        updateSection(processSec.id, sec => ({
                          ...sec,
                          content: { ...sec.content, steps: newSteps }
                        }));
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Stat Label</label>
                      <input
                        type="text"
                        value={step.metricLabel}
                        onChange={(e) => {
                          const newSteps = [...(processSec.content?.steps || [])];
                          newSteps[sIdx] = { ...newSteps[sIdx], metricLabel: e.target.value };
                          updateSection(processSec.id, sec => ({
                            ...sec,
                            content: { ...sec.content, steps: newSteps }
                          }));
                        }}
                        className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Stat Value</label>
                      <input
                        type="text"
                        value={step.metricValue}
                        onChange={(e) => {
                          const newSteps = [...(processSec.content?.steps || [])];
                          newSteps[sIdx] = { ...newSteps[sIdx], metricValue: e.target.value };
                          updateSection(processSec.id, sec => ({
                            ...sec,
                            content: { ...sec.content, steps: newSteps }
                          }));
                        }}
                        className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-emerald-400 font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECRUITER CTA BLOCK */}
      {activeTab === 'cta' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 04
              </span>
              <h2 className="text-lg font-bold text-white">Recruiter Acquisition CTA</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure headline, brochure download link, and placement desk contact destination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eyebrow Tag</label>
                <input
                  type="text"
                  value={ctaSec.content?.eyebrow || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, eyebrow: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none uppercase font-bold text-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Heading Title</label>
                <input
                  type="text"
                  value={ctaSec.title || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({ ...sec, title: e.target.value }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle</label>
              <textarea
                rows={2}
                value={ctaSec.subtitle || ''}
                onChange={(e) =>
                  updateSection(ctaSec.id, sec => ({ ...sec, subtitle: e.target.value }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Button Text</label>
                <input
                  type="text"
                  value={ctaSec.content?.primaryBtnText || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, primaryBtnText: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Button URL</label>
                <input
                  type="text"
                  value={ctaSec.content?.primaryBtnLink || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, primaryBtnLink: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secondary Button Text</label>
                <input
                  type="text"
                  value={ctaSec.content?.secondaryBtnText || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, secondaryBtnText: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brochure Download URL</label>
                <input
                  type="text"
                  value={ctaSec.content?.brochureUrl || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, brochureUrl: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SEO META */}
      {activeTab === 'seo' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                METADATA & INDEXING
              </span>
              <h2 className="text-lg font-bold text-white">SEO & Search Engine Optimization</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage Google search titles, preview descriptions, and ranking keywords for Placement Partners.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Keywords (Comma Separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
