import React, { useState, useEffect } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_PRICING_SECTIONS } from '../../../lib/defaultPricing';
import {
  FileText,
  Settings,
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  CreditCard,
  BookOpen,
  HelpCircle,
  Megaphone,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  Copy,
  ChevronUp,
  ChevronDown,
  Star,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

interface AdminPricingPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminPricingPage({
  page,
  setPages
}: AdminPricingPageProps) {
  // Tabs: header, plans, curriculum, faqs, cta, seo
  const [activeTab, setActiveTab] = useState<'header' | 'plans' | 'curriculum' | 'faqs' | 'cta' | 'seo'>('header');

  // Pull sections or fallback to defaults
  const currentSections = page.sections && page.sections.some(s => s.type === 'pricing-header' || s.type === 'pricing-plans')
    ? page.sections
    : DEFAULT_PRICING_SECTIONS;

  const [sections, setSections] = useState<CMSSection[]>(currentSections);

  useEffect(() => {
    if (page?.sections && page.sections.length > 0) {
      setSections(page.sections);
    }
  }, [page?.sections]);

  // SEO state
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || "Pricing & Programs | TantraPex Technologies");
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || "Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free.");
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || "pricing, placement training fees, career pro plan, campus mou, fresher training cost");

  // Notifications
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update specific section field
  const updateSectionField = (sectionType: string, fieldPath: string, value: any) => {
    setSections(prev => {
      const exists = prev.some(sec => sec.type === sectionType);
      if (exists) {
        return prev.map(sec => {
          if (sec.type !== sectionType) return sec;
          const updated = { ...sec };
          if (fieldPath === 'title') {
            updated.title = value;
          } else if (fieldPath === 'subtitle') {
            updated.subtitle = value;
          } else if (fieldPath.startsWith('content.')) {
            const subKey = fieldPath.replace('content.', '');
            updated.content = {
              ...(updated.content || {}),
              [subKey]: value
            };
          }
          return updated;
        });
      } else {
        // If section does not exist in array, find default template
        const base: CMSSection = DEFAULT_PRICING_SECTIONS.find(s => s.type === sectionType) || {
          id: sectionType,
          type: sectionType as any,
          title: '',
          subtitle: '',
          content: {},
          design: {} as any
        };
        const newSec: CMSSection = { ...base };
        if (fieldPath === 'title') newSec.title = value;
        else if (fieldPath === 'subtitle') newSec.subtitle = value;
        else if (fieldPath.startsWith('content.')) {
          const subKey = fieldPath.replace('content.', '');
          newSec.content = { ...(newSec.content || {}), [subKey]: value };
        }
        return [...prev, newSec];
      }
    });
  };

  const headerSection = sections.find(s => s.type === 'pricing-header') || DEFAULT_PRICING_SECTIONS[0];
  const plansSection = sections.find(s => s.type === 'pricing-plans') || DEFAULT_PRICING_SECTIONS[1];
  const curriculumSection = sections.find(s => s.type === 'pricing-curriculum') || DEFAULT_PRICING_SECTIONS[2];
  const faqsSection = sections.find(s => s.type === 'pricing-faqs') || DEFAULT_PRICING_SECTIONS[3];
  const ctaSection = sections.find(s => s.type === 'pricing-cta') || DEFAULT_PRICING_SECTIONS[4];

  // Helper to normalize feature items (string or object)
  const normalizeFeature = (f: any) => {
    if (typeof f === 'string') {
      return { text: f, included: true };
    }
    return {
      text: f?.text || '',
      included: f?.included !== false
    };
  };

  // Live array of pricing plans
  const rawPlans: any[] = plansSection.content?.plans !== undefined
    ? plansSection.content.plans
    : (DEFAULT_PRICING_SECTIONS[1].content?.plans || []);

  const handleUpdatePlan = (pIdx: number, updates: Partial<any>) => {
    const copy = [...rawPlans];
    copy[pIdx] = { ...copy[pIdx], ...updates };
    if ('numericAmount' in updates && !('price' in updates)) {
      copy[pIdx].price = updates.numericAmount;
    }
    updateSectionField('pricing-plans', 'content.plans', copy);
  };

  const handleAddNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlan = {
      id: newId,
      name: `Pricing Package ${rawPlans.length + 1}`,
      status: "active",
      badge: "Active Package",
      statusText: "Batch 2025-26",
      cohortTag: "Student Intensive Track",
      desc: "Full comprehensive placement preparation with live mentorship, interview mocks, and LMS access.",
      price: 3999,
      numericAmount: 3999,
      period: "/ One-Time",
      sublabel: "Inclusive of all taxes • Non-refundable",
      features: [
        { text: "6 Months LMS & Sandbox Access", included: true },
        { text: "1-on-1 Technical Mock Interviews", included: true },
        { text: "ATS-Compliant Resume Overhaul", included: true },
        { text: "Priority Company Drive Recommendations", included: true }
      ],
      btnText: "Enroll Now — ₹3,999",
      btnLink: "",
      footerText: "Instant LMS portal activation on enrollment",
      isMostPopular: rawPlans.length === 0,
      duration: "6 Months"
    };
    const updated = [...rawPlans, newPlan];
    updateSectionField('pricing-plans', 'content.plans', updated);
    triggerNotification("New pricing package added! Configure details and click 'Save & Publish to MongoDB'.");
  };

  const handleDeletePlan = (pIdx: number) => {
    const target = rawPlans[pIdx];
    if (window.confirm(`Are you sure you want to delete the plan "${target?.name || 'this plan'}"?`)) {
      const updated = rawPlans.filter((_, idx) => idx !== pIdx);
      updateSectionField('pricing-plans', 'content.plans', updated);
      triggerNotification(`Plan "${target?.name || 'Package'}" removed.`);
    }
  };

  const handleDuplicatePlan = (pIdx: number) => {
    const source = rawPlans[pIdx];
    const cloned = {
      ...JSON.parse(JSON.stringify(source)),
      id: `plan-${Date.now()}`,
      name: `${source.name || 'Plan'} (Copy)`,
      isMostPopular: false
    };
    const copy = [...rawPlans];
    copy.splice(pIdx + 1, 0, cloned);
    updateSectionField('pricing-plans', 'content.plans', copy);
    triggerNotification(`Duplicated plan "${source.name}".`);
  };

  const handleMovePlan = (direction: 'up' | 'down', pIdx: number) => {
    const targetIdx = direction === 'up' ? pIdx - 1 : pIdx + 1;
    if (targetIdx < 0 || targetIdx >= rawPlans.length) return;
    const copy = [...rawPlans];
    const temp = copy[pIdx];
    copy[pIdx] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateSectionField('pricing-plans', 'content.plans', copy);
  };

  const handleAddFeature = (pIdx: number) => {
    const copy = [...rawPlans];
    const rawFeats = copy[pIdx].features || [];
    const normalized = rawFeats.map(normalizeFeature);
    normalized.push({ text: "New Plan Benefit / Resource", included: true });
    copy[pIdx] = { ...copy[pIdx], features: normalized };
    updateSectionField('pricing-plans', 'content.plans', copy);
  };

  const handleUpdateFeature = (pIdx: number, fIdx: number, updates: Partial<{ text: string; included: boolean }>) => {
    const copy = [...rawPlans];
    const rawFeats = copy[pIdx].features || [];
    const normalized = rawFeats.map(normalizeFeature);
    normalized[fIdx] = { ...normalized[fIdx], ...updates };
    copy[pIdx] = { ...copy[pIdx], features: normalized };
    updateSectionField('pricing-plans', 'content.plans', copy);
  };

  const handleDeleteFeature = (pIdx: number, fIdx: number) => {
    const copy = [...rawPlans];
    const rawFeats = copy[pIdx].features || [];
    const normalized = rawFeats.map(normalizeFeature);
    const filtered = normalized.filter((_: any, idx: number) => idx !== fIdx);
    copy[pIdx] = { ...copy[pIdx], features: filtered };
    updateSectionField('pricing-plans', 'content.plans', copy);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedPage: CMSPage = {
        ...page,
        id: "pricing",
        title: "Pricing & Programs",
        slug: "/pricing",
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: sections
      };

      // 1. Update in-memory pages state
      setPages(prev => {
        const exists = prev.some(p => p.id === 'pricing');
        if (exists) {
          return prev.map(p => p.id === 'pricing' ? updatedPage : p);
        }
        return [...prev, updatedPage];
      });

      // 2. Save page to MongoDB
      const res = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: updatedPage })
      });

      if (!res.ok) {
        throw new Error("Failed to save to database");
      }

      triggerNotification("Pricing & Programs page saved & published to MongoDB!");
    } catch (err: any) {
      console.error("Failed to save Pricing page:", err);
      triggerNotification("Error saving to database. Local changes preserved.");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all Pricing content to the Stitch institutional design defaults?")) {
      setSections(DEFAULT_PRICING_SECTIONS);
      triggerNotification("Reset to standard Stitch defaults. Click 'Save & Publish' to persist.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-slate-100 font-sans pb-16">
      
      {/* Toast Notification */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 z-[200] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4" />
          <span className="text-xs font-bold">{saveStatus}</span>
        </div>
      )}

      {/* 1. Header Bar with Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono">
              Live Database Connected
            </span>
            <span className="text-xs text-slate-400 font-mono">/pricing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Pricing &amp; Programs Editor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Full administrative control: header masthead, transparency note, 3 pricing tiers, curriculum modules, FAQs, and bottom CTA.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Reset to Stitch design defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="#/pricing"
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
            <span>{isSaving ? "Saving to MongoDB..." : "Save & Publish to MongoDB"}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'header', label: 'Header & Transparency', icon: Layers },
          { id: 'plans', label: `Pricing Packages (${rawPlans.length})`, icon: CreditCard },
          { id: 'curriculum', label: 'Curriculum & Benchmarks', icon: BookOpen },
          { id: 'faqs', label: 'Accordion FAQs (4)', icon: HelpCircle },
          { id: 'cta', label: 'Advisory CTA Banner', icon: Megaphone },
          { id: 'seo', label: 'SEO Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: HEADER & TRANSPARENCY */}
      {activeTab === 'header' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Masthead Settings</span>
            <h2 className="text-lg font-bold text-white mt-1">Pricing Page Header &amp; Mandatory Transparency Note</h2>
            <p className="text-xs text-slate-400 mt-1">Configure page title, subtitle, and the zero-cost placement drives disclaimer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Eyebrow Pill</label>
              <input
                type="text"
                value={headerSection.content?.eyebrow || ''}
                onChange={(e) => updateSectionField('pricing-header', 'content.eyebrow', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Transparent Pricing"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Headline Title</label>
              <input
                type="text"
                value={headerSection.title || ''}
                onChange={(e) => updateSectionField('pricing-header', 'title', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                placeholder="Pricing & Programs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Header Subtitle</label>
            <textarea
              rows={2}
              value={headerSection.subtitle || ''}
              onChange={(e) => updateSectionField('pricing-header', 'subtitle', e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              placeholder="Simple, affordable training programs..."
            />
          </div>

          {/* Transparency Disclaimer Note */}
          <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Zero Cost For Drive Placements Disclaimer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Title</label>
                <input
                  type="text"
                  value={headerSection.content?.transparencyNote?.title || ''}
                  onChange={(e) => {
                    const cur = headerSection.content?.transparencyNote || DEFAULT_PRICING_SECTIONS[0].content.transparencyNote;
                    updateSectionField('pricing-header', 'content.transparencyNote', { ...cur, title: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Right Badge Text</label>
                <input
                  type="text"
                  value={headerSection.content?.transparencyNote?.badge || ''}
                  onChange={(e) => {
                    const cur = headerSection.content?.transparencyNote || DEFAULT_PRICING_SECTIONS[0].content.transparencyNote;
                    updateSectionField('pricing-header', 'content.transparencyNote', { ...cur, badge: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Description</label>
              <textarea
                rows={2}
                value={headerSection.content?.transparencyNote?.desc || ''}
                onChange={(e) => {
                  const cur = headerSection.content?.transparencyNote || DEFAULT_PRICING_SECTIONS[0].content.transparencyNote;
                  updateSectionField('pricing-header', 'content.transparencyNote', { ...cur, desc: e.target.value });
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: PRICING PACKAGES MANAGER */}
      {activeTab === 'plans' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Packages Architecture</span>
              <h2 className="text-lg font-bold text-white mt-1">Manage Pricing Plans &amp; Packages ({rawPlans.length})</h2>
              <p className="text-xs text-slate-400 mt-1">Add custom packages, edit prices, toggle flagship status, or remove plans. Changes sync directly to Razorpay checkout.</p>
            </div>

            <button
              type="button"
              onClick={handleAddNewPlan}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pricing Package</span>
            </button>
          </div>

          {rawPlans.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Pricing Packages Configured</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Create custom pricing plans for students, cohorts, or institutions with connected Razorpay payment buttons.</p>
              </div>
              <button
                type="button"
                onClick={handleAddNewPlan}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Package</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {rawPlans.map((plan: any, pIdx: number) => {
                const planFeatures = (plan.features || []).map(normalizeFeature);
                const isFlagship = !!plan.isMostPopular;

                return (
                  <div
                    key={plan.id || pIdx}
                    className={`bg-slate-900 border rounded-xl p-5 flex flex-col gap-5 transition-all duration-200 relative ${
                      isFlagship
                        ? 'border-emerald-600/60 ring-1 ring-emerald-500/20 shadow-lg'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Header Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono font-black border border-slate-700">
                          #{pIdx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-white block">{plan.name || `Package #${pIdx + 1}`}</span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {plan.id || `plan-${pIdx}`}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Selector */}
                        <select
                          value={plan.status || 'active'}
                          onChange={(e) => handleUpdatePlan(pIdx, { status: e.target.value })}
                          className={`text-xs rounded-lg px-2.5 py-1.5 font-bold border focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                            plan.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                              : plan.status === 'institutional'
                                ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="active">Active (Razorpay Enabled)</option>
                          <option value="inactive">Inactive / Closed</option>
                          <option value="institutional">Institutional MoU (College TPOs)</option>
                        </select>

                        {/* Flagship Star Toggle */}
                        <button
                          type="button"
                          onClick={() => handleUpdatePlan(pIdx, { isMostPopular: !plan.isMostPopular })}
                          title="Toggle Flagship / Highlight status"
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                            isFlagship
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-xs'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFlagship ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span className="hidden sm:inline">{isFlagship ? 'Flagship' : 'Highlight'}</span>
                        </button>

                        {/* Reorder Up */}
                        <button
                          type="button"
                          disabled={pIdx === 0}
                          onClick={() => handleMovePlan('up', pIdx)}
                          title="Move Up"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 cursor-pointer transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Reorder Down */}
                        <button
                          type="button"
                          disabled={pIdx === rawPlans.length - 1}
                          onClick={() => handleMovePlan('down', pIdx)}
                          title="Move Down"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 cursor-pointer transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicatePlan(pIdx)}
                          title="Duplicate Plan"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(pIdx)}
                          title="Delete Plan"
                          className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-800 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Row 1: Identification & Pricing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Plan Name *</label>
                        <input
                          type="text"
                          required
                          value={plan.name || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { name: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Career Pro Plan"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Display Price Label *</label>
                        <input
                          type="text"
                          value={plan.price !== undefined ? plan.price : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const num = parseInt(val.replace(/[^\d]/g, ''), 10);
                            handleUpdatePlan(pIdx, { 
                              price: val,
                              ...(isNaN(num) ? {} : { numericAmount: num })
                            });
                          }}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. ₹3,000 or 3000"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Razorpay Order INR (₹) *</label>
                        <input
                          type="number"
                          value={plan.numericAmount || (typeof plan.price === 'number' ? plan.price : (parseInt(String(plan.price).replace(/[^\d]/g, ''), 10) || 0))}
                          onChange={(e) => handleUpdatePlan(pIdx, { numericAmount: parseInt(e.target.value, 10) || 0 })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="3000"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Billing Period / Sublabel</label>
                        <input
                          type="text"
                          value={plan.period || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { period: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. / 6 Months of LMS"
                        />
                      </div>
                    </div>

                    {/* Row 2: Badges, Cohort & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Top Pin Badge</label>
                        <input
                          type="text"
                          value={plan.badge || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { badge: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Most Popular Plan"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cohort / Target Track</label>
                        <input
                          type="text"
                          value={plan.cohortTag || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { cohortTag: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Student Intensive Cohort"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Batch / Duration Tag</label>
                        <input
                          type="text"
                          value={plan.batch || plan.duration || plan.statusText || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { batch: e.target.value, duration: e.target.value, statusText: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Batch 2025-26"
                        />
                      </div>
                    </div>

                    {/* Row 3: Description & Guarantees */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Package Description</label>
                        <textarea
                          rows={2}
                          value={plan.desc || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { desc: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                          placeholder="Describe the training track, curriculum benefits, and target students..."
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Plan Sublabel / Policy</label>
                        <textarea
                          rows={2}
                          value={plan.sublabel || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { sublabel: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                          placeholder="e.g. Inclusive of all taxes • Non-refundable"
                        />
                      </div>
                    </div>

                    {/* Row 4: Call to Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Button CTA Text</label>
                        <input
                          type="text"
                          value={plan.btnText || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { btnText: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Enroll Now — ₹3,000"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Link (Leave blank for Razorpay)</label>
                        <input
                          type="text"
                          value={plan.btnLink || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { btnLink: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Leave blank for Razorpay modal"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Footer Activation Note</label>
                        <input
                          type="text"
                          value={plan.footerText || ''}
                          onChange={(e) => handleUpdatePlan(pIdx, { footerText: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Instant LMS portal activation on enrollment"
                        />
                      </div>
                    </div>

                    {/* Row 5: Features Editor */}
                    <div className="border-t border-slate-800 pt-3.5 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Package Deliverables &amp; Benefits ({planFeatures.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddFeature(pIdx)}
                          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Benefit</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {planFeatures.map((feat: any, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-2.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                            <label className="flex items-center gap-1.5 text-[10px] text-slate-400 pl-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={feat.included}
                                onChange={(e) => handleUpdateFeature(pIdx, fIdx, { included: e.target.checked })}
                                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span className="hidden sm:inline">{feat.included ? 'Included' : 'Excluded'}</span>
                            </label>

                            <input
                              type="text"
                              value={feat.text}
                              onChange={(e) => handleUpdateFeature(pIdx, fIdx, { text: e.target.value })}
                              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="e.g. 1-on-1 Interview Mocks"
                            />

                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(pIdx, fIdx)}
                              title="Remove Benefit"
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Quick Add & Save Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleAddNewPlan}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Pricing Package</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving to MongoDB..." : "Save & Publish All Packages"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: CURRICULUM ARCHITECTURE */}
      {activeTab === 'curriculum' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Curriculum Module Settings</span>
            <h2 className="text-lg font-bold text-white mt-1">What makes the Career Pro track effective?</h2>
            <p className="text-xs text-slate-400 mt-1">Configure coaching hours metrics, sandbox stats, and the 4 syllabus milestone modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eyebrow</label>
              <input
                type="text"
                value={curriculumSection.content?.eyebrow || ''}
                onChange={(e) => updateSectionField('pricing-curriculum', 'content.eyebrow', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headline</label>
              <input
                type="text"
                value={curriculumSection.title || ''}
                onChange={(e) => updateSectionField('pricing-curriculum', 'title', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtitle Description</label>
            <textarea
              rows={2}
              value={curriculumSection.subtitle || ''}
              onChange={(e) => updateSectionField('pricing-curriculum', 'subtitle', e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
            />
          </div>

          {/* Metric Stats */}
          <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white">Left Metric Strip (2 Highlights)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(curriculumSection.content?.stats || DEFAULT_PRICING_SECTIONS[2].content.stats).map((st: any, sIdx: number) => (
                <div key={sIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Value (e.g. 120+, 24/7)</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const copy = [...(curriculumSection.content?.stats || DEFAULT_PRICING_SECTIONS[2].content.stats)];
                        copy[sIdx] = { ...copy[sIdx], value: e.target.value };
                        updateSectionField('pricing-curriculum', 'content.stats', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const copy = [...(curriculumSection.content?.stats || DEFAULT_PRICING_SECTIONS[2].content.stats)];
                        copy[sIdx] = { ...copy[sIdx], label: e.target.value };
                        updateSectionField('pricing-curriculum', 'content.stats', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Curriculum Modules */}
          <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white">4 Curriculum Milestones</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(curriculumSection.content?.modules || DEFAULT_PRICING_SECTIONS[2].content.modules).map((mod: any, mIdx: number) => (
                <div key={mIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                      {mod.num}
                    </span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const copy = [...(curriculumSection.content?.modules || DEFAULT_PRICING_SECTIONS[2].content.modules)];
                        copy[mIdx] = { ...copy[mIdx], title: e.target.value };
                        updateSectionField('pricing-curriculum', 'content.modules', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-bold flex-1"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={mod.desc}
                    onChange={(e) => {
                      const copy = [...(curriculumSection.content?.modules || DEFAULT_PRICING_SECTIONS[2].content.modules)];
                      copy[mIdx] = { ...copy[mIdx], desc: e.target.value };
                      updateSectionField('pricing-curriculum', 'content.modules', copy);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: ACCORDION FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">FAQ Configuration</span>
              <h2 className="text-lg font-bold text-white mt-1">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400 mt-1">Answer candidate doubts regarding placement zero-cost access and non-refundable policy.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const currentFaqs = [...(faqsSection.content?.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs)];
                currentFaqs.push({
                  q: "New FAQ Question?",
                  a: "Detailed answer explaining the policy and guidelines clearly."
                });
                updateSectionField('pricing-faqs', 'content.faqs', currentFaqs);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(faqsSection.content?.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs).map((faq: any, fIdx: number) => (
              <div key={fIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400">Question #{fIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentFaqs = (faqsSection.content?.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs).filter((_: any, idx: number) => idx !== fIdx);
                      updateSectionField('pricing-faqs', 'content.faqs', currentFaqs);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => {
                    const copy = [...(faqsSection.content?.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs)];
                    copy[fIdx] = { ...copy[fIdx], q: e.target.value };
                    updateSectionField('pricing-faqs', 'content.faqs', copy);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-bold"
                  placeholder="Question text"
                />

                <textarea
                  rows={3}
                  value={faq.a}
                  onChange={(e) => {
                    const copy = [...(faqsSection.content?.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs)];
                    copy[fIdx] = { ...copy[fIdx], a: e.target.value };
                    updateSectionField('pricing-faqs', 'content.faqs', copy);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 leading-relaxed"
                  placeholder="Answer text"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 5: ADVISORY CTA BANNER */}
      {activeTab === 'cta' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Footer Banner</span>
            <h2 className="text-lg font-bold text-white mt-1">Institutional Advisory CTA</h2>
            <p className="text-xs text-slate-400 mt-1">Customize bottom banner text, counselor contact links, and drive directory buttons.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Eyebrow</label>
              <input
                type="text"
                value={ctaSection.content?.eyebrow || ''}
                onChange={(e) => updateSectionField('pricing-cta', 'content.eyebrow', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Banner Headline</label>
              <input
                type="text"
                value={ctaSection.title || ''}
                onChange={(e) => updateSectionField('pricing-cta', 'title', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Banner Description</label>
            <textarea
              rows={2}
              value={ctaSection.subtitle || ''}
              onChange={(e) => updateSectionField('pricing-cta', 'subtitle', e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Button Text</label>
              <input
                type="text"
                value={ctaSection.content?.primaryBtnText || ''}
                onChange={(e) => updateSectionField('pricing-cta', 'content.primaryBtnText', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Button Text</label>
              <input
                type="text"
                value={ctaSection.content?.secondaryBtnText || ''}
                onChange={(e) => updateSectionField('pricing-cta', 'content.secondaryBtnText', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: SEO SETTINGS */}
      {activeTab === 'seo' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Meta Metadata</span>
            <h2 className="text-lg font-bold text-white mt-1">SEO &amp; OpenGraph Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Optimize how the Pricing &amp; Programs page displays on Google Search and social sharing.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Meta Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</label>
            <textarea
              rows={3}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keywords (comma-separated)</label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      )}

    </div>
  );
}
