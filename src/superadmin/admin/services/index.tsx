import React, { useState } from 'react';
import { CMSPage, CMSSection } from '../../../types';
import { 
  FileText, Layout, Settings, Save, MoveUp, MoveDown, Trash2, Plus 
} from 'lucide-react';
import { UniversalImageUploader } from '../../../components/dashboard/UniversalImageUploader';

interface AdminServicesPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export default function AdminServicesPage({
  page,
  setPages,
  onEditField,
  onMoveSection,
  onDeleteSection
}: AdminServicesPageProps) {
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
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                Services Config Document
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Structured Services CMS Page</h1>
            <p className="text-xs text-slate-400 mt-1">Manage sections, fields, text content, and metadata stored directly in MongoDB collections.</p>
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
                <div className="flex flex-col gap-4">
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

                  {/* Render content inputs based on key-value pairs */}
                  {activeSection.content && (
                    <div className="flex flex-col gap-4 mt-2">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/60 pb-1">Block Data Attributes</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(activeSection.content).map(([key, val]) => {
                          if (typeof val === 'string') {
                            return (
                              <div key={key} className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <textarea 
                                  value={val} 
                                  onChange={(e) => onEditField(activeSection.id, `content.${key}`, e.target.value)} 
                                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans min-h-[50px]"
                                />
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {/* Special Array List Editor for Services in services-grid */}
                      {activeSection.type === 'services-grid' && (
                        <div className="mt-6 border-t border-slate-800 pt-6 flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex flex-col">
                              <h5 className="text-xs font-extrabold text-white uppercase tracking-wider">Individual Services Cards</h5>
                              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Add, edit, rearrange or delete services rendered inside this grid.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const currentServices = activeSection.content.services || [];
                                const newList = [
                                  ...currentServices,
                                  {
                                    id: "s-" + Date.now(),
                                    title: "New Placement Service",
                                    desc: "Describe this specialized student placement training program details.",
                                    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"
                                  }
                                ];
                                onEditField(activeSection.id, 'content.services', newList);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add New Service</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-1">
                            {(!activeSection.content.services || activeSection.content.services.length === 0) ? (
                              <div className="text-center p-8 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-sans">
                                No services found. Click "Add New Service" to insert one.
                              </div>
                            ) : (
                              activeSection.content.services.map((serv: any, idx: number) => {
                                const totalServices = activeSection.content.services.length;
                                return (
                                  <div key={serv.id || idx} className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col gap-3 font-sans">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                                          #{idx + 1}
                                        </span>
                                        <span className="text-xs font-bold text-slate-300 truncate max-w-[180px] sm:max-w-[240px]">
                                          {serv.title || 'Untitled Service'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1.5 ml-auto">
                                        {/* Position Selector Dropdown */}
                                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Pos:</span>
                                          <select
                                            value={idx}
                                            onChange={(e) => {
                                              const newTargetIdx = parseInt(e.target.value, 10);
                                              if (isNaN(newTargetIdx) || newTargetIdx === idx) return;
                                              const list = [...activeSection.content.services];
                                              const itemToMove = list.splice(idx, 1)[0];
                                              list.splice(newTargetIdx, 0, itemToMove);
                                              onEditField(activeSection.id, 'content.services', list);
                                            }}
                                            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                                          >
                                            {Array.from({ length: totalServices }).map((_, posIdx) => (
                                              <option key={posIdx} value={posIdx} className="bg-slate-900 text-white">
                                                Position #{posIdx + 1}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Move Up Button */}
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => {
                                            if (idx === 0) return;
                                            const list = [...activeSection.content.services];
                                            const temp = list[idx - 1];
                                            list[idx - 1] = list[idx];
                                            list[idx] = temp;
                                            onEditField(activeSection.id, 'content.services', list);
                                          }}
                                          className="p-1.5 bg-slate-800 hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 hover:text-white rounded transition-colors"
                                          title="Move Up in Sequence"
                                        >
                                          <MoveUp className="h-3.5 w-3.5" />
                                        </button>

                                        {/* Move Down Button */}
                                        <button
                                          type="button"
                                          disabled={idx === totalServices - 1}
                                          onClick={() => {
                                            if (idx === totalServices - 1) return;
                                            const list = [...activeSection.content.services];
                                            const temp = list[idx + 1];
                                            list[idx + 1] = list[idx];
                                            list[idx] = temp;
                                            onEditField(activeSection.id, 'content.services', list);
                                          }}
                                          className="p-1.5 bg-slate-800 hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 hover:text-white rounded transition-colors"
                                          title="Move Down in Sequence"
                                        >
                                          <MoveDown className="h-3.5 w-3.5" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete service "${serv.title || 'Untitled'}"?`)) {
                                              const newList = activeSection.content.services.filter((_: any, sidx: number) => sidx !== idx);
                                              onEditField(activeSection.id, 'content.services', newList);
                                            }
                                          }}
                                          className="text-rose-400 hover:text-rose-300 p-1.5 bg-rose-950/30 hover:bg-rose-950/60 rounded transition-colors ml-1"
                                          title="Delete Service Card"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Title</label>
                                      <input
                                        type="text"
                                        value={serv.title || ''}
                                        onChange={(e) => onEditField(activeSection.id, `content.services.${idx}.title`, e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                      />
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                      <UniversalImageUploader
                                        label="Service Image"
                                        value={serv.image || ''}
                                        onChange={(val) => onEditField(activeSection.id, `content.services.${idx}.image`, val)}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Description</label>
                                    <textarea
                                      value={serv.desc || ''}
                                      onChange={(e) => onEditField(activeSection.id, `content.services.${idx}.desc`, e.target.value)}
                                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans min-h-[50px]"
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
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
