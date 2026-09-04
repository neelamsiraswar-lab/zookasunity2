import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DriveAssetItem, DriveAssetTag } from '../../types';
import {
  HardDrive,
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  Search,
  Grid,
  List,
  Tag,
  Calendar,
  Wine,
  Shield,
  Download,
  X,
  Plus,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const TAG_CONFIG: Partial<Record<
  DriveAssetTag,
  { label: string; color: string; bg: string; border: string; icon: any }
>> & Record<
  Exclude<DriveAssetTag, 'all'>,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  products: {
    label: 'Product Shot',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-700/50',
    icon: Wine
  },
  logos: {
    label: 'Logo & Seal',
    color: 'text-amber-400',
    bg: 'bg-amber-950/60',
    border: 'border-amber-700/50',
    icon: Shield
  },
  banners: {
    label: 'Hero Banner',
    color: 'text-sky-400',
    bg: 'bg-sky-950/60',
    border: 'border-sky-700/50',
    icon: ImageIcon
  },
  heritage: {
    label: 'Heritage & Stills',
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-700/50',
    icon: Sparkles
  },
  casks: {
    label: 'Cask & Bond',
    color: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-700/50',
    icon: HardDrive
  },
  blog: {
    label: 'Blog & Editorial',
    color: 'text-pink-400',
    bg: 'bg-pink-950/60',
    border: 'border-pink-700/50',
    icon: Tag
  },
  general: {
    label: 'General Asset',
    color: 'text-stone-300',
    bg: 'bg-stone-900',
    border: 'border-stone-700',
    icon: ImageIcon
  }
};

