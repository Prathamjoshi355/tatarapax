import React, { useState } from 'react';
import { CMSPage, CMSSection, GlobalSettings } from '../../../types';
import { 
  FileText, Layout, Settings, Save, RefreshCw, Eye, MoveUp, MoveDown, Plus, Trash2, Edit 
} from 'lucide-react';

interface AdminHomePageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export default function AdminHomePage({
  page,
  setPages,
  onEditField,
  onMoveSection,
  onDeleteSection
}: AdminHomePageProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(page.sections[0]?.id || null);
  const [seoTitle, setSeoTitle] = useState(page.seo.title);
  const [seoDesc, setSeoDesc] = useState(page.seo.description);
  const [seoKeywords, setSeoKeywords] = useState(page.seo.keywords);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const activeSection = page.sections.find(s => s.id === activeSectionId);

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
    triggerSaveNotification("SEO Settings updated successfully!");
  };

  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 2500);
  };

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">CMS Content Management</span>
              <span className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-blue-500/20">
                Home Config Document
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Structured Home CMS Page</h1>
            <p className="text-xs text-slate-400 mt-1">Manage sections, fields, text content, and metadata stored directly in MongoDB cluster collections.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-900 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>MongoDB Atlas Connected</span>
            </span>
          </div>
        </div>

        {/* Global SEO Panel */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>Search Engine Optimization (SEO) & Metadata</span>
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
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Keywords</label>
              <input 
                type="text" 
                value={seoKeywords} 
                onChange={(e) => setSeoKeywords(e.target.value)} 
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save SEO Metadata</span>
              </button>
            </div>
          </form>
        </div>

        {/* Content Structure and Sections Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section List Left Navigation */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Page Layout Blocks</h2>
            <div className="flex flex-col gap-2">
              {page.sections.map((section, idx) => (
                <div 
                  key={section.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    activeSectionId === section.id 
                      ? 'bg-slate-900 border-blue-500/80 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-xs tracking-tight">{section.title || section.type}</span>
                    <span className="text-[9px] font-mono opacity-60">Block Type: {section.type}</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onMoveSection('up', section.id)}
                      disabled={idx === 0}
                      className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-300 transition-colors"
                      title="Move up"
                    >
                      <MoveUp className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => onMoveSection('down', section.id)}
                      disabled={idx === page.sections.length - 1}
                      className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-300 transition-colors"
                      title="Move down"
                    >
                      <MoveDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Editing Fields Panel */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[450px]">
            {activeSection ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Editing block content</span>
                    <h3 className="text-base font-extrabold text-white uppercase mt-1">{activeSection.title || activeSection.type}</h3>
                  </div>

                  <button 
                    onClick={() => {
                      if(window.confirm("Are you sure you want to delete this block section?")) {
                        onDeleteSection(activeSection.id);
                        setActiveSectionId(page.sections[0]?.id || null);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-900/40 hover:border-rose-700 rounded-lg text-rose-300 text-[10px] font-bold uppercase transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete Block</span>
                  </button>
                </div>

                {/* Structured Fields Form */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block Display Title</label>
                      <input 
                        type="text" 
                        value={activeSection.title || ''} 
                        onChange={(e) => onEditField(activeSection.id, 'title', e.target.value)} 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block Subtitle / Description</label>
                      <input 
                        type="text" 
                        value={activeSection.subtitle || ''} 
                        onChange={(e) => onEditField(activeSection.id, 'subtitle', e.target.value)} 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* CUSTOM SECTION CMS HANDLERS */}
                  {activeSection.content && (
                    <div className="flex flex-col gap-6 mt-2 border-t border-slate-800 pt-4">
                      
                      {/* HERO BLOCK TYPE CONFIGURATION */}
                      {activeSection.type === 'hero' && (
                        <div className="flex flex-col gap-4">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Hero Design & Images</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline</label>
                              <input 
                                type="text" 
                                value={activeSection.content.tagline || ''} 
                                onChange={(e) => onEditField(activeSection.id, 'content.tagline', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Text Alignment</label>
                              <select 
                                value={activeSection.content.textAlignment || 'left'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.textAlignment', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="left">Left Aligned</option>
                                <option value="center">Centered</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hero Background Image URL (Cover)</label>
                              <input 
                                type="text" 
                                value={activeSection.content.heroImage || ''} 
                                onChange={(e) => onEditField(activeSection.id, 'content.heroImage', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Button Text</label>
                              <input 
                                type="text" 
                                value={activeSection.content.primaryBtnText || ''} 
                                onChange={(e) => onEditField(activeSection.id, 'content.primaryBtnText', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Button Text</label>
                              <input 
                                type="text" 
                                value={activeSection.content.secondaryBtnText || ''} 
                                onChange={(e) => onEditField(activeSection.id, 'content.secondaryBtnText', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dark Overlay Color (CSS)</label>
                              <input 
                                type="text" 
                                value={activeSection.content.overlayColor || 'rgba(7, 27, 77, 0.55)'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.overlayColor', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                placeholder="rgba(0,0,0,0.5)"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Height</label>
                              <input 
                                type="text" 
                                value={activeSection.content.heroHeight || '95vh'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.heroHeight', e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                placeholder="95vh or 100vh"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STATISTICS REPEATER MANAGER */}
                      {activeSection.type === 'stats' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Statistics List Items</h4>
                            <button 
                              onClick={() => {
                                const list = [...(activeSection.content.stats || [])];
                                const newItem = {
                                  id: `stat-${Date.now()}`,
                                  label: "New Placement Stat",
                                  count: "100+",
                                  icon: "Users",
                                  visible: true,
                                  order: list.length + 1
                                };
                                onEditField(activeSection.id, 'content.stats', [...list, newItem]);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add New Stat</span>
                            </button>
                          </div>

                          <div className="flex flex-col gap-3">
                            {(activeSection.content.stats || []).map((st: any, idx: number) => {
                              const handleField = (f: string, v: any) => {
                                const list = [...activeSection.content.stats];
                                list[idx] = { ...list[idx], [f]: v };
                                onEditField(activeSection.id, 'content.stats', list);
                              };
                              const handleMove = (direction: 'up' | 'down') => {
                                const list = [...activeSection.content.stats];
                                if (direction === 'up' && idx > 0) {
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                } else if (direction === 'down' && idx < list.length - 1) {
                                  const temp = list[idx];
                                  list[idx] = list[idx + 1];
                                  list[idx + 1] = temp;
                                }
                                onEditField(activeSection.id, 'content.stats', list.map((item, index) => ({ ...item, order: index + 1 })));
                              };
                              const handleDelete = () => {
                                const list = [...activeSection.content.stats];
                                list.splice(idx, 1);
                                onEditField(activeSection.id, 'content.stats', list.map((item, index) => ({ ...item, order: index + 1 })));
                              };
                              const handleDuplicate = () => {
                                const list = [...activeSection.content.stats];
                                const dup = { ...st, id: `stat-${Date.now()}`, label: `${st.label} (Copy)`, order: list.length + 1 };
                                onEditField(activeSection.id, 'content.stats', [...list, dup]);
                              };

                              return (
                                <div key={st.id || idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Number Count</span>
                                      <input 
                                        type="text" 
                                        value={st.count || ''} 
                                        onChange={(e) => handleField('count', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Label / Title</span>
                                      <input 
                                        type="text" 
                                        value={st.label || ''} 
                                        onChange={(e) => handleField('label', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Icon Name</span>
                                      <select 
                                        value={st.icon || 'Users'} 
                                        onChange={(e) => handleField('icon', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2 py-1.5 text-xs text-white"
                                      >
                                        <option value="Users">Users</option>
                                        <option value="Award">Award</option>
                                        <option value="TrendingUp">Trending Up</option>
                                        <option value="CheckCircle">Check Circle</option>
                                        <option value="Briefcase">Briefcase</option>
                                        <option value="BookOpen">Book Open</option>
                                        <option value="GraduationCap">Graduation Cap</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                      <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={st.visible !== false} 
                                          onChange={(e) => handleField('visible', e.target.checked)}
                                          className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-0 h-4 w-4"
                                        />
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Visible</span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                    <button onClick={() => handleMove('up')} disabled={idx === 0} className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-slate-300 disabled:opacity-30"><MoveUp className="h-3 w-3" /></button>
                                    <button onClick={() => handleMove('down')} disabled={idx === (activeSection.content.stats || []).length - 1} className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-slate-300 disabled:opacity-30"><MoveDown className="h-3 w-3" /></button>
                                    <button onClick={handleDuplicate} className="p-1.5 bg-slate-800 hover:bg-blue-900 rounded text-slate-300 hover:text-blue-200" title="Duplicate"><RefreshCw className="h-3 w-3" /></button>
                                    <button onClick={handleDelete} className="p-1.5 bg-slate-800 hover:bg-rose-950 rounded text-slate-300 hover:text-rose-400" title="Delete"><Trash2 className="h-3 w-3" /></button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* WHY CHOOSE US CARDS MANAGER */}
                      {activeSection.type === 'why-choose-us' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Why Choose Us Cards</h4>
                            <button 
                              onClick={() => {
                                const list = [...(activeSection.content.cards || [])];
                                const newItem = {
                                  id: `wc-${Date.now()}`,
                                  title: "Professional Skills Option",
                                  desc: "Expert guidelines to master numeric, logical and technical challenges.",
                                  image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200",
                                  visible: true,
                                  order: list.length + 1
                                };
                                onEditField(activeSection.id, 'content.cards', [...list, newItem]);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add New Card</span>
                            </button>
                          </div>

                          <div className="flex flex-col gap-3">
                            {(activeSection.content.cards || []).map((card: any, idx: number) => {
                              const handleField = (f: string, v: any) => {
                                const list = [...activeSection.content.cards];
                                list[idx] = { ...list[idx], [f]: v };
                                onEditField(activeSection.id, 'content.cards', list);
                              };
                              const handleMove = (direction: 'up' | 'down') => {
                                const list = [...activeSection.content.cards];
                                if (direction === 'up' && idx > 0) {
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                } else if (direction === 'down' && idx < list.length - 1) {
                                  const temp = list[idx];
                                  list[idx] = list[idx + 1];
                                  list[idx + 1] = temp;
                                }
                                onEditField(activeSection.id, 'content.cards', list.map((item, index) => ({ ...item, order: index + 1 })));
                              };
                              const handleDelete = () => {
                                const list = [...activeSection.content.cards];
                                list.splice(idx, 1);
                                onEditField(activeSection.id, 'content.cards', list.map((item, index) => ({ ...item, order: index + 1 })));
                              };
                              const handleDuplicate = () => {
                                const list = [...activeSection.content.cards];
                                const dup = { ...card, id: `wc-${Date.now()}`, title: `${card.title} (Copy)`, order: list.length + 1 };
                                onEditField(activeSection.id, 'content.cards', [...list, dup]);
                              };

                              return (
                                <div key={card.id || idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
                                    <div className="flex flex-col gap-1 col-span-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Card Title</span>
                                      <input 
                                        type="text" 
                                        value={card.title || ''} 
                                        onChange={(e) => handleField('title', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Image Thumbnail URL</span>
                                      <input 
                                        type="text" 
                                        value={card.image || ''} 
                                        onChange={(e) => handleField('image', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Description</span>
                                      <textarea 
                                        value={card.desc || ''} 
                                        onChange={(e) => handleField('desc', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-xs text-white min-h-[44px]"
                                      />
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                      <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={card.visible !== false} 
                                          onChange={(e) => handleField('visible', e.target.checked)}
                                          className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-0 h-4 w-4"
                                        />
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Visible</span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                    <button onClick={() => handleMove('up')} disabled={idx === 0} className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-slate-300 disabled:opacity-30"><MoveUp className="h-3 w-3" /></button>
                                    <button onClick={() => handleMove('down')} disabled={idx === (activeSection.content.cards || []).length - 1} className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-slate-300 disabled:opacity-30"><MoveDown className="h-3 w-3" /></button>
                                    <button onClick={handleDuplicate} className="p-1.5 bg-slate-800 hover:bg-blue-900 rounded text-slate-300 hover:text-blue-200" title="Duplicate"><RefreshCw className="h-3 w-3" /></button>
                                    <button onClick={handleDelete} className="p-1.5 bg-slate-800 hover:bg-rose-950 rounded text-slate-300 hover:text-rose-400" title="Delete"><Trash2 className="h-3 w-3" /></button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* SERVICES HOME LIST MANAGER */}
                      {activeSection.type === 'services-home' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Services Programs Items</h4>
                            <button 
                              onClick={() => {
                                const list = [...(activeSection.content.services || [])];
                                const newItem = {
                                  id: `sh-${Date.now()}`,
                                  title: "New Premium Program",
                                  desc: "Complete placement roadmap covering DSA, mock sessions, resume clinic.",
                                  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=300",
                                  visible: true
                                };
                                onEditField(activeSection.id, 'content.services', [...list, newItem]);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add New Program</span>
                            </button>
                          </div>

                          <div className="flex flex-col gap-3">
                            {(activeSection.content.services || []).map((serv: any, idx: number) => {
                              const handleField = (f: string, v: any) => {
                                const list = [...activeSection.content.services];
                                list[idx] = { ...list[idx], [f]: v };
                                onEditField(activeSection.id, 'content.services', list);
                              };
                              const handleDelete = () => {
                                const list = [...activeSection.content.services];
                                list.splice(idx, 1);
                                onEditField(activeSection.id, 'content.services', list);
                              };

                              return (
                                <div key={serv.id || idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Program Title</span>
                                      <input 
                                        type="text" 
                                        value={serv.title || ''} 
                                        onChange={(e) => handleField('title', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Feature Image URL</span>
                                      <input 
                                        type="text" 
                                        value={serv.image || ''} 
                                        onChange={(e) => handleField('image', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Detailed Summary</span>
                                      <textarea 
                                        value={serv.desc || ''} 
                                        onChange={(e) => handleField('desc', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-xs text-white min-h-[44px]"
                                      />
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                      <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={serv.visible !== false} 
                                          onChange={(e) => handleField('visible', e.target.checked)}
                                          className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-0 h-4 w-4"
                                        />
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Visible</span>
                                      </label>
                                    </div>
                                  </div>

                                  <button onClick={handleDelete} className="p-1.5 bg-slate-800 hover:bg-rose-950 rounded text-slate-300 hover:text-rose-400 shrink-0"><Trash2 className="h-3 w-3" /></button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* SUCCESS / IMPACT EDITABLE FIELDS */}
                      {activeSection.type === 'impact' && (
                        <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Impact Stats Counters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Students Trained</span>
                              <input 
                                type="text" 
                                value={activeSection.content.trained || '5000+'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.trained', e.target.value)}
                                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Hiring Companies</span>
                              <input 
                                type="text" 
                                value={activeSection.content.companies || '50+'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.companies', e.target.value)}
                                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expert Courses</span>
                              <input 
                                type="text" 
                                value={activeSection.content.courses || '12+'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.courses', e.target.value)}
                                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Google Rating</span>
                              <input 
                                type="text" 
                                value={activeSection.content.googleRating || '4.9 Stars'} 
                                onChange={(e) => onEditField(activeSection.id, 'content.googleRating', e.target.value)}
                                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TESTIMONIALS MANAGER */}
                      {activeSection.type === 'testimonials' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Student Reviews (Testimonials)</h4>
                            <button 
                              onClick={() => {
                                const list = [...(activeSection.content.testimonials || [])];
                                const newItem = {
                                  id: `testi-${Date.now()}`,
                                  name: "Sneha Sen",
                                  college: "LNCT Bhopal",
                                  company: "TCS",
                                  package: "4.5 LPA",
                                  review: "Fantastic aptitude coaching sessions. They helped me crack my first campus placement test so easily!",
                                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                };
                                onEditField(activeSection.id, 'content.testimonials', [...list, newItem]);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Testimonial</span>
                            </button>
                          </div>

                          <div className="flex flex-col gap-4">
                            {(activeSection.content.testimonials || []).map((testi: any, idx: number) => {
                              const handleField = (f: string, v: any) => {
                                const list = [...activeSection.content.testimonials];
                                list[idx] = { ...list[idx], [f]: v };
                                onEditField(activeSection.id, 'content.testimonials', list);
                              };
                              const handleDelete = () => {
                                const list = [...activeSection.content.testimonials];
                                list.splice(idx, 1);
                                onEditField(activeSection.id, 'content.testimonials', list);
                              };

                              return (
                                <div key={testi.id || idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start justify-between">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Student Name</span>
                                      <input 
                                        type="text" 
                                        value={testi.name || ''} 
                                        onChange={(e) => handleField('name', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">College</span>
                                      <input 
                                        type="text" 
                                        value={testi.college || ''} 
                                        onChange={(e) => handleField('college', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Company & LPA Package</span>
                                      <input 
                                        type="text" 
                                        value={testi.company || ''} 
                                        onChange={(e) => handleField('company', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                        placeholder="Cognizant (4.5 LPA)"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Detailed Review</span>
                                      <textarea 
                                        value={testi.review || ''} 
                                        onChange={(e) => handleField('review', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white min-h-[44px]"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Avatar Photo URL</span>
                                      <input 
                                        type="text" 
                                        value={testi.avatar || ''} 
                                        onChange={(e) => handleField('avatar', e.target.value)}
                                        className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                      />
                                    </div>
                                  </div>

                                  <button onClick={handleDelete} className="p-1.5 bg-slate-800 hover:bg-rose-950 rounded text-slate-300 hover:text-rose-400 mt-4 md:mt-0 shrink-0"><Trash2 className="h-3 w-3" /></button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Fallback simple properties reader */}
                      {['success-stories', 'courses-home', 'workshops-home', 'blogs-home', 'cta-banner'].includes(activeSection.type) && (
                        <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Layout Block Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(activeSection.content).map(([key, val]) => {
                              if (typeof val === 'string') {
                                return (
                                  <div key={key} className="flex flex-col gap-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <input 
                                      type="text" 
                                      value={val} 
                                      onChange={(e) => onEditField(activeSection.id, `content.${key}`, e.target.value)}
                                      className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                    />
                                  </div>
                                );
                              }
                              if (typeof val === 'number') {
                                return (
                                  <div key={key} className="flex flex-col gap-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <input 
                                      type="number" 
                                      value={val} 
                                      onChange={(e) => onEditField(activeSection.id, `content.${key}`, parseInt(e.target.value, 10) || 0)}
                                      className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white"
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button 
                    onClick={() => triggerSaveNotification("Block changes saved to draft MongoDB collections!")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    <span>Apply & Save Block</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 text-slate-500">
                <Layout className="h-10 w-10 mb-2 text-slate-600" />
                <span className="text-xs font-semibold">No Layout Blocks available for this page.</span>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
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
