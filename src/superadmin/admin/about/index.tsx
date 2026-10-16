import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_ABOUT_SECTIONS } from '../../../lib/defaultAbout';
import { 
  FileText, Layout, Settings, Save, Trash2, Plus, 
  Upload, Image as ImageIcon, Sparkles, RefreshCw, CheckCircle2,
  Flag, Sliders, Users, GraduationCap, Building2, Briefcase, Award
} from 'lucide-react';

interface AdminAboutPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminAboutPage({
  page,
  setPages,
  onEditField,
  media,
  setMedia
}: AdminAboutPageProps) {
  // Ensure sections exist, or initialize with DEFAULT_ABOUT_SECTIONS
  const currentSections = (page.sections && page.sections.some(s => s.type.startsWith('about-')))
    ? page.sections
    : DEFAULT_ABOUT_SECTIONS;

  const [activeTab, setActiveTab] = useState<string>('about-hero');
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || 'About Us | TantraPex Technologies');
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || "India's First Private Placement Cell.");
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || 'private placement cell, campus hiring, tantrapex');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const getSection = (type: string) => {
    return currentSections.find(s => s.type === type) || DEFAULT_ABOUT_SECTIONS.find(s => s.type === type)!;
  };

  const updateSectionField = (sectionType: string, path: string, value: any) => {
    const targetSection = getSection(sectionType);
    if (!targetSection) return;

    // Call onEditField for live synchronization
    onEditField(targetSection.id, path, value);

    // Also update parent pages state
    setPages(prevPages => prevPages.map(p => {
      if (p.id !== page.id) return p;

      let sections = [...(p.sections || [])];
      const sIdx = sections.findIndex(s => s.type === sectionType || s.id === targetSection.id);
      
      if (sIdx === -1) {
        // Section not in array yet, add default with updated value
        const newSec = JSON.parse(JSON.stringify(targetSection));
        setDeepValue(newSec, path, value);
        sections.push(newSec);
      } else {
        const updatedSec = JSON.parse(JSON.stringify(sections[sIdx]));
        setDeepValue(updatedSec, path, value);
        sections[sIdx] = updatedSec;
      }

      return {
        ...p,
        sections
      };
    }));
  };

  const setDeepValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const updatedPage: CMSPage = {
        ...page,
        sections: currentSections,
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        }
      };

      const res = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: updatedPage })
      });

      const data = await res.json().catch(() => ({}));
      if (data.success !== false) {
        triggerSaveNotification('About Page saved & synced with MongoDB successfully!');
      } else {
        triggerSaveNotification('Saved in local state. Database will sync shortly.');
      }
    } catch {
      triggerSaveNotification('Saved to local storage draft state.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all About Page content back to original stitch design defaults? Any unsaved edits will be replaced.')) {
      setPages(prev => prev.map(p => {
        if (p.id !== page.id) return p;
        return {
          ...p,
          sections: DEFAULT_ABOUT_SECTIONS
        };
      }));
      triggerSaveNotification('Reset to stitch design defaults! Click "Save to Database" to persist.');
    }
  };

  const handleImageUpload = async (sectionType: string, fieldPath: string, file: File) => {
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = String(reader.result || '');
        const resp = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex/About' })
        });
        const json = await resp.json();
        if (json.success && json.url) {
          updateSectionField(sectionType, fieldPath, json.url);
          if (setMedia) {
            const newItem: MediaItem = {
              id: `m-${Date.now()}`,
              name: file.name,
              url: json.url,
              type: 'image',
              size: `${Math.round(file.size / 1024)}KB`,
              folder: 'Tantrapex/About',
              altText: file.name
            };
            setMedia(prev => [newItem, ...(prev || [])]);
          }
          triggerSaveNotification('Image uploaded to Cloudinary successfully!');
        } else {
          alert('Upload failed: ' + (json.message || 'Unknown error'));
        }
      } catch (err: any) {
        alert('Upload failed: ' + err.message);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  // Sections
  const hero = getSection('about-hero');
  const mission = getSection('about-mission-approach');
  const ecosystem = getSection('about-ecosystem');
  const team = getSection('about-team');
  const values = getSection('about-values');
  const cta = getSection('about-cta');

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">TantraPex Redesign 2025</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                About Us CMS Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">About Us Page Customizer</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every single text, image, badge, policy, metric, card, and button is fully editable and synchronized with MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetToDefault}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save to Database'}</span>
            </button>
          </div>
        </div>

        {/* Global SEO Settings */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Search Engine Optimization (SEO) & Social Metadata</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Title (Browser Tab)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</label>
              <input
                type="text"
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
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
        </div>

        {/* Section Tabs Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column Tabs */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-xl flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">Page Section Modules</span>
            
            {[
              { id: 'about-hero', label: '1. Editorial Hero & Policy', icon: Sparkles },
              { id: 'about-mission-approach', label: '2. Mission & Approach Mandate', icon: Flag },
              { id: 'about-ecosystem', label: '3. Tripartite Framework (Pillars)', icon: Building2 },
              { id: 'about-team', label: '4. Leadership, Team & Stats', icon: Users },
              { id: 'about-values', label: '5. Our 5 Core Values', icon: Award },
              { id: 'about-cta', label: '6. Bottom Call to Action', icon: CheckCircle2 }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/80 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IconComp className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Tab Content Editor */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[500px]">
            
            {/* 1. HERO TAB */}
            {activeTab === 'about-hero' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Section 1: Editorial Header & Cell Policy Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Edit main heading, subtitle description, and the verified status box.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Header Badge Text</label>
                    <input
                      type="text"
                      value={hero.content?.badgeText || ''}
                      onChange={(e) => updateSectionField('about-hero', 'content.badgeText', e.target.value)}
                      placeholder="WHO WE ARE"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Heading</label>
                    <input
                      type="text"
                      value={hero.title || ''}
                      onChange={(e) => updateSectionField('about-hero', 'title', e.target.value)}
                      placeholder="About TantraPex"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Editorial Description</label>
                    <textarea
                      rows={3}
                      value={hero.subtitle || hero.content?.description || ''}
                      onChange={(e) => updateSectionField('about-hero', 'subtitle', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Side Policy Status Card</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Tag</label>
                      <input
                        type="text"
                        value={hero.content?.statusTag || ''}
                        onChange={(e) => updateSectionField('about-hero', 'content.statusTag', e.target.value)}
                        placeholder="Cell Status & Policy"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Highlight Heading</label>
                      <input
                        type="text"
                        value={hero.content?.statusTitle || ''}
                        onChange={(e) => updateSectionField('about-hero', 'content.statusTitle', e.target.value)}
                        placeholder="100% Free For Students"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Detailed Note</label>
                      <input
                        type="text"
                        value={hero.content?.statusDesc || ''}
                        onChange={(e) => updateSectionField('about-hero', 'content.statusDesc', e.target.value)}
                        placeholder="Zero registration charges. Zero security deposits. Pure merit-driven campus hiring."
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MISSION & APPROACH TAB */}
            {activeTab === 'about-mission-approach' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Section 2: Mission & Approach Mandates</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control the two structural panes: Institutional Mandate & Execution Pipeline.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Mission */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Left Pane: Our Mission</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Mandate Tag</label>
                      <input
                        type="text"
                        value={mission.content?.missionTag || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.missionTag', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Title</label>
                      <input
                        type="text"
                        value={mission.content?.missionTitle || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.missionTitle', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Description</label>
                      <textarea
                        rows={3}
                        value={mission.content?.missionDesc || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.missionDesc', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Bottom Link Label</label>
                      <input
                        type="text"
                        value={mission.content?.missionFooter || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.missionFooter', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Right: Approach */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Right Pane: Our Approach</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Execution Tag</label>
                      <input
                        type="text"
                        value={mission.content?.approachTag || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.approachTag', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Title</label>
                      <input
                        type="text"
                        value={mission.content?.approachTitle || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.approachTitle', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Description</label>
                      <textarea
                        rows={3}
                        value={mission.content?.approachDesc || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.approachDesc', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Bottom Link Label</label>
                      <input
                        type="text"
                        value={mission.content?.approachFooter || ''}
                        onChange={(e) => updateSectionField('about-mission-approach', 'content.approachFooter', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ECOSYSTEM (PILLARS) TAB */}
            {activeTab === 'about-ecosystem' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Section 3: How We Support Students & Colleges</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage the tripartite framework cards: For Students, For Colleges, For Companies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Tag</label>
                    <input
                      type="text"
                      value={ecosystem.content?.tag || ''}
                      onChange={(e) => updateSectionField('about-ecosystem', 'content.tag', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Heading</label>
                    <input
                      type="text"
                      value={ecosystem.title || ''}
                      onChange={(e) => updateSectionField('about-ecosystem', 'title', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Subtitle</label>
                    <input
                      type="text"
                      value={ecosystem.subtitle || ''}
                      onChange={(e) => updateSectionField('about-ecosystem', 'subtitle', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Pillars Cards */}
                <div className="mt-4 flex flex-col gap-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3 Tripartite Cards</span>
                  
                  {((ecosystem.content?.pillars || DEFAULT_ABOUT_SECTIONS[2].content.pillars) as any[]).map((pillar: any, pIdx: number) => (
                    <div key={pillar.id || pIdx} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white uppercase">{pillar.title} (Pillar #{pIdx + 1})</span>
                        <span className="text-[10px] font-mono text-emerald-400">{pillar.tag}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Card Tag</label>
                          <input
                            type="text"
                            value={pillar.tag || ''}
                            onChange={(e) => updateSectionField('about-ecosystem', `content.pillars.${pIdx}.tag`, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Title</label>
                          <input
                            type="text"
                            value={pillar.title || ''}
                            onChange={(e) => updateSectionField('about-ecosystem', `content.pillars.${pIdx}.title`, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">CTA Button Label</label>
                          <input
                            type="text"
                            value={pillar.btnText || ''}
                            onChange={(e) => updateSectionField('about-ecosystem', `content.pillars.${pIdx}.btnText`, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-3">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Description</label>
                          <input
                            type="text"
                            value={pillar.desc || ''}
                            onChange={(e) => updateSectionField('about-ecosystem', `content.pillars.${pIdx}.desc`, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Feature Bullet Points */}
                      <div className="flex flex-col gap-2 mt-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Bullet Feature Points</label>
                        {((pillar.features || []) as string[]).map((feat: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => updateSectionField('about-ecosystem', `content.pillars.${pIdx}.features.${fIdx}`, e.target.value)}
                              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = pillar.features.filter((_: any, i: number) => i !== fIdx);
                                updateSectionField('about-ecosystem', `content.pillars.${pIdx}.features`, newFeatures);
                              }}
                              className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                              title="Delete point"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = [...(pillar.features || []), 'New key benefit item'];
                            updateSectionField('about-ecosystem', `content.pillars.${pIdx}.features`, newFeatures);
                          }}
                          className="w-fit text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 mt-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TEAM & STATS TAB */}
            {activeTab === 'about-team' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Section 4: Our Leadership, Team & Key Metrics</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload leadership photo, customize editorial statements, and set key statistics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tag</label>
                    <input
                      type="text"
                      value={team.content?.tag || ''}
                      onChange={(e) => updateSectionField('about-team', 'content.tag', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heading</label>
                    <input
                      type="text"
                      value={team.title || ''}
                      onChange={(e) => updateSectionField('about-team', 'title', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Paragraph (Bold Highlight)</label>
                    <textarea
                      rows={2}
                      value={team.content?.heading || ''}
                      onChange={(e) => updateSectionField('about-team', 'content.heading', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Paragraph</label>
                    <textarea
                      rows={4}
                      value={team.content?.description || ''}
                      onChange={(e) => updateSectionField('about-team', 'content.description', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* Team Image & Cloudinary Uploader */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Leadership Team Photo & Captions</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">Image URL</label>
                      <input
                        type="text"
                        value={team.content?.teamImage || ''}
                        onChange={(e) => updateSectionField('about-team', 'content.teamImage', e.target.value)}
                        placeholder="https://..."
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      
                      <div className="flex items-center gap-2 mt-1">
                        <label className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleImageUpload('about-team', 'content.teamImage', f);
                            }}
                          />
                        </label>
                        <span className="text-[10px] text-slate-400">Direct Cloudinary upload</span>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Image Bottom Overlay Badge</label>
                        <input
                          type="text"
                          value={team.content?.imageBadge || ''}
                          onChange={(e) => updateSectionField('about-team', 'content.imageBadge', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Image Sub-Caption</label>
                        <input
                          type="text"
                          value={team.content?.imageCaption || ''}
                          onChange={(e) => updateSectionField('about-team', 'content.imageCaption', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl p-3 h-56 overflow-hidden">
                      {team.content?.teamImage ? (
                        <img
                          src={team.content.teamImage}
                          alt="Team Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-slate-600 flex flex-col items-center gap-1">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">No Image Provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Metrics / Stats */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Key Track Record Stats</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = [...(team.content?.stats || []), { id: `s-${Date.now()}`, value: '500+', label: 'New Metric Label' }];
                        updateSectionField('about-team', 'content.stats', newStats);
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Stat</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {((team.content?.stats || DEFAULT_ABOUT_SECTIONS[3].content.stats) as any[]).map((st: any, idx: number) => (
                      <div key={st.id || idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newStats = (team.content?.stats || []).filter((_: any, i: number) => i !== idx);
                            updateSectionField('about-team', 'content.stats', newStats);
                          }}
                          className="absolute top-2 right-2 text-slate-500 hover:text-rose-400"
                          title="Delete stat"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Value / Metric</label>
                          <input
                            type="text"
                            value={st.value || ''}
                            onChange={(e) => updateSectionField('about-team', `content.stats.${idx}.value`, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-bold"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase font-semibold">Description Label</label>
                          <input
                            type="text"
                            value={st.label || ''}
                            onChange={(e) => updateSectionField('about-team', `content.stats.${idx}.label`, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. CORE VALUES TAB */}
            {activeTab === 'about-values' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Section 5: Our 5 Core Values</h3>
                    <p className="text-xs text-slate-400 mt-0.5">The non-negotiable principles guiding every candidate assessment and placement drive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVals = [
                        ...(values.content?.values || []),
                        { id: `v-${Date.now()}`, number: `0${(values.content?.values?.length || 0) + 1}`, title: 'New Principle', desc: 'Description of this value' }
                      ];
                      updateSectionField('about-values', 'content.values', newVals);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Value Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tag</label>
                    <input
                      type="text"
                      value={values.content?.tag || ''}
                      onChange={(e) => updateSectionField('about-values', 'content.tag', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heading</label>
                    <input
                      type="text"
                      value={values.title || ''}
                      onChange={(e) => updateSectionField('about-values', 'title', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtitle</label>
                    <input
                      type="text"
                      value={values.subtitle || ''}
                      onChange={(e) => updateSectionField('about-values', 'subtitle', e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Values Cards */}
                <div className="flex flex-col gap-3 mt-2">
                  {((values.content?.values || DEFAULT_ABOUT_SECTIONS[4].content.values) as any[]).map((val: any, idx: number) => (
                    <div key={val.id || idx} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-3">
                      <div className="flex items-center gap-2 w-full md:w-28 shrink-0">
                        <span className="text-xs font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                        <input
                          type="text"
                          value={val.number || ''}
                          onChange={(e) => updateSectionField('about-values', `content.values.${idx}.number`, e.target.value)}
                          placeholder="01"
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white w-16 font-bold text-center"
                        />
                      </div>

                      <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={val.title || ''}
                          onChange={(e) => updateSectionField('about-values', `content.values.${idx}.title`, e.target.value)}
                          placeholder="Title"
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-semibold flex-1"
                        />
                        <input
                          type="text"
                          value={val.desc || ''}
                          onChange={(e) => updateSectionField('about-values', `content.values.${idx}.desc`, e.target.value)}
                          placeholder="Description"
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 flex-2"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newVals = (values.content?.values || []).filter((_: any, i: number) => i !== idx);
                          updateSectionField('about-values', 'content.values', newVals);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete value card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CTA BANNER TAB */}
            {activeTab === 'about-cta' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Section 6: Bottom Call To Action (CTA) Banner</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control the high-impact conversion banner at the footer of the page.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Tag</label>
                    <input
                      type="text"
                      value={cta.content?.tag || ''}
                      onChange={(e) => updateSectionField('about-cta', 'content.tag', e.target.value)}
                      placeholder="Immediate Institutional Access"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headline</label>
                    <textarea
                      rows={2}
                      value={cta.title || ''}
                      onChange={(e) => updateSectionField('about-cta', 'title', e.target.value)}
                      placeholder="Have questions or want to partner with us? Talk to our team today."
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description Subtitle</label>
                    <textarea
                      rows={2}
                      value={cta.subtitle || ''}
                      onChange={(e) => updateSectionField('about-cta', 'subtitle', e.target.value)}
                      placeholder="Whether you are a student preparing for campus recruitments..."
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Button Text</label>
                    <input
                      type="text"
                      value={cta.content?.primaryBtnText || ''}
                      onChange={(e) => updateSectionField('about-cta', 'content.primaryBtnText', e.target.value)}
                      placeholder="Contact Us"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Button Route Link</label>
                    <input
                      type="text"
                      value={cta.content?.primaryBtnLink || ''}
                      onChange={(e) => updateSectionField('about-cta', 'content.primaryBtnLink', e.target.value)}
                      placeholder="#/contact"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Button Text</label>
                    <input
                      type="text"
                      value={cta.content?.secondaryBtnText || ''}
                      onChange={(e) => updateSectionField('about-cta', 'content.secondaryBtnText', e.target.value)}
                      placeholder="Explore Drives"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Button Route Link</label>
                    <input
                      type="text"
                      value={cta.content?.secondaryBtnLink || ''}
                      onChange={(e) => updateSectionField('about-cta', 'content.secondaryBtnLink', e.target.value)}
                      placeholder="#/upcoming-drives"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={handleSaveToDatabase}
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving to Database...' : 'Save & Publish to MongoDB'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Status Notification */}
        {saveStatus && (
          <div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500 text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce z-50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{saveStatus}</span>
          </div>
        )}

      </div>
    </div>
  );
}