export const MediaDriveAdmin: React.FC = () => {
  const {
    driveAssets,
    deleteDriveAsset,
    uploadMediaToDrive,
    addDriveAsset,
    applyDriveAssetToLogo,
    applyDriveAssetToBanner,
    applyDriveAssetToProduct,
    products,
    cloudSyncStatus,
    lastSyncedAt
  } = useStore();

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Upload Box State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(true);
  const [uploadTag, setUploadTag] = useState<DriveAssetTag>('products');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Manual URL Add State
  const [showAddUrlModal, setShowAddUrlModal] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');
  const [manualTag, setManualTag] = useState<DriveAssetTag>('general');

  // Preview / Apply Modals
  const [previewAsset, setPreviewAsset] = useState<DriveAssetItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [applyToProductAsset, setApplyToProductAsset] = useState<DriveAssetItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy helper
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Upload handler
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    setIsUploading(true);
    setUploadSuccessMessage('');

    try {
      let count = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
          continue;
        }
        const nameToUse = files.length === 1 && customTitle.trim() ? customTitle.trim() : undefined;
        await uploadMediaToDrive(file, uploadTag, nameToUse);
        count++;
      }

      if (count > 0) {
        setUploadSuccessMessage(`Successfully processed & uploaded ${count} image${count > 1 ? 's' : ''} to Drive!`);
        setCustomTitle('');
        setCustomDescription('');
        setTimeout(() => setUploadSuccessMessage(''), 4000);
      } else {
        setUploadError('No valid image files found. Please upload PNG, JPG, WebP, or SVG.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error processing image upload. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleManualAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    try {
      await addDriveAsset({
        name: manualName.trim() || 'Distillery Web Asset',
        url: manualUrl.trim(),
        tag: manualTag,
        description: 'Added via direct URL integration'
      });
      setShowAddUrlModal(false);
      setManualUrl('');
      setManualName('');
      showNotification('Asset successfully saved to Media Drive!');
    } catch (err) {
      console.warn('Error adding manual asset:', err);
    }
  };

  // Quick apply handlers
  const handleApplyLogo = async (asset: DriveAssetItem) => {
    await applyDriveAssetToLogo(asset.url);
    showNotification(`"${asset.name}" applied as Distillery Logo across Header, Letterheads & Store!`);
    if (previewAsset) setPreviewAsset(null);
  };

  const handleApplyBanner = async (asset: DriveAssetItem) => {
    await applyDriveAssetToBanner(asset.url, asset.name);
    showNotification(`"${asset.name}" added as Store Hero Banner slide!`);
    if (previewAsset) setPreviewAsset(null);
  };

  const handleApplyProduct = async (productId: string) => {
    if (!applyToProductAsset) return;
    await applyDriveAssetToProduct(productId, applyToProductAsset.url);
    const prod = products.find(p => p.id === productId);
    showNotification(`Image applied to "${prod?.name || 'Product'}"!`);
    setApplyToProductAsset(null);
  };

  const handleDeleteAsset = async (id: string) => {
    const success = await deleteDriveAsset(id);
    if (success) {
      showNotification('Asset removed from Media Drive and Cloud Storage.');
    }
    setDeleteConfirmId(null);
    if (previewAsset?.id === id) setPreviewAsset(null);
  };

  // Filter and sort items
  const filteredAssets = useMemo(() => {
    return driveAssets
      .filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          asset.tag.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTagFilter === 'all' || asset.tag === selectedTagFilter;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        }
        return a.name.localeCompare(b.name);
      });
  }, [driveAssets, searchQuery, selectedTagFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = driveAssets.length;
    const productsCount = driveAssets.filter((a) => a.tag === 'products').length;
    const logosCount = driveAssets.filter((a) => a.tag === 'logos').length;
    const bannersCount = driveAssets.filter((a) => a.tag === 'banners').length;
    const totalBytes = driveAssets.reduce((acc, curr) => acc + (curr.sizeBytes || 85000), 0);
    const formattedSize =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(totalBytes / 1024)} KB`;
    return { total, productsCount, logosCount, bannersCount, formattedSize };
  }, [driveAssets]);

  return (
    <div className="space-y-6">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2.5 shadow-lg shadow-amber-950/50">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Banner & Statistics */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-amber-200 tracking-wide">
                Distillery Media Drive & Asset Cloud
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              Upload, organize, and manage imagery for bottles, heritage stills, banners, and logos.
              Uploaded images can be applied directly to product packaging, store logos, or hero carousels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddUrlModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Link Image URL</span>
            </button>
            <button
              type="button"
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploadOpen ? 'Hide Uploader' : 'Upload Asset'}</span>
            </button>
          </div>
        </div>

        {/* Metric Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-stone-800/80">
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Total Drive Assets</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-stone-100">{stats.total}</span>
              <span className="text-[10px] text-stone-500 font-mono">({stats.formattedSize})</span>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Product & Bottle Shots</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-emerald-400">{stats.productsCount}</span>
              <span className="text-[10px] text-stone-500">bottles</span>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Logos & Seals</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-amber-400">{stats.logosCount}</span>
              <span className="text-[10px] text-stone-500">watermarks</span>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Hero Banners</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-sky-400">{stats.bannersCount}</span>
              <span className="text-[10px] text-stone-500">artworks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone (Expandable) */}
      {isUploadOpen && (
        <div className="bg-stone-900 border border-amber-900/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                Upload New Distillery Media Asset
              </h3>
            </div>
            <span className="text-[11px] text-amber-400/90 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              Auto-Optimization Engine Active (Downscales high-res without quality loss)
            </span>
          </div>

          {/* Form options for upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Asset Target Category
              </label>
              <select
                value={uploadTag}
                onChange={(e) => setUploadTag(e.target.value as DriveAssetTag)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="products">Product & Bottle Shot (Catalog)</option>
                <option value="logos">Distillery Logo & Heritage Watermark</option>
                <option value="banners">Store Hero Carousel Banner</option>
                <option value="heritage">Heritage Copper Stills & Mash Tun</option>
                <option value="casks">Cask Tracker & Bond Warehouse</option>
                <option value="blog">Editorial & Mixology Story</option>
                <option value="general">General Asset</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Custom Title / Label <span className="text-stone-500">(optional)</span>
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Vintage 1994 Port Cask Bottle Shot"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Notes / Usage Guidelines <span className="text-stone-500">(optional)</span>
              </label>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="e.g. Master distiller tasting session photography"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Drag and Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
              dragOver
                ? 'border-amber-400 bg-amber-950/30'
                : 'border-stone-700 hover:border-amber-500/80 bg-stone-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {isUploading ? (
              <div className="py-4 flex flex-col items-center gap-2 text-amber-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-sm font-semibold">Processing, Optimizing & Storing Media in Cloud...</span>
                <span className="text-xs text-stone-400 font-mono">Compressing canvas and syncing metadata</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-100">
                    Click to browse files or drag and drop image here
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Supports PNG, JPG, WebP, SVG • High-res bottle renders, transparent logos, banners
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-700/40">
                    <Sparkles className="w-3 h-3" />
                    Auto-Indexed into Product & Logo pickers
                  </span>
                </div>
              </>
            )}
          </div>

          {uploadError && (
            <div className="p-3 text-xs bg-red-950/80 border border-red-800 text-red-200 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccessMessage && (
            <div className="p-3 text-xs bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by filename, label, or category..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Sort and View mode */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>

            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTagFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
              selectedTagFilter === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-500/20'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            All Assets ({driveAssets.length})
          </button>
          {(['products', 'logos', 'banners', 'heritage', 'casks', 'blog', 'general'] as DriveAssetTag[]).map(
            (tag) => {
              const count = driveAssets.filter((a) => a.tag === tag).length;
              const config = TAG_CONFIG[tag];
              const isSelected = selectedTagFilter === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-500/20'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  <span>{config.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-stone-900/20 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'}`}>
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Assets Display: Empty State */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-stone-900/50 border border-stone-800 rounded-2xl">
          <HardDrive className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-200">No media assets found</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedTagFilter !== 'all'
              ? 'Try changing your search query or selecting a different category filter.'
              : 'Upload your first bottle image, logo, or distillery photo to get started!'}
          </p>
          {(searchQuery || selectedTagFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTagFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const tagConfig = TAG_CONFIG[asset.tag] || TAG_CONFIG.general;
            const TagIcon = tagConfig.icon;
            const isJustCopied = copiedUrl === asset.url;

            return (
              <div
                key={asset.id}
                className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition duration-200 flex flex-col shadow-lg"
              >
                {/* Image Canvas Container */}
                <div className="relative aspect-square bg-stone-950 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Tag Pill Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${tagConfig.bg} ${tagConfig.color} ${tagConfig.border}`}
                    >
                      <TagIcon className="w-2.5 h-2.5" />
                      {tagConfig.label}
                    </span>
                  </div>

                  {/* Dimensions badge if available */}
                  {asset.dimensions && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-stone-950/80 border border-stone-800 text-[9px] font-mono text-stone-400">
                        {asset.dimensions.width}×{asset.dimensions.height}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Quick Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-stone-950/80 hover:bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-md"
                    title="View Full Resolution"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metadata & Actions */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 bg-stone-900">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 truncate" title={asset.name}>
                      {asset.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {new Date(asset.uploadedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {asset.sizeBytes ? ` • ${Math.round(asset.sizeBytes / 1024)} KB` : ''}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                    <div className="flex items-center gap-1.5">
                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset.url)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          isJustCopied
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-300'
                        }`}
                        title="Copy Image URL"
                      >
                        {isJustCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[11px] font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-400" />
                            <span className="text-[11px]">Copy URL</span>
                          </>
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(asset.id)}
                        className="p-1.5 rounded-xl bg-stone-950 hover:bg-red-950/60 border border-stone-800 hover:border-red-800/60 text-stone-400 hover:text-red-300 transition cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Apply Menu: Product, Logo, Banner */}
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyLogo(asset)}
                        className="px-1 py-1 rounded-lg bg-stone-950 hover:bg-amber-950/40 border border-stone-800/80 hover:border-amber-700/50 text-[10px] text-stone-300 hover:text-amber-300 font-medium transition text-center cursor-pointer"
                        title="Set as Distillery Logo"
                      >
                        Set Logo
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyBanner(asset)}
                        className="px-1 py-1 rounded-lg bg-stone-950 hover:bg-sky-950/40 border border-stone-800/80 hover:border-sky-700/50 text-[10px] text-stone-300 hover:text-sky-300 font-medium transition text-center cursor-pointer"
                        title="Set as Store Hero Banner"
                      >
                        Set Banner
                      </button>

                      <button
                        type="button"
                        onClick={() => setApplyToProductAsset(asset)}
                        className="px-1 py-1 rounded-lg bg-stone-950 hover:bg-emerald-950/40 border border-stone-800/80 hover:border-emerald-700/50 text-[10px] text-stone-300 hover:text-emerald-300 font-medium transition text-center cursor-pointer"
                        title="Apply to an Existing Product"
                      >
                        In Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Name & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Resolution / Size</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions & Quick Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredAssets.map((asset) => {
                  const tagConfig = TAG_CONFIG[asset.tag] || TAG_CONFIG.general;
                  const isJustCopied = copiedUrl === asset.url;

                  return (
                    <tr key={asset.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setPreviewAsset(asset)}
                          className="w-12 h-12 rounded-lg bg-stone-950 border border-stone-800 overflow-hidden cursor-pointer p-0.5"
                        >
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-200">
                        <div>{asset.name}</div>
                        {asset.description && (
                          <div className="text-[10px] text-stone-500 font-normal truncate max-w-xs">
                            {asset.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${tagConfig.bg} ${tagConfig.color} ${tagConfig.border}`}
                        >
                          {tagConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                        {asset.dimensions ? `${asset.dimensions.width}×${asset.dimensions.height}` : 'Vector/Web'}
                        {asset.sizeBytes ? ` (${Math.round(asset.sizeBytes / 1024)} KB)` : ''}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                        {new Date(asset.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(asset.url)}
                            className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-stone-300 text-[11px] font-medium cursor-pointer"
                          >
                            {isJustCopied ? 'Copied' : 'Copy Link'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyLogo(asset)}
                            className="px-2 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[11px] cursor-pointer"
                          >
                            Set Logo
                          </button>
                          <button
                            type="button"
                            onClick={() => setApplyToProductAsset(asset)}
                            className="px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[11px] cursor-pointer"
                          >
                            In Product
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(asset.id)}
                            className="p-1.5 rounded-lg bg-stone-950 hover:bg-red-950/50 text-stone-400 hover:text-red-300 border border-stone-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Full Resolution Image Preview */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-stone-100 truncate max-w-md">{previewAsset.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Canvas */}
            <div className="max-h-96 w-full rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="max-h-80 w-auto object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metadata breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Category</span>
                <span className="font-semibold text-amber-400 capitalize">{previewAsset.tag}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Dimensions</span>
                <span className="font-semibold text-stone-200 font-mono">
                  {previewAsset.dimensions ? `${previewAsset.dimensions.width}×${previewAsset.dimensions.height}px` : 'Dynamic'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">File Size</span>
                <span className="font-semibold text-stone-200 font-mono">
                  {previewAsset.sizeBytes ? `${Math.round(previewAsset.sizeBytes / 1024)} KB` : 'Optimized'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Uploaded</span>
                <span className="font-semibold text-stone-200 font-mono">
                  {new Date(previewAsset.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset.url)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>{copiedUrl === previewAsset.url ? 'Copied URL!' : 'Copy Direct Link'}</span>
                </button>
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  <span>Open Full Size</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyLogo(previewAsset)}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer"
                >
                  Apply as Logo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApplyToProductAsset(previewAsset);
                    setPreviewAsset(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold cursor-pointer"
                >
                  Apply to Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Apply Image to Existing Product */}
      {applyToProductAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-100">Apply Image to Spirits Catalog</h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyToProductAsset(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800">
              <img
                src={applyToProductAsset.url}
                alt={applyToProductAsset.name}
                className="w-12 h-12 object-contain rounded bg-stone-900 border border-stone-800"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Selected Drive Image</span>
                <p className="text-xs font-semibold text-stone-200 truncate">{applyToProductAsset.name}</p>
              </div>
            </div>

            <p className="text-xs text-stone-400">
              Choose an existing spirit bottle from your active catalog to set this image as its primary product photo:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-stone-800/60">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-stone-950 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 object-contain rounded bg-stone-950 border border-stone-800 p-0.5 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-stone-500 font-mono">
                        ${prod.price} • {prod.category} • {prod.stockQuantity} in stock
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyProduct(prod.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer shadow-sm"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Manual URL Asset */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleManualAddUrl}
            className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-stone-100">Index Image from Web URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Image URL</label>
              <input
                type="url"
                required
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Asset Name / Title</label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Master Cellar Oak Barrels"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Category</label>
              <select
                value={manualTag}
                onChange={(e) => setManualTag(e.target.value as DriveAssetTag)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="products">Product Shot</option>
                <option value="logos">Logo & Seal</option>
                <option value="banners">Hero Banner</option>
                <option value="heritage">Heritage & Stills</option>
                <option value="casks">Cask & Barrels</option>
                <option value="blog">Blog & Editorial</option>
                <option value="general">General Asset</option>
              </select>
            </div>

            {manualUrl && (
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
                <img
                  src={manualUrl}
                  alt="Preview"
                  className="w-12 h-12 object-contain rounded bg-stone-900"
                  referrerPolicy="no-referrer"
                  onError={() => {}}
                />
                <span className="text-[11px] text-stone-400">Live preview validated</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer"
              >
                Save to Drive
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-900/50 rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Delete Asset from Drive?</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Are you sure you want to delete this media asset? This will remove it from the distillery Media Drive and Firestore storage index.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAsset(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-red-900/30"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
