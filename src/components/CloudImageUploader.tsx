import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, Link, Sparkles } from 'lucide-react';

interface CloudImageUploaderProps {
  label?: string;
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  folder?: 'products' | 'carousel' | 'heritage' | 'blog' | 'casks';
  presetOptions?: { label: string; url: string }[];
  helperText?: string;
}

export const CloudImageUploader: React.FC<CloudImageUploaderProps> = ({
  label = 'Asset Image (Google Cloud Storage)',
  currentImageUrl,
  onImageUploaded,
  folder = 'products',
  presetOptions = [],
  helperText = 'Upload high-resolution bottle or distillery imagery directly to Google Cloud Storage.'
}) => {
  const { uploadMedia, cloudSyncStatus } = useStore();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [inputUrl, setInputUrl] = useState<string>(currentImageUrl || '');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      const cloudUrl = await uploadMedia(file, folder);
      onImageUploaded(cloudUrl);
      setInputUrl(cloudUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Cloud Storage upload failed:', err);
      alert('Upload to Google Cloud Storage failed. Please check your network.');
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
            Cloud Upload
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
            onChange={onFileChange}
          />
          
          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2 text-amber-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading to Google Cloud Storage...</span>
            </div>
          ) : uploadSuccess ? (
            <div className="py-3 flex flex-col items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-xs font-semibold">Image Saved to Google Cloud Storage!</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-600/30 flex items-center justify-center text-amber-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-200">
                  Drop bottle/distillery photo here or <span className="text-amber-400 underline">browse files</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Synchronizes directly to Google Cloud Storage ({folder}/)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mode 2: Direct URL */}
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
              placeholder="https://images.unsplash.com/..."
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
        <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-900/80 border border-stone-800">
          <img
            src={currentImageUrl}
            alt="Asset Preview"
            className="w-12 h-12 rounded-lg object-cover bg-stone-950 border border-stone-800"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Current Asset URL</span>
            <p className="text-[11px] text-stone-300 truncate">{currentImageUrl}</p>
          </div>
        </div>
      )}

      {helperText && <p className="text-[10px] text-stone-500">{helperText}</p>}
    </div>
  );
};
