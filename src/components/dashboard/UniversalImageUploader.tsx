import React, { useState } from 'react';
import { Image, Loader2, Plus, UploadCloud, X, Check, RefreshCw } from 'lucide-react';

interface UniversalImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  className?: string;
}

export function UniversalImageUploader({ label, value, onChange, helperText, className = "" }: UniversalImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputId = React.useId();

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
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
      } catch (err: any) {
        console.error('Image upload failed:', err);
        window.alert(`Image upload failed: ${err.message || 'Please check network connection and try again.'}`);
      } finally {
        setUploading(false);
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
        onDrop={(e) => { 
          e.preventDefault(); 
          setDragActive(false); 
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); 
        }}
        className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-950/20' 
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
        }`}
      >
        <div className="h-16 w-16 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
          {value ? (
            <img 
              src={value} 
              alt="Preview" 
              className="h-full w-full object-contain rounded" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <Image className="h-6 w-6 text-slate-600" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">
                {uploading ? 'Uploading to Cloudinary...' : (value ? 'Image Uploaded' : 'Choose an image file')}
              </span>
              {value && !uploading && (
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-bold uppercase">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {uploading ? 'Processing and storing securely on Cloudinary...' : 'Supports JPG, PNG, WebP, SVG'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-center">
            <input 
              type="file" 
              accept="image/*"
              id={fileInputId}
              disabled={uploading}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              className="hidden"
            />
            <label 
              htmlFor={fileInputId} 
              className={`px-3.5 py-2 text-white font-bold text-xs rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow active:scale-95 text-center flex items-center gap-1.5 ${
                uploading
                  ? 'bg-slate-700 cursor-not-allowed opacity-70'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{value ? 'Change File' : 'Upload Image'}</span>
                </>
              )}
            </label>

            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-lg transition-colors border border-slate-700"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      {helperText && <p className="text-[10px] text-slate-400 italic mt-0.5">{helperText}</p>}
    </div>
  );
}

export function UniversalImageUploaderLight({ label, value, onChange, helperText, className = "" }: UniversalImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputId = React.useId();

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
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
      } catch (err: any) {
        console.error('Image upload failed:', err);
        window.alert(`Image upload failed: ${err.message || 'Please check network connection and try again.'}`);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setDragActive(false); 
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); 
        }}
        className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
          dragActive 
            ? 'border-[#2e6c00] bg-emerald-50' 
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <div className="h-16 w-16 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs p-1">
          {value ? (
            <img 
              src={value} 
              alt="Preview" 
              className="h-full w-full object-contain rounded" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <Image className="h-6 w-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">
                {uploading ? 'Uploading to Cloudinary...' : (value ? 'Image Uploaded' : 'Choose an image file')}
              </span>
              {value && !uploading && (
                <span className="text-[10px] bg-emerald-50 text-[#2e6c00] border border-emerald-200 px-1.5 py-0.2 rounded font-bold uppercase">
                  Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {uploading ? 'Uploading file directly to Cloudinary CDN...' : 'Direct upload — no image link needed'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-center">
            <input 
              type="file" 
              accept="image/*"
              id={fileInputId}
              disabled={uploading}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              className="hidden"
            />
            <label 
              htmlFor={fileInputId} 
              className={`px-3.5 py-2 text-white font-bold text-xs rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow-xs active:scale-95 text-center flex items-center gap-1.5 ${
                uploading
                  ? 'bg-slate-400 cursor-not-allowed opacity-70'
                  : 'bg-[#2e6c00] hover:bg-[#255700]'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{value ? 'Change Image' : 'Upload Image'}</span>
                </>
              )}
            </label>

            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors border border-slate-200"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      {helperText && <p className="text-[10px] text-slate-500 italic mt-0.5">{helperText}</p>}
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
            resolve(null);
            return;
          }

          const json = await resp.json();
          if (json && json.success && json.url) {
            resolve(json.url);
          } else {
            resolve(null);
          }
        } catch {
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
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#2e6c00] shadow-xs">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <div className="font-sans">
          {uploading ? (
            <div className="flex flex-col gap-1 items-center">
              <span className="font-bold text-slate-800 text-sm">Uploading your files...</span>
              <span className="text-xs text-[#2e6c00] font-medium">Processing {uploadProgressIndex} of {uploadQueueLength} images</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800 text-sm">Drag &amp; drop photos here</span>
              <span className="text-xs text-slate-500">or click below to choose files from your device</span>
            </div>
          )}
        </div>

        {!uploading && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
            <label 
              htmlFor={fileInputId} 
              className="px-4 py-2 bg-[#111111] hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow-xs active:scale-95 text-center flex items-center gap-1.5 font-sans"
            >
              <Plus className="h-4 w-4 text-[#80d64b]" />
              <span>Select Image Files</span>
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

      {helperText && <p className="text-[10px] text-slate-400 italic mt-0.5">{helperText}</p>}
    </div>
  );
}
