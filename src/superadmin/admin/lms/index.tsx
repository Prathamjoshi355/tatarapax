import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_LMS_SECTIONS } from '../../../lib/defaultLms';
import { UniversalImageUploader } from '../../../components/dashboard/UniversalImageUploader';
import { 
  FileText, 
  Settings, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Layers, 
  Users, 
  GitFork, 
  Handshake, 
  Megaphone,
  Check,
  Plus,
  Trash2,
  BookOpen
} from 'lucide-react';

interface AdminLmsPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminLmsPage({
  page,
  setPages
}: AdminLmsPageProps) {
  // Tabs: hero, pillars, faculty, journey, collaboration, cta, seo
  const [activeTab, setActiveTab] = useState<'hero' | 'pillars' | 'faculty' | 'journey' | 'collaboration' | 'cta' | 'seo'>('hero');

  // Pull sections or fallback to defaults
  const currentSections = page.sections && page.sections.some(s => s.type === 'lms-hero')
    ? page.sections
    : DEFAULT_LMS_SECTIONS;

  const [sections, setSections] = useState<CMSSection[]>(currentSections);

  // SEO state
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || "LMS & Learning Resources | TantraPex × UG Skill");
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || "Structured coding sandbox, placement training, aptitude mock tests, and faculty guidance powered by TantraPex and UG Skill.");
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || "lms, coding sandbox, campus placement training, aptitude tests, engineering courses");

  // Notifications
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
        const subKey = fieldPath.replace('content.', '');
        updated.content = {
          ...updated.content,
          [subKey]: value
        };
      }
      return updated;
    }));
  };

  // Find sections
  const heroSection = sections.find(s => s.type === 'lms-hero') || DEFAULT_LMS_SECTIONS[0];
  const pillarsSection = sections.find(s => s.type === 'lms-pillars') || DEFAULT_LMS_SECTIONS[1];
  const facultySection = sections.find(s => s.type === 'lms-faculty') || DEFAULT_LMS_SECTIONS[2];
  const journeySection = sections.find(s => s.type === 'lms-journey') || DEFAULT_LMS_SECTIONS[3];
  const collaborationSection = sections.find(s => s.type === 'lms-collaboration') || DEFAULT_LMS_SECTIONS[4];
  const ctaSection = sections.find(s => s.type === 'lms-cta') || DEFAULT_LMS_SECTIONS[5];

  // Save to MongoDB & in-memory React state
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedPage: CMSPage = {
        ...page,
        title: "LMS / Learning Resources",
        slug: "/lms",
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: sections
      };

      // 1. Update in-memory pages state
      setPages(prev => prev.map(p => p.id === page.id ? updatedPage : p));

      // 2. Save page to MongoDB
      const res = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: updatedPage })
      });

      if (!res.ok) {
        throw new Error("Failed to save to database");
      }

      triggerNotification("LMS content and sections saved & published to MongoDB!");
    } catch (err: any) {
      console.error("Failed to save LMS page:", err);
      triggerNotification("Error saving to database. Local changes preserved.");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all LMS sections to the stitch redesign defaults?")) {
      setSections(DEFAULT_LMS_SECTIONS);
      triggerNotification("Reset to default redesign layout. Click Save & Publish to write to database.");
    }
  };

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* 1. Header Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">TantraPex CMS Editor</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                LMS × UG Skill • Live Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              LMS & Learning Resources CMS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Full administrative control: edit hero masthead, metrics, 4 learning pillars, faculty mentors & photos, 5-stage progression steps, partnership breakdown, and CTA banner.
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
              href="#/lms"
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
            { id: 'hero', label: 'Hero & Side Image', icon: Layers },
            { id: 'pillars', label: 'Core Pillars (4)', icon: BookOpen },
            { id: 'faculty', label: 'Faculty Instructors (2)', icon: Users },
            { id: 'journey', label: '5-Stage Journey', icon: GitFork },
            { id: 'collaboration', label: 'Collaboration Details', icon: Handshake },
            { id: 'cta', label: 'CTA Banner', icon: Megaphone },
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

        {/* 3. TAB CONTENT PANELS */}

        {/* TAB 1: HERO & SIDE IMAGE */}
        {activeTab === 'hero' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Header Section</span>
              <h2 className="text-lg font-bold text-white mt-1">Hero Masthead &amp; Side Graphic</h2>
              <p className="text-xs text-slate-400 mt-1">Configure top pill badges, headline, description, and upload or set the short-size hero image beside the text.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Pill Badge Text</label>
                <input
                  type="text"
                  value={heroSection.content?.badgeText || ''}
                  onChange={(e) => updateSectionField('lms-hero', 'content.badgeText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Learning, Training & Placement Collaboration"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Pill Badge</label>
                <input
                  type="text"
                  value={heroSection.content?.refinedBadge || ''}
                  onChange={(e) => updateSectionField('lms-hero', 'content.refinedBadge', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Refined Section"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Page Title</label>
              <input
                type="text"
                value={heroSection.title || ''}
                onChange={(e) => updateSectionField('lms-hero', 'title', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-bold"
                placeholder="TantraPex × UG Skill"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hero Description</label>
              <textarea
                rows={3}
                value={heroSection.subtitle || ''}
                onChange={(e) => updateSectionField('lms-hero', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="TantraPex Technologies collaborates with UG Skill..."
              />
            </div>

            {/* Side Hero Image Uploader */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Hero Side Graphic (Short-size Image)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload or specify a clean tech/sandbox illustration displayed on the right side of the masthead.</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                  Stats Removed per Specs
                </span>
              </div>

              <UniversalImageUploader
                label="Hero Side Graphic URL or Upload"
                value={heroSection.content?.heroImage || ''}
                onChange={(url) => updateSectionField('lms-hero', 'content.heroImage', url)}
                helperText="Cloudinary upload or image URL. Displays in a short-size 4:3 rounded card."
              />

              {heroSection.content?.heroImage && (
                <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-4">
                  <div className="w-24 h-18 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0">
                    <img
                      src={heroSection.content.heroImage}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-white block">Active Side Image Preview</span>
                    <span className="text-[11px] text-slate-400 block font-mono truncate max-w-md">
                      {heroSection.content.heroImage}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CORE PILLARS */}
        {activeTab === 'pillars' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Pillars Section</span>
              <h2 className="text-lg font-bold text-white mt-1">Four Core Learning Pillars & Sandbox Banner</h2>
              <p className="text-xs text-slate-400 mt-1">Edit the 4 pillar cards and active compiler environment details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eyebrow Tag</label>
                <input
                  type="text"
                  value={pillarsSection.content?.eyebrow || ''}
                  onChange={(e) => updateSectionField('lms-pillars', 'content.eyebrow', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Modular Architecture"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                <input
                  type="text"
                  value={pillarsSection.title || ''}
                  onChange={(e) => updateSectionField('lms-pillars', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-bold"
                  placeholder="Four Core Learning Pillars"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Subtitle</label>
              <textarea
                rows={2}
                value={pillarsSection.subtitle || ''}
                onChange={(e) => updateSectionField('lms-pillars', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            {/* 4 Pillars Grid */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white">4 Pillar Cards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(pillarsSection.content?.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars).map((p: any, idx: number) => (
                  <div key={p.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">{p.num}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Icon: {p.icon}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Icon</label>
                      <input
                        type="text"
                        value={p.icon}
                        onChange={(e) => {
                          const copy = [...(pillarsSection.content?.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars)];
                          copy[idx] = { ...copy[idx], icon: e.target.value };
                          updateSectionField('lms-pillars', 'content.pillars', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Pillar Title</label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const copy = [...(pillarsSection.content?.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars)];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          updateSectionField('lms-pillars', 'content.pillars', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea
                        rows={3}
                        value={p.desc}
                        onChange={(e) => {
                          const copy = [...(pillarsSection.content?.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars)];
                          copy[idx] = { ...copy[idx], desc: e.target.value };
                          updateSectionField('lms-pillars', 'content.pillars', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Footer Tag</label>
                      <input
                        type="text"
                        value={p.footerTag}
                        onChange={(e) => {
                          const copy = [...(pillarsSection.content?.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars)];
                          copy[idx] = { ...copy[idx], footerTag: e.target.value };
                          updateSectionField('lms-pillars', 'content.pillars', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sandbox Compiler Banner */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white">Active Compiler Environments Banner</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Banner Label</label>
                  <input
                    type="text"
                    value={pillarsSection.content?.sandboxBanner?.label || ''}
                    onChange={(e) => {
                      const cur = pillarsSection.content?.sandboxBanner || DEFAULT_LMS_SECTIONS[1].content.sandboxBanner;
                      updateSectionField('lms-pillars', 'content.sandboxBanner', { ...cur, label: e.target.value });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Languages Supported</label>
                  <input
                    type="text"
                    value={pillarsSection.content?.sandboxBanner?.languages || ''}
                    onChange={(e) => {
                      const cur = pillarsSection.content?.sandboxBanner || DEFAULT_LMS_SECTIONS[1].content.sandboxBanner;
                      updateSectionField('lms-pillars', 'content.sandboxBanner', { ...cur, languages: e.target.value });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Badge</label>
                  <input
                    type="text"
                    value={pillarsSection.content?.sandboxBanner?.badgeText || ''}
                    onChange={(e) => {
                      const cur = pillarsSection.content?.sandboxBanner || DEFAULT_LMS_SECTIONS[1].content.sandboxBanner;
                      updateSectionField('lms-pillars', 'content.sandboxBanner', { ...cur, badgeText: e.target.value });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: FACULTY INSTRUCTORS */}
        {activeTab === 'faculty' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Faculty Section</span>
              <h2 className="text-lg font-bold text-white mt-1">Meet Our Training Faculty (2 Instructors)</h2>
              <p className="text-xs text-slate-400 mt-1">Upload photos, customize mentor credentials, bios, benchmark stats, and office hour links.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Eyebrow Badge</label>
                <input
                  type="text"
                  value={facultySection.content?.badgeText || ''}
                  onChange={(e) => updateSectionField('lms-faculty', 'content.badgeText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Instructors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Badge</label>
                <input
                  type="text"
                  value={facultySection.content?.verificationBadge || ''}
                  onChange={(e) => updateSectionField('lms-faculty', 'content.verificationBadge', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Verified Academic Credentials"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headline Title</label>
                <input
                  type="text"
                  value={facultySection.title || ''}
                  onChange={(e) => updateSectionField('lms-faculty', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtitle</label>
                <input
                  type="text"
                  value={facultySection.subtitle || ''}
                  onChange={(e) => updateSectionField('lms-faculty', 'subtitle', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>
            </div>

            {/* 2 Faculty Cards */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-white">Faculty Mentors</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList).map((fac: any, idx: number) => (
                  <div key={fac.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">Faculty Member #{idx + 1}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{fac.badge}</span>
                    </div>

                    <UniversalImageUploader
                      label="Faculty Profile Photograph"
                      value={fac.avatar}
                      onChange={(url) => {
                        const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                        copy[idx] = { ...copy[idx], avatar: url };
                        updateSectionField('lms-faculty', 'content.facultyList', copy);
                      }}
                      helperText="Direct Cloudinary upload supported."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Name</label>
                        <input
                          type="text"
                          value={fac.name}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], name: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Badge Label</label>
                        <input
                          type="text"
                          value={fac.badge}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], badge: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Primary Role</label>
                        <input
                          type="text"
                          value={fac.role}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], role: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Sub-Role / Focus</label>
                        <input
                          type="text"
                          value={fac.subRole}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], subRole: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Bio / Experience</label>
                      <textarea
                        rows={2}
                        value={fac.bio}
                        onChange={(e) => {
                          const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                          copy[idx] = { ...copy[idx], bio: e.target.value };
                          updateSectionField('lms-faculty', 'content.facultyList', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* 3 Benchmarks */}
                    <div className="grid grid-cols-3 gap-2">
                      {(fac.benchmarks || []).map((bm: any, bIdx: number) => (
                        <div key={bIdx} className="bg-slate-950 p-2 rounded border border-slate-800 flex flex-col gap-1">
                          <input
                            type="text"
                            value={bm.label}
                            onChange={(e) => {
                              const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                              copy[idx].benchmarks[bIdx] = { ...copy[idx].benchmarks[bIdx], label: e.target.value };
                              updateSectionField('lms-faculty', 'content.facultyList', copy);
                            }}
                            className="bg-transparent text-[9px] text-slate-400 uppercase font-mono border-b border-slate-800 pb-0.5"
                          />
                          <input
                            type="text"
                            value={bm.value}
                            onChange={(e) => {
                              const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                              copy[idx].benchmarks[bIdx] = { ...copy[idx].benchmarks[bIdx], value: e.target.value };
                              updateSectionField('lms-faculty', 'content.facultyList', copy);
                            }}
                            className="bg-transparent text-xs text-white font-bold"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Primary Track Footer</label>
                        <input
                          type="text"
                          value={fac.primaryTrack}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], primaryTrack: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Action Button Text</label>
                        <input
                          type="text"
                          value={fac.actionText}
                          onChange={(e) => {
                            const copy = [...(facultySection.content?.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList)];
                            copy[idx] = { ...copy[idx], actionText: e.target.value };
                            updateSectionField('lms-faculty', 'content.facultyList', copy);
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: 5-STAGE JOURNEY */}
        {activeTab === 'journey' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Progression Pipeline</span>
              <h2 className="text-lg font-bold text-white mt-1">Learning-to-Placement Journey (5 Stages)</h2>
              <p className="text-xs text-slate-400 mt-1">Customize the 5-step preparation roadmap and continuous benchmarking engine card.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eyebrow Tag</label>
                <input
                  type="text"
                  value={journeySection.content?.eyebrow || ''}
                  onChange={(e) => updateSectionField('lms-journey', 'content.eyebrow', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Step-By-Step Readiness"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Title</label>
                <input
                  type="text"
                  value={journeySection.title || ''}
                  onChange={(e) => updateSectionField('lms-journey', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-bold"
                  placeholder="Learning-to-Placement Journey"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtitle</label>
              <textarea
                rows={2}
                value={journeySection.subtitle || ''}
                onChange={(e) => updateSectionField('lms-journey', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            {/* 5 Stages Editor */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white">5 Progression Stages</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {(journeySection.content?.stages || DEFAULT_LMS_SECTIONS[3].content.stages).map((st: any, idx: number) => (
                  <div key={st.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{st.stageTag}</span>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Title</label>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const copy = [...(journeySection.content?.stages || DEFAULT_LMS_SECTIONS[3].content.stages)];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          updateSectionField('lms-journey', 'content.stages', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea
                        rows={3}
                        value={st.desc}
                        onChange={(e) => {
                          const copy = [...(journeySection.content?.stages || DEFAULT_LMS_SECTIONS[3].content.stages)];
                          copy[idx] = { ...copy[idx], desc: e.target.value };
                          updateSectionField('lms-journey', 'content.stages', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Check Tag</label>
                      <input
                        type="text"
                        value={st.checkTag}
                        onChange={(e) => {
                          const copy = [...(journeySection.content?.stages || DEFAULT_LMS_SECTIONS[3].content.stages)];
                          copy[idx] = { ...copy[idx], checkTag: e.target.value };
                          updateSectionField('lms-journey', 'content.stages', copy);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmarking Footer */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white">Continuous Benchmarking Engine Card</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Title</label>
                  <input
                    type="text"
                    value={journeySection.content?.metricFooter?.title || ''}
                    onChange={(e) => {
                      const cur = journeySection.content?.metricFooter || DEFAULT_LMS_SECTIONS[3].content.metricFooter;
                      updateSectionField('lms-journey', 'content.metricFooter', { ...cur, title: e.target.value });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    value={journeySection.content?.metricFooter?.desc || ''}
                    onChange={(e) => {
                      const cur = journeySection.content?.metricFooter || DEFAULT_LMS_SECTIONS[3].content.metricFooter;
                      updateSectionField('lms-journey', 'content.metricFooter', { ...cur, desc: e.target.value });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link Text & URL</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={journeySection.content?.metricFooter?.linkText || ''}
                      onChange={(e) => {
                        const cur = journeySection.content?.metricFooter || DEFAULT_LMS_SECTIONS[3].content.metricFooter;
                        updateSectionField('lms-journey', 'content.metricFooter', { ...cur, linkText: e.target.value });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={journeySection.content?.metricFooter?.linkUrl || ''}
                      onChange={(e) => {
                        const cur = journeySection.content?.metricFooter || DEFAULT_LMS_SECTIONS[3].content.metricFooter;
                        updateSectionField('lms-journey', 'content.metricFooter', { ...cur, linkUrl: e.target.value });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: COLLABORATION DETAILS */}
        {activeTab === 'collaboration' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Partnership Framework</span>
              <h2 className="text-lg font-bold text-white mt-1">Institutional Division of Responsibilities</h2>
              <p className="text-xs text-slate-400 mt-1">Edit the transparent breakdown between UG Skill and TantraPex Technologies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Text</label>
                <input
                  type="text"
                  value={collaborationSection.content?.badgeText || ''}
                  onChange={(e) => updateSectionField('lms-collaboration', 'content.badgeText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Transparent Partnership Framework"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headline</label>
                <input
                  type="text"
                  value={collaborationSection.title || ''}
                  onChange={(e) => updateSectionField('lms-collaboration', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  placeholder="Institutional Division of Responsibilities"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overview Description</label>
              <textarea
                rows={2}
                value={collaborationSection.subtitle || ''}
                onChange={(e) => updateSectionField('lms-collaboration', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
              />
            </div>

            {/* 2 Partition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-800 pt-5">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold">Party 1</span>
                <input
                  type="text"
                  value={collaborationSection.content?.card1?.title || ''}
                  onChange={(e) => {
                    const cur = collaborationSection.content?.card1 || DEFAULT_LMS_SECTIONS[4].content.card1;
                    updateSectionField('lms-collaboration', 'content.card1', { ...cur, title: e.target.value });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                  placeholder="UG Skill (NexisparkX)"
                />
                <textarea
                  rows={3}
                  value={collaborationSection.content?.card1?.desc || ''}
                  onChange={(e) => {
                    const cur = collaborationSection.content?.card1 || DEFAULT_LMS_SECTIONS[4].content.card1;
                    updateSectionField('lms-collaboration', 'content.card1', { ...cur, desc: e.target.value });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold">Party 2</span>
                <input
                  type="text"
                  value={collaborationSection.content?.card2?.title || ''}
                  onChange={(e) => {
                    const cur = collaborationSection.content?.card2 || DEFAULT_LMS_SECTIONS[4].content.card2;
                    updateSectionField('lms-collaboration', 'content.card2', { ...cur, title: e.target.value });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                  placeholder="TantraPex Technologies"
                />
                <textarea
                  rows={3}
                  value={collaborationSection.content?.card2?.desc || ''}
                  onChange={(e) => {
                    const cur = collaborationSection.content?.card2 || DEFAULT_LMS_SECTIONS[4].content.card2;
                    updateSectionField('lms-collaboration', 'content.card2', { ...cur, desc: e.target.value });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Governance Standard */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Governance Standards Checklist</h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {collaborationSection.content?.governanceStandard?.entityNote || "Affiliated entity: NexisparkX"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(collaborationSection.content?.governanceStandard?.bullets || DEFAULT_LMS_SECTIONS[4].content.governanceStandard.bullets).map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const copy = [...(collaborationSection.content?.governanceStandard?.bullets || DEFAULT_LMS_SECTIONS[4].content.governanceStandard.bullets)];
                        copy[bIdx] = e.target.value;
                        const cur = collaborationSection.content?.governanceStandard || DEFAULT_LMS_SECTIONS[4].content.governanceStandard;
                        updateSectionField('lms-collaboration', 'content.governanceStandard', { ...cur, bullets: copy });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: CTA BANNER */}
        {activeTab === 'cta' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Bottom CTA</span>
              <h2 className="text-lg font-bold text-white mt-1">Ready to Explore Learning Resources CTA Banner</h2>
              <p className="text-xs text-slate-400 mt-1">Configure action buttons and conversion messaging.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tag Text</label>
                <input
                  type="text"
                  value={ctaSection.content?.tag || ''}
                  onChange={(e) => updateSectionField('lms-cta', 'content.tag', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Structured Career Readiness"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headline Title</label>
                <input
                  type="text"
                  value={ctaSection.title || ''}
                  onChange={(e) => updateSectionField('lms-cta', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  placeholder="Ready to explore learning resources and start preparing?"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtitle Description</label>
              <textarea
                rows={2}
                value={ctaSection.subtitle || ''}
                onChange={(e) => updateSectionField('lms-cta', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="Join hundreds of engineering colleges utilizing..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-800 pt-5">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-emerald-400">Primary Button (Green)</span>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Button Label</label>
                  <input
                    type="text"
                    value={ctaSection.content?.primaryBtnText || ''}
                    onChange={(e) => updateSectionField('lms-cta', 'content.primaryBtnText', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                    placeholder="Explore Career Pro Plan"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Button Link</label>
                  <input
                    type="text"
                    value={ctaSection.content?.primaryBtnLink || ''}
                    onChange={(e) => updateSectionField('lms-cta', 'content.primaryBtnLink', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    placeholder="#/pricing"
                  />
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-white">Secondary Button (White)</span>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Button Label</label>
                  <input
                    type="text"
                    value={ctaSection.content?.secondaryBtnText || ''}
                    onChange={(e) => updateSectionField('lms-cta', 'content.secondaryBtnText', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                    placeholder="View Upcoming Drives"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Button Link</label>
                  <input
                    type="text"
                    value={ctaSection.content?.secondaryBtnLink || ''}
                    onChange={(e) => updateSectionField('lms-cta', 'content.secondaryBtnLink', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    placeholder="#/upcoming-drives"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: SEO SETTINGS */}
        {activeTab === 'seo' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Search Optimization</span>
              <h2 className="text-lg font-bold text-white mt-1">SEO & Metadata</h2>
              <p className="text-xs text-slate-400 mt-1">Configure meta title, description, and keywords for search engines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Status Notification Toast */}
        {saveStatus && (
          <div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500 text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{saveStatus}</span>
          </div>
        )}

      </div>
    </div>
  );
}
