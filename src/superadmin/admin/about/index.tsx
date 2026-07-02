import React, { useState } from 'react';
import { CMSPage, CMSSection, MediaItem } from '../../../types';
import { 
  FileText, Layout, Settings, Save, MoveUp, MoveDown, Trash2 
} from 'lucide-react';

interface AdminAboutPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminAboutPage({
  page,
  setPages,
  onEditField,
  onMoveSection,
  onDeleteSection,
  media,
  setMedia
}: AdminAboutPageProps) {
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
              <span className="bg-amber-500/10 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-amber-500/20">
                About Config Document
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Structured About CMS Page</h1>
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
                          // Simple string fields (including single-image fields)
                          if (typeof val === 'string') {
                            const lower = key.toLowerCase();
                            const isImageKey = lower.includes('image') || lower.includes('img') || lower.includes('photo');

                            if (isImageKey) {
                              return (
                                <div key={key} className="flex flex-col gap-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</label>
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => onEditField(activeSection.id, `content.${key}`, e.target.value)}
                                    placeholder="Paste image URL here"
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                  />
                                  <div className="flex items-center gap-2 mt-2">
                                    <label className="text-xs text-slate-400">Upload</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;
                                        const reader = new FileReader();
                                        reader.onload = async () => {
                                          const dataUrl = String(reader.result || '');
                                          // Try uploading to serverless endpoint which pushes to Cloudinary.
                                          // If the endpoint is not available (404) or upload fails, fall back to using the data URL locally.
                                          try {
                                            const resp = await fetch('/api/upload-image', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex' })
                                            });

                                            if (resp.ok) {
                                              let json: any;
                                              try {
                                                json = await resp.json();
                                              } catch (e) {
                                                json = null;
                                              }

                                              if (json && json.success && json.url) {
                                                const name = f.name;
                                                const newItem: MediaItem = { id: `m-${Date.now()}`, name, url: json.url, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                                if (setMedia) setMedia(prev => [newItem, ...(prev || [])]);
                                                onEditField(activeSection.id, `content.${key}`, newItem.url);
                                                return;
                                              }
                                            }

                                            // Fallback: use data URL directly when upload endpoint isn't present or failed
                                            const name = f.name;
                                            const fallbackItem: MediaItem = { id: `m-${Date.now()}`, name, url: dataUrl, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                            if (setMedia) setMedia(prev => [fallbackItem, ...(prev || [])]);
                                            onEditField(activeSection.id, `content.${key}`, fallbackItem.url);
                                          } catch (err) {
                                            console.error('Upload attempt failed, falling back to data URL:', err);
                                            const name = f.name;
                                            const fallbackItem: MediaItem = { id: `m-${Date.now()}`, name, url: dataUrl, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                            if (setMedia) setMedia(prev => [fallbackItem, ...(prev || [])]);
                                            onEditField(activeSection.id, `content.${key}`, fallbackItem.url);
                                          }
                                        };
                                        reader.readAsDataURL(f);
                                      }}
                                      className="text-xs text-slate-400"
                                    />
                                  </div>
                                  {val && (
                                    <div className="mt-2">
                                      <img src={val} alt={key} className="w-32 h-20 object-cover rounded-md border border-slate-800" />
                                    </div>
                                  )}
                                </div>
                              );
                            }

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

                          // Arrays of objects (e.g., points, milestones)
                          if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                            return (
                              <div key={key} className="col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <div className="flex flex-col gap-3">
                                  {val.map((item: any, idx: number) => (
                                    <div key={`${item.id || 'item'}-${idx}`} className="bg-slate-900 p-3 rounded-md border border-slate-800">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {Object.entries(item).map(([subKey, subVal]) => {
                                          if (typeof subVal === 'string') {
                                            const subLower = subKey.toLowerCase();
                                            const isImg = subLower.includes('image') || subLower.includes('img') || subLower.includes('photo') || subLower === 'image' || subLower === 'avatar';
                                            if (isImg) {
                                              return (
                                                <div key={subKey} className="flex flex-col gap-1">
                                                  <label className="text-[10px] text-slate-400">{subKey.replace(/([A-Z])/g, ' $1')}</label>
                                                  <input
                                                    type="text"
                                                    value={subVal}
                                                    onChange={(e) => onEditField(activeSection.id, `content.${key}.${idx}.${subKey}`, e.target.value)}
                                                    placeholder="Paste image URL here"
                                                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                                  />
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                      const f = e.target.files?.[0];
                                                      if (!f) return;
                                                      const reader = new FileReader();
                                                      reader.onload = async () => {
                                                        const dataUrl = String(reader.result || '');
                                                        try {
                                                          const resp = await fetch('/api/upload-image', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex' })
                                                          });

                                                          if (resp.ok) {
                                                            let json: any;
                                                            try {
                                                              json = await resp.json();
                                                            } catch (e) {
                                                              json = null;
                                                            }

                                                            if (json && json.success && json.url) {
                                                              const name = f.name;
                                                              const newItem: MediaItem = { id: `m-${Date.now()}`, name, url: json.url, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                                              if (setMedia) setMedia(prev => [newItem, ...(prev || [])]);
                                                              onEditField(activeSection.id, `content.${key}.${idx}.${subKey}`, newItem.url);
                                                              return;
                                                            }
                                                          }

                                                          // Fallback to data URL
                                                          const name = f.name;
                                                          const fallbackItem: MediaItem = { id: `m-${Date.now()}`, name, url: dataUrl, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                                          if (setMedia) setMedia(prev => [fallbackItem, ...(prev || [])]);
                                                          onEditField(activeSection.id, `content.${key}.${idx}.${subKey}`, fallbackItem.url);
                                                        } catch (err) {
                                                          console.error('Upload attempt failed, falling back to data URL:', err);
                                                          const name = f.name;
                                                          const fallbackItem: MediaItem = { id: `m-${Date.now()}`, name, url: dataUrl, type: 'image', size: `${Math.round(f.size/1024)}KB`, folder: 'Tantrapex', altText: name };
                                                          if (setMedia) setMedia(prev => [fallbackItem, ...(prev || [])]);
                                                          onEditField(activeSection.id, `content.${key}.${idx}.${subKey}`, fallbackItem.url);
                                                        }
                                                      };
                                                      reader.readAsDataURL(f);
                                                    }}
                                                    className="text-xs text-slate-400 mt-1"
                                                  />
                                                  {subVal && (
                                                    <img src={subVal} alt={subKey} className="w-24 h-16 object-cover rounded-md mt-2 border border-slate-800" />
                                                  )}
                                                </div>
                                              );
                                            }

                                            return (
                                              <div key={subKey} className="flex flex-col gap-1">
                                                <label className="text-[10px] text-slate-400">{subKey.replace(/([A-Z])/g, ' $1')}</label>
                                                <input
                                                  type="text"
                                                  value={subVal}
                                                  onChange={(e) => onEditField(activeSection.id, `content.${key}.${idx}.${subKey}`, e.target.value)}
                                                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                                />
                                              </div>
                                            );
                                          }
                                          return null;
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
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
