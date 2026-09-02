import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CompanyDetails } from '../../types';
import { CloudImageUploader } from '../CloudImageUploader';
import { initialCompanyDetails } from '../../data/initialLetterheadData';
import {
  Building2,
  FileCheck,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sliders,
  Eye,
  CheckCircle2,
  RotateCcw,
  Save,
  Crown,
  Sparkles,
  Wine,
  Flame,
  Shield,
  Award,
  Feather,
  Stamp,
  HelpCircle,
  Hash,
  FileText,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface CompanyDetailsTabProps {
  onGoToComposer?: () => void;
}

export const CompanyDetailsTab: React.FC<CompanyDetailsTabProps> = ({ onGoToComposer }) => {
  const { companyDetails, updateCompanyDetails } = useStore();

  const [formData, setFormData] = useState<CompanyDetails>(() => ({
    ...initialCompanyDetails,
    ...companyDetails
  }));

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [previewPaperStyle, setPreviewPaperStyle] = useState<'parchment' | 'ivory' | 'modern'>('parchment');

  const presetLogos = [
    {
      label: 'Vintage Amber Cask Logo',
      url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: 'Distillery Heritage Copper Emblem',
      url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: 'Oak Cask Cellar Monogram',
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleFieldChange = <K extends keyof CompanyDetails>(key: K, value: CompanyDetails[K]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    await updateCompanyDetails(formData);
    setIsSaved(true);
    setSaveMessage('Company & legal details successfully saved and synced across all letterheads.');
    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage('');
    }, 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all company and legal details to default settings?')) {
      setFormData(initialCompanyDetails);
      updateCompanyDetails(initialCompanyDetails);
      setIsSaved(true);
      setSaveMessage('Reset to default company credentials.');
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage('');
      }, 3000);
    }
  };

  // Background styling for preview
  const paperStyles = {
    parchment: {
      bg: '#fcf8f0',
      text: '#292524',
      border: '#d97706',
      accent: '#78350f',
      subtext: '#57534e'
    },
    ivory: {
      bg: '#fafaf9',
      text: '#1c1917',
      border: '#a8a29e',
      accent: '#292524',
      subtext: '#57534e'
    },
    modern: {
      bg: '#ffffff',
      text: '#0f172a',
      border: '#cbd5e1',
      accent: '#0f172a',
      subtext: '#475569'
    }
  };

  const currentStyle = paperStyles[previewPaperStyle];

  return (
    <div className="space-y-6">
      {/* Save Toast */}
      {isSaved && saveMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs sm:text-sm shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{saveMessage}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-900/40 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              Company & Statutory Registry Credentials
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                CIN • GSTIN • Logo
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Configure your registered company name, corporate logo, CIN number, GSTIN, and statutory distillery details. These automatically populate on official letterheads and deeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[42px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer min-h-[42px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Details</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: FORM SETTINGS (7 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Entity Name & Branding */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                1. Corporate Entity & Brand Name
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Registered Corporate Legal Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => handleFieldChange('companyName', e.target.value)}
                  placeholder="e.g. Zooka's Unity Spirits Private Limited"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  The official incorporated entity name for statutory documents and tax records.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Trade / Brand Name
                </label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={e => handleFieldChange('tradeName', e.target.value)}
                  placeholder="e.g. Zooka's Unity Spirits Distillery"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Brand Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => handleFieldChange('tagline', e.target.value)}
                  placeholder="e.g. Artisanal Speyside Single Malts & Rare Casks"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Custom Logo & Visual Insignia */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                  2. Custom Logo & Crest Header
                </h3>
              </div>
              <span className="text-xs text-amber-400/80 font-mono">Letterhead Insignia</span>
            </div>

            {/* Logo Display Mode */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-2">
                Logo Style on Letterhead
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange('logoType', 'custom_image')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    formData.logoType === 'custom_image'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Custom Image Only
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('logoType', 'both')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    formData.logoType === 'both'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Both (Logo & Crest)
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('logoType', 'distillery_crest')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    formData.logoType === 'distillery_crest'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Heraldic Crest Only
                </button>
              </div>
            </div>

            {/* Header Layout Alignment: Left Row vs Centered */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-2">
                Header Layout & Alignment
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange('headerLogoLayout', 'left_aligned_row')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    (formData.headerLogoLayout ?? 'left_aligned_row') === 'left_aligned_row'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Logo on Left (Same Row)
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('headerLogoLayout', 'centered_stack')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    formData.headerLogoLayout === 'centered_stack'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Centered Stack
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                {(formData.headerLogoLayout ?? 'left_aligned_row') === 'left_aligned_row'
                  ? 'Logo is positioned on the left with company name, address & registration numbers aligned in the same row.'
                  : 'Logo is centered on top with company details stacked below.'}
              </p>
            </div>

            {/* Cloud Image Uploader */}
            <div className="space-y-3 pt-2">
              <CloudImageUploader
                label="Upload Local Company Logo (PNG / SVG / JPG / WebP)"
                currentImageUrl={formData.logoUrl || ''}
                onImageUploaded={url => {
                  handleFieldChange('logoUrl', url);
                  if (formData.logoType === 'distillery_crest') {
                    handleFieldChange('logoType', 'custom_image');
                  }
                }}
                onClear={() => {
                  handleFieldChange('logoUrl', '');
                }}
                folder="products"
                presetOptions={presetLogos}
                helperText="Upload your official high-res brand logo from your device. Synchronized with letterhead header."
              />

              {/* Logo Width Slider */}
              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-300 font-medium">Header Logo Width:</span>
                  <span className="text-amber-400 font-mono font-bold">{formData.logoWidth || 120}px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="260"
                  step="5"
                  value={formData.logoWidth || 120}
                  onChange={e => handleFieldChange('logoWidth', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600 mt-1 font-mono">
                  <span>60px (Compact)</span>
                  <span>120px (Standard)</span>
                  <span>260px (Prominent)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Registration (CIN, GSTIN, PAN, Excise) */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                3. Statutory Identification Numbers (CIN / GSTIN / PAN / Excise)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CIN */}
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center justify-between">
                  <span>CIN (Corporate Identity Number)</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">MCA / ROC</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.cin}
                    onChange={e => handleFieldChange('cin', e.target.value.toUpperCase())}
                    placeholder="e.g. U15549DL2024PTC392810"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm font-mono text-amber-300 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  21-digit alphanumeric corporate registration code.
                </p>
              </div>

              {/* GSTIN */}
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center justify-between">
                  <span>GSTIN / GST Number</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Tax Registry</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={e => handleFieldChange('gstin', e.target.value.toUpperCase())}
                    placeholder="e.g. 07AAAAZ8821A1Z9"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm font-mono text-amber-300 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  15-digit Goods & Services Tax Identification Number.
                </p>
              </div>

              {/* PAN */}
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center justify-between">
                  <span>PAN (Permanent Account Number)</span>
                  <span className="text-[10px] text-stone-500 font-mono">Income Tax</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.pan}
                    onChange={e => handleFieldChange('pan', e.target.value.toUpperCase())}
                    placeholder="e.g. AAAAZ8821A"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm font-mono text-amber-300 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Excise & Bond License */}
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center justify-between">
                  <span>Distillery Excise / Bond License</span>
                  <span className="text-[10px] text-stone-500 font-mono">Customs & Bond</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.exciseLicense}
                    onChange={e => handleFieldChange('exciseLicense', e.target.value)}
                    placeholder="e.g. SCOT-EXCISE-BW-8841-B"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm font-mono text-amber-300 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Registered Address & Cellars */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                4. Registered Addresses & Distillery Estate
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Registered Corporate Office Address <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.registeredAddress}
                  onChange={e => handleFieldChange('registeredAddress', e.target.value)}
                  placeholder="e.g. Suite 402, Royal Speyside Tower, Craigellachie AB38 9RR, Scotland, UK"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Distillery Cellars / Bonded Estate Location (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.distilleryAddress}
                  onChange={e => handleFieldChange('distilleryAddress', e.target.value)}
                  placeholder="e.g. Unity Glen Distillery Estate, Glenlivet Estate, Moray AB37 9DD"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Official Contact & Digital Channels */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <Globe className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                5. Communication Channels
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleFieldChange('email', e.target.value)}
                    placeholder="e.g. vault@zookasunityspirits.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Official Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => handleFieldChange('phone', e.target.value)}
                    placeholder="e.g. +44 (0) 1340 882 100"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Official Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={e => handleFieldChange('website', e.target.value)}
                    placeholder="e.g. https://zookasunityspirits.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">VIP Concierge / Support</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={formData.supportPhone || ''}
                    onChange={e => handleFieldChange('supportPhone', e.target.value)}
                    placeholder="e.g. +44 (0) 1340 882 400"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Letterhead Display Visibility Toggles */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wide">
                6. Letterhead Header Visibility Toggles
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show CIN (Corporate Identity No.)</span>
                <input
                  type="checkbox"
                  checked={formData.showCinOnLetterhead}
                  onChange={e => handleFieldChange('showCinOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show GSTIN (GST Number)</span>
                <input
                  type="checkbox"
                  checked={formData.showGstOnLetterhead}
                  onChange={e => handleFieldChange('showGstOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show PAN on Letterhead</span>
                <input
                  type="checkbox"
                  checked={formData.showPanOnLetterhead}
                  onChange={e => handleFieldChange('showPanOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show Excise & Bond License</span>
                <input
                  type="checkbox"
                  checked={formData.showExciseOnLetterhead}
                  onChange={e => handleFieldChange('showExciseOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show Registered Office Address</span>
                <input
                  type="checkbox"
                  checked={formData.showAddressOnLetterhead}
                  onChange={e => handleFieldChange('showAddressOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Show Email & Phone Contacts</span>
                <input
                  type="checkbox"
                  checked={formData.showContactOnLetterhead}
                  onChange={e => handleFieldChange('showContactOnLetterhead', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE LETTERHEAD PREVIEW (5 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            {/* Top preview control bar */}
            <div className="flex items-center justify-between bg-stone-900 p-3 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">Letterhead Header Live Preview</span>
              </div>
              <div className="flex items-center gap-1 bg-stone-950 p-0.5 rounded-lg border border-stone-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPreviewPaperStyle('parchment')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    previewPaperStyle === 'parchment' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Parchment
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPaperStyle('ivory')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    previewPaperStyle === 'ivory' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Ivory
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPaperStyle('modern')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    previewPaperStyle === 'modern' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Clean
                </button>
              </div>
            </div>

            {/* Live Stationery Preview Card */}
            <div
              className="p-6 rounded-xl shadow-2xl transition-all relative overflow-hidden"
              style={{
                backgroundColor: currentStyle.bg,
                color: currentStyle.text,
                fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                border: `2px solid ${currentStyle.border}`
              }}
            >
              {/* Corner Emblems */}
              <div className="absolute top-2 left-2 text-amber-800/40 text-xs">✦</div>
              <div className="absolute top-2 right-2 text-amber-800/40 text-xs">✦</div>

              {/* Watermark preview */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
                <span className="font-serif font-black text-6xl tracking-widest uppercase text-amber-900">
                  {formData.tradeName || 'ZOOKAS'}
                </span>
              </div>

              {/* HEADER CONTENT */}
              {(formData.headerLogoLayout ?? 'left_aligned_row') === 'left_aligned_row' ? (
                /* === ROW LAYOUT: LOGO ON LEFT, COMPANY DETAILS ALIGNED IN SAME ROW === */
                <div className="relative z-10 flex flex-row items-center gap-4 sm:gap-5 pb-5 border-b-2 text-left" style={{ borderColor: currentStyle.border }}>
                  {/* Left Side: Logo & Crest */}
                  <div className="shrink-0 flex flex-col items-center justify-center">
                    {/* Crest Icon if enabled */}
                    {(formData.logoType === 'distillery_crest' || formData.logoType === 'both') && (
                      <div
                        className="p-2 rounded-full border border-amber-600/40 bg-amber-600/10 inline-flex items-center justify-center mb-1.5"
                        style={{ color: currentStyle.accent }}
                      >
                        <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}

                    {/* Custom Logo Image if enabled */}
                    {(formData.logoType === 'custom_image' || formData.logoType === 'both') && formData.logoUrl && (
                      <div className="flex items-center justify-center">
                        <img
                          src={formData.logoUrl}
                          alt="Company Logo"
                          referrerPolicy="no-referrer"
                          className="object-contain max-h-20 sm:max-h-24 transition-all"
                          style={{ width: `${Math.min(formData.logoWidth || 110, 150)}px` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Side (Same Row): Company Name, Slogan, Addresses & Statutory Badges */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Company Legal Name */}
                    <h1
                      className="text-lg sm:text-2xl font-serif font-black tracking-wider uppercase m-0 leading-tight"
                      style={{ color: currentStyle.accent }}
                    >
                      {formData.companyName || "Zooka's Unity Spirits Private Limited"}
                    </h1>

                    {/* Trade / Brand Name */}
                    {formData.tradeName && formData.tradeName !== formData.companyName && (
                      <div className="text-xs font-semibold tracking-wide opacity-90">
                        {formData.tradeName}
                      </div>
                    )}

                    {/* Tagline */}
                    {formData.tagline && (
                      <p className="text-xs italic tracking-wide opacity-85 m-0">
                        {formData.tagline}
                      </p>
                    )}

                    {/* Registered Address */}
                    {formData.showAddressOnLetterhead && formData.registeredAddress && (
                      <div className="text-[10.5px] sm:text-[11px] leading-relaxed opacity-90 pt-0.5" style={{ color: currentStyle.subtext }}>
                        <span className="font-semibold">Registered Office:</span> {formData.registeredAddress}
                      </div>
                    )}

                    {/* Statutory Badges Bar: CIN, GSTIN, PAN, Excise */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono">
                      {formData.showCinOnLetterhead && formData.cin && (
                        <span
                          className="px-2 py-0.5 rounded border font-semibold"
                          style={{
                            backgroundColor: 'rgba(217, 119, 6, 0.08)',
                            borderColor: currentStyle.border,
                            color: currentStyle.accent
                          }}
                        >
                          CIN: {formData.cin}
                        </span>
                      )}

                      {formData.showGstOnLetterhead && formData.gstin && (
                        <span
                          className="px-2 py-0.5 rounded border font-semibold"
                          style={{
                            backgroundColor: 'rgba(217, 119, 6, 0.08)',
                            borderColor: currentStyle.border,
                            color: currentStyle.accent
                          }}
                        >
                          GSTIN: {formData.gstin}
                        </span>
                      )}

                      {formData.showPanOnLetterhead && formData.pan && (
                        <span
                          className="px-2 py-0.5 rounded border font-semibold"
                          style={{
                            backgroundColor: 'rgba(217, 119, 6, 0.08)',
                            borderColor: currentStyle.border,
                            color: currentStyle.accent
                          }}
                        >
                          PAN: {formData.pan}
                        </span>
                      )}

                      {formData.showExciseOnLetterhead && formData.exciseLicense && (
                        <span
                          className="px-2 py-0.5 rounded border font-semibold"
                          style={{
                            backgroundColor: 'rgba(217, 119, 6, 0.08)',
                            borderColor: currentStyle.border,
                            color: currentStyle.accent
                          }}
                        >
                          EXCISE: {formData.exciseLicense}
                        </span>
                      )}
                    </div>

                    {/* Contact Bar */}
                    {formData.showContactOnLetterhead && (
                      <div className="text-[10px] opacity-80 pt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        {formData.phone && <span>Tel: {formData.phone}</span>}
                        {formData.email && <span>Email: {formData.email}</span>}
                        {formData.website && <span>Web: {formData.website.replace(/^https?:\/\//, '')}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* === STACKED CENTERED LAYOUT === */
                <div className="relative z-10 text-center space-y-3 pb-5 border-b-2" style={{ borderColor: currentStyle.border }}>
                  {/* Logo & Crest Container */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    {(formData.logoType === 'distillery_crest' || formData.logoType === 'both') && (
                      <div
                        className="p-2 rounded-full border border-amber-600/40 bg-amber-600/10 inline-flex items-center justify-center"
                        style={{ color: currentStyle.accent }}
                      >
                        <Crown className="w-6 h-6" />
                      </div>
                    )}

                    {(formData.logoType === 'custom_image' || formData.logoType === 'both') && formData.logoUrl && (
                      <div className="my-1 flex justify-center">
                        <img
                          src={formData.logoUrl}
                          alt="Company Logo"
                          referrerPolicy="no-referrer"
                          className="object-contain max-h-24 transition-all"
                          style={{ width: `${formData.logoWidth || 120}px` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <h1
                      className="text-xl sm:text-2xl font-serif font-black tracking-wider uppercase m-0 leading-tight"
                      style={{ color: currentStyle.accent }}
                    >
                      {formData.companyName || "Zooka's Unity Spirits Private Limited"}
                    </h1>

                    {formData.tradeName && formData.tradeName !== formData.companyName && (
                      <div className="text-xs font-semibold tracking-wide mt-0.5 opacity-90">
                        {formData.tradeName}
                      </div>
                    )}

                    {formData.tagline && (
                      <p className="text-xs italic tracking-wide opacity-85 mt-1 m-0">
                        {formData.tagline}
                      </p>
                    )}
                  </div>

                  {/* Registered Address */}
                  {formData.showAddressOnLetterhead && formData.registeredAddress && (
                    <div className="text-[11px] leading-relaxed opacity-90 max-w-md mx-auto" style={{ color: currentStyle.subtext }}>
                      <span className="font-semibold">Registered Office:</span> {formData.registeredAddress}
                    </div>
                  )}

                  {/* Statutory Badges Bar: CIN, GSTIN, PAN, Excise */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono">
                    {formData.showCinOnLetterhead && formData.cin && (
                      <span
                        className="px-2 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.08)',
                          borderColor: currentStyle.border,
                          color: currentStyle.accent
                        }}
                      >
                        CIN: {formData.cin}
                      </span>
                    )}

                    {formData.showGstOnLetterhead && formData.gstin && (
                      <span
                        className="px-2 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.08)',
                          borderColor: currentStyle.border,
                          color: currentStyle.accent
                        }}
                      >
                        GSTIN: {formData.gstin}
                      </span>
                    )}

                    {formData.showPanOnLetterhead && formData.pan && (
                      <span
                        className="px-2 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.08)',
                          borderColor: currentStyle.border,
                          color: currentStyle.accent
                        }}
                      >
                        PAN: {formData.pan}
                      </span>
                    )}

                    {formData.showExciseOnLetterhead && formData.exciseLicense && (
                      <span
                        className="px-2 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.08)',
                          borderColor: currentStyle.border,
                          color: currentStyle.accent
                        }}
                      >
                        EXCISE: {formData.exciseLicense}
                      </span>
                    )}
                  </div>

                  {/* Contact Bar */}
                  {formData.showContactOnLetterhead && (
                    <div className="text-[10px] opacity-80 pt-1 flex flex-wrap justify-center gap-x-3 gap-y-1">
                      {formData.phone && <span>Tel: {formData.phone}</span>}
                      {formData.email && <span>Email: {formData.email}</span>}
                      {formData.website && <span>Web: {formData.website.replace(/^https?:\/\//, '')}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Sample Body Demonstration */}
              <div className="py-6 text-xs space-y-2 opacity-70">
                <div className="flex justify-between border-b border-dashed pb-2 text-[10px]">
                  <span>Ref: <strong>ZUK-CORP-2026-0881</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
                </div>
                <p className="leading-relaxed italic text-[11px] pt-2">
                  "This official preview verifies that your company logo, registered corporate address, CIN, GSTIN, and statutory credentials render crisply on all digital letters, cask ownership deeds, and dispatch records."
                </p>
              </div>

              {/* Sample Footer */}
              <div className="pt-3 border-t border-dashed text-center text-[9px] opacity-60 italic">
                {formData.footerNoticeText || "Confidential & Statutory Bonded Records • Zooka's Unity Spirits Pvt. Ltd."}
              </div>
            </div>

            {/* Quick Action Navigation */}
            {onGoToComposer && (
              <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl flex items-center justify-between">
                <div className="text-xs text-stone-300">
                  Ready to test with active documents?
                </div>
                <button
                  type="button"
                  onClick={onGoToComposer}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Composer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
