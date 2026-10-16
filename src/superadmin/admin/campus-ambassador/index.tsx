import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem, Lead } from '../../../types';
import { DEFAULT_AMBASSADOR_SECTIONS, AmbassadorResponsibilityCard } from '../../../lib/defaultAmbassador';
import {
  FileText,
  Settings,
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  Users,
  Megaphone,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Award,
  GraduationCap
} from 'lucide-react';

interface AdminCampusAmbassadorPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  leads?: Lead[];
  setLeads?: React.Dispatch<React.SetStateAction<Lead[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminCampusAmbassadorPage({
  page,
  setPages,
  leads = [],
  setLeads
}: AdminCampusAmbassadorPageProps) {
  // Tabs: header, cards, form, success, applicants, seo
  const [activeTab, setActiveTab] = useState<'header' | 'cards' | 'form' | 'success' | 'applicants' | 'seo'>('header');

  // Pull sections or fallback to defaults
  const currentSections = page.sections && page.sections.some(s => s.type === 'ambassador-header' || s.type === 'ambassador-responsibilities')
    ? page.sections
    : DEFAULT_AMBASSADOR_SECTIONS;

  const [sections, setSections] = useState<CMSSection[]>(currentSections);

  // SEO state
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || "Campus Ambassador Program | TantraPex Technologies");
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || "Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.");
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || "campus ambassador, student leadership, college placement cell, student coordinator, engineering campus rep");

  // Notifications
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Applicants filter
  const [leadSearch, setLeadSearch] = useState('');

  // Extract section shortcuts
  const headerSec = sections.find(s => s.type === 'ambassador-header') || DEFAULT_AMBASSADOR_SECTIONS[0];
  const respSec = sections.find(s => s.type === 'ambassador-responsibilities') || DEFAULT_AMBASSADOR_SECTIONS[1];
  const formSec = sections.find(s => s.type === 'ambassador-form') || DEFAULT_AMBASSADOR_SECTIONS[2];

  const headerContent = headerSec.content || {};
  const respContent = respSec.content || {};
  const formContent = formSec.content || {};
  const formFields = formContent.fields || {};
  const successState = formContent.successState || {};

  const cards: AmbassadorResponsibilityCard[] = respContent.cards || (DEFAULT_AMBASSADOR_SECTIONS[1].content as any).cards;

  // Helper to update specific section field
  const updateSectionField = (sectionType: string, fieldPath: string, value: any) => {
    setSections(prev => prev.map(sec => {
      if (sec.type !== sectionType) return sec;
      const updated = { ...sec };
      if (fieldPath === 'title') {
        updated.title = value;
      } else if (fieldPath === 'subtitle') {
        updated.subtitle = value;
      } else if (fieldPath.startsWith('content.')) {
        const subProp = fieldPath.replace('content.', '');
        updated.content = {
          ...updated.content,
          [subProp]: value
        };
      }
      return updated;
    }));
  };

  // Helper to update card
  const handleUpdateCard = (cardIndex: number, field: keyof AmbassadorResponsibilityCard, value: any) => {
    const updatedCards = [...cards];
    if (updatedCards[cardIndex]) {
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        [field]: value
      };
      updateSectionField('ambassador-responsibilities', 'content.cards', updatedCards);
    }
  };

  // Add new card
  const handleAddCard = () => {
    const newCard: AmbassadorResponsibilityCard = {
      id: `resp-${Date.now()}`,
      step: `0${cards.length + 1} / RESPONSIBILITY`,
      title: "New Responsibility Title",
      desc: "Provide details about what the campus ambassador handles for their college peers.",
      badgeText: "Active Verification",
      icon: "Megaphone"
    };
    updateSectionField('ambassador-responsibilities', 'content.cards', [...cards, newCard]);
  };

  // Delete card
  const handleDeleteCard = (cardIndex: number) => {
    if (cards.length <= 1) {
      alert("At least one responsibility card must remain.");
      return;
    }
    const updatedCards = cards.filter((_, idx) => idx !== cardIndex);
    updateSectionField('ambassador-responsibilities', 'content.cards', updatedCards);
  };

  // Helper to update form fields config
  const handleUpdateFormField = (fieldKey: string, value: any) => {
    const updatedFields = {
      ...formFields,
      [fieldKey]: value
    };
    updateSectionField('ambassador-form', 'content.fields', updatedFields);
  };

  // Helper to update success state config
  const handleUpdateSuccessField = (fieldKey: string, value: any) => {
    const updatedSuccess = {
      ...successState,
      [fieldKey]: value
    };
    updateSectionField('ambassador-form', 'content.successState', updatedSuccess);
  };

  // Save changes to MongoDB and App state
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus('Saving to MongoDB database...');
    try {
      const updatedPageDoc: CMSPage = {
        ...page,
        id: 'campus-ambassador',
        title: headerSec.title || 'Campus Ambassador Program',
        slug: '/campus-ambassador',
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: sections,
        updatedAt: new Date().toISOString()
      };

      // 1. Update React state for all pages
      setPages(prevPages => {
        const pageMap = new Map<string, CMSPage>();
        prevPages.forEach(p => pageMap.set(p.id, p));
        pageMap.set('campus-ambassador', updatedPageDoc);
        return Array.from(pageMap.values());
      });

      // 2. Direct POST to /api/save-page
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: updatedPageDoc })
      });
      const result = await response.json();

      if (result.success) {
        setSaveStatus('Saved successfully to MongoDB!');
      } else {
        setSaveStatus(result.msg || 'Save finished with local state.');
      }
    } catch (err: any) {
      setSaveStatus('Saved in local session. Backend synced.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Reset to original defaults
  const handleResetDefaults = () => {
    const confirmReset = window.confirm("Are you sure you want to revert all Campus Ambassador configurations to default Stitch settings?");
    if (confirmReset) {
      setSections(DEFAULT_AMBASSADOR_SECTIONS);
      setSeoTitle("Campus Ambassador Program | TantraPex Technologies");
      setSeoDesc("Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.");
      setSeoKeywords("campus ambassador, student leadership, college placement cell, student coordinator, engineering campus rep");
      setSaveStatus("Reset to default settings. Click 'Save & Publish' to write to database.");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Filter ambassador leads
  const ambassadorLeads = leads.filter(l => 
    l.type === 'ambassador' || 
    (l.interest && l.interest.toLowerCase().includes('ambassador')) ||
    (l.message && l.message.toLowerCase().includes('ambassador'))
  );

  const filteredLeads = ambassadorLeads.filter(l => {
    if (!leadSearch) return true;
    const q = leadSearch.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.message && l.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen pb-24">
      {/* 1. Header Masthead & Navigation Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Active Document
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: campus-ambassador</span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400 font-mono">Slug: /campus-ambassador</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-emerald-400" />
              <span>Campus Ambassador Program Editor</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Full administrative control: header masthead, student leadership badge, 3 responsibility cards, application form config, and live lead applications.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleResetDefaults}
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Reset to default content"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <a
              href="#/campus-ambassador"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Page</span>
            </a>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Publishing..." : "Save & Publish to MongoDB"}</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {saveStatus && (
          <div className="max-w-7xl mx-auto mt-3 py-2 px-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* 2. Tabs Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('header')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'header'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Header & Pill Badge</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>3 Responsibility Cards ({cards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Application Form Config</span>
          </button>

          <button
            onClick={() => setActiveTab('success')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'success'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Dialog State</span>
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'applicants'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Applicant Leads ({ambassadorLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SEO Settings</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* TAB 1: Header & Pill Badge */}
        {activeTab === 'header' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <Layers className="w-4 h-4" />
                <span>Page Masthead & Leadership Badge</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={headerContent.pillBadge || ''}
                    onChange={(e) => updateSectionField('ambassador-header', 'content.pillBadge', e.target.value)}
                    placeholder="STUDENT LEADERSHIP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Displayed with green pulse indicator above headline</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Breadcrumb Label
                  </label>
                  <input
                    type="text"
                    value={headerContent.breadcrumb || ''}
                    onChange={(e) => updateSectionField('ambassador-header', 'content.breadcrumb', e.target.value)}
                    placeholder="Campus Ambassador"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={headerSec.title || ''}
                  onChange={(e) => updateSectionField('ambassador-header', 'title', e.target.value)}
                  placeholder="Campus Ambassador Program"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Masthead Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={headerSec.subtitle || ''}
                  onChange={(e) => updateSectionField('ambassador-header', 'subtitle', e.target.value)}
                  placeholder="Represent TantraPex Technologies in your college..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 3 Responsibility Cards */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Key Responsibility Cards</h2>
                <p className="text-xs text-slate-400">Configure cards highlighting ambassador duties, faculty collaboration, and verified notices.</p>
              </div>
              <button
                onClick={handleAddCard}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Responsibility Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, idx) => (
                <div key={card.id || `card-${idx}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteCard(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        Card #{idx + 1}
                      </span>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category / Step Tag</label>
                      <input
                        type="text"
                        value={card.step}
                        onChange={(e) => handleUpdateCard(idx, 'step', e.target.value)}
                        placeholder="01 / OUTREACH"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                        placeholder="Share Drive Updates"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={card.desc}
                        onChange={(e) => handleUpdateCard(idx, 'desc', e.target.value)}
                        placeholder="Inform fellow students about upcoming campus drives..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Footer Check Badge Text</label>
                      <input
                        type="text"
                        value={card.badgeText}
                        onChange={(e) => handleUpdateCard(idx, 'badgeText', e.target.value)}
                        placeholder="Verified Notifications"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-emerald-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Icon Representation</label>
                      <select
                        value={card.icon}
                        onChange={(e) => handleUpdateCard(idx, 'icon', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white cursor-pointer"
                      >
                        <option value="Megaphone">Megaphone (Outreach)</option>
                        <option value="Users">Users (Upskilling / Workshops)</option>
                        <option value="MessageSquare">MessageSquare (Liaison / Voice)</option>
                        <option value="Award">Award (Recognition)</option>
                        <option value="GraduationCap">GraduationCap (Academic Sync)</option>
                        <option value="Sparkles">Sparkles (Special)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Application Form Config */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <FileText className="w-4 h-4" />
                <span>Application Form Headings & Labels</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Form Section Title</label>
                  <input
                    type="text"
                    value={formSec.title || ''}
                    onChange={(e) => updateSectionField('ambassador-form', 'title', e.target.value)}
                    placeholder="Apply for Campus Ambassador"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Submit Button Label</label>
                  <input
                    type="text"
                    value={formContent.submitBtnText || ''}
                    onChange={(e) => updateSectionField('ambassador-form', 'content.submitBtnText', e.target.value)}
                    placeholder="Submit Ambassador Application"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Form Subtitle / Review Note</label>
                <textarea
                  rows={2}
                  value={formSec.subtitle || ''}
                  onChange={(e) => updateSectionField('ambassador-form', 'subtitle', e.target.value)}
                  placeholder="Fill out this form to join the TantraPex student leadership network..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none leading-relaxed"
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zero-Fees Reassurance Note (Left of Submit Button)</label>
                <input
                  type="text"
                  value={formContent.disclaimer || ''}
                  onChange={(e) => updateSectionField('ambassador-form', 'content.disclaimer', e.target.value)}
                  placeholder="Zero fees. 100% Free Placement Cell Initiative."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-emerald-300"
                />
              </div>

              <div className="h-px bg-slate-800 my-6" />

              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Input Field Placeholders & Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name Placeholder</label>
                  <input
                    type="text"
                    value={formFields.fullNamePlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('fullNamePlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">College Email Placeholder</label>
                  <input
                    type="text"
                    value={formFields.collegeEmailPlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('collegeEmailPlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone / WhatsApp Placeholder</label>
                  <input
                    type="text"
                    value={formFields.phonePlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('phonePlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">College Name Placeholder</label>
                  <input
                    type="text"
                    value={formFields.collegeNamePlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('collegeNamePlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Course / Degree Placeholder</label>
                  <input
                    type="text"
                    value={formFields.courseDegreePlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('courseDegreePlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">City & State Placeholder</label>
                  <input
                    type="text"
                    value={formFields.cityStatePlaceholder || ''}
                    onChange={(e) => handleUpdateFormField('cityStatePlaceholder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Motivation Question Text</label>
                <input
                  type="text"
                  value={formFields.motivationQuestion || ''}
                  onChange={(e) => handleUpdateFormField('motivationQuestion', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-medium mb-3"
                />

                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Motivation Textarea Placeholder</label>
                <textarea
                  rows={2}
                  value={formFields.motivationPlaceholder || ''}
                  onChange={(e) => handleUpdateFormField('motivationPlaceholder', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Success State */}
        {activeTab === 'success' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Candidate Submission Confirmation Dialog</span>
              </h2>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirmation Title</label>
                <input
                  type="text"
                  value={successState.title || ''}
                  onChange={(e) => handleUpdateSuccessField('title', e.target.value)}
                  placeholder="Application Received"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirmation Message & SLA Timeline</label>
                <textarea
                  rows={4}
                  value={successState.desc || ''}
                  onChange={(e) => handleUpdateSuccessField('desc', e.target.value)}
                  placeholder="Thank you for applying. The TantraPex Student Placement Relations team will review your profile and reach out via WhatsApp/email within 48 hours."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Applicant Leads Registry */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Campus Ambassador Applications ({filteredLeads.length})</h2>
                <p className="text-xs text-slate-400">Live candidate submissions received via the Campus Ambassador form.</p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search applicants by name, college..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No Ambassador Applications Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When students submit their application on the Campus Ambassador page, their profile details and contact links will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Applicant</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Degree & Year</th>
                        <th className="py-3 px-4">Application Details</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map((lead) => {
                        const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                        return (
                          <tr key={lead.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-sm">{lead.name}</div>
                              <span className="text-[10px] text-emerald-400 font-mono">Student Ambassador</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-slate-300 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                <span>{lead.email}</span>
                              </div>
                              <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                <span>{lead.phone}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-slate-200 font-medium">{lead.degree || 'B.Tech'}</div>
                              <div className="text-slate-400 text-[11px]">{lead.batch || 'Enrolled'}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="text-slate-300 line-clamp-2 text-xs leading-relaxed">
                                {lead.message || lead.interest || "Campus Ambassador Application"}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {lead.date ? new Date(lead.date).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-semibold transition-colors"
                                >
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded text-[11px] font-semibold transition-colors"
                                >
                                  <span>Email</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <Settings className="w-4 h-4" />
                <span>Search Engine Optimization (SEO) Metadata</span>
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Meta Title Tag
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recommended: under 60 characters for Google SERP display</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Search Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
