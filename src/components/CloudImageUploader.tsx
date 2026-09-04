import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, Link, Sparkles, X, RefreshCw, HardDrive, Search } from 'lucide-react';
import { optimizeImageFile } from '../lib/firebase';

interface CloudImageUploaderProps {
  label?: string;
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  folder?: 'products' | 'carousel' | 'heritage' | 'blog' | 'casks';
  presetOptions?: { label: string; url: string }[];
  helperText?: string;
  onClear?: () => void;
}

export const CloudImageUploader: React.FC<CloudImageUploaderProps> = ({
  label = 'Asset Image (Google Cloud Storage)',
  currentImageUrl,
  onImageUploaded,
  folder = 'products',
  presetOptions = [],
  helperText = 'Upload high-resolution bottle, brand logo, or distillery imagery.',
  onClear
}) => {
  const { uploadMedia, driveAssets } = useStore();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [mode, setMode] = useState<'upload' | 'drive' | 'url' | 'presets'>('upload');
  const [inputUrl, setInputUrl] = useState<string>(currentImageUrl || '');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [driveFilter, setDriveFilter] = useState<string>('all');
  const [driveSearch, setDriveSearch] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(currentImageUrl || '');
  }, [currentImageUrl]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    setErrorMessage('');
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const resultUrl = await uploadMedia(file, folder);
      if (resultUrl) {
        onImageUploaded(resultUrl);
        setInputUrl(resultUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      }
    } catch (err) {
      console.warn('Upload fallback note:', err);
      try {
        const optimized = await optimizeImageFile(file, folder === 'logos' ? 450 : 850, 0.82);
        if (optimized.dataUrl) {
          onImageUploaded(optimized.dataUrl);
          setInputUrl(optimized.dataUrl);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3500);
        }
      } catch {
        setErrorMessage('Could not process image file. Please try another image.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setInputUrl('');
    onImageUploaded('');
    if (onClear) onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredDriveAssets = driveAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(driveSearch.toLowerCase());
    const matchesTag = driveFilter === 'all' || asset.tag === driveFilter;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{label}</span>
        </label>
        
        {/* Toggle Mode Buttons */}
        <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
              mode === 'upload' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('drive')}
            className={`px-2 py-0.5 rounded font-medium transition cursor-pointer flex items-center gap-1 ${
              mode === 'drive' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Drive ({driveAssets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
              mode === 'url' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Direct URL
          </button>
          {presetOptions.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                mode === 'presets' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Presets
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-2 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Mode 1: Cloud Storage File Drag & Drop Upload */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? 'border-amber-400 bg-amber-950/20'
              : 'border-stone-700 hover:border-amber-500/60 bg-stone-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onClick={(e) => e.stopPropagation()}
            onChange={onFileChange}
          />
          
          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2 text-amber-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Processing & Optimizing Image...</span>
            </div>
          ) : uploadSuccess ? (
            <div className="py-3 flex flex-col items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-xs font-semibold">Image Ready & Applied!</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-600/30 flex items-center justify-center text-amber-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-200">
                  Drop image file here or <span className="text-amber-400 underline">browse device files</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Supports PNG, JPG, WebP, SVG • Automatically optimized for web & print
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mode 2: Media Drive Assets Library */}
      {mode === 'drive' && (
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-500" />
              <input
                type="text"
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                placeholder="Filter Drive assets..."
                className="w-full pl-7 pr-2 py-1 text-[11px] bg-stone-900 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
              {['all', 'products', 'logos', 'banners', 'heritage', 'casks'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDriveFilter(tag)}
                  className={`px-2 py-0.5 rounded capitalize transition whitespace-nowrap cursor-pointer ${
                    driveFilter === tag
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredDriveAssets.length === 0 ? (
            <div className="py-6 text-center text-stone-500 text-xs">
              <HardDrive className="w-6 h-6 mx-auto mb-1 text-stone-600" />
              <span>No matching Drive assets found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredDriveAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onImageUploaded(asset.url);
                    setInputUrl(asset.url);
                  }}
                  className={`group relative aspect-square rounded-lg overflow-hidden border p-1 bg-stone-900 transition text-left cursor-pointer ${
                    currentImageUrl === asset.url
                      ? 'border-amber-400 ring-2 ring-amber-500/40 bg-amber-950/20'
                      : 'border-stone-800 hover:border-stone-600'
                  }`}
                  title={asset.name}
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-stone-950/85 px-1 py-0.5 text-[8px] text-stone-300 truncate text-center font-medium block">
                    {asset.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Direct URL */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                onImageUploaded(e.target.value);
              }}
              placeholder="https://..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Mode 3: Preset Options */}
      {mode === 'presets' && presetOptions.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {presetOptions.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onImageUploaded(preset.url);
                setInputUrl(preset.url);
              }}
              className={`group relative aspect-video rounded-lg overflow-hidden border transition text-left cursor-pointer ${
                currentImageUrl === preset.url
                  ? 'border-amber-400 ring-2 ring-amber-500/40'
                  : 'border-stone-800 hover:border-stone-600'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 px-1 py-0.5 text-[9px] text-stone-300 truncate text-center font-medium">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Current Preview */}
      {currentImageUrl && (
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentImageUrl}
              alt="Asset Preview"
              className="w-12 h-12 rounded-lg object-contain bg-stone-950 border border-stone-800 p-1"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Current Active Logo</span>
              <p className="text-[11px] text-stone-300 truncate max-w-xs">
                {currentImageUrl.startsWith('data:') ? 'Custom Uploaded Local Image' : currentImageUrl}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-950 hover:bg-red-950/40 text-stone-400 hover:text-red-300 border border-stone-800 hover:border-red-800/60 rounded-lg text-xs transition cursor-pointer"
            title="Remove Logo"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      )}

      {helperText && <p className="text-[10px] text-stone-500">{helperText}</p>}
    </div>
  );
};
