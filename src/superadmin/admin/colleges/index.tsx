import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { 
  FileText, Layout, Settings, Save, MoveUp, MoveDown, Trash2, Plus, ArrowUp, ArrowDown 
} from 'lucide-react';
import { UniversalImageUploader } from '../../../components/dashboard/UniversalImageUploader';

interface AdminCollegesPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const DEFAULT_COLLEGE_SECTIONS = [
  {
    id: "partnership-badge-hero",
    type: "partnership-badge-hero",
    title: "Partner With Us",
    subtitle: "We work with colleges to provide better career opportunities",
    content: {
      badgeText: "9. COLLEGE PARTNERSHIP",
      brochureBtnText: "Download Brochure",
      brochureBtnLink: "#",
      registerBtnText: "Register Your College",
      registerBtnLink: "#contact",
      benefits: [
        { id: "b1", title: "Workshops & Seminars", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=120" },
        { id: "b2", title: "CRT Training Programs", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=120" },
        { id: "b3", title: "Placement Drives", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=120" },
        { id: "b4", title: "Industrial Visits", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120" },
        { id: "b5", title: "Faculty Development", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-why",
    type: "partnership-why",
    title: "Why Partner With TANTRAPEX?",
    subtitle: "",
    content: {
      cards: [
        { id: "c1", title: "Industry Exposure", desc: "Give your students real world industry exposure.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120" },
        { id: "c2", title: "Better Placements", desc: "Improve placement rate with our training programs.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=120" },
        { id: "c3", title: "Skill Development", desc: "Enhance skills and employability of your students.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120" },
        { id: "c4", title: "Career Growth", desc: "Help students to build a successful career path.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=120" },
        { id: "c5", title: "Long Term Association", desc: "Build a strong and long term partnership.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" },
        { id: "c6", title: "Dedicated Support", desc: "Get dedicated support from our expert team.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-stats",
    type: "partnership-stats",
    title: "Key Metrics & Success",
    subtitle: "",
    content: {
      stats: [
        { id: "s1", count: "50+", label: "Partner Colleges", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=120" },
        { id: "s2", count: "20K+", label: "Students Trained", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=120" },
        { id: "s3", count: "500+", label: "Placement Drives", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=120" },
        { id: "s4", count: "100+", label: "Workshops Conducted", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" },
        { id: "s5", count: "95%", label: "Placement Assistance", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-contact",
    type: "partnership-contact",
    title: "Get In Touch",
    subtitle: "Interested in partnering with us? Let's build better futures together.",
    content: {
      officeTitle: "Bhopal Office",
      officeAddress: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016",
      phone: "+91 90900 12345",
      email: "info@tantrapex.com",
      website: "www.tantrapex.com",
      linkedinUrl: "https://linkedin.com",
      instagramUrl: "https://instagram.com",
      youtubeUrl: "https://youtube.com",
      facebookUrl: "https://facebook.com"
    }
  },
  {
    id: "partnership-cta",
    type: "partnership-cta",
    title: "Ready to start your journey?",
    subtitle: "Register now and get a free demo class.",
    content: {
      ctaBtnText: "Register Now",
      ctaBtnLink: "#contact"
    }
  }
];

export default function AdminCollegesPage({
  page,
  setPages,
  onEditField
}: AdminCollegesPageProps) {
  // Guarantee all sections exist
  React.useEffect(() => {
    let hasChanges = false;
    const currentSections = page?.sections ? [...page.sections] : [];
    
    DEFAULT_COLLEGE_SECTIONS.forEach(defSec => {
      const exists = currentSections.some(s => s.id === defSec.id || s.type === defSec.type);
      if (!exists) {
        currentSections.push(defSec as any);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setPages(prev => prev.map(p => {
        if (p.id !== page.id) return p;
        return {
          ...p,
          sections: currentSections
        };
      }));
    }
  }, [page, setPages]);

  const sections = page?.sections || [];
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sections[0]?.id || DEFAULT_COLLEGE_SECTIONS[0].id
  );

  const [seoTitle, setSeoTitle] = useState(page?.seo?.title || "College Partnership | Tantrapex");
  const [seoDesc, setSeoDesc] = useState(page?.seo?.description || "");
  const [seoKeywords, setSeoKeywords] = useState(page?.seo?.keywords || "");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setPages(prev => prev.map(p => {
      if (p.id !== page.id) return p;
      return {
        ...p,
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        }
      };
    }));
    triggerSaveNotification("SEO Settings saved!");
  };

  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 2500);
  };

  // Safe handlers to update section contents
  const updateActiveSectionContent = (key: string, value: any) => {
    if (!activeSection) return;
    onEditField(activeSection.id, `content.${key}`, value);
  };

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">CMS College Dashboard</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                Connected to CRM database
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Colleges Page Configurator</h1>
            <p className="text-xs text-slate-400 mt-1">Edit every heading, button text, stat counter, benefit card, and upload custom images instantly.</p>
          </div>
          
          {saveStatus && (
            <div className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-all">
              {saveStatus}
            </div>
          )}
        </div>

        {/* Global SEO Settings */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>SEO Page Settings</span>
          </h2>
          <form onSubmit={handleSaveSEO} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Page Title</label>
              <input 
                type="text" 
                value={seoTitle} 
                onChange={(e) => setSeoTitle(e.target.value)} 
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</label>
              <input 
                type="text" 
                value={seoDesc} 
                onChange={(e) => setSeoDesc(e.target.value)} 
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Keywords</label>
              <input 
                type="text" 
                value={seoKeywords} 
                onChange={(e) => setSeoKeywords(e.target.value)} 
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider font-sans shrink-0 transition-all shadow active:scale-95 h-[36px]"
            >
              Save SEO
            </button>
          </form>
        </div>

        {/* Section Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Section list tabs (Col 4) */}
          <div className="md:col-span-4 flex flex-col gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest px-2 mb-2">Edit Page Sections</h3>
            
            {sections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xs capitalize leading-none">{sec.title || sec.type.replace('partnership-', '').replace('-', ' ')}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{sec.id}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Editor Area (Col 8) */}
          <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            
            {activeSection ? (
              <div className="flex flex-col gap-6">
                
                {/* Section Header */}
                <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-extrabold">Active Section Properties</span>
                    <h3 className="font-extrabold text-white text-base mt-1">
                      {activeSection.title || activeSection.type}
                    </h3>
                  </div>
                </div>

                {/* Main Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Primary Title</label>
                    <input 
                      type="text" 
                      value={activeSection.title || ''} 
                      onChange={(e) => onEditField(activeSection.id, 'title', e.target.value)} 
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Subtitle</label>
                    <input 
                      type="text" 
                      value={activeSection.subtitle || ''} 
                      onChange={(e) => onEditField(activeSection.id, 'subtitle', e.target.value)} 
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>

                {/* SECTION-SPECIFIC FIELDS */}

                {/* 1. HERO BADGE & BENEFITS ROW */}
                {activeSection.id === "partnership-badge-hero" && (
                  <div className="flex flex-col gap-6 border-t border-slate-800/60 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Badge Text</label>
                        <input 
                          type="text" 
                          value={activeSection.content.badgeText || ''} 
                          onChange={(e) => updateActiveSectionContent('badgeText', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Register Button Text</label>
                        <input 
                          type="text" 
                          value={activeSection.content.registerBtnText || ''} 
                          onChange={(e) => updateActiveSectionContent('registerBtnText', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brochure Button Text</label>
                        <input 
                          type="text" 
                          value={activeSection.content.brochureBtnText || ''} 
                          onChange={(e) => updateActiveSectionContent('brochureBtnText', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/80 my-2" />
                    
                    <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">Row Benefits (5 items)</h4>
                    <div className="flex flex-col gap-4">
                      {activeSection.content.benefits?.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-500">Benefit #{idx+1}</span>
                          <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex flex-col gap-1.5 flex-1 w-full">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Benefit Title</label>
                              <input 
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const copy = [...activeSection.content.benefits];
                                  copy[idx] = { ...copy[idx], title: e.target.value };
                                  updateActiveSectionContent('benefits', copy);
                                }}
                                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <UniversalImageUploader 
                              label="Upload Icon / Image"
                              value={item.image || ''}
                              onChange={(val) => {
                                const copy = [...activeSection.content.benefits];
                                copy[idx] = { ...copy[idx], image: val };
                                updateActiveSectionContent('benefits', copy);
                              }}
                              className="w-full md:w-[280px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. WHY PARTNER WITH TANTRAPEX (6 CARDS) */}
                {activeSection.id === "partnership-why" && (
                  <div className="flex flex-col gap-6 border-t border-slate-800/60 pt-6">
                    <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">Bento Feature Cards (6 items)</h4>
                    <div className="grid grid-cols-1 gap-6">
                      {activeSection.content.cards?.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-4">
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Card #{idx+1}</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Card Title</label>
                                <input 
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const copy = [...activeSection.content.cards];
                                    copy[idx] = { ...copy[idx], title: e.target.value };
                                    updateActiveSectionContent('cards', copy);
                                  }}
                                  className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Card Description</label>
                                <textarea 
                                  rows={2}
                                  value={item.desc || ''}
                                  onChange={(e) => {
                                    const copy = [...activeSection.content.cards];
                                    copy[idx] = { ...copy[idx], desc: e.target.value };
                                    updateActiveSectionContent('cards', copy);
                                  }}
                                  className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                                />
                              </div>
                            </div>
                            
                            <UniversalImageUploader 
                              label="Card Custom Image / Icon"
                              value={item.image || ''}
                              onChange={(val) => {
                                const copy = [...activeSection.content.cards];
                                copy[idx] = { ...copy[idx], image: val };
                                updateActiveSectionContent('cards', copy);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. KEY METRICS & SUCCESS STATS */}
                {activeSection.id === "partnership-stats" && (
                  <div className="flex flex-col gap-6 border-t border-slate-800/60 pt-6">
                    <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">Stat Counters (5 items)</h4>
                    <div className="flex flex-col gap-4">
                      {activeSection.content.stats?.map((stat: any, idx: number) => (
                        <div key={stat.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-500">Stat #{idx+1}</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Value (e.g. 50+)</label>
                              <input 
                                type="text"
                                value={stat.count || ''}
                                onChange={(e) => {
                                  const copy = [...activeSection.content.stats];
                                  copy[idx] = { ...copy[idx], count: e.target.value };
                                  updateActiveSectionContent('stats', copy);
                                }}
                                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Label (e.g. Partner Colleges)</label>
                              <input 
                                type="text"
                                value={stat.label || ''}
                                onChange={(e) => {
                                  const copy = [...activeSection.content.stats];
                                  copy[idx] = { ...copy[idx], label: e.target.value };
                                  updateActiveSectionContent('stats', copy);
                                }}
                                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <UniversalImageUploader 
                              label="Custom Stat Icon / Image"
                              value={stat.image || ''}
                              onChange={(val) => {
                                const copy = [...activeSection.content.stats];
                                copy[idx] = { ...copy[idx], image: val };
                                updateActiveSectionContent('stats', copy);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. GET IN TOUCH (CONTACT DETAILS) */}
                {activeSection.id === "partnership-contact" && (
                  <div className="flex flex-col gap-6 border-t border-slate-800/60 pt-6">
                    <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">Contact Details (Left Column)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Office Title</label>
                        <input 
                          type="text" 
                          value={activeSection.content.officeTitle || ''} 
                          onChange={(e) => updateActiveSectionContent('officeTitle', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                        <input 
                          type="text" 
                          value={activeSection.content.phone || ''} 
                          onChange={(e) => updateActiveSectionContent('phone', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                        <input 
                          type="text" 
                          value={activeSection.content.email || ''} 
                          onChange={(e) => updateActiveSectionContent('email', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Website</label>
                        <input 
                          type="text" 
                          value={activeSection.content.website || ''} 
                          onChange={(e) => updateActiveSectionContent('website', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Office Full Address</label>
                        <input 
                          type="text" 
                          value={activeSection.content.officeAddress || ''} 
                          onChange={(e) => updateActiveSectionContent('officeAddress', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider mt-4">Social Media Profile Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile Link</label>
                        <input 
                          type="text" 
                          value={activeSection.content.linkedinUrl || ''} 
                          onChange={(e) => updateActiveSectionContent('linkedinUrl', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Instagram Profile Link</label>
                        <input 
                          type="text" 
                          value={activeSection.content.instagramUrl || ''} 
                          onChange={(e) => updateActiveSectionContent('instagramUrl', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">YouTube Channel Link</label>
                        <input 
                          type="text" 
                          value={activeSection.content.youtubeUrl || ''} 
                          onChange={(e) => updateActiveSectionContent('youtubeUrl', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Facebook Page Link</label>
                        <input 
                          type="text" 
                          value={activeSection.content.facebookUrl || ''} 
                          onChange={(e) => updateActiveSectionContent('facebookUrl', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. READY TO START YOUR JOURNEY BANNER */}
                {activeSection.id === "partnership-cta" && (
                  <div className="flex flex-col gap-6 border-t border-slate-800/60 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Button Text</label>
                        <input 
                          type="text" 
                          value={activeSection.content.ctaBtnText || ''} 
                          onChange={(e) => updateActiveSectionContent('ctaBtnText', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">CTA Button Link</label>
                        <input 
                          type="text" 
                          value={activeSection.content.ctaBtnLink || ''} 
                          onChange={(e) => updateActiveSectionContent('ctaBtnLink', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-sans">
                Please select a section from the left side list to edit its fields.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
