import React, { useState } from 'react';
import { Image, Loader2, Plus, UploadCloud, X, Link } from 'lucide-react';

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

        if (!resp.ok) {
          const json = await resp.json().catch(() => null);
          throw new Error(json?.message || 'Cloudinary upload failed.');
        }

        const json = await resp.json();
        if (json && json.success && json.url) {
          onChange(json.url);
          return;
        }

        throw new Error('Upload did not return a Cloudinary URL.');
      } catch (err) {
        console.error('Image upload failed:', err);
        window.alert('Image upload failed. Please check Cloudinary configuration and try again.');
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

        if (!resp.ok) {
          const json = await resp.json().catch(() => null);
          throw new Error(json?.message || 'Cloudinary upload failed.');
        }

        const json = await resp.json();
        if (json && json.success && json.url) {
          onChange(json.url);
          return;
        }

        throw new Error('Upload did not return a Cloudinary URL.');
      } catch (err) {
        console.error('Image upload failed:', err);
        window.alert('Image upload failed. Please check Cloudinary configuration and try again.');
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

interface UniversalMultiImageUploaderProps {
  label: string;
  onImagesUploaded: (urls: string[]) => void;
  helperText?: string;
  className?: string;
}

export function UniversalMultiImageUploader({ label, onImagesUploaded, helperText, className = "" }: UniversalMultiImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadQueueLength, setUploadQueueLength] = useState(0);
  const [uploadProgressIndex, setUploadProgressIndex] = useState(0);
  const [pastedUrls, setPastedUrls] = useState('');
  const fileInputId = React.useId();

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        try {
          const resp = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataUrl, folder: 'Tantrapex' })
          });

          if (!resp.ok) {
            const json = await resp.json().catch(() => null);
            console.error('Upload failed:', json?.message || 'Error');
            resolve(null);
            return;
          }

          const json = await resp.json();
          if (json && json.success && json.url) {
            resolve(json.url);
          } else {
            resolve(null);
          }
        } catch (err) {
          console.error('Image upload failed:', err);
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadQueueLength(files.length);
    setUploadProgressIndex(0);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProgressIndex(i + 1);
      const url = await uploadSingleFile(files[i]);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onImagesUploaded(uploadedUrls);
    }
    
    setUploading(false);
    setUploadQueueLength(0);
    setUploadProgressIndex(0);
  };

  const handlePasteUrls = () => {
    if (!pastedUrls.trim()) return;
    // Split by commas, newlines, or whitespace
    const urls = pastedUrls
      .split(/[\n,]+/)
      .map(url => url.trim())
      .filter(url => url.startsWith('http://') || url.startsWith('https://'));

    if (urls.length > 0) {
      onImagesUploaded(urls);
      setPastedUrls('');
    } else {
      alert('No valid image URLs found. Make sure they start with http:// or https://');
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setDragActive(false); 
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); 
        }}
        className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center gap-3 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50/40' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/50'
        }`}
      >
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <div className="font-sans">
          {uploading ? (
            <div className="flex flex-col gap-1 items-center">
              <span className="font-bold text-slate-800 text-sm">Uploading your photos...</span>
              <span className="text-xs text-blue-600 font-medium">Processing {uploadProgressIndex} of {uploadQueueLength} images</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800 text-sm">Drag & drop multiple photos here</span>
              <span className="text-xs text-slate-500">or click below to browse from your device</span>
            </div>
          )}
        </div>

        {!uploading && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
            <label 
              htmlFor={fileInputId} 
              className="px-4 py-2 bg-[#071B4D] hover:bg-slate-900 text-white font-bold text-xs rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow active:scale-95 text-center flex items-center gap-1.5 font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Select Multiple Files</span>
            </label>
            <input 
              type="file" 
              accept="image/*"
              multiple
              id={fileInputId}
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Paste multiple URLs section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3 font-sans mt-1 shadow-sm">        <div className="flex items-center gap-1.5">
          <Link className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Paste Multiple Photo URLs</span>
        </div>
        <textarea
          rows={2}
          placeholder="Paste one or more direct image URLs here, separated by a comma or a new line (e.g. https://images.unsplash.com/...)"
          value={pastedUrls}
          onChange={(e) => setPastedUrls(e.target.value)}
          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono placeholder:text-slate-400 leading-normal"
        />
        <button
          type="button"
          onClick={handlePasteUrls}
          disabled={!pastedUrls.trim()}
          className={`self-end flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all ${
            pastedUrls.trim() 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow active:scale-95 cursor-pointer' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add URLs to Gallery</span>
        </button>
      </div>

      {helperText && <p className="text-[10px] text-slate-400 italic mt-0.5">{helperText}</p>}
    </div>
  );
}
