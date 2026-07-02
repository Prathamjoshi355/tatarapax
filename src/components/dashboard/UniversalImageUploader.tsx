import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface UniversalImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  className?: string;
}

export function UniversalImageUploader({ label, value, onChange, helperText, className = "" }: UniversalImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputId = React.useId();

  const handleFile = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      try {
        const resp = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex' })
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.success && json.url) {
            onChange(json.url);
            return;
          }
        }
        onChange(dataUrl);
      } catch (err) {
        console.error('Image upload failed, using dataUrl fallback', err);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-950/20' 
            : 'border-slate-750 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
        }`}
      >
        <div className="h-14 w-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
          {value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=80'; }} />
          ) : (
            <Image className="h-5 w-5 text-slate-500" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label 
              htmlFor={fileInputId} 
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded cursor-pointer uppercase tracking-wider transition-all shadow active:scale-95 text-center block"
            >
              Upload Image File
            </label>
            <input 
              type="file" 
              accept="image/*"
              id={fileInputId}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              className="hidden"
            />
            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">or Drag and Drop here</span>
          </div>
          
          <input 
            type="text"
            placeholder="Or paste direct image URL (e.g. Unsplash or Imgur link)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2.5 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded text-[11px] text-slate-300 focus:outline-none focus:border-blue-500 w-full font-mono placeholder:text-slate-600"
          />
        </div>
      </div>
      {helperText && <p className="text-[10px] text-slate-500 italic mt-0.5">{helperText}</p>}
    </div>
  );
}

export function UniversalImageUploaderLight({ label, value, onChange, helperText, className = "" }: UniversalImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputId = React.useId();

  const handleFile = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      try {
        const resp = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex' })
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.success && json.url) {
            onChange(json.url);
            return;
          }
        }
        onChange(dataUrl);
      } catch (err) {
        console.error('Image upload failed, using dataUrl fallback', err);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/50'
        }`}
      >
        <div className="h-14 w-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
          {value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=80'; }} />
          ) : (
            <Image className="h-5 w-5 text-slate-400" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label 
              htmlFor={fileInputId} 
              className="px-3 py-1.5 bg-[#071B4D] hover:bg-slate-900 text-white font-bold text-[10px] rounded cursor-pointer uppercase tracking-wider transition-all shadow active:scale-95 text-center block"
            >
              Upload Image
            </label>
            <input 
              type="file" 
              accept="image/*"
              id={fileInputId}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              className="hidden"
            />
            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">or Drag and Drop here</span>
          </div>
          
          <input 
            type="text"
            placeholder="Or paste direct image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full font-mono placeholder:text-slate-300"
          />
        </div>
      </div>
      {helperText && <p className="text-[10px] text-slate-400 italic mt-0.5">{helperText}</p>}
    </div>
  );
}
